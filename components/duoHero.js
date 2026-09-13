/* One local, silent demonstration. Three tellings of the grove return to the girl in Pieced Together.
   Reuses the film's production-derived brush mask; no live telling engines. */
export function initDuoHero(root){
 const events=new AbortController(); let disposed=false, userPaused=false;
 const listen=(target,type,handler)=>target.addEventListener(type,handler,{signal:events.signal});
 const canvas=root.querySelector('#hero-redraw'),picture=root.querySelector('#hero-picture');
 if(!canvas||!picture)return;
 const ctx=canvas.getContext('2d'),make=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
 const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)},clamp01=x=>Math.max(0,Math.min(1,x));
 const REDRAW_AT=1.4,CUE_AT=.8,ART_END=4.7,FIRST_END=2.5,SECOND_START=3,RETURN_START=6,END=8.2;
 const spread=make(1392,979),spreadCtx=spread.getContext('2d');
/* Deterministic film illustration of the production Redraw interaction.
   The brush radius, 24-point history, seeded 30-spot expansion and mask
   thresholds follow visual-audiobook-player/redraw-transition.js.
   This records a demonstrated pointer, not a real person's touch input. */
const touchMask=make(1392,979),touchLayer=make(1392,979);
const touchMC=touchMask.getContext('2d'),touchLC=touchLayer.getContext('2d');
const redrawRandom=n=>{const x=Math.sin(n*91.719+13*17.137)*43758.5453;return x-Math.floor(x)};
const redrawSpots=Array.from({length:30},(_,i)=>({x:redrawRandom(i*3+1),y:redrawRandom(i*3+2),delay:redrawRandom(i*3+3)*.72}));
function gesturePoint(p){const k=ease(p);return{x:.89+(.30-.89)*k,y:.075+(.6-.075)*k+Math.sin(k*Math.PI)*.08}}
function paintTouchMask(t){
 touchMC.clearRect(0,0,1392,979);
 const elapsed=t-REDRAW_AT;
 if(elapsed<=0)return;
 const samples=Math.min(40,Math.floor(elapsed/1.6*40));
 function spot(x,y,solid,soft,edge){const g=touchMC.createRadialGradient(x,y,0,x,y,edge);g.addColorStop(0,'#000');g.addColorStop(solid/edge,'#000');g.addColorStop(soft/edge,'#000000eb');g.addColorStop(1,'#0000');touchMC.fillStyle=g;touchMC.fillRect(x-edge,y-edge,edge*2,edge*2)}
 const scale=1392/960;
 for(let i=Math.max(0,samples-23);i<=samples;i++){const p=gesturePoint(i/40);spot(p.x*1392,p.y*979,.12*720*scale,.12*900*scale,.12*1180*scale)}
 // Integrate the production finish-rate equation against deterministic time.
 let progress=0;for(let s=0;s<Math.max(0,elapsed-.12);s+=.01)progress=Math.min(1,progress+.01*.255*(.72+.28*(1-progress)));
 for(const s of redrawSpots){const p=clamp01((progress-s.delay)/.24);if(p<=0)continue;const r=p*34+2;spot(s.x*1392,s.y*979,r*.01*1392,(r+1.8)*.01*1392,(r+4.5)*.01*1392)}
 if(elapsed>5)touchMC.fillRect(0,0,1392,979);
}
function paintGesture(t){
 if(t<CUE_AT||t>REDRAW_AT+3)return;
 spreadCtx.save();
 // A single illustrated touch cue before each automatic reveal.
 const fade=Math.min(ease((t-CUE_AT)/.3),1-ease((t-(REDRAW_AT+2.2))/.8));spreadCtx.globalAlpha=fade;
 const p=t<REDRAW_AT?{x:.89,y:.075}:gesturePoint(clamp01((t-REDRAW_AT)/1.6));
 const ring=t<REDRAW_AT?25+9*(1-ease((t-(REDRAW_AT-.6))/.45)):29;
 const x=p.x*1392,y=p.y*979;
 spreadCtx.shadowColor='#0008';spreadCtx.shadowBlur=12;spreadCtx.fillStyle='#ffffff59';spreadCtx.strokeStyle='#fff';spreadCtx.lineWidth=4;
 spreadCtx.beginPath();spreadCtx.arc(x,y,ring,0,Math.PI*2);spreadCtx.fill();spreadCtx.stroke();
 spreadCtx.shadowColor='transparent';spreadCtx.strokeStyle='#292521';spreadCtx.lineWidth=1.5;spreadCtx.beginPath();spreadCtx.arc(x,y,ring+4,0,Math.PI*2);spreadCtx.stroke();spreadCtx.restore();
}

 const alternate=new Image(),third=new Image(),home=new Image(),tellings=[picture,alternate,third,home];let ready=false,visible=false,elapsed=0,last=0,raf=0,done=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const stillValue=new URLSearchParams(location.search).get('heroStill');
 const still=stillValue===null?null:Math.max(0,Number(stillValue)||0);
 function paint(t,showGesture=true){
  const phase=t<SECOND_START?0:t<RETURN_START?1:2;
  const start=[0,SECOND_START,RETURN_START][phase],length=phase===2?END-RETURN_START:FIRST_END;
  const local=Math.max(0,t-start-.25)*ART_END/(length-.25);
  const from=tellings[phase],to=tellings[phase+1];
  ctx.clearRect(0,0,1452,1036);ctx.drawImage(from,0,0,1452,1036);
  const v=local<=REDRAW_AT?local:REDRAW_AT+(local-REDRAW_AT)*1.6;
  spreadCtx.clearRect(0,0,1392,979);
  if(v>REDRAW_AT){
   if(local>=ART_END)spreadCtx.drawImage(to,30,30,1388,976,0,0,1392,979);
   else{paintTouchMask(v);touchLC.clearRect(0,0,1392,979);touchLC.drawImage(to,30,30,1388,976,0,0,1392,979);touchLC.globalCompositeOperation='destination-in';touchLC.drawImage(touchMask,0,0);touchLC.globalCompositeOperation='source-over';spreadCtx.drawImage(touchLayer,0,0)}
  }
  if(local<ART_END&&showGesture)paintGesture(v);
  ctx.save();ctx.beginPath();ctx.roundRect(30,30,1388,976,84);ctx.clip();ctx.drawImage(spread,30,30,1388,976);ctx.restore();
 }
 function stop(){cancelAnimationFrame(raf);raf=0;last=0}
 function tick(now){
  if(disposed||userPaused||!ready||!visible||document.hidden||done||reduced.matches){stop();return}
  if(last)elapsed=Math.min(END,elapsed+(now-last)/1000);last=now;paint(elapsed);
  if(elapsed>=END){done=true;stop();hideMotion();return}raf=requestAnimationFrame(tick);
 }
 function resume(){if(disposed||userPaused||still!==null||!ready||!visible||document.hidden||done||reduced.matches||raf)return;raf=requestAnimationFrame(tick)}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].intersectionRatio>=.55;if(visible)resume();else stop()},{threshold:[0,.55,1]});observer.observe(canvas);
 listen(document,'visibilitychange',()=>document.hidden?stop():resume());
 listen(reduced,'change',()=>{if(reduced.matches){stop();if(ready&&!manual)paint(done?END:0)}else resume()});
 listen(window,'pagehide',stop);

 // Direct manipulation takes over the exact presentation state, including mid-intro.
 const surface=root.querySelector('.hero-surface');
 const base=make(1452,1036),baseCtx=base.getContext('2d');
 const mask=make(1452,1036),mc=mask.getContext('2d');
 const layer=make(1452,1036),lc=layer.getContext('2d');
 let manual=false,active=null,previous=null,distance=0,targetIndex=1,target=alternate,finishing=0,finishStart=0;
 function capture(){baseCtx.clearRect(0,0,1452,1036);baseCtx.drawImage(canvas,0,0);mc.clearRect(0,0,1452,1036)}
 function takeOver(){
  hideMotion();
  cancelAnimationFrame(finishing);finishing=0;stop();
  if(!manual){paint(still??elapsed,false);const t=still??elapsed;targetIndex=t>=END?1:t>=SECOND_START+FIRST_END?3:t>=FIRST_END?2:1;target=tellings[targetIndex];manual=true;done=true;capture()}
 }
 function compose(alpha=0){
  ctx.clearRect(0,0,1452,1036);ctx.drawImage(base,0,0);
  lc.clearRect(0,0,1452,1036);lc.drawImage(target,0,0);
  lc.globalCompositeOperation='destination-in';lc.drawImage(mask,0,0);lc.globalCompositeOperation='source-over';
  ctx.save();ctx.beginPath();ctx.roundRect(30,30,1388,976,84);ctx.clip();ctx.drawImage(layer,0,0);
  if(alpha){ctx.globalAlpha=alpha;ctx.drawImage(target,0,0)}ctx.restore();
 }
 function point(e){const r=surface.getBoundingClientRect();return {x:(e.clientX-r.left)*1452/r.width,y:(e.clientY-r.top)*1036/r.height}}
 function dab(p){const g=mc.createRadialGradient(p.x,p.y,85,p.x,p.y,155);g.addColorStop(0,'#000');g.addColorStop(1,'#0000');mc.fillStyle=g;mc.fillRect(p.x-155,p.y-155,310,310)}
 function brush(p){
  if(previous){const d=Math.hypot(p.x-previous.x,p.y-previous.y);distance+=d;const steps=Math.max(1,Math.ceil(d/22));for(let i=1;i<=steps;i++)dab({x:previous.x+(p.x-previous.x)*i/steps,y:previous.y+(p.y-previous.y)*i/steps})}
  else dab(p);
  previous=p;compose();
 }
 function complete(){
  compose(1);targetIndex=targetIndex===tellings.length-1?1:targetIndex+1;target=tellings[targetIndex];capture();finishing=0;distance=0;
 }
 function finish(){
  if(reduced.matches){complete();return}
  finishStart=performance.now();
  function frame(now){const p=clamp01((now-finishStart)/700);compose(ease(p));if(p<1)finishing=requestAnimationFrame(frame);else complete()}
  finishing=requestAnimationFrame(frame);
 }
 listen(surface,'pointerdown',e=>{
  if(!ready||active!==null||e.button!==0)return;
  const interrupted=!!finishing;takeOver();if(interrupted)capture();
  active=e.pointerId;previous=null;distance=0;surface.setPointerCapture(active);brush(point(e));
 });
 listen(surface,'pointermove',e=>{if(e.pointerId!==active)return;for(const sample of e.getCoalescedEvents?.()||[e])brush(point(sample))});
 function release(e){if(e.pointerId!==active)return;active=null;previous=null;if(surface.hasPointerCapture(e.pointerId))surface.releasePointerCapture(e.pointerId);if(distance>100&&e.type!=='pointercancel')finish()}
 listen(surface,'pointerup',release);listen(surface,'pointercancel',release);
 listen(surface,'lostpointercapture',()=>{active=null;previous=null});
 // Native button activation supplies the equivalent keyboard and assistive action.
 listen(surface,'click',e=>{if(e.detail!==0||!ready||active!==null)return;const interrupted=!!finishing;takeOver();if(interrupted)capture();finish()});
 listen(window,'pagehide',()=>cancelAnimationFrame(finishing));
 alternate.src='https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-Duo-Charcoal.png';third.src='https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-Duo-Atlas.png';home.src='https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-Duo-Pieced-Together.png';
 Promise.all(tellings.map(image=>image.decode())).then(()=>{if(disposed)return;ready=true;paint(still??0);canvas.hidden=false;surface.disabled=false;if(still!==null||reduced.matches)return;resume()}).catch(()=>{if(disposed)return;canvas.hidden=true;root.querySelector('#brush-hint').textContent='Preview unavailable. Try the working prototype below.'});
 const motion=root.querySelector('.hero-motion');
 function hideMotion(){motion.style.visibility='hidden';motion.disabled=true}
 if(still!==null||reduced.matches)hideMotion();
 listen(motion,'click',()=>{
  userPaused=!userPaused;
  motion.textContent=userPaused?'Resume animation':'Pause animation';
  motion.setAttribute('aria-pressed',String(userPaused));
  if(userPaused){stop();cancelAnimationFrame(finishing);finishing=0}else resume();
 });
 return ()=>{disposed=true;events.abort();observer.disconnect();stop();cancelAnimationFrame(finishing)};
}
