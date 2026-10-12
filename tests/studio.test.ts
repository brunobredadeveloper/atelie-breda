import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ArtHistory,
  Artwork,
  ArtworkRepository,
  PreferencesRepository,
  decodeArtwork,
  newArtwork,
  pathOf,
  point,
} from "../src/domain/artwork";
import { CATALOG } from "../src/domain/catalog";
import { StudioViewModel } from "../src/application/StudioViewModel";
function fixture() {
  let now = 100,
    seq = 0;
  let gallery: readonly Artwork[] = [];
  let fail = false;
  const repo: ArtworkRepository = {
    load: async () => gallery,
    loadDraft: async () => null,
    save: async (a) => {
      if (fail) throw Error("disk full");
      gallery = a;
    },
    saveDraft: async () => undefined,
  };
  const prefs: PreferencesRepository = {
    load: async () => ({ reducedMotion: false, haptics: true }),
    save: async () => undefined,
  };
  return {
    vm: new StudioViewModel(
      repo,
      prefs,
      { now: () => now },
      { next: () => String(++seq) },
    ),
    advance: () => {
      now += 300001;
    },
    fail: () => {
      fail = true;
    },
  };
}
test("history preserves fill edits and drops redo after branching", () => {
  const h = new ArtHistory(newArtwork("1", 0));
  h.execute({ ...h.current, fills: { body: "#FF0000" } });
  h.undo();
  assert.deepEqual(h.current.fills, {});
  h.redo();
  assert.equal(h.current.fills.body, "#FF0000");
  h.undo();
  h.execute({ ...h.current, background: "#FFFFFF" });
  assert.equal(h.canRedo, false);
});
test("normalization and path stay inside logical canvas including single taps", () => {
  assert.deepEqual(point(-10, 1300), { x: 0, y: 1000 });
  assert.match(pathOf([{ x: 30, y: 40 }]), /l0.1/);
});
test("all twelve templates have distinct valid region ids", () => {
  assert.equal(CATALOG.length, 12);
  assert.equal(new Set(CATALOG.map((t) => t.id)).size, 12);
  for (const t of CATALOG) {
    assert.equal(new Set(t.regions.map((r) => r.id)).size, t.regions.length);
    assert.ok(t.regions.every((r) => r.d.startsWith("M")));
  }
});
test("decoder rejects invalid, oversized and prototype brush data", () => {
  assert.throws(() => decodeArtwork({}));
  const a = newArtwork("1", 0);
  assert.equal(decodeArtwork(a).id, "1");
  assert.throws(() =>
    decodeArtwork({
      ...a,
      strokes: [
        { id: "1", points: [], color: "#FFFFFF", width: 20, brush: "toString" },
      ],
    }),
  );
  assert.throws(() =>
    decodeArtwork({
      ...a,
      stamps: [{ id: "x", x: 0, y: 0, color: "#FFFFFF", symbol: "bad" }],
    }),
  );
});
test("save then reopen keeps undo-independent immutable gallery", async () => {
  const { vm } = fixture();
  await vm.initialize();
  vm.newDrawing("cat");
  vm.fill("body");
  await vm.save();
  const art = vm.getSnapshot().gallery[0];
  vm.undo();
  assert.ok(art.fills.body);
  vm.reopen(art.id);
  assert.equal(vm.getSnapshot().art.template, "cat");
  await vm.flushDraft();
});
test("failed persistence retains artwork and reports error", async () => {
  const { vm, fail } = fixture();
  await vm.initialize();
  vm.newDrawing();
  vm.addStroke([{ x: 1, y: 2 }]);
  fail();
  await vm.save();
  assert.equal(vm.getSnapshot().gallery.length, 0);
  assert.equal(vm.getSnapshot().art.strokes.length, 1);
  assert.ok(vm.getSnapshot().error);
  assert.equal(vm.getSnapshot().busy, false);
  await vm.flushDraft();
});
test("unauthorized delete, expired session and background revocation fail closed", async () => {
  const { vm, advance } = fixture();
  await vm.initialize();
  await vm.save();
  const id = vm.getSnapshot().art.id;
  await vm.remove(id);
  assert.equal(vm.getSnapshot().gallery.length, 1);
  vm.grantAdult();
  advance();
  await vm.remove(id);
  assert.equal(vm.getSnapshot().gallery.length, 1);
  vm.grantAdult();
  vm.revokeAdult();
  assert.equal(vm.isAdult(), false);
  vm.grantAdult();
  await vm.remove(id);
  assert.equal(vm.getSnapshot().gallery.length, 0);
  await vm.flushDraft();
});
test("gallery capacity never silently discards a drawing", async () => {
  const { vm } = fixture();
  await vm.initialize();
  for (let i = 0; i < 41; i++) {
    vm.newDrawing();
    await vm.save();
  }
  assert.equal(vm.getSnapshot().gallery.length, 40);
  assert.ok(vm.getSnapshot().error?.includes("40"));
  await vm.flushDraft();
});
test("clear is undoable and long stroke is bounded", async () => {
  const { vm } = fixture();
  await vm.initialize();
  vm.addStroke(Array.from({ length: 600 }, () => ({ x: 10, y: 10 })));
  assert.equal(vm.getSnapshot().art.strokes[0].points.length, 450);
  vm.clear();
  assert.equal(vm.getSnapshot().art.strokes.length, 0);
  vm.undo();
  assert.equal(vm.getSnapshot().art.strokes.length, 1);
  await vm.flushDraft();
});
