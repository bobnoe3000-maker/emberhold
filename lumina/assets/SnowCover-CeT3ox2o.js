const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./ThawKit-CNrj-2yE.js","./three.core-VtIcmFgG.js","./GlobalUniforms-D57M0nqS.js","./ThawField-DUWC1gaN.js","./LevelLook-DDNsovjv.js","./math-laPxC5G9.js","./TileMap-J9393Kxa.js","./Palette-CbagWHV4.js","./own-CqfHpdoZ.js","./PixelCanvas-C-4zKpyX.js","./Props-BIm83vpf.js","./SmallProps-DIcA9WR0.js","./preload-helper-uBIymjUX.js","./ObjectCatalog-BQIrjREq.js","./StoryCondition-C7bpd9vs.js","./House-Bf3NgTGx.js","./LevelFormat-fjAN8cGt.js","./config-DgMJGR7e.js","./ThawFx-vQVeY6wZ.js"])))=>i.map(i=>d[i]);
import{t as e}from"./preload-helper-uBIymjUX.js";var t={value:0},n=null,r=async()=>n??=await e(()=>import(`./ThawKit-CNrj-2yE.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]),import.meta.url),i=()=>n,a=`
	{
		vec3 snowN = inverseTransformDirection( normal, viewMatrix );
		float snowUp = smoothstep( 0.5, 0.86, snowN.y );
		float snowL = dot( diffuseColor.rgb, vec3( 0.299, 0.587, 0.114 ) );
		float snowK = uSnowCover * snowUp * ( 0.7 + 0.25 * smoothstep( 0.02, 0.2, snowL ) );
		diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.8, 0.84, 0.92 ) * ( 0.82 + 0.3 * smoothstep( 0.0, 0.3, snowL ) ), snowK );
	}
`,o=`
	{
		float snowL = dot( diffuseColor.rgb, vec3( 0.299, 0.587, 0.114 ) );
		float snowK = uSnowCover * smoothstep( 0.2, 0.95, vQuadUv.y ) * 0.72;
		diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.78, 0.83, 0.9 ) * ( 0.7 + 0.6 * sqrt( snowL ) ), snowK );
	}
`;function s(e,n=`ground`){if(!e||e.userData.luminatiSnow)return;e.userData.luminatiSnow=n;let r=e.onBeforeCompile,i=e.customProgramCacheKey();e.onBeforeCompile=function(e,i){r.call(this,e,i),e.uniforms.uSnowCover=t;let s=n===`foliage`?o:a;e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float uSnowCover;`).replace(`#include <emissivemap_fragment>`,`${s}\n#include <emissivemap_fragment>`)},e.customProgramCacheKey=()=>`${i}|luminati-snow-${n}`,e.needsUpdate=!0}var c=/^luminati:roof/;export{r as a,s as i,a as n,t as o,c as r,i as s,o as t};