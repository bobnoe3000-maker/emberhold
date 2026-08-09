// hud.js — DOM overlay. Reads sim events, never sim internals.

export function createHud(sim) {
  const wood = document.getElementById('hudWood');
  const stone = document.getElementById('hudStone');
  const depth = document.getElementById('hudDepth');
  const toast = document.getElementById('hudToast');
  let toastTimer = null;

  const setDepth = (d) => { if (depth) depth.textContent = d + 1; };   // depth 0 → "1"
  setDepth(sim.state.depth);

  sim.bus.on('countersChanged', (c) => { wood.textContent = c.wood; stone.textContent = c.stone; });
  sim.bus.on('harvested', ({ kind }) => show(kind === 'tree' ? '+3 wood' : '+2 stone'));
  sim.bus.on('looted', ({ kind }) => show(kind === 'chest' ? 'chest opened' : 'a blessing'));
  sim.bus.on('levelChanged', ({ depth: d, theme }) => { setDepth(d); show('descended · ' + (sim.world.level.th.name || theme)); });
  sim.bus.on('outOfReach', () => show('too far'));

  function show(msg) {
    toast.textContent = msg;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('on'), 1000);
  }
}
