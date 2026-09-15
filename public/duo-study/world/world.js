// Local editorial presentation. Existing illustration and ruled subject contour only.
// Device projection follows the approved cover-opening study, with one continuous inner display.
const scene=document.querySelector('.scene'),canvas=document.querySelector('#world'),ctx=canvas.getContext('2d'),surface=document.querySelector('.device-touch');
const pause=document.querySelector('#pause'),replay=document.querySelector('#replay'),status=document.querySelector('#state');
const make=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
const screen=make(1452,1036),sc=screen.getContext('2d'),mask=make(1452,1036),mc=mask.getContext('2d'),layer=make(1452,1036),lc=layer.getContext('2d');
const girl=make(860,1100),gc=girl.getContext('2d'),captured=make(1452,1036),cc=captured.getContext('2d');let hasCapture=false;
const focusLayer=make(726,518),fc=focusLayer.getContext('2d');
const q=new URLSearchParams(location.search),still=q.has('still')?Math.max(0,Number(q.get('still'))||0):null;
const storyWords=q.get('words')==='grove';
const display=storyWords?make(1452,1036):null,dc=display?.getContext('2d');
if(storyWords)canvas.setAttribute('aria-label',canvas.getAttribute('aria-label')+' The words stay: You drive slow through the orange groves.');
const embedded=q.has('embed');let hostVisible=!embedded,hostPaused=false,localVisible=true;
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let images,ready=false,mobile=false,t=still??0,last=0,raf=0,visible=true,paused=false,manual=false,active=null,prev=null,baseIndex=0,distance=0,blend=0,finishing=false;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},random=n=>{const x=Math.sin(n*91.719+13*17.137)*43758.5453;return x-Math.floor(x)};
const spots=Array.from({length:30},(_,i)=>({x:random(i*3+1),y:random(i*3+2),delay:random(i*3+3)*.72}));

function polygon(c,points){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath()}
function paper(c,x,y,w,h,seed,color){const points=[];for(let i=0;i<=20;i++)points.push([x+w*i/20,y+(random(seed+i)-.5)*14]);for(let i=1;i<=12;i++)points.push([x+w+(random(seed+30+i)-.5)*10,y+h*i/12]);for(let i=1;i<=20;i++)points.push([x+w-w*i/20,y+h+(random(seed+50+i)-.5)*13]);for(let i=1;i<=12;i++)points.push([x+(random(seed+80+i)-.5)*10,y+h-h*i/12]);polygon(c,points);c.fillStyle=color;c.fill();return points}
function buildGirl(){gc.drawImage(images.girl,0,0)}
function dab(c,x,y,r){const g=c.createRadialGradient(x,y,r*.68,x,y,r);g.addColorStop(0,'#000');g.addColorStop(1,'#0000');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)}
function compose(progress=0){sc.clearRect(0,0,1452,1036);sc.drawImage(hasCapture?captured:(baseIndex?images.charcoal:images.open),0,0);lc.clearRect(0,0,1452,1036);lc.drawImage(baseIndex?images.open:images.charcoal,0,0);lc.globalCompositeOperation='destination-in';lc.drawImage(mask,0,0);lc.globalCompositeOperation='source-over';sc.save();sc.beginPath();sc.roundRect(30,30,1388,976,84);sc.clip();sc.drawImage(layer,0,0);if(progress){sc.globalAlpha=progress;sc.drawImage(baseIndex?images.open:images.charcoal,0,0)}sc.restore()}
function autoScreen(time){
 const returning=time>=6.6;baseIndex=returning?1:0;hasCapture=false;mc.clearRect(0,0,1452,1036);
 const start=returning?6.6:2.6,duration=returning?1.6:2.65,elapsed=time-start;
 let cue=null;
 if(elapsed>0){
  const progress=clamp(elapsed/duration),p=clamp(elapsed/(returning?.95:1.5));
  for(let i=0;i<=Math.ceil(p*45);i++){let k=ease(i/45);if(returning)k=1-k;dab(mc,1270-840*k,190+490*k+Math.sin(k*Math.PI)*55,145)}
  const spread=clamp((progress-.08)/.92);for(const spot of spots){const r=clamp((spread-spot.delay)/.28)*1452*.64;if(r>0)dab(mc,30+spot.x*1388,30+spot.y*976,r)}
  compose(progress>=1?1:0);
  if(!returning&&elapsed<2.3)cue={x:1270-840*ease(p),y:190+490*ease(p)+Math.sin(ease(p)*Math.PI)*55,alpha:1-ease((elapsed-1.5)/.8)};
 }else compose();
 if(time>=2.2&&time<2.6)cue={x:1270,y:190,alpha:ease((time-2.2)/.3)};
 if(cue){sc.save();sc.globalAlpha=cue.alpha;sc.fillStyle='#ffffff38';sc.strokeStyle='#fff';sc.lineWidth=4;sc.shadowColor='#0008';sc.shadowBlur=9;sc.beginPath();sc.arc(cue.x,cue.y,25,0,Math.PI*2);sc.fill();sc.stroke();sc.restore()}
}
function pose(){const k=reduced.matches?1:ease(t/1.6);return {hinge:mobile?360:1035,cy:mobile?479:455,scale:mobile?.61:.94,theta:Math.PI*(.65+.07*k),angle:-.10}}
// Focus follows the same opening progress as the physical left plane.
// Only the inner illustration softens; the frame and right display stay crisp.
function leftFocus(){
 if(manual||reduced.matches||t>=1.6)return;
 const focus=ease(t/1.6),radius=22*(1-focus);
 fc.clearRect(0,0,726,518);fc.save();fc.filter=`blur(${radius}px)`;fc.drawImage(screen,0,0,726,518);fc.restore();
 fc.globalCompositeOperation='destination-in';const feather=fc.createLinearGradient(320,0,363,0);feather.addColorStop(0,'#000');feather.addColorStop(1,'#0000');fc.fillStyle=feather;fc.fillRect(0,0,726,518);fc.globalCompositeOperation='source-over';
 sc.save();sc.beginPath();sc.roundRect(30,30,1388,976,84);sc.clip();sc.drawImage(focusLayer,0,0,1452,1036);sc.restore();
}
// Keep typography separate from the picture captured for subsequent brush gestures.
function composeStoryWords(){
 dc.clearRect(0,0,1452,1036);dc.drawImage(screen,0,0);
 const alpha=manual||reduced.matches?1:ease((t-1.05)/.55);if(!alpha)return;
 dc.save();dc.beginPath();dc.roundRect(30,30,1388,976,84);dc.clip();dc.globalAlpha=alpha;
 const shade=dc.createRadialGradient(1060,250,20,1060,250,390);
 shade.addColorStop(0,'rgba(17,15,14,.58)');shade.addColorStop(.65,'rgba(17,15,14,.29)');shade.addColorStop(1,'rgba(17,15,14,0)');
 dc.fillStyle=shade;dc.fillRect(726,30,696,720);
 dc.textBaseline='alphabetic';dc.textAlign='left';dc.letterSpacing='-1px';dc.shadowColor='rgba(15,13,11,.85)';dc.shadowBlur=12;dc.shadowOffsetY=2;
 dc.fillStyle='#f2e6ce';dc.font='78px "Iowan Old Style",Palatino,serif';dc.fillText('You drive slow',786,185);
 dc.fillStyle='#e6bc74';dc.font='italic 53px "Iowan Old Style",Palatino,serif';dc.fillText('through the',790,255);
 dc.fillStyle='#f2e6ce';dc.font='60px "Iowan Old Style",Palatino,serif';dc.fillText('orange groves.',790,327);
 dc.restore();
}
function device(){const texture=storyWords?display:screen,p=pose(),half=726,depth=5200,co=Math.cos(p.theta),si=Math.sin(p.theta);ctx.save();ctx.translate(p.hinge,p.cy);ctx.rotate(p.angle);ctx.scale(p.scale,p.scale);
 // 2x source renders to half dimensions. Preserve the reference's bezel and hinge.
 ctx.shadowColor='#0009';ctx.shadowBlur=35;ctx.shadowOffsetY=24;
 ctx.drawImage(texture,726,0,726,1036,0,-259,363,518);ctx.shadowColor='transparent';
 for(let u=0;u<363;u++){const a=depth/(depth-si*u*2),b=depth/(depth-si*(u+1)*2),x=co*u*a,x2=co*(u+1)*b;ctx.drawImage(texture,(363-u-1)*2,0,2,1036,Math.min(x,x2),-259*a,Math.abs(x2-x)+.6,518*a)}
 const fold=ctx.createLinearGradient(-18,0,15,0);fold.addColorStop(0,'#0000');fold.addColorStop(.5,'#0005');fold.addColorStop(1,'#0000');ctx.fillStyle=fold;ctx.fillRect(-18,-249,33,498);ctx.restore()}
function draw(){if(!ready)return;const W=mobile?600:1440,H=mobile?730:820;ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.clearRect(0,0,W,H);const entry=reduced.matches?1:ease(t/.9);
 ctx.save();if(mobile){ctx.translate(-25,10);ctx.scale(.69,.69)}else ctx.translate(35,30);
 // Red and cream slips use the existing telling's torn-paper construction.
 ctx.save();ctx.translate(-35*(1-entry),12*(1-entry));ctx.rotate(-.075);paper(ctx,100,205,635,310,21,'#a64230');ctx.restore();
 ctx.save();ctx.translate(90,360);ctx.rotate(.085);paper(ctx,0,0,650,250,310,'#ded5bd');ctx.save();ctx.clip();ctx.globalAlpha=1;ctx.filter='contrast(1.65)';ctx.drawImage(images.home,730,440,620,300,0,0,650,250);ctx.restore();ctx.restore();
 ctx.save();ctx.translate(80,35);ctx.rotate(-.035);ctx.drawImage(girl,0,0,560,716);ctx.restore();
 ctx.save();ctx.translate(305,640);ctx.rotate(-.025);paper(ctx,0,0,400,65,510,'#e7ddc4');ctx.strokeStyle='#a64230';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(18,36);ctx.lineTo(385,36);ctx.stroke();ctx.restore();ctx.restore();
 if(!manual)autoScreen(t);else compose(blend);leftFocus();sc.save();sc.globalCompositeOperation="destination-in";sc.beginPath();sc.roundRect(4,3,1444,1030,108);sc.fill();sc.restore();if(storyWords)composeStoryWords();device();}
function resize(){mobile=matchMedia('(max-width:700px)').matches;canvas.width=mobile?1200:2160;canvas.height=mobile?1460:1230;draw()}
function tick(now){if(!ready||!visible||document.hidden||paused||hostPaused){raf=0;last=0;return}const dt=last?Math.min(.05,(now-last)/1000):0;last=now;if(finishing){blend=Math.min(1,blend+dt/0.6);if(blend===1){baseIndex=1-baseIndex;hasCapture=false;blend=0;mc.clearRect(0,0,1452,1036);finishing=false}}else if(!manual&&still===null&&!reduced.matches)t=Math.min(8.8,t+dt);draw();if(finishing||(!manual&&t<8.8&&still===null&&!reduced.matches))raf=requestAnimationFrame(tick);else{raf=0;last=0;pause.textContent='Pause';pause.disabled=true}}
function resume(){if(!raf&&ready&&visible&&!document.hidden&&!paused&&!hostPaused){last=0;raf=requestAnimationFrame(tick)}}
function stop(){cancelAnimationFrame(raf);raf=0;last=0}
function point(e){const r=canvas.getBoundingClientRect(),W=mobile?600:1440,H=mobile?730:820,p=pose();let x=(e.clientX-r.left)/r.width*W-p.hinge,y=(e.clientY-r.top)/r.height*H-p.cy;const a=Math.cos(-p.angle),b=Math.sin(-p.angle),rx=(x*a-y*b)/p.scale,ry=(x*b+y*a)/p.scale;let sx,sy;if(rx>=0){sx=726+rx*2;sy=(ry+259)*2}else{const co=Math.cos(p.theta),si=Math.sin(p.theta),u=rx/(co+rx*si*2/5200),f=5200/(5200-si*u*2);sx=726-u*2;sy=(ry/f+259)*2}return{x:sx,y:sy}}
function takeover(){if(manual)return;stop();cc.clearRect(0,0,1452,1036);cc.drawImage(screen,0,0);hasCapture=true;baseIndex=t>=5.25&&t<7.4?1:0;manual=true;mc.clearRect(0,0,1452,1036);pause.disabled=true;draw()}
function brush(p){if(prev){const d=Math.hypot(p.x-prev.x,p.y-prev.y);distance+=d;const n=Math.max(1,Math.ceil(d/18));for(let i=1;i<=n;i++)dab(mc,prev.x+(p.x-prev.x)*i/n,prev.y+(p.y-prev.y)*i/n,150)}else dab(mc,p.x,p.y,150);prev=p;draw()}
surface.addEventListener('pointerdown',e=>{if(!ready||active!==null||e.button!==0)return;const p=point(e);if(p.x<25||p.x>1427||p.y<25||p.y>1011)return;takeover();if(finishing){cc.clearRect(0,0,1452,1036);cc.drawImage(screen,0,0);hasCapture=true;finishing=false;blend=0;mc.clearRect(0,0,1452,1036)}active=e.pointerId;distance=0;prev=null;surface.setPointerCapture(active);brush(p)});
surface.addEventListener('pointermove',e=>{if(e.pointerId===active)brush(point(e))});
function finish(){if(reduced.matches){baseIndex=1-baseIndex;hasCapture=false;mc.clearRect(0,0,1452,1036);draw()}else{finishing=true;blend=0;paused=false;resume()}status.textContent='The picture has changed.'}
function release(e){if(e.pointerId!==active)return;active=null;prev=null;if(surface.hasPointerCapture(e.pointerId))surface.releasePointerCapture(e.pointerId);if(distance>100&&e.type!=='pointercancel')finish()}
surface.addEventListener('pointerup',release);surface.addEventListener('pointercancel',release);surface.addEventListener('click',e=>{if(e.detail===0&&ready){takeover();finish()}});
pause.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'Resume':'Pause';pause.setAttribute('aria-pressed',String(paused));if(paused)stop();else resume()});
replay.addEventListener('click',()=>{if(still!==null){const url=new URL(location.href);url.searchParams.delete('still');location.href=url.href;return}stop();t=0;manual=false;hasCapture=false;paused=false;finishing=false;blend=0;pause.disabled=false;pause.textContent='Pause';pause.setAttribute('aria-pressed','false');draw();resume()});
new ResizeObserver(resize).observe(scene);new IntersectionObserver(entries=>{localVisible=entries[0].isIntersecting;visible=localVisible&&hostVisible;if(visible)resume();else stop()},{threshold:0}).observe(scene);
window.addEventListener('message',event=>{if(!embedded||event.source!==parent||event.origin!==location.origin||event.data?.type!=='world-preview-state')return;hostVisible=!!event.data.visible;hostPaused=!!event.data.paused;visible=localVisible&&hostVisible;if(visible&&!hostPaused)resume();else stop()});
if(embedded)new ResizeObserver(()=>parent.postMessage({type:'world-preview-height',height:Math.ceil(document.body.getBoundingClientRect().height)},location.origin)).observe(document.body);
document.addEventListener('visibilitychange',()=>document.hidden?stop():resume());reduced.addEventListener('change',()=>{if(reduced.matches){stop();t=8.8;draw()}else resume()});window.addEventListener('pagehide',stop);
async function load(src){const i=new Image();i.crossOrigin='anonymous';i.src=src;await i.decode();return i}
Promise.all([load('https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-World-Girl.png'),load('https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-Duo-Open.png'),load('https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-Duo-Charcoal.png'),load('https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-Duo-Pieced-Together.png')]).then(([girl,open,charcoal,home])=>{images={girl,open,charcoal,home};buildGirl();ready=true;surface.disabled=false;scene.classList.add('ready');if(reduced.matches)t=8.8;resize();if(still!==null||reduced.matches){pause.disabled=true;draw()}else resume()}).catch(()=>{scene.querySelector('.loading').textContent='The artwork could not load. Select Replay to try again.';replay.onclick=()=>location.reload()});
