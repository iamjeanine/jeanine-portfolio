/**
 * Hero variant switch for the hero-explorations branch, read from the
 * search string (?hero=...), which HashRouter never touches: the hash
 * carries the route, so ?hero survives chapter navigation untouched.
 *
 *   ?hero=signal  treated-footage frame (default on this branch)
 *   ?hero=off     the production typographic Cover
 *   ?hero=plate   same composition on the colorized portrait still
 */
export type HeroVariant = 'signal' | 'off' | 'plate';

export function getHeroVariant(): HeroVariant {
  try {
    const v = new URLSearchParams(window.location.search).get('hero');
    if (v === 'off' || v === 'plate' || v === 'signal') return v;
  } catch {
    // Unparseable location: fall through to the branch default.
  }
  return 'signal';
}
