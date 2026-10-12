import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Artwork,
  ArtworkRepository,
  MAX_GALLERY,
  PreferencesRepository,
  decodeArtwork,
} from "../domain/artwork";
const GALLERY = "@breda/atelier/gallery/v1",
  DRAFT = "@breda/atelier/draft/v1",
  PREFS = "@breda/atelier/preferences/v1";
function parse(raw: string) {
  if (raw.length > 12_000_000) throw Error("Arquivo grande demais");
  return JSON.parse(raw);
}
export class LocalArtworkRepository implements ArtworkRepository {
  async load() {
    const raw = await AsyncStorage.getItem(GALLERY);
    if (!raw) return [];
    const a = parse(raw);
    if (!Array.isArray(a) || a.length > MAX_GALLERY)
      throw Error("Galeria inválida");
    return a.map(decodeArtwork);
  }
  async save(a: readonly Artwork[]) {
    if (a.length > MAX_GALLERY) throw Error("Galeria cheia");
    a.forEach(decodeArtwork);
    const value = JSON.stringify(a);
    if (value.length > 12_000_000) throw Error("Galeria cheia");
    await AsyncStorage.setItem(GALLERY, value);
  }
  async loadDraft() {
    const raw = await AsyncStorage.getItem(DRAFT);
    return raw ? decodeArtwork(parse(raw)) : null;
  }
  async saveDraft(a: Artwork) {
    decodeArtwork(a);
    await AsyncStorage.setItem(DRAFT, JSON.stringify(a));
  }
}
export class LocalPreferencesRepository implements PreferencesRepository {
  async load() {
    const raw = await AsyncStorage.getItem(PREFS);
    const p = raw ? parse(raw) : {};
    return {
      reducedMotion: p.reducedMotion === true,
      haptics: p.haptics !== false,
    };
  }
  async save(p: { reducedMotion: boolean; haptics: boolean }) {
    await AsyncStorage.setItem(PREFS, JSON.stringify(p));
  }
}
