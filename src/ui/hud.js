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

  const gold = document.getElementById('hudGold'), embers = document.getElementById('hudEmbers');
  const paintCounters = (c) => { wood.textContent = c.wood; stone.textContent = c.stone; if (gold) gold.textContent = c.gold || 0; if (embers) embers.textContent = c.embers || 0; };
  sim.bus.on('countersChanged', paintCounters); paintCounters(sim.state.counters);
  sim.bus.on('harvested', ({ kind }) => show(kind === 'tree' ? '+3 wood' : '+2 stone'));
  sim.bus.on('looted', ({ kind }) => show(kind === 'chest' ? 'chest opened' : 'a blessing'));
  sim.bus.on('levelChanged', ({ depth: d, theme, up }) => { setDepth(d); if (sim.world.kind === 'dungeon') show((up ? 'climbed · depth ' + (d + 1) + ' · ' : 'descended · ') + (sim.world.level.th.name || theme)); });
  sim.bus.on('outOfReach', () => show('too far'));
  sim.bus.on('defeat', () => show('defeated'));
  sim.bus.on('refused', (r) => show(r.reason, 1800));                   // a command the rules turned down (heroes.js)
  sim.bus.on('fallen', (f) => show(`${f.name} is Fallen · raise them at a temple or shrine`, 2600));
  sim.bus.on('benched', (b) => show(`${b.name} waits on the bench at the inn`, 2200));
  sim.bus.on('companionJoined', (b) => show(`${b.name} joins your company · tap his card to talk`, 2800));

  // Weakened (after a wipe): an amber chip in the HUD while it lasts
  const weak = document.createElement('div'); weak.className = 'stat'; weak.style.cssText = 'color:#e0a060;display:none'; weak.textContent = 'weakened';
  if (depth) depth.parentElement.parentElement.appendChild(weak);
  const paintWeak = () => { weak.style.display = sim.state.party.some((m) => m.weakUntil > 0) ? '' : 'none'; };
  sim.bus.on('weakened', paintWeak); sim.bus.on('partyChanged', paintWeak); paintWeak();

  function show(msg, ms = 1000) {
    toast.textContent = msg;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('on'), ms);
  }
  return { show };
}
