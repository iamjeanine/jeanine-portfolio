/**
 * Canvas pipeline for the Signal hero: a live long-exposure treatment of
 * the Unstill archival footage, with time split across two seed-tinted
 * layers (a long-memory accumulator and a short-memory one, drifting
 * slightly out of register) composited additively over near-black.
 *
 * The video bucket (storage.googleapis.com/jeanine-portfolio-video) serves
 * no CORS headers, so the media taints every canvas here. That is fine
 * because this pipeline is write-only: drawImage, fillRect, and composite
 * operations only. Never add getImageData, toDataURL, or a WebGL texture
 * upload to this file — all three throw on tainted canvases.
 */

type Source = HTMLVideoElement | HTMLImageElement;

const mulberry32 = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/* Hue pairs the seed picks between: one dominant, one counter, far enough
   apart that the two time-layers read as different light. Saturation stays
   under 80% everywhere so the tints sit inside the archival material
   instead of on top of it. */
const PALETTES: [number, number][] = [
  [36, 196],
  [204, 18],
  [344, 168],
  [52, 214],
  [164, 318],
  [266, 42],
];

const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

interface Params {
  tintA: string;
  tintA2: string;
  tintB: string;
  tintB2: string;
  angleA: number;
  angleB: number;
  weightA: number;
  weightB: number;
  alphaA: number;
  alphaB: number;
  decayA: number;
  decayB: number;
  panAmpA: number;
  panAmpB: number;
  panPeriodA: number;
  panPeriodB: number;
  pulsePeriod: number;
  firstPulseAt: number;
  startOffset: number;
}

export function makeSeed(): number {
  return 1000 + Math.floor(Math.random() * 9000);
}

export class SignalEngine {
  readonly seed: number;
  /** Brighter version of the dominant tint, for the tagline's color words. */
  readonly accent: string;
  /** Fraction of the video duration to start playback from. */
  readonly startOffset: number;

  private display: HTMLCanvasElement;
  private glow: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private glowCtx: CanvasRenderingContext2D;
  private offA: HTMLCanvasElement;
  private offB: HTMLCanvasElement;
  private temp: HTMLCanvasElement;
  private params: Params;
  private source: Source | null = null;
  private raf = 0;
  private startTime = 0;
  private lastAccum = 0;
  private frameCount = 0;
  private w = 0;
  private h = 0;

  constructor(display: HTMLCanvasElement, glow: HTMLCanvasElement, seed: number) {
    this.display = display;
    this.glow = glow;
    this.seed = seed;
    const rand = mulberry32(seed);
    const [hA, hB] = PALETTES[Math.floor(rand() * PALETTES.length)];
    /* Each time-layer is tinted through a linear gradient between the two
       palette hues, at a seeded angle per layer, so color varies across
       the frame (a cool field bleeding into a hot one) instead of washing
       it uniformly. */
    this.params = {
      tintA: hsl(hA, 70, 62),
      tintA2: hsl(hB, 64, 50),
      tintB: hsl(hB, 64, 68),
      tintB2: hsl(hA, 68, 54),
      angleA: rand() * Math.PI * 2,
      angleB: rand() * Math.PI * 2,
      weightA: 0.92 + rand() * 0.08,
      weightB: 0.88 + rand() * 0.12,
      /* Long memory, fast drift: the smear only abstracts when the pan
         travels far within the accumulator's half-life. Short memory just
         reproduces the source with soft edges. */
      alphaA: 0.02 + rand() * 0.012,
      alphaB: 0.06 + rand() * 0.04,
      decayA: 0.003 + rand() * 0.003,
      decayB: 0.02 + rand() * 0.02,
      panAmpA: 24 + rand() * 20,
      panAmpB: 50 + rand() * 40,
      panPeriodA: 10 + rand() * 6,
      panPeriodB: 3 + rand() * 3,
      pulsePeriod: 24 + rand() * 16,
      firstPulseAt: 6 + rand() * 5,
      startOffset: rand(),
    };
    this.accent = hsl(hB, 58, 70);
    this.startOffset = this.params.startOffset;
    this.ctx = display.getContext('2d')!;
    this.glowCtx = glow.getContext('2d')!;
    this.offA = document.createElement('canvas');
    this.offB = document.createElement('canvas');
    this.temp = document.createElement('canvas');
    glow.width = 96;
    glow.height = 54;
  }

  setSource(source: Source) {
    this.source = source;
  }

  private gradA: CanvasGradient | null = null;
  private gradB: CanvasGradient | null = null;

  resize(cssW: number, cssH: number) {
    /* Internal resolution is capped: the output is smeared light, not
       detail, and the accumulators are the per-frame cost. */
    const scale = Math.min(1.25, window.devicePixelRatio || 1) * Math.min(1, 1400 / cssW);
    this.w = Math.max(2, Math.round(cssW * scale));
    this.h = Math.max(2, Math.round(cssH * scale));
    for (const c of [this.display, this.offA, this.offB, this.temp]) {
      c.width = this.w;
      c.height = this.h;
    }
    const tctx = this.temp.getContext('2d')!;
    const p = this.params;
    const makeGrad = (angle: number, from: string, to: string) => {
      const cx = this.w / 2;
      const cy = this.h / 2;
      const dx = (Math.cos(angle) * this.w) / 2;
      const dy = (Math.sin(angle) * this.h) / 2;
      const g = tctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
      g.addColorStop(0, from);
      g.addColorStop(1, to);
      return g;
    };
    this.gradA = makeGrad(p.angleA, p.tintA, p.tintA2);
    this.gradB = makeGrad(p.angleB, p.tintB, p.tintB2);
  }

  private sourceSize(): [number, number] {
    const s = this.source!;
    return s instanceof HTMLVideoElement
      ? [s.videoWidth, s.videoHeight]
      : [s.naturalWidth, s.naturalHeight];
  }

  private drawCover(ctx: CanvasRenderingContext2D, ox = 0, oy = 0, zoom = 1) {
    const [sw, sh] = this.sourceSize();
    if (!sw || !sh) return;
    const r = Math.max(this.w / sw, this.h / sh) * zoom;
    const dw = sw * r;
    const dh = sh * r;
    /* Grayscale at draw time so every hue on screen comes from the seeded
       tints, never from the source's own colorization. Browsers without
       canvas filters just let the source color leak through, gracefully. */
    ctx.filter = 'grayscale(1)';
    ctx.drawImage(this.source!, (this.w - dw) / 2 + ox, (this.h - dh) / 2 + oy, dw, dh);
    ctx.filter = 'none';
  }

  private accumulate(t: number, jitterA = 0, jitterB = 0) {
    const p = this.params;
    for (const [off, alpha, decay, amp, period, jitter] of [
      [this.offA, p.alphaA, p.decayA, p.panAmpA, p.panPeriodA, jitterA],
      [this.offB, p.alphaB, p.decayB, p.panAmpB, p.panPeriodB, jitterB],
    ] as [HTMLCanvasElement, number, number, number, number, number][]) {
      const ctx = off.getContext('2d')!;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = decay;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.globalAlpha = alpha;
      const phase = (t / period) * Math.PI * 2;
      /* Slow zoom wobble per layer, out of phase with the pan: with a
         still source this is what keeps the light moving; with video it
         just deepens the smear. */
      const zoom = 1.09 + 0.08 * Math.sin(phase * 0.6 + amp);
      const ox = Math.sin(phase) * amp + jitter;
      const oy = Math.cos(phase * 0.7) * amp * 0.5 + jitter;
      this.drawCover(ctx, ox, oy, zoom);
      /* Mirrored echo on the fast layer: the figure double-exposes against
         itself, which abstracts a still source far more than blur can. */
      if (off === this.offB) {
        ctx.globalAlpha = alpha * 0.7;
        this.drawCover(ctx, -ox, -oy * 0.6, zoom * 1.04);
      }
      ctx.globalAlpha = 1;
    }
  }

  private pulse(t: number): number {
    const p = this.params;
    const cycle = (t - p.firstPulseAt + p.pulsePeriod) % p.pulsePeriod;
    const centered = Math.min(cycle, p.pulsePeriod - cycle);
    const tri = Math.max(0, 1 - centered / 2.2);
    return tri * tri * 0.17;
  }

  private composite(t: number) {
    const p = this.params;
    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#060606';
    ctx.fillRect(0, 0, this.w, this.h);
    const tctx = this.temp.getContext('2d')!;
    for (const [off, tint, weight] of [
      [this.offA, this.gradA!, p.weightA],
      [this.offB, this.gradB!, p.weightB],
    ] as [HTMLCanvasElement, CanvasGradient, number][]) {
      tctx.globalCompositeOperation = 'source-over';
      tctx.globalAlpha = 1;
      tctx.clearRect(0, 0, this.w, this.h);
      tctx.drawImage(off, 0, 0);
      tctx.globalCompositeOperation = 'multiply';
      tctx.fillStyle = tint;
      tctx.fillRect(0, 0, this.w, this.h);
      tctx.globalCompositeOperation = 'destination-in';
      tctx.drawImage(off, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = weight;
      ctx.drawImage(this.temp, 0, 0);
    }
    /* Legibility surfaces for a moment and dissolves again: the raw frame
       rises over the smear on a slow seed-timed cycle, composited as
       light (screen) so the figure emerges from the glow instead of
       sitting on it like a photograph. */
    const legible = this.pulse(t);
    if (legible > 0.005 && this.source) {
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = legible;
      this.drawCover(ctx);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  private renderGlow() {
    this.glowCtx.drawImage(this.display, 0, 0, this.glow.width, this.glow.height);
  }

  start() {
    this.stopLoop();
    this.startTime = performance.now();
    this.lastAccum = 0;
    const step = (now: number) => {
      this.raf = requestAnimationFrame(step);
      const t = (now - this.startTime) / 1000;
      const src = this.source;
      const ready =
        src && (src instanceof HTMLVideoElement ? src.readyState >= 2 : src.complete);
      if (!ready || !this.w) return;
      if (now - this.lastAccum >= 33) {
        this.lastAccum = now;
        this.accumulate(t);
      }
      this.composite(t);
      if (this.frameCount++ % 2 === 0) this.renderGlow();
    };
    this.raf = requestAnimationFrame(step);
  }

  /** Stop the loop, leaving the last composited frame on screen. */
  freeze() {
    this.stopLoop();
  }

  /** Build one treated frame from a held source (a seeked, non-playing
      video frame, or an image), for reduced motion, Pause Motion, and the
      plate variant: seeded jitter stands in for the footage's motion. */
  renderStill(source: Source) {
    this.source = source;
    if (!this.w) return;
    const rand = mulberry32(this.seed ^ 0x5f3759df);
    let jx = 0;
    let jy = 0;
    for (let i = 0; i < 28; i++) {
      jx += (rand() - 0.5) * 16;
      jy += (rand() - 0.5) * 16;
      this.accumulate(i * 0.4, jx, jy);
    }
    /* Composite at the pulse cycle's quiet point: the frozen frame must
       stay abstract, never a legible photograph at rest. */
    this.composite(this.params.firstPulseAt + this.params.pulsePeriod / 2);
    this.renderGlow();
  }

  private stopLoop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  destroy() {
    this.stopLoop();
    this.source = null;
  }
}
