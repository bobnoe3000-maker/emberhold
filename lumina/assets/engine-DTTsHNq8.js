import{$ as e,$t as t,A as n,C as r,D as i,I as a,M as o,Mn as s,N as c,On as l,P as u,Q as d,R as f,S as p,W as m,X as h,Z as g,a as _,bt as v,ct as y,d as b,dn as x,dt as S,fn as C,ft as ee,hn as w,j as te,k as T,kn as E,ln as D,mn as O,o as k,r as A,st as ne,tt as re,u as j,ut as ie,wn as ae,x as oe,yn as M,yt as se}from"./three.core-VtIcmFgG.js";import{c as ce,i as le,s as ue}from"./Palette-CbagWHV4.js";import{a as N,c as de,o as P,p as fe,r as pe,t as F,u as I}from"./math-laPxC5G9.js";import{t as L}from"./GlobalUniforms-D57M0nqS.js";import{r as me}from"./own-CqfHpdoZ.js";import"./AudioSystem-CuFLuo8G.js";import"./PixelCanvas-C-4zKpyX.js";import"./PropSprites-Bl-smtXZ.js";import{o as he,s as ge}from"./sheets-DJWO8vUz.js";import"./Particles-CffLxWLx.js";import"./TileMap-J9393Kxa.js";import"./Props-BIm83vpf.js";import"./SmallProps-DIcA9WR0.js";import"./House-Bf3NgTGx.js";import{a as _e,i as ve,n as ye,r as be,t as xe}from"./logo-CwlgBESy.js";import{$ as Se,A as Ce,B as R,Ct as we,D as Te,E as Ee,G as De,H as Oe,J as ke,K as z,L as Ae,M as je,N as Me,O as Ne,P as Pe,Q as Fe,R as Ie,S as Le,St as Re,U as B,V as ze,W as Be,X as Ve,Y as He,Z as Ue,_ as We,_t as Ge,a as Ke,at as qe,b as Je,bt as Ye,c as V,ct as Xe,d as Ze,et as Qe,f as $e,ft as et,g as tt,gt as nt,h as rt,ht as it,it as at,j as ot,k as st,l as ct,lt as H,m as U,mt as W,nt as G,o as lt,ot as ut,p as K,q as dt,rt as ft,st as pt,u as mt,ut as ht,vt as gt,w as _t,wt as vt,x as yt,xt as bt,y as xt,yt as St,z as Ct}from"./core-BA-MupBt.js";import{a as wt,i as Tt,l as Et,n as Dt,o as Ot,r as kt,u as q}from"./I18n-hnOETwdO.js";import{c as At,d as J,f as jt,m as Y,p as Mt,s as Nt,t as Pt,u as Ft}from"./gilt-cFqyVcPw.js";import{n as It,t as Lt}from"./portrait-QUPw-B5U.js";import{a as Rt,c as zt,d as Bt,i as Vt,m as Ht,n as Ut,o as Wt,p as Gt,r as Kt,s as qt,t as Jt,u as Yt}from"./minimap-COOv0gbs.js";var Xt=class{constructor(){this._listeners=new Map}on(e,t){if(typeof t!=`function`)throw TypeError(`EventEmitter.on("${e}"): listener must be a function`);let n=this._listeners.get(e);return this._listeners.set(e,n?[...n,t]:[t]),()=>this.off(e,t)}off(e,t){let n=this._listeners.get(e);if(!n)return;if(t===void 0){this._listeners.delete(e);return}let r=n.findIndex(e=>e===t||e._onceOriginal===t);r<0||(n.length===1?this._listeners.delete(e):this._listeners.set(e,n.filter((e,t)=>t!==r)))}once(e,t){if(typeof t!=`function`)throw TypeError(`EventEmitter.once("${e}"): listener must be a function`);let n=this;function r(){return n.off(e,r),t.apply(this,arguments)}return r._onceOriginal=t,this.on(e,r),()=>this.off(e,r)}emit(e,t,n,r,i){let a=this._listeners.get(e);if(a===void 0)return!1;let o=arguments.length-1,s=o>4?Array.prototype.slice.call(arguments,1):null;for(let e=0;e<a.length;e++){let c=a[e];switch(o){case 0:c.call(this);break;case 1:c.call(this,t);break;case 2:c.call(this,t,n);break;case 3:c.call(this,t,n,r);break;case 4:c.call(this,t,n,r,i);break;default:c.apply(this,s)}}return!0}listeners(e){return this._listeners.get(e)??Zt}listenerCount(e){return this._listeners.get(e)?.length??0}clear(){this._listeners.clear()}},Zt=Object.freeze([]),Qt=Object.freeze({up:[`KeyW`,`ArrowUp`],down:[`KeyS`,`ArrowDown`],left:[`KeyA`,`ArrowLeft`],right:[`KeyD`,`ArrowRight`],run:[`ShiftLeft`,`ShiftRight`],confirm:[`Space`,`Enter`,`KeyF`],choose:[`Enter`,`KeyF`],cancel:[`Escape`,`Backspace`],camLeft:[`KeyQ`],camRight:[`KeyE`],zoomIn:[`KeyZ`,`Equal`],zoomOut:[`KeyX`,`Minus`],debug:[`Backquote`,`F1`],time:[`KeyT`],photo:[`KeyP`],help:[`KeyH`],weather:[`KeyR`],music:[`KeyM`],map:[`KeyN`,`Tab`]}),$t=e=>Object.fromEntries(Object.entries(e).map(([e,t])=>[e,[...t]]));function en(e){if(!e||e.nodeType!==1)return!1;if(e.isContentEditable)return!0;let t=e.tagName;if(t===`TEXTAREA`||t===`SELECT`)return!0;if(t===`INPUT`){let t=(e.type||`text`).toLowerCase();return![`button`,`checkbox`,`radio`,`submit`,`reset`,`image`,`color`,`file`,`range`].includes(t)}return!1}var tn=class{constructor(e=window,t={}){this.target=e,this.enabled=!0,this.bindings=$t(Qt),this.wheelIgnoreSelector=t.wheelIgnoreSelector??`.lil-gui, input, textarea, select, [contenteditable], [data-input-ignore]`,this.wheelDelta=0,this.pointer={x:0,y:0,down:!1,buttons:0,inside:!1},this._down=new Set,this._pressed=new Set,this._released=new Set,this._move={x:0,y:0},this._boundCodes=new Set,this._boundCacheKey=``,this.lastDevice=`keyboard`,this._mouseTarget=null,this._mouseDown=new Set,this._onKeyDown=this._onKeyDown.bind(this),this._onKeyUp=this._onKeyUp.bind(this),this._onBlur=this._onBlur.bind(this),this._onVisibility=this._onVisibility.bind(this),this._onWheel=this._onWheel.bind(this),this._onPointerMove=this._onPointerMove.bind(this),this._onPointerDown=this._onPointerDown.bind(this),this._onPointerUp=this._onPointerUp.bind(this),this._onPointerLeave=this._onPointerLeave.bind(this);let n=e;n.addEventListener(`keydown`,this._onKeyDown),n.addEventListener(`keyup`,this._onKeyUp),n.addEventListener(`wheel`,this._onWheel,{passive:!0}),n.addEventListener(`pointermove`,this._onPointerMove,{passive:!0}),n.addEventListener(`pointerdown`,this._onPointerDown,{passive:!0}),n.addEventListener(`pointerup`,this._onPointerUp,{passive:!0}),n.addEventListener(`pointercancel`,this._onPointerUp,{passive:!0}),typeof window<`u`&&(window.addEventListener(`blur`,this._onBlur),document.addEventListener(`visibilitychange`,this._onVisibility),document.documentElement.addEventListener(`pointerleave`,this._onPointerLeave))}isDown(e){return this.enabled&&this._down.has(e)}wasPressed(e){return this.enabled&&this._pressed.has(e)}wasReleased(e){return this.enabled&&this._released.has(e)}anyPressed(){return this.enabled&&this._pressed.size>0}action(e){return this.enabled?this._anyOf(this.bindings[e],this._down):!1}actionPressed(e){return this.enabled?this._anyOf(this.bindings[e],this._pressed):!1}actionReleased(e){return this.enabled?this._anyOf(this.bindings[e],this._released):!1}consumeAction(e){let t=this.actionPressed(e);if(t){let t=this.bindings[e];if(t)for(let e=0;e<t.length;e++)this._pressed.delete(t[e])}return t}_anyOf(e,t){if(!e)return!1;for(let n=0;n<e.length;n++)if(t.has(e[n]))return!0;return!1}getMoveVector(e=this._move){if(e.x=0,e.y=0,!this.enabled)return e;let t=+!!this.action(`right`)-!!this.action(`left`),n=+!!this.action(`up`)-!!this.action(`down`);if(t!==0&&n!==0){t*=Math.SQRT1_2,n*=Math.SQRT1_2;let e=Math.hypot(t,n);e>1&&(t/=e,n/=e)}return e.x=t,e.y=n,e}addBindings(e={}){for(let[t,n]of Object.entries(e??{}))this.bindings[t]=[...n??[]];this._boundCacheKey=``}enableMouseButtons(e){e&&typeof window<`u`&&(this._mouseTarget&&this._disableMouseButtons(),this._mouseTarget=e,this._onMouseDown??=this._mouseDownEdge.bind(this),this._onMouseMove??=this._mouseChord.bind(this),this._onMouseUp??=this._mouseUpEdge.bind(this),this._onContextMenu??=e=>e.preventDefault(),this._onAuxDown??=e=>{e.button===1&&e.preventDefault()},window.addEventListener(`pointerdown`,this._onMouseDown,{capture:!0,passive:!0}),window.addEventListener(`pointermove`,this._onMouseMove,{capture:!0,passive:!0}),window.addEventListener(`pointerup`,this._onMouseUp,{capture:!0,passive:!0}),window.addEventListener(`pointercancel`,this._onMouseUp,{capture:!0,passive:!0}),e.addEventListener(`contextmenu`,this._onContextMenu),e.addEventListener(`mousedown`,this._onAuxDown))}saveBindings(){return{keyboard:$t(this.bindings)}}restoreBindings(e){this.bindings=$t(e.keyboard),this._boundCacheKey=``}disableMouseButtons(){this._disableMouseButtons()}_disableMouseButtons(){let e=this._mouseTarget;if(e){window.removeEventListener(`pointerdown`,this._onMouseDown,{capture:!0}),window.removeEventListener(`pointermove`,this._onMouseMove,{capture:!0}),window.removeEventListener(`pointerup`,this._onMouseUp,{capture:!0}),window.removeEventListener(`pointercancel`,this._onMouseUp,{capture:!0}),e.removeEventListener(`contextmenu`,this._onContextMenu),e.removeEventListener(`mousedown`,this._onAuxDown);for(let e of this._mouseDown)this._releaseCode(e);this._mouseDown.clear(),this._mouseTarget=null}}_mouseDownEdge(e){e.target===this._mouseTarget&&this._pressMouse(e.button)}_mouseChord(e){let t=e.button;if(!(t>=0&&t<=2))return;let n=t===1?4:t===2?2:1;e.buttons&n?e.target===this._mouseTarget&&this._pressMouse(t):this._releaseCode(`Mouse${t}`)}_mouseUpEdge(e){let t=e.button;if(t>=0&&t<=2&&this._releaseCode(`Mouse${t}`),this._mouseDown.size&&typeof e.buttons==`number`)for(let t of this._mouseDown){let n=+t.charAt(5),r=n===1?4:n===2?2:1;e.buttons&r||this._releaseCode(t)}}_pressMouse(e){if(!(e>=0&&e<=2))return;let t=`Mouse${e}`;this._down.has(t)||(this._down.add(t),this._mouseDown.add(t),this._pressed.add(t),this.lastDevice=`mouse`)}_releaseCode(e){this._mouseDown.delete(e),this._down.delete(e)&&this._released.add(e)}endFrame(){this._pressed.size&&this._pressed.clear(),this._released.size&&this._released.clear(),this.wheelDelta=0}reset(){for(let e of this._down)this._released.add(e);this._down.clear(),this._mouseDown.clear(),this.pointer.down=!1,this.pointer.buttons=0,this.wheelDelta=0}dispose(){let e=this.target;e.removeEventListener(`keydown`,this._onKeyDown),e.removeEventListener(`keyup`,this._onKeyUp),e.removeEventListener(`wheel`,this._onWheel),e.removeEventListener(`pointermove`,this._onPointerMove),e.removeEventListener(`pointerdown`,this._onPointerDown),e.removeEventListener(`pointerup`,this._onPointerUp),e.removeEventListener(`pointercancel`,this._onPointerUp),typeof window<`u`&&(window.removeEventListener(`blur`,this._onBlur),document.removeEventListener(`visibilitychange`,this._onVisibility),document.documentElement.removeEventListener(`pointerleave`,this._onPointerLeave),this._disableMouseButtons()),this._down.clear(),this._mouseDown.clear(),this._pressed.clear(),this._released.clear()}_isBound(e){let t=``;for(let e in this.bindings)t+=e+`:`+this.bindings[e].join(`,`)+`;`;if(t!==this._boundCacheKey){this._boundCacheKey=t,this._boundCodes.clear();for(let e in this.bindings)for(let t of this.bindings[e])this._boundCodes.add(t)}return this._boundCodes.has(e)}_onKeyDown(e){let t=e.code;t&&(en(e.target)||en(typeof document<`u`?document.activeElement:null)||(!e.ctrlKey&&!e.metaKey&&!e.altKey&&this._isBound(t)&&e.preventDefault(),this._down.has(t)||(this._down.add(t),e.repeat||(this._pressed.add(t),this.lastDevice=`keyboard`))))}_onKeyUp(e){let t=e.code;t&&(this._down.has(t)&&(this._down.delete(t),this._released.add(t)),!en(e.target)&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&this._isBound(t)&&e.preventDefault())}_onBlur(){this.reset()}_onVisibility(){document.visibilityState===`hidden`&&this.reset()}_onWheel(e){if(!this.enabled)return;let t=e.target;if(t&&t.closest&&this.wheelIgnoreSelector&&t.closest(this.wheelIgnoreSelector))return;let n=e.deltaY;e.deltaMode===1?n*=16:e.deltaMode===2&&(n*=400),this.wheelDelta+=n}_onPointerMove(e){this.pointer.x=e.clientX,this.pointer.y=e.clientY,this.pointer.inside=!0}_onPointerDown(e){this.pointer.x=e.clientX,this.pointer.y=e.clientY,this.pointer.down=!0,this.pointer.buttons=e.buttons,this.pointer.inside=!0}_onPointerUp(e){this.pointer.x=e.clientX,this.pointer.y=e.clientY,this.pointer.buttons=e.buttons??0,this.pointer.down=this.pointer.buttons!==0}_onPointerLeave(){this.pointer.inside=!1}},nn=1/20,rn=class{constructor(e={}){this.opts=e,this.container=e.container??document.body,this.maxPixelRatio=e.maxPixelRatio??1.5,this._renderScale=N(e.renderScale??1,.25,1);let t=new ce({antialias:!1,powerPreference:`high-performance`,stencil:!1,preserveDrawingBuffer:!!e.preserveDrawingBuffer});t.shadowMap.enabled=!0;let n=e.shadowMapType??1;n===2&&(n=1),t.shadowMap.type=n,t.toneMapping=4,t.toneMappingExposure=1,t.outputColorSpace=D,t.setClearColor(e.clearColor??724506,1),this.renderer=t;let r=t.domElement;r.classList.add(`luminati-canvas`),r.style.display=`block`,r.style.width=`100%`,r.style.height=`100%`,r.style.touchAction=`none`,r.style.outline=`none`,this._isFullWindow()&&(r.style.position=`fixed`,r.style.left=`0`,r.style.top=`0`),r.tabIndex=-1,this.container.appendChild(r),this.scene=new x,this.camera=new y(28,1,.5,400),this.camera.position.set(0,12.7,20.4),this.camera.lookAt(0,0,0),this.input=new tn(e.inputTarget??window),this.events=new Xt,this.time={elapsed:0,delta:0,frame:0,timeScale:1,realDelta:0,realElapsed:0,fps:60},this._systems=[],this._seq=0,this._renderFn=null,this._failed=new WeakMap,this._running=!1,this._manual=!!(e.manualStep??(an(`fixedstep`)&&(an(`autostart`)||an(`debug`)))),this._startedOnce=!1,this._lastNow=-1,this._disposed=!1,this._width=1,this._height=1,this._pixelRatio=1,this.resizeThrottleMs=0,this._lastResizeAt=-1/0,this._resizeTimer=0,this._tick=this._tick.bind(this),this._onWindowResize=()=>this._resize(),this._onContextLost=e=>{e.preventDefault(),console.warn(`[Engine] WebGL context lost`),this.events.emit(`contextlost`)},this._onContextRestored=()=>{console.warn(`[Engine] WebGL context restored`),this.events.emit(`contextrestored`)},r.addEventListener(`webglcontextlost`,this._onContextLost),r.addEventListener(`webglcontextrestored`,this._onContextRestored),this._resizeObserver=null,typeof ResizeObserver<`u`&&!this._isFullWindow()&&(this._resizeObserver=new ResizeObserver(()=>this._resize()),this._resizeObserver.observe(this.container)),window.addEventListener(`resize`,this._onWindowResize),this._resize(!0);let i=e.exposeGlobal;if(i===void 0)try{let e=new URLSearchParams(window.location.search);i=e.has(`debug`)||e.has(`autostart`)}catch{i=!1}i&&(window.__engine=this)}get width(){return this._width}get height(){return this._height}get pixelRatio(){return this._pixelRatio}get aspect(){return this._width/Math.max(1,this._height)}get drawingBufferSize(){return this._dbs??=new l,this.renderer.getDrawingBufferSize(this._dbs)}get canvas(){return this.renderer.domElement}get renderScale(){return this._renderScale}set renderScale(e){let t=N(Number(e)||1,.25,1);t!==this._renderScale&&(this._renderScale=t,this._resize(!0))}_isFullWindow(){return this.container===document.body||this.container===document.documentElement}_measure(){let e,t;if(this._isFullWindow())e=window.innerWidth,t=window.innerHeight;else if(e=this.container.clientWidth,t=this.container.clientHeight,!e||!t){let n=this.container.getBoundingClientRect();e=n.width||window.innerWidth,t=n.height||window.innerHeight}return[Math.max(1,Math.floor(e)),Math.max(1,Math.floor(t))]}_resize(e=!1){if(this._disposed)return;if(!e&&this.resizeThrottleMs>0){let e=(this._lastResizeAt??-1/0)+this.resizeThrottleMs-performance.now();if(e>0){this._resizeTimer||=setTimeout(()=>{this._resizeTimer=0,this._resize()},e);return}}let[t,n]=this._measure(),r=typeof window<`u`&&window.devicePixelRatio||1,i=Math.min(r,this.maxPixelRatio)*this._renderScale;(e||t!==this._width||n!==this._height||i!==this._pixelRatio)&&(this._lastResizeAt=performance.now(),this._width=t,this._height=n,this._pixelRatio=i,this.renderer.getPixelRatio()!==i&&this.renderer.setPixelRatio(i),this.renderer.setSize(t,n,!1),this.camera.aspect=t/n,this.camera.updateProjectionMatrix(),this.events.emit(`resize`,{width:t,height:n,pixelRatio:i}))}resize(){this._resize(!0)}addSystem(e,t=0){if(!e||typeof e!=`object`&&typeof e!=`function`)throw TypeError(`Engine.addSystem: system must be an object`);let n=this._systems.find(t=>t.system===e),r=n?{...n,order:t}:{system:e,order:t,seq:this._seq++,name:e.name||e.constructor?.name||`system`},i=this._systems.filter(t=>t.system!==e);return i.push(r),i.sort((e,t)=>e.order-t.order||e.seq-t.seq),this._systems=i,e}removeSystem(e){let t=this._systems.filter(t=>t.system!==e),n=t.length!==this._systems.length;return this._systems=t,n}get systems(){return this._systems.map(e=>e.system)}setRenderFn(e){this._renderFn=typeof e==`function`?e:null}start(){return this._running||this._disposed?this:(this._running=!0,this._lastNow=-1,this._startedOnce||(this._startedOnce=!0,this._resize(!0)),this._manual||this.renderer.setAnimationLoop(this._tick),this.events.emit(`start`),this)}stop(){return this._running?(this._running=!1,this.renderer.setAnimationLoop(null),this.events.emit(`stop`),this):this}get running(){return this._running}get manualStep(){return this._manual}set manualStep(e){let t=!!e;t===this._manual||this._disposed||(this._manual=t,this._running&&(this._lastNow=-1,this.renderer.setAnimationLoop(t?null:this._tick)))}step(e=1/60,{render:t=!0}={}){this._disposed||this._frame(e,t)}redraw(){this._disposed||this._draw(0,this.time.elapsed)}_tick(e){this._lastNow<0&&(this._lastNow=e);let t=(e-this._lastNow)/1e3;this._lastNow=e,this._frame(t)}_frame(e,t=!0){let n=this.time,r=e>0&&Number.isFinite(e)?e:0,i=(r>nn?nn:r)*n.timeScale;n.realDelta=r,n.realElapsed+=r,n.delta=i,n.elapsed+=i,n.frame++,r>0&&(n.fps+=(1/r-n.fps)*.05);let a=n.elapsed,o=this._systems;for(let e=0;e<o.length;e++){let t=o[e].system;if(typeof t.update==`function`)try{t.update(i,a,this)}catch(t){this._report(o[e].system,`update`,`system "${o[e].name}"`,t)}}this._emitSafe(`update`,i,a);for(let e=0;e<o.length;e++){let t=o[e].system;if(typeof t.lateUpdate==`function`)try{t.lateUpdate(i,a,this)}catch(t){this._report(o[e].system,`lateUpdate`,`system "${o[e].name}"`,t)}}this._emitSafe(`lateUpdate`,i,a),!this._disposed&&(L.uTime.value=a,t&&this._draw(i,a),this.input.endFrame())}_draw(e,t){this._emitSafe(`beforeRender`,e,t);try{this._renderFn?this._renderFn(e,t):this.renderer.render(this.scene,this.camera)}catch(e){this._report(this._renderFn??this.renderer,`render`,`render function`,e)}this._emitSafe(`afterRender`,e,t)}_emitSafe(e,t,n){let r=this.events.listeners(e);for(let i=0;i<r.length;i++){let a=r[i];try{a.call(this.events,t,n)}catch(t){this._report(a,e,`'${e}' listener ${a.name?`"${a.name}"`:`(anonymous)`}`,t)}}}_report(e,t,n,r){let i=this._failed.get(e);if(i||(i=new Set,this._failed.set(e,i)),!i.has(t)){i.add(t),console.error(`[Engine] ${n} threw in ${t} (further errors from it are suppressed):`,r);try{this.events.emit(`error`,{label:n,phase:t,error:r})}catch{}}}dispose({disposeScene:e=!0}={}){if(this._disposed)return;this.stop();try{this.events.emit(`dispose`)}catch(e){console.error(`[Engine] 'dispose' listener threw:`,e)}this._disposed=!0;let t=this._systems;for(let e=t.length-1;e>=0;e--){let n=t[e].system;if(typeof n.dispose==`function`)try{n.dispose()}catch(n){console.error(`[Engine] system "${t[e].name}" threw in dispose:`,n)}}this._systems=[],this.input.dispose(),this._resizeObserver?.disconnect(),this._resizeObserver=null,clearTimeout(this._resizeTimer),window.removeEventListener(`resize`,this._onWindowResize),e&&on(this.scene),this.scene.clear();let n=this.renderer.domElement;n.removeEventListener(`webglcontextlost`,this._onContextLost),n.removeEventListener(`webglcontextrestored`,this._onContextRestored),this.renderer.renderLists.dispose(),this.renderer.dispose();try{this.renderer.forceContextLoss()}catch{}n.remove(),this.events.clear(),typeof window<`u`&&window.__engine===this&&delete window.__engine}};function an(e){try{let t=new URLSearchParams(window.location.search);return t.has(e)&&t.get(e)!==`0`}catch{return!1}}function on(e){let t=new Set,n=e=>{e&&!t.has(e)&&typeof e.dispose==`function`&&(t.add(e),e.dispose())},r=e=>{if(e&&!t.has(e)){for(let t of Object.keys(e)){let r=e[t];r&&r.isTexture&&n(r)}if(e.uniforms)for(let t of Object.values(e.uniforms)){let e=t?.value;e&&e.isTexture&&n(e)}n(e)}};e.traverse(e=>{e.geometry&&n(e.geometry);let t=e.material;Array.isArray(t)?t.forEach(r):r(t),e.customDepthMaterial&&r(e.customDepthMaterial),e.customDistanceMaterial&&r(e.customDistanceMaterial),e.isLight&&e.shadow?.map&&e.shadow.dispose(),e.isInstancedMesh&&e.dispose?.()});let i=e.background;i&&i.isTexture&&n(i);let a=e.environment;a&&a.isTexture&&n(a)}var X=new E,sn=new E,cn=new E,ln=new E,un=new E,dn=new E,fn=Math.PI*2,pn=Object.freeze({inOut:e=>(1-Math.cos(Math.PI*e))/2,in:e=>1-Math.cos(Math.PI/2*e),out:e=>Math.sin(Math.PI/2*e),linear:e=>e}),mn=Object.freeze({minPitch:2,maxPitch:85,minDistance:4,maxDistance:90,minFov:12,maxFov:70,minLift:-10,maxLift:30}),hn=(e,t)=>e+Math.round((t-e)/fn)*fn,gn=class{constructor(e,t={}){this.camera=e,this.name=`CameraRig`;let n=t;this.minDistance=n.minDistance??14,this.maxDistance=n.maxDistance??36,this.followLambda=n.followLambda??5,this.followLambdaY=n.followLambdaY??(n.followLambda??5)*.7,this.lookAhead=n.lookAhead??1,this.lookAheadSpeed=n.lookAheadSpeed??4,this.lookAheadLambda=n.lookAheadLambda??2.2,this.velocityLambda=8,this.targetOffsetY=n.targetOffsetY??1,this.freeYaw=!!n.freeYaw,this.yawLimit=(n.yawLimit??60)*F,this.rotateSpeed=(n.rotateSpeed??70)*F,this.rotateLambda=n.rotateLambda??7,this.pitchLambda=n.pitchLambda??6,this.zoomLambda=n.zoomLambda??6,this.zoomKeySpeed=n.zoomKeySpeed??14,this.wheelZoomScale=n.wheelZoomScale??.012,this.minPitch=(n.minPitch??8)*F,this.maxPitch=(n.maxPitch??80)*F,this.autoSnapDistance=n.autoSnapDistance??8,this.inputEnabled=!0;let r=(n.yaw??0)*F,i=N((n.pitch??32)*F,this.minPitch,this.maxPitch),a=N(n.distance??24,this.minDistance,this.maxDistance);this.yawCenter=r,this.focusPoint=new E,this.yaw=r,this.pitch=i,this.distance=a,this.yawTarget=r,this.pitchTarget=i,this.distanceTarget=a,this.bounds=null,this.target=null,this.velocity=new E,this.lookOffset=new E,this._prevTarget=new E,this._hasPrev=!1,this._shake={intensity:0,duration:0,time:0,seed:0},this._shakeClock=0,this.shakeFrequency=14,this._basis={forward:new E(0,0,-1),right:new E(1,0,0)},this.lift=0,this.framingRate=1,this._fr=null,this._lookPoint=new E,(n.fov!==void 0||e.fov!==28)&&(e.fov=n.fov??28,e.updateProjectionMatrix()),this._apply(0)}setTarget(e){return this.target=e??null,this._hasPrev=!1,this.velocity.set(0,0,0),this}rotate(e){return this.yawTarget+=e,this._clampYaw(),this}zoom(e){return this.distanceTarget=N(this.distanceTarget+e,this.minDistance,this.maxDistance),this}zoomIn(e=2){return this.zoom(-e)}zoomOut(e=2){return this.zoom(e)}shake(e,t=.4){let n=this._shake;return e>=(n.duration>0?n.intensity*(1-Math.min(1,n.time/n.duration))**2:0)&&(n.intensity=e,n.duration=Math.max(.01,t),n.time=0,n.seed=(n.seed+1)%997),this}snap(){return this.yaw=this.yawTarget,this.pitch=this.pitchTarget,this.distance=this.distanceTarget,this.lookOffset.set(0,0,0),this.velocity.set(0,0,0),this.target&&this._targetPosition(X)&&(this._prevTarget.copy(X),this._hasPrev=!0,this.focusPoint.set(X.x,X.y+this.targetOffsetY,X.z)),this._clampToBounds(this.focusPoint),this._apply(0),this}update(e,t,n){if((typeof t!=`object`||!t)&&(t=n?.input??null),e=e>0?e:0,t&&this.inputEnabled&&t.enabled!==!1&&!this._fr){let n=0;t.action(`camLeft`)&&--n,t.action(`camRight`)&&(n+=1),n!==0&&this.rotate(N(n,-1,1)*this.rotateSpeed*e);let r=0;t.action(`zoomIn`)&&--r,t.action(`zoomOut`)&&(r+=1),r!==0&&this.zoom(r*this.zoomKeySpeed*e),t.wheelDelta&&this.zoom(t.wheelDelta*this.wheelZoomScale)}if(this.target&&this._targetPosition(X)){if(this._hasPrev||=(this._prevTarget.copy(X),!0),Math.hypot(X.x-this._prevTarget.x,X.z-this._prevTarget.z)>this.autoSnapDistance)return this._prevTarget.copy(X),this.snap(),this;e>0&&(sn.set((X.x-this._prevTarget.x)/e,0,(X.z-this._prevTarget.z)/e),this.velocity.lerp(sn,P(this.velocityLambda,e))),this._prevTarget.copy(X);let t=Math.hypot(this.velocity.x,this.velocity.z),n=0,r=0;if(t>.05&&this.lookAhead>0){let e=this.lookAhead*Math.min(1,t/this.lookAheadSpeed)/t;n=this.velocity.x*e,r=this.velocity.z*e}let i=P(this.lookAheadLambda,e);this.lookOffset.x+=(n-this.lookOffset.x)*i,this.lookOffset.z+=(r-this.lookOffset.z)*i,cn.set(X.x+this.lookOffset.x,X.y+this.targetOffsetY,X.z+this.lookOffset.z),this._clampToBounds(cn);let a=P(this.followLambda,e),o=P(this.followLambdaY,e);this.focusPoint.x+=(cn.x-this.focusPoint.x)*a,this.focusPoint.y+=(cn.y-this.focusPoint.y)*o,this.focusPoint.z+=(cn.z-this.focusPoint.z)*a}return this._clampToBounds(this.focusPoint),this._fr?this._stepFraming(e):(this._clampYaw(),this.pitchTarget=N(this.pitchTarget,this.minPitch,this.maxPitch),this.distanceTarget=N(this.distanceTarget,this.minDistance,this.maxDistance),this.yaw+=(this.yawTarget-this.yaw)*P(this.rotateLambda,e),this.pitch+=(this.pitchTarget-this.pitch)*P(this.pitchLambda,e),this.distance+=(this.distanceTarget-this.distance)*P(this.zoomLambda,e)),this._apply(e),this}get focusDistance(){return this.camera.position.distanceTo(this._lookPoint)}get framed(){return!!this._fr}get orbitRate(){return this._fr?this._fr.orbit/F:0}setFraming(e={},t=0,n=`inOut`){let r=this._beginFraming(),i=mn,a=this._framingNow(),o={...a},s=e??{},c=e=>typeof e==`number`&&Number.isFinite(e);return c(s.yaw)&&(o.yaw=hn(s.yaw*F,a.yaw)),c(s.pitch)&&(o.pitch=N(s.pitch,i.minPitch,i.maxPitch)*F),c(s.distance)&&(o.distance=N(s.distance,i.minDistance,i.maxDistance)),c(s.fov)&&(o.fov=N(s.fov,i.minFov,i.maxFov)),c(s.lift)&&(o.lift=N(s.lift,i.minLift,i.maxLift)),this._moveFraming(r,a,o,t,n,!1)}orbit(e){let t=this._beginFraming();if(t.resetting){let e=this._framingNow();this._moveFraming(t,e,{...e},0,`inOut`,!1)}return t.orbit=N(Number.isFinite(e)?e:0,-360,360)*F,this}resetFraming(e=.8,t=`inOut`){let n=this._fr;if(!n)return Promise.resolve();let r=n.saved,i=this._framingNow(),a={yaw:hn(r.yaw,i.yaw),pitch:r.pitch,distance:r.distance,fov:r.fov,lift:r.lift};return n.orbit=0,this._moveFraming(n,i,a,e,t,!0)}endFraming(){let e=this._fr;if(!e)return this;this._fr=null;let t=e.saved;this.yaw=this.yawTarget=t.yaw,this.pitch=this.pitchTarget=t.pitch,this.distance=this.distanceTarget=t.distance,this.lift=t.lift,this._setFov(t.fov);for(let t of e.waiters.splice(0))t();return this}completeFraming(){let e=this._fr;return e?(e.t=e.dur,this._stepFraming(0),this):this}_beginFraming(){if(this._fr)return this._fr;let e={yaw:this.yawTarget,pitch:this.pitchTarget,distance:this.distanceTarget,fov:this.camera.fov,lift:this.lift},t=this._framingNow();return this._fr={from:t,to:{...t},t:0,dur:0,ease:pn.inOut,orbit:0,resetting:!1,waiters:[],saved:e},this._fr}_framingNow(){return{yaw:this.yaw,pitch:this.pitch,distance:this.distance,fov:this.camera.fov,lift:this.lift}}_moveFraming(e,t,n,r,i,a){for(let t of e.waiters.splice(0))t();e.from=t,e.to=n,e.t=0,e.dur=Number.isFinite(r)&&r>0?r:0,e.ease=Object.hasOwn(pn,i)?pn[i]:pn.inOut,e.resetting=a;let o=new Promise(t=>{e.waiters.push(()=>t(void 0))});return e.dur===0&&this._stepFraming(0),o}_stepFraming(e){let t=this._fr;if(!t)return;let n=Math.max(0,e)*(Number.isFinite(this.framingRate)&&this.framingRate>0?this.framingRate:1);if(t.t<t.dur&&(t.t=Math.min(t.dur,t.t+n)),t.orbit&&(t.from.yaw+=t.orbit*n,t.to.yaw+=t.orbit*n,Math.abs(t.to.yaw)>fn*2)){let e=Math.trunc(t.to.yaw/fn)*fn;t.from.yaw-=e,t.to.yaw-=e}let r=t.dur>0?t.ease(t.t/t.dur):1,{from:i,to:a}=t;if(this.yaw=this.yawTarget=i.yaw+(a.yaw-i.yaw)*r,this.pitch=this.pitchTarget=i.pitch+(a.pitch-i.pitch)*r,this.distance=this.distanceTarget=i.distance+(a.distance-i.distance)*r,this.lift=i.lift+(a.lift-i.lift)*r,this._setFov(i.fov+(a.fov-i.fov)*r),t.t>=t.dur){if(t.resetting)this.endFraming();else for(let e of t.waiters.splice(0))e()}}_setFov(e){Math.abs(this.camera.fov-e)<1e-6||(this.camera.fov=e,this.camera.updateProjectionMatrix())}getMoveBasis(e=this._basis){let t=Math.sin(this.yaw),n=Math.cos(this.yaw);return e.forward.set(-t,0,-n),e.right.set(n,0,-t),e}toWorldDirection(e,t,n=new E){let r=Math.sin(this.yaw),i=Math.cos(this.yaw);return n.set(i*e-r*t,0,-r*e-i*t)}get fov(){return this.camera.fov}set fov(e){this.camera.fov=e,this.camera.updateProjectionMatrix()}setAngles(e,t=this.pitchTarget/F){return this.yawTarget=e*F,this._clampYaw(),this.pitchTarget=N(t*F,this.minPitch,this.maxPitch),this}get shakeAmount(){let e=this._shake;return e.duration<=0||e.time>=e.duration?0:e.intensity*(1-e.time/e.duration)**2}dispose(){if(this.target=null,this._fr)for(let e of this._fr.waiters.splice(0))e()}_targetPosition(e){let t=this.target;if(!t)return!1;if(t.isObject3D)t.getWorldPosition(e);else if(t.isVector3)e.copy(t);else if(typeof t.x==`number`)e.set(t.x,t.y??0,t.z??0);else return!1;return!0}_clampYaw(){this.freeYaw||(this.yawTarget=N(this.yawTarget,this.yawCenter-this.yawLimit,this.yawCenter+this.yawLimit))}_clampToBounds(e){let t=this.bounds;t&&(e.x=N(e.x,t.minX,t.maxX),e.z=N(e.z,t.minZ,t.maxZ))}_apply(e){let t=this.camera,n=Math.cos(this.pitch),r=Math.sin(this.pitch),i=Math.sin(this.yaw),a=Math.cos(this.yaw),o=this.distance,s=this._lookPoint.set(this.focusPoint.x,this.focusPoint.y+this.lift,this.focusPoint.z);t.position.set(s.x+i*n*o,s.y+r*o,s.z+a*n*o),ln.copy(s);let c=0,l=this._shake;if(l.duration>0&&l.time<l.duration){l.time+=e,this._shakeClock+=e;let o=Math.min(1,l.time/l.duration),s=l.intensity*(1-o)*(1-o),u=this._shakeClock*this.shakeFrequency,d=(fe(u,3.1,l.seed)-.5)*2,f=(fe(u,17.7,l.seed)-.5)*2,p=(fe(u*.7,41.3,l.seed)-.5)*2;un.set(a,0,-i),dn.set(-i*r,n,-a*r),t.position.addScaledVector(un,d*s).addScaledVector(dn,f*s),ln.addScaledVector(un,d*s*.35).addScaledVector(dn,f*s*.35),c=p*s*.02,o>=1&&(l.intensity=0)}t.lookAt(ln),c!==0&&t.rotateZ(c),t.updateMatrixWorld(),L.uCameraYaw.value=this.yaw,L.uCameraPosition.value.copy(t.position)}},_n=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},vn=new ne(-1,1,1,-1,0,1),yn=new class extends k{constructor(){super(),this.setAttribute(`position`,new i([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new i([0,2,0,0,2,0],2))}},bn=class{constructor(e){this._mesh=new g(yn,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,vn)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},xn={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},Sn={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new j(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Cn=class e extends _n{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new l(256,256):new l(e.x,e.y),this.clearColor=new j(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new s(i,a,{type:c,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new s(i,a,{type:c,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new s(i,a,{type:c,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Sn;this.highPassUniforms=M.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new C({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let u=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(u[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new l(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let f=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=f,this.bloomTintColors=[new E(1,1,1),new E(1,1,1),new E(1,1,1),new E(1,1,1),new E(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=M.clone(xn.uniforms),this.blendMaterial=new C({uniforms:this.copyUniforms,vertexShader:xn.vertexShader,fragmentShader:xn.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new j,this._oldClearAlpha=1,this._basic=new d,this._fsQuad=new bn(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new l(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new C({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new l(.5,.5)},direction:{value:new l(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new C({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Cn.BlurDirectionX=new l(1,0),Cn.BlurDirectionY=new l(0,1);var wn={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Tn=class extends _n{constructor(){super(),this.isOutputPass=!0,this.uniforms=M.clone(wn.uniforms),this.material=new t({name:wn.name,uniforms:this.uniforms,vertexShader:wn.vertexShader,fragmentShader:wn.fragmentShader}),this._fsQuad=new bn(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},b.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},En=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Dn=`
float pfxLuma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

// Scrub NaN / Inf / negative values coming from the scene (one bad pixel would otherwise poison
// every blur kernel that touches it). Tests the exponent bits instead of isnan(), which D3D's
// fast-math compiler is allowed to optimise away.
bool pfxNonFinite(float x) { return (floatBitsToUint(x) & 0x7f800000u) == 0x7f800000u; }
vec3 pfxSafe(vec3 c) {
  bool bad = pfxNonFinite(c.r) || pfxNonFinite(c.g) || pfxNonFinite(c.b);
  return bad ? vec3(0.0) : clamp(c, vec3(0.0), vec3(6.0e4));
}

// 8×8 Bayer ordered-dither threshold in [0, 1) (recursive closed form).
float pfxBayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float pfxBayer4(vec2 a) { return pfxBayer2(0.5 * a) * 0.25 + pfxBayer2(a); }
float pfxBayer8(vec2 a) { return pfxBayer4(0.5 * a) * 0.25 + pfxBayer2(a); }

// Interleaved gradient noise (Jimenez 2014): cheap, well distributed, in [0, 1).
float pfxIGN(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }

// Integer-ish hash -> [0, 1) (Dave Hoskins, "hash without sine").
float pfxHash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
`,On={name:`LuminatiCopyShader`,uniforms:{tDiffuse:{value:null}},vertexShader:En,fragmentShader:`
    ${Dn}
    uniform sampler2D tDiffuse;
    void main() {
      gl_FragColor = vec4(pfxSafe(texelFetch(tDiffuse, ivec2(gl_FragCoord.xy), 0).rgb), 1.0);
    }
  `};function kn(){return{tDepth:{value:null},uCamNear:{value:.5},uCamFar:{value:400},uFocusDistance:{value:24},uFocusRange:{value:5},uNearScale:{value:1.4},uFarScale:{value:1},uMaxBlurPx:{value:10},uTilt:{value:new E(.35,.52,.28)},uTiltFeather:{value:.3},uOrtho:{value:0}}}var An=`
#include <packing>
uniform sampler2D tDepth;
uniform float uCamNear;
uniform float uCamFar;
uniform float uFocusDistance;
uniform float uFocusRange;
uniform float uNearScale;
uniform float uFarScale;
uniform float uMaxBlurPx;
uniform vec3 uTilt; // x = strength, y = centre (uv.y), z = band width (uv)
uniform float uTiltFeather; // uv distance over which the tilt term ramps in
uniform float uOrtho;       // 1 for orthographic cameras

float dofViewDepth(float rawDepth) {
  return uOrtho > 0.5 ? -orthographicDepthToViewZ(rawDepth, uCamNear, uCamFar)
                      : -perspectiveDepthToViewZ(rawDepth, uCamNear, uCamFar);
}

float dofCoC(float rawDepth, float uvY) {
  float z = dofViewDepth(rawDepth);
  float dz = z - uFocusDistance;
  float band = 0.5 * uFocusRange;
  float t = clamp((abs(dz) - band) / max(1.5 * uFocusRange, 1e-3), 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  float coc = dz < 0.0 ? -uNearScale * t : uFarScale * t;
  // screen-space tilt-shift term
  float ty = abs(uvY - uTilt.y) - 0.5 * uTilt.z;
  float tilt = uTilt.x * smoothstep(0.0, max(uTiltFeather, 1e-3), ty);
  if (tilt > abs(coc)) {
    float s = abs(dz) > band ? sign(dz) : (uvY < uTilt.y ? -1.0 : 1.0);
    coc = s * tilt;
  }
  return coc * uMaxBlurPx;
}
`,jn={name:`LuminatiDofPrefilter`,glslVersion:te,uniforms:{tColor:{value:null},uFullSize:{value:new l(1,1)},uRatio:{value:new l(2,2)},uScale:{value:.5},uBokehThreshold:{value:1.5},uSprites:{value:1}},vertexShader:En,fragmentShader:`
    ${An}
    ${Dn}
    uniform sampler2D tColor;
    uniform vec2 uFullSize;
    uniform vec2 uRatio;
    uniform float uScale;
    uniform float uBokehThreshold;
    uniform float uSprites;
    varying vec2 vUv;
    layout(location = 0) out vec4 outColorCoc;
    layout(location = 1) out vec4 outHighlight;

    void main() {
      vec2 fc = gl_FragCoord.xy * uRatio;           // centre of this texel in full-res pixels
      ivec2 p = ivec2(floor(fc - 0.5));
      ivec2 mx = ivec2(uFullSize) - 1;
      ivec2 p0 = clamp(p, ivec2(0), mx);
      ivec2 p1 = clamp(p + ivec2(1, 0), ivec2(0), mx);
      ivec2 p2 = clamp(p + ivec2(0, 1), ivec2(0), mx);
      ivec2 p3 = clamp(p + ivec2(1, 1), ivec2(0), mx);

      vec3 c0 = texelFetch(tColor, p0, 0).rgb;
      vec3 c1 = texelFetch(tColor, p1, 0).rgb;
      vec3 c2 = texelFetch(tColor, p2, 0).rgb;
      vec3 c3 = texelFetch(tColor, p3, 0).rgb;

      float k0 = dofCoC(texelFetch(tDepth, p0, 0).x, vUv.y);
      float k1 = dofCoC(texelFetch(tDepth, p1, 0).x, vUv.y);
      float k2 = dofCoC(texelFetch(tDepth, p2, 0).x, vUv.y);
      float k3 = dofCoC(texelFetch(tDepth, p3, 0).x, vUv.y);

      float kn = min(min(k0, k1), min(k2, k3));
      float kf = max(max(k0, k1), max(k2, k3));
      float kc = (kn < -1.0 || -kn > kf) ? kn : kf;

      // guard against NaN/Inf from the scene (would poison the whole bokeh kernel)
      c0 = pfxSafe(c0);
      c1 = pfxSafe(c1);
      c2 = pfxSafe(c2);
      c3 = pfxSafe(c3);

      float w0 = 1.0 / (1.0 + (k0 - kc) * (k0 - kc));
      float w1 = 1.0 / (1.0 + (k1 - kc) * (k1 - kc));
      float w2 = 1.0 / (1.0 + (k2 - kc) * (k2 - kc));
      float w3 = 1.0 / (1.0 + (k3 - kc) * (k3 - kc));
      float wsum = w0 + w1 + w2 + w3;
      vec3 col = (c0 * w0 + c1 * w1 + c2 * w2 + c3 * w3) / wsum;

      vec4 hl = vec4(0.0);
      // Only highlights the composite actually shows through the blurred layers are scattered:
      // same ramp as its centreA (full-res px). Nearly-focused specks stay in the sharp image;
      // extracting them would double-count them (near pass is added on top of the sharp pixels)
      // or lose them (far discs are clipped to the tiny CoC of their focused surroundings),
      // which made them pulse between 'boosted disc', 'sharp' and 'hollow ring' while panning.
      float spriteGate = smoothstep(2.0, 4.0, abs(kc));
      if (uSprites > 0.5 && spriteGate > 0.0) {
        // highlight energy, decided per full-res pixel (smooth ramp above the threshold)
        float T = uBokehThreshold;
        float l0 = pfxLuma(c0), l1 = pfxLuma(c1), l2 = pfxLuma(c2), l3 = pfxLuma(c3);
        float r0 = smoothstep(T, 2.0 * T, l0), r1 = smoothstep(T, 2.0 * T, l1);
        float r2 = smoothstep(T, 2.0 * T, l2), r3 = smoothstep(T, 2.0 * T, l3);
        if (r0 + r1 + r2 + r3 > 0.0) {
          // isolation: tent-weighted neighbourhood mean (≈14×14 px via 5×5 bilinear 2×2 taps)
          // vs each pixel's OWN luminance. Lone specks → 1 (scattered as boosted discs);
          // extended bright areas → 0 (stay in the normalised gather, which keeps their blurred
          // edges free of dark halos). The 25 taps are re-weighted per pixel so each of the 4
          // pixels gets a tent window centred on itself (pixels sit ±0.25 tap from the block
          // centre, no extra fetches): the result barely depends on how a highlight straddles
          // the reduced-res grid, so boosted bokeh does not pulse while the camera pans (the
          // sprite gain amplifies any jitter here).
          float m0 = 0.0, m1 = 0.0, m2 = 0.0, m3 = 0.0;
          for (int y = -2; y <= 2; y++) {
            float ra = 0.0, rb = 0.0;
            for (int x = -2; x <= 2; x++) {
              float L = pfxLuma(textureLod(tColor, (fc + vec2(x, y) * 2.0) / uFullSize, 0.0).rgb);
              ra += (3.0 - abs(float(x) + 0.25)) * L;
              rb += (3.0 - abs(float(x) - 0.25)) * L;
            }
            float wa = 3.0 - abs(float(y) + 0.25);
            float wb = 3.0 - abs(float(y) - 0.25);
            m0 += wa * ra; m1 += wa * rb; m2 += wb * ra; m3 += wb * rb;
          }
          const float TENT_NORM = 1.0 / 76.5625;         // (Σ weights)² = 8.75²
          float s0 = r0 * (1.0 - smoothstep(0.06, 0.6, m0 * TENT_NORM / max(l0, 1e-4)));
          float s1 = r1 * (1.0 - smoothstep(0.06, 0.6, m1 * TENT_NORM / max(l1, 1e-4)));
          float s2 = r2 * (1.0 - smoothstep(0.06, 0.6, m2 * TENT_NORM / max(l2, 1e-4)));
          float s3 = r3 * (1.0 - smoothstep(0.06, 0.6, m3 * TENT_NORM / max(l3, 1e-4)));
          // Removed from the gather: the amount the layer-aware colour average above holds.
          vec3 eGather = (c0 * (w0 * s0) + c1 * (w1 * s1) + c2 * (w2 * s2) + c3 * (w3 * s3)) / wsum;
          // Scattered as sprites: the footprint's true (box-filtered) energy. The layer-aware
          // weights dilate near-field specks to every texel they touch, so using them here
          // made the scattered energy depend on the grid phase (even/odd flicker when panning).
          vec3 eBox = (c0 * s0 + c1 * s1 + c2 * s2 + c3 * s3) * 0.25;
          vec3 eAll = (c0 * r0 + c1 * r1 + c2 * r2 + c3 * r3) * 0.25;
          float iso = clamp(pfxLuma(eBox) / max(pfxLuma(eAll), 1e-6), 0.0, 1.0);
          col -= eGather * spriteGate;
          hl = vec4(eBox * spriteGate, iso);
        }
      }
      outColorCoc = vec4(max(col, vec3(0.0)), kc * uScale);
      outHighlight = hl;
    }
  `};function Mn(e){let t=Math.PI*(3-Math.sqrt(5)),n=new Float32Array(e*3);for(let r=0;r<e;r++){let i=Math.sqrt((r+.5)/e),a=r*t;n[r*3]=i*Math.cos(a),n[r*3+1]=i*Math.sin(a),n[r*3+2]=i}return n}function Nn(e){let t=Mn(e),n=[];for(let r=0;r<e;r++)n.push(`vec2(${t[r*3].toFixed(6)}, ${t[r*3+1].toFixed(6)})`);return`const vec2 SMALL_KERNEL[${e}] = vec2[${e}](${n.join(`, `)});`}function Pn(e){let t=Mn(e),n=[];for(let r=0;r<e;r++)n.push(`vec3(${t[r*3].toFixed(6)}, ${t[r*3+1].toFixed(6)}, ${t[r*3+2].toFixed(6)})`);return`const vec3 KERNEL[${e}] = vec3[${e}](\n  ${n.join(`,
  `)}\n);`}function Fn(e=48){return{name:`LuminatiDofGather${e}`,defines:{TAPS:e},uniforms:{tColorCoc:{value:null},uTexel:{value:new l(1,1)},uRadius:{value:6}},vertexShader:En,fragmentShader:`
      uniform sampler2D tColorCoc;
      uniform vec2 uTexel;
      uniform float uRadius;
      varying vec2 vUv;

      ${Pn(e)}

      void main() {
        vec4 centre = textureLod(tColorCoc, vUv, 0.0);
        float coc0 = centre.a;
        const float MARGIN = 1.0;                         // disc edge softness (px)
        // background taps are weighted by the inverse area of the disc they scatter
        // (1/CoC², floored so a focused silhouette cannot dominate its blurred neighbours):
        // a less-blurred object in front of a blurrier background then spreads over it as
        // much as it blends inward, instead of keeping a crisp 'cut-out' silhouette
        const float MIN_AREA = 4.0;                       // (2 px)²
        float norm = uRadius * uRadius / float(TAPS);     // (tap area) / PI

        float c0p = max(coc0, 0.0);
        vec4 bg = vec4(centre.rgb, 1.0) / max(c0p * c0p, MIN_AREA);
        vec4 fg = vec4(0.0);
        float fgA = 0.0;
        float nc0 = -coc0;
        if (nc0 >= 1.0) {
          fg = vec4(centre.rgb, 1.0);
          fgA = norm / max(nc0 * nc0, norm);
        }

        for (int i = 0; i < TAPS; i++) {
          vec3 k = KERNEL[i];
          float d = k.z * uRadius;
          vec4 s = textureLod(tColorCoc, vUv + k.xy * (uRadius * uTexel), 0.0);

          // background / focus layer: limited by the smaller CoC of centre and tap
          float bc = max(min(coc0, s.a), 0.0);
          float bw = clamp((bc - d) / MARGIN + 1.0, 0.0, 1.0) / max(bc * bc, MIN_AREA);
          bg += vec4(s.rgb, 1.0) * bw;

          // near layer: scatter-as-gather with the tap's own CoC
          float nc = -s.a;
          float fw = clamp((nc - d) / MARGIN + 1.0, 0.0, 1.0) * step(1.0, nc);
          fg += vec4(s.rgb, 1.0) * fw;
          fgA += fw * norm / max(nc * nc, norm);
        }

        bg.rgb /= bg.a;
        fg.rgb /= max(fg.a, 1e-4);
        fgA = fg.a > 0.0 ? clamp(fgA, 0.0, 1.0) : 0.0;
        gl_FragColor = vec4(mix(bg.rgb, fg.rgb, fgA), fgA);
      }
    `}}var In={name:`LuminatiDofTent`,uniforms:{tBlur:{value:null},tColorCoc:{value:null},uSize:{value:new l(1,1)}},vertexShader:En,fragmentShader:`
    uniform sampler2D tBlur;
    uniform sampler2D tColorCoc;
    uniform vec2 uSize;

    void main() {
      ivec2 p = ivec2(gl_FragCoord.xy);
      ivec2 mx = ivec2(uSize) - 1;
      vec4 c = texelFetch(tBlur, p, 0);
      float cc = texelFetch(tColorCoc, p, 0).a;
      float tol = 1.0 + 0.25 * abs(cc);
      vec4 acc = vec4(0.0);
      float wsum = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          ivec2 q = clamp(p + ivec2(x, y), ivec2(0), mx);
          vec4 s = texelFetch(tBlur, q, 0);
          float sc = texelFetch(tColorCoc, q, 0).a;
          float w = float((2 - abs(x)) * (2 - abs(y)));   // 1-2-1 tent
          float dd = (sc - cc) / tol;
          float sim = 1.0 / (1.0 + dd * dd * 4.0);
          // strict only next to (nearly) focused texels; two blurred layers blend freely
          sim = mix(sim, 1.0, smoothstep(1.0, 2.5, min(abs(cc), abs(sc))));
          w *= mix(sim, 1.0, max(s.a, c.a));
          acc += s * w;
          wsum += w;
        }
      }
      gl_FragColor = acc / wsum;
    }
  `},Ln={name:`LuminatiDofBokehSprites`,uniforms:{tColorCoc:{value:null},tHighlight:{value:null},tGather:{value:null},uSize:{value:new l(1,1)},uMode:{value:0},uBoost:{value:1.5},uMaxRadius:{value:16},uMaxPointSize:{value:64},uSquash:{value:1}},vertexShader:`
    ${Dn}
    uniform sampler2D tColorCoc;
    uniform sampler2D tHighlight;
    uniform vec2 uSize;
    uniform float uMode;
    uniform float uBoost;
    uniform float uMaxRadius;
    uniform float uMaxPointSize;
    flat out vec3 vColor;
    flat out float vRadius;
    flat out vec2 vCentre;

    void cull() {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);   // outside the clip volume
      gl_PointSize = 1.0;
      vColor = vec3(0.0); vRadius = 0.0; vCentre = vec2(0.0);
    }

    void main() {
      // one point per 2×2 block of reduced-res texels: energy-weighted merge
      int gw = (int(uSize.x) + 1) / 2;
      ivec2 base = ivec2(gl_VertexID % gw, gl_VertexID / gw) * 2;
      ivec2 mx = ivec2(uSize) - 1;
      vec3 esum = vec3(0.0);
      vec2 eCentre = vec2(0.0);
      float cocSum = 0.0, isoSum = 0.0, lsum = 0.0;
      for (int i = 0; i < 4; i++) {
        ivec2 t = min(base + ivec2(i & 1, i >> 1), mx);
        vec4 hl = texelFetch(tHighlight, t, 0);
        float l = pfxLuma(hl.rgb);
        if (l > 0.0) {
          esum += hl.rgb;
          eCentre += (vec2(t) + 0.5) * l;
          cocSum += texelFetch(tColorCoc, t, 0).a * l;
          isoSum += hl.a * l;
          lsum += l;
        }
      }
      if (lsum < 1e-5) { cull(); return; }
      eCentre /= lsum;
      float coc = cocSum / lsum;
      float iso = isoSum / lsum;
      float wNear = smoothstep(0.75, 1.5, -coc);
      float wm = uMode > 0.5 ? wNear : 1.0 - wNear;
      vec3 e = esum * wm;
      if (pfxLuma(e) < 1e-4) { cull(); return; }
      float r = clamp(abs(coc), 0.5, uMaxRadius);
      float size = min(2.0 * ceil(r + 1.5) + 1.0, uMaxPointSize);
      r = min(r, 0.5 * size - 1.5);
      float area = max(3.14159265 * r * r, 1.0);
      float gain = 1.0 + uBoost * 4.0 * iso * smoothstep(0.5, 3.0, r) * (1.0 + 0.1 * r);
      vColor = e * gain / area;
      vRadius = r;
      vCentre = eCentre;
      // snap the point centre to a pixel centre; the disc itself is evaluated around vCentre
      vec2 pc = floor(eCentre) + 0.5;
      gl_Position = vec4(pc / uSize * 2.0 - 1.0, 0.0, 1.0);
      gl_PointSize = size;
    }
  `,fragmentShader:`
    uniform sampler2D tColorCoc;
    uniform sampler2D tGather;
    uniform float uMode;
    uniform float uSquash;
    flat in vec3 vColor;
    flat in float vRadius;
    flat in vec2 vCentre;

    void main() {
      float d = length((gl_FragCoord.xy - vCentre) * vec2(uSquash, 1.0));
      float r = vRadius;
      float cov;
      if (uMode < 0.5) {
        ivec2 q = ivec2(gl_FragCoord.xy);
        float c0 = abs(texelFetch(tColorCoc, q, 0).a);
        float nearA = texelFetch(tGather, q, 0).a;
        float lim = max(min(c0, r), 0.5);
        cov = clamp(lim - d + 0.5, 0.0, 1.0) * (1.0 - nearA);
      } else {
        cov = clamp(r - d + 0.5, 0.0, 1.0);
      }
      if (cov <= 0.0) discard;
      // lens-like disc: flat body with a slightly brighter rim
      float rim = mix(0.9, 1.18, smoothstep(0.55, 1.0, d / max(r, 1.0)));
      // (an oval covers 1 / uSquash of the disc's area: × uSquash keeps its energy)
      gl_FragColor = vec4(vColor * (cov * rim * uSquash), 0.0);
    }
  `},Rn={name:`LuminatiDofComposite`,uniforms:{tColor:{value:null},tBlur:{value:null},tColorCoc:{value:null},tNearBokeh:{value:null},uNearBokeh:{value:1},uHalfSize:{value:new l(1,1)},uHalfRatio:{value:new l(.5,.5)},uScale:{value:.5},uMaxCocPx:{value:10},uFullTexel:{value:new l(1,1)}},vertexShader:En,fragmentShader:`
    ${An}
    ${Dn}
    uniform sampler2D tColor;
    uniform sampler2D tBlur;
    uniform sampler2D tColorCoc;
    uniform sampler2D tNearBokeh;
    uniform float uNearBokeh;
    uniform vec2 uHalfSize;
    uniform vec2 uHalfRatio;
    uniform float uScale;
    uniform float uMaxCocPx;
    uniform vec2 uFullTexel;
    varying vec2 vUv;

    ${Nn(12)}

    void main() {
      ivec2 fp = ivec2(gl_FragCoord.xy);
      vec3 sharp = pfxSafe(texelFetch(tColor, fp, 0).rgb);
      float coc = dofCoC(texelFetch(tDepth, fp, 0).x, vUv.y);   // full-res px
      float cocH = coc * uScale;                                   // reduced-res px

      // CoC-aware bilinear upsample of the blurred layer
      vec2 hp = gl_FragCoord.xy * uHalfRatio - 0.5;
      vec2 f = fract(hp);
      ivec2 b = ivec2(floor(hp));
      ivec2 mx = ivec2(uHalfSize) - 1;
      ivec2 q0 = clamp(b, ivec2(0), mx);
      ivec2 q1 = clamp(b + ivec2(1, 0), ivec2(0), mx);
      ivec2 q2 = clamp(b + ivec2(0, 1), ivec2(0), mx);
      ivec2 q3 = clamp(b + ivec2(1, 1), ivec2(0), mx);
      vec4 s0 = texelFetch(tBlur, q0, 0);
      vec4 s1 = texelFetch(tBlur, q1, 0);
      vec4 s2 = texelFetch(tBlur, q2, 0);
      vec4 s3 = texelFetch(tBlur, q3, 0);
      vec4 tcs = vec4(texelFetch(tColorCoc, q0, 0).a, texelFetch(tColorCoc, q1, 0).a,
                      texelFetch(tColorCoc, q2, 0).a, texelFetch(tColorCoc, q3, 0).a);
      float tol = 1.0 + 0.25 * abs(cocH);
      vec4 dc = (tcs - cocH) / tol;
      vec4 sim = 1.0 / (1.0 + dc * dc * 4.0) + 1e-3;
      // CoC rejection only matters next to (nearly) focused texels (it keeps sharp colour from
      // leaking into blurred neighbours). Where both sides are already visibly blurred, plain
      // bilinear blending is right; rejecting there gave blurred mid-ground sprites a crisp,
      // pixel-exact 'cut-out' silhouette against a blurrier background. (Same rule in the tent.)
      sim = mix(sim, vec4(1.0), smoothstep(1.0, 2.5, min(vec4(abs(cocH)), abs(tcs))));
      vec4 bil = vec4((1.0 - f.x) * (1.0 - f.y), f.x * (1.0 - f.y), (1.0 - f.x) * f.y, f.x * f.y);
      vec4 w = bil * mix(sim, vec4(1.0), clamp(vec4(s0.a, s1.a, s2.a, s3.a), 0.0, 1.0));
      vec4 blur = (s0 * w.x + s1 * w.y + s2 * w.z + s3 * w.w) / max(dot(w, vec4(1.0)), 1e-5);

      // small CoCs: a full-resolution disc blur, so the focus falloff is gradual and the
      // half-res layer only takes over once the blur is large enough to hide its resolution
      float ac = abs(coc);
      vec3 base = sharp;
      if (ac > 0.3 && ac < 4.0) {
        // scatter-as-gather: a tap only counts if its own CoC reaches this pixel, so focused
        // silhouettes never smear onto a slightly blurred background next to them
        vec3 acc = sharp;
        float wsum = 1.0;
        ivec2 fmx = ivec2(uHalfSize / uHalfRatio + 0.5) - 1;
        for (int i = 0; i < 12; i++) {
          vec2 o = SMALL_KERNEL[i] * ac;
          vec2 pos = gl_FragCoord.xy + o;
          float tc = abs(dofCoC(texelFetch(tDepth, clamp(ivec2(pos), ivec2(0), fmx), 0).x, pos.y * uFullTexel.y));
          float wt = clamp(tc - length(o) + 1.0, 0.0, 1.0);
          acc += texture2D(tColor, pos * uFullTexel).rgb * wt;
          wsum += wt;
        }
        base = mix(sharp, acc / wsum, smoothstep(0.3, 1.2, ac));
      }
      float centreA = smoothstep(2.0, 4.0, ac);
      float a = 1.0 - (1.0 - centreA) * (1.0 - clamp(blur.a, 0.0, 1.0));
      vec3 nearBokeh = uNearBokeh > 0.5 ? texture2D(tNearBokeh, vUv).rgb : vec3(0.0);

#ifdef DEBUG
      float l = pfxLuma(sharp);
      vec3 dbase = vec3(sqrt(l / (1.0 + l))) * 0.45;
      float n = sqrt(clamp(-coc / uMaxCocPx, 0.0, 1.0));
      float fr = sqrt(clamp(coc / uMaxCocPx, 0.0, 1.0));
      float inFocus = 1.0 - smoothstep(0.25, 0.75, abs(coc));
      vec3 col = dbase;
      col = mix(col, vec3(1.0, 0.55, 0.12), n * 0.8);
      col = mix(col, vec3(0.22, 0.5, 1.0), fr * 0.8);
      col = mix(col, col * 0.5 + vec3(0.12, 0.5, 0.16), inFocus);
      float spill = clamp(blur.a, 0.0, 1.0) * step(-0.5, coc);
      col = mix(col, vec3(0.85, 0.2, 0.75), spill * 0.6);
      gl_FragColor = vec4(col, 1.0);
#else
      gl_FragColor = vec4(mix(base, blur.rgb, a) + nearBokeh, 1.0);
#endif
    }
  `},zn={name:`LuminatiGrade`,uniforms:{tDiffuse:{value:null},uTexel:{value:new l(1,1)},uAspect:{value:16/9},uExposure:{value:1},uContrast:{value:1.08},uSaturation:{value:1.12},uTemperature:{value:.08},uTint:{value:0},uShadowsTint:{value:new E(.02,.04,.08)},uHighlightsTint:{value:new E(.06,.03,-.02)},uVignette:{value:.5},uVignetteSoftness:{value:.55},uVignetteRoundness:{value:.65},uVignetteColor:{value:new E(.05,.025,.04)},uGrain:{value:.035},uGrainSize:{value:1},uGrainSeed:{value:0},uCA:{value:.0015},uSharpen:{value:.15},uDither:{value:1},tStreak:{value:null},uStreaks:{value:0},uTealOrange:{value:0},uFilmCurve:{value:0},uBlack:{value:new E(0,0,0)},uWhite:{value:new E(1,1,1)},uGrainChroma:{value:0}},vertexShader:En,fragmentShader:`
    ${Dn}
    uniform sampler2D tDiffuse;
    uniform vec2 uTexel;
    uniform float uAspect;
    uniform float uExposure;
    uniform float uContrast;
    uniform float uSaturation;
    uniform float uTemperature;
    uniform float uTint;
    uniform vec3 uShadowsTint;
    uniform vec3 uHighlightsTint;
    uniform float uVignette;
    uniform float uVignetteSoftness;
    uniform float uVignetteRoundness;
    uniform vec3 uVignetteColor;
    uniform float uGrain;
    uniform float uGrainSize;
    uniform float uGrainSeed;
    uniform float uCA;
    uniform float uSharpen;
    uniform float uDither;
    #ifdef CINEMATIC
    uniform sampler2D tStreak;
    uniform float uStreaks;
    uniform float uTealOrange;
    uniform float uFilmCurve;
    uniform vec3 uBlack;
    uniform vec3 uWhite;
    uniform float uGrainChroma;
    // the orange axis in the (Cb, Cr) plane: orange ≈ rgb(1, 0.55, 0.2); its opposite is steel teal
    const vec2 ORANGE = vec2(-0.7415, 0.6709);
    // vec2 → vec3 hash in [0, 1) (Dave Hoskins, "Hash without Sine")
    vec3 filmHash32(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
      p3 += dot(p3, p3.yxz + 33.33);
      return fract((p3.xxy + p3.yzz) * p3.zyx);
    }
    // value noise in [0, 1): the lattice's hashes, smoothly blended — clumps, not pixels
    float filmNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(pfxHash12(i), pfxHash12(i + vec2(1.0, 0.0)), f.x),
                 mix(pfxHash12(i + vec2(0.0, 1.0)), pfxHash12(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    // three independent value noises at once (the luma clumps and the two colour layers)
    vec3 filmNoise3(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(filmHash32(i), filmHash32(i + vec2(1.0, 0.0)), f.x),
                 mix(filmHash32(i + vec2(0.0, 1.0)), filmHash32(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    #endif
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      // position relative to centre, x scaled toward the true aspect by 'roundness'
      vec2 d = uv - 0.5;
      vec2 dv = d * vec2(mix(1.0, uAspect, uVignetteRoundness), 1.0);
      float cornerLen = length(vec2(0.5 * mix(1.0, uAspect, uVignetteRoundness), 0.5));
      float r = length(dv) / cornerLen;            // 0 centre … 1 corners

      // --- sampling: sharpen + chromatic aberration
      vec3 c = texture2D(tDiffuse, uv).rgb;
      vec3 nb = texture2D(tDiffuse, uv + vec2(uTexel.x, 0.0)).rgb
              + texture2D(tDiffuse, uv - vec2(uTexel.x, 0.0)).rgb
              + texture2D(tDiffuse, uv + vec2(0.0, uTexel.y)).rgb
              + texture2D(tDiffuse, uv - vec2(0.0, uTexel.y)).rgb;
      vec3 detail = clamp((c - nb * 0.25) * uSharpen, vec3(-0.08), vec3(0.08));
      vec3 col = c;
      if (uCA > 0.0) {
        vec2 off = d * (uCA * 2.0 * r * r);       // radial, grows toward the edges
        col.r = texture2D(tDiffuse, uv - off).r;
        col.b = texture2D(tDiffuse, uv + off).b;
      }
      col += detail;
      col = max(col, vec3(0.0));
      #ifdef CINEMATIC
      // --- anamorphic streaks: light added to light (a gamma-2.2 round trip around the add)
      if (uStreaks > 0.0) col = pow(pow(col, vec3(2.2)) + texture2D(tStreak, uv).rgb, vec3(1.0 / 2.2));
      #endif

      // --- exposure (post tone-map multiply)
      col *= uExposure;

      // --- white balance: warm/cool along blue↔amber, tint along green↔magenta, luma preserving
      vec3 wb = vec3(1.0 + 0.30 * uTemperature + 0.10 * uTint,
                     1.0 + 0.02 * uTemperature - 0.25 * uTint,
                     1.0 - 0.34 * uTemperature + 0.10 * uTint);
      wb /= pfxLuma(wb);
      col *= wb;

      // --- contrast around display mid-grey
      col = (col - 0.5) * uContrast + 0.5;
      col = max(col, vec3(0.0));

      // --- saturation
      float l = pfxLuma(col);
      col = max(mix(vec3(l), col, uSaturation), vec3(0.0));

      // --- split toning
      l = clamp(pfxLuma(col), 0.0, 1.0);
      float ws = (1.0 - l) * (1.0 - l);
      float wh = l * l;
      col += uShadowsTint * ws + uHighlightsTint * wh;

      #ifdef CINEMATIC
      // --- orange & teal: each hue turned toward the nearer end of the axis; chroma along it kept
      // (skin, fire, sky), across it thinned (greens, magentas); luminance kept. The turn fades out
      // toward right angles to the axis, where the nearer end flips: no hue jumps there.
      {
        float y = pfxLuma(col);
        vec2 cc = vec2(col.b - y, col.r - y);    // (Cb, Cr)
        float m = length(cc);
        if (m > 1e-5) {
          vec2 n = cc / m;
          float s = dot(n, ORANGE);
          float turn = uTealOrange * smoothstep(0.0, 0.35, abs(s));
          vec2 nn = normalize(mix(n, s >= 0.0 ? ORANGE : -ORANGE, turn));
          cc = nn * m * mix(1.0, 0.72 + 0.38 * abs(s), uTealOrange);
          col.r = y + cc.y;
          col.b = y + cc.x;
          col.g = (y - 0.2126 * col.r - 0.0722 * col.b) / 0.7152;
          col = max(col, vec3(0.0));
        }
      }
      // --- film print: an S around mid-grey (toe and shoulder), then the print's black and white
      vec3 sc = clamp(col, 0.0, 1.0);
      col = mix(col, sc * sc * (3.0 - 2.0 * sc), uFilmCurve);
      col = uBlack + col * (uWhite - uBlack);
      #endif

      // --- vignette (smooth, elliptical; darkens toward a deep warm brown instead of grey)
      float inner = mix(0.95, 0.05, clamp(uVignetteSoftness, 0.0, 1.0));
      float v = smoothstep(inner, 1.25, r);
      v = v * v * (3.0 - 2.0 * v);
      col = mix(col, uVignetteColor * col, clamp(uVignette * v * 1.35, 0.0, 1.0));

      #ifdef CINEMATIC
      // --- film grain: soft clumps about uGrainSize px across, strongest in the mid-tones (a little
      // more in the shadows than the pixel grain); colour grain: red and blue clumps of their own,
      // green opposite them so that it adds no luminance
      vec2 fp = gl_FragCoord.xy / uGrainSize + uGrainSeed * vec2(37.17, 91.31);
      vec3 n3 = filmNoise3(fp);
      // (two octaves' weighted mean, centred; × 3.2: value noise spreads less than pixel noise)
      float g = ((2.0 * n3.x + filmNoise(fp * 2.17 + 19.3)) / 3.0 - 0.5) * 3.2;
      float cr = n3.y * 2.0 - 1.0;
      float cb = n3.z * 2.0 - 1.0;
      float lg = clamp(pfxLuma(col), 0.0, 1.0);
      float gw = 0.5 + 2.4 * lg * (1.0 - lg);
      col += (vec3(g) + vec3(cr, -(0.2126 * cr + 0.0722 * cb) / 0.7152, cb) * uGrainChroma) * uGrain * gw;
      #else
      // --- film grain: animated, strongest in the mid-tones
      vec2 gp = floor(gl_FragCoord.xy / uGrainSize);
      float g = pfxHash12(gp + uGrainSeed * vec2(113.7, 71.3)) + pfxHash12(gp * 1.37 + uGrainSeed * vec2(37.1, 91.9)) - 1.0;
      float lg = clamp(pfxLuma(col), 0.0, 1.0);
      float gw = 0.35 + 2.6 * lg * (1.0 - lg);
      col += g * uGrain * gw;
      #endif

      // --- ordered dither (±0.5 LSB of 8-bit) against banding
      col += (pfxBayer8(gl_FragCoord.xy) - 0.5) * (uDither / 255.0);

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `},Bn={name:`LuminatiBloomBrightPass`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:.82},smoothWidth:{value:.35},maxBrightness:{value:24}},vertexShader:En,fragmentShader:`
    ${Dn}
    uniform sampler2D tDiffuse;
    uniform float luminosityThreshold;
    uniform float smoothWidth;
    uniform float maxBrightness;
    varying vec2 vUv;

    void main() {
      vec3 c = pfxSafe(texture2D(tDiffuse, vUv).rgb);
      float br = max(c.r, max(c.g, c.b));
      float knee = max(smoothWidth, 1e-4);
      float soft = clamp(br - luminosityThreshold + knee, 0.0, 2.0 * knee);
      soft = soft * soft / (4.0 * knee);
      float contrib = max(soft, br - luminosityThreshold) / max(br, 1e-4);
      vec3 o = c * contrib;
      float m = max(o.r, max(o.g, o.b));
      o *= min(1.0, maxBrightness / max(m, 1e-4));
      gl_FragColor = vec4(o, 1.0);
    }
  `},Vn={name:`LuminatiStreakPrefilter`,uniforms:{tBright:{value:null},uBrightTexel:{value:new l(1,1)},uThreshold:{value:1}},vertexShader:En,fragmentShader:`
    ${Dn}
    uniform sampler2D tBright;
    uniform vec2 uBrightTexel;
    uniform float uThreshold;

    void main() {
      // one bilinear tap at the shared corner of bright texels 2i, 2i + 1: their exact mean, also
      // where the bright target is not twice this one's size (an odd width or height; its last
      // block clamps to the edge)
      vec2 uv = (2.0 * floor(gl_FragCoord.xy) + 1.0) * uBrightTexel;
      vec3 c = pfxSafe(texture2D(tBright, uv).rgb);
      float br = max(c.r, max(c.g, c.b));
      // a soft knee half the threshold wide (the bright pass already took off the bloom's threshold)
      float knee = 0.5 * uThreshold + 1e-3;
      float soft = clamp(br - uThreshold + knee, 0.0, 2.0 * knee);
      soft = soft * soft / (4.0 * knee);
      gl_FragColor = vec4(c * (max(soft, br - uThreshold) / max(br, 1e-4)), 1.0);
    }
  `},Hn={name:`LuminatiStreakBlur`,uniforms:{tSrc:{value:null},uTexel:{value:new l(1,1)},uStep:{value:1}},vertexShader:En,fragmentShader:`
    uniform sampler2D tSrc;
    uniform vec2 uTexel;
    uniform float uStep;
    varying vec2 vUv;

    void main() {
      vec2 o = vec2(uTexel.x * uStep, 0.0);
      vec3 c = texture2D(tSrc, vUv).rgb * 0.25
             + (texture2D(tSrc, vUv + o).rgb + texture2D(tSrc, vUv - o).rgb) * 0.2
             + (texture2D(tSrc, vUv + 2.0 * o).rgb + texture2D(tSrc, vUv - 2.0 * o).rgb) * 0.12
             + (texture2D(tSrc, vUv + 3.0 * o).rgb + texture2D(tSrc, vUv - 3.0 * o).rgb) * 0.055;
      gl_FragColor = vec4(c, 1.0);
    }
  `},Un={name:`LuminatiStreakComposite`,uniforms:{t1:{value:null},t2:{value:null},t3:{value:null},t4:{value:null},uTint:{value:new E(.25,.5,1)},uTintMix:{value:.85},uStrength:{value:1},uExposure:{value:1}},vertexShader:En,fragmentShader:`
    ${Dn}
    uniform sampler2D t1;
    uniform sampler2D t2;
    uniform sampler2D t3;
    uniform sampler2D t4;
    uniform vec3 uTint;
    uniform float uTintMix;
    uniform float uStrength;
    uniform float uExposure;
    varying vec2 vUv;

    void main() {
      vec3 s = texture2D(t1, vUv).rgb * 0.25 + texture2D(t2, vUv).rgb * 0.6
             + texture2D(t3, vUv).rgb * 1.2 + texture2D(t4, vUv).rgb * 2.4;
      // the lens coating's colour: the streak keeps its luminance, its hue drawn toward the tint
      vec3 tinted = pfxLuma(s) * uTint / max(pfxLuma(uTint), 1e-4);
      gl_FragColor = vec4(mix(s, tinted, uTintMix) * (uStrength * uExposure), 1.0);
    }
  `},Wn=[48,64,96];function Gn(e,t,n={}){return new s(e,t,{type:c,format:v,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1,minFilter:m,magFilter:m,...n})}function Z(e,t=null,n=null,r={}){let i=M.clone(e.uniforms);return t&&Object.assign(i,t),new C({name:e.name,uniforms:i,defines:{...e.defines||{},...n||{}},vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,glslVersion:e.glslVersion??null,depthTest:!1,depthWrite:!1,blending:0,toneMapped:!1,...r})}var Kn=class{constructor(e){this.gl=e,this.ext=e.getExtension?e.getExtension(`EXT_disjoint_timer_query_webgl2`):null,this.enabled=!1,this.results={},this.min={},this._pending=[],this._free=[],this._active=null}get supported(){return!!this.ext}begin(e){if(!this.enabled||!this.ext)return;this._active&&this.end();let t=this.gl,n=this._free.pop()||{q:t.createQuery(),label:``};n.label=e,t.beginQuery(this.ext.TIME_ELAPSED_EXT,n.q),this._active=n}end(){this._active&&=(this.gl.endQuery(this.ext.TIME_ELAPSED_EXT),this._pending.push(this._active),null)}poll(){if(!this.ext||this._pending.length===0)return;let e=this.gl,t=e.getParameter(this.ext.GPU_DISJOINT_EXT);for(;this._pending.length;){let n=this._pending[0];if(!e.getQueryParameter(n.q,e.QUERY_RESULT_AVAILABLE))break;let r=e.getQueryParameter(n.q,e.QUERY_RESULT);if(!t){let e=r/1e6,t=this.results[n.label];this.results[n.label]=t===void 0?e:t*.9+e*.1,this.min[n.label]=Math.min(this.min[n.label]??1/0,e)}this._pending.shift(),this._free.push(n)}}dispose(){let e=this.gl;this._active&&this.end();for(let t of this._pending)e.deleteQuery(t.q);for(let t of this._free)e.deleteQuery(t.q);this._pending.length=0,this._free.length=0}},qn=class{constructor(e,t,n,r={}){this.renderer=e,this.scene=t,this.camera=n,this.samples=Math.max(0,r.samples??4)|0,this.dofScale=N(r.dofScale??.5,.25,1),this.maxTaps=Math.max(48,r.maxTaps??96),this.settings={enabled:!0,dof:{enabled:!0,focusDistance:24,focusRange:5,maxBlur:12,nearScale:1.4,farScale:1,tiltShift:.35,tiltCenter:.52,tiltWidth:.28,bokehBoost:1.5,autoFocus:!0,debug:!1,bokehThreshold:1.5,bokehSprites:!0,tiltFeather:.3,focusSpeed:4},bloom:{enabled:!0,strength:.55,radius:.55,threshold:.82,warmth:.25,knee:.35},grade:{enabled:!0,exposure:1,contrast:1.08,saturation:1.12,temperature:.08,tint:0,shadowsTint:[.02,.04,.08],highlightsTint:[.06,.03,-.02],vignette:.5,vignetteSoftness:.55,grain:.035,chromaticAberration:.0015,sharpen:.15,vignetteRoundness:.65,vignetteColor:[.05,.025,.04],grainSize:1,dither:1},cinematic:{enabled:!1,streaks:1,streakThreshold:1,streakTint:[.25,.5,1],streakTintMix:.85,bokehSquash:1.6,tealOrange:.3,filmCurve:.25,black:[.025,.035,.045],white:[.97,.955,.92],grainChroma:.3}},this._focusTarget=null,this._time=0,this._w=0,this._h=0,this._hw=0,this._hh=0,this._taps=Wn[0],this._v2=new l,this._clearColor=new j,this._bloomWarmth=-1,this._sceneInfo={calls:0,triangles:0,points:0,lines:0},this._depthTexture=new oe(1,1,ae),this._sceneRT=Gn(1,1,{samples:this.samples,depthBuffer:!0,depthTexture:this._depthTexture}),this._prefilterRT=Gn(1,1,{count:2}),this._gatherRT=Gn(1,1),this._tentRT=Gn(1,1),this._nearBokehRT=Gn(1,1),this._hdrRT=Gn(1,1),this._ldrRT=Gn(1,1),this._sceneRT.texture.name=`PostFX.scene`,this._prefilterRT.textures[0].name=`PostFX.dofColorCoc`,this._prefilterRT.textures[1].name=`PostFX.dofHighlights`,this._gatherRT.texture.name=`PostFX.dofGather`,this._tentRT.texture.name=`PostFX.dofBlur`,this._nearBokehRT.texture.name=`PostFX.dofNearBokeh`,this._hdrRT.texture.name=`PostFX.hdr`,this._ldrRT.texture.name=`PostFX.ldr`,this._coc=kn(),this._prefilterMat=Z(jn,this._coc),this._gatherMats=new Map,this._tentMat=Z(In),this._spriteMat=Z(Ln,null,null,{blending:5,blendEquation:100,blendSrc:201,blendDst:201,transparent:!0}),this._compositeMat=Z(Rn,this._coc),this._debugMat=Z(Rn,this._coc,{DEBUG:1}),this._gradeMat=Z(zn),this._copyMat=Z(On),this._quad=new bn(null),this._cine=null,this._spriteGeo=new k,this._spriteCapacity=0,this._sprites=new ee(this._spriteGeo,this._spriteMat),this._sprites.frustumCulled=!1,this._spriteCam=new ne(-1,1,1,-1,0,1);let i=e.getContext(),a=i.getParameter(i.ALIASED_POINT_SIZE_RANGE);this._spriteMat.uniforms.uMaxPointSize.value=Math.max(1,Math.min(256,a?a[1]:64));let o=this.settings.bloom;this._bloom=new Cn(new l(2,2),o.strength,o.radius,o.threshold);let s=Z(Bn);this._bloom.materialHighPassFilter.dispose(),this._bloom.materialHighPassFilter=s,this._bloom.highPassUniforms=s.uniforms,this._output=new Tn,this._timer=new Kn(i),e.getDrawingBufferSize(this._v2),this._allocate(Math.max(1,this._v2.x),Math.max(1,this._v2.y))}setSize(e,t,n=this.renderer.getPixelRatio()){let r=Math.max(1,Math.floor(e*n)),i=Math.max(1,Math.floor(t*n));(r!==this._w||i!==this._h)&&this._allocate(r,i)}setFocus(e,t=!1){Number.isFinite(e)&&(this._focusTarget=e,t&&this.settings.dof.autoFocus&&(this.settings.dof.focusDistance=e))}get depthTexture(){return this._depthTexture}get sceneTarget(){return this._sceneRT}get size(){return{width:this._w,height:this._h,dofWidth:this._hw,dofHeight:this._hh}}get taps(){return this._taps}get timings(){return this._timer.results}get timingsMin(){return this._timer.min}enableTimings(e=!0){return this._timer.enabled=!!e&&this._timer.supported,this._timer.enabled&&(this._timer.min={},this._timer.results={}),this._timer.enabled}render(e=1/60){let t=this.renderer,n=this.settings;e=Number.isFinite(e)?Math.min(Math.max(e,0),.25):1/60,this._time+=e;let r=n.dof;if(r.autoFocus&&this._focusTarget!==null&&(r.focusDistance+=(this._focusTarget-r.focusDistance)*P(r.focusSpeed??4,e)),!n.enabled){t.setRenderTarget(null),this._renderScene();return}t.getDrawingBufferSize(this._v2),(this._v2.x!==this._w||this._v2.y!==this._h)&&this._allocate(this._v2.x,this._v2.y);let i=this._timer;i.poll(),i.begin(`scene`),t.setRenderTarget(this._sceneRT),t.autoClear||t.clear(),this._renderScene(),i.end();let a=t.autoClear;t.autoClear=!1;let o=this._sceneRT,s=!!r.debug;if(r.enabled||s){if(i.begin(`dof`),this._renderDof(s),i.end(),s){t.autoClear=a;return}o=this._hdrRT}let c=n.grade.enabled,l=n.cinematic.enabled&&c,u=!1;if(n.bloom.enabled&&n.bloom.strength>0&&(i.begin(`bloom`),o===this._sceneRT&&(this._copyMat.uniforms.tDiffuse.value=this._sceneRT.texture,this._blit(this._copyMat,this._hdrRT),o=this._hdrRT),this._updateBloom(),this._bloom.render(t,null,o,e,!1),i.end(),l&&n.cinematic.streaks>0&&(i.begin(`streaks`),this._renderStreaks(),u=!0,i.end())),i.begin(`output`),this._output.renderToScreen=!c,this._output.render(t,this._ldrRT,o),c){let e=l?this._cinematic().grade:this._gradeMat;this._updateGrade(e),l&&(e.uniforms.uStreaks.value=+!!u),e.uniforms.tDiffuse.value=this._ldrRT.texture,this._blit(e,null)}i.end(),t.autoClear=a}warmup(){let e=this.renderer,t=e.getRenderTarget(),n=e.autoClear;e.autoClear=!1;for(let e of Wn)e<=this.maxTaps&&this._blit(this._gatherMaterial(e),this._gatherRT);for(let e of[this._prefilterMat,this._tentMat,this._compositeMat,this._debugMat,this._gradeMat,this._copyMat]){let t=e===this._prefilterMat?this._prefilterRT:e===this._gradeMat||e===this._debugMat?null:this._hdrRT;this._blit(e,t)}e.setRenderTarget(this._tentRT),e.render(this._sprites,this._spriteCam),this._updateBloom(),this._bloom.render(e,null,this._hdrRT,0,!1),this._output.renderToScreen=!1,this._output.render(e,this._ldrRT,this._hdrRT),this.settings.cinematic.enabled&&(this._renderStreaks(),this._blit(this._cinematic().grade,null)),e.autoClear=n,e.setRenderTarget(t)}get sceneInfo(){return this._sceneInfo}dispose(){for(let e of[this._sceneRT,this._prefilterRT,this._gatherRT,this._tentRT,this._nearBokehRT,this._hdrRT,this._ldrRT])e.dispose();this._depthTexture.dispose(),this._prefilterMat.dispose();for(let e of this._gatherMats.values())e.dispose();this._gatherMats.clear();for(let e of[this._tentMat,this._spriteMat,this._compositeMat,this._debugMat,this._gradeMat,this._copyMat])e.dispose();if(this._cine){let e=this._cine;for(let t of[e.grade,e.prefilter,e.blur,e.composite])t.dispose();for(let t of e.targets)t.dispose();this._cine=null}this._spriteGeo.dispose(),this._quad.dispose(),this._bloom.dispose(),this._output.dispose(),this._timer.dispose()}_allocate(e,t){e=Math.max(1,e|0),t=Math.max(1,t|0),this._w=e,this._h=t;let n=Math.max(1,Math.ceil(e*this.dofScale)),r=Math.max(1,Math.ceil(t*this.dofScale));this._hw=n,this._hh=r,this._sceneRT.setSize(e,t),this._hdrRT.setSize(e,t),this._ldrRT.setSize(e,t);for(let e of[this._prefilterRT,this._gatherRT,this._tentRT,this._nearBokehRT])e.setSize(n,r);this._bloom.setSize(e,t);let i=Math.ceil(n/2)*Math.ceil(r/2);i>this._spriteCapacity&&(this._spriteCapacity=Math.ceil(i*1.25),this._spriteGeo.dispose(),this._spriteGeo.setAttribute(`position`,new _(new Uint8Array(this._spriteCapacity),1)),this._spriteGeo.boundingSphere=new O(new E,1),this._spriteGeo.boundingBox=new A(new E(-1,-1,-1),new E(1,1,1))),this._spriteGeo.setDrawRange(0,i);let a=this._prefilterMat.uniforms;a.uFullSize.value.set(e,t),a.uRatio.value.set(e/n,t/r),a.uScale.value=this.dofScale,this._tentMat.uniforms.uSize.value.set(n,r),this._spriteMat.uniforms.uSize.value.set(n,r);for(let i of[this._compositeMat,this._debugMat])i.uniforms.uHalfSize.value.set(n,r),i.uniforms.uHalfRatio.value.set(n/e,r/t),i.uniforms.uScale.value=this.dofScale,i.uniforms.uFullTexel.value.set(1/e,1/t);this._gradeMat.uniforms.uTexel.value.set(1/e,1/t),this._gradeMat.uniforms.uAspect.value=e/t,this._cine&&this._sizeCinematic()}_cinematic(){if(!this._cine){let e=[];for(let t=0;t<5;t++){let n=Gn(1,1);n.texture.name=`PostFX.streak${t}`,e.push(n)}this._cine={grade:Z(zn,null,{CINEMATIC:1}),prefilter:Z(Vn),blur:Z(Hn),composite:Z(Un),targets:e},this._cine.grade.uniforms.tStreak.value=e[0].texture,this._sizeCinematic()}return this._cine}_sizeCinematic(){let e=this._cine,t=this._w,n=this._h,r=Math.max(1,Math.ceil(t/4)),i=Math.max(1,Math.ceil(n/4));for(let t of e.targets)t.setSize(r,i);e.blur.uniforms.uTexel.value.set(1/r,1/i),e.grade.uniforms.uTexel.value.set(1/t,1/n),e.grade.uniforms.uAspect.value=t/n}_renderStreaks(){let e=this.settings.cinematic,t=this._cinematic(),n=t.targets,r=this._bloom.renderTargetBright,i=t.prefilter.uniforms;i.tBright.value=r.texture,i.uBrightTexel.value.set(1/r.width,1/r.height),i.uThreshold.value=Math.max(0,e.streakThreshold??1),this._blit(t.prefilter,n[0]);let a=t.blur.uniforms;for(let e=1;e<5;e++)a.tSrc.value=n[e-1].texture,a.uStep.value=3**(e-1),this._blit(t.blur,n[e]);let o=t.composite.uniforms;o.t1.value=n[1].texture,o.t2.value=n[2].texture,o.t3.value=n[3].texture,o.t4.value=n[4].texture,e.streakTint&&o.uTint.value.fromArray(e.streakTint),o.uTintMix.value=N(e.streakTintMix??.85,0,1),o.uStrength.value=Math.max(0,e.streaks),o.uExposure.value=Math.max(0,this.renderer.toneMappingExposure||1),this._blit(t.composite,n[0])}_renderScene(){let e=this.renderer.info,t=e.render,n=e.autoReset,r=n?0:t.calls,i=n?0:t.triangles,a=n?0:t.points,o=n?0:t.lines;this.renderer.render(this.scene,this.camera);let s=this._sceneInfo;s.calls=t.calls-r,s.triangles=t.triangles-i,s.points=t.points-a,s.lines=t.lines-o}_gatherMaterial(e){let t=this._gatherMats.get(e);return t||(t=Z(Fn(e)),this._gatherMats.set(e,t)),t}_blit(e,t){this._quad.material=e,this.renderer.setRenderTarget(t),this._quad.render(this.renderer)}_clear(e){let t=this.renderer;t.getClearColor(this._clearColor);let n=t.getClearAlpha();t.setRenderTarget(e),t.setClearColor(0,0),t.clear(!0,!1,!1),t.setClearColor(this._clearColor,n)}_renderDof(e){let t=this.settings.dof,n=this.camera,r=this._coc,i=this.renderer,a=Math.max(0,t.maxBlur)*(this._h/1080);r.tDepth.value=this._depthTexture,r.uCamNear.value=n.near,r.uCamFar.value=n.far,r.uFocusDistance.value=t.focusDistance,r.uFocusRange.value=Math.max(.01,t.focusRange),r.uNearScale.value=Math.max(0,t.nearScale),r.uFarScale.value=Math.max(0,t.farScale),r.uMaxBlurPx.value=a,r.uTilt.value.set(Math.max(0,t.tiltShift),t.tiltCenter,Math.max(0,t.tiltWidth)),r.uTiltFeather.value=Math.max(.01,t.tiltFeather??.3),r.uOrtho.value=+!!n.isOrthographicCamera;let o=Math.max(t.nearScale,t.farScale,t.tiltShift,0),s=Math.max(1,a*o*this.dofScale),c=.3*Math.PI*s*s,l=Wn[0];for(let e=0;e<Wn.length;e++){let t=Wn[e];if(t>this.maxTaps||(l=t,t>=c))break}this._taps=l;let u=t.bokehSprites!==!1&&!e,d=Math.max(.001,i.toneMappingExposure||1),f=this._prefilterRT.textures[0],p=this._prefilterRT.textures[1],m=this._prefilterMat.uniforms;m.tColor.value=this._sceneRT.texture,m.uBokehThreshold.value=Math.max(.05,t.bokehThreshold??1.5)/d,m.uSprites.value=+!!u,this._blit(this._prefilterMat,this._prefilterRT);let h=this._gatherMaterial(l);h.uniforms.tColorCoc.value=f,h.uniforms.uTexel.value.set(1/this._hw,1/this._hh),h.uniforms.uRadius.value=s,this._blit(h,this._gatherRT);let g=this._tentMat.uniforms;if(g.tBlur.value=this._gatherRT.texture,g.tColorCoc.value=f,this._blit(this._tentMat,this._tentRT),u){let e=this._spriteMat.uniforms;e.tColorCoc.value=f,e.tHighlight.value=p,e.tGather.value=this._gatherRT.texture,e.uBoost.value=Math.max(0,t.bokehBoost),e.uMaxRadius.value=s;let n=this.settings.cinematic;e.uSquash.value=n.enabled?N(n.bokehSquash??1,1,3):1,e.uMode.value=0,i.setRenderTarget(this._tentRT),i.render(this._sprites,this._spriteCam),e.uMode.value=1,this._clear(this._nearBokehRT),i.render(this._sprites,this._spriteCam)}let _=e?this._debugMat:this._compositeMat;_.uniforms.tColor.value=this._sceneRT.texture,_.uniforms.tBlur.value=this._tentRT.texture,_.uniforms.tColorCoc.value=f,_.uniforms.tNearBokeh.value=this._nearBokehRT.texture,_.uniforms.uNearBokeh.value=+!!u,_.uniforms.uMaxCocPx.value=Math.max(1,a*o),this._blit(_,e?null:this._hdrRT)}_updateBloom(){let e=this.settings.bloom,t=this._bloom;t.strength=e.strength,t.radius=e.radius,t.threshold=e.threshold,t.highPassUniforms.smoothWidth.value=Math.max(.01,e.knee??.35);let n=e.warmth??0;if(n!==this._bloomWarmth){this._bloomWarmth=n;let e=t.bloomTintColors.length;for(let r=0;r<e;r++){let i=N(n*(.35+.65*(r/Math.max(1,e-1))),0,1);t.bloomTintColors[r].set(1+.08*i,1-.1*i,1-.32*i)}}}_updateGrade(e){let t=this.settings.grade,n=e.uniforms;if(n.uExposure.value=t.exposure,n.uContrast.value=t.contrast,n.uSaturation.value=t.saturation,n.uTemperature.value=t.temperature,n.uTint.value=t.tint,n.uShadowsTint.value.fromArray(t.shadowsTint),n.uHighlightsTint.value.fromArray(t.highlightsTint),n.uVignette.value=t.vignette,n.uVignetteSoftness.value=t.vignetteSoftness,n.uVignetteRoundness.value=t.vignetteRoundness??.65,t.vignetteColor&&n.uVignetteColor.value.fromArray(t.vignetteColor),n.uGrain.value=t.grain,n.uGrainSize.value=Math.max(1,t.grainSize??1),n.uGrainSeed.value=Math.floor(this._time*24)%997,n.uCA.value=t.chromaticAberration,n.uSharpen.value=t.sharpen,n.uDither.value=t.dither??1,e===this._gradeMat)return;let r=this.settings.cinematic;n.uTealOrange.value=N(r.tealOrange??0,0,1),n.uFilmCurve.value=N(r.filmCurve??0,0,1),r.black&&n.uBlack.value.fromArray(r.black),r.white&&n.uWhite.value.fromArray(r.white),n.uGrainChroma.value=N(r.grainChroma??0,0,1)}},Jn=class{constructor(e){this.name=`SpriteManager`,this.camera=e,this._sprites=[],this._cursor=-1}add(e){return e&&!this._sprites.includes(e)&&this._sprites.push(e),e}remove(e){let t=this._sprites.indexOf(e);return t<0?!1:(this._sprites.splice(t,1),t<=this._cursor&&this._cursor--,!0)}get sprites(){return this._sprites}update(e){let t=this._sprites,n=this.camera;try{for(this._cursor=0;this._cursor<t.length;this._cursor++)t[this._cursor].update(e,n)}finally{this._cursor=-1}}dispose({disposeSprites:e=!1}={}){if(e)for(let e of this._sprites.slice())e.dispose?.();this._sprites.length=0}},Yn=class{constructor({capacity:e=256}={}){this.capacity=e,this.mesh=null,this.sprites=[],this._alpha=null}adopt(e){let t=e?.blob;return!t||this.sprites.includes(e)?!1:(this.mesh||this._create(t),t.layers.disable(0),this.sprites.push(e),!0)}release(e){let t=this.sprites.indexOf(e);return t<0?!1:(this.sprites.splice(t,1),e.blob?.layers.enable(0),!0)}update(){let e=this.mesh;if(!e)return;let t=this._alpha.array,n=0;for(let r=0;r<this.sprites.length&&n<this.capacity;r++){let i=this.sprites[r].blob;if(!i||!Xn(i))continue;let a=i.material.opacity;a>.001&&(i.updateWorldMatrix(!0,!1),e.setMatrixAt(n,i.matrixWorld),t[n]=a,n++)}e.count=n,e.instanceMatrix.needsUpdate=!0,this._alpha.needsUpdate=!0}dispose(){for(let e of this.sprites)e.blob?.layers.enable(0);this.sprites.length=0,this.mesh&&=(this.mesh.removeFromParent(),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh.dispose?.(),null)}_create(e){let t=e.material,n=e.geometry.clone();this._alpha=new a(new Float32Array(this.capacity),1),this._alpha.setUsage(r),n.setAttribute(`aBlobAlpha`,this._alpha);let i=new d({color:t.color.clone(),map:t.map,transparent:!0,opacity:1,depthWrite:!1,polygonOffset:t.polygonOffset,polygonOffsetFactor:t.polygonOffsetFactor,polygonOffsetUnits:t.polygonOffsetUnits,fog:t.fog});i.name=`luminati:blob-batch`,i.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute float aBlobAlpha;
varying float vBlobAlpha;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
	vBlobAlpha = aBlobAlpha;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float vBlobAlpha;`).replace(`#include <alphamap_fragment>`,`#include <alphamap_fragment>
	diffuseColor.a *= vBlobAlpha;`)},i.customProgramCacheKey=()=>`luminati-blob-batch`;let o=new f(n,i,this.capacity);o.name=`BlobBatch`,o.instanceMatrix.setUsage(r),o.count=0,o.renderOrder=e.renderOrder,o.castShadow=!1,o.receiveShadow=!1,o.frustumCulled=!1,o.matrixAutoUpdate=!1,this.mesh=o}};function Xn(e){for(let t=e;t;t=t.parent){if(!t.visible)return!1;if(t.isScene)return!0}return!1}var Zn=`
uniform float uTime;
uniform float uCameraYaw;
uniform vec2 uWind;
uniform float uWindStrength;
uniform float uFoliageWind;
uniform float uAnchorY;
uniform float uQuadHeight;
uniform float uFrameU;
#ifdef LUMINATI_FACE_SUN
uniform vec3 uSunDirection;
#endif
attribute float aFrame;

float luminatiFoliageYaw() {
#ifdef LUMINATI_FACE_SUN
	vec2 sh = uSunDirection.xz;
	return dot( sh, sh ) > 1e-8 ? atan( sh.x, sh.y ) : uCameraYaw;
#else
	return uCameraYaw;
#endif
}

vec3 luminatiYawRotate( vec3 v, float yaw ) {
	float c = cos( yaw );
	float s = sin( yaw );
	return vec3( v.x * c + v.z * s, v.y, - v.x * s + v.z * c );
}
`,Qn=`
	vec3 transformed = luminatiYawRotate( vec3( position ), luminatiFoliageYaw() );
	{
		vec3 lfPos = vec3( 0.0 );
		float lfScale = 1.0;
		#ifdef USE_INSTANCING
			lfPos = instanceMatrix[ 3 ].xyz;
			lfScale = max( length( instanceMatrix[ 0 ].xyz ), 1e-4 );
		#endif
		float lfW = clamp( ( uv.y - uAnchorY ) / max( 1.0 - uAnchorY, 1e-3 ), 0.0, 1.0 );
		float lfWindLen = length( uWind );
		vec2 lfDir = lfWindLen > 1e-4 ? uWind / lfWindLen : vec2( 1.0, 0.0 );
		float lfHash = fract( sin( dot( lfPos.xz, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
		float lfWave = dot( lfPos.xz, lfDir ) * 0.42 - uTime * ( 1.25 + lfWindLen * 0.55 );
		float lfGust = 0.5 + 0.5 * sin( lfWave ) + 0.25 * sin( lfWave * 0.37 + 1.7 );
		lfGust = lfGust * lfGust;
		float lfFlutter = sin( uTime * ( 2.1 + lfHash * 1.9 ) + lfHash * 6.2831 );
		float lfAmt = uWindStrength * uFoliageWind * ( 0.03 + 0.06 * lfWindLen ) * uQuadHeight * lfScale;
		vec2 lfSway = lfDir * lfAmt * ( 0.3 + lfGust * 1.1 + lfFlutter * 0.25 )
			+ vec2( - lfDir.y, lfDir.x ) * lfAmt * lfFlutter * 0.3;
		transformed.xz += lfSway * lfW / lfScale;
		transformed.y -= dot( lfSway, lfSway ) * lfW / ( lfScale * max( uQuadHeight * lfScale, 0.2 ) ) * 0.5;
	}
`,$n=class{constructor(t){let{sprite:n,instances:r,wind:i=1,castShadow:o=!1,receiveShadow:s=!0,alphaTest:c=.5,normalUp:l=.8,wrap:u=.5,roundness:d=.25,rootDarken:p=.35,randomFrames:m=!1,variance:g=.08,seed:_=1,name:v=`Foliage`}=t,y=n.pixelsPerUnit||16,b=Math.max(1,n.frames|0||1),x=n.texture.image,S=n.width;b>1&&x&&x.width&&Math.abs(x.width-n.width)<.5&&(S=n.width/b);let C=n.height,[ee,w]=n.anchor||[.5,0],te=S/y,T=C/y,E=r.length,D=new ie(te,T);D.translate(te*(.5-ee),T*(.5-w),0);let O=new a(new Float32Array(Math.max(1,E)),1);D.setAttribute(`aFrame`,O),this._ownsTexture=b>1,this.texture=b>1?he(n.texture):n.texture,b>1&&(this.texture.repeat.set(1/b,1),this.texture.offset.set(0,0)),this._uniforms={uTime:L.uTime,uCameraYaw:L.uCameraYaw,uWind:L.uWind,uWindStrength:L.uWindStrength,uFoliageWind:{value:i},uAnchorY:{value:w},uQuadHeight:{value:T},uFrameU:{value:1/b},uRootDarken:{value:p},uNormalUp:{value:l},uWrap:{value:u},uRoundness:{value:d},uShadowSkip:{value:+!!o},uShadowSkipBias:{value:o?.03:0}};let k=this._uniforms,A=new re({map:this.texture,alphaTest:c,side:2});A.onBeforeCompile=e=>{ge(e,k,{shadowCenter:`( modelMatrix * vec4( instanceMatrix[ 3 ].xyz, 1.0 ) ).xyz`}),Object.assign(e.uniforms,k),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Zn}`).replace(`#include <beginnormal_vertex>`,`#include <beginnormal_vertex>
	objectNormal = luminatiYawRotate( objectNormal, luminatiFoliageYaw() );`).replace(`#include <begin_vertex>`,Qn).replace(`#include <uv_vertex>`,`#include <uv_vertex>
#ifdef USE_MAP
	vMapUv.x += aFrame * uFrameU;
#endif`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float uRootDarken;`).replace(`#include <map_fragment>`,`#include <map_fragment>
	diffuseColor.rgb *= mix( 1.0 - uRootDarken, 1.0, smoothstep( 0.0, 0.6, vQuadUv.y ) );`)},A.customProgramCacheKey=()=>`luminati-foliage-lit-v1`,this.material=A;let ne=new e({depthPacking:se,map:this.texture,alphaTest:c,side:2});ne.onBeforeCompile=e=>{Object.assign(e.uniforms,k),e.uniforms.uSunDirection=L.uSunDirection,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n#define LUMINATI_FACE_SUN\n${Zn}`).replace(`#include <begin_vertex>`,Qn).replace(`#include <uv_vertex>`,`#include <uv_vertex>
#ifdef USE_MAP
	vMapUv.x += aFrame * uFrameU;
#endif`)},ne.customProgramCacheKey=()=>`luminati-foliage-depth-v1`,this.depthMaterial=ne,this.object=new f(D,A,Math.max(1,E)),this.object.name=v,this.object.count=E,this.object.customDepthMaterial=ne,this.object.castShadow=o,this.object.receiveShadow=s;let ae=new pe(_),oe=new h,M=new j,ce=0;for(let e=0;e<E;e++){let t=r[e],n=t.scale??1;ce=Math.max(ce,n),oe.makeScale(n,n,n),oe.setPosition(t.x,t.y??0,t.z),this.object.setMatrixAt(e,oe),t.tint==null?M.setRGB(1,1,1):M.set(t.tint),g>0&&M.multiplyScalar(1+(ae.next()*2-1)*g),this.object.setColorAt(e,M);let i=t.frame;i??=m?Math.floor(ae.next()*b):0,O.array[e]=Math.min(b-1,Math.max(0,i|0))}this.object.instanceMatrix.needsUpdate=!0,this.object.instanceColor&&(this.object.instanceColor.needsUpdate=!0),O.needsUpdate=!0,E>0&&(this.object.computeBoundingSphere(),this.object.boundingSphere.radius+=Math.hypot(te,T)*Math.max(1,ce)+.5),this.count=E}get castShadow(){return this.object.castShadow}set castShadow(e){this.object.castShadow=!!e,this._uniforms.uShadowSkip.value=+!!e,this._uniforms.uShadowSkipBias.value=e?.03:0}get receiveShadow(){return this.object.receiveShadow}set receiveShadow(e){this.object.receiveShadow=!!e}get wind(){return this._uniforms.uFoliageWind.value}set wind(e){this._uniforms.uFoliageWind.value=e}update(){}dispose(){this.object.parent&&this.object.parent.remove(this.object),this.object.geometry.dispose(),this.material.dispose(),this.depthMaterial.dispose(),this._ownsTexture&&this.texture.dispose(),this.object.dispose()}},er=`
uniform vec3 uSunDirection;
uniform float uSteepness;
uniform float uUseSun;
uniform vec3 uAxis;
uniform float uLength;
uniform float uWidth;
uniform float uTopWidth;

varying vec2 vUv;
varying vec3 vWorld;
varying float vAxisView;

#include <fog_pars_vertex>

void main() {
  vec3 toLight;
  if (uUseSun > 0.5) {
    vec3 s = normalize(uSunDirection);
    float hl = length(s.xz);
    vec2 hd = hl > 1e-4 ? s.xz / hl : vec2(0.0, 1.0);
    float el = asin(clamp(s.y, -1.0, 1.0));
    el = max(el, 0.12);
    el = mix(el, 1.5707963, uSteepness);
    toLight = vec3(hd.x * cos(el), sin(el), hd.y * cos(el));
  } else {
    toLight = -normalize(uAxis);
  }

  vec3 base = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float u = position.x;           // -0.5 .. 0.5 across
  float v = position.y;           // 0 (ground) .. 1 (top)
  vec3 c = base + toLight * (v * uLength);
  vec3 view = normalize(cameraPosition - c);
  vec3 side = cross(toLight, view);
  float sl = length(side);
  side = sl > 1e-4 ? side / sl : vec3(1.0, 0.0, 0.0);
  float w = uWidth * mix(1.0, uTopWidth, v);
  vec3 wp = c + side * (u * w);

  vUv = vec2(u * 2.0, v);
  vWorld = wp;
  vAxisView = abs(dot(view, toLight));

  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,tr=`
uniform vec3 uSunColor;
uniform vec3 uSunDirection;
uniform vec3 uColor;
uniform float uNight;
uniform float uTime;
uniform float uIntensity;
uniform float uGlobalIntensity;
uniform float uNightStrength;
uniform float uSeed;
uniform float uGroundY;
uniform float uFadeHeight;
uniform float uLength;
uniform vec2 uNearFade;
uniform vec2 uHorizonFade;
uniform float uGain;

varying vec2 vUv;
varying vec3 vWorld;
varying float vAxisView;

#include <fog_pars_fragment>

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
             mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  float x = vUv.x;                       // -1 .. 1 across
  float v = vUv.y;                       // 0 bottom .. 1 top
  float across = exp(-x * x * 3.2) - 0.04;
  across = max(across, 0.0) / 0.96;

  float topFade = 1.0 - smoothstep(0.5, 1.0, v);
  float groundFade = smoothstep(uGroundY - 0.2, uGroundY + uFadeHeight, vWorld.y);
  float mid = mix(0.75, 1.0, smoothstep(0.1, 0.55, v));

  // Streaks parallel to the beam, drifting slowly.
  float along = v * uLength;
  float s1 = vnoise(vec2(x * 2.6 + uSeed * 7.1 + uTime * 0.05, along * 0.09 - uTime * 0.12));
  float s2 = vnoise(vec2(x * 6.3 - uSeed * 3.7 - uTime * 0.08, along * 0.16 - uTime * 0.21));
  float streak = 0.3 + 0.7 * smoothstep(0.15, 0.85, s1 * 0.62 + s2 * 0.38);
  // Slow breathing so the scene feels alive.
  float breathe = 0.82 + 0.18 * sin(uTime * 0.35 + uSeed * 6.2831);

  float axisFade = 1.0 - smoothstep(0.82, 0.98, vAxisView);
  float camDist = distance(cameraPosition, vWorld);
  float nearFade = smoothstep(uNearFade.x, uNearFade.y, camDist);

  float sunY = normalize(uSunDirection).y;
  // Strongest with a low sun (golden hour / morning), weaker at noon, gone as the sun sets.
  float lowSun = mix(0.4, 1.0, 1.0 - smoothstep(0.3, 0.8, sunY)) * smoothstep(uHorizonFade.x, uHorizonFade.y, sunY);
  float dayMix = mix(uNightStrength, 1.0, 1.0 - uNight);

  float a = across * topFade * groundFade * mid * streak * breathe * axisFade * nearFade
          * lowSun * dayMix * uIntensity * uGlobalIntensity;

  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    a *= 1.0 - fogF;
  #endif

  // Slightly desaturated sun colour: beams read as pale warm light, not orange paint.
  vec3 sunCol = mix(vec3(dot(uSunColor, vec3(0.3, 0.59, 0.11))), uSunColor, 0.72);
  vec3 col = sunCol * uColor * (a * uGain);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`,nr=null,rr=0;function ir(){return nr||(nr=new ie(1,1,1,6),nr.translate(0,.5,0),nr.name=`GodRayShaft`),rr++,nr}function ar(){rr--,rr<=0&&nr&&(nr.dispose(),nr=null,rr=0)}var or=class{constructor({steepness:e=.45,color:t=16773592,nightStrength:n=0,nearFade:r=[5,13],fadeHeight:i=2.2,gain:a=.28,horizonFade:s=[.19,.27]}={}){this.object=new o,this.object.name=`GodRays`,this.shafts=[],this.fadeHeight=i,this._shared={uTime:{value:0},uGlobalIntensity:{value:1},uSteepness:{value:e},uNightStrength:{value:n},uNearFade:{value:new l(r[0],r[1])},uGain:{value:a},uHorizonFade:{value:new l(s[0],s[1])},uTint:new j(t),fog:M.clone(ue.fog)}}get intensity(){return this._shared.uGlobalIntensity.value}set intensity(e){this._shared.uGlobalIntensity.value=e}get steepness(){return this._shared.uSteepness.value}set steepness(e){this._shared.uSteepness.value=e}addShaft({position:e,direction:t,length:n=14,width:r=3,intensity:i=1,color:a,topWidth:o=.7,seed:s}={}){let c=this._shared,l={uSunDirection:L.uSunDirection,uSunColor:L.uSunColor,uNight:L.uNight,uTime:c.uTime,uGlobalIntensity:c.uGlobalIntensity,uSteepness:c.uSteepness,uNightStrength:c.uNightStrength,uNearFade:c.uNearFade,uGain:c.uGain,uHorizonFade:c.uHorizonFade,fogColor:c.fog.fogColor,fogDensity:c.fog.fogDensity,fogNear:c.fog.fogNear,fogFar:c.fog.fogFar,uFogStart:L.uFogStart,uUseSun:{value:+!t},uAxis:{value:t?new E().copy(t).normalize():new E(0,-1,0)},uLength:{value:n},uWidth:{value:r},uTopWidth:{value:o},uIntensity:{value:i},uColor:{value:a===void 0?c.uTint.clone():new j(a)},uSeed:{value:s??this.shafts.length*.618+.13},uGroundY:{value:e?e.y:0},uFadeHeight:{value:this.fadeHeight}},u=new C({name:`GodRayMaterial`,uniforms:l,vertexShader:er,fragmentShader:tr,transparent:!0,depthWrite:!1,depthTest:!0,blending:2,side:2,fog:!0});u.forceSinglePass=!0,u.blendEquation=100,u.blendSrc=201,u.blendDst=203;let d=new g(ir(),u);d.name=`GodRayShaft`;let f=new O;d.frustumCulled=!0,d.intersectsFrustum=function(e){return f.center.setFromMatrixPosition(this.matrixWorld),f.radius=l.uLength.value+l.uWidth.value*.5+.1,typeof e.intersectsSphere!=`function`||e.intersectsSphere(f)},d.renderOrder=le.GODRAYS,d.castShadow=!1,d.receiveShadow=!1,d.onBeforeRender=e=>{u.blending=e.getRenderTarget()===null?5:2},e&&d.position.set(e.x,e.y,e.z),this.object.add(d);let p=this.shafts,m=!1,h={mesh:d,get intensity(){return l.uIntensity.value},set intensity(e){l.uIntensity.value=e},dispose(){if(m)return;m=!0;let e=p.indexOf(h);e>=0&&p.splice(e,1),d.removeFromParent(),u.dispose(),ar()}};return p.push(h),h}populate(e,t,n=7){let r=new pe(n),i=e.maxX-e.minX,a=e.maxZ-e.minZ,o=Math.max(1,Math.round(Math.sqrt(t*i/Math.max(a,.001)))),s=Math.max(1,Math.ceil(t/o)),c=[];for(let e=0;e<s;e++)for(let t=0;t<o;t++)c.push([t,e]);r.shuffle(c);let l=[];for(let n=0;n<t;n++){let[t,u]=c[n%c.length],d=e.minX+(t+r.range(.15,.85))/o*i,f=e.minZ+(u+r.range(.15,.85))/s*a;l.push(this.addShaft({position:new E(d,e.y??0,f),length:r.range(11,17),width:r.range(1.4,3.4),intensity:r.range(.55,1),topWidth:r.range(.55,.85),seed:r.range(0,10)}))}return l}update(e){this._shared.uTime.value+=e}dispose(){for(let e of[...this.shafts])e.dispose();this.object.removeFromParent()}},sr=`
varying vec3 vDir;

void main() {
  vDir = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  // Pin the dome to (just inside) the far plane whatever the camera far plane is: it never clips and,
  // with the depth test on, it only fills pixels no opaque geometry has covered.
  #ifdef USE_REVERSED_DEPTH_BUFFER
    gl_Position.z = gl_Position.w * 1e-5;
  #else
    gl_Position.z = gl_Position.w * 0.99999;
  #endif
}
`,cr=`
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uBottom;
uniform vec3 uSunDir;
uniform vec3 uMoonDir;
uniform vec3 uSunColor;
uniform float uNight;
uniform float uGlow;
uniform float uClouds;
uniform float uLowerClouds;
uniform float uTime;
uniform float uStarDensity;
uniform float uSunSize;
uniform float uMoonSize;
uniform float uSunIntensity;
uniform float uCloudPixel;
uniform vec2 uWind;
uniform float uAurora;

varying vec3 vDir;

#define TAU 6.28318530718

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm4(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec2(17.13, 3.71);
    a *= 0.5;
  }
  return s / 0.9375;
}

vec3 skyGradient(float y) {
  if (y >= 0.0) {
    float t = smoothstep(0.0, 1.0, pow(clamp(y, 0.0, 1.0), 0.5));
    return mix(uHorizon, uTop, t);
  }
  // Below the horizon: a thick band of horizon haze that slowly sinks into the bottom colour.
  float t = clamp(-y / 0.9, 0.0, 1.0);
  return mix(uHorizon, uBottom, smoothstep(0.0, 1.0, pow(t, 0.8)));
}

// Tangent-plane coordinates of direction d around centre c, in units of radius r.
vec2 discCoord(vec3 d, vec3 c, float r) {
  vec3 t1 = cross(c, vec3(0.0, 1.0, 0.0));
  t1 = length(t1) < 1e-4 ? vec3(1.0, 0.0, 0.0) : normalize(t1);
  vec3 t2 = cross(t1, c);
  return vec2(dot(d, t1), dot(d, t2)) / r;
}

// Snap a direction to a lat/long pixel grid with ~square cells (P cells per radian).
vec3 quantDir(float lat, float lon, float P) {
  float latQ = (floor(lat * P) + 0.5) / P;
  float cl = max(cos(latQ), 0.05);
  float lonQ = (floor(lon * P * cl) + 0.5) / (P * cl);
  float c = cos(latQ);
  return vec3(c * cos(lonQ), sin(latQ), c * sin(lonQ));
}

// Stars on a latitude/longitude grid with ~square cells (cells per row follow cos(latitude)).
vec3 stars(float lat, float lon) {
  float N = uStarDensity;
  // Fine 1-px stars
  float row = floor(lat * N);
  float rowLat = (row + 0.5) / N;
  float cells = max(1.0, floor(TAU * N * cos(rowLat)));
  vec2 cell = vec2(floor((lon / TAU + 0.5) * cells), row);
  float h = hash12(cell);
  float star = step(0.9962, h);
  float tw = 0.55 + 0.45 * sin(uTime * (1.2 + 3.5 * fract(h * 37.0)) + h * 91.0);
  // Mostly faint stars with a few bright ones (a uniform spread made every star bloom).
  float mag = fract(h * 113.0);
  float b = star * tw * (0.3 + 1.6 * mag * mag * mag);
  vec3 tint = mix(vec3(0.72, 0.82, 1.0), vec3(1.0, 0.88, 0.72), step(0.6, fract(h * 7.0)));
  vec3 col = tint * b;

  // Coarse cells with a plus-shaped bright star (5x5 px pattern)
  float N2 = N / 5.0;
  float row2 = floor(lat * N2);
  float rowLat2 = (row2 + 0.5) / N2;
  float cells2 = max(1.0, floor(TAU * N2 * cos(rowLat2)));
  float u2 = (lon / TAU + 0.5) * cells2;
  float v2 = lat * N2;
  float h2 = hash12(vec2(floor(u2), row2) + 71.3);
  vec2 f = floor(vec2(fract(u2), fract(v2)) * 5.0);
  float m = abs(f.x - 2.0) + abs(f.y - 2.0);
  float centre = step(m, 0.5);
  float arm = step(m, 1.5) - centre;
  float tw2 = 0.6 + 0.4 * sin(uTime * (0.7 + 1.8 * h2) + h2 * 50.0);
  float big = step(0.991, h2) * (centre * 2.2 + arm * 0.6) * tw2;
  vec3 tint2 = mix(vec3(0.8, 0.88, 1.0), vec3(1.0, 0.92, 0.78), step(0.5, fract(h2 * 13.0)));
  col += tint2 * big;
  return col;
}

vec3 aurora(vec3 q) {
  float u = atan(q.x, -q.z);
  float t = uTime * 0.03;
  float h = (q.y - 0.07 - 0.04 * sin(u * 1.7 + t * 2.0) - 0.025 * sin(u * 4.3 - t * 3.1)) / 0.45;
  if (h < 0.0 || h > 1.0) return vec3(0.0);
  float ray = vnoise(vec2(u * 70.0 + t * 9.0, t * 0.7));
  ray = ray * ray * 1.5 + 0.3 * vnoise(vec2(u * 17.0 - t * 4.0, 2.0));
  float a = smoothstep(0.0, 0.04, h) * exp(-h * 3.0) * ray * (0.35 + 0.65 * smoothstep(-0.4, 0.8, sin(u * 2.3 + t * 1.2)))
    * smoothstep(-0.6, 0.3, cos(u));
  vec3 c = mix(vec3(0.25, 1.0, 0.63), vec3(0.05, 0.75, 0.39), smoothstep(0.0, 0.15, h));
  c = mix(mix(c, vec3(0.2, 0.11, 1.0), smoothstep(0.25, 0.6, h)), vec3(0.58, 0.14, 1.0), smoothstep(0.75, 0.95, h));
  return c * floor(clamp(a, 0.0, 1.0) * 6.0 + 0.5) / 6.0;
}

void main() {
  vec3 d = normalize(vDir);
  float y = d.y;
  vec3 col = skyGradient(y);

  vec3 sunDir = normalize(uSunDir);
  vec3 moonDir = normalize(uMoonDir);
  float lat = asin(clamp(y, -1.0, 1.0));
  float lon = atan(d.z, d.x);

  // ---------------------------------------------------------------- sun glow
  float cs = dot(d, sunDir);
  float cs0 = max(cs, 0.0);
  float sunUp = smoothstep(-0.3, 0.02, sunDir.y);
  float halo = pow(cs0, 8.0) * 0.1 + pow(cs0, 42.0) * 0.28 + pow(cs0, 600.0) * 1.1;
  vec2 dh = d.xz / max(length(d.xz), 1e-4);
  vec2 shz = sunDir.xz / max(length(sunDir.xz), 1e-4);
  float az = dot(dh, shz) * 0.5 + 0.5;
  float lowSun = 1.0 - smoothstep(0.02, 0.6, sunDir.y);
  float band = exp(-abs(y) * 8.0) * pow(az, 3.0) * lowSun;
  vec3 glowCol = uSunColor * uGlow;
  col += glowCol * (halo + band * 0.32) * sunUp;

  // Cloud pixel grid (constant on-screen size), shared by both cloud layers.
  vec3 qd = quantDir(lat, lon, uCloudPixel);

  if (y > 0.0) {
    // ------------------------------------------------------------- stars
    float starMask = uNight * uNight * smoothstep(0.03, 0.35, y);
    if (starMask > 0.002) col += stars(lat, lon) * starMask;
    if (uAurora > 0.001) col += aurora(qd) * uAurora;

    // -------------------------------------- moon (pixel disc, gibbous, halo)
    float cm = dot(d, moonDir);
    float moonVis = smoothstep(0.25, 0.8, uNight) * smoothstep(-0.02, 0.08, moonDir.y);
    if (moonVis > 0.001 && cm > 0.0) {
      vec2 mp = discCoord(d, moonDir, uMoonSize);
      vec2 mcell = floor(mp * 7.0);
      vec2 mq = (mcell + 0.5) / 7.0;
      float inside = step(length(mq), 1.0);
      float mottle = hash12(mcell + 13.0);
      float crater = step(0.78, mottle) * 0.22 + step(0.93, mottle) * 0.12;
      float phase = smoothstep(0.35, 0.95, length(mq - vec2(-0.55, 0.25)));
      // Kept below the bloom-saturation point so the pixel craters and the gibbous phase read.
      vec3 moonCol = vec3(0.84, 0.9, 1.0) * (0.95 - crater * 1.3) * mix(0.22, 1.0, phase);
      col = mix(col, moonCol, inside * moonVis);
      float cm0 = max(cm, 0.0);
      col += vec3(0.45, 0.58, 1.0) * (pow(cm0, 2500.0) * 0.3 + pow(cm0, 200.0) * 0.08 + pow(cm0, 12.0) * 0.025) * moonVis;
    }

    // ------------------------------------ sun disc (pixel-crisp, HDR bloom)
    if (cs > 0.0) {
      vec2 sp = discCoord(d, sunDir, uSunSize);
      vec2 sq = (floor(sp * 6.0) + 0.5) / 6.0;
      float r = length(sq);
      float sIn = step(r, 1.0);
      float rim = step(0.8, r);
      col += uSunColor * sIn * mix(1.0, 0.55, rim) * uSunIntensity * sunUp * smoothstep(-0.005, 0.01, y);
    }

    // --------------------------- clouds (plane overhead, lit from the sun side)
    if (uClouds > 0.001) {
      vec2 cp = qd.xz / (max(qd.y, 0.0) + 0.15) * 2.4 + uWind * uTime;
      float n = fbm4(cp * 1.2);
      float c = smoothstep(1.0 - uClouds - 0.08, 1.0 - uClouds + 0.2, n);
      float n2 = fbm4((cp + shz * 0.16) * 1.2);
      float lit = clamp(0.55 + (n - n2) * 5.0, 0.0, 1.0);
      c = floor(c * 3.0 + 0.5) / 3.0;
      lit = floor(lit * 3.0 + 0.5) / 3.0;
      float moonLit = pow(max(dot(d, moonDir), 0.0), 6.0) * smoothstep(0.3, 0.9, uNight);
      vec3 shade = mix(mix(uTop, uHorizon, 0.5) * 0.95, uTop * 0.8, uNight);
      vec3 litCol = mix(uHorizon * 1.12, mix(uTop, uHorizon, 0.55) + vec3(0.05, 0.07, 0.12) * moonLit, uNight)
                  + glowCol * (0.12 + pow(cs0, 4.0) * 0.8) * sunUp;
      vec3 cloudCol = mix(shade, litCol, lit);
      float fade = smoothstep(0.0, 0.22, y);
      col = mix(col, cloudCol, c * fade * mix(0.9, 0.55, uNight));
    }
  } else if (uLowerClouds > 0.001) {
    // ------------------------------------------------------ sea of clouds below
    vec2 lp = qd.xz / (max(-qd.y, 0.0) + 0.07) * 0.6 + uWind * uTime * 0.6 + vec2(37.0, 11.0);
    float n = fbm4(lp);
    float c = smoothstep(0.42, 0.74, n);
    float n2 = fbm4(lp + shz * 0.12);
    float lit = clamp(0.5 + (n - n2) * 5.0, 0.0, 1.0);
    lit = floor(lit * 3.0 + 0.5) / 3.0;
    c = floor(c * 3.0 + 0.5) / 3.0;
    vec3 topCol = uHorizon * 1.08 + glowCol * (0.06 + band * 0.25) * sunUp;
    vec3 shadeCol = mix(uBottom, uHorizon, 0.5);
    vec3 cc = mix(shadeCol, topCol, 0.3 + lit * 0.7);
    float distFade = smoothstep(0.0, 0.16, -y);
    col = mix(col, cc, c * uLowerClouds * distFade);
  }

  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`,lr=new E,ur=class e{constructor({radius:t=180,cloudCover:n=.45,lowerClouds:r=.5,starDensity:i=1100,sunSize:a=.032,moonSize:o=.026,sunIntensity:s=9,cloudPixel:c=380,wind:u=[.012,.004],earlyZ:d=!0}={}){this.radius=t,this.uniforms={uTop:{value:new j(3833568)},uHorizon:{value:new j(12902642)},uBottom:{value:new j(9417936)},uSunDir:{value:new E(.3,.6,-.5).normalize()},uMoonDir:{value:new E(-.3,.6,-.5).normalize()},uSunColor:{value:new j(1,.9,.75)},uNight:{value:0},uGlow:{value:1},uClouds:{value:n},uLowerClouds:{value:r},uTime:{value:0},uStarDensity:{value:i},uSunSize:{value:a},uMoonSize:{value:o},uSunIntensity:{value:s},uCloudPixel:{value:c},uWind:{value:new l(u[0],u[1])},uAurora:{value:0}},this.material=new C({name:`SkyMaterial`,uniforms:this.uniforms,vertexShader:sr,fragmentShader:cr,side:1,depthWrite:!1,depthTest:d,fog:!1,toneMapped:!0}),this.geometry=new w(t,48,24);let f=new g(this.geometry,this.material);f.name=`Sky`,f.renderOrder=d?e.EARLY_Z_RENDER_ORDER:-1e3,f.frustumCulled=!1,f.castShadow=!1,f.receiveShadow=!1,f.matrixAutoUpdate=!1,f.onBeforeRender=(e,t,n)=>{lr.setFromMatrixPosition(n.matrixWorld),f.position.copy(lr),f.updateMatrix(),f.matrixWorld.copy(f.matrix)},this.object=f}setState({top:e,horizon:t,bottom:n,sunDirection:r,sunColor:i,night:a,moonDirection:o,glow:s,clouds:c}={}){let l=this.uniforms;e&&l.uTop.value.copy(e),t&&l.uHorizon.value.copy(t),n&&l.uBottom.value.copy(n),r&&l.uSunDir.value.copy(r),i&&l.uSunColor.value.copy(i),a!==void 0&&(l.uNight.value=a),o&&l.uMoonDir.value.copy(o),s!==void 0&&(l.uGlow.value=s),c!==void 0&&(l.uClouds.value=c)}get cloudCover(){return this.uniforms.uClouds.value}set cloudCover(e){this.uniforms.uClouds.value=e}get lowerClouds(){return this.uniforms.uLowerClouds.value}set lowerClouds(e){this.uniforms.uLowerClouds.value=e}update(e){this.uniforms.uTime.value+=e}dispose(){this.geometry.dispose(),this.material.dispose()}};ur.EARLY_Z_RENDER_ORDER=1e6;var dr=[{t:0,name:`night`,top:`#050a1f`,horizon:`#1b2a5c`,bottom:`#0a1232`,sun:`#7294ff`,sunI:.85,hemiSky:`#2a48b4`,hemiGround:`#101430`,hemiI:1.12,fog:.011,exp:1.3,night:1,moon:1,shadow:.6,glow:.4,clouds:.3},{t:4.3,name:`late night`,top:`#070c24`,horizon:`#213062`,bottom:`#0d1436`,sun:`#7a98ff`,sunI:.72,hemiSky:`#2e4ab0`,hemiGround:`#121632`,hemiI:1.1,fog:.0115,exp:1.3,night:1,moon:1,shadow:.58,glow:.5,clouds:.34},{t:5.25,name:`pre-dawn`,top:`#18204e`,horizon:`#5c5a92`,bottom:`#282852`,sun:`#a0a6ea`,sunI:.16,hemiSky:`#5460a8`,hemiGround:`#221e38`,hemiI:1.05,fog:.014,exp:1.26,night:.86,moon:1,shadow:.35,glow:.8,clouds:.45},{t:6.1,name:`pink dawn`,top:`#3c5098`,horizon:`#f59aa0`,bottom:`#8a6aa0`,sun:`#ff7c6a`,sunI:2.3,hemiSky:`#9a86d2`,hemiGround:`#6a4450`,hemiI:.98,fog:.012,exp:1.08,night:.3,moon:0,shadow:.85,glow:1,clouds:.45},{t:6.9,name:`sunrise`,top:`#4a74c4`,horizon:`#f8c0a0`,bottom:`#a08aa8`,sun:`#ffb88a`,sunI:2.8,hemiSky:`#98aee0`,hemiGround:`#6e5048`,hemiI:1.05,fog:.013,exp:1.06,night:.06,moon:0,shadow:.95,glow:1,clouds:.44},{t:8,name:`morning`,top:`#4f86d6`,horizon:`#d6e6f0`,bottom:`#9cb6cc`,sun:`#ffe6c0`,sunI:3.2,hemiSky:`#a2c2ec`,hemiGround:`#6e5c46`,hemiI:1.05,fog:.011,exp:1.02,night:0,moon:0,shadow:1,glow:.8,clouds:.42},{t:12.2,name:`noon`,top:`#3a7ee0`,horizon:`#c4e0f2`,bottom:`#8fb4d0`,sun:`#fff4e2`,sunI:3.5,hemiSky:`#a6c8f2`,hemiGround:`#72624a`,hemiI:1.1,fog:.009,exp:1,night:0,moon:0,shadow:1,glow:.7,clouds:.38},{t:15.3,name:`afternoon`,top:`#4880d8`,horizon:`#dde2da`,bottom:`#9eb0c0`,sun:`#ffe0b0`,sunI:3.6,hemiSky:`#9cb8e8`,hemiGround:`#786248`,hemiI:1.1,fog:.0095,exp:1,night:0,moon:0,shadow:1,glow:.8,clouds:.42},{t:17.2,name:`golden hour`,top:`#3e4c9a`,horizon:`#f7a068`,bottom:`#a0628a`,sun:`#ffb466`,sunI:6,hemiSky:`#7078cc`,hemiGround:`#9a6444`,hemiI:1.45,fog:.0098,exp:1.12,night:0,moon:0,shadow:1,glow:1,clouds:.48},{t:18.45,name:`sunset`,top:`#2a2a70`,horizon:`#ec7e6c`,bottom:`#643a70`,sun:`#ff8050`,sunI:3.1,hemiSky:`#6c5ec4`,hemiGround:`#4c2e44`,hemiI:1.2,fog:.0112,exp:1.12,night:.22,moon:0,shadow:.85,glow:1.3,clouds:.5},{t:19.25,name:`purple dusk`,top:`#1a1c54`,horizon:`#8a5a9e`,bottom:`#2c2052`,sun:`#c07aaa`,sunI:.3,hemiSky:`#4c4ea8`,hemiGround:`#2a1c36`,hemiI:1.15,fog:.013,exp:1.28,night:.62,moon:0,shadow:.5,glow:.9,clouds:.46},{t:20.05,name:`blue hour`,top:`#0b1240`,horizon:`#2c3e82`,bottom:`#111a40`,sun:`#7090f4`,sunI:.38,hemiSky:`#304cae`,hemiGround:`#12152e`,hemiI:1.08,fog:.0125,exp:1.28,night:.92,moon:1,shadow:.5,glow:.5,clouds:.42},{t:21.4,name:`night`,top:`#060b20`,horizon:`#1c2b5c`,bottom:`#0b1332`,sun:`#7294ff`,sunI:.82,hemiSky:`#2a48b4`,hemiGround:`#101430`,hemiI:1.12,fog:.011,exp:1.3,night:1,moon:1,shadow:.6,glow:.4,clouds:.3}],fr=[`top`,`horizon`,`bottom`,`sun`,`hemiSky`,`hemiGround`],pr=[`sunI`,`hemiI`,`fog`,`exp`,`night`,`moon`,`shadow`,`glow`,`clouds`],mr=fr.length*3+pr.length,hr=fr.length*3,gr=Object.fromEntries(pr.map((e,t)=>[e,hr+t])),_r=3.5,vr=class{constructor(e,t,n,r=24){let i=e.length;this.n=i,this.channels=n,this.period=r,this.t=new Float64Array(i+1),this.y=new Float64Array((i+1)*n),this.m=new Float64Array((i+1)*n);for(let t=0;t<i;t++)this.t[t]=e[t];this.t[i]=e[0]+r,this.y.set(t.subarray(0,i*n)),this.y.set(t.subarray(0,n),i*n);let a=new Float64Array(i);for(let e=0;e<i;e++)a[e]=this.t[e+1]-this.t[e];let o=new Float64Array(i);for(let e=0;e<n;e++){for(let t=0;t<i;t++)o[t]=(this.y[(t+1)*n+e]-this.y[t*n+e])/a[t];for(let t=0;t<i;t++){let r=(t-1+i)%i,s=o[r],c=o[t],l=0;if(s*c>0){let e=a[r],n=a[t],i=2*n+e,o=n+2*e;l=(i+o)/(i/s+o/c)}this.m[t*n+e]=l}this.m[i*n+e]=this.m[e]}}evaluate(e,t){let{n,channels:r,t:i}=this,a=e-i[0];a=(a%this.period+this.period)%this.period+i[0];let o=0;for(;o<n-1&&a>=i[o+1];)o++;let s=i[o+1]-i[o],c=(a-i[o])/s,l=c*c,u=l*c,d=2*u-3*l+1,f=(u-2*l+c)*s,p=-2*u+3*l,m=(u-l)*s,h=o*r,g=(o+1)*r;for(let e=0;e<r;e++)t[e]=d*this.y[h+e]+f*this.m[h+e]+p*this.y[g+e]+m*this.m[g+e];return t}};function yr(e,t,n,r){let i=(e-t.noon)/24*Math.PI*2,a=t.lat*F,o=t.dec*F,s=Math.cos(o),c=Math.sin(o),l=Math.cos(i),u=Math.sin(i),d=Math.sin(a),f=Math.cos(a),p=-s*u,m=c*d+s*l*f,h=-c*f+s*l*d,g=Math.cos(n),_=Math.sin(n);return r.set(p*g+h*_,m,-p*_+h*g).normalize()}function br(e,t,n){let r=yr(t,e,0,new E);return n*F-Math.atan2(r.x,r.z)}var xr=(e,t,n)=>.5*(e+t+Math.sqrt((e-t)*(e-t)+n*n)),Sr=(e,t,n)=>.5*(e+t-Math.sqrt((e-t)*(e-t)+n*n));function Cr(e){return e=(e+Math.PI)%(Math.PI*2),e<0&&(e+=Math.PI*2),e-Math.PI}function wr(e,t){let n=Math.floor(e),r=e-n,i=r*r*(3-2*r);return I(de(n,0,t),de(n+1,0,t),i)}function Tr(e,t){return wr(e,t)*.55+wr(e*2.37+11.3,t+17)*.3+wr(e*5.13+3.1,t+41)*.15}var Er=new E,Dr=new E,Or=new E,kr=new E,Ar=new E,jr=(e,t)=>t.setStyle(e,D),Mr=class{constructor(e,t={}){this.name=`lighting`,this.engine=e,this.renderer=e.renderer,this.scene=e.scene,this.camera=e.camera,this.timeOfDay=((t.timeOfDay??17.2)%24+24)%24,this.timeSpeed=t.timeSpeed??0,this.paused=!1,this.settings={sunMul:1,ambientMul:1,fogMul:1,shadows:!0,exposureMul:1,pointLightMul:1,flicker:!0,backdrop:null},this._clearBefore=null,this._backdropApplied=null,this.shadowMapSize=t.shadowMapSize??2048,this._shadowExtent=t.shadowExtent??22,this.lightDistance=t.lightDistance??70,this.minElevation=(t.minElevation??10)*F,this.maxElevation=(t.maxElevation??68)*F,this.followPlaneY=t.followPlaneY??0,this.shadowForward=t.shadowForward??.22,this.shadowRadius={day:2.5,night:3.2},this.sunPath={noon:12.4,lat:45,dec:5,refTime:17.2,refAzimuth:-125,...t.sunPath||{}},this.moonPath={noon:23.6,lat:45,dec:2,refTime:0,refAzimuth:140,...t.moonPath||{}},this._sunYaw=br(this.sunPath,this.sunPath.refTime,this.sunPath.refAzimuth),this._moonYaw=br(this.moonPath,this.moonPath.refTime,this.moonPath.refAzimuth),this.group=new o,this.group.name=`LightingSystem`,this.sun=new p(16777215,3),this.sun.name=`Sun`,this.sun.castShadow=!0;let n=this.sun.shadow;n.mapSize.set(this.shadowMapSize,this.shadowMapSize),n.bias=-2e-4,n.normalBias=.055,n.radius=this.shadowRadius.day,n.camera.near=1,n.camera.far=this.lightDistance*2.4,this._applyShadowExtent(),this.group.add(this.sun,this.sun.target),this.hemi=new u(10535167,6309944,1),this.hemi.name=`Hemisphere`,this.hemi.position.set(0,1,0),this.group.add(this.hemi),this.pointLightGroup=new o,this.pointLightGroup.name=`PointLights`,this.group.add(this.pointLightGroup),this.sky=new ur(t.sky),this.scene.add(this.group),this.scene.add(this.sky.object),this.fog=new T(10465480,.012),this._previousFog=this.scene.fog,this.scene.fog=this.fog,this.renderer?.shadowMap&&(this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type===2&&(this.renderer.shadowMap.type=1)),this._values=new Float64Array(mr),this.setKeyframes(t.keyframes??dr),this.state={skyTop:new j,skyHorizon:new j,skyBottom:new j,sunColor:new j,hemiSky:new j,hemiGround:new j,sunIntensity:0,hemiIntensity:0,fogDensity:0,exposure:1,night:0,moonBlend:0,shadowIntensity:1,glow:1,clouds:.4,sunElevation:0,lightElevation:0},this._sunDir=new E(0,1,0),this._moonDir=new E(0,1,0),this._lightDir=new E(0,1,0),this._skyState={top:this.state.skyTop,horizon:this.state.skyHorizon,bottom:this.state.skyBottom,sunDirection:this._sunDir,moonDirection:this._moonDir,sunColor:new j,night:0,glow:1,clouds:.4},this._follow=null,this._clock=0,this._pointLights=[],this._unindexed=new Set,this._emissives=[],this._nightFactor=0,this._apply(0)}setTime(e){this.timeOfDay=(e%24+24)%24,this._apply(0)}get nightFactor(){return this._nightFactor}get phaseName(){let e=``,t=1/0,n=this.timeOfDay;for(let r=0;r<this.keyframes.length;r++){let i=this.keyframes[r],a=Math.min(Math.abs(i.t-n),24-Math.abs(i.t-n));a<t&&(t=a,e=i.name??``)}return e}get sunDirection(){return this._lightDir}get trueSunDirection(){return this._sunDir}get moonDirection(){return this._moonDir}get shadowExtent(){return this._shadowExtent}set shadowExtent(e){this._shadowExtent=e,this._applyShadowExtent()}setShadowDepthRange(e,t){let n=this.sun.shadow.camera;this._shadowBase??={near:n.near,far:n.far,bias:this.sun.shadow.bias};let r=this._shadowBase;e==null||t==null?(n.near=r.near,n.far=r.far,this.sun.shadow.bias=r.bias):(n.near=Math.max(.1,this.lightDistance-e),n.far=Math.max(n.near+1,this.lightDistance+t),this.sun.shadow.bias=r.bias*((r.far-r.near)/(n.far-n.near))),n.updateProjectionMatrix()}_setBackdrop(e){this.sky.object.visible=!e,this._backdropApplied=e?(this._backdropApplied??new j).copy(e):null;let t=this.renderer;if(t){if(e){if(!this._clearBefore){let e=new j;t.getClearColor(e),this._clearBefore={color:e,alpha:t.getClearAlpha()}}t.setClearColor(e,1)}else this._clearBefore&&=(t.setClearColor(this._clearBefore.color,this._clearBefore.alpha),null)}}followTarget(e){this._follow=e||null}setKeyframes(e){let t=[...e].sort((e,t)=>e.t-t.t);this.keyframes=t;let n=new Float64Array(t.length*mr),r=new j;t.forEach((e,t)=>{let i=dr.reduce((t,n)=>Math.abs(n.t-e.t)<Math.abs(t.t-e.t)?n:t);fr.forEach((a,o)=>{let s=e[a]??i[a];typeof s==`number`?r.setHex(s,D):jr(s,r),n[t*mr+o*3]=r.r,n[t*mr+o*3+1]=r.g,n[t*mr+o*3+2]=r.b}),pr.forEach((r,a)=>{n[t*mr+hr+a]=e[r]??i[r]})}),this._track=new vr(t.map(e=>(e.t%24+24)%24),n,mr,24),this.state&&this._apply(0)}addPointLight({position:e,color:t=16757867,intensity:n=8,distance:r=8,decay:i=2,flicker:a=.3,nightOnly:o=!0,dayIntensity:s=.15,seed:c,flickerSpeed:l=2.6,indexed:u=!0}={}){let d=new S(t,0,r,i);d.castShadow=!1,e&&d.position.set(e.x,e.y,e.z),this.pointLightGroup.add(d);let f=this._pointLights.length-this._unindexed.size,p=this,m={light:d,intensity:n,flicker:a,nightOnly:o,dayIntensity:s,flickerSpeed:l,seed:c??f*7919+13>>>0,flickerFactor:1,fade:1,dispose(){let e=p._pointLights.indexOf(m);e>=0&&p._pointLights.splice(e,1),p._unindexed.delete(m),d.removeFromParent(),d.dispose()}};return this._pointLights.push(m),u||this._unindexed.add(m),this._updatePointLight(m),m}retargetPointLight(e,t={}){let n=e.light;t.position&&n.position.set(t.position.x,t.position.y,t.position.z),t.color!==void 0&&n.color.set(t.color),t.distance!==void 0&&(n.distance=t.distance),t.decay!==void 0&&(n.decay=t.decay);for(let n of[`intensity`,`flicker`,`nightOnly`,`dayIntensity`,`seed`,`flickerSpeed`])t[n]!==void 0&&(e[n]=t[n]);return this._updatePointLight(e),e}flickerAt(e,t,n=2.6){if(!this.settings.flicker||!(t>0))return 1;let r=Tr(this._clock*n,e);return Math.max(0,1+t*(r-.5)*1.7)}registerEmissive(e,{day:t=0,night:n=1.6,flicker:r=null}={}){let i=this,a={material:e,day:t,night:n,flicker:r,dispose(){let e=i._emissives.indexOf(a);e>=0&&i._emissives.splice(e,1)}};return this._emissives.push(a),this._updateEmissive(a),a}update(e){!this.paused&&this.timeSpeed!==0&&(this.timeOfDay=((this.timeOfDay+this.timeSpeed*e)%24+24)%24),this._apply(e)}lateUpdate(){this._placeSun()}dispose(){for(let e of[...this._pointLights])e.dispose();this._emissives.length=0,this.sun.dispose(),this.hemi.dispose(),this.group.removeFromParent(),this.sky.object.removeFromParent(),this.sky.dispose(),this.scene.fog===this.fog&&(this.scene.fog=this._previousFog??null)}_applyShadowExtent(){let e=this.sun.shadow.camera,t=this._shadowExtent;e.left=-t,e.right=t,e.top=t,e.bottom=-t,e.updateProjectionMatrix()}_apply(e){this._clock+=e;let t=this._track.evaluate(this.timeOfDay,this._values),n=this.state,r=this._stateColors||=[n.skyTop,n.skyHorizon,n.skyBottom,n.sunColor,n.hemiSky,n.hemiGround];for(let e=0;e<6;e++)r[e].setRGB(Math.max(0,t[e*3]),Math.max(0,t[e*3+1]),Math.max(0,t[e*3+2]));n.sunIntensity=Math.max(0,t[gr.sunI]),n.hemiIntensity=Math.max(0,t[gr.hemiI]),n.fogDensity=Math.max(0,t[gr.fog]),n.exposure=Math.max(.05,t[gr.exp]),n.night=N(t[gr.night]),n.moonBlend=N(t[gr.moon]),n.shadowIntensity=N(t[gr.shadow]),n.glow=Math.max(0,t[gr.glow]),n.clouds=N(t[gr.clouds]),this._nightFactor=n.night,this._computeDirections();let i=this.settings;this.sun.color.copy(n.sunColor),this.sun.intensity=n.sunIntensity*i.sunMul;let a=this.sun.shadow;a.intensity=i.shadows?n.shadowIntensity:0,a.autoUpdate=!!i.shadows,a.radius=I(this.shadowRadius.day,this.shadowRadius.night,n.night),this._placeSun(),this.hemi.color.copy(n.hemiSky),this.hemi.groundColor.copy(n.hemiGround),this.hemi.intensity=n.hemiIntensity*i.ambientMul;let o=i.backdrop;this.fog.color.copy(o??n.skyHorizon),this.fog.density=n.fogDensity*i.fogMul,this.scene.fog!==this.fog&&this.scene.fog==null&&(this.scene.fog=this.fog);let s=this._backdropApplied;(this.sky.object.visible===!!o||o&&!(s&&s.equals(o)))&&this._setBackdrop(o),this.renderer&&(this.renderer.toneMappingExposure=n.exposure*i.exposureMul),L.uNight.value=n.night,L.uSunDirection.value.copy(this._lightDir),L.uSunColor.value.copy(n.sunColor).multiplyScalar(n.sunIntensity*i.sunMul/_r),L.uFogColor.value.copy(o??n.skyHorizon);let c=this._skyState;c.sunColor.copy(n.sunColor),c.night=n.night,c.glow=n.glow,c.clouds=n.clouds,this.sky.setState(c),this.sky.update(e);for(let e=0;e<this._pointLights.length;e++)this._updatePointLight(this._pointLights[e]);for(let e=0;e<this._emissives.length;e++)this._updateEmissive(this._emissives[e])}_computeDirections(){let e=this.state;yr(this.timeOfDay,this.sunPath,this._sunYaw,this._sunDir),yr(this.timeOfDay,this.moonPath,this._moonYaw,this._moonDir);let t=Math.asin(N(this._sunDir.y,-1,1)),n=Math.asin(N(this._moonDir.y,-1,1));e.sunElevation=t;let r=.12,i=this.minElevation,a=this.maxElevation,o=Sr(xr(t,i,r),a,r),s=Sr(xr(n,i,r),a,r),c=Math.atan2(this._sunDir.x,this._sunDir.z),l=Math.atan2(this._moonDir.x,this._moonDir.z),u=e.moonBlend,d=c+Cr(l-c)*u,f=I(o,s,u);e.lightElevation=f;let p=Math.cos(f);this._lightDir.set(Math.sin(d)*p,Math.sin(f),Math.cos(d)*p)}_getFollowPoint(e){let t=this._follow;if(t&&t.isObject3D)return t.getWorldPosition(e);if(t&&t.isVector3)return e.copy(t);let n=this.camera;if(!n)return e.set(0,0,0);Ar.setFromMatrixPosition(n.matrixWorld),n.getWorldDirection(kr);let r=24;return kr.y<-.05&&(r=Math.min(60,(Ar.y-this.followPlaneY)/-kr.y)),e.copy(Ar).addScaledVector(kr,Math.max(0,r))}_placeSun(){let e=this._lightDir,t=this.camera;if(t&&t.updateWorldMatrix(!0,!1),this._getFollowPoint(Er),t&&this.shadowForward!==0){Ar.setFromMatrixPosition(t.matrixWorld);let e=Er.x-Ar.x,n=Er.z-Ar.z,r=Math.hypot(e,n);if(r>.001){let t=Ar.distanceTo(Er),i=Math.min(t*this.shadowForward,this._shadowExtent*.5)/r;Er.x+=e*i,Er.z+=n*i}}let n=this.sun.shadow.camera.up;Dr.crossVectors(n,e),Dr.lengthSq()<1e-8&&Dr.set(1,0,0),Dr.normalize(),Or.crossVectors(e,Dr);let r=2*this._shadowExtent/this.shadowMapSize,i=Er.dot(Dr),a=Er.dot(Or),o=Math.round(i/r)*r-i,s=Math.round(a/r)*r-a;Er.addScaledVector(Dr,o).addScaledVector(Or,s),this.sun.target.position.copy(Er),this.sun.position.copy(Er).addScaledVector(e,this.lightDistance),this.sun.target.updateMatrixWorld(),this.sun.updateMatrixWorld()}_updatePointLight(e){let t=this.settings,n=1;if(t.flicker&&e.flicker>0){let t=Tr(this._clock*e.flickerSpeed,e.seed);n=Math.max(0,1+e.flicker*(t-.5)*1.7)}e.flickerFactor=n;let r=e.nightOnly?I(e.dayIntensity,1,this._nightFactor):1,i=e.intensity*r*n*t.pointLightMul;e.light.intensity=e.fade===1||e.fade===void 0?i:i*e.fade}_updateEmissive(e){let t=I(e.day,e.night,this._nightFactor);e.flicker&&(t*=I(1,e.flicker.flickerFactor,.6)),e.material.emissiveIntensity=t}},Nr=class{constructor(e,t=[],r={}){if(this.lighting=e,this.descriptors=t.slice(),this.size=Math.max(0,Math.floor(r.size??12)),this.fixed=!!r.fixed,this.interval=r.interval??.2,this.fadeTime=r.fadeTime??.35,this.margin=r.margin??4,this.priorityWeight=r.priorityWeight??1.5,this.hysteresis=r.hysteresis??2,this.dayPenalty=r.dayPenalty??10,this.nightDayIntensity=r.nightDayIntensity??.05,this.pooled=this.descriptors.length>this.size,this.handles=[],this._slots=[],this._sources=new Map,this._emissives=[],this._timer=0,this._snapNext=!0,this._frustum=new n,this._m=new h,this._sphere=new O,this._scored=this.descriptors.map(e=>({d:e,s:0})),this._wanted=new Set,this._seeds=new Map,this._baseSeeds=[],this._hidden=new Set,this._staticFading=!1,this.fixed){for(let e=0;e<this.size;e++)this.handles.push(this._addParked());this._baseSeeds=this.handles.map(e=>e.seed);let e=this.descriptors;this.descriptors=[],this.pooled=!1,this.setDescriptors(e,{snap:!0});return}if(!this.pooled){for(let t of this.descriptors){let n=e.addPointLight(this._staticParams(t));n.tag=t.tag,n.desc=t,this.handles.push(n)}this._baseSeeds=this.handles.map(e=>e.seed);return}for(let e of this.descriptors)this._seeds.set(e,e.seed??zr(e.position));for(let t=0;t<this.size;t++){let t=e.addPointLight({position:Pr,intensity:0,distance:8,flicker:0,nightOnly:!1});t.fade=0,t.tag=``,t.desc=null,this.handles.push(t),this._slots.push({handle:t,desc:null,target:null,fade:0})}this._baseSeeds=this.handles.map(e=>e.seed)}get activeCount(){if(!this.pooled)return Math.min(this.handles.length,this.descriptors.length);let e=0;for(let t of this._slots)t.desc&&e++;return e}get used(){return this.activeCount}get active(){return this.pooled?this._slots.filter(e=>e.desc).map(e=>e.desc):this.descriptors.slice(0,this.handles.length)}snap(){this._snapNext=!0}setHidden(e,t,{instant:n=!1}={}){if(!e||t===this._hidden.has(e))return;if(t?this._hidden.add(e):this._hidden.delete(e),this.pooled){this._timer=0,n&&(this._snapNext=!0);return}let r=this.handles.find(t=>t.desc===e);r&&(n?(r.fade=+!t,t&&(r.light.intensity=0)):this._staticFading=!0)}isHidden(e){return this._hidden.has(e)}setDescriptors(e,{snap:t=!1}={}){let n=e.slice(),r=this.descriptors,i=n.length===r.length&&n.every((e,t)=>e===r[t]);if(this.descriptors=n,i||(this._scored=n.map(e=>({d:e,s:0}))),t&&(this._snapNext=!0),!i&&this._hidden.size){let e=new Set(n);for(let t of this._hidden)e.has(t)||this._hidden.delete(t)}let a=this.handles.length,o=this.lighting;if(n.length<=a){this.pooled=!1,this._slots.length=0,this._seeds.clear();for(let e=0;e<a;e++){let r=this.handles[e],i=n[e];if(!i){this._park(r);continue}this._hidden.has(i)?t||r.desc!==i?r.fade=0:this._staticFading=!0:r.fade=1,o.retargetPointLight(r,this._params(i,i.seed??this._baseSeeds[e])),r.tag=i.tag,r.desc=i}return}let s=i?null:new Set(n),c=i?null:Rr(r,n,s),l=e=>!e||i||s.has(e)?e:c.get(e)??null;if(!i){let e=new Map;for(let t of n)e.set(t,this._seeds.get(t)??t.seed??zr(t.position));this._seeds=e;for(let[e,t]of[...this._sources]){let n=c.get(e);n&&!this._sources.has(n)&&(this._sources.delete(e),this._sources.set(n,t))}}if(!this.pooled){this.pooled=!0,this._slots=this.handles.map(e=>{let t=l(e.desc??null);return{handle:e,desc:t,target:null,fade:+!!t}});for(let e of this._slots)e.desc||this._park(e.handle),e.handle.desc=e.desc,e.handle.fade=e.fade}else if(!i){let e=new Set;for(let t of this._slots){let n=t.desc,r=l(n);r&&r!==n&&!e.has(r)&&(n=r),n!==t.desc&&(t.desc=n,t.handle.desc=n),t.desc&&s.has(t.desc)&&e.add(t.desc)}let t=new Set;for(let e of this._slots){let n=l(e.target);e.target=n&&!t.has(n)?n:null,e.target&&t.add(e.target)}}for(let e of this._slots)e.desc&&(o.retargetPointLight(e.handle,this._params(e.desc,this._seeds.get(e.desc)??e.handle.seed)),e.handle.tag=e.desc.tag);i||(this._timer=0)}flickerSource(e){let t=this._sources.get(e);return t||(t={flickerFactor:1},this._sources.set(e,t)),t}registerEmissive(e,{day:t=0,night:n=1.6,light:r=null}={}){let i=r?this.flickerSource(r):null,a=this.lighting.registerEmissive(e,{day:t,night:n,flicker:i});return this._emissives.push(a),a}update(e,{focus:t=null,camera:n=null}={}){if(this._updateSources(),!this.pooled){this._snapNext=!1,this._staticFading&&this._fadeStatic(e);return}let r=this.nightDayIntensity;for(let e of this._slots)e.desc&&e.desc.nightOnly!==!1&&e.desc.dayIntensity===void 0&&(e.handle.dayIntensity=r);if(this._snapNext){this._snapNext=!1,this._timer=this.interval,this._assign(t,n);for(let e of this._slots){let t=e.target!==e.desc;t&&this._move(e,e.target),e.fade=+!!e.desc,e.handle.fade=e.fade,t&&e.desc&&this.lighting.retargetPointLight(e.handle,{})}return}this._timer-=e,this._timer<=0&&(this._timer=this.interval,this._assign(t,n));let i=this.fadeTime>0?e/this.fadeTime:1;for(let e of this._slots)e.target===e.desc?e.desc&&(e.fade=Math.min(1,e.fade+i)):(e.fade=e.desc?Math.max(0,e.fade-i):0,e.fade===0&&this._move(e,e.target)),e.handle.fade=e.fade*e.fade*(3-2*e.fade)}_fadeStatic(e){let t=this.fadeTime>0?e/this.fadeTime:1,n=!1;for(let e of this.handles){if(!e.desc)continue;let r=+!this._hidden.has(e.desc);e.fade!==r&&(e.fade=r>e.fade?Math.min(1,e.fade+t):Math.max(0,e.fade-t),e.fade!==r&&(n=!0))}this._staticFading=n}dispose(){for(let e of this._emissives)e.dispose();this._emissives.length=0;for(let e of this.handles)e.dispose();this.handles.length=0,this._slots.length=0,this._sources.clear()}_staticParams(e){let t=e.nightOnly??!0;return{position:e.position,color:e.color,intensity:e.intensity,distance:e.distance,flicker:e.flicker,nightOnly:t,dayIntensity:e.dayIntensity??(t?this.nightDayIntensity:1),...e.seed===void 0?{}:{seed:e.seed},...e.flickerSpeed===void 0?{}:{flickerSpeed:e.flickerSpeed}}}_addParked(){let e=this.lighting.addPointLight({position:Pr,intensity:0,distance:8,flicker:0,nightOnly:!1});return e.fade=0,e.tag=``,e.desc=null,e}_park(e){e.desc=null,e.tag=``,e.fade=0,e.intensity=0,e.light.intensity=0,e.light.position.copy(Pr)}_params(e,t){let n=e.nightOnly??!0;return{position:e.position,color:e.color??16757867,intensity:e.intensity??8,distance:e.distance??8,flicker:e.flicker??.3,nightOnly:n,dayIntensity:e.dayIntensity??(n?this.nightDayIntensity:1),seed:t,flickerSpeed:e.flickerSpeed??2.6}}_move(e,t){e.desc=t;let n=e.handle;if(n.desc=t,n.fade=0,n.light.intensity=0,!t){n.tag=``,n.intensity=0,n.light.position.copy(Pr);return}let r=t.nightOnly??!0;this.lighting.retargetPointLight(n,{position:t.position,color:t.color??16757867,intensity:t.intensity??8,distance:t.distance??8,flicker:t.flicker??.3,nightOnly:r,dayIntensity:t.dayIntensity??(r?this.nightDayIntensity:1),seed:this._seeds.get(t),flickerSpeed:t.flickerSpeed??2.6}),n.tag=t.tag}_assign(e,t){let n=this._wanted;n.clear();let r=null;t&&(t.updateMatrixWorld(),this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),r=this._frustum.setFromProjectionMatrix(this._m,t.coordinateSystem));let i=new Set;for(let e of this._slots)e.target&&i.add(e.target);let a=this.lighting.nightFactor,o=e?.x??0,s=e?.y??0,c=e?.z??0,l=this._scored,u=0;for(let t=0;t<l.length;t++){let n=l[t],d=n.d,f=d.position;if(r&&(this._sphere.center.copy(f),this._sphere.radius=(d.distance??8)+this.margin,!r.intersectsSphere(this._sphere))){n.s=1/0;continue}if(this._hidden.size&&this._hidden.has(d)){n.s=1/0;continue}let p=d.nightOnly??!0?I(d.dayIntensity??this.nightDayIntensity,1,a):1;n.s=(e?Math.hypot(f.x-o,(f.y-s)*.5,f.z-c):0)+(d.priority??3)*this.priorityWeight+(1-Math.min(1,p))*this.dayPenalty-(i.has(d)?this.hysteresis:0),u++}if(u){l.sort((e,t)=>e.s-t.s);for(let e=0;e<Math.min(this.size,u);e++)n.add(l[e].d)}let d=new Set;for(let e of this._slots)e.target&&n.has(e.target)&&!d.has(e.target)?d.add(e.target):e.desc&&n.has(e.desc)&&!d.has(e.desc)?(e.target=e.desc,d.add(e.desc)):e.target=null;let f=this._slots.filter(e=>!e.target).sort((e,t)=>e.fade-t.fade),p=0;for(let e of n){if(d.has(e))continue;let t=f[p++];if(!t)break;t.target=e}}_updateSources(){if(!this._sources.size)return;let e=this.lighting;for(let[t,n]of this._sources){let r=this._handleOf(t);n.flickerFactor=r?r.flickerFactor:e.flickerAt(this._seeds.get(t)??zr(t.position),t.flicker??.3,t.flickerSpeed??2.6)}}_handleOf(e){if(!this.pooled){let t=this.descriptors.indexOf(e);return t>=0?this.handles[t]:null}for(let t of this._slots)if(t.desc===e)return t.handle;return null}},Pr=new E(0,-500,0);function Fr(e){return{position:e.position,color:me(e.color,j.NAMES),intensity:Lr(e.intensity,8,0,200),distance:Lr(e.distance,8,.5,100),flicker:Lr(e.flicker,.2,0,1),nightOnly:e.nightOnly??!0,priority:e.priority??3,tag:e.tag}}function Ir(e,{cache:t=null}={}){return e.map((e,t)=>({d:e,i:t,p:e.priority??3})).sort((e,t)=>e.p-t.p||e.i-t.i).map(({d:e})=>{if(!t)return Fr(e);let n=t.get(e);return n||(n=Fr(e),t.set(e,n)),n})}function Lr(e,t,n,r){return e===void 0?void 0:Math.min(r,Math.max(n,Number.isFinite(Number(e))&&e!==null&&e!==``?Number(e):t))}function Rr(e,t,n){let r=new Map,i=new Set(e),a=new Map,o=new Map;for(let e of t){if(!e.tag)continue;let t=o.get(e.tag)??0;o.set(e.tag,t+1),i.has(e)||a.set(`${e.tag}#${t}`,e)}if(!a.size)return r;o.clear();for(let t of e){if(!t.tag)continue;let e=o.get(t.tag)??0;if(o.set(t.tag,e+1),n.has(t))continue;let i=a.get(`${t.tag}#${e}`);i&&r.set(t,i)}return r}function zr(e){return e?(Math.imul(Math.round(e.x*64),73856093)^Math.imul(Math.round(e.y*64),19349663)^Math.imul(Math.round(e.z*64),83492791))>>>0:13}var Br={en:{controls:`Controls`,hide:`Hide controls`,show:`Show controls`,"control.move":`Move`,"control.run":`Run`,"control.talk":`Talk / Confirm`,"control.choose":`Choose an answer`,"control.rotate":`Rotate camera`,"control.zoom":`Zoom (or wheel)`,"control.map":`World map`,"control.time":`Time of day`,"control.weather":`Weather`,"control.photo":`Photo mode`,"control.music":`Music`,"control.debug":`Debug panel`,"phase.night":`Night`,"phase.dawn":`Dawn`,"phase.morning":`Morning`,"phase.midday":`Midday`,"phase.afternoon":`Afternoon`,"phase.golden":`Golden Hour`,"phase.dusk":`Dusk`,"key.left":`Left arrow`,"key.up":`Up arrow`,"key.right":`Right arrow`,"key.down":`Down arrow`,clock:`{time}, {phase}`},ja:{controls:`操作`,hide:`操作説明を隠す`,show:`操作説明を表示`,"control.move":`移動`,"control.run":`ダッシュ`,"control.talk":`話す／決定`,"control.choose":`答えを選ぶ`,"control.rotate":`カメラ回転`,"control.zoom":`ズーム（ホイールも可）`,"control.map":`ワールドマップ`,"control.time":`時間帯`,"control.weather":`天気`,"control.photo":`フォトモード`,"control.music":`音楽`,"control.debug":`デバッグパネル`,"phase.night":`夜`,"phase.dawn":`夜明け`,"phase.morning":`朝`,"phase.midday":`真昼`,"phase.afternoon":`昼下がり`,"phase.golden":`夕映え`,"phase.dusk":`黄昏`,"key.left":`左矢印`,"key.up":`上矢印`,"key.right":`右矢印`,"key.down":`下矢印`,clock:`{time}、{phase}`},zh:{controls:`操作`,hide:`隐藏操作说明`,show:`显示操作说明`,"control.move":`移动`,"control.run":`奔跑`,"control.talk":`交谈／确认`,"control.choose":`选择回答`,"control.rotate":`旋转镜头`,"control.zoom":`缩放（或滚轮）`,"control.map":`世界地图`,"control.time":`时段`,"control.weather":`天气`,"control.photo":`拍照模式`,"control.music":`音乐`,"control.debug":`调试面板`,"phase.night":`夜晚`,"phase.dawn":`黎明`,"phase.morning":`清晨`,"phase.midday":`正午`,"phase.afternoon":`午后`,"phase.golden":`夕照`,"phase.dusk":`黄昏`,"key.left":`左箭头`,"key.up":`上箭头`,"key.right":`右箭头`,"key.down":`下箭头`,clock:`{time}，{phase}`}},Vr={en:{window:`Dialogue`,choices:`Choices`,portrait:`Portrait of {name}`,next:`More`,end:`End`,"prompt.talk":`Talk`},ja:{window:`会話`,choices:`選択肢`,portrait:`{name}の肖像`,next:`次へ`,end:`終わり`,"prompt.talk":`話す`},zh:{window:`对话`,choices:`选项`,portrait:`{name}的肖像`,next:`继续`,end:`结束`,"prompt.talk":`交谈`}},Hr=Object.freeze({hud:Br,dialog:Vr,map:{en:{north:`N`,title:`World Map`,legend:`Legend`,"legend.you":`You`,"legend.villager":`Villager`,"legend.companion":`Companion`,"legend.poi":`Sign · door · well`,"legend.campfire":`Campfire`,"legend.enemy":`Enemy`,"legend.waystone":`Waystone`,"legend.chest":`Chest`,"legend.building":`Building`,"legend.road":`Road`,"legend.water":`Water`,"legend.forest":`Forest`,here:`You are in`,close:`Close`,aria:`World map`},ja:{north:`N`,title:`ワールドマップ`,legend:`凡例`,"legend.you":`現在地`,"legend.villager":`村人`,"legend.companion":`仲間`,"legend.poi":`立て札・扉・井戸`,"legend.campfire":`焚き火`,"legend.enemy":`敵`,"legend.waystone":`道標石`,"legend.chest":`宝箱`,"legend.building":`建物`,"legend.road":`道`,"legend.water":`水辺`,"legend.forest":`森`,here:`現在のエリア`,close:`閉じる`,aria:`ワールドマップ`},zh:{north:`N`,title:`世界地图`,legend:`图例`,"legend.you":`当前位置`,"legend.villager":`村民`,"legend.companion":`同伴`,"legend.poi":`指示牌 · 门 · 水井`,"legend.campfire":`篝火`,"legend.enemy":`敌人`,"legend.waystone":`路标石`,"legend.chest":`宝箱`,"legend.building":`建筑`,"legend.road":`道路`,"legend.water":`水域`,"legend.forest":`森林`,here:`当前区域`,close:`关闭`,aria:`世界地图`}},title:{en:{name:`Luminati`,pressAnyKey:`Press any key`,credit:`Luminati 2.5D Pixel-Art Engine · three.js`,chooseLevel:`Choose a level`,travelTo:`Travel to {label}`,prevLevel:`Previous level`,nextLevel:`Next level`,choose:`Choose`,start:`Start`,menu:`Title menu`,language:`Language`,langSwitch:`Switch`,langBack:`Back`},ja:{name:`Luminati`,pressAnyKey:`何かキーを押してください`,credit:`Luminati 2.5D ピクセルアートエンジン・three.js`,chooseLevel:`行き先を選ぶ`,travelTo:`{label}へ向かう`,prevLevel:`前の行き先`,nextLevel:`次の行き先`,choose:`選択`,start:`決定`,menu:`タイトルメニュー`,language:`言語`,langSwitch:`切り替え`,langBack:`戻る`},zh:{name:`Luminati`,pressAnyKey:`按任意键开始`,credit:`Luminati 2.5D 像素艺术引擎 · three.js`,chooseLevel:`选择目的地`,travelTo:`前往{label}`,prevLevel:`上一个目的地`,nextLevel:`下一个目的地`,choose:`选择`,start:`开始`,menu:`标题菜单`,language:`语言`,langSwitch:`切换`,langBack:`返回`}},game:{en:{"controls.move":`Move`,"controls.run":`Run`,"controls.talk":`Talk / Examine`,"controls.choose":`Choose an answer`,"controls.camera":`Rotate camera`,"controls.zoom":`Zoom (or wheel)`,"controls.map":`World map`,"controls.time":`Time of day`,"controls.weather":`Weather`,"controls.photo":`Photo mode`,"controls.music":`Music`,"controls.debug":`Debug panel`,"controls.journal":`Journal`,"controls.party":`Party`,"prompt.talk":`Talk`,"prompt.examine":`Examine`,"prompt.knock":`Knock`,"prompt.read":`Read`,"prompt.look":`Look`,"prompt.enter":`Enter`,"prompt.rest":`Rest`,"prompt.open":`Open`,"toast.noParty":`No one travels with you.`,"toast.weather.clear":`Clear skies`,"toast.weather.rain":`Rain`,"toast.weather.snow":`Snowfall`,"toast.outside.clear":`Clear skies outside`,"toast.outside.rain":`Rain outside`,"toast.outside.snow":`Snowfall outside`,"toast.foes":`Not while foes are near`,"toast.photo":`Photo mode · {P} or {Esc} to return`,"toast.rested":`You feel well rested.`,"toast.musicOn":`♪ Music on`,"toast.musicOff":`Music off`,"default.signpost":`Signpost`,"default.villager":`Villager`,"default.waystone":`Waystone`,"default.chest":`The chest is locked tight.`,"default.waystoneText":`An old waystone hums quietly.`,"default.nothing":`Nothing of note.`,"default.subtitle":`A Luminati 2.5D Level`,"default.prompt":`Press any key`,"default.credit":`Luminati 2.5D Pixel-Art Engine · three.js`,"default.item":`Crisp Apple`,"load.map":`Reading the map`,"load.textures":`Painting textures`,"load.land":`Raising the land`,"load.village":`Building the village`,"load.forest":`Planting the forest`,"load.water":`Letting the water run`,"load.meadow":`Growing the meadow`,"load.lights":`Lighting the lanterns`,"load.merge":`Merging meshes`,"load.villagers":`Waking the villagers`,"load.blades":`Sharpening blades`,"load.warmup":`Warming up the lanterns`,"load.ready":`Ready`,"page.title":`{name} — Luminati 2.5D Pixel-Art Engine`,"error.load":`Could not load {what}: {why}`,"error.campaign":`campaign "{name}"`,"error.level":`level "{name}"`,"error.default":`the {name} level`,"error.json":`the level is not valid JSON ({why})`,"error.missing":`{file} does not exist`,"error.unknown":`Something went wrong — see the console.`,"error.play":`Play {name}`,"error.editor":`Open the level editor`},ja:{"controls.move":`移動`,"controls.run":`ダッシュ`,"controls.talk":`話す／調べる`,"controls.choose":`答えを選ぶ`,"controls.camera":`カメラ回転`,"controls.zoom":`ズーム（ホイールも可）`,"controls.map":`ワールドマップ`,"controls.time":`時間帯`,"controls.weather":`天気`,"controls.photo":`フォトモード`,"controls.music":`音楽`,"controls.debug":`デバッグパネル`,"controls.journal":`日誌`,"controls.party":`パーティ`,"prompt.talk":`話す`,"prompt.examine":`調べる`,"prompt.knock":`ノックする`,"prompt.read":`読む`,"prompt.look":`調べる`,"prompt.enter":`入る`,"prompt.rest":`休む`,"prompt.open":`開ける`,"toast.noParty":`同行している仲間はいない。`,"toast.weather.clear":`快晴`,"toast.weather.rain":`雨`,"toast.weather.snow":`雪`,"toast.outside.clear":`外は快晴`,"toast.outside.rain":`外は雨`,"toast.outside.snow":`外は雪`,"toast.foes":`敵が近くにいる間は使えない`,"toast.photo":`フォトモード・{P} か {Esc} で戻る`,"toast.rested":`ぐっすり眠って、疲れが取れた。`,"toast.musicOn":`♪ 音楽オン`,"toast.musicOff":`音楽オフ`,"default.signpost":`立て札`,"default.villager":`村人`,"default.waystone":`道標石`,"default.chest":`宝箱には固く鍵がかかっている。`,"default.waystoneText":`古い道標石が静かにうなっている。`,"default.nothing":`特に変わったところはない。`,"default.subtitle":`Luminati 2.5D のステージ`,"default.prompt":`何かキーを押してください`,"default.credit":`Luminati 2.5D ピクセルアートエンジン・three.js`,"default.item":`もぎたてりんご`,"load.map":`地図を広げています`,"load.textures":`テクスチャを描いています`,"load.land":`大地を形づくっています`,"load.village":`村を建てています`,"load.forest":`森に木を植えています`,"load.water":`水を流しています`,"load.meadow":`草原を育てています`,"load.lights":`ランタンに火を灯しています`,"load.merge":`メッシュを結合しています`,"load.villagers":`村人を起こしています`,"load.blades":`剣を研いでいます`,"load.warmup":`ランタンを温めています`,"load.ready":`準備完了`,"page.title":`{name} — Luminati 2.5D ピクセルアートエンジン`,"error.load":`{what}を読み込めませんでした：{why}`,"error.campaign":`キャンペーン「{name}」`,"error.level":`ステージ「{name}」`,"error.default":`ステージ「{name}」`,"error.json":`ステージのJSONが正しくありません（{why}）`,"error.missing":`{file} が見つかりません`,"error.unknown":`問題が発生しました。コンソールを確認してください。`,"error.play":`{name}を遊ぶ`,"error.editor":`レベルエディターを開く`},zh:{"controls.move":`移动`,"controls.run":`奔跑`,"controls.talk":`交谈／查看`,"controls.choose":`选择回答`,"controls.camera":`旋转镜头`,"controls.zoom":`缩放（或滚轮）`,"controls.map":`世界地图`,"controls.time":`时段`,"controls.weather":`天气`,"controls.photo":`拍照模式`,"controls.music":`音乐`,"controls.debug":`调试面板`,"controls.journal":`日志`,"controls.party":`队伍`,"prompt.talk":`交谈`,"prompt.examine":`查看`,"prompt.knock":`敲门`,"prompt.read":`阅读`,"prompt.look":`查看`,"prompt.enter":`进入`,"prompt.rest":`休息`,"prompt.open":`打开`,"toast.noParty":`没有同伴与你同行。`,"toast.weather.clear":`晴空`,"toast.weather.rain":`降雨`,"toast.weather.snow":`降雪`,"toast.outside.clear":`外面天色晴朗`,"toast.outside.rain":`外面在下雨`,"toast.outside.snow":`外面在下雪`,"toast.foes":`附近有敌人时无法使用`,"toast.photo":`拍照模式 · 按 {P} 或 {Esc} 返回`,"toast.rested":`你睡了个好觉，精神焕发。`,"toast.musicOn":`♪ 音乐开启`,"toast.musicOff":`音乐关闭`,"default.signpost":`指示牌`,"default.villager":`村民`,"default.waystone":`路标石`,"default.chest":`宝箱锁得严严实实。`,"default.waystoneText":`一块古老的路标石正低声嗡鸣。`,"default.nothing":`没有什么特别的。`,"default.subtitle":`Luminati 2.5D 关卡`,"default.prompt":`按任意键开始`,"default.credit":`Luminati 2.5D 像素艺术引擎 · three.js`,"default.item":`脆甜苹果`,"load.map":`正在展开地图`,"load.textures":`正在绘制纹理`,"load.land":`正在塑造大地`,"load.village":`正在建造村庄`,"load.forest":`正在种植森林`,"load.water":`正在引来流水`,"load.meadow":`正在培育草地`,"load.lights":`正在点亮灯笼`,"load.merge":`正在合并网格`,"load.villagers":`正在唤醒村民`,"load.blades":`正在磨砺刀刃`,"load.warmup":`正在预热灯笼`,"load.ready":`准备就绪`,"page.title":`{name} — Luminati 2.5D 像素艺术引擎`,"error.load":`无法载入{what}：{why}`,"error.campaign":`冒险“{name}”`,"error.level":`关卡“{name}”`,"error.default":`关卡“{name}”`,"error.json":`关卡不是有效的 JSON（{why}）`,"error.missing":`找不到 {file}`,"error.unknown":`出错了，请查看控制台。`,"error.play":`游玩{name}`,"error.editor":`打开关卡编辑器`}}});function Ur(e){let t=[];for(let n of Object.values(Hr)){let r=n[e];r&&t.push(r)}return t}function Wr({force:e=!1}={}){for(let[t,n]of Object.entries(Hr))(e||!kt(t))&&wt(t,n)}var Gr=Object.freeze({arrow:{hot:[.5,.5],rows:[`o.........`,`oo........`,`oWo.......`,`oWLo......`,`oWLLo.....`,`oWLLGo....`,`oWLLGDo...`,`oWLLLGDo..`,`oWLLLGGDo.`,`oWLLGooooo`,`oWLoLGo...`,`oLo.oLGo..`,`oo..oLGo..`,`o....oLDo.`,`.....oGDo.`,`......oo..`]},pointer:{hot:[5,.5],rows:[`....oo.......`,`...oIio......`,`...oIio......`,`...oIio......`,`...oIiooo....`,`...oIioIiooo.`,`.oooIioIioIio`,`oIioIikIikIio`,`oIiiIiiiiiiko`,`oiiiiiiiiikko`,`.oiiiiiiiikko`,`..okiiiiiikko`,`.oLLLLLLLLLo.`,`.oGGGGbGGGDo.`,`.oDDDDDDDDBo.`,`.ooooooooooo.`]}});function Kr(){let e=Y();return{o:e.ink0,W:e.g5,L:e.g4,G:e.g3,D:e.g2,B:e.g1,I:e.kf0,i:e.kf1,k:e.kf2,K:e.kf3,a:e.sa1,b:e.sa2,c:e.sa3}}function qr(e,{px:t,dpr:n}){let r=Gr[e].rows,i=Math.max(r.length,...r.map(e=>e.length));return Math.max(1,Math.min(Math.round(t),Math.floor(32*n/i+1e-6)))}function Jr(e,t){return Ft([...Gr[e].rows],Kr(),t)}function Yr(e,t,n){let r=qr(e,t),i=Jr(e,r).toDataURL(`image/png`),a=+t.dpr.toFixed(4),[o,s]=Gr[e].hot;return`image-set(url("${i}") ${a}x) ${Math.floor(o*r/t.dpr+1e-6)} ${Math.floor(s*r/t.dpr+1e-6)}, ${n}`}var Xr=[{id:`move`,keys:`WASD`,label:`Move`},{id:`run`,keys:`Shift`,label:`Run`},{id:`talk`,keys:`Space`,label:`Talk / Confirm`},{id:`choose`,keys:`F/Enter`,label:`Choose an answer`},{id:`rotate`,keys:`Q/E`,label:`Rotate camera`},{id:`zoom`,keys:`Z/X`,label:`Zoom (or wheel)`},{id:`map`,keys:`N/Tab`,label:`World map`},{id:`time`,keys:`T`,label:`Time of day`},{id:`weather`,keys:`R`,label:`Weather`},{id:`photo`,keys:`P`,label:`Photo mode`},{id:`music`,keys:`M`,label:`Music`},{id:`debug`,keys:"`",label:`Debug panel`}],Zr=()=>Xr.map(e=>({...e,label:ri(`hud.control.${e.id}`,e.label)})),Qr={night:`Night`,dawn:`Dawn`,morning:`Morning`,midday:`Midday`,afternoon:`Afternoon`,golden:`Golden Hour`,dusk:`Dusk`},$r=Object.keys(Qr),ei=e=>Object.hasOwn(Qr,e)?ri(`hud.phase.${e}`,Qr[e]):String(e);function ti(e){return e<4.75||e>=20.5?`night`:e<7?`dawn`:e<11?`morning`:e<14?`midday`:e<16.5?`afternoon`:e<18.75?`golden`:`dusk`}var ni=Object.freeze({night:`#a9bff5`,dawn:`#f2a7a4`,morning:`#f5dc98`,midday:`#fbe7a6`,afternoon:`#f3cf7c`,golden:`#f6b25a`,dusk:`#d69ac0`});function ri(e,t){let n=q(e);return n===e?t:n}function ii(e,t){let n=q(`hud.clock`,{time:e,phase:t});return n===`hud.clock`?`${e}, ${t}`:n}var ai={Space:`Space`,Shift:`Shift`,Enter:`Enter`,Escape:`Esc`,Esc:`Esc`,Backquote:`~`,"`":`~`,Tab:`Tab`,Ctrl:`Ctrl`,Alt:`Alt`,Mouse0:`LMB`,Mouse1:`MMB`,Mouse2:`RMB`},oi={ArrowLeft:[`kLeft`,`left`,`Left arrow`],"←":[`kLeft`,`left`,`Left arrow`],ArrowUp:[`kUp`,`up`,`Up arrow`],"↑":[`kUp`,`up`,`Up arrow`],ArrowRight:[`kRight`,`right`,`Right arrow`],"→":[`kRight`,`right`,`Right arrow`],ArrowDown:[`kDown`,`down`,`Down arrow`],"↓":[`kDown`,`down`,`Down arrow`]},si=Object.freeze({"~":[`......`,`......`,`.oo..o`,`o..oo.`]}),ci=new Map;function li(e){let t=ci.get(e);return t||(t=``,(Object.hasOwn(si,e)?si[e]:yt[e]).forEach((e,n)=>{for(let r=0;r<e.length;){if(e[r]!==`o`){r++;continue}let i=1;for(;e[r+i]===`o`;)i++;t+=`M${r} ${n}h${i}v1h-${i}z`,r+=i}}),ci.set(e,t),t)}function ui(e){if(Array.isArray(e))return{parts:e.map(String),sep:null};let t=String(e??``);return t.length>1&&t.includes(`+`)?{parts:t.split(`+`),sep:`+`}:t.length>1&&t.includes(`/`)?{parts:t.split(`/`),sep:null}:{parts:[t],sep:null}}var di=e=>Object.hasOwn(ai,e)?ai[e]:e;function fi(e){let{parts:t,sep:n}=ui(e),r=0;return t.forEach((e,t)=>{let i=e.trim();t>0&&(r+=1+(n?G(n,`tiny`)+1:0)),r+=Object.hasOwn(oi,i)?11:ct(di(i))}),r}function pi(e){let t=document.createElement(`span`);t.className=`lu-keys`;let{parts:n,sep:r}=ui(e);return n.forEach((e,n)=>{if(n>0&&r){let e=document.createElement(`span`);e.className=`lu-key-sep`,e.textContent=r,t.appendChild(e)}let i=document.createElement(`kbd`),a=e.trim(),o=Object.hasOwn(oi,a)?oi[a]:null;if(o){i.className=`lu-key lu-key--sym lu-key--arrow`,i.setAttribute(`aria-label`,ri(`hud.key.${o[1]}`,o[2])),i.innerHTML=`<svg viewBox="0 0 7 7" aria-hidden="true" shape-rendering="crispEdges"><path d="${li(o[0])}"/></svg>`,t.appendChild(i);return}let s=di(a);if(Object.hasOwn(si,s)){i.className=`lu-key lu-key--sym lu-key--glyph`,i.setAttribute(`aria-label`,s),i.innerHTML=`<svg viewBox="0 0 6 7" aria-hidden="true" shape-rendering="crispEdges"><path d="${li(s)}"/></svg>`,t.appendChild(i);return}i.className=s.length>=4?`lu-key lu-key--wide`:/^[A-Za-z0-9]*$/.test(s)?`lu-key`:`lu-key lu-key--sym`,/^[0-9]+$/.test(s)&&i.classList.add(`lu-key--num`);let c=document.createElement(`span`);c.className=`lu-key__t`,c.textContent=s,i.appendChild(c),t.appendChild(i)}),t}function mi(e,t,n,r,i,a){e.classList.add(`g`,`grp`),e.dataset.anchor=t,H(e,[n,r]);let o=e.style;o.width=V(i),o.height=V(a),o.left=o.right=o.top=o.bottom=``;let s,c;t[1]===`l`?(o.left=V(n),s=V(-n)):(o.right=V(640-n-i),s=`calc(100% + ${V(640-n-i)})`),t[0]===`t`?(o.top=V(r),c=V(-r)):(o.bottom=V(360-r-a),c=`calc(100% + ${V(360-r-a)})`),o.transformOrigin=`${s} ${c}`}function hi(e,t){let n=document.createElement(`div`);return n.className=t,H(n,qe(e)),e.appendChild(n),n}function gi(e,t,n,r){let i=st(e,t,Ae(r.band),(r,i)=>i*t<1||i*t>t-1?0:.82*Math.max(0,Math.min(1,Math.min(r,1-r)*e/n)),[...Je]),a=i.getContext(`2d`);for(let i=0;i<e;i++){let o=Math.min(i,e-1-i);o<n/2&&i%4||o<n&&i%2||(a.fillStyle=r.top,a.fillRect(i,0,1,1),a.fillStyle=r.bot,a.fillRect(i,t-1,1,1))}return i}var _i={"":{band:`band`,top:`g3`,bot:`g2`,gem:J.gold,color:`tx1`,icon:null,maxW:400},quest:{band:`xp0`,top:`g4`,bot:`g3`,gem:J.gold,color:`g5`,icon:`scroll`,maxW:400},item:{band:`band`,top:`g3`,bot:`g2`,gem:J.gold,color:`tx1`,icon:`chest`,maxW:400},error:{band:`tr1`,top:`rb2`,bot:`rb1`,gem:J.ruby,color:`rb3`,icon:`flag`,maxW:460}},vi=10,yi=2,bi=8,xi=140,Si=3,Ci=e=>16+(e.icon?14:5)+5+5+5+16,wi=/^(?:[A-Z0-9]|F(?:[1-9]|1[0-2])|Space|Shift|Enter|Esc|Escape|Tab|Ctrl|Alt|Backspace|Mouse[0-2]|LMB|MMB|RMB|[←↑→↓])$/,Ti=3;function Ei(e){let t=[],n=0;for(let r of e.matchAll(/\{([^{}]*)\}/g)){if(!wi.test(r[1]))continue;let i=e.slice(n,r.index).trim();i&&t.push({text:i}),t.push({key:di(r[1])}),n=(r.index??0)+r[0].length}if(!t.length)return null;let r=e.slice(n).trim();return r&&t.push({text:r}),t}var Di=e=>e.reduce((e,t,n)=>e+(n?Ti:0)+(t.key==null?G(t.text,`line`):ct(t.key)),0),Oi=13,ki=7,Ai=[`0`,`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`],ji=class{constructor(e=document.body){let t=document.createElement(`div`);t.className=`lu-hud`,e.appendChild(t),this.element=t;let n=document.createElement(`div`);n.className=`lu-toasts`,n.setAttribute(`aria-live`,`polite`),e.appendChild(n),this.toastElement=n,this._loc=document.createElement(`div`),this._loc.className=`lu-loc is-empty`,this._clock=document.createElement(`div`),this._clock.className=`lu-clock`,this._clock.dataset.phase=`golden`,this._clock.setAttribute(`role`,`img`),this._help=document.createElement(`div`),this._help.className=`lu-help is-empty`,this._helpTab=document.createElement(`div`),this._helpTab.className=`lu-help-tab is-empty is-hidden`,t.append(this._loc,this._clock,this._help,this._helpTab),this._toasts=n,this.helpKey=`H`,this.maxToasts=3,this._visible=!0,this._helpVisible=!0,this._hours=-1,this._minute=-1,this._phase=``,this._timeText=`00:00`,this._locationName=``,this._locationSub=``,this._rows=[],this._timers=new Set,this._toastSpecs=new Map,this._locBox=null,this._clockBox=null,this._banner=null,this._onBanner=e=>{let t=e.detail;this._banner=t&&Number.isFinite(t.y)&&Number.isFinite(t.h)?{x:+t.x||0,y:+t.y,w:+t.w||0,h:+t.h,fit:+t.fit||1}:null,this._layoutToasts()},e.addEventListener(`lu-banner`,this._onBanner),this._parent=e,this._ck=null,this._timeEl=null,this._phaseEl=null,this._iconEl=null,this._barEl=null,this._barMx=-1,this._disposed=!1,this._unscale=Re(e,()=>this.relayout()),R()?.ready.then(()=>{this._disposed||this.relayout()}),this._renderLoc(),this._renderClock(),this.setTime(17.2),this.setControls(Zr())}get visible(){return this._visible}set visible(e){this._visible=!!e,this.element.classList.toggle(`is-hidden`,!this._visible),this._toasts.classList.toggle(`is-hidden`,!this._visible)}get clockElement(){return this._clock}get locationElement(){return this._loc}get helpElement(){return this._help}get helpTabElement(){return this._helpTab}get hours(){return this._hours}get phase(){return this._phase}get helpVisible(){return this._helpVisible}relayout(){if(!this._disposed){for(let e of this._toastSpecs.values())e.size=e.drawn=null;this._renderLoc(),this._renderClock(),this._renderHelp(),this._layoutToasts()}}setTime(e){if(!Number.isFinite(e))return;let t=(e%24+24)%24;this._hours=t;let n=Math.floor(t*60)%1440;if(n===this._minute)return;this._minute=n;let r=Math.floor(n/60),i=n%60;this._timeText=`${Ai[r/10|0]}${Ai[r%10]}:${Ai[i/10|0]}${Ai[i%10]}`;let a=this._timeEl?.firstChild;a&&(a.nodeValue=this._timeText),this._applyBar();let o=ti(t);if(o!==this._phase){let e=Ke[this._phase];this._phase=o,this._clock.dataset.phase=o,this._applyPhase(Ke[o]!==e)}else this._clock.setAttribute(`aria-label`,ii(this._timeText,ei(o)))}setLocation(e,t=``){let n=String(e??``),r=String(t??``);if(n===this._locationName&&r===this._locationSub)return;let i=!!this._locationName;this._locationName=n,this._locationSub=r,this._renderLoc(),this._loc.classList.toggle(`is-empty`,!n),n&&i&&(this._loc.classList.add(`is-swap`),this._loc.offsetWidth,this._loc.classList.remove(`is-swap`)),this._ensure([z(n),r],()=>n===this._locationName&&r===this._locationSub,()=>this._renderLoc())}showHelp(e,{tab:t=!0}={}){this._helpVisible=!!e,this._help.classList.toggle(`is-hidden`,!this._helpVisible),this._helpTab.classList.toggle(`is-hidden`,this._helpVisible||!t)}toggleHelp(){return this.showHelp(!this._helpVisible),this._helpVisible}setControls(e=[]){this._rows=Array.isArray(e)?e.slice():[],this._renderHelp();let t=this._rows.map(e=>e.label??``);this._ensure([...t,q(`hud.controls`),q(`hud.hide`),q(`hud.show`)],()=>this._rows.every((e,n)=>(e.label??``)===t[n]),()=>this._renderHelp())}toast(e,t=2.5,{kind:n}={}){let r=n===`quest`||n===`item`||n===`error`?n:``,i=document.createElement(`div`);i.className=r?`lu-toast lu-toast--${r}`:`lu-toast`;let a={text:String(e??``),kind:r};for(i.style.transition=`none`,this._toasts.appendChild(i),this._toastSpecs.set(i,a);this._toasts.children.length>this.maxToasts;){let e=this._toasts.firstElementChild;this._toastSpecs.delete(e),e.remove()}this._layoutToasts(),i.offsetWidth,i.style.transition=``,i.classList.add(`is-on`);let o=setTimeout(()=>{this._timers.delete(o),i.classList.add(`is-off`);let e=setTimeout(()=>{this._timers.delete(e),this._toastSpecs.delete(i),i.remove(),this._layoutToasts()},520);this._timers.add(e)},Math.max(.5,t)*1e3);return this._timers.add(o),this._ensure([a.text],()=>i.isConnected,()=>{a.size=a.drawn=null,this._layoutToasts()}),i}update(){}dispose(){this._disposed=!0,this._unscale(),this._parent.removeEventListener(`lu-banner`,this._onBanner);for(let e of this._timers)clearTimeout(e);this._timers.clear(),this._toastSpecs.clear(),this._toasts.remove(),this.element.remove()}_ensure(e,t,n){let r=R();r&&Tt()&&r.ensure(e.join(`
`)).then(()=>{!this._disposed&&t()&&n()},()=>{})}_renderLoc(){let e=Y(),t=this._loc;t.replaceChildren();let n=He(z(this._locationName),`name`,236,1),r=He(this._locationSub,`line`,236),i=G(n,`name`,1),a=G(r,`line`),o=Math.max(123,Math.ceil((23+Math.max(i,a))/.72)),s=Fe(`name`),c=Fe(`line`),l=2.5,u=Math.round(3.5+s+l+c+3.5);mi(t,`tl`,10,10,o,u),this._locBox=[10,10,o,u],U(t,Le(o,u),10,10,1,`lu-loc__band`).setAttribute(`aria-hidden`,`true`),U(t,je(Math.round(o*.88)),10,10).setAttribute(`aria-hidden`,`true`),U(t,je(Math.round(o*.88)),10,10+u-1).setAttribute(`aria-hidden`,`true`),U(t,Ct(11),14,10+Math.floor((u-13)/2),1,`lu-loc__icon`).setAttribute(`aria-hidden`,`true`),W(t,n,33,r?13.5+s/2:10+u/2,{...De,color:e.tx1,drop:!0,cls:`lu-loc__name`}),W(t,r,33,13.5+s+l+c/2,{font:`line`,color:e.g4,drop:!0,cls:`lu-loc__sub`}),this._layoutToasts()}_renderClock(){let e=this._clock;e.replaceChildren();let t=Y(),n=G(`00:00`,`big`,1),r=Math.max(...$r.map(e=>G(ei(e),`line`))),i=Math.max(n,r,40),a=Math.ceil(Ue(`line`)),o=28+i+7,s=630-o,c=31+a;mi(e,`tr`,s,10,o,c),this._clockBox=[s,10,o,c],We(e,{size:`XS`,corners:J.gold(),cornerR:2},s,10,o,c),U(e,Me(22),s+3,14+a/2,1,`lu-clock__halo`);let l=s+28;this._ck={x0:s,y:10,gl:a,textW:i,tx:l},this._timeEl=it(e,this._timeText,l,11.5,{font:`big`,track:1,color:t.g5,drop:!0,cls:`lu-clock__time`}),this._phaseEl=it(e,``,l,21.5+a/2,{font:`line`,drop:!0,cls:`lu-clock__phase`}),this._iconEl=null,this._barEl=null,this._barMx=-1;for(let t of e.querySelectorAll(`canvas`))t.setAttribute(`aria-hidden`,`true`);this._phase&&this._applyPhase(!0),this._minute>=0&&this._applyBar();let u=R();if(u&&Tt()){let e=$r.map(ei);u.ensure(e.join(`
`)).then(()=>{this._disposed||Math.max(...e.map(e=>G(e,`line`)))!==r&&this._renderClock()},()=>{})}}_applyPhase(e){let t=this._ck,n=this._phase;if(!t||!n)return;let r=ei(n);if(this._phaseEl&&(this._phaseEl.textContent=r,this._phaseEl.style.color=ni[n]??Y().phase),this._clock.setAttribute(`aria-label`,ii(this._timeText,r)),e||!this._iconEl){this._iconEl?.remove();let e=lt(Ke[n]??`sun`);e.setAttribute(`aria-hidden`,`true`),this._iconEl=U(this._clock,e,t.x0+6,t.y+7+t.gl/2,1,`lu-clock__icon`)}}_applyBar(){let e=this._ck;if(!e||this._minute<0)return;let t=e.textW-2,n=this._minute/1440,r=Math.round(n*(t-1));if(r===this._barMx&&this._barEl)return;this._barMx=r,this._barEl?.remove();let i=Ee(t,n);i.setAttribute(`aria-hidden`,`true`),this._barEl=U(this._clock,i,e.tx-2,e.y+20+e.gl,1,`lu-clock__track`)}_renderHelp(){this._renderHelpTab();let e=this._help;e.replaceChildren();let t=this._rows;if(e.classList.toggle(`is-empty`,t.length===0),!t.length)return;let n=Y(),r=z(ri(`hud.controls`,`Controls`)),i=G(r,`small`,1),a=t.map(e=>({r:e,kw:fi(e.keys),lw:G(e.label??``,`line`)})),o=this.helpKey?{kw:fi(this.helpKey),label:ri(`hud.hide`,`Hide controls`)}:null,s=o?o.kw+4+G(o.label,`line`):0,c=2*Math.ceil(Ue(`small`)/2),l=15+c,u=e=>l+(e-1)*Oi+11+(o?23:6),d=St(this.element),f=d?d.artH/(d.cornerShrink||1):360,p=160+2*Math.max(0,(this._locBox?.[3]??22)-22),m=t.length>3&&u(t.length)>f-p?[a.slice(0,Math.ceil(a.length/2)),a.slice(Math.ceil(a.length/2))]:[a],h=m.map(e=>{let t=Math.max(...e.map(e=>e.kw)),n=Math.max(...e.map(e=>e.lw));return{kw:t,lw:n,w:t+5+n}}),g=h.reduce((e,t)=>e+t.w,0)+(m.length-1)*14,_=ki+Math.max(g,i+24,s)+ki+1,v=u(m[0].length),y=350-v;mi(e,`bl`,10,y,_,v),We(e,{size:`XS`,corners:J.gold(),cornerR:2},10,y,_,v);let b=y+8+c/2;W(e,r,17,b,{font:`small`,track:1,color:n.g4,drop:!0,cls:`lu-help__title`}),U(e,je(_-14-i-5,`r`),17+i+5,Math.round(b)).setAttribute(`aria-hidden`,`true`);let x=hi(e,`lu-help__grid`),S=17;if(m.forEach((e,t)=>{let{kw:r}=h[t];e.forEach((e,t)=>{let i=y+l+t*Oi,a=pi(e.r.keys);a.classList.add(`lu-help__keys`),K(a,S-10,i-y,r,11),x.appendChild(a);let o=W(x,e.r.label??``,S+r+5,i+5.5,{font:`line`,color:n.tx1,drop:!0,cls:`lu-help__label`});e.r.id&&(o.dataset.id=String(e.r.id),a.dataset.id=String(e.r.id))}),S+=h[t].w+14}),o){let t=y+l+(m[0].length-1)*Oi+11+3;U(e,je(_-14,`r`,n.dm1),17,t).setAttribute(`aria-hidden`,`true`),this._keyRow(hi(e,`lu-help__foot`),10,y,t+4,o.kw,o.label,`lu-help__foot-keys`,`lu-help__hint`)}}_renderHelpTab(){let e=this._helpTab;e.replaceChildren();let t=this._rows.length>0&&!!this.helpKey;if(e.classList.toggle(`is-empty`,!t),!t)return;let n=fi(this.helpKey),r=ri(`hud.show`,`Show controls`),i=ki+n+4+G(r,`line`)+ki+1;mi(e,`bl`,10,329,i,21),We(e,{size:`XS`,corners:J.gold(),cornerR:2},10,329,i,21),this._keyRow(e,10,329,334,n,r,`lu-help-tab__keys`,`lu-help-tab__label`)}_keyRow(e,t,n,r,i,a,o,s){let c=pi(this.helpKey);c.classList.add(o),K(c,ki,r-n,i,11),e.appendChild(c),W(e,a,t+ki+i+4,r+5.5,{font:`line`,color:Y().tx2,drop:!0,cls:s})}_toastSize(e,t){let n=_i[e.kind]??_i[``],r=Math.max(48,Math.min(n.maxW,Math.floor(t))),i=e.size;if(i&&i.lim===r)return i;let a=e.kind===`error`?null:Ei(e.text),o=a?Di(a):0,s=null,c,l=1;a&&o<=r?(s=a,c=o):(c=G(e.text,`line`),c>r&&(l=Qe(null,e.text,`line`,r),c=r));let u=2*Math.ceil(Ue(`line`)/2),d=Math.round((n.icon?20:16)+u+(l-1)*B.line.L),f=Ci(n)+c;return f+=f%2,e.size={lim:r,tw:c,lines:l,w:f,h:d,parts:s},e.size}_panels(e,t){let n=e?.artW??640,r=[],i=this._toasts.parentElement,a=e&&i?i.getBoundingClientRect():null;for(let i of[...this.element.children]){let o=i.dataset?.anchor;if(!o||!/^[tb][lr]$/.test(o))continue;let s=i.classList;if(s.contains(`is-empty`)||s.contains(`is-hidden`))continue;let c=o[1]===`l`?`l`:`r`,l=i===this._loc?this._locBox:i===this._clock?this._clockBox:null;if(l){let[e,a,o,s]=l,u=c===`l`?e*t:n-(640-e)*t;r.push({l:u,t:a*t,r:u+o*t,b:(a+s)*t,side:c,plate:i===this._loc});continue}if(!a||!e)continue;let u=i.getBoundingClientRect();if(!(u.width>0&&u.height>0))continue;let d=e.cssPx;r.push({l:(u.left-a.left)/d,t:(u.top-a.top)/d,r:(u.right-a.left)/d,b:(u.bottom-a.top)/d,side:c})}return r}_layoutToasts(){if(this._disposed||!this._toastSpecs.size)return;let e=[...this._toasts.children].filter(e=>this._toastSpecs.has(e));if(!e.length)return;let t=e.map(e=>this._toastSpecs.get(e)),n=St(this.element),r=n?.cornerShrink||1,i=n?.artW??640,a=this._panels(n,r),o=this._banner,s=o?{t:o.fit*o.y-Si*r,b:o.fit*(o.y+o.h)+Si*r}:null,c=(e,t)=>{let n=0,r=i,o=!1,s=!1;for(let i of a)i.t>=t||i.b<=e||(i.side===`l`?(n=Math.max(n,i.r),o=!0):(r=Math.min(r,i.l),s=!0));return o&&!s?r=Math.max(n+1,i-n):s&&!o&&(n=Math.min(r-1,i-r)),[n,r]},l=e=>{let n=e+16*r,a={L:0,R:i,room:0,sizes:[],ys:[],bot:n};for(let i=0;i<4;i++){let[i,o]=c(e,n),l=(o-i)/r-16,u=t.map(e=>this._toastSize(e,l-Ci(_i[e.kind]??_i[``]))),d=[],f=e;for(let e of u)s&&f<s.b&&f+e.h*r>s.t&&(f=s.b),d.push(f),f+=(e.h+yi)*r;let p=f-yi*r;if(a={L:i,R:o,room:l,sizes:u,ys:d,bot:p},p<=n+1e-6)break;n=p}return a},u=l(vi*r),d=a.find(e=>e.plate);if(d&&u.room-Ci(_i.quest)<xi&&d.r>=u.L-1e-6){let e=l(d.b+4*r);e.room>u.room&&(u=e)}let f=Math.max(...u.sizes.map(e=>e.w))*r/2+bi*r,p=u.L+f,m=u.R-f,h=p>m?(u.L+u.R)/2:Math.min(Math.max(i/2,p),m);e.forEach((e,n)=>{let i=t[n],a=u.sizes[n];i.drawn!==a&&this._renderToast(e,i,a);let o=Math.round(h/r-a.w/2),s=Math.round(u.ys[n]/r);i.x!==o&&(e.style.left=V(o),i.x=o),i.y!==s&&(e.style.top=V(s),i.y=s)})}_renderToast(e,t,n){let r=Y(),i=_i[t.kind]??_i[``];e.replaceChildren(),t.drawn=n;let{w:a,h:o,tw:s,lines:c}=n,l=i.icon?14:5;e.style.width=V(a),e.style.height=V(o);let u={band:r[i.band],top:r[i.top],bot:r[i.bot]};U(e,gi(a,o,16,u),0,0,1,`lu-toast__plate`).setAttribute(`aria-hidden`,`true`);let d=i.gem();i.icon?U(e,lt(i.icon),14,Math.round((o-16)/2),1,`lu-toast__glyph`).setAttribute(`aria-hidden`,`true`):U(e,Ce(1,d),16,Math.round(o/2-2.5),1,`lu-toast__gem`).setAttribute(`aria-hidden`,`true`),U(e,Ce(1,d),a-16-5,Math.round(o/2-2.5),1,`lu-toast__gem`).setAttribute(`aria-hidden`,`true`);let f=16+l+5,p={font:`line`,color:r[i.color],drop:!0,cls:`lu-toast__text`};if(n.parts){let t=Math.round(o/2-5.5);n.parts.forEach((n,r)=>{r&&(f+=Ti),n.key==null?(W(e,n.text,f,o/2,p),f+=G(n.text,`line`)):f+=Ze(e,n.key,f,t,{cls:`lu-toast__key`})})}else if(c>1){let n=B.line.L;it(e,t.text,f,o/2-(c-1)*n/2-dt(`line`),{...p,maxW:s})}else W(e,t.text,f,o/2,p)}},Mi={",":.12,";":.16,":":.16,"—":.14,".":.22,"!":.22,"?":.22,"…":.42},Ni={"、":.12,"，":.12,"；":.16,"：":.16,"。":.22,"．":.22,"！":.22,"？":.22,"‥":.3,"―":.14},Pi=`"'”’)]»」』）】〕〉》〙〗`,Fi=/[⺀-⿿　-ヿ㄀-ㇿ㐀-䶿一-鿿豈-﫿︰-﹏＀-￯]/,Ii=`、。，．：；！？」』）】〕〉》”’`,Li=`、。，．：；！？」』）】〕〉》”’「『（【〔〈《“‘`,Ri=10,zi=496,Bi=344,Vi=62,Hi=6,Ui=12,Wi=240,Gi=8,Ki=5,qi=3,Ji=.3,Yi=`F`,Xi=6,Zi=4,Qi=24,$i=Object.freeze({size:`L`,lattice:!0,beads:6,trio:!0,sides:!0}),ea=()=>{let e=Y();return{size:`S`,notch:3,corners:null,ends:!0,endR:2,bands:[e.plate0,e.plate1],stops:[0,.5],sheen:!1}},ta=()=>({size:`XS`,corners:J.gold(),cornerR:2}),na=e=>`round(nearest, calc(var(--px) * ${e}), var(--lu-dpx, 1px))`;function ra(e,t,n,r,i){let a=B[t],[o,s]=qe(i),c=dt(t)-a.mid*(a.u===`fpx`?.5:1);a.u===`fpx`&&(c+=a.mid*(.5-Be)),e.style.left=na(Math.round((n-o)*2)/2),e.style.top=na(c?r+c-s:Math.round((r-s)*2)/2)}var ia=e=>{let t=Fe(e),n=B[e];return n.u===`fpx`?t+n.ink*(Be-.5):t},aa=e=>Ue(e)+ia(e)-Fe(e);function oa(e){let t=document.createElement(`div`);return t.className=e,t}var sa=class{constructor(e=document.body){kt(`dialog`)||wt(`dialog`,Vr),this.speed=45,this.cjkPace=.7,this.inputGuard=.15,this.choiceQuiet=.4,this.choiceReact=.2,this.onChar=null,this.onSound=null;let t=document.createElement(`div`);t.className=`lu-dialog lu-stage`,t.setAttribute(`role`,`dialog`),t.setAttribute(`aria-label`,q(`dialog.window`)),e.appendChild(t),this.element=t,this._win=mt(t,`bl`,0,0,640,350,`lu-dialog__win`);let n=oa(`g lu-dialog__panel`);this._art=oa(`lu-dialog__art`);let r=oa(`lu-dialog__text`);r.setAttribute(`aria-live`,`polite`);let i=oa(`lu-dialog__ask-text`);i.setAttribute(`aria-live`,`polite`);let a=oa(`g lu-dialog__next`);a.setAttribute(`role`,`img`),a.setAttribute(`aria-label`,q(`dialog.next`));let o=ot(`advance`);o.classList.add(`lu-arrow`);let s=Ce(2,J.gold());s.classList.add(`lu-end`),U(a,o,0,0),U(a,s,1,0);let c=oa(`g lu-dialog__name is-empty`);this._nameArt=oa(`lu-dialog__art`);let l=oa(`lu-dialog__speaker`),u=oa(`lu-dialog__title`);c.append(this._nameArt,l,u),n.append(this._art,r,i,a,c);let d=document.createElement(`ul`);d.className=`g lu-dialog__choices`,d.setAttribute(`aria-label`,q(`dialog.choices`)),this._choiceArt=oa(`lu-dialog__art`);let f=pi(Yi);f.classList.add(`lu-choice__key`),f.setAttribute(`aria-hidden`,`true`),d.append(this._choiceArt,f),this._win.append(n,d),this._panel=n,this._nameEl=c,this._speakerEl=l,this._titleEl=u,this._textEl=r,this._askEl=i,this._nextEl=a,this._choicesEl=d,this._keyEl=f,this._lines=[],this._index=0,this._defaultSpeaker=``,this._defaultSheet=null,this._defaultTitle=``,this._currentSpeaker=null,this._glyphs=[],this._nSpeech=0,this._carry=!1,this._revealed=0,this._timer=0,this._typing=!1,this._open=!1,this._closing=!1,this._held=!1,this._hold=!1,this._guard=0,this._choiceEls=[],this._choiceLabels=[],this._choicesLine=-1,this._choiceIndex=0,this._choicesActive=!1,this._choiceArmed=!1,this._quiet=0,this._react=0,this._nudgeA=!1,this._keyRows=[],this._choiceDelay=-1,this._lastChoice=void 0,this._clickQueued=!1,this._resolve=null,this._closeTimer=0,this._portraitColor=``,this._lineColored=!1,this._ensureSeq=0,this._geo=null,this._onPanelClick=e=>{e.preventDefault(),this._open&&!this._closing&&(this._clickQueued=!0)},this._panel.addEventListener(`click`,this._onPanelClick),this._offScale=Re(e,()=>{this._open&&this._layout()})}get isOpen(){return this._open}get isTyping(){return this._typing}get isChoosing(){return this._choicesActive}get isChoiceReady(){return this._choicesActive&&this._choiceArmed&&this._react<=0}open({speaker:e=``,lines:t=[],portraitColor:n,hold:r=!1,sheet:i=null,title:a=``}={}){(this._resolve||this._closing)&&this._finishClose(!0);let o=this._held,s=o?this.heldLine:null;this._held=!1;let c=typeof t==`string`?[t]:Array.isArray(t)?t:[];if(this._lines=c.map(e=>typeof e==`string`?{text:e}:{...e,text:String(e?.text??``)}),!this._lines.length)return o&&this._finishClose(!0),Promise.resolve(void 0);this._hold=r;let l=this._lines[0],u=l.speaker===void 0?e??``:l.speaker;return this._carry=!!s&&l.text===s.text&&(u||``)===(s.speaker||``)&&(ca(l.ask)||Array.isArray(l.choices)&&l.choices.length>0),this._defaultSpeaker=e??``,this._defaultSheet=la(i)?i:null,this._defaultTitle=typeof a==`string`?a:``,this._currentSpeaker=null,this._index=0,this._lastChoice=void 0,this._closing=!1,this._open=!0,this._guard=this.inputGuard,this._clickQueued=!1,this._portraitColor=n||``,this._lineColored=!1,this._setPortrait(this._portraitColor),this.element.classList.remove(`is-closing`),this.element.classList.add(`is-open`),this._setLine(0),o||this._sound(`open`),new Promise(e=>{this._resolve=e})}get isHeld(){return this._held}get heldLine(){let e=this._held?this._lines[this._index]:null;if(!e)return null;let t={...e,speaker:e.speaker===void 0?this._defaultSpeaker:e.speaker};t.portraitColor===void 0&&this._portraitColor&&(t.portraitColor=this._portraitColor);let n=this._isDefaultSpeaker(e);return t.sheet===void 0&&n&&this._defaultSheet&&(t.sheet=this._defaultSheet),t.title===void 0&&n&&this._defaultTitle&&(t.title=this._defaultTitle),t}_setPortrait(e){e?this.element.style.setProperty(`--lu-portrait`,e):this.element.style.removeProperty(`--lu-portrait`)}update(e,t){if(!(!this._open||this._closing||this._held)&&(this._handleInput(e,t),this._open&&!this._closing)){if(this._typing){if(this.speed<=0)this._completeLine();else{this._timer-=e;let t=this._glyphs.length;for(;this._typing&&this._timer<=0&&t-->0;)this._revealNext()}}this._choiceDelay>=0&&(this._choiceDelay-=e,this._choiceDelay<0&&this._activateChoices())}}close(){this._open&&!this._closing&&(this._held=!1,this._closing=!0,this._typing=!1,this._choiceDelay=-1,this._setChoicesVisible(!1),this._nextEl.classList.remove(`is-on`),this.element.classList.remove(`is-open`),this.element.classList.add(`is-closing`),this._sound(`close`),clearTimeout(this._closeTimer),this._closeTimer=setTimeout(()=>this._finishClose(!1),320))}skip(){this._typing&&this._completeLine()}dispose(){if(clearTimeout(this._closeTimer),this._offScale(),this._panel.removeEventListener(`click`,this._onPanelClick),this._resolve){let e=this._resolve;this._resolve=null,e(void 0)}this.element.remove()}_sound(e){this.onSound&&this.onSound(e)}_pressed(e,t){return e?typeof e.consumeAction==`function`?e.consumeAction(t):e.actionPressed(t):!1}_handleInput(e,t){if(this._guard>0){this._guard-=e,this._clickQueued=!1;return}let n=this._clickQueued;if(this._clickQueued=!1,this._choicesActive){let r=this._pressed(t,`choose`),i=this._pressed(t,`confirm`)||n,a=!1;if(this._pressed(t,`up`)&&(this._moveChoice(-1),a=!0),this._pressed(t,`down`)&&(this._moveChoice(1),a=!0),a&&this._arm(0),!this._choiceArmed){r||i?this._quiet=this.choiceQuiet:(this._quiet-=e)<=0&&this._arm(this.choiceReact);return}if(this._react>0){r||i?this._lock():this._react-=e;return}r?this._selectChoice(this._choiceIndex):i&&this._nudgeKey();return}let r=this._pressed(t,`confirm`)||n;if(this._typing){(r||this._pressed(t,`cancel`))&&this._completeLine();return}r&&this._choiceDelay<0&&(this._sound(`confirm`),this._advance())}_finishClose(e){clearTimeout(this._closeTimer),this._held=!1,this._open=!1,this._closing=!1,this._typing=!1,this._choicesActive=!1,this._choiceArmed=!1,this._choiceDelay=-1,this.element.classList.remove(`is-closing`,`is-open`),e&&this._setChoicesVisible(!1),this._textEl.textContent=``,this._askEl.textContent=``,this._glyphs.length=0,this._nSpeech=0;let t=this._resolve;this._resolve=null,t&&t(this._lastChoice)}_isDefaultSpeaker(e){return e.speaker===void 0||!!e.speaker&&e.speaker===this._defaultSpeaker}_view(e){let t=this._isDefaultSpeaker(e),n=e.sheet===void 0?t?this._defaultSheet:null:e.sheet,r=e.title===void 0?t?this._defaultTitle:``:e.title,i=Array.isArray(e.choices)&&e.choices.length?e.choices.map(String):null,a=ca(e.ask)?String(e.ask):``;return{speaker:this._currentSpeaker||``,title:typeof r==`string`?r:``,sheet:la(n)?n:null,color:(e.portraitColor??this._portraitColor)||``,choices:i,ask:a,question:!a&&!!i&&this._speechShown()}}_speechShown(){for(let e=0;e<this._nSpeech;e++)if(this._glyphs[e].el)return!0;return!1}_askShown(){for(let e=this._nSpeech;e<this._glyphs.length;e++)if(this._glyphs[e].el)return!0;return!1}_setLine(e){this._index=e;let t=this._lines[e],n=t.speaker===void 0?this._defaultSpeaker:t.speaker??``;if(this._setSpeaker(n),(t.portraitColor!==void 0||this._lineColored)&&(this._lineColored=t.portraitColor!==void 0,this._setPortrait(t.portraitColor??this._portraitColor)),this._buildText(t.text,ca(t.ask)?String(t.ask):``),this._revealed=0,e===0&&this._carry){for(let e=0;e<this._nSpeech;e++)this._glyphs[e].el?.classList.add(`is-on`);this._revealed=this._nSpeech}this._carry=!1,this._timer=.06,this._typing=this._revealed<this._glyphs.length,this._choiceDelay=-1,this._setChoicesVisible(!1),this._nextEl.classList.remove(`is-on`);let r=e===this._lines.length-1;this._nextEl.classList.toggle(`is-last`,r),this._nextEl.setAttribute(`aria-label`,q(r?`dialog.end`:`dialog.next`)),this._layout(),this._ensureFonts(t),this._typing||this._finishLine()}_ensureFonts(e){let t=R();if(!t)return;let n=++this._ensureSeq,r=this._view(e);t.ensure([e.text,r.ask,r.speaker,z(r.speaker),r.title,r.choices??[]]).then(()=>{n===this._ensureSeq&&this._open&&this._lines[this._index]===e&&this._layout()})}_setSpeaker(e){e!==this._currentSpeaker&&(this._currentSpeaker=e,this._speakerEl.textContent=e||``,this._nameEl.classList.toggle(`is-empty`,!e))}_buildText(e,t=``){if(this._glyphs.length=0,this._buildInto(this._textEl,e),this._nSpeech=this._glyphs.length,this._buildInto(this._askEl,t),this._nSpeech<this._glyphs.length&&this._speechShown()){let e=this._nSpeech-1;for(;e>0&&!this._glyphs[e].el;)e--;this._glyphs[e].pause=Math.max(this._glyphs[e].pause,Ji)}}_buildInto(e,t){let n=this._glyphs,r=n.length;e.textContent=``;let i=document.createDocumentFragment(),a=null,o=!1,s=[...t];for(let e=0;e<s.length;e++){let t=s[e];if(t===`{`){o=!0;continue}if(t===`}`){o=!1;continue}if(t===`
`){a=null,i.appendChild(document.createElement(`br`)),n.push({el:null,ch:t,pause:0});continue}if(t===` `||t===`	`){a=null,i.appendChild(document.createTextNode(` `)),n.push({el:null,ch:` `,pause:0});continue}let r=document.createElement(`span`);r.className=o?`lu-c lu-hl kw`:`lu-c`,r.textContent=t;let c=Fi.test(t);if(c){if(a=null,Ii.includes(t)){let t=e+1;for(;t<s.length&&(s[t]===`{`||s[t]===`}`);)t++;t<s.length&&Li.includes(s[t])&&r.classList.add(`halt`)}i.appendChild(r)}else a||(a=document.createElement(`span`),a.className=`lu-w`,i.appendChild(a)),a.appendChild(r);n.push({el:r,ch:t,pause:0,cjk:c})}e.appendChild(i);for(let e=r;e<n.length;e++){let t=n[e].ch,i=Ni[t],a=i??Mi[t];if(!a)continue;let o=e+1;for(;o<n.length&&Pi.includes(n[o].ch);)o++;let s=o<n.length?n[o].ch:` `;if(i!==void 0){if(Ni[s]!==void 0||s===`…`||s===`—`)continue;n[o-1].pause=i}else if(s===` `||s===`
`||Fi.test(s)&&Ni[s]===void 0){let i=t===`.`&&e>r&&n[e-1].ch===`.`;n[o-1].pause=i?Mi[`…`]:a}}}_revealNext(){let e=this._glyphs[this._revealed++];e.el&&(e.el.classList.add(`is-on`),this.onChar&&this.onChar(e.ch)),this._timer+=(e.cjk&&this.cjkPace>0?1/(this.speed*this.cjkPace):1/this.speed)+e.pause,this._revealed>=this._glyphs.length&&this._finishLine()}_completeLine(){let e=this._glyphs;for(let t=this._revealed;t<e.length;t++)e[t].el&&e[t].el.classList.add(`is-on`);this._revealed=e.length,this._finishLine()}_finishLine(){this._typing=!1;let e=this._lines[this._index];e&&Array.isArray(e.choices)&&e.choices.length?(this._buildChoices(e.choices),this._choiceDelay=.12):this._nextEl.classList.add(`is-on`)}_advance(){if(this._index+1<this._lines.length)this._setLine(this._index+1);else if(this._hold){this._held=!0,this._nextEl.classList.remove(`is-on`);let e=this._resolve;this._resolve=null,e&&e(this._lastChoice)}else this.close()}_countLines(e,t,n){if(e.isConnected&&e.getClientRects().length){let t=parseFloat(getComputedStyle(e).lineHeight);if(t>0)return Math.max(1,Math.round(e.offsetHeight/t))}return String(t).split(`
`).reduce((e,t)=>e+(t.trim()?Qe(null,t,`body`,n):1),0)}_reach(e,t,n=0,r=this._glyphs.length){let i=null;for(let e=r-1;e>=n&&!i;e--)i=this._glyphs[e].el;if(!i)return 0;let a=e.getBoundingClientRect();return a.width?(i.getBoundingClientRect().right-a.left)/a.width*t:0}_width(){let e=St(this.element);if(!e)return zi;let t=e.artW-Hi,n=this.element.parentElement,r=n?.querySelector(`.lu-skills`);if(r&&!r.closest(`[hidden]`)){let i=n.getBoundingClientRect(),a=1/0;for(let e of r.querySelectorAll(`.lu-skill, .lu-skill .tx`)){let t=e.getBoundingClientRect();t.width>0&&t.height>0&&(a=Math.min(a,t.left))}a<1/0&&e.cssPx>0&&(t=Math.min(t,Math.floor((a-i.left)/e.cssPx)-Ui))}return Math.max(Wi,Math.min(zi,t-Ri))}_layout(){let e=this._lines[this._index];if(!this._open||!e)return;let t=Y(),n=this._view(e),r=Ri,i=this._width(),a=this._panel,o=this._textEl,s=this._askEl,c=r+(n.sheet?72:24),l=n.question?Gi:0,u=r+i-24-c-l;et(o,`body`,{color:n.question?t.sel:t.tx1,kw:t.kw,maxW:u,drop:!0});let d=B.body.L,f=ke(),p=this._speechShown()?this._countLines(o,e.text,u):0,m=!!n.ask&&this._askShown(),h=u-Gi,g=0,_=0;m&&(et(s,`body`,{color:t.sel,kw:t.kw,maxW:h,drop:!0}),g=this._countLines(s,n.ask,h),_=p?f?qi:Ki:0);let v=p+g,y=f?8:10,b=12+v*d+_+y,x=v?m?c+Gi+this._reach(s,h,this._nSpeech):c+l+this._reach(o,u,0,this._nSpeech):0,S=Vi,C=0,ee=12;for(let e=0;e<4&&(S=Math.max(Vi,Math.round(b)),C=Bi-S,ee=12+Math.floor((S-b)/2),!(!v||x<r+i-37-4));e++){let e=C+ee+(v-1)*d+_+dt(`body`)+ia(`body`)/2,t=Math.ceil(e+2-(C+S-15));if(t<=0)break;b+=t}let w=null;if(n.speaker){let e=2*Math.ceil(aa(`name`)/2),t=16+e,r=i-60,a=n.speaker,o=G(z(a),`name`,1);if(23+o>r){let e=[...He(z(a),`name`,r-23,1)];a=e.length>1?`${[...n.speaker].slice(0,e.length-1).join(``).trimEnd()}…`:n.speaker,o=G(z(a),`name`,1)}let s=n.title;if(s){let e=r-(16+o+6+7);s=e>=24?He(s,`line`,e):``}let c=s?G(s,`line`):0,l=s?16+o+6+c+7:16+o+7,u=C-t/2;w={shown:a,nw:o,title:s,gn:e,ph:t,pw:l,px0:40,py0:u,nc:u+t/2+.25}}let te=!w||w.px0+w.pw+3<r+Math.floor((i-1)/2)-11;K(a,r,C,i,S),H(a,[r,C]);let T=this._art;if(H(T,[r,C]),T.replaceChildren(),We(T,{...$i,trioTop:te},r,C,i,S),n.sheet){let e=It(n.sheet,{...Lt.dialogue,glow:Mt(n.color)[0]});e.classList.add(`lu-dialog__portrait`),e.setAttribute(`role`,`img`),e.setAttribute(`aria-label`,q(`dialog.portrait`,{name:n.speaker})),U(T,e,33,C+Math.floor((S-42)/2))}ra(o,`body`,c+l,C+ee,a);let E=C+ee+p*d+_;m&&ra(s,`body`,c+Gi,E,a),(n.question||m)&&U(T,Ce(1,J.gold(),{setting:[t.g5,t.g4,t.g3]}),c,Math.round((m?E:C+ee)+dt(`body`)-2),1,`lu-dialog__ask`),K(this._nextEl,i-37,S-15,9,8);let D=this._nameEl,O=this._nameArt;if(D.classList.toggle(`is-empty`,!w),w){let{px0:e,py0:i,pw:a,ph:o,gn:s,nw:c,nc:l}=w;K(D,e-r,i-C,a,o),H(D,[e,i]),H(O,[e,i]),O.replaceChildren(),We(O,ea(),e,i,a,o),U(O,Ce(2,Mt(n.color)),e+6,i+o/2-3,1,`lu-dialog__gem`);let u=this._speakerEl;u.textContent!==w.shown&&(u.textContent=w.shown),et(u,`name`,{track:1,color:t.g4,drop:!0}),ra(u,`name`,e+16,l-dt(`name`),D);let d=this._titleEl;w.title?(U(O,Nt(1,10+s,e=>e.vline(0,0,10+s,t.dm1)),e+16+c+3,i+3),d.textContent=w.title,et(d,`line`,{color:t.tx2,drop:!0}),ra(d,`line`,e+16+c+6,l+ia(`name`)/2-ia(`line`)/2-dt(`line`),D),d.hidden=!1):(d.textContent=``,d.hidden=!0)}this._geo={x0:r,y0:C,w:i,h:S,LH:d,plateEnd:w?w.px0+w.pw:0,gn:w?w.gn:0},this._choicesLine===this._index&&this._choiceEls.length&&this._layoutChoices()}_layoutChoices(){let e=this._geo;if(!e)return;let{x0:t,y0:n,w:r,LH:i}=e,a=16+2*Math.ceil(aa(`body`)/2),o=this._choiceLabels,s=fi(Yi),c=12+s+Zi,l=Math.min(r-20,Math.max(100,Math.max(...o.map(e=>G(e,`body`)))+Qi+c)),u=l-Qi-c,d=o.map(e=>{let t=G(e,`body`)>u?Qe(null,e,`body`,u):1;return{nl:t,rh:a+(t-1)*i}}),f=12+d.reduce((e,t)=>e+t.rh,0),p=t+r-10-l,m=n-10-f-(e.plateEnd&&e.plateEnd+4>p?4+e.gn/2:0),h=this._choicesEl;K(h,p,m,l,f),H(h,[p,m]);let g=this._choiceArt;H(g,[p,m]),g.replaceChildren(),We(g,ta(),p,m,l,f);let _=m+6;this._keyRows.length=0,this._choiceEls.forEach((e,t)=>{let{nl:n,rh:r}=d[t];K(e,6,_-m,l-12,r),H(e,[p+6,_]);let i=e.querySelector(`.lu-choice__label`);e.replaceChildren(i),U(e,Ie(l-12,r),p+6,_,1,`lu-choice__band`),U(e,ot(`cursorGem`),p+8,_+a/2-4,1,`lu-choice__cursor`),et(i,`body`,{drop:!0,maxW:n>1?u:null}),ra(i,`body`,p+Qi,_+a/2-dt(`body`),e),this._keyRows.push({x:l-6-Xi-s,y:Math.round(_-m+a/2-5.5),w:s}),_+=r}),this._placeKey()}_placeKey(){let e=this._keyRows[this._choiceIndex];e&&K(this._keyEl,e.x,e.y,e.w,11)}_buildChoices(e){let t=this._choicesEl;t.classList.remove(`is-armed`),this._keyEl.classList.remove(`is-nudge-a`,`is-nudge-b`);for(let e of this._choiceEls)e.remove();this._choiceEls.length=0,this._choiceLabels=e.map(e=>String(e)),this._choiceLabels.forEach((e,n)=>{let r=document.createElement(`li`);r.className=`g lu-choice`;let i=document.createElement(`div`);i.className=`lu-choice__label`,i.textContent=e,r.append(i),r.addEventListener(`pointermove`,()=>{this._choicesActive&&this._choiceIndex!==n&&this._setChoice(n,!0)}),r.addEventListener(`click`,e=>{e.stopPropagation(),this._choicesActive&&this._guard<=0&&this._selectChoice(n)}),t.appendChild(r),this._choiceEls.push(r)}),this._choicesLine=this._index,this._layoutChoices(),this._setChoice(0,!1)}_activateChoices(){this._choiceDelay=-1,this._choicesActive=!0,this._choiceArmed=!1,this._quiet=this.choiceQuiet,this._react=0,this._choicesEl.classList.remove(`is-armed`),this._keyEl.classList.remove(`is-nudge-a`,`is-nudge-b`),this._setChoicesVisible(!0)}_arm(e){if(this._choiceArmed){this._react=Math.min(this._react,e);return}this._choiceArmed=!0,this._react=e,this._choicesEl.classList.add(`is-armed`)}_lock(){this._choiceArmed=!1,this._react=0,this._quiet=this.choiceQuiet,this._choicesEl.classList.remove(`is-armed`)}_nudgeKey(){this._nudgeA=!this._nudgeA,this._keyEl.classList.toggle(`is-nudge-a`,this._nudgeA),this._keyEl.classList.toggle(`is-nudge-b`,!this._nudgeA)}_setChoicesVisible(e){e||(this._choicesActive=!1,this._choiceArmed=!1),this._choicesEl.classList.toggle(`is-on`,e)}_setChoice(e,t){let n=this._choiceEls.length;if(n){this._choiceIndex=(e%n+n)%n;for(let e=0;e<n;e++)this._choiceEls[e].classList.toggle(`is-sel`,e===this._choiceIndex);this._placeKey(),t&&this._sound(`blip`)}}_moveChoice(e){this._choiceEls.length>1&&this._setChoice(this._choiceIndex+e,!0)}_selectChoice(e){this._lastChoice=e,this._sound(`confirm`),this._setChoicesVisible(!1),this._advance()}};function ca(e){return typeof e==`string`&&e.trim()!==``}function la(e){return typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement&&e.width>0&&e.height>0}var ua=1.1,da=520,fa=class{constructor(e=document.body){let t=document.createElement(`div`);t.className=`lu-banner`,t.setAttribute(`aria-live`,`polite`),e.appendChild(t),this.element=t,this._t1=0,this._t2=0,this._resolve=null,this._visible=!1,this._titleText=``,this._subText=``,this._key=``,this._box=null,this._unscale=Re(e,()=>{this._visible&&this._render()})}get visible(){return this._visible}get box(){return this._visible&&this._box?{...this._box}:null}_announce(){this.element.dispatchEvent(new CustomEvent(`lu-banner`,{bubbles:!0,detail:this.box}))}show(e,t=``,{duration:n=3.5}={}){this._settle(),clearTimeout(this._t1),clearTimeout(this._t2);let r=this.element,i=String(e??``),a=String(t??``);this._titleText=i,this._subText=a,this._render(),r.classList.remove(`is-in`,`is-out`),r.offsetWidth,r.classList.add(`is-in`),this._visible=!0,this._announce(),this._t1=setTimeout(()=>this.hide(),Math.max(1.2,n)*1e3);let o=R();return o&&Tt()&&o.ensure(`${i}\n${a}`).then(()=>{this._visible&&this._titleText===i&&this._subText===a&&this._render()},()=>{}),new Promise(e=>{this._resolve=e})}hide(e=!1){let t=this.element;if(e){if(!this._visible)return;clearTimeout(this._t1),clearTimeout(this._t2),t.classList.remove(`is-in`,`is-out`),this._visible=!1,this._announce(),this._settle();return}this._visible&&!t.classList.contains(`is-out`)&&(clearTimeout(this._t1),t.classList.remove(`is-in`),t.classList.add(`is-out`),this._t2=setTimeout(()=>{t.classList.remove(`is-out`),this._visible=!1,this._announce(),this._settle()},ua*1e3))}dispose(){clearTimeout(this._t1),clearTimeout(this._t2),this._unscale(),this._visible&&(this._visible=!1,this._announce()),this._settle(),this.element.remove()}_settle(){let e=this._resolve;this._resolve=null,e&&e()}_render(){let e=Y(),t=He(z(this._titleText),`head`,da,1),n=He(this._subText,`line`,da),r=G(t,`head`,1),i=n?G(n,`line`):0,a=2*Math.ceil(Ue(`head`)/2),o=n?2*Math.ceil(Ue(`line`)/2):0,s=St(this.element),c=`${t}\n${n}\n${r}\n${i}\n${a}\n${o}\n${s?.artW}x${s?.artH}`;if(c===this._key&&this.element.firstChild)return;this._key=c;let l=this.element;l.replaceChildren();let u=Math.max(102,r+40,i+30);u+=u%2;let d=60+a/2,f=81+a,p=n?93+a+o:84+a,m=320-u/2-24,h=u+48,g=p+7-50,_=mt(l,`tc`,m,48,h,g+2),v=st(h,g,Ae(e.band),(e,t)=>Math.max(0,1-Math.hypot((e-.5)/.5,(t-.5)/.5))*1.4*.7,[.25,.5,.7]);for(let[t,n,r,i]of[[v,m,50,`lu-banner__shade`],[je(u,`both`),320-u/2,57,`lu-banner__rule`],[je(u,`both`),320-u/2,p,`lu-banner__rule`],[Nt(9,5,t=>Pt(t,4,2,1,J.gold(),{setting:[e.g5,e.g4,e.g3]})),316,55,`lu-banner__gem`]])U(_,t,n,r,1,i).setAttribute(`aria-hidden`,`true`);let y=it(_,t,320,d,{font:`head`,track:1,color:e.g5,align:`center`,ol:!0,cls:`lu-banner__title`});y.setAttribute(`role`,`heading`),y.setAttribute(`aria-level`,`2`),it(_,n,320,f,{font:`line`,color:e.g4,align:`center`,ol:!0,cls:`lu-banner__sub`});let b=_.dataset.fit===`shrunk`&&Number(_.style.getPropertyValue(`--lu-fit`))||1;this._box={x:320-u/2,y:55,w:u,h:p+1-55,fit:b},this._visible&&this._announce()}};function pa(e=22,t=2024){let n=new pe(t),r=``;for(let t=0;t<e;t++){let e=n.range(0,1)<.3?2:1,t=n.range(4,96).toFixed(1),i=n.range(11,22).toFixed(1),a=(-n.range(0,22)).toFixed(1),o=Math.round(n.range(-20,20)),s=n.range(.45,.95).toFixed(2);r+=`<span class="lu-mote" style="--x:${t}%;--k:${e};--d:${i}s;--dl:${a}s;--sw:${o};--n:${Math.max(1,Math.abs(o))};--a:${s}"><i></i></span>`}return r}var ma=new Set([`ShiftLeft`,`ShiftRight`,`ControlLeft`,`ControlRight`,`AltLeft`,`AltRight`,`MetaLeft`,`MetaRight`,`F5`,`F11`,`F12`,`CapsLock`,`Tab`]),ha=new Set([`Enter`,`NumpadEnter`,`Space`]),ga=`KeyL`,_a=Object.freeze([Object.freeze({code:`en`,label:`EN`}),Object.freeze({code:`ja`,label:`日本語`}),Object.freeze({code:`zh`,label:`中文`})]),va=Object.freeze({E:[`......`,`......`,`......`,`######`,`#.....`,`#.....`,`#.....`,`#####.`,`#.....`,`#.....`,`#.....`,`######`],N:[`.......`,`.......`,`.......`,`#.....#`,`##....#`,`#.#...#`,`#.#...#`,`#..#..#`,`#...#.#`,`#...#.#`,`#....##`,`#.....#`],日:[`#########`,`#.......#`,`#.......#`,`#.......#`,`#.......#`,`#########`,`#.......#`,`#.......#`,`#.......#`,`#.......#`,`#.......#`,`#########`],本:[`......#......`,`......#......`,`#############`,`.....###.....`,`....#.#.#....`,`...#..#..#...`,`..#...#...#..`,`.#....#....#.`,`#...#####...#`,`......#......`,`......#......`,`......#......`],語:[`..#...#######`,`#####...#....`,`........#....`,`.###...#####.`,`...........#.`,`.###..#######`,`.............`,`#####..#####.`,`#...#..#...#.`,`#...#..#...#.`,`#...#..#...#.`,`#####..#####.`],中:[`.....#.....`,`.....#.....`,`###########`,`#....#....#`,`#....#....#`,`#....#....#`,`###########`,`.....#.....`,`.....#.....`,`.....#.....`,`.....#.....`,`.....#.....`],文:[`......#......`,`......#......`,`#############`,`..#.......#..`,`...#.....#...`,`....#...#....`,`.....#.#.....`,`......#......`,`.....#.#.....`,`....#...#....`,`..##.....##..`,`##.........##`]});function ya(e,t){let n=[...e];if(!n.length||!n.every(e=>Object.prototype.hasOwnProperty.call(va,e)))return null;let r=n.map(e=>va[e]),i=n.map(e=>/[A-Z]/.test(e)),a=e=>i[e]&&i[e+1]?1:2,o=r.reduce((e,t,n)=>e+t[0].length+(n<r.length-1?a(n):0),0),s=Y();return Nt(o+2,14,e=>{let n=[],i=1;r.forEach((e,t)=>{e.forEach((e,t)=>{for(let r=0;r<e.length;r++)e[r]===`#`&&n.push([i+r,1+t])}),i+=e[0].length+a(t)});let o=new Set(n.map(([e,t])=>`${e},${t}`));for(let[t,r]of n)for(let[n,i]of[[1,0],[-1,0],[0,1],[0,-1]])o.has(`${t+n},${r+i}`)||e.px(t+n,r+i,s.ink0);for(let[r,i]of n)e.px(r,i,t)})}var ba=()=>{let e=nt();return bt(e)/e},xa=560,Sa=600;function Ca(e,t,n,r,i,a){let o=document.createElement(`div`);o.className=`g ${a}`;let[s,c]=qe(e);return K(o,Math.round(t-s),Math.round(n-c),r,i),H(o,[Math.round(t),Math.round(n)]),e.append(o),o}var wa=class{constructor(e=document.body){let t=document.createElement(`div`);t.className=`lu-title is-gone`,t.innerHTML=`
      <div class="lu-title__motes" aria-hidden="true">${pa()}</div>
      <h1 class="lu-title__name"></h1>
      <div class="lu-title__part lu-title__part--crest" aria-hidden="true"></div>
      <div class="lu-title__part lu-title__part--logo" aria-hidden="true"></div>
      <div class="lu-title__part lu-title__part--rule" aria-hidden="true"></div>
      <div class="lu-title__part lu-title__part--sub"></div>
      <div class="lu-title__part lu-title__part--menu"></div>
      <div class="lu-title__part lu-title__part--foot"></div>
      <div class="lu-title__part lu-title__part--lang"></div>`,e.appendChild(t),this.element=t,this._name=t.querySelector(`.lu-title__name`);let n=e=>t.querySelector(`.lu-title__part--${e}`);this._parts={crest:n(`crest`),logo:n(`logo`),rule:n(`rule`),sub:n(`sub`),menu:n(`menu`),foot:n(`foot`),lang:n(`lang`)},this.armDelay=.45,this.onDismiss=null,this._visible=!1,this._leaving=!1,this._armedAt=0,this._resolve=null,this._hideTimer=0,this._promptText=``,this._o={title:``,subtitle:``,credit:``,titleSource:``},this._destEl=null,this._destLabel=null,this._destHint=null,this._destHintText=``,this._destVerb=null,this._destPrompt=null,this._dests=null,this._menu=!1,this._destIndex=0,this._curIndex=0,this._current=null,this._langs=null,this._langCur=0,this._langSel=0,this._langFocus=!1,this._onLanguage=null,this._laidPx=0,this._laidW=0,this._headBottom=0,this._headBox={half:0,top:180,bottom:180},this._menuBox={half:0,top:180,bottom:180},this._logos=new Map,this._loaded=new Set,this._loading=new Set,this._showId=0,this._fontsIn=!1,this._onKey=e=>{if(!(!this._accepting()||e.repeat||ma.has(e.code))){if(e.preventDefault(),e.stopPropagation(),this._langs&&e.code===ga){this._langFocus?this._stepLang(1):this._focusLang();return}if(this._langFocus){e.code===`ArrowLeft`||e.code===`ArrowRight`?this._stepLang(e.code===`ArrowLeft`?-1:1):ha.has(e.code)?this._applyLang(this._langSel):this._blurLang();return}if(this._menu){e.code===`ArrowUp`||e.code===`ArrowLeft`||e.code===`KeyW`?this._cycle(-1):e.code===`ArrowDown`||e.code===`ArrowRight`||e.code===`KeyS`?this._cycle(1):ha.has(e.code)&&this._dismiss(`key`);return}if(this._dests){if(e.code===`ArrowLeft`||e.code===`ArrowRight`){this._cycle(e.code===`ArrowLeft`?-1:1);return}ha.has(e.code)||this._resetDest()}this._dismiss(`key`)}},this._onPointer=e=>{if(!this._accepting())return;let t=e.target,n=t?.closest?.(`.lu-title__lang-opt`);if(n&&this._langs){e.preventDefault(),e.stopPropagation(),this._applyLang(Number(n.dataset.index));return}let r=t?.closest?.(`.lu-title__dest-arrow`);if(r&&this._dests){e.preventDefault(),e.stopPropagation(),this._cycle(r.classList.contains(`lu-title__dest-arrow--prev`)?-1:1);return}if(this._langFocus){e.preventDefault(),this._blurLang();return}if(this._menu){let n=t?.closest?.(`.lu-title__menu-item`);if(!n)return;e.preventDefault(),this._destIndex=Number(n.dataset.index)||0,this._renderMenu(),this._dismiss(`pointer`);return}e.preventDefault(),this._dests&&!t?.closest?.(`.lu-title__dest-label`)&&this._resetDest(),this._dismiss(`pointer`)},this._offScale=Re(e,e=>{this._visible&&!this._leaving&&(e.px!==this._laidPx||e.artW!==this._laidW?this._layout():this._fitGroups())})}get visible(){return this._visible}get destination(){return this._dests?this._destIndex===this._curIndex?this._current:this._dests[this._destIndex].value:null}get language(){return this._langs?{current:this._langs[this._langCur].code,selected:this._langs[this._langSel].code,focused:this._langFocus}:null}show({title:e=q(`title.name`),subtitle:t=``,prompt:n=q(`title.pressAnyKey`),credit:r=q(`title.credit`),destinations:i,current:a,destinationHint:o,destinationVerb:s,destinationPrompt:c,menu:l=!1,titleSource:u,languages:d,lang:f,onLanguage:p}={}){this._settle(void 0),clearTimeout(this._hideTimer);let m=e=>e==null?``:String(e);this._o={title:m(e),subtitle:m(t),credit:m(r),titleSource:m(u)},this._name.textContent=this._o.title,this._promptText=m(n),this._destVerb=s==null?null:m(s).trim(),this._destPrompt=c==null?null:m(c),this._destHintText=o==null?q(`title.chooseLevel`):m(o).trim(),this._setDestinations(i,a,!!l),this._setLanguages(d,f,p);let h=this.element;h.classList.remove(`is-on`,`is-leaving`,`is-gone`),h.classList.toggle(`is-menu`,this._menu),h.offsetWidth,h.classList.add(`is-on`),this._visible=!0,this._leaving=!1;let g=++this._showId;this._fontsIn=!1,this._layout();let _=R(),v=this._texts(),y=()=>{this._visible&&!this._leaving&&g===this._showId&&(this._fontsIn=!0,this._layout())};return _?_.ensure(v).then(y,y):document.fonts?.ready.then(y,y),this._armedAt=performance.now()+this.armDelay*1e3,window.addEventListener(`keydown`,this._onKey,!0),h.addEventListener(`pointerdown`,this._onPointer),new Promise(e=>{this._resolve=e})}hide(){this._visible&&!this._leaving&&(this._leave(),this._settle(void 0))}dispose(){this._detach(),clearTimeout(this._hideTimer),this._settle(void 0),this._offScale(),this.element.remove()}_accepting(){return this._visible&&!this._leaving&&performance.now()>=this._armedAt}_dismiss(e){this._leave(),this.onDismiss&&this.onDismiss(e),this._settle(e)}_leave(){this._leaving=!0,this._detach();let e=this.element;e.classList.add(`is-leaving`),e.classList.remove(`is-on`),clearTimeout(this._hideTimer),this._hideTimer=setTimeout(()=>{e.classList.remove(`is-leaving`),e.classList.add(`is-gone`),this._visible=!1,this._leaving=!1},1150)}_detach(){window.removeEventListener(`keydown`,this._onKey,!0),this.element.removeEventListener(`pointerdown`,this._onPointer)}_settle(e){let t=this._resolve;this._resolve=null,t&&t(e)}_texts(){let e=this._o,t=[e.title,e.subtitle,e.credit,e.titleSource,this._promptText,this._destHintText,q(`title.choose`),q(`title.start`),q(`title.language`),q(`title.langSwitch`),q(`title.langBack`)];for(let e of this._dests??[])t.push(e.label,e.detail,this._changedPrompt(e.label));for(let e of this._langs??[])t.push(e.label);return t.filter(Boolean).join(`
`)}_setDestinations(e,t,n){let r=Array.isArray(e)?e.filter(e=>e&&e.value!=null).map(e=>({value:String(e.value),label:String(e.label??e.value),detail:e.detail==null?``:String(e.detail)})):[];if(!r.length){this._dests=null,this._current=null,this._menu=!1;return}this._dests=r,this._menu=n,this._current=t==null?r[0].value:String(t),this._curIndex=Math.max(0,r.findIndex(e=>e.value===this._current)),this._destIndex=this._curIndex}_setLanguages(e,t,n){this._onLanguage=typeof n==`function`?n:null;let r=Array.isArray(e)&&e.length?e:_a,i=this._onLanguage?r.filter(e=>e&&e.code!=null).map(e=>({code:String(e.code),label:String(e.label??e.code)})):[];if(this._langs=i.length?i:null,!this._langs){this._langFocus=!1;return}let a=String(t??Dt());this._langCur=Math.max(0,this._langs.findIndex(e=>e.code===a)),this._langSel=this._langCur,this._langFocus=!1}_cycle(e){let t=this._dests.length;this._destIndex=(this._destIndex+e+t)%t,this._renderMenu()}_resetDest(){this._dests&&this._destIndex!==this._curIndex&&(this._destIndex=this._curIndex,this._renderMenu())}_changedPrompt(e){return this._destPrompt==null?this._destVerb?`${this._destVerb} ${e}`:q(`title.travelTo`,{label:e}):this._destPrompt.replace(/\{label\}/g,e)}_focusLang(){this._langs&&(this._langFocus=!0,this._langSel=this._langCur,this._renderLang())}_stepLang(e){if(!this._langs)return;this._langFocus||(this._langFocus=!0,this._langSel=this._langCur);let t=this._langs.length;this._langSel=(this._langSel+e+t)%t,this._renderLang()}_blurLang(){this._langFocus=!1,this._langs&&(this._langSel=this._langCur),this._renderLang()}_applyLang(e){let t=this._langs?.[e];if(t){if(e===this._langCur){this._blurLang();return}this._langCur=e,this._langSel=e,this._langFocus=!1,this._renderLang(),this._onLanguage?.(t.code)}}_layout(){this._laidPx=nt(),this._laidW=St(this.element)?.artW??640,this._renderHead(),this._renderMenu(),this._renderFoot(),this._renderLang()}_room(){let e=St(this.element)?.artW??640;return Math.max(160,2*Math.floor((e-32)/2))}_logo(e,t,n=xa){let r=Se(),i=`${e}|${r}|${n}|${t}`,a=this._logos.get(i);if(!a){let o=!(e===`text`||!ye(t))||(e===`text`?this._fontLoaded(xe[r===`zh`?`zh`:`ja`][0],t):this._fontsIn);if(e===`text`&&!o)return null;a=e===`text`?_e(t,r,{maxW:n}).canvas:e===`mark`?be(z(t),1):ve(z(t),{maxW:n}).canvas,o&&(this._logos.size>16&&this._logos.clear(),this._logos.set(i,a))}let o=At(a);return o.setAttribute(`aria-hidden`,`true`),o}_fontLoaded(e,t){if(!e||typeof document>`u`||!document.fonts)return!1;let n=`${e}|${t}`;if(this._loaded.has(n))return!0;if(this._loading.has(n))return!1;let r=/"([^"]+)"|([A-Za-z0-9]+)\s*$/.exec(e),i=(r?.[1]??r?.[2]??``).toLowerCase(),a=!1;for(let e of document.fonts)if(e.family.replace(/["']/g,``).toLowerCase()===i){a=!0;break}if(!a)return!1;this._loading.add(n);let o=this._showId,s=()=>{this._loading.delete(n),this._loaded.add(n),this._visible&&!this._leaving&&o===this._showId&&this._layout()};return document.fonts.load(e,t).then(s,s),!1}_renderHead(){let{crest:e,logo:t,rule:n,sub:r}=this._parts;for(let i of[e,t,n,r])i.replaceChildren();let i=Y(),a=this._o,o=Se(),s=e=>mt(e,`mc`,40,50,xa,300),c=s(e),l=s(t),u=s(n),d=s(r),f=a.title,p=this._room(),m=Math.min(xa,p),h=110,g,_;if(ye(f)||!Object.prototype.hasOwnProperty.call(xe,o)){let e=this._logo(`roman`,f,m),t=140-e.height;g=t-29,U(l,e,320-Math.floor(e.width/2),t,1,`lu-title__logo`),h=Math.max(h,Math.ceil(e.width/2)),_=150}else{let e=this._logo(`text`,f,m),t=e?e.height:o===`zh`?70:54,n=Math.max(42,86-Math.max(0,t-90));g=n-34,e&&(U(l,e,320-Math.floor(e.width/2),n,1,`lu-title__logo`),h=Math.max(h,Math.ceil(e.width/2)));let r=n+t+2,i=a.titleSource.trim();if(i&&i!==f){let e=this._logo(`mark`,i);e&&e.width<=m&&(U(l,e,320-Math.floor(e.width/2),r,1,`lu-title__wordmark`),h=Math.max(h,Math.ceil(e.width/2)),r+=e.height)}_=r+2}if(U(c,Ct(25),307,g,1,`lu-title__crest`),U(u,Ne(219),211,_,1,`lu-title__divider`),this._headBottom=_+13,a.subtitle){let e=He(a.subtitle,`line`,Math.min(Sa,p),2),t=it(d,e,320,_+18,{font:`line`,track:2,color:i.tx2,align:`center`,ol:!0,cls:`lu-title__sub`});h=Math.max(h,Math.ceil(t.tw/2)+1),this._headBottom=_+18+B.line.L}this._headBox={half:h,top:g,bottom:this._headBottom}}_renderMenu(){let e=this._parts.menu;e.replaceChildren(),this._destEl=null,this._destLabel=null,this._destHint=null;let t=mt(e,`mc`,40,50,xa,300),n=Math.max(0,Math.ceil(this._headBottom+14)-222);if(this._menu&&this._dests){this._menuBox=this._renderList(t,222+n);let e=Ca(t,40,222+n,560,16,`lu-title__prompt is-hidden`),r=this._dests[this._destIndex],i=document.createElement(`span`);i.className=`lu-title__prompt-text`,i.textContent=this._destIndex===this._curIndex?this._promptText:this._changedPrompt(r.label),e.append(i)}else if(this._dests){let e=this._renderPrompt(t,230+n),r=this._renderChooser(t,244+n);this._menuBox={half:Math.max(e.half,r.half),top:Math.min(e.top,r.top),bottom:Math.max(e.bottom,r.bottom)}}else this._menuBox=this._renderPrompt(t,244+n);this._fitGroups()}_fitGroups(){let e=this._headBox,t=this._menuBox,n=Math.ceil(Math.max(e.half,t.half,1)),r=Math.floor(Math.min(e.top,t.top)),i=Math.ceil(Math.max(e.bottom,t.bottom));for(let e of[`crest`,`logo`,`rule`,`sub`,`menu`]){let t=this._parts[e].firstElementChild;t&&tt(t,`mc`,320-n,r,2*n,Math.max(1,i-r))}}_renderPrompt(e,t){let n=Y(),r=Ca(e,40,t-9,560,18,`lu-title__prompt`),i={half:0,top:t-9,bottom:t+9},a=this._dests?.[this._destIndex];if(a&&this._destIndex!==this._curIndex){let e=this._changedPrompt(a.label),o=G(e,`name`),s=ct(`Enter`)+6+o,c=320-Math.floor(s/2);return c+=Ze(r,`Enter`,c,Math.round(t-5.5))+6,W(r,e,c,t,{font:`name`,color:n.g4,ol:!0,cls:`lu-title__prompt-text`}),i.half=Math.ceil(s/2)+1,i}let o=this._promptText;if(!o)return i;let s=G(o,`name`),c=320-Math.floor(s/2);return U(r,Ce(2,J.gold()),c-15,Math.round(t-3.5),1,`lu-title__gem`),U(r,Ce(2,J.gold()),c+s+8,Math.round(t-3.5),1,`lu-title__gem`),W(r,o,320,t,{font:`name`,color:n.tx1,align:`center`,ol:!0,cls:`lu-title__prompt-text is-blink`}),i.half=Math.ceil(s/2)+15,i}_renderChooser(e,t){let n=Y(),r=2*Math.ceil(Ue(`name`)/2),i=this._dests[this._destIndex],a=this._destIndex!==this._curIndex,o=Math.max(...this._dests.map(e=>G(e.label,`name`))),s=Math.max(110,o+50),c=320-Math.floor(s/2),l=Ca(e,c,t-r/2,s,16+r+22,`lu-title__dest${a?` is-changed`:``}`),u=Ca(l,c,t-r/2,s,16+r,`lu-title__dest-label`);U(u,Pe(s,16+r),c,t-r/2),W(u,i.label,320,t+8,{font:`name`,color:a?n.g5:n.g4,align:`center`,ol:!0});let d=this._dests.length<2;for(let[e,n]of[[-1,c+6],[1,c+s-11]]){let i=Ca(l,n-5,t-r/2,15,16+r,`lu-title__dest-arrow lu-title__dest-arrow--${e<0?`prev`:`next`}`);i.setAttribute(`role`,`button`),i.setAttribute(`aria-label`,q(e<0?`title.prevLevel`:`title.nextLevel`));let a=e<0?`left`:`right`;U(i,d?Te(a):ot(a),n,t+5)}let f=t+16+r/2+6,p=Ca(l,c,f,s,11,`lu-title__dest-hint`),m=$e(p,[{keys:[`←`,`→`],label:this._destHintText}],320,f,{align:`center`,color:n.tx2,ol:!0});return this._destEl=l,this._destLabel=u,this._destHint=p,{half:Math.ceil(Math.max(s,m+2)/2),top:t-r/2,bottom:f+11}}_renderList(e,t){let n=Y(),r=2*Math.ceil(Ue(`name`)/2),i=Math.max(110,...this._dests.map(e=>G(e.label,`name`)+50)),a=Ca(e,320-Math.floor(i/2)-10,t-r/2,i+20,80,`lu-title__dest is-menu`);a.setAttribute(`role`,`menu`),a.setAttribute(`aria-label`,q(`title.menu`));let o=t,s=t,c=!1,l=i/2+10;this._dests.forEach((e,t)=>{let u=t===this._destIndex,d=16+r+(e.detail?12:0),f=Ca(a,320-Math.floor(i/2),o-r/2,i,d,`lu-title__menu-item`);if(f.dataset.index=String(t),f.setAttribute(`role`,`menuitem`),u&&f.setAttribute(`aria-current`,`true`),u){let t=Math.max(110,G(e.label,`name`)+50);U(f,Pe(t,16+r),320-t/2,o-r/2),U(f,ot(`cursorGem`),320-t/2-6,o+4,1,`nudge`)}let p=W(f,e.label,320,o+8,{font:`name`,color:u?n.g4:n.tx2,align:`center`,ol:!0,cls:u?`lu-title__dest-label`:`lu-title__menu-label`});if(u&&(this._destLabel=p),e.detail){let t=it(f,e.detail,320,o+18+r/2,{font:`line`,color:n.tx2,align:`center`,ol:!0,cls:`lu-title__menu-detail`});l=Math.max(l,t.tw/2+1)}s=o,c=!!e.detail,o+=e.detail?30+r/2:22+r/2});let u=s+24-r/2+(c?10+r/2:0),d=Ca(a,40,u,560,11,`lu-title__dest-hint`),f=$e(d,[{keys:[`↑`,`↓`],label:q(`title.choose`)},{keys:[`Space`],label:q(`title.start`)}],320,u,{align:`center`,color:n.tx2,ol:!0});return this._destEl=a,this._destHint=d,{half:Math.ceil(Math.max(l,f/2+1)),top:t-r/2,bottom:u+11}}_renderFoot(){let e=this._parts.foot;e.replaceChildren();let t=this._o.credit;if(!t)return;let n=Y(),r=mt(e,`bc`,160,334,320,20);it(r,He(z(t),`line`,600,1),320,338,{font:`line`,track:1,color:n.tx3,align:`center`,ol:!0,cls:`lu-title__credit`})}_renderLang(){let e=this._parts.lang;if(e.replaceChildren(),!this._langs)return;let t=Y(),n=342.5,r=ba(),i=this._langFocus?this._langSel:this._langCur,a=this._langs.map(e=>{let i=ya(e.label,t.g4);if(i){let t=Math.ceil(i.width*r);return{w:t,pw:Math.max(t+18,Math.ceil(t/.56)),draw:(t,a,o)=>U(t,ya(e.label,o),a,Math.round(n-i.height*r/2),r,`lu-title__lang-glyphs`)}}let a=G(e.label,`line`);return{w:a,pw:Math.max(a+18,Math.ceil(a/.56)),draw:(t,r,i)=>{W(t,e.label,r,n,{font:`line`,color:i,ol:!0})}}}),o=ct(`L`),s=o+15+a.reduce((e,t)=>e+t.pw+12,-12),c=630-s,l=mt(e,`br`,c-16,318,s+18,32,`lu-title__lang`);l.setAttribute(`role`,`radiogroup`),l.setAttribute(`aria-label`,q(`title.language`)),Ze(l,`L`,c,337),c+=o+15,a.forEach((e,r)=>{let o=r===i,s=Ca(l,c,n-13/2,e.pw,13,`lu-title__lang-opt${o?` is-lit`:``}${r===this._langCur?` is-current`:``}`);s.dataset.index=String(r),s.dataset.lang=this._langs[r].code,s.setAttribute(`role`,`radio`),s.setAttribute(`aria-checked`,String(r===this._langCur)),s.setAttribute(`aria-label`,this._langs[r].label),o&&U(s,Pe(e.pw,13),c,336);let u=o?this._langFocus?t.g5:t.g4:r===this._langCur?t.g3:t.tx3;e.draw(s,c+Math.floor((e.pw-e.w)/2),u),o&&this._langFocus&&U(s,ot(`cursorGem`),c-12,338,1,`nudge`),c+=e.pw,r<a.length-1&&(this._langFocus&&r+1===i||U(l,Nt(3,3,e=>{e.px(1,0,t.ink0),e.px(0,1,t.ink0),e.px(2,1,t.ink0),e.px(1,2,t.ink0),e.px(1,1,t.g3)}),c+4,341),c+=12)}),this._langFocus&&$e(l,[{keys:[`←`,`→`],label:q(`title.language`)},{keys:[`Enter`],label:q(`title.langSwitch`)},{keys:[`Esc`],label:q(`title.langBack`)}],630,322,{align:`right`,color:t.tx2,ol:!0})}},Ta=()=>{let e=Y();return{size:`S`,notch:3,corners:null,ends:!0,endR:2,bands:[e.plate0,e.plate1],stops:[0,.5],sheen:!1}},Ea=[6,12,18],Q=new E,Da=class{constructor(e=document.body){kt(`dialog`)||wt(`dialog`,Vr);let t=document.createElement(`div`);t.className=`lu-prompt`,t.innerHTML=`
      <div class="lu-prompt__anchor">
        <div class="lu-prompt__inner">
          <div class="lu-prompt__bubble g" aria-hidden="true"></div>
          <div class="lu-prompt__label g"></div>
        </div>
      </div>`,e.appendChild(t),this.element=t,this._inner=t.querySelector(`.lu-prompt__inner`),this._bubble=t.querySelector(`.lu-prompt__bubble`),this._label=t.querySelector(`.lu-prompt__label`),this._parent=e;let n=Y();U(this._bubble,_t(),0,0),Ea.forEach((e,t)=>{let r=Nt(2,2,e=>e.rect(0,0,2,2,n.kf1));U(this._bubble,r,e,6,1,`lu-prompt__dot lu-prompt__dot${t+1}`)}),this.keyHint=null,this._shown=!1,this._inView=!1,this._target=null,this._pos=new E,this._offsetY=0,this._labelText=null,this._keyText=null,this._x=NaN,this._y=NaN,this._w=e.clientWidth||window.innerWidth,this._h=e.clientHeight||window.innerHeight,this._ensureSeq=0,this._layout(),this._ro=typeof ResizeObserver<`u`?new ResizeObserver(()=>{this._w=e.clientWidth||window.innerWidth,this._h=e.clientHeight||window.innerHeight,this._x=NaN}):null,this._ro&&this._ro.observe(e),this._offScale=Re(e,()=>{this._x=NaN,this._layout()})}get visible(){return this._shown}show(e,t=q(`dialog.prompt.talk`),{offsetY:n=0,key:r}={}){e&&e.isObject3D?(this._target!==e&&this._shown&&this._repop(),this._target=e):(this._target=null,e&&this._pos.copy(e)),this._offsetY=n;let i=r===void 0?this.keyHint:r;(t!==this._labelText||i!==this._keyText)&&(this._labelText=t,this._keyText=i,this._layout(),this._ensureFonts()),this._shown||(this._shown=!0,this._x=NaN,this.element.classList.add(`is-on`))}hide(){this._shown&&(this._shown=!1,this._inView=!1,this.element.classList.remove(`is-on`,`is-inview`))}update(e){if(!this._shown||!e)return;this._target?this._target.getWorldPosition(Q):Q.copy(this._pos),Q.y+=this._offsetY||0,e.updateMatrixWorld(),Q.applyMatrix4(e.matrixWorldInverse);let t=Q.z>-(e.near??.01);Q.applyMatrix4(e.projectionMatrix);let n=!t&&Q.x>-1.08&&Q.x<1.08&&Q.y>-1.08&&Q.y<1.12;if(n!==this._inView&&(this._inView=n,this.element.classList.toggle(`is-inview`,n)),!n)return;let r=St(this._parent)?.dpr||window.devicePixelRatio||1,i=Math.round((Q.x*.5+.5)*this._w*r)/r,a=Math.round((-Q.y*.5+.5)*this._h*r)/r;(i!==this._x||a!==this._y)&&(this._x=i,this._y=a,this.element.style.transform=`translate3d(${i}px,${a}px,0)`)}dispose(){this._ro&&this._ro.disconnect(),this._offScale(),this.element.remove()}_repop(){let e=this._inner;e.style.animation=`none`,e.offsetWidth,e.style.animation=``}_ensureFonts(){let e=R(),t=this._labelText;if(!e||!t)return;let n=++this._ensureSeq;e.ensure(t).then(()=>{n===this._ensureSeq&&this._labelText===t&&this._layout()})}_layout(){let e=Y(),t=this._label;t.replaceChildren();let n=this._labelText||``,r=this._keyText||``,i=-2;if(n||r){let a=r?ct(r):0,o=n?G(n,`line`):0,s=2*Math.ceil(Ue(`line`)/2),c=5+a+(r&&n?3:0)+o+5,l=15+s,u=-Math.floor(c/2),d=-2-l;K(t,u,d,c,l),H(t,[u,d]),We(t,Ta(),u,d,c,l),r&&Ze(t,r,u+5,d+2+s/2),n&&it(t,n,u+5+(r?a+3:0),d+3+s/2,{font:`line`,color:e.tx1,drop:!0,cls:`lu-prompt__text`}),i=d-2}K(this._bubble,-12,i-18,24,18)}},Oa=class{constructor(e=document.body){let t=document.createElement(`div`);t.className=`lu-fader`,t.style.transitionProperty=`opacity, background-color`,e.appendChild(t),this.element=t,this._opacity=0,this._color=`#000`,this._timer=0,this._resolve=null}get opacity(){return this._opacity}get busy(){return!!this._resolve}get color(){return this._color}fadeOut(e=.6,t=`#000`){return this._fadeTo(1,e,t)}fadeIn(e=.6){return this._fadeTo(0,e,null)}set(e,t){this._settle(),clearTimeout(this._timer),this._opacity=e;let n=this.element;n.style.transitionDuration=`0s`,t&&(n.style.backgroundColor=t,this._color=t),n.style.opacity=String(e),n.offsetWidth}dispose(){clearTimeout(this._timer),this._settle(),this.element.remove()}_fadeTo(e,t,n){this._settle(),clearTimeout(this._timer);let r=this.element,i=Math.max(0,Number(t)||0),a=getComputedStyle(r),o=a.opacity,s=a.backgroundColor,c=!(parseFloat(o)>=.01);return r.style.transitionDuration=`0s`,r.style.opacity=o,n&&(r.style.backgroundColor=c?n:s),r.offsetWidth,r.style.transitionDuration=`${i}s`,n&&!c&&(r.style.backgroundColor=n),r.style.opacity=String(e),this._opacity=e,n&&(this._color=n),new Promise(e=>{this._resolve=e,this._timer=setTimeout(()=>this._settle(),i*1e3+20)})}_settle(){let e=this._resolve;this._resolve=null,e&&e()}},ka=class e{constructor(t,n,r,i,a=`div`){this.parent=t,this.object=n,this.property=r,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add(`lil-controller`),this.domElement.classList.add(i),this.$name=document.createElement(`div`),this.$name.classList.add(`lil-name`),e.nextNameID=e.nextNameID||0,this.$name.id=`lil-gui-name-${++e.nextNameID}`,this.$widget=document.createElement(`div`),this.$widget.classList.add(`lil-widget`),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener(`keydown`,e=>e.stopPropagation()),this.domElement.addEventListener(`keyup`,e=>e.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(r)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle(`lil-disabled`,e),this.$disable.toggleAttribute(`disabled`,e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?`none`:``,this}hide(){return this.show(!1)}options(e){let t=this.parent.add(this.object,this.property,e);return t.name(this._name),this.destroy(),t}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);let e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}},Aa=class extends ka{constructor(e,t,n){super(e,t,n,`lil-boolean`,`label`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`checkbox`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener(`change`,()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}};function ja(e){let t,n;return(t=e.match(/(#|0x)?([a-f0-9]{6})/i))?n=t[2]:(t=e.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?n=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=e.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(n=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),n?`#`+n:!1}var Ma={isPrimitive:!0,match:e=>typeof e==`string`,fromHexString:ja,toHexString:ja},Na={isPrimitive:!0,match:e=>typeof e==`number`,fromHexString:e=>parseInt(e.substring(1),16),toHexString:e=>`#`+e.toString(16).padStart(6,0)},Pa=[Ma,Na,{isPrimitive:!1,match:e=>Array.isArray(e)||ArrayBuffer.isView(e),fromHexString(e,t,n=1){let r=Na.fromHexString(e);t[0]=(r>>16&255)/255*n,t[1]=(r>>8&255)/255*n,t[2]=(r&255)/255*n},toHexString([e,t,n],r=1){r=255/r;let i=e*r<<16^t*r<<8^n*r<<0;return Na.toHexString(i)}},{isPrimitive:!1,match:e=>Object(e)===e,fromHexString(e,t,n=1){let r=Na.fromHexString(e);t.r=(r>>16&255)/255*n,t.g=(r>>8&255)/255*n,t.b=(r&255)/255*n},toHexString({r:e,g:t,b:n},r=1){r=255/r;let i=e*r<<16^t*r<<8^n*r<<0;return Na.toHexString(i)}}];function Fa(e){return Pa.find(t=>t.match(e))}var Ia=class extends ka{constructor(e,t,n,r){super(e,t,n,`lil-color`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`color`),this.$input.setAttribute(`tabindex`,-1),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$text=document.createElement(`input`),this.$text.setAttribute(`type`,`text`),this.$text.setAttribute(`spellcheck`,`false`),this.$text.setAttribute(`aria-labelledby`,this.$name.id),this.$display=document.createElement(`div`),this.$display.classList.add(`lil-display`),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Fa(this.initialValue),this._rgbScale=r,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener(`input`,()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener(`blur`,()=>{this._callOnFinishChange()}),this.$text.addEventListener(`input`,()=>{let e=ja(this.$text.value);e&&this._setValueFromHexString(e)}),this.$text.addEventListener(`focus`,()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener(`blur`,()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){let t=this._format.fromHexString(e);this.setValue(t)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}},La=class extends ka{constructor(e,t,n){super(e,t,n,`lil-function`),this.$button=document.createElement(`button`),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener(`click`,e=>{e.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener(`touchstart`,()=>{},{passive:!0}),this.$disable=this.$button}},Ra=class extends ka{constructor(e,t,n,r,i,a){super(e,t,n,`lil-number`),this._initInput(),this.min(r),this.max(i);let o=a!==void 0;this.step(o?a:this._getImplicitStep(),o),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,t=!0){return this._step=e,this._stepExplicit=t,this}updateDisplay(){let e=this.getValue();if(this._hasSlider){let t=(e-this._min)/(this._max-this._min);t=Math.max(0,Math.min(t,1)),this.$fill.style.width=t*100+`%`}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`text`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),window.matchMedia(`(pointer: coarse)`).matches&&(this.$input.setAttribute(`type`,`number`),this.$input.setAttribute(`step`,`any`)),this.$widget.appendChild(this.$input),this.$disable=this.$input;let e=()=>{let e=parseFloat(this.$input.value);isNaN(e)||(this._stepExplicit&&(e=this._snap(e)),this.setValue(this._clamp(e)))},t=e=>{let t=parseFloat(this.$input.value);isNaN(t)||(this._snapClampSetValue(t+e),this.$input.value=this.getValue())},n=e=>{e.key===`Enter`&&this.$input.blur(),e.code===`ArrowUp`&&(e.preventDefault(),t(this._step*this._arrowKeyMultiplier(e))),e.code===`ArrowDown`&&(e.preventDefault(),t(this._step*this._arrowKeyMultiplier(e)*-1))},r=e=>{this._inputFocused&&(e.preventDefault(),t(this._step*this._normalizeMouseWheel(e)))},i=!1,a,o,s,c,l,u=e=>{a=e.clientX,o=s=e.clientY,i=!0,c=this.getValue(),l=0,window.addEventListener(`mousemove`,d),window.addEventListener(`mouseup`,f)},d=e=>{if(i){let t=e.clientX-a,n=e.clientY-o;Math.abs(n)>5?(e.preventDefault(),this.$input.blur(),i=!1,this._setDraggingStyle(!0,`vertical`)):Math.abs(t)>5&&f()}if(!i){let t=e.clientY-s;l-=t*this._step*this._arrowKeyMultiplier(e),c+l>this._max?l=this._max-c:c+l<this._min&&(l=this._min-c),this._snapClampSetValue(c+l)}s=e.clientY},f=()=>{this._setDraggingStyle(!1,`vertical`),this._callOnFinishChange(),window.removeEventListener(`mousemove`,d),window.removeEventListener(`mouseup`,f)};this.$input.addEventListener(`input`,e),this.$input.addEventListener(`keydown`,n),this.$input.addEventListener(`wheel`,r,{passive:!1}),this.$input.addEventListener(`mousedown`,u),this.$input.addEventListener(`focus`,()=>{this._inputFocused=!0}),this.$input.addEventListener(`blur`,()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()})}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement(`div`),this.$slider.classList.add(`lil-slider`),this.$fill=document.createElement(`div`),this.$fill.classList.add(`lil-fill`),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add(`lil-has-slider`);let e=(e,t,n,r,i)=>(e-t)/(n-t)*(i-r)+r,t=t=>{let n=this.$slider.getBoundingClientRect(),r=e(t,n.left,n.right,this._min,this._max);this._snapClampSetValue(r)},n=e=>{this._setDraggingStyle(!0),t(e.clientX),window.addEventListener(`mousemove`,r),window.addEventListener(`mouseup`,i)},r=e=>{t(e.clientX)},i=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener(`mousemove`,r),window.removeEventListener(`mouseup`,i)},a=!1,o,s,c=e=>{e.preventDefault(),this._setDraggingStyle(!0),t(e.touches[0].clientX),a=!1},l=e=>{e.touches.length>1||(this._hasScrollBar?(o=e.touches[0].clientX,s=e.touches[0].clientY,a=!0):c(e),window.addEventListener(`touchmove`,u,{passive:!1}),window.addEventListener(`touchend`,d))},u=e=>{if(a){let t=e.touches[0].clientX-o,n=e.touches[0].clientY-s;Math.abs(t)>Math.abs(n)?c(e):(window.removeEventListener(`touchmove`,u),window.removeEventListener(`touchend`,d))}else e.preventDefault(),t(e.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener(`touchmove`,u),window.removeEventListener(`touchend`,d)},f=this._callOnFinishChange.bind(this),p;this.$slider.addEventListener(`mousedown`,n),this.$slider.addEventListener(`touchstart`,l,{passive:!1}),this.$slider.addEventListener(`wheel`,e=>{if(Math.abs(e.deltaX)<Math.abs(e.deltaY)&&this._hasScrollBar)return;e.preventDefault();let t=this._normalizeMouseWheel(e)*this._step;this._snapClampSetValue(this.getValue()+t),this.$input.value=this.getValue(),clearTimeout(p),p=setTimeout(f,400)},{passive:!1})}_setDraggingStyle(e,t=`horizontal`){this.$slider&&this.$slider.classList.toggle(`lil-active`,e),document.body.classList.toggle(`lil-dragging`,e),document.body.classList.toggle(`lil-${t}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:t,deltaY:n}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(t=0,n=-e.wheelDelta/120,n*=this._stepExplicit?1:10),t+-n}_arrowKeyMultiplier(e){let t=this._stepExplicit?1:10;return e.shiftKey?t*=10:e.altKey&&(t/=10),t}_snap(e){let t=0;return this._hasMin?t=this._min:this._hasMax&&(t=this._max),e-=t,e=Math.round(e/this._step)*this._step,e+=t,e=parseFloat(e.toPrecision(15)),e}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){let e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}},za=class extends ka{constructor(e,t,n,r){super(e,t,n,`lil-option`),this.$select=document.createElement(`select`),this.$select.setAttribute(`aria-labelledby`,this.$name.id),this.$display=document.createElement(`div`),this.$display.classList.add(`lil-display`),this.$select.addEventListener(`change`,()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener(`focus`,()=>{this.$display.classList.add(`lil-focus`)}),this.$select.addEventListener(`blur`,()=>{this.$display.classList.remove(`lil-focus`)}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(r)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(e=>{let t=document.createElement(`option`);t.textContent=e,this.$select.appendChild(t)}),this.updateDisplay(),this}updateDisplay(){let e=this.getValue(),t=this._values.indexOf(e);return this.$select.selectedIndex=t,this.$display.textContent=t===-1?e:this._names[t],this}},Ba=class extends ka{constructor(e,t,n){super(e,t,n,`lil-string`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`text`),this.$input.setAttribute(`spellcheck`,`false`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$input.addEventListener(`input`,()=>{this.setValue(this.$input.value)}),this.$input.addEventListener(`keydown`,e=>{e.code===`Enter`&&this.$input.blur()}),this.$input.addEventListener(`blur`,()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}},Va=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;function Ha(e){let t=document.createElement(`style`);t.innerHTML=e;let n=document.querySelector(`head link[rel=stylesheet], head style`);n?document.head.insertBefore(t,n):document.head.appendChild(t)}var Ua=!1,Wa=class e{constructor({parent:e,autoPlace:t=e===void 0,container:n,width:r,title:i=`Controls`,closeFolders:a=!1,injectStyles:o=!0,touchStyles:s=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement(`div`),this.domElement.classList.add(`lil-gui`),this.$title=document.createElement(`button`),this.$title.classList.add(`lil-title`),this.$title.setAttribute(`aria-expanded`,!0),this.$title.addEventListener(`click`,()=>this.openAnimated(this._closed)),this.$title.addEventListener(`touchstart`,()=>{},{passive:!0}),this.$children=document.createElement(`div`),this.$children.classList.add(`lil-children`),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(i),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add(`lil-root`),s&&this.domElement.classList.add(`lil-allow-touch-styles`),!Ua&&o&&(Ha(Va),Ua=!0),n?n.appendChild(this.domElement):t&&(this.domElement.classList.add(`lil-auto-place`,`autoPlace`),document.body.appendChild(this.domElement)),r&&this.domElement.style.setProperty(`--width`,r+`px`),this._closeFolders=a}add(e,t,n,r,i){if(Object(n)===n)return new za(this,e,t,n);let a=e[t];switch(typeof a){case`number`:return new Ra(this,e,t,n,r,i);case`boolean`:return new Aa(this,e,t);case`string`:return new Ba(this,e,t);case`function`:return new La(this,e,t)}console.error(`gui.add failed
	property:`,t,`
	object:`,e,`
	value:`,a)}addColor(e,t,n=1){return new Ia(this,e,t,n)}addFolder(t){let n=new e({parent:this,title:t});return this.root._closeFolders&&n.close(),n}load(e,t=!0){return e.controllers&&this.controllers.forEach(t=>{t instanceof La||t._name in e.controllers&&t.load(e.controllers[t._name])}),t&&e.folders&&this.folders.forEach(t=>{t._title in e.folders&&t.load(e.folders[t._title])}),this}save(e=!0){let t={controllers:{},folders:{}};return this.controllers.forEach(e=>{if(!(e instanceof La)){if(e._name in t.controllers)throw Error(`Cannot save GUI with duplicate property "${e._name}"`);t.controllers[e._name]=e.save()}}),e&&this.folders.forEach(e=>{if(e._title in t.folders)throw Error(`Cannot save GUI with duplicate folder "${e._title}"`);t.folders[e._title]=e.save()}),t}open(e=!0){return this._setClosed(!e),this.$title.setAttribute(`aria-expanded`,!this._closed),this.domElement.classList.toggle(`lil-closed`,this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?`none`:``,this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute(`aria-expanded`,!this._closed),requestAnimationFrame(()=>{let t=this.$children.clientHeight;this.$children.style.height=t+`px`,this.domElement.classList.add(`lil-transition`);let n=e=>{e.target===this.$children&&(this.$children.style.height=``,this.domElement.classList.remove(`lil-transition`),this.$children.removeEventListener(`transitionend`,n))};this.$children.addEventListener(`transitionend`,n);let r=e?this.$children.scrollHeight:0;this.domElement.classList.toggle(`lil-closed`,!e),requestAnimationFrame(()=>{this.$children.style.height=r+`px`})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(e=>e.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(t=>{e=e.concat(t.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(t=>{e=e.concat(t.foldersRecursive())}),e}},Ga=133,Ka=15,qa=76;function Ja(e){return e>=1e6?`${(e/1e6).toFixed(2)}M`:e>=1e4?`${(e/1e3).toFixed(1)}k`:String(Math.round(e))}var Ya=class{constructor(){let e=document.createElement(`div`);e.className=`lu-stats`,e.innerHTML=`
      <div class="lu-stats__head">
        <span class="lu-stats__fps">--</span><span class="lu-stats__unit">FPS</span>
        <span class="lu-stats__ms">-- ms</span>
      </div>
      <canvas class="lu-stats__graph" width="${Ga}" height="${Ka}"></canvas>
      <div class="lu-stats__grid">
        <span class="lu-stats__k">Calls</span><span class="lu-stats__v" data-k="calls">0</span>
        <span class="lu-stats__k">Tris</span><span class="lu-stats__v" data-k="tris">0</span>
        <span class="lu-stats__k">Geom</span><span class="lu-stats__v" data-k="geo">0</span>
        <span class="lu-stats__k">Tex</span><span class="lu-stats__v" data-k="tex">0</span>
        <span class="lu-stats__k">Prog</span><span class="lu-stats__v" data-k="prog">0</span>
        <span class="lu-stats__k">Worst</span><span class="lu-stats__v" data-k="worst">0</span>
      </div>`,this.element=e,this._fpsEl=e.querySelector(`.lu-stats__fps`),this._msEl=e.querySelector(`.lu-stats__ms`);let t=t=>e.querySelector(`[data-k="${t}"]`).firstChild;this._t={calls:t(`calls`),tris:t(`tris`),geo:t(`geo`),tex:t(`tex`),prog:t(`prog`),worst:t(`worst`)},this._canvas=e.querySelector(`canvas`),this._ctx=this._canvas.getContext(`2d`),this.interval=.25,this.visible=!1,this.fps=0,this.frameMs=0,this.calls=0,this.triangles=0,this._configured=new WeakSet,this._frames=0,this._t0=-1,this._worst=0,this._history=new Float32Array(Ga),this._head=0,this._last=-1,this._frameKey=``,this._frame=[]}layout(){let e=this.element,t=e.parentElement,n=St(e);if(!t||!n||!(t.clientWidth>0))return;let r=Math.max(60,Math.floor(t.clientWidth/n.cssPx)),i=`${r}x${qa}`;if(i===this._frameKey)return;this._frameKey=i,e.style.width=`calc(var(--px) * ${r})`;for(let e of this._frame)e.remove();let{base:a,orn:o}=xt({size:`XS`,corners:J.gold(),cornerR:2},r,qa);this._frame=[a,o].filter(Boolean);for(let t of this._frame)t.classList.add(`px`,`g`,t===a?`frame`:`orn`),t.setAttribute(`aria-hidden`,`true`),K(t,-18,-18,t.width,t.height),e.insertBefore(t,e.firstChild)}update(e,t=0){if(e&&e.info){let t=e.info;this._configured.has(e)||(this._configured.add(e),t.autoReset=!1),this.calls=t.render.calls,this.triangles=t.render.triangles,this._geo=t.memory.geometries,this._tex=t.memory.textures,this._prog=t.programs?t.programs.length:0,t.reset()}let n=typeof performance<`u`?performance.now():this._last<0?0:this._last+t*1e3;if(this._t0<0){this._t0=n,this._last=n;return}let r=n-this._last;this._last=n,r>this._worst&&(this._worst=r),this._frames++;let i=n-this._t0;if(i<this.interval*1e3)return;this.fps=this._frames*1e3/i,this.frameMs=i/this._frames,this._history[this._head]=this.fps,this._head=(this._head+1)%Ga;let a=this._worst;this._frames=0,this._t0=n,this._worst=0,this.visible&&this._render(a)}_render(e){let t=this.fps;this._fpsEl.textContent=t>=100?t.toFixed(0):t.toFixed(1),this._fpsEl.classList.toggle(`is-mid`,t<50&&t>=30),this._fpsEl.classList.toggle(`is-low`,t<30),this._msEl.textContent=`${this.frameMs.toFixed(2)} ms`;let n=this._t;n.calls.nodeValue=Ja(this.calls),n.tris.nodeValue=Ja(this.triangles),n.geo.nodeValue=Ja(this._geo??0),n.tex.nodeValue=Ja(this._tex??0),n.prog.nodeValue=Ja(this._prog??0),n.worst.nodeValue=`${e.toFixed(0)}ms`;let r=this._ctx;r.clearRect(0,0,Ga,Ka),r.fillStyle=`rgba(232,207,138,0.16)`;let i=Ka-Math.round(60/75*Ka);r.fillRect(0,i,Ga,1);for(let e=0;e<Ga;e++){let t=this._history[(this._head+e)%Ga];if(t<=0)continue;let n=Math.max(1,Math.round(Math.min(t,75)/75*Ka));r.fillStyle=t>=50?`#8c6a32`:t>=30?`#c27e1a`:`#a8233a`,r.fillRect(e,Ka-n,1,n),r.fillStyle=t>=50?`#e8cf8a`:t>=30?`#f08a3a`:`#f08a6a`,r.fillRect(e,Ka-n,1,1)}}},Xa=class{constructor(e=document.body,{anchor:t=null,title:n=`Luminati · Debug`}={}){let r=document.createElement(`div`);r.className=`lu-debug is-hidden`,e.appendChild(r),this.element=r,this._parent=e,this._anchor=t,this.stats=new Ya,r.appendChild(this.stats.element),this.gui=new Wa({container:r,title:n,width:292}),this._visible=!1,this._onResize=()=>{this._visible&&this._place()},window.addEventListener(`resize`,this._onResize),this.stats.layout()}get visible(){return this._visible}set visible(e){this._visible=!!e,this.stats.visible=this._visible,this.element.classList.toggle(`is-hidden`,!this._visible),this._visible&&this._place(),this.syncListening()}syncListening(){for(let e of this.gui.controllersRecursive())this._visible?e._luPaused&&(e._luPaused=!1,e.listen(!0)):e._listening&&(e._luPaused=!0,e.listen(!1))}toggle(){return this.visible=!this._visible,this._visible}addFolder(e){return this.gui.addFolder(e)}dispose(){window.removeEventListener(`resize`,this._onResize),this.gui.destroy(),this.element.remove()}_place(){this.stats.layout();let e=this._anchor;if(!e||!e.isConnected)return;let t=e.getBoundingClientRect();if(t.height<=0)return;let n=this._parent.getBoundingClientRect();this.element.style.setProperty(`--lu-debug-top`,`calc(${Math.round(t.bottom-n.top)}px + var(--px) * 7)`)}},Za=Object.freeze({x:0,z:1}),Qa=(()=>{let e=[.2,.35,.5,.65,.8],t=[];for(let n of e)for(let r of e)(n!==.5||r!==.5)&&t.push([n,r]);return t.sort((e,t)=>Math.hypot(e[0]-.5,e[1]-.5)-Math.hypot(t[0]-.5,t[1]-.5)||e[1]-t[1]||e[0]-t[0])})(),$a=Object.freeze({fire:`campfire`,door:`door`,sign:`sign`,well:`well`,object:`object`,waystone:`waystone`,chest:`chest`,boss:`boss`}),eo=e=>typeof e==`string`&&Object.prototype.hasOwnProperty.call($a,e)?$a[e]:`object`,to=Object.freeze({campfire:0,door:0,sign:0,well:0,object:0,waystone:1,chest:1,boss:3}),no=Object.freeze([0,1,3]),ro=554,io=50,ao=76,oo=70,so=Object.freeze({size:`M`,cornerR:2,trio:!0,sides:!0,trioR:2}),co=7;function lo(e,t,n,r,i,a){let o=4+(Jt[i]??2)+2,s=e-n,c=t-r;Math.max(Math.abs(s),Math.abs(c))<o&&(Math.abs(s)>=Math.abs(c)?e=n+(s<0?-o:o):t=r+(c<0?-o:o)),a.x=e,a.y=t}var uo=class{constructor(e,{anchor:t=null}={}){let n=Y();this._parent=e;let r=mt(e,`tr`,ro,io,ao,ao,`is-empty`);r.className=`lu-minimap ${r.className}`,r.setAttribute(`aria-hidden`,`true`),We(r,so,ro,io,ao,ao);let i=Nt(oo,oo,()=>{});i.classList.add(`lu-minimap__canvas`),U(r,i,557,53),it(r,q(`map.north`),592,53,{font:`tiny`,color:n.g5,align:`center`,ol:!0,cls:`lu-minimap__north`}).setAttribute(`aria-hidden`,`true`),this.element=r,this.canvas=i,this.ctx=i.getContext(`2d`),this.ctx.imageSmoothingEnabled=!1,this.map=null,this.view=34,this._enabled=!0,this._base=null,this._ppt=2,this._edge=null,this._y=io,this._at={x:0,y:0},this._anchor=t,this._place=()=>this._placeBelowAnchor(),this._anchorRo=t&&typeof ResizeObserver==`function`?new ResizeObserver(this._place):null,this._anchorRo?.observe(t),window.addEventListener(`resize`,this._place),this._offScale=Re(e,this._place)}_placeBelowAnchor(){let e=this._anchor,t=io;if(e&&e.isConnected&&this._parent.isConnected){let n=e.getBoundingClientRect();if(n.height>0){let e=St(this._parent),r=(e?.cssPx??2)*(e?.cornerShrink??1),i=(n.bottom-this._parent.getBoundingClientRect().top)/r;i>0&&i<100&&(t=Math.max(io,Math.ceil(i+co)))}}t!==this._y&&(this._y=t,this.element.style.top=V(t),H(this.element,[ro,t]))}setMap(e,{view:t,level:n=null}={}){if(this.map=e,t&&(this.view=t),this._ppt=Math.max(1,Math.min(6,Math.round(oo/this.view))),this._base=null,this._edge=null,e){let t=n&&Array.isArray(n.tiles)&&n.width===e.width&&n.depth===e.depth?n:null;this._base=po(e,t,this._ppt),this._edge=t?Y()[`m-void`]:Rt(e)}this._apply()}get enabled(){return this._enabled}set enabled(e){this._enabled=!!e,this._apply()}get visible(){return!!this.map&&this._enabled}_apply(){this.element.classList.toggle(`is-empty`,!this.visible),this.visible&&requestAnimationFrame(this._place)}update(e){if(!this.visible||!e?.player||!this._base)return;let{ctx:t}=this,n=oo,r=this._ppt,i=this._base,a=Y(),o=e.player.x*r,s=e.player.z*r,c=i.width>n?Math.max(0,Math.min(i.width-n,Math.round(o-n/2))):Math.round((i.width-n)/2),l=i.height>n?Math.max(0,Math.min(i.height-n,Math.round(s-n/2))):Math.round((i.height-n)/2);i.width<n||i.height<n?(t.fillStyle=this._edge??a[`m-void`],t.fillRect(0,0,n,n)):t.clearRect(0,0,n,n),t.drawImage(i,-c,-l),t.fillStyle=a[`m-mute`],t.fillRect(0,0,n,n);let u=Math.floor(o)-c,d=Math.floor(s)-l;e.view&&(e.view.x||e.view.z)&&t.drawImage(Ht(Math.atan2(e.view.x,-e.view.z),u,d),u-24,d-24),t.drawImage(Gt(n),0,0);let f=e.markers;for(let t of no){if(f)for(let e=0;e<f.length;e++){let n=f[e];if(n.hidden)continue;let i=eo(n.kind);to[i]===t&&this._mark(i,Math.floor(n.x*r)-c,Math.floor(n.z*r)-l,u,d)}if(t===1){let t=e.npcs;if(t)for(let e=0;e<t.length;e++)this._mark(`npc`,Math.floor(t[e].x*r)-c,Math.floor(t[e].z*r)-l,u,d)}}let p=e.enemies;if(p)for(let e=0;e<p.length;e++)this._mark(`enemy`,Math.floor(p[e].x*r)-c,Math.floor(p[e].z*r)-l,u,d);let m=e.party;if(m)for(let e=0;e<m.length;e++)this._mark(`party`,Math.floor(m[e].x*r)-c,Math.floor(m[e].z*r)-l,u,d);let h=e.facing??Za;t.drawImage(Ut(Kt(h.x,h.z)),u-4,d-4)}_mark(e,t,n,r,i){let a=this._at;if(!(e!==`enemy`&&(t<-8||n<-8||t>78||n>78))){if(lo(t,n,r,i,e,a),a.x<3||a.y<3||a.x>66||a.y>66){if(e!==`enemy`)return;let t=Math.max(2,Math.min(67,a.x)),n=Math.max(2,Math.min(67,a.y));this.ctx.drawImage(qt(),t-1,n-1);return}this.ctx.drawImage(Wt(e),a.x-5,a.y-5)}}dispose(){this._anchorRo?.disconnect(),window.removeEventListener(`resize`,this._place),this._offScale(),this.element.remove()}},fo=new WeakMap;function po(e,t,n){let r=fo.get(e.canvas);r||(r=new Map,fo.set(e.canvas,r));let i=`${t?`level`:`painted`}|${n}`,a=r.get(i);return a||(a=t?Yt(t,n,{objects:!0}):Bt(e,n),r.set(i,a)),a}var $=Object.freeze({padX:26,headY:17,ruleY:29,top:38,padB:20,margin:12,gap:14,sock:4,rowH:13,keyGap:4,maxScale:8}),mo=Object.freeze({size:`L`,lattice:!0,beads:6,trio:!0,sides:!0}),ho=()=>({size:`XS`,socket:!0,tone:`dim`,corners:null,fill:Y().ink1,sheen:!1}),go=()=>ke()?`small`:`name`,_o=()=>(pt(),!ke()&&B.line.unit===.5?`line`:`small`),vo=e=>(pt(),B[e].ink*B[e].unit);function yo(e,t,n,r){let i=[],a=``;for(let o of String(e).split(/( |​)/)){if(o===` `||o===`​`){a=o===` `?` `:a;continue}if(!o)continue;let e=i[i.length-1];e!=null&&(G(`${e}${a}${o}`,t,1)<=n||i.length>=r)?i[i.length-1]=`${e}${a}${o}`:i.push(o),a=``}return i.length?i:[String(e)]}var bo=new Map;function xo(e,t){let n=`${e}x${t}`,r=bo.get(n);if(!r){let i=Y();r=st(e,t,Ae(i.dim),(e,t)=>.6+.28*Math.min(1,Math.hypot((e-.5)/.5,(t-.5)/.5)**1.6),[.6,.7,.8,.88]),bo.size>4&&bo.delete(bo.keys().next().value),bo.set(n,r)}return Nt(r.width,r.height,e=>e.ctx.drawImage(r,0,0))}function So(e,t,n){let r=document.createElement(t);return r.className=n,H(r,qe(e)),e.append(r),r}var Co=Object.freeze({player:2,waystone:2,boss:2}),wo=5,To=class{constructor(e){let t=document.createElement(`div`);t.className=`lu-worldmap`,t.setAttribute(`aria-hidden`,`true`),e.appendChild(t),this.element=t,this.canvas=Nt(1,1,()=>{}),this.canvas.classList.add(`lu-worldmap__canvas`),this.ctx=this.canvas.getContext(`2d`),this._baseCanvas=Nt(1,1,()=>{}),this._baseCtx=this._baseCanvas.getContext(`2d`),this.map=null,this._origin=[0,0],this._title=``,this._sub=``,this._regions=[],this._region=``,this._combat=!1,this._party=!1,this._open=!1,this._pulse=0,this._scale=1,this._mw=1,this._md=1,this._base=null,this._labelList=[],this._labels=null,this._ensured=new Set,this._lastStrings=null,this._mapBox=null,this._regionEl=null,this._built=!1,this._dirty=!0,this._obstacles=[],this._sigX=NaN,this._sigY=NaN,this._sigN=-1,this._disposed=!1,this._offScale=Re(e,()=>this._invalidate())}get isOpen(){return this._open}_invalidate(){this._dirty=!0,this._open&&this._build()}setMap(e,{title:t=``,subtitle:n=``,regions:r=[],combat:i=!1,origin:a=[0,0]}={}){this.map=e,this._origin=[Number(a?.[0])||0,Number(a?.[1])||0],this._combat=!!i,this._title=String(t??``),this._sub=String(n??``),this._regions=Array.isArray(r)?r:[],this._obstacles=[],this._invalidate()}_setCombatLegend(e){!!e!==this._combat&&(this._combat=!!e,this._invalidate())}_setPartyLegend(e){!!e!==this._party&&(this._party=!!e,this._invalidate())}setRegion(e){let t=String(e||``);t!==this._region&&(this._region=t,this._invalidate())}_legendRows(){let e=[[`player`,`player`,q(`map.legend.you`)],[`npc`,`npc`,q(`map.legend.villager`)]];return this._party&&e.push([`party`,`party`,q(`map.legend.companion`)]),e.push([`poi`,`poi`,q(`map.legend.poi`)],[`fire`,`fire`,q(`map.legend.campfire`)]),this._combat&&e.push([`enemy`,`enemy`,q(`map.legend.enemy`)],[`waystone`,`waystone`,q(`map.legend.waystone`)],[`chest`,`chest`,q(`map.legend.chest`)]),e.push([`house`,`house`,q(`map.legend.building`)],[`road`,`road`,q(`map.legend.road`)],[`water`,`water`,q(`map.legend.water`)],[`forest`,`forest`,q(`map.legend.forest`)]),e}_build(){if(this._disposed)return;let e=this.element;e.replaceChildren(),this._labelList=[],this._labels=null,this._built=!0,this._dirty=!1,this._sigX=NaN;let t=this.map;if(!t)return;let n=Y(),r=St(e),i=r?.artW??640,a=r?.artH??360,o=i-2*$.margin,s=a-2*$.margin;for(;o>200&&Ye(`mc`,320-Math.floor(o/2)-20,170,o+40,20,i,a)<1;)o-=2;for(;s>120&&Ye(`mc`,300,180-Math.floor(s/2)-20,40,s+40,i,a)<1;)s-=2;let c=z(q(`map.title`)),l=this._legendRows(),u=z(q(`map.legend`)),d=z(q(`map.here`)),f=q(`map.close`),p=[c,this._title,this._sub,u,d,f,this._region,...l.map(e=>e[2]),...this._regions.map(e=>e?.name??``)];this._ensureFonts(p);let m=[{keys:[`N`,`Tab`,`Esc`],label:f}],h=m[0].keys.reduce((e,t)=>e+ct(t)+2,0)+2+G(f,`line`),g=Math.max(...l.map(e=>11+$.keyGap+G(e[2],`line`))),_=Math.max(G(u,`small`,1),G(d,`small`,1))+24,v=this._region?z(this._region):``,y=v?Math.max(0,...at(v).map(e=>G(e,`name`,1))):0,b=Math.min(180,Math.max(Math.min(150,Math.max(92,g,h,_)),y)),x=v?this._regionLines(v,b):[],S=ke()?B.name.L:Math.ceil(20*B.name.unit),C=9+l.length*$.rowH+(x.length?10+x.length*S:0)+10+11,ee=o-2*$.padX-$.gap-b-2*$.sock,w=s-$.top-$.padB-2*$.sock,te=Math.max(.05,Math.min(ee/t.width,w/t.depth)),T=te>=1?Math.min($.maxScale,Math.floor(te)):te,E=Math.max(1,Math.round(t.width*T)),D=Math.max(1,Math.round(t.depth*T));this._scale=T,this._mw=E,this._md=D,this._base=Bt(t,T);let O=G(c,`small`,1),k=this._title?z(this._title):``,A=this._sub,ne=E+2*$.sock,re=D+2*$.sock,j=2*$.padX+ne+$.gap+b,ie=(e,t)=>O+16+(e?G(e,`head`,1):0)+(t?8+G(t,`line`):0),ae=ie(k,A)+2*$.padX;ae>j&&(j=Math.min(o,ae));let oe=j-2*$.padX;ie(k,A)>oe&&A&&(A=He(A,`line`,Math.max(24,oe-ie(k,``)-8))),ie(k,A)>oe&&k&&(k=He(k,`head`,Math.max(24,oe-O-16-(A?8+G(A,`line`):0)),1));let M=Math.max(re,C),se=$.top+M+$.padB;U(e,xo(i,a),0,0,1,`veil lu-worldmap__veil`).setAttribute(`aria-hidden`,`true`);let ce=320-Math.floor(j/2),le=180-Math.floor(se/2),ue=mt(e,`mc`,ce-20,le-20,j+40,se+40,`over lu-worldmap__window`);ue.setAttribute(`role`,`dialog`),ue.setAttribute(`aria-label`,q(`map.aria`)),We(ue,mo,ce,le,j,se);let N=ce+$.padX,de=ce+j-$.padX,P=So(ue,`header`,`lu-worldmap__head`),fe=le+$.headY;W(P,c,N,fe,{font:`small`,track:1,color:n.g4,drop:!0,cls:`lu-worldmap__kicker`});let pe=N+O+5;if((k||A)&&(U(P,Ce(2),pe,fe-3),pe+=11),k){let e=W(P,k,pe,fe,{font:`head`,track:1,color:n.tx1,drop:!0,cls:`lu-worldmap__title`});pe+=e.tw+8}if(A){let e=k?fe+(vo(`head`)-vo(`line`))/2:fe;W(P,A,pe,e,{font:`line`,color:n.g4,drop:!0,cls:`lu-worldmap__sub`})}U(P,je(de-N,`both`,n.dm1),N,le+$.ruleY);let F=So(ue,`div`,`lu-worldmap__body`),I=le+$.top,L=N+Math.max(0,Math.floor((de-b-$.gap-N-ne)/2)),me=I+Math.floor((M-re)/2),he=So(F,`div`,`lu-worldmap__frame`);We(he,ho(),L,me,ne,re);let ge=L+$.sock,_e=me+$.sock,ve=document.createElement(`div`);ve.className=`g lu-worldmap__map`,K(ve,ge-qe(ue)[0],_e-qe(ue)[1],E,D),H(ve,[ge,_e]),F.append(ve),this._mapBox=ve;let ye=this._baseCanvas;ye.width=E,ye.height=D,U(ve,ye,ge,_e,1,`lu-worldmap__base`);let be=document.createElement(`div`);be.className=`lu-worldmap__labels`,ve.append(be),this._labels=be;let xe=this.canvas;xe.width=E,xe.height=D,U(ve,xe,ge,_e),this._drawBase(),this._layoutLabels();let Se=de-b,R=So(F,`aside`,`lu-worldmap__legend`),we=W(R,u,Se,I+2,{font:`small`,track:1,color:n.g4,drop:!0,cls:`lu-worldmap__legend-title`});U(R,je(b-we.tw-6,`r`),Se+we.tw+5,I+2);let Te=So(R,`ul`,`lu-worldmap__keys`),Ee=I+9;for(let[e,t,r]of l){let i=document.createElement(`li`);i.className=`g lu-worldmap__row`,K(i,Se-qe(Te)[0],Ee-qe(Te)[1]),H(i,[Se,Ee]);let a=document.createElement(`i`);a.className=`g lu-wm-key lu-wm-key--${t}`,K(a,0,0,11,11);let o=Vt(e);o.classList.add(`lu-wm-key__art`),a.append(o),i.append(a),W(i,r,Se+11+$.keyGap,Ee+11/2,{font:`line`,color:n.tx1,drop:!0}),Te.append(i),Ee+=$.rowH}let De=So(R,`div`,`lu-worldmap__here`);if(x.length){let e=Ee+4;rt(De,d,Se,Se+b,e);let t=e+6,r=document.createElement(`b`);r.className=`lu-worldmap__region`,H(r,qe(De)),De.append(r);for(let e of x)it(r,e,Se,t,{font:`name`,track:1,color:n.g5,drop:!0}),t+=S}else{De.style.display=`none`;let e=document.createElement(`b`);e.className=`lu-worldmap__region`,De.append(e)}let Oe=So(ue,`footer`,`lu-worldmap__foot`);$e(Oe,m,de,I+M-11,{align:`right`,color:n.tx2,drop:!0}),this._regionEl=De.querySelector(`.lu-worldmap__region`)}_regionLines(e,t){return yo(e,`name`,t,3).map(e=>He(e,`name`,t,1))}_ensureFonts(e){let t=e.join(``);if(this._ensured.has(t))return;let n=R();n&&(this._ensured.add(t),n.ensure(e).then(()=>{!this._disposed&&this._lastStrings&&this._lastStrings===t&&this._invalidate()},()=>{}),this._lastStrings=t)}_obstaclesFor(e,t,n){let r=this._scale,[i,a]=this._origin,o=[{left:t-wo,right:t+wo+1,top:n-wo,bottom:n+wo+1,w:Co.player}],s=e?.markers;if(s)for(let e=0;e<s.length;e++){let t=s[e];if(!t||t.hidden||!Number.isFinite(t.x)||!Number.isFinite(t.z))continue;let n=eo(t.kind),c=Jt[n]??2,l=Math.floor((t.x+i)*r),u=Math.floor((t.z+a)*r);o.push({left:l-c,right:l+c+1,top:u-c,bottom:u+c+1,w:Object.prototype.hasOwnProperty.call(Co,n)?Co[n]:1})}return o}_layoutLabels(){let e=this.map,t=this._labels;if(!e||!t)return;t.replaceChildren(),this._labelList=[];let n=Y(),r=this._scale,i=this._mw,a=this._md,o=this._obstacles,s=[],c=new Set;for(let e of this._regions){let t=String(e?.name??``).trim();t&&!c.has(t)&&[e.minX,e.maxX,e.minZ,e.maxZ].every(Number.isFinite)&&(c.add(t),s.push({name:t,r:e,x:(e.minX+e.maxX)/2,z:(e.minZ+e.maxZ)/2,size:Math.abs((e.maxX-e.minX)*(e.maxZ-e.minZ)),area:!1}))}for(let e of s)e.area=s.some(t=>t!==e&&t.size<e.size&&t.x>e.r.minX&&t.x<e.r.maxX&&t.z>e.r.minZ&&t.z<e.r.maxZ);s.sort((e,t)=>Number(e.area)-Number(t.area)||(e.area?t.size-e.size:e.size-t.size));let l=[],u=e=>l.some(t=>e.left<t.right+2&&e.right>t.left-2&&e.top<t.bottom+2&&e.bottom>t.top-2),d=e=>{let t=0;for(let n of o)e.left<n.right&&e.right>n.left&&e.top<n.bottom&&e.bottom>n.top&&n.w>t&&(t=n.w);return t},f=(e,t,n,r,o)=>{let s=[[0,0],[0,r*.95],[0,-r*.95],[n*.35,-r*.5],[-n*.35,r*.5],[0,-r*1.9],[0,r*1.9],...o],c=[];for(let o=0;o<s.length;o++){let[l,f]=s[o],p=Math.round(e+l),m=Math.round(t+f),h={left:p-Math.floor(n/2),right:p-Math.floor(n/2)+n,top:m-Math.ceil(r/2),bottom:m-Math.ceil(r/2)+r};h.left<-2||h.right>i+2||h.top<-2||h.bottom>a+2||u(h)||c.push({x:p,y:m,q:h,near:o<3,w:d(h)})}return c.find(e=>e.near&&e.w===0)??c.find(e=>e.near&&e.w<2)??c.find(e=>e.near)??c.find(e=>e.w<2)??c[0]??null};for(let o of s){let s=document.createElement(`div`);s.className=`g lu-worldmap__label${o.area?` lu-worldmap__label--area`:``}`,s._dim=!1,s._box=null,t.append(s),this._labelList.push(s);let c=Math.min(Math.max(o.x,0),e.width)*r,u=Math.min(Math.max(o.z,0),e.depth)*r;s._inside=Qa.map(([t,n])=>[(Math.min(Math.max(o.r.minX+(o.r.maxX-o.r.minX)*t,0),e.width)*r-c)/i,(Math.min(Math.max(o.r.minZ+(o.r.maxZ-o.r.minZ)*n,0),e.depth)*r-u)/a]);let d=s._inside.map(([e,t])=>[e*i,t*a]),p=z(o.name),m=o.area&&!ke()?3:1,h=o.area?n.g4:n.tx1,g=go(),_=Math.ceil(vo(g))+2,v=f(c,u,G(p,g,m)+2,_,d);if(v&&(v.near||v.w<2)){l.push(v.q),W(s,p,v.x,v.y,{font:g,track:m,color:h,ol:!0,align:`center`}),s._box=v.q;continue}let y=_o(),b=this._compactLines(p,64,y),x=ke()?B.small.L:8,S=f(c,u,Math.max(...b.map(e=>G(e,y,1)))+2,(b.length-1)*x+Math.ceil(vo(y))+2,d);if(v&&!(S&&S.w<2)){l.push(v.q),W(s,p,v.x,v.y,{font:g,track:m,color:h,ol:!0,align:`center`}),s._box=v.q;continue}if(S){l.push(S.q),s.classList.add(`lu-worldmap__label--compact`);let e=S.y-(b.length-1)*x/2;b.forEach((t,n)=>W(s,t,S.x,e+n*x,{font:y,track:1,color:h,ol:!0,align:`center`})),s._box=S.q;continue}s.style.visibility=`hidden`}}_compactLines(e,t,n=_o()){return yo(e,n,t,2)}_drawBase(){let e=this._baseCanvas,t=this._baseCtx;t.imageSmoothingEnabled=!1,t.clearRect(0,0,e.width,e.height),this._base&&t.drawImage(this._base,0,0),this.ctx.imageSmoothingEnabled=!1,this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}open(){return!this.map||this._open?this._open:(this._open=!0,(this._dirty||!this._built)&&this._build(),this.element.classList.add(`is-open`),this.element.setAttribute(`aria-hidden`,`false`),!0)}close(){return this._open?(this._open=!1,this.element.classList.remove(`is-open`),this.element.setAttribute(`aria-hidden`,`true`),!1):!1}toggle(){return this._open?this.close():this.open()}update(e,t){if(!this._open||!this.map||!this._base)return;this._pulse=(this._pulse+e)%1.6;let n=this.ctx;if(!t?.player){n.clearRect(0,0,this.canvas.width,this.canvas.height);return}let r=t.party,i=r?r.length:0;i>0!==this._party&&this._setPartyLegend(i>0),n.clearRect(0,0,this.canvas.width,this.canvas.height);let a=this._scale,[o,s]=this._origin,c=Math.floor((t.player.x+o)*a),l=Math.floor((t.player.z+s)*a),u=t.markers,d=0;if(u)for(let e=0;e<u.length;e++)u[e].hidden||d++;(c!==this._sigX||l!==this._sigY||d!==this._sigN)&&(this._sigX=c,this._sigY=l,this._sigN=d,this._obstacles=this._obstaclesFor(t,c,l),this._layoutLabels());let f=(e,t,r)=>{n.drawImage(Wt(e),Math.floor((t+o)*a)-5,Math.floor((r+s)*a)-5)};for(let e of no){if(u)for(let t=0;t<u.length;t++){let n=u[t];if(n.hidden)continue;let r=eo(n.kind);to[r]===e&&f(r,n.x,n.z)}if(e===1){let e=t.npcs;if(e)for(let t=0;t<e.length;t++)f(`npc`,e[t].x,e[t].z)}}let p=t.enemies;if(p)for(let e=0;e<p.length;e++)f(`enemy`,p[e].x,p[e].z);for(let e=0;e<i;e++)f(`party`,r[e].x,r[e].z);for(let e of this._labelList){let t=e._box,n=!!t&&c>t.left-6&&c<t.right+6&&l>t.top-6&&l<t.bottom+6;n!==e._dim&&(e._dim=n,e.style.opacity=n?`0.3`:``)}let m=this._pulse/1.6,h=Math.min(4,Math.floor(m*5)),g=zt(5+h*2);n.globalAlpha=[.9,.7,.5,.32,.16][h],n.drawImage(g,c-(g.width>>1),l-(g.height>>1)),n.globalAlpha=1;let _=t.facing??Za;n.drawImage(Ut(Kt(_.x,_.z)),c-4,l-4)}dispose(){this._disposed=!0,this._offScale(),this.element.remove()}},Eo=null,Do=`<svg class="lu-filters" width="0" height="0" aria-hidden="true" focusable="false">
  <filter id="lu-crisp" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
    <feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer>
  </filter>
  <filter id="lu-soft" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
    <feComponentTransfer><feFuncA type="table" tableValues="0 0 1 1"/></feComponentTransfer>
  </filter>
  <filter id="lu-aa" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
    <feComponentTransfer><feFuncA type="identity"/></feComponentTransfer>
  </filter>
</svg>`,Oo=[];function ko(e){let t=Math.max(0,Math.min(12,Math.round(e)));return Oo[t]??(Oo[t]=Ao(t))}function Ao(e){let t=Y(),n=Math.PI/6;return Nt(15,15,r=>{for(let i=0;i<15;i++)for(let a=0;a<15;a++){let o=a-7,s=i-7,c=Math.hypot(o,s);if(c>7.4)continue;if(c>6.4||c>3.6&&c<=4.4){r.px(a,i,t.ink0);continue}if(c<=3.6){r.px(a,i,t.ink1);continue}let l=Math.atan2(o,-s);l<0&&(l+=Math.PI*2);let u=Math.min(11,Math.floor(l/n));if(Math.min(l-u*n,(u+1)*n-l)*c<.55){r.px(a,i,t.ink0);continue}let d=u<e,f=d&&u===e-1&&e<12,p=c>5.4;r.px(a,i,d?f?p?t.tx1:t.g4:p?t.g4:t.g2:p?t.dm2:t.dm3)}let i=e>=12;Pt(r,7,7,1,i?[t.g2,t.g4,t.g5]:[t.ink2,t.ink3,t.ink4],{setting:i?[t.g5,t.g4,t.g3]:[t.dm1,t.dm2,t.dm3]})})}var jo=class e{constructor(e=document.body,{lang:t,fonts:n}={}){let r=document.createElement(`div`);r.id=`luminati-ui`,r.className=`lu-root`,e!==document.body&&(r.classList.add(`lu-root--contained`),getComputedStyle(e).position===`static`&&(e.style.position=`relative`)),e.appendChild(r),this.container=e,this.root=r,this.lang=Et(t===void 0?Ot():t),Wr(),jt(r),document.getElementById(`lu-crisp`)||r.insertAdjacentHTML(`afterbegin`,Do),this.measureHost=document.createElement(`div`),this.measureHost.className=`lu-measure`,this.measureHost.setAttribute(`aria-hidden`,`true`),r.appendChild(this.measureHost),Xe(this.measureHost),this.fonts=n??R()??Oe({lang:this.lang}),this._events=new Xt,this._scale=null,this._disposed=!1,this._onResize=()=>this._updateScale(),this._onDpr=()=>{this._watchDpr(),this._updateScale()},this._dprQuery=null,this._resizeObs=null,this._cursorEl=e===document.body?document.documentElement:e,this._cursorKey=``,this._updateScale(),gt(this),window.addEventListener(`resize`,this._onResize),this._watchDpr(),e!==document.body&&typeof ResizeObserver<`u`&&(this._resizeObs=new ResizeObserver(()=>this._updateScale()),this._resizeObs.observe(e)),this.prompt=new Da(r),this.hud=new ji(r),this.minimap=new uo(this.hud.element,{anchor:this.hud.clockElement}),this.banner=new fa(r),this.dialog=new sa(r),this.title=new wa(r),this.worldMap=new To(r),this.fader=new Oa(r),this.debug=new Xa(r,{anchor:this.hud.clockElement}),this.combat=null,this.journal=null,this.emotes=null,this.endCard=null,this.party=null,this._story=null,this._cutscene=!1,this._hudShown=!0,this._skipOn=!1,this._skipLit=-1,this._skipKey=`Esc`,this._visible=!0,this._talking=!1,this._titled=!1,this.fontsReady=typeof document<`u`&&document.fonts?this.fonts.ready.catch(()=>null).then(()=>void 0):Promise.resolve()}static of(t=null){let n=we(t);return n instanceof e?n:null}on(e,t){return this._events.on(e,t)}off(e,t){this._events.off(e,t)}get scale(){return this._scale}get px(){return this._scale.px}get fpx(){return this._scale.fpx}get shrink(){return this._scale.shrink}get cornerShrink(){return this._scale.cornerShrink}get artW(){return this._scale.artW}get artH(){return this._scale.artH}_updateScale(){let e=this.container===document.body,t=e?window.innerWidth:this.container.clientWidth,n=e?window.innerHeight:this.container.clientHeight;if(!(t>0&&n>0)){if(this._scale)return;t=window.innerWidth||1280,n=window.innerHeight||720}let r=Ge({w:t,h:n,dpr:window.devicePixelRatio||1}),i=this._scale;if(i&&i.px===r.px&&i.fpx===r.fpx&&i.shrink===r.shrink&&i.artW===r.artW&&i.artH===r.artH&&i.dpr===r.dpr)return;this._scale=r;let a=this.root.style;a.setProperty(`--px`,`${+r.cssPx.toFixed(6)}px`),a.setProperty(`--fpx`,`${+r.cssFpx.toFixed(6)}px`),a.setProperty(`--shrink`,`${+r.shrink.toFixed(6)}`),a.setProperty(`--shrink-corner`,`${+r.cornerShrink.toFixed(6)}`),a.setProperty(`--lu-dpx`,`${+(1/r.dpr).toFixed(6)}px`),this.root.dataset.luScale=r.cornerShrink===1?`crisp`:`shrunk`,ht(r.px),this._applyCursors(r);for(let[e,t]of Object.entries(Ve()))a.setProperty(e,t);(this.fonts?this.fonts.setScale(r.px):Promise.resolve()).then(()=>{this._scale===r&&!this._disposed&&this._events.emit(`scale`,r)})}_applyCursors(e){let t=`${e.px}|${e.dpr}`;if(t===this._cursorKey)return;this._cursorKey=t;let n=this._cursorEl;n.style.setProperty(`--lu-cursor`,Yr(`arrow`,e,`auto`)),n.style.setProperty(`--lu-cursor-pointer`,Yr(`pointer`,e,`pointer`)),n.classList.add(`lu-cursors`)}_watchDpr(){this._dprQuery?.removeEventListener(`change`,this._onDpr),this._dprQuery=typeof matchMedia==`function`?matchMedia(`(resolution: ${window.devicePixelRatio||1}dppx)`):null,this._dprQuery?.addEventListener(`change`,this._onDpr)}static useCombatUI(e){Eo=e??null}enableCombat(e=Eo){if(this.combat)return this.combat;let{CombatHUD:t,BossBar:n,WorldLabels:r,Announcer:i,DeathScreen:a}=e??{};if(!t||!n||!r||!i||!a)throw Error(`UI.enableCombat: register the combat UI classes first (UI.useCombatUI({ CombatHUD, BossBar, WorldLabels, Announcer, DeathScreen })) or pass them`);let o=this.hud.element;this.combat={hud:new t(o,{anchor:o.querySelector(`.lu-loc`)}),boss:new n(o),labels:new r(this.root),announcer:new i(this.root),death:new a(this.root)},this.root.classList.add(`lu-root--combat`);let s=this.combat;return this._setLabelPanels(),this.fontsReady.then(()=>{if(this.combat!==s)return;let e=kt(`combat`);s.death.prime({title:e?q(`combat.death.title`):`You Have Fallen`,prompt:e?q(`combat.death.prompt`,{place:q(`combat.place.camp`)}):`Press any key to rise at the camp`})}),s}_setLabelPanels(){let e=this.combat;if(!e)return;let t=this.hud,n=t.locationElement,r=t.helpElement,i=t.helpTabElement,a=this.party?.frames;e.labels.setPanels([{el:n,shown:()=>!n.classList.contains(`is-empty`)},t.clockElement,{el:this.minimap.element,shown:()=>this.minimap.visible},{el:r,shown:()=>!r.classList.contains(`is-hidden`)},{el:i,shown:()=>!i.classList.contains(`is-hidden`)&&!i.classList.contains(`is-empty`)},e.hud.vitalsElement,e.hud.skillsElement,{el:e.boss.element,shown:()=>e.boss.visible,merge:!1},...a&&`element`in a&&a.element instanceof HTMLElement?[{el:a.element,shown:()=>!!a.visible}]:[]])}disableCombat(){let e=this.combat;e&&(this.combat=null,e.death.dispose(),e.announcer.dispose(),e.labels.dispose(),e.boss.dispose(),e.hud.dispose(),this.root.classList.remove(`lu-root--combat`))}usePartyUI(e){return this.party?this.party:!e?.PartyPanel||!e?.PartyFrames?null:(this.party={panel:new e.PartyPanel(this.root),frames:new e.PartyFrames(this.root)},this._setLabelPanels(),this.party)}useStoryUI(e){if(this._story)return{journal:this.journal,emotes:this.emotes,endCard:this.endCard};let{Journal:t,Emotes:n,EndCard:r}=e??{};if(!t||!n||!r)throw Error(`UI.useStoryUI: pass the story UI classes ({ Journal, Emotes, EndCard }, imported from src/engine/ui/)`);let i=this.root;this.emotes=new n(i),i.insertBefore(this.emotes.element,this.prompt.element.nextSibling),this.journal=new t(i),this.endCard=new r(i);let a=document.createElement(`div`);a.className=`lu-letterbox`,a.innerHTML=`
      <div class="lu-letterbox__bar lu-letterbox__bar--top"></div>
      <div class="lu-letterbox__bar lu-letterbox__bar--bottom"></div>`,i.insertBefore(a,this.hud.element);let o=[...a.querySelectorAll(`.lu-letterbox__bar`)];return this._story={letterbox:a,bars:o,lines:[],skip:null,ring:null,off:()=>{},job:0},this._skipLit=-1,this._layoutStory(),this._story.off=this.on(`scale`,()=>this._layoutStory()),i.classList.add(`lu-root--story`),{journal:this.journal,emotes:this.emotes,endCard:this.endCard}}_layoutStory(){let e=this._story;if(!e)return;let t=Y(),n=this._scale,r=Math.ceil(n.W/n.px),i=n.artH,a=Math.max(4,Math.round(i*.11/8)),o=a*8;e.letterbox.style.setProperty(`--lu-bar`,V(o));for(let t of e.bars)t.style.transitionTimingFunction=`steps(${a}, end)`;for(let t of e.lines)t.remove();e.lines=e.bars.map((e,n)=>{let i=je(r,`both`,t.g2);return i.className=`lu-letterbox__line lu-letterbox__line--${n?`bottom`:`top`}`,i.style.width=V(r),i.style.height=V(1),e.append(i),i});let s=this._skipOn;e.skip?.remove();let c=q(`story-ui.skip.hold`),[l,u]=c.includes(`{key}`)?c.split(`{key}`,2).map(e=>e.trim()):[c.trim(),``],d=ct(this._skipKey),f=l?G(l,`line`):0,p=u?G(u,`line`):0,m=20+f+(f?3:0)+d+(p?3:0)+p,h=Math.round(360-o/2-7.5),g=mt(e.letterbox,`br`,630-m,h,m,15,`lu-skip${s?` is-on`:``}`);g.setAttribute(`aria-hidden`,`true`);let _=630-m,v=At(ko(Math.max(0,this._skipLit)));U(g,v,_,h,1,`lu-skip__ring`),_+=20;let y=h+7.5;l&&(W(g,l,_,y,{font:`line`,color:t.tx2,drop:!0,cls:`lu-skip__text`}),_+=f+3),Ze(g,this._skipKey,_,h+2,{cls:`lu-skip__key`}),_+=d+3,u&&W(g,u,_,y,{font:`line`,color:t.tx2,drop:!0,cls:`lu-skip__text`}),g.classList.toggle(`is-full`,this._skipLit>=12),e.skip=g,e.ring=v;try{if(e.fontsFor!==c&&!ut().every(e=>ze(c,e))){e.fontsFor=c;let t=++e.job;this.fonts?.ensure(c).then(()=>{this._story===e&&e.job===t&&this._layoutStory()})}}catch{}}disableStoryUI(){let e=this._story;e&&(this._story=null,e.off(),e.job++,this.endCard.dispose(),this.journal.dispose(),this.emotes.dispose(),this.endCard=null,this.journal=null,this.emotes=null,e.letterbox.remove(),this._cutscene=!1,this._skipOn=!1,this._skipLit=-1,this.root.classList.remove(`lu-root--story`,`lu-root--cutscene`),this._hudShown||this.setHudVisible(!0))}get cutscene(){return this._cutscene}setCutscene(e){return this._story?(this._cutscene=!!e,this.root.classList.toggle(`lu-root--cutscene`,this._cutscene),this._cutscene||this.setSkipHint(!1),this._cutscene):!1}get hudVisible(){return this._hudShown}setHudVisible(e){this._hudShown=!!e,this.root.classList.toggle(`lu-root--nohud`,!this._hudShown)}setSkipHint(e,t=0,{key:n}={}){let r=this._story;if(!r)return;let i=!!e;n!==void 0&&String(n)!==this._skipKey&&(this._skipKey=String(n),this._layoutStory()),i!==this._skipOn&&(this._skipOn=i,r.skip?.classList.toggle(`is-on`,i));let a=Math.round(Math.min(1,Math.max(0,Number(t)||0))*12);if(a!==this._skipLit){if(this._skipLit=a,r.ring){let e=r.ring.getContext(`2d`);e.clearRect(0,0,r.ring.width,r.ring.height),e.drawImage(ko(a),0,0)}r.skip?.classList.toggle(`is-full`,a>=12)}}get visible(){return this._visible}setVisible(e){this._visible=!!e,this.root.classList.toggle(`lu-root--hidden`,!this._visible)}update(e,t){let n=t?t.camera:void 0,r=t?t.input:void 0,i=this._visible&&!this.title.visible?r:void 0;this._story&&(this.endCard.active&&(this.endCard.update(e,this._visible?r:void 0),i=void 0),this.journal.isOpen&&(this.journal.update(e,i),i=void 0));let a=this.party?.panel;a?.isOpen&&(a.update(e,i),i=void 0),this.dialog.update(e,i);let o=this.dialog.isOpen;o!==this._talking&&(this._talking=o,this.root.classList.toggle(`lu-root--dialog`,o));let s=this.title.visible;s!==this._titled&&(this._titled=s,this.root.classList.toggle(`lu-root--title`,s)),n&&this.prompt.update(n),n&&this.emotes&&this.emotes.update(n),n&&this.combat&&this.combat.labels.update(e,n),this.hud.update(e)}dispose(){if(this.disableStoryUI(),this.party&&=(this.party.panel.dispose(),this.party.frames.dispose(),null),this.combat){let e=this.combat;this.combat=null,e.death.dispose(),e.announcer.dispose(),e.labels.dispose(),e.boss.dispose(),e.hud.dispose()}this.debug.dispose(),this.worldMap.dispose(),this.minimap.dispose(),this.fader.dispose(),this.title.dispose(),this.dialog.dispose(),this.banner.dispose(),this.hud.dispose(),this.prompt.dispose(),window.removeEventListener(`resize`,this._onResize),this._dprQuery?.removeEventListener(`change`,this._onDpr),this._dprQuery=null,this._resizeObs?.disconnect(),this._resizeObs=null,this._cursorEl.classList.remove(`lu-cursors`),this._cursorEl.style.removeProperty(`--lu-cursor`),this._cursorEl.style.removeProperty(`--lu-cursor-pointer`),this._disposed=!0,this._events.off(`scale`),vt(this),ft()===this.measureHost&&Xe(null),this.root.remove()}};export{Xt as _,Nr as a,Mr as c,Yn as d,Jn as f,tn as g,rn as h,Wr as i,or as l,gn as m,ei as n,Ir as o,qn as p,Ur as r,dr as s,jo as t,$n as u};