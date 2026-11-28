// @ts-check
// dresspieces.js — what a converted floor sets down, as points the no-lined-up rule reads (src/sim/dresslines.js,
// docs/level-design-rules.md §4.6): the sim's props as the renderer draws them, its own set pieces (the trims along a
// wall: lanterns, shields, sconces, heaps) and Luminati's objects. In the sim's tiles (Luminati's units are two). A
// piece drawn along a length (a beam, a cornice) has no point and is left out; a light is its lamp's, not a second piece.

/**
 * @param {{ sprites: any[], level: { objects: any[] } }} conv  convertWorld's result
 * @returns {{ kind: string, x: number, y: number }[]}
 */
export function dressPieces(conv) {
  const out = [];
  for (const s of conv.sprites) {
    if (s.prop) out.push({ kind: s.prop, x: s.x * 2, y: s.z * 2 });
    for (const v of Object.values(s)) if (v && Array.isArray(v.pieces)) for (const q of v.pieces) if (q.x != null && q.k) out.push({ kind: q.k + (q.look != null ? '#' + q.look : ''), x: q.x * 2, y: q.z * 2 });
  }
  for (const q of conv.level.objects) {
    if (q.type === 'light' || q.x == null) continue;
    out.push({ kind: q.type === 'bench' && q.opts?.back ? 'pew' : 'obj:' + q.type + (q.opts?.kind ? ':' + q.opts.kind : ''), x: q.x * 2, y: q.z * 2 });   // (a bench with a back is a pew, a nave's row)
  }
  return out;
}
