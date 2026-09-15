import React, { useEffect, useRef, useState } from 'react';
import ProjectCredit from './ProjectCredit';
import ProjectEnding from './ProjectEnding';
import WorldStudyPreview from './WorldStudyPreview';
import './VisualAudiobooksProject.css';

function ReadingArtwork() {
 const artwork=useRef<HTMLElement>(null), frame=useRef<HTMLIFrameElement>(null);
 const [loadState,setLoadState]=useState<'loading'|'ready'|'error'>('loading');
 const [attempt,setAttempt]=useState(0);
 const checkArtwork=async()=>{
  const element=frame.current;
  try{
   const readingDocument:Document|null=element?.contentDocument??null;
   if(!readingDocument?.querySelector('.beat-stars'))throw new Error('Reading layout unavailable');
   await Promise.all(Array.from(readingDocument.images).map(image=>image.decode()));
   if(frame.current===element)setLoadState('ready');
  }catch{
   if(frame.current===element)setLoadState('error');
  }
 };
 const retry=()=>{setLoadState('loading');setAttempt(value=>value+1)};
 useEffect(()=>{
  const element=artwork.current;if(!element)return;
  const resize=()=>element.style.setProperty('--reader-scale',String(element.clientWidth/1452));
  const observer=new ResizeObserver(resize);observer.observe(element);resize();
  return ()=>observer.disconnect();
 },[]);
 return <figure ref={artwork} className="reading-device" aria-label="The original stars passage and night illustration within the open iPhone Duo">
  <div className="reading-device-native">
   <img src="https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-Duo-Open.png" width="1452" height="1036" loading="lazy" alt="Open iPhone Duo" />
   <iframe ref={frame} key={attempt} src={`/duo-study/reading-typeset.html?still=110&attempt=${attempt}`} title="Stars passage from the original reading layout" loading="lazy" tabIndex={-1} onLoad={checkArtwork} style={{visibility:loadState==='ready'?'visible':'hidden'}}></iframe>
  </div>
  {loadState!=='ready' && <div className="reading-load-state">
   <p role="status">{loadState==='loading'?'Loading reading layout…':'The reading layout could not load.'}</p>
   {loadState==='error' && <button type="button" onClick={retry}>Try again</button>}
  </div>}
 </figure>;
}

export default function VisualAudiobooksProject({onClose, prototypeUrl}: {onClose: () => void; prototypeUrl: string}) {
 const root=useRef<HTMLDivElement>(null), film=useRef<HTMLVideoElement>(null);
 const [filmError,setFilmError]=useState(false),[readingOpen,setReadingOpen]=useState(false);
 const readingDialog=useRef<HTMLDialogElement>(null),readingViewport=useRef<HTMLDivElement>(null),readingTrigger=useRef<HTMLButtonElement>(null);
 const openReading=()=>{stopFilm();setReadingOpen(true);readingDialog.current?.showModal()};
 const closeReading=()=>readingDialog.current?.close();
 useEffect(()=>{
  if(!readingOpen)return;
  const viewport=readingViewport.current;if(viewport)viewport.scrollLeft=Math.max(0,viewport.scrollWidth*.6-viewport.clientWidth/2);
 },[readingOpen]);
 const stopFilm=()=>film.current?.pause();
 const backToWork=(event: React.MouseEvent)=>{event.preventDefault();stopFilm();onClose()};
 const toggleFilm=async()=>{
  const video=film.current;if(!video)return;
  if(!video.paused){video.pause();return}
  try{await video.play();setFilmError(false)}catch{setFilmError(true)}
 };
 const watchFilm=()=>{film.current?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});if(film.current?.paused)void toggleFilm()};
 useEffect(()=>{
  if(!root.current)return;
  const video=film.current;
  const silence=()=>video?.pause();
  const filmVisibility=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)silence()});
  if(video)filmVisibility.observe(video);
  const hidden=()=>{if(document.hidden)silence()};
  document.addEventListener('visibilitychange',hidden);
  window.addEventListener('portfolio:silence-videos',silence);
  return ()=>{filmVisibility.disconnect();silence();document.removeEventListener('visibilitychange',hidden);window.removeEventListener('portfolio:silence-videos',silence)};
 },[]);
 return <div ref={root} className="duo-project duo-world-project">
  <button className="skip" onClick={()=>{const main=root.current?.querySelector<HTMLElement>('main');main?.focus();main?.scrollIntoView()}}>Skip to content</button>
  <header className="site-header">
   <button type="button" className="work-link" onClick={onClose}><span aria-hidden="true">←</span> Work</button>
   <a href="/#/" className="signature">Jeanine Emilia Cornillot</a>
  </header>
  <main id="duo-main" tabIndex={-1}>
    <section className="introduction measure">
      <p className="eyebrow">Ghost Mode Labs · Story system</p>
      <h1>Visual Audiobooks</h1>
      <p className="descriptor">Children’s audiobooks that redraw themselves with every listen.</p>
      <ProjectCredit projectId="visual-audiobooks" className="duo-credit" />
    </section>

    <section className="world-stage measure" aria-label="Visual Audiobooks imagined for iPhone Duo">
      <p className="world-cue">Brush across the Duo to change the picture.</p>
      <WorldStudyPreview storyWords />
    </section>
    <div className="world-premise measure">
      <p className="device-caption">Imagined for Apple’s iPhone Duo</p>
      <p className="premise">Children return to their favorite stories again and again.<br className="desktop-break" /> What if the hundredth listen looked different from the first?</p>
    </div>

    <div className="experience-actions measure">
      <p>Hear the story and change its pictures in the working prototype.</p>
      <div className="actions">
        <a className="primary" href={prototypeUrl} onClick={stopFilm} target="_blank" rel="noopener">Try the prototype <span aria-hidden="true">↗</span></a>
        <button className="text-link" type="button" onClick={watchFilm}>Watch the concept film <span aria-hidden="true">↓</span></button>
      </div>
    </div>

    <section className="film-section measure" id="film" aria-labelledby="film-heading">
      <div className="section-heading">
        <div><h2 id="film-heading">The concept film</h2></div>
        <p>74 seconds · Watch with sound</p>
      </div>
      <div className="film-wrap">
        <video ref={film} id="concept-film" onError={() => setFilmError(true)} controls playsInline preload="none" poster="https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-Dark-World-Portfolio-Poster.jpg" aria-label="Visual Audiobooks iPhone Duo concept film">
          <source src="https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-Dark-World-Portfolio-1080p.mp4" type="video/mp4" />
          <track kind="captions" src="/duo-study/captions-integrated.vtt" srcLang="en" label="English" />
        </video>

      </div>
      {filmError && <p role="status">The film could not load. You can still try the prototype.</p>}
      <p className="film-caption">From <i>The Kids’ Guidebook to the Rock</i>, an original children’s story.</p>
    </section>

    <section className="reading-section measure" id="reading" aria-labelledby="reading-heading">
      <div className="reading-copy"><p className="eyebrow">Listen or read</p><h2 id="reading-heading">Read at your own pace.</h2><p>Scroll through the story with live sound design.</p></div>
      <div className="reading-example">
        <ReadingArtwork />
        <p className="reading-caption">A still from the reading experience.</p>
        <button ref={readingTrigger} type="button" className="text-link reading-expand" aria-haspopup="dialog" onClick={openReading}>Enlarge reading layout <span aria-hidden="true">↗</span></button>
      </div>
    </section>

    <section className="about-project measure" aria-labelledby="about-heading">
      <div><h2 id="about-heading">About the prototype</h2></div>
      <div className="project-copy">
        <p>I created Visual Audiobooks and built the prototype with AI coding tools.</p>
        <p>Visual Audiobooks pairs original children’s stories with pictures that redraw themselves with every listen. Children can also drag a finger across the screen to change the pictures as they listen.</p>
        <p>Here, I’ve imagined what Visual Audiobooks could look like on Apple’s iPhone Duo.</p>
        <p>Code lets the pictures change with each listen and respond to a child’s touch. Future editions could pair illustrators with narrators, each bringing their own interpretation to the story.</p>
        <p className="next">The current demo uses a prototype voice.</p>
        <a className="text-link" href={prototypeUrl} onClick={stopFilm} target="_blank" rel="noopener">Try the prototype <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  </main>
  <dialog ref={readingDialog} className="reading-dialog" aria-labelledby="reading-dialog-title" onClose={()=>{setReadingOpen(false);readingTrigger.current?.focus()}}>
    <div className="reading-dialog-heading"><h2 id="reading-dialog-title">Words & pictures</h2><button type="button" onClick={closeReading} autoFocus>Close</button></div>
    <p id="reading-pan-hint">Scroll sideways to explore the full spread.</p>
    <div ref={readingViewport} className="reading-viewport" tabIndex={0} role="region" aria-label="Enlarged reading layout" aria-describedby="reading-pan-hint">
      {readingOpen && <div className="reading-enlarged"><ReadingArtwork /></div>}
    </div>
  </dialog>
  <footer className="measure">
    <ProjectEnding onMoreWork={backToWork} onContact={stopFilm} />
    <div className="project-notes"><p>Ghost Mode Labs</p><p>Independent device concept. Not affiliated with Apple. <br />Device opening and closing are simulated.</p></div>
  </footer>
</div>;
}
