import{C as e,I as t,L as n,M as r,On as i,W as a,Z as o,fn as s,kn as c,mn as l,u,ut as d,yn as f}from"./three.core-VtIcmFgG.js";import{i as p,s as m}from"./Palette-CbagWHV4.js";import{a as h,i as g,l as _,r as v,s as y}from"./math-laPxC5G9.js";import{t as b}from"./GlobalUniforms-D57M0nqS.js";import{i as x,r as S}from"./own-CqfHpdoZ.js";import{n as C,t as w}from"./PixelCanvas-C-4zKpyX.js";var T={dust:{mode:`area`,motion:`drift`,texture:`glow`,blending:`additive`,count:90,life:[5,10],size:[.06,.12],sizeEnd:1,velocity:[0,.05,0],velocityVariance:[.07,.04,.07],windInfluence:.12,turbulence:[.3,.35],color:`#ffe0a0`,hdr:2.4,alpha:.85,fade:[.25,.3],twinkle:1,nightVisibility:-.85,bounds:[14,4,14]},fireflies:{mode:`area`,motion:`drift`,texture:`glow`,blending:`additive`,count:36,life:[8,14],size:[.2,.3],sizeEnd:1,velocity:[0,0,0],velocityVariance:[.1,.04,.1],windInfluence:.04,turbulence:[.8,.3],color:`#b6ff3c`,colorEnd:`#ffd23c`,hdr:2.4,alpha:1,fade:[.15,.2],blink:1,nightVisibility:1,bounds:[10,2.2,10]},embers:{mode:`point`,motion:`emit`,texture:`square`,blending:`additive`,count:34,life:[.9,2.2],size:[.07,.11],sizeEnd:.35,spawnSize:[.6,.15,.6],velocity:[0,1.5,0],velocityVariance:[.3,.55,.3],radial:.12,gravity:.5,drag:.7,windInfluence:.35,turbulence:[.3,5],color:`#ff8a2a`,colorEnd:`#ff3a12`,hdr:2.4,alpha:1,fade:[.04,.35],twinkle:.35},smoke:{mode:`point`,motion:`emit`,texture:`smoke`,blending:`normal`,count:22,life:[3.5,6],size:[.45,.7],sizeEnd:4.2,spawnSize:[.25,.1,.25],velocity:[0,.8,0],velocityVariance:[.1,.15,.1],gravity:.06,drag:.3,windInfluence:.22,turbulence:[.25,1.2],spin:[.1,.4],color:`#d2cdc8`,colorEnd:`#8d8b92`,alpha:.5,fade:[.12,.55],lit:1},leaves:{mode:`area`,motion:`fall`,texture:`leaf`,blending:`cutout`,count:24,size:[.46,.54],velocity:[0,-.75,0],velocityVariance:[0,.3,0],windInfluence:.45,turbulence:[.55,1.6],spin:[1.2,3],tumble:1,colors:[`#e0752f`,`#f2b04a`,`#b8462a`,`#86ad48`],alpha:1,fade:[.06,.12],lit:1,bounds:[10,6,10]},petals:{mode:`area`,motion:`fall`,texture:`petal`,blending:`cutout`,count:40,size:[.3,.36],velocity:[0,-.5,0],velocityVariance:[0,.3,0],windInfluence:.8,turbulence:[.75,1.3],spin:[1,2.6],tumble:1,colors:[`#f7b3c7`,`#ffd8e3`,`#fff4f6`,`#f28fb0`],alpha:1,fade:[.06,.12],lit:1,bounds:[10,5,10]},rain:{mode:`area`,motion:`precip`,texture:`streak`,blending:`normal`,followCamera:!0,count:1600,size:[.035,.05],aspect:12,streak:.03,velocity:[0,-15,0],velocityVariance:[0,.12,0],windInfluence:.9,color:`#c4d8f6`,alpha:.5,lit:.6,bounds:[36,16,36]},snow:{mode:`area`,motion:`precip`,texture:`snow`,blending:`normal`,followCamera:!0,count:1100,size:[.08,.13],velocity:[0,-1,0],velocityVariance:[0,.35,0],windInfluence:.45,turbulence:[.35,1.1],spin:[.5,.5],color:`#ffffff`,alpha:.95,lit:.75,bounds:[34,14,34]},mist:{mode:`point`,motion:`emit`,texture:`smoke`,blending:`normal`,count:34,life:[1.6,3],size:[.6,.9],sizeEnd:3.2,spawnSize:[2,.3,.4],velocity:[0,.35,.45],velocityVariance:[.45,.3,.35],radial:.5,gravity:.05,drag:1,windInfluence:.2,turbulence:[.2,1.5],spin:[.1,.5],color:`#eef8ff`,colorEnd:`#d2e6f4`,alpha:.28,fade:[.15,.6],lit:.9},footstep:{mode:`burst`,motion:`emit`,texture:`smoke`,blending:`normal`,count:8,life:[.35,.65],size:[.14,.22],sizeEnd:2.2,spawnSize:[.3,.02,.14],burstSpeed:[.5,1.1],burstUp:[.15,.45],gravity:-.3,drag:5,windInfluence:.1,spin:[.5,2],color:`#d6bf98`,alpha:.7,fade:[.05,.6],lit:1},splash:{mode:`burst`,motion:`emit`,texture:`square`,blending:`normal`,count:16,life:[.45,.8],size:[.07,.12],sizeEnd:.6,spawnSize:[.3,.02,.3],burstSpeed:[.8,2.2],burstUp:[2.2,4.2],gravity:-9.8,drag:.4,ballistic:!0,color:`#e8f6ff`,hdr:1.4,alpha:.95,fade:[0,.3],lit:.5},sparkle:{mode:`burst`,motion:`emit`,texture:`star`,blending:`additive`,count:10,life:[.45,1],size:[.28,.5],sizeEnd:.9,pulse:1,spawnSize:[.8,.8,.8],burstSpeed:[.2,.8],burstUp:[.2,.8],velocity:[0,.12,0],gravity:.2,drag:2,spin:[.5,2],color:`#fff6d0`,hdr:6,alpha:1,fade:[.05,.3],bounds:[4,1,4]},hitSpark:{mode:`burst`,motion:`emit`,texture:`streak`,blending:`additive`,variants:1,lit:0,pulse:0,tumble:0,aspect:4,streak:.04,fade:[0,.3],twinkle:0,blink:0,nightVisibility:0,count:8,life:[.12,.25],size:[.05,.08],sizeEnd:.6,spawnSize:[.1,.1,.1],burstSpeed:[3,7],burstUp:[.5,2],gravity:-8,drag:4,color:`#fff2c0`,colorEnd:`#ff9a3c`,hdr:4,alpha:1},emberBurst:{mode:`burst`,motion:`emit`,texture:`streak`,blending:`additive`,variants:1,lit:0,pulse:0,tumble:0,aspect:4,streak:.04,fade:[0,.3],twinkle:0,blink:0,nightVisibility:0,count:10,life:[.4,.9],size:[.05,.09],sizeEnd:.5,spawnSize:[.4,.2,.4],burstSpeed:[1,3],burstUp:[1,3],gravity:1.5,drag:1,colors:[`#ff8a2a`,`#ff3a12`,`#ffd27a`],hdr:3,alpha:1},deathPoof:{mode:`burst`,motion:`emit`,texture:`smoke`,blending:`normal`,variants:1,lit:1,pulse:0,tumble:0,aspect:1,streak:0,fade:[.05,.6],twinkle:0,blink:0,nightVisibility:0,count:10,life:[.4,.8],size:[.5,.5],sizeEnd:2.2,spawnSize:[.5,.3,.5],burstSpeed:[.6,1.4],burstUp:[.3,.8],drag:4,spin:[.5,2],color:`#d8d0c0`,alpha:.7},gooPoof:{mode:`burst`,motion:`emit`,texture:`smoke`,blending:`normal`,variants:1,lit:1,pulse:0,tumble:0,aspect:1,streak:0,fade:[.05,.6],twinkle:0,blink:0,nightVisibility:0,count:10,life:[.4,.8],size:[.5,.5],sizeEnd:2.2,spawnSize:[.5,.3,.5],burstSpeed:[.6,1.4],burstUp:[.3,.8],drag:4,spin:[.5,2],color:`#5fc7b0`,alpha:.7},healGlow:{mode:`burst`,motion:`emit`,texture:`star`,blending:`additive`,variants:1,lit:0,pulse:1,tumble:0,aspect:1,streak:0,fade:[.05,.3],twinkle:0,blink:0,nightVisibility:0,count:8,life:[.5,1],size:[.2,.35],sizeEnd:.8,spawnSize:[.6,.8,.6],velocity:[0,1.2,0],burstSpeed:[.2,.6],burstUp:[0,.3],drag:1,color:`#bfe58f`,hdr:2.4,alpha:1},magicBurst:{mode:`burst`,motion:`emit`,texture:`star`,blending:`additive`,variants:1,lit:0,pulse:1,tumble:0,aspect:1,streak:0,fade:[.05,.3],twinkle:0,blink:0,nightVisibility:0,count:12,life:[.4,.8],size:[.25,.45],sizeEnd:.7,spawnSize:[.3,.3,.3],burstSpeed:[2,5],burstUp:[-.5,.5],drag:3,colors:[`#8fd0ff`,`#f3cf7a`],hdr:3.5,alpha:1},victoryEmbers:{mode:`burst`,motion:`emit`,texture:`streak`,blending:`additive`,variants:1,lit:0,pulse:0,tumble:0,aspect:4,streak:.04,fade:[0,.3],twinkle:0,blink:0,nightVisibility:0,count:12,life:[.7,1.3],size:[.05,.08],sizeEnd:.5,spawnSize:[1,.8,.6],burstSpeed:[.3,1.1],burstUp:[1.6,3.2],gravity:1.2,drag:1.4,colors:[`#ff8a2a`,`#ff3a12`,`#ffd27a`],hdr:1.5,alpha:1},victorySparkle:{mode:`burst`,motion:`emit`,texture:`star`,blending:`additive`,variants:1,lit:0,pulse:1,tumble:0,aspect:1,streak:0,fade:[.05,.3],twinkle:0,blink:0,nightVisibility:0,count:12,life:[.6,1.1],size:[.16,.3],sizeEnd:.8,spawnSize:[1.4,1,.8],velocity:[0,.5,0],burstSpeed:[.15,.6],burstUp:[.2,.8],gravity:.2,drag:2,spin:[.5,2],color:`#fff0c8`,hdr:1.15,alpha:1},levelSparkle:{mode:`burst`,motion:`emit`,texture:`star`,blending:`additive`,variants:1,lit:0,pulse:1,tumble:0,aspect:1,streak:0,fade:[.05,.3],twinkle:0,blink:0,nightVisibility:0,count:14,life:[.6,1.1],size:[.14,.26],sizeEnd:.8,spawnSize:[1.3,.5,1.3],velocity:[0,.9,0],burstSpeed:[.3,.8],burstUp:[.1,.5],gravity:.2,drag:1.5,spin:[.5,2],color:`#fff0c8`,hdr:1.15,alpha:1}};function E(e){let t=T;for(let[n,r]of Object.entries(e)){if(Object.hasOwn(t,n)){if(t[n]===r)continue;throw Error(`Particles: the preset "${n}" is defined twice`)}t[n]=r}}var D={mode:`point`,motion:`emit`,texture:`glow`,blending:`additive`,count:32,life:[1,2],size:[.1,.1],sizeEnd:1,aspect:1,streak:0,velocity:[0,0,0],velocityVariance:[0,0,0],radial:0,gravity:0,drag:0,windInfluence:0,turbulence:[0,1],spin:[0,0],tumble:0,color:`#ffffff`,colorEnd:null,colors:null,hdr:1,alpha:1,fade:[.1,.3],twinkle:0,blink:0,nightVisibility:0,lit:0,pulse:0,bounds:[6,3,6],spawnSize:[.2,.2,.2],followCamera:!1,followDistance:20,burstSpeed:[.5,1.5],burstUp:[.5,1.5],ballistic:!1,map:null,variants:1},O=`
float lpBayer4( vec2 p ) {
	ivec2 q = ivec2( mod( floor( p ), 4.0 ) );
	const float M[ 16 ] = float[ 16 ]( 0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0 );
	return ( M[ q.y * 4 + q.x ] + 0.5 ) / 16.0;
}
`,k=`
#include <common>
#include <fog_pars_vertex>

uniform float uTime;
uniform float uNight;
uniform vec2 uWind;
uniform float uWindStrength;
uniform vec3 uSunColor;

uniform vec3 uOrigin;
uniform vec3 uBox;
uniform float uSeed;
uniform float uCount;
uniform float uIntensity;
uniform vec2 uLife;
uniform vec2 uSize;
uniform float uSizeEnd;
uniform vec2 uStretch;
uniform vec3 uVel;
uniform vec3 uVelVar;
uniform float uRadial;
uniform float uGravity;
uniform float uDrag;
uniform float uWindInfluence;
uniform vec2 uTurb;
uniform vec2 uSpin;
uniform float uTumble;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uPalette[ 4 ];
uniform float uPaletteSize;
uniform float uAlpha;
uniform vec2 uFade;
uniform float uVariants;
uniform float uTwinkle;
uniform float uBlink;
uniform float uNightVis;
uniform float uLit;
uniform float uPulse;

#ifdef BURST
attribute vec4 aOrigin; // xyz spawn, w birth time
attribute vec4 aVel;    // xyz initial velocity, w life
attribute vec4 aSize;   // x size, y end multiplier, z rotation, w spin
attribute vec4 aColor;  // rgb (linear, HDR), a alpha
attribute vec4 aPhys;   // x gravity, y drag, z wind influence, w seed
#endif

varying vec2 vUv;
varying vec4 vColor;
varying float vVariant;

uvec4 lpPcg4( uvec4 v ) {
	v = v * 1664525u + 1013904223u;
	v.x += v.y * v.w; v.y += v.z * v.x; v.z += v.x * v.y; v.w += v.y * v.z;
	v ^= v >> 16u;
	v.x += v.y * v.w; v.y += v.z * v.x; v.z += v.x * v.y; v.w += v.y * v.z;
	return v;
}

vec4 lpHash( float a, float b, float c ) {
	uvec4 h = lpPcg4( uvec4( uint( a ), uint( b ), uint( c ), 2654435769u ) );
	return vec4( h >> 8u ) / 16777216.0;
}

void main() {

	vec3 wind3 = vec3( uWind.x, 0.0, uWind.y ) * uWindStrength;
	vec3 wpos = vec3( 0.0 );
	vec3 vel = vec3( 0.0, - 1.0, 0.0 );
	float t = 0.5;
	float age = 0.0;
	float size = 0.1;
	float angle = 0.0;
	float tumble = 1.0;
	float gate = 1.0;
	vec3 col = uColor0;
	float alpha = uAlpha;
	vec4 s = vec4( 0.5 );

#ifdef BURST

	age = uTime - aOrigin.w;
	float life = max( aVel.w, 1e-3 );
	t = age / life;
	gate = ( age >= 0.0 && t < 1.0 ) ? 1.0 : 0.0;
	s = fract( vec4( aPhys.w, aPhys.w * 7.31, aPhys.w * 13.17, aPhys.w * 3.73 ) );
	float k = max( aPhys.y, 1e-3 );
	vec3 g = vec3( 0.0, aPhys.x, 0.0 ) + wind3 * aPhys.z;
	float ek = exp( - k * max( age, 0.0 ) );
	float E = ( 1.0 - ek ) / k;
	wpos = aOrigin.xyz + aVel.xyz * E + g / k * ( age - E );
	vel = aVel.xyz * ek + g / k * ( 1.0 - ek );
	size = aSize.x * mix( 1.0, aSize.y, clamp( t, 0.0, 1.0 ) );
	angle = aSize.z + aSize.w * age;
	col = aColor.rgb;
	alpha = aColor.a;
	tumble = mix( 1.0, cos( age * aSize.w * 1.3 + s.y * 6.2831 ), uTumble );

#else

	float id = float( gl_InstanceID );
	s = lpHash( id, 0.0, uSeed );
	gate = clamp( uIntensity * uCount - id, 0.0, 1.0 ) * clamp( uIntensity * 3.0, 0.0, 1.0 );

	#ifdef MOTION_PRECIP

		vec4 r = lpHash( id, 1.0, uSeed );
		vec3 box = max( uBox, vec3( 1e-3 ) );
		float speed = abs( uVel.y ) * mix( 1.0 - uVelVar.y, 1.0 + uVelVar.y, r.w );
		vel = vec3( uVel.x, - speed, uVel.z ) + wind3 * uWindInfluence;
		vec3 p = r.xyz * box + vel * uTime;
		p.x += sin( uTime * uTurb.y + r.x * 43.0 ) * uTurb.x;
		p.z += cos( uTime * uTurb.y * 0.83 + r.z * 37.0 ) * uTurb.x;
		vec3 bmin = uOrigin - box * 0.5;
		vec3 rel = mod( p - bmin, box );
		wpos = bmin + rel;
		vec3 rn = rel / box;
		alpha *= smoothstep( 0.0, 0.05, rn.y ) * ( 1.0 - smoothstep( 0.8, 1.0, rn.y ) )
			* smoothstep( 0.0, 0.12, rn.x ) * ( 1.0 - smoothstep( 0.88, 1.0, rn.x ) )
			* smoothstep( 0.0, 0.12, rn.z ) * ( 1.0 - smoothstep( 0.88, 1.0, rn.z ) );
		size = mix( uSize.x, uSize.y, s.y );
		angle = s.w * 6.2831 + uSpin.x * uTime * ( s.x < 0.5 ? - 1.0 : 1.0 );
		age = uTime;
		t = 0.5;

	#else

		float life = max( mix( uLife.x, uLife.y, s.y ), 0.05 );
		#ifdef MOTION_FALL
			float fallSpeed = max( abs( uVel.y ) * mix( 1.0 - uVelVar.y, 1.0 + uVelVar.y, s.y ), 0.05 );
			life = max( uBox.y / fallSpeed, 0.05 );
		#endif
		float tt = uTime + s.z * life;
		float cycle = floor( tt / life );
		age = tt - cycle * life;
		t = age / life;
		vec4 r = lpHash( id, cycle + 2.0, uSeed + 17.0 );
		vec4 r2 = lpHash( id, cycle + 2.0, uSeed + 91.0 );
		vec3 spawn = uOrigin + ( r.xyz - 0.5 ) * uBox;

		#if defined( MOTION_DRIFT )

			float f = uTurb.y;
			vec3 wob = vec3(
				sin( uTime * f * ( 0.7 + r.w * 0.6 ) + r.x * 6.2831 ),
				sin( uTime * f * ( 0.5 + r2.x * 0.5 ) + r.y * 6.2831 ) * 0.5,
				cos( uTime * f * ( 0.6 + r2.y * 0.5 ) + r.z * 6.2831 ) ) * uTurb.x;
			vel = uVel + ( r2.xyz - 0.5 ) * 2.0 * uVelVar + wind3 * uWindInfluence;
			wpos = spawn + vel * age + wob;

		#elif defined( MOTION_FALL )

			spawn.y = uOrigin.y + uBox.y * 0.5;
			float sf = uTurb.y * ( 0.7 + 0.6 * r.w );
			wpos = spawn + vec3( 0.0, - fallSpeed * age, 0.0 ) + wind3 * uWindInfluence * age
				+ vec3( sin( age * sf + r.x * 6.2831 ), 0.0, cos( age * sf * 0.7 + r.z * 6.2831 ) * 0.6 ) * uTurb.x;
			vel = vec3( 0.0, - fallSpeed, 0.0 );
			tumble = mix( 1.0, cos( age * mix( uSpin.x, uSpin.y, r2.x ) * 1.3 + r2.y * 6.2831 ), uTumble );

		#else

			float ang = r.w * 6.2831;
			vec3 v0 = uVel + ( r2.xyz - 0.5 ) * 2.0 * uVelVar + vec3( cos( ang ), 0.0, sin( ang ) ) * uRadial * ( 0.4 + 0.6 * r2.w );
			float k = max( uDrag, 1e-3 );
			vec3 g = vec3( 0.0, uGravity, 0.0 ) + wind3 * uWindInfluence;
			float ek = exp( - k * age );
			float E = ( 1.0 - ek ) / k;
			wpos = spawn + v0 * E + g / k * ( age - E );
			vel = v0 * ek + g / k * ( 1.0 - ek );
			wpos += vec3( sin( age * uTurb.y + r.x * 6.2831 ), 0.0, cos( age * uTurb.y * 1.3 + r.y * 6.2831 ) ) * uTurb.x * t;
			tumble = mix( 1.0, cos( age * uSpin.y * 1.3 + r2.y * 6.2831 ), uTumble );

		#endif

		size = mix( uSize.x, uSize.y, r2.z ) * mix( 1.0, uSizeEnd, t );
		angle = r2.w * 6.2831 + mix( uSpin.x, uSpin.y, r.w ) * age * ( r2.x < 0.5 ? - 1.0 : 1.0 );
		col = mix( uColor0, uColor1, t );
		if ( uPaletteSize > 0.5 ) {
			int pIdx = int( min( floor( r2.z * uPaletteSize ), uPaletteSize - 1.0 ) );
			col = uPalette[ pIdx ];
		}
		s = r;

	#endif

#endif

	// life envelope
	float fadeIn = smoothstep( 0.0, max( uFade.x, 1e-4 ), t );
	float fadeOut = 1.0 - smoothstep( 1.0 - max( uFade.y, 1e-4 ), 1.0, t );
	alpha *= fadeIn * fadeOut;
	size *= mix( 1.0, sin( PI * clamp( t, 0.0, 1.0 ) ), uPulse );

	if ( uTwinkle > 0.0 ) {
		// max(): GPU sin() may overshoot -1 slightly; pow() of a negative base is NaN, and a NaN in the
		// HDR target spreads through bloom as black/white blocks
		float tw = pow( max( 0.5 + 0.5 * sin( uTime * ( 1.1 + s.x * 2.3 ) + s.z * 6.2831 ), 0.0 ), 14.0 );
		col *= 1.0 + uTwinkle * tw * 3.0;
		size *= 1.0 + uTwinkle * tw * 0.5;
	}
	if ( uBlink > 0.0 ) {
		float bl = smoothstep( 0.1, 0.95, sin( uTime * ( 0.8 + s.y * 1.3 ) + s.w * 6.2831 ) );
		alpha *= mix( 1.0, bl, uBlink );
		size *= mix( 1.0, 0.55 + 0.45 * bl, uBlink );
	}
	if ( uNightVis > 0.0 ) alpha *= smoothstep( 0.3, 0.85, uNight ) * uNightVis;
	else if ( uNightVis < 0.0 ) alpha *= 1.0 - uNight * ( - uNightVis );
	if ( uLit > 0.0 ) {
		vec3 amb = mix( vec3( 0.42, 0.45, 0.52 ), vec3( 0.06, 0.08, 0.15 ), uNight );
		col *= mix( vec3( 1.0 ), amb + uSunColor * 0.75, uLit );
	}
	if ( tumble < 0.0 ) col *= 0.78; // back side of a tumbling leaf
	alpha *= gate;

	vec4 mv = viewMatrix * vec4( wpos, 1.0 );
	vec2 corner = position.xy;
	vUv = uv;

#ifdef STREAK
	vec3 vv = ( viewMatrix * vec4( vel, 0.0 ) ).xyz;
	float vl = length( vv.xy );
	vec2 dir = vl > 1e-4 ? vv.xy / vl : vec2( 0.0, - 1.0 );
	vec2 side = vec2( - dir.y, dir.x );
	float len = size * uStretch.x + vl * uStretch.y;
	mv.xy += side * corner.x * size + dir * corner.y * len;
#else
	float tf = ( tumble >= 0.0 ? 1.0 : - 1.0 ) * max( abs( tumble ), 0.18 );
	corner.x *= tf;
	corner.y *= uStretch.x;
	float ca = cos( angle );
	float sa = sin( angle );
	mv.xy += vec2( corner.x * ca - corner.y * sa, corner.x * sa + corner.y * ca ) * size;
#endif

	gl_Position = projectionMatrix * mv;
	if ( alpha <= 0.002 ) gl_Position = vec4( 0.0, 0.0, 2.0, 1.0 ); // cull dead / hidden particles

	vColor = vec4( col, alpha );
	vVariant = floor( s.x * uVariants );

	#ifdef USE_FOG
		// the standard chunk (vFogDepth = -mvPosition.z), so a game that patches it — e.g. to start
		// the fog some distance in front of the camera — fogs particles like every other material
		vec4 mvPosition = mv;
		#include <fog_vertex>
	#endif
}
`,A=`
#include <common>
#include <fog_pars_fragment>

uniform sampler2D uMap;
uniform float uVariants;

varying vec2 vUv;
varying vec4 vColor;
varying float vVariant;

${O}

void main() {

#ifdef USE_PMAP
	vec4 tex = texture2D( uMap, vec2( ( min( vVariant, uVariants - 1.0 ) + vUv.x ) / uVariants, vUv.y ) );
#else
	float across = 1.0 - abs( vUv.x * 2.0 - 1.0 );
	vec4 tex = vec4( 1.0, 1.0, 1.0, smoothstep( 0.0, 1.0, vUv.y ) * smoothstep( 0.0, 0.7, across ) );
#endif

	vec4 outColor = vec4( vColor.rgb * tex.rgb, vColor.a * tex.a );

#ifdef CUTOUT
	if ( tex.a < 0.5 ) discard;
	if ( vColor.a < 0.999 && vColor.a <= lpBayer4( gl_FragCoord.xy ) ) discard;
	outColor.a = 1.0;
#else
	if ( outColor.a < 0.004 ) discard;
#endif

	gl_FragColor = outColor;

	#include <tonemapping_fragment>
	#include <colorspace_fragment>

	#ifdef USE_FOG
		#ifdef FOG_EXP2
			float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
		#else
			float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
		#endif
		#ifdef ADDITIVE
			gl_FragColor.rgb *= 1.0 - fogFactor;
		#else
			gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
		#endif
	#endif
}
`;function j(e,t,n,r,i){for(let a=0;a<r.length;a++){let o=r[a];for(let r=0;r<o.length;r++){let s=i[o[r]];s&&e.set(t+r,n+a,[s[0]*255,s[0]*255,s[0]*255,s[1]*255])}}}function M(e,t,n,{angle:r,a:i,b:a,midrib:o,shades:s,stem:c}){let l=n/2-.5,u=n/2-.5,d=Math.cos(r),f=Math.sin(r),p=new w(n,n);for(let e=0;e<n;e++)for(let t=0;t<n;t++){let n=t-l,r=e-u,c=n*d+r*f,m=-n*f+r*d,h=a*(1-Math.max(0,c/i)*.35),g=c*c/(i*i)+m*m/(h*h);if(g>1)continue;let _=m<-.35?s.light:s.mid;g>.62&&m>.2&&(_=s.dark),o&&Math.abs(m)<.45&&c>-i*.8&&c<i*.75&&(_=s.rib),p.set(t,e,[_*255,_*255,_*255,255])}if(c){let e=Math.round(l-d*(i+.6)),t=Math.round(u-f*(i+.6));p.set(e,t,[s.outline*255,s.outline*255,s.outline*255,255])}let m=s.outline*255;p.outline([m,m,m,255]),e.blit(p,t,0)}function N(e){switch(e){case`glow`:{let e=new w(32,32);for(let t=0;t<32;t++)for(let n=0;n<32;n++){let r=Math.hypot(n+.5-16,t+.5-16)/16,i=h(.8*Math.exp(-r*r*4.5)+.2*Math.exp(-r*r*40)-.009*r,0,1);e.set(n,t,[255,255,255,i*255])}let t=C(e.toCanvas(),{wrap:`clamp`,mipmaps:!0,srgb:!0,name:`particle_glow`});return t.magFilter=a,{texture:t,variants:1}}case`square`:{let e=new w(8,4),t={b:[1,.55],d:[1,1]};return j(e,0,0,[`.bb.`,`bddb`,`bddb`,`.bb.`],t),j(e,4,0,[`....`,`.dd.`,`.dd.`,`....`],t),{texture:C(e.toCanvas(),{wrap:`clamp`,name:`particle_square`}),variants:2}}case`snow`:{let e=new w(8,4),t={a:[1,.4],b:[1,.8],d:[1,1]};return j(e,0,0,[`.aa.`,`abba`,`abda`,`.aa.`],t),j(e,4,0,[`....`,`.bd.`,`.db.`,`....`],t),{texture:C(e.toCanvas(),{wrap:`clamp`,name:`particle_snow`}),variants:2}}case`star`:{let e=new w(18,9),t={a:[1,.3],b:[1,.6],c:[1,.85],d:[1,1]};return j(e,0,0,[`....a....`,`....b....`,`....c....`,`...bdb...`,`abcdddcba`,`...bdb...`,`....c....`,`....b....`,`....a....`],t),j(e,9,0,[`.........`,`.........`,`..a...a..`,`...bcb...`,`...cdc...`,`...bcb...`,`..a...a..`,`.........`,`.........`],t),{texture:C(e.toCanvas(),{wrap:`clamp`,name:`particle_star`}),variants:2}}case`leaf`:{let e=new w(32,8),t={light:1,mid:.8,dark:.62,rib:.66,outline:.3};return M(e,0,8,{angle:-.75,a:3.1,b:1.55,midrib:!0,shades:t,stem:!0}),M(e,8,8,{angle:.6,a:2.7,b:1.7,midrib:!0,shades:t,stem:!0}),M(e,16,8,{angle:-1.35,a:3,b:1.35,midrib:!1,shades:t,stem:!0}),M(e,24,8,{angle:2.3,a:2.6,b:1.9,midrib:!0,shades:t,stem:!1}),{texture:C(e.toCanvas(),{wrap:`clamp`,name:`particle_leaf`}),variants:4}}case`petal`:{let e=new w(32,8),t={light:1,mid:.92,dark:.8,rib:.9,outline:.66};return M(e,0,8,{angle:-.5,a:2.2,b:1.6,midrib:!1,shades:t,stem:!1}),M(e,8,8,{angle:.9,a:2,b:1.4,midrib:!1,shades:t,stem:!1}),M(e,16,8,{angle:2,a:2.4,b:1.3,midrib:!1,shades:t,stem:!1}),M(e,24,8,{angle:-1.8,a:1.8,b:1.5,midrib:!1,shades:t,stem:!1}),{texture:C(e.toCanvas(),{wrap:`clamp`,name:`particle_petal`}),variants:4}}case`smoke`:{let e=new w(128,32);for(let t=0;t<4;t++){let n=t*32;for(let r=0;r<32;r++)for(let i=0;i<32;i++){let a=(i+.5-16)/16,o=(r+.5-16)/16,s=y(i/9+t*7.3,r/9+t*3.1,{octaves:3,seed:71+t}),c=Math.hypot(a,o)*1.08+(s-.5)*.55,l=h((.95-c)/.55,0,1);l=l*l*(3-2*l);let u=h(Math.floor(l*5+g(i,r)-.25),0,5)/5;if(u<=0)continue;let d=h(.5-o*.35-a*.15+(s-.5)*.5,0,1),f=.74+Math.round(d*3)/3*.26;e.set(n+i,r,[f*255,f*255,Math.min(1,f*1.03)*255,u*255])}}return{texture:C(e.toCanvas(),{wrap:`clamp`,mipmaps:!0,name:`particle_smoke`}),variants:4}}default:return null}}function P(e,t){return e==null?t:Array.isArray(e)?[e[0],e.length>1?e[1]:e[0]]:[e,e]}function F(e,t){return e==null?new c().fromArray(t):e.isVector3?e.clone():Array.isArray(e)?new c(e[0],e[1],e[2]):new c(e,e,e)}function I(e,t=1,n=new u){return n.set(S(e,u.NAMES)).multiplyScalar(t)}var L=(e,t)=>t[0]+(t[1]-t[0])*e.next();function R(e,t){let n=x(T,e);if(!n)throw Error(`Particles: unknown preset "${e}"`);let r={...D,...n,...t,preset:e};return Array.isArray(t.color)&&t.color.length===2&&typeof t.color[0]!=`number`?(r.color=t.color[0],r.colorEnd=t.color[1]):t.color!=null&&t.colorEnd===void 0&&(r.colorEnd=null,t.colors===void 0&&(r.colors=null)),r.size=P(r.size,[.1,.1]),r.life=P(r.life,[1,2]),r.spin=P(r.spin,[0,0]),r.fade=P(r.fade,[.1,.3]),r.turbulence=P(r.turbulence,[0,1]),r.burstSpeed=P(r.burstSpeed,[.5,1.5]),r.burstUp=P(r.burstUp,[.5,1.5]),r}function z(e,t){let n=[new u,new u,new u,new u],r=0;if(Array.isArray(e.colors)&&e.colors.length){r=Math.min(4,e.colors.length);for(let t=0;t<4;t++)I(e.colors[Math.min(t,r-1)],e.hdr,n[t])}let a=I(e.color,e.hdr),o=e.colorEnd==null?a.clone():I(e.colorEnd,e.hdr);return{uTime:b.uTime,uNight:b.uNight,uWind:b.uWind,uWindStrength:b.uWindStrength,uSunColor:b.uSunColor,...f.clone(m.fog),uFogStart:b.uFogStart,uMap:{value:t?t.texture:null},uVariants:{value:t?t.variants:1},uOrigin:{value:new c},uBox:{value:new c(1,1,1)},uSeed:{value:1},uCount:{value:1},uIntensity:{value:1},uLife:{value:new i(e.life[0],e.life[1])},uSize:{value:new i(e.size[0],e.size[1])},uSizeEnd:{value:e.sizeEnd},uStretch:{value:new i(e.aspect,e.streak)},uVel:{value:F(e.velocity,[0,0,0])},uVelVar:{value:F(e.velocityVariance,[0,0,0])},uRadial:{value:e.radial},uGravity:{value:e.gravity},uDrag:{value:e.drag},uWindInfluence:{value:e.windInfluence},uTurb:{value:new i(e.turbulence[0],e.turbulence[1])},uSpin:{value:new i(e.spin[0],e.spin[1])},uTumble:{value:e.tumble},uColor0:{value:a},uColor1:{value:o},uPalette:{value:n},uPaletteSize:{value:r},uAlpha:{value:e.alpha},uFade:{value:new i(e.fade[0],e.fade[1])},uTwinkle:{value:e.twinkle},uBlink:{value:e.blink},uNightVis:{value:e.nightVisibility},uLit:{value:typeof e.lit==`boolean`?+!!e.lit:e.lit},uPulse:{value:e.pulse}}}function B(e,t,n){let r={};r[`MOTION_${String(n?`emit`:e.motion).toUpperCase()}`]=``,n&&(r.BURST=``),e.texture===`streak`&&!e.map?r.STREAK=``:r.USE_PMAP=``,e.blending===`additive`&&(r.ADDITIVE=``),e.blending===`cutout`&&(r.CUTOUT=``);let i=e.blending===`cutout`;return new s({name:`Particles.${e.preset}${n?`.burst`:``}`,uniforms:t,defines:r,vertexShader:k,fragmentShader:A,transparent:!i,depthWrite:i,blending:e.blending===`additive`?2:1,side:2,fog:!0})}function V(){let e=new n,t=new d(1,1);return e.setIndex(t.index),e.setAttribute(`position`,t.getAttribute(`position`)),e.setAttribute(`uv`,t.getAttribute(`uv`)),t.dispose(),e}var H=class{constructor(e,t){let n=R(t.preset,t);this.system=e,this.config=n,this.preset=n.preset,this.followCamera=!!n.followCamera,this.followDistance=n.followDistance;let r=!!t.bounds||n.mode===`area`||n.motion===`precip`;this.mode=r?`area`:`point`;let i=t.bounds?.center??t.position??new c;this.position=i.isVector3?i.clone():Array.isArray(i)?new c().fromArray(i):new c(i.x??0,i.y??0,i.z??0);let a=r?t.bounds?.size??n.bounds:n.spawnSize;this.boxSize=F(a,[1,1,1]);let s=!!t.bounds?.center,u=this.position.y;r&&!s&&t.position&&n.motion!==`precip`&&(this.position.y+=this.boxSize.y*.5),this.followBaseY=s?u-this.boxSize.y*.5:t.position?u:0;let d=n.count;t.rate!=null&&n.motion!==`precip`&&(d=Math.ceil(t.rate*(n.life[0]+n.life[1])*.5)),this.count=Math.max(1,Math.round(d));let f=null;n.map?f={texture:n.map,variants:n.variants||1}:n.texture!==`streak`&&(f=e._texture(n.texture)),this.uniforms=z(n,f),this.uniforms.uOrigin.value=this.position,this.uniforms.uBox.value.copy(this.boxSize),this.uniforms.uSeed.value=t.seed??e._nextSeed(n.preset),this.uniforms.uCount.value=this.count,this.geometry=V(),this.geometry.instanceCount=this.count,this.material=B(n,this.uniforms,!1),this.object=new o(this.geometry,this.material),this.object.name=`Emitter.${n.preset}`,this.object.renderOrder=p.PARTICLES+(n.blending===`additive`?2:0),this.object.matrixAutoUpdate=!1,this.object.castShadow=!1,this.object.receiveShadow=!1,this.object.frustumCulled=!this.followCamera,this._windKey=this._windStrength(),this.geometry.boundingSphere=new l(this.position.clone(),this._estimateRadius()),this.geometry.boundingBox=null,this._enabled=!0,this._intensity=1,this.enabled=t.enabled??!0,this.intensity=t.intensity??1}_windStrength(){return b.uWind.value.length()*Math.max(1,b.uWindStrength.value)}_estimateRadius(){let e=this.config,t=e.life[1],n=this.uniforms,r=n.uVel.value.length()+n.uVelVar.value.length()+e.radial,i=Math.max(e.drag,.001),a=b.uWind.value.length()*Math.max(1,b.uWindStrength.value)*e.windInfluence,o=Math.abs(e.gravity)+a,s=Math.min(r*t,r/i)+Math.min(.5*o*t*t,o/i*t);this.config.motion===`fall`&&(s=a*(this.boxSize.y/Math.max(.05,Math.abs(n.uVel.value.y)))+e.turbulence[0]),this.config.motion===`drift`&&(s=(r+a)*t+e.turbulence[0]);let c=e.size[1]*Math.max(1,e.sizeEnd)*Math.max(1,e.aspect);return this.boxSize.length()*.5+s+c+.5}get enabled(){return this._enabled}set enabled(e){this._enabled=!!e,this._refresh()}get intensity(){return this._intensity}set intensity(e){this._intensity=Math.max(0,+e||0),this.uniforms.uIntensity.value=this._intensity,this._refresh()}_refresh(){let e=Math.min(this.count,Math.ceil(this.count*Math.min(1,this._intensity)));this.geometry.instanceCount=e,this.object.visible=this._enabled&&e>0}_update(e,t){if(this.followCamera&&e){let e=this.followBaseY,n=this.followDistance;t.fy<-.05&&(n=h((e-t.py)/t.fy,2,120)),this.position.set(t.px+t.fx*n,e+this.boxSize.y*.5,t.pz+t.fz*n)}let n=this.geometry.boundingSphere;if(n.center.copy(this.position),this.object.frustumCulled){let e=this._windStrength();Math.abs(e-this._windKey)>.02*Math.max(1,this._windKey)&&(this._windKey=e,n.radius=this._estimateRadius())}}dispose(){this.object.parent&&this.object.parent.remove(this.object),this.geometry.dispose(),this.material.dispose();let e=this.system.emitters,t=e.indexOf(this);t>=0&&e.splice(t,1)}},U=class{constructor(n,r,i=512){this.capacity=i,this.head=0,this.used=0,this.aliveUntil=-1/0;let a=null;r.map?a={texture:r.map,variants:r.variants||1}:r.texture!==`streak`&&(a=n._texture(r.texture)),this.uniforms=z(r,a);let s=V(),c=()=>{let n=new t(new Float32Array(i*4),4);return n.setUsage(e),n};this.aOrigin=c(),this.aVel=c(),this.aSize=c(),this.aColor=c(),this.aPhys=c();for(let e=0;e<i;e++)this.aOrigin.array[e*4+3]=-1e6;s.setAttribute(`aOrigin`,this.aOrigin),s.setAttribute(`aVel`,this.aVel),s.setAttribute(`aSize`,this.aSize),s.setAttribute(`aColor`,this.aColor),s.setAttribute(`aPhys`,this.aPhys),s.instanceCount=0,this.geometry=s,this.material=B(r,this.uniforms,!0),this.object=new o(s,this.material),this.object.name=`Particles.burst.${r.texture}.${r.blending}`,this.object.frustumCulled=!1,this.object.matrixAutoUpdate=!1,this.object.renderOrder=p.PARTICLES+(r.blending===`additive`?3:1),this.object.visible=!1,this._dirtyStart=1/0,this._dirtyEnd=-1}write(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y){let b=this.head,x=b*4,S=this.aOrigin.array;S[x]=e,S[x+1]=t,S[x+2]=n,S[x+3]=r,S=this.aVel.array,S[x]=i,S[x+1]=a,S[x+2]=o,S[x+3]=s,S=this.aSize.array,S[x]=c,S[x+1]=l,S[x+2]=u,S[x+3]=d,S=this.aColor.array,S[x]=f,S[x+1]=p,S[x+2]=m,S[x+3]=h,S=this.aPhys.array,S[x]=g,S[x+1]=_,S[x+2]=v,S[x+3]=y,b<this._dirtyStart&&(this._dirtyStart=b),b+1>this._dirtyEnd&&(this._dirtyEnd=b+1),this.head=(b+1)%this.capacity,this.used=Math.max(this.used,b+1),r+s>this.aliveUntil&&(this.aliveUntil=r+s)}flush(){if(this._dirtyEnd<0)return;let e=this._dirtyStart*4,t=(this._dirtyEnd-this._dirtyStart)*4;for(let n of[this.aOrigin,this.aVel,this.aSize,this.aColor,this.aPhys])n.addUpdateRange(e,t),n.needsUpdate=!0;this._dirtyStart=1/0,this._dirtyEnd=-1,this.geometry.instanceCount=this.used,this.object.visible=!0}dispose(){this.object.parent&&this.object.parent.remove(this.object),this.geometry.dispose(),this.material.dispose()}},W=class{constructor(e){this.scene=e,this.object=new r,this.object.name=`Particles`,e&&e.add(this.object),this.emitters=[],this._pools=new Map,this._poolList=[],this._burstConfigs=new Map,this._textures=new Map,this._rng=new v(20903),this._emitterCounter=0,this._cam={px:0,py:0,pz:0,fx:0,fy:-1,fz:0}}_texture(e){let t=this._textures.get(e);return t===void 0&&(t=N(e),this._textures.set(e,t)),t}_nextSeed(e){return this._emitterCounter++,(_(e)+this._emitterCounter*7919)%1000003}createEmitter(e){let t=new H(this,e);return this.emitters.push(t),this.object.add(t.object),t}_pool(e){let t=`${e.map?e.map.uuid:e.texture}|${e.variants}|${e.blending}|${+e.lit}|${e.pulse}|${e.tumble}|${e.aspect}|${e.streak}|${e.fade[0]}|${e.fade[1]}|${e.twinkle}|${e.blink}|${e.nightVisibility}`,n=this._pools.get(t);return n||(n=new U(this,e),this._pools.set(t,n),this._poolList.push(n),this.object.add(n.object)),n}_burstConfig(e,t){let n=!1;for(let e in t){n=!0;break}if(!n){let t=this._burstConfigs.get(e);if(t)return t}let r=R(e,t);return r._spawn=F(r.spawnSize,[.2,.2,.2]),r._vel=F(r.velocity,[0,0,0]),r._velVar=F(r.velocityVariance,[0,0,0]),r._color=I(r.color,r.hdr),r._palette=Array.isArray(r.colors)&&r.colors.length?r.colors.map(e=>I(e,r.hdr)):null,r._lit=typeof r.lit==`boolean`?+!!r.lit:r.lit,r._pool=this._pool(r),n||this._burstConfigs.set(e,r),r}burst(e,t,n=12,r={}){let i=this._burstConfig(e,r),a=i._pool,o=this._rng,s=b.uTime.value,c=i._vel,l=i._velVar,u=i._spawn,d=i._palette,f=i._color,p=Math.max(0,Math.min(a.capacity,n|0));for(let e=0;e<p;e++){let e=o.next()*Math.PI*2,n=L(o,i.burstSpeed),r=L(o,i.burstUp),p=Math.cos(e)*n+c.x+(o.next()*2-1)*l.x,m=r+c.y+(o.next()*2-1)*l.y,h=Math.sin(e)*n+c.z+(o.next()*2-1)*l.z,g=L(o,i.life);i.ballistic&&i.gravity<0&&m>0&&(g=Math.min(g,2*m/-i.gravity*.95));let _=d?d[Math.floor(o.next()*d.length)]:f,v=L(o,i.spin)*(o.next()<.5?-1:1);a.write(t.x+(o.next()-.5)*u.x,t.y+(o.next()-.5)*u.y,t.z+(o.next()-.5)*u.z,s,p,m,h,g,L(o,i.size),i.sizeEnd,o.next()*Math.PI*2,v,_.r,_.g,_.b,i.alpha,i.gravity,i.drag,i.windInfluence,o.next())}a.flush()}burstPools(){return this._poolList.slice()}releaseBurstPools(e){let t=new Set(e);if(t.size){for(let[e,n]of this._pools)t.has(n)&&this._pools.delete(e);for(let[e,n]of this._burstConfigs)t.has(n._pool)&&this._burstConfigs.delete(e);for(let e=this._poolList.length-1;e>=0;e--)t.has(this._poolList[e])&&this._poolList.splice(e,1);for(let e of t)e.dispose()}}update(e,t){let n=this._cam;if(t){let e=t.matrixWorld.elements;n.px=e[12],n.py=e[13],n.pz=e[14],n.fx=-e[8],n.fy=-e[9],n.fz=-e[10]}for(let e=0;e<this.emitters.length;e++)this.emitters[e]._update(t,n);let r=b.uTime.value,i=this._poolList;for(let e=0;e<i.length;e++){let t=i[e];t.object.visible&&r>t.aliveUntil+.05&&(t.object.visible=!1)}}dispose(){for(let e of this.emitters.slice())e.dispose();this.emitters.length=0;for(let e of this._poolList)e.dispose();this._pools.clear(),this._poolList.length=0,this._burstConfigs.clear();for(let e of this._textures.values())e&&e.texture.dispose();this._textures.clear(),this.object.parent&&this.object.parent.remove(this.object)}};export{E as n,W as t};