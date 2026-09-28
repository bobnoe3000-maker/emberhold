// types.d.ts — shared shapes for JSDoc (`// @ts-check` files). Documentation that the type
// checker enforces; no runtime. Keep in step with core.js (commands, snapshot) and bus events.

// vendored ES modules (src/vendor, mapped in index.html's import map) — untyped here
declare module 'preact';
declare module 'preact/hooks';
declare module 'htm';
declare module 'htm/preact';

/** A player command, pushed by UI / input with `sim.commands.push(cmd)`; the sim validates it. */
type Command =
  | { type: 'move'; x: number; y: number }
  | { type: 'tap'; tx: number; ty: number }
  | { type: 'harvest'; tx: number; ty: number }
  | { type: 'goto'; tx: number; ty: number; near?: number; then?: Command | null; label?: string; room?: number }
  | { type: 'resume' } | { type: 'cancelWalk' }
  | { type: 'focus'; id: number }
  | { type: 'hire'; idx: number } | { type: 'dismiss'; id: string }
  | { type: 'equip'; member: string; uid: string }
  | { type: 'unequip'; member: string; slot: GearSlot }
  | { type: 'salvage'; uid: string };

type GearSlot = 'weapon' | 'off' | 'helm' | 'armor' | 'boots' | 'trinket';
type Rarity = 'common' | 'fine' | 'rare' | 'heirloom';

interface Item {
  uid: string; base: string; r: Rarity; ilv: number; name: string;
  st: Record<string, number>; aff: [string, number][];
  mod?: { ab: string; k: 'cost' | 'power'; v: number }; flav?: string;
}

/** A party member's durable fields (MEMBER_KEYS in core.js). */
interface Member {
  id: string; name: string; cls: 'fighter' | 'rogue' | 'mage'; level: number; xp: number;
  trait: [string, string] | null; hp: number; mp?: number; gear: Partial<Record<GearSlot, Item | null>>;
  actor?: string; main?: boolean; down?: boolean;
}

/** sim.snapshot(): everything a save or a replay needs (seed + diffs + party). */
interface Snapshot {
  seed: number; scene: 'town' | 'overland' | 'dungeon'; depth: number; t: number; tick: number;
  player: { x: number; y: number; dir: string; mirror: boolean };
  counters: { wood: number; stone: number; gold: number; embers: number; lootN: number; uidN: number };
  party: Member[]; bag: Item[];
  mods: [string, any][]; hp: [string, number][]; discovered: any[]; visited: any[]; sitesEntered: any[];
}

/** A game slot (persist/save.js, v4). */
interface Slot { version: 4; savedAt: number; meta: Record<string, any>; data: Snapshot }
