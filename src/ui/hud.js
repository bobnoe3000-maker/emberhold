// hud.js — DOM overlay. Reads sim events, never sim internals.

export function createHud(sim) {
  const wood = document.getElementById('hudWood');
  const stone = document.getElementById('hudStone');
  const toast = document.getElementById('hudToast');
  let toastTimer = null;

  sim.bus.on('countersChanged', (c) => {
    wood.textContent = c.wood;
    stone.textContent = c.stone;
  });
  sim.bus.on('harvested', ({ kind }) => {
    show(kind === 'tree' ? '+3 wood' : '+2 stone');
  });
  sim.bus.on('outOfReach', () => show('too far'));

  function show(msg) {
    toast.textContent = msg;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('on'), 900);
  }
}
