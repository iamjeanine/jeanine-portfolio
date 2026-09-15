import React, { useEffect, useRef, useState } from 'react';
import { useMotionPaused } from './chapter';
const origin = window.location.origin;
export default function WorldStudyPreview({ storyWords = false }: { storyWords?: boolean }) {
 const frame = useRef<HTMLIFrameElement>(null);
 const [height, setHeight] = useState<number>();
 const [visible, setVisible] = useState(false);
 const paused = useMotionPaused();
 const send = () => frame.current?.contentWindow?.postMessage({type:'world-preview-state',visible,paused},origin);
 useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= .15), {threshold:[0,.15]});
  if(frame.current)observer.observe(frame.current);
  const resize = (event:MessageEvent) => {if(event.origin===origin&&event.source===frame.current?.contentWindow&&event.data?.type==='world-preview-height'&&Number.isFinite(event.data.height))setHeight(Math.max(240,Math.min(1800,event.data.height)));};
  window.addEventListener('message',resize);
  return () => {observer.disconnect();window.removeEventListener('message',resize);};
 }, []);
 useEffect(send,[visible,paused]);
 return <iframe ref={frame} title="Visual Audiobooks: a story beyond the Duo screen" src={`${origin}/duo-study/world/?embed=1${storyWords ? "&words=grove" : ""}`} onLoad={send} style={{display:'block',width:'100%',height:height??'min(76vw, 740px)',border:0,background:'var(--ink-deep)'}} />;
}
