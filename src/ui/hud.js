// hud.js — DOM overlay. Reads sim events, never sim internals.

export function createHud(sim) {
  const wood = document.getElementById('hudWood');
  const stone = document.getElementById('hudStone');
  const depth = document.getElementById('hudDepth');
  const toast = document.getElementById('hudToast');
  let toastTimer = null;

  // dungeon: "depth N"; town / overland: the place's name
  const setDepth = (d) => {
    if (!depth) return;
    const out = sim.world.kind !== 'dungeon';
    depth.parentElement.firstChild.textContent = out ? '' : 'depth ';
    depth.textContent = out ? sim.world.name : d + 1;
  };
  setDepth(sim.state.depth);

  const gold = document.getElementById('hudGold');
  sim.bus.on('countersChanged', (c) => { wood.textContent = c.wood; stone.textContent = c.stone; if (gold) gold.textContent = c.gold || 0; });
  sim.bus.on('harvested', ({ kind }) => show(kind === 'tree' ? '+3 wood' : '+2 stone'));
  sim.bus.on('looted', ({ kind }) => show(kind === 'chest' ? 'chest opened' : 'a blessing'));
  sim.bus.on('levelChanged', ({ depth: d, theme }) => { setDepth(d); if (sim.world.kind === 'dungeon') show('descended · ' + (sim.world.level.th.name || theme)); });
  sim.bus.on('outOfReach', () => show('too far'));
  sim.bus.on('defeat', () => show('defeated'));

  function show(msg) {
    toast.textContent = msg;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('on'), 1000);
  }
}
