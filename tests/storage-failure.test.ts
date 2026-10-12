import { test } from "node:test";
import assert from "node:assert/strict";
import { StudioViewModel } from "../src/application/StudioViewModel";
test("failed gallery initialization cannot overwrite existing data", async () => {
  let writes = 0;
  const vm = new StudioViewModel(
    {
      load: async () => {
        throw Error("corrupt");
      },
      loadDraft: async () => null,
      save: async () => {
        writes++;
      },
      saveDraft: async () => {
        writes++;
      },
    },
    {
      load: async () => ({ reducedMotion: false, haptics: false }),
      save: async () => undefined,
    },
    { now: () => 100 },
    { next: () => String(Math.random()) },
  );
  await vm.initialize();
  vm.newDrawing();
  vm.addStroke([{ x: 10, y: 10 }]);
  await vm.save();
  await vm.flushDraft();
  assert.equal(writes, 0);
  assert.ok(vm.getSnapshot().error);
});
