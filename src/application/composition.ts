import { StudioViewModel } from "./StudioViewModel";
import {
  LocalArtworkRepository,
  LocalPreferencesRepository,
} from "../infrastructure/storage";
/** Composition root: presentation sees the ViewModel, not storage modules. */
export function createStudio() {
  let sequence = 0;
  return new StudioViewModel(
    new LocalArtworkRepository(),
    new LocalPreferencesRepository(),
    { now: () => Date.now() },
    {
      next: () =>
        `${Date.now().toString(36)}-${(++sequence).toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    },
  );
}
