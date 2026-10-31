import "./StoryCondition-BKyw6JI2.js";
//#region src/engine/level/Travel.js
var e = /* @__PURE__ */ new Set(/* @__PURE__ */ "npc.exit.entrance.event.marker.region.marketStall.tree.rock.haystack.bench.barrel.crate.crateStack.flowerbox.signpost.fence.bridge.lamppost.wallTorch.campfire.light.house.windmill.well.waterfall.critters.emitter.enemy.chest.waystone.bed.table.chair.shelf.hearth.counter.rug.staircase.wardrobe.wallWindow.sacks.fire.debris.crag.garland.skyDragon.belfry.ship.monument.smithy".split("."));
function t(e) {
	return !!(n(e?.when) || n(e?.unless));
}
var n = (e) => typeof e == "string" ? e.trim() : "";
function r(e) {
	return n(e?.name) || String(e?.id ?? "");
}
function i(e) {
	return (e?.objects ?? []).filter((e) => e?.type === "entrance");
}
function a(e, t) {
	let r = n(e?.when), i = n(e?.unless);
	return (!r || t(r)) && (!i || !t(i));
}
//#endregion
export { a, i, r as n, t as r, e as t };
