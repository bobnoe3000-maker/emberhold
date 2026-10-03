// @ts-check
// safearea.js — which side of a phone held sideways has the notch (the owner, 2026-10-03: in landscape the party
// cards stood a thumb's width off the left edge and the minimap ran under the notch on the right). iOS reports the
// same safe-area inset on both sides in landscape, though the notch is on one. So the page keeps the inset only
// where the notch is, from the device's rotation, and a plain margin on the other side (enough for the rounded
// corners). It publishes two CSS custom properties for the HUD to lay out by, and a hidden probe the renderer
// measures (the minimap and the room pill are drawn on the canvas):
//   --safe-l, --safe-r   the inset to keep on that side: env(safe-area-inset-*) on the notch's side, 0 on the other.
//                         Upright, or when the rotation can't be read, both keep env() (it's 0 upright anyway).

/** which side the notch is on, from the screen's rotation: 90 (turned anticlockwise: the top, and the notch, on
 * the left), -90 / 270 (turned clockwise: on the right), anything else: neither side is known
 * @param {number | null | undefined} angle @returns {'left' | 'right' | ''} */
export function notchSide(angle) {
  if (angle === 90) return 'left';
  if (angle === -90 || angle === 270) return 'right';
  return '';
}

const ENV_L = 'env(safe-area-inset-left, 0px)', ENV_R = 'env(safe-area-inset-right, 0px)';
/** the CSS values for --safe-l / --safe-r @param {'left' | 'right' | ''} side */
export function safeVars(side) {
  return { l: side === 'right' ? '0px' : ENV_L, r: side === 'left' ? '0px' : ENV_R };
}

export function watchSafeArea() {
  const root = document.documentElement;
  const probe = document.createElement('div'); probe.id = 'safeProbe';
  probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-left:var(--safe-l,0px);padding-right:var(--safe-r,0px)';
  document.body.appendChild(probe);
  const update = () => {
    const w = /** @type {any} */ (window), so = w.screen && w.screen.orientation;
    const angle = typeof w.orientation === 'number' ? w.orientation : so && typeof so.angle === 'number' ? so.angle : null;   // (iOS: window.orientation)
    const side = window.innerWidth > window.innerHeight ? notchSide(angle) : '', v = safeVars(side);
    root.style.setProperty('--safe-l', v.l); root.style.setProperty('--safe-r', v.r);
    if (side) root.dataset.notch = side; else delete root.dataset.notch;
  };
  update();
  window.addEventListener('resize', update); window.addEventListener('orientationchange', () => { update(); requestAnimationFrame(update); });
  return { update };
}
