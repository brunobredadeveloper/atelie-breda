export type Point = Readonly<{ x: number; y: number }>;
export type Brush = "marker" | "pencil" | "rainbow" | "eraser";
export type Stroke = Readonly<{
  id: string;
  points: readonly Point[];
  color: string;
  width: number;
  brush: Brush;
}>;
export type Stamp = Readonly<{
  id: string;
  x: number;
  y: number;
  symbol: string;
  color: string;
}>;
export type Artwork = Readonly<{
  id: string;
  title: string;
  template: string;
  background: string;
  strokes: readonly Stroke[];
  stamps: readonly Stamp[];
  fills: Readonly<Record<string, string>>;
  updatedAt: number;
}>;
export const MAX_STROKES = 180,
  MAX_POINTS = 450,
  MAX_GALLERY = 40;
export const PALETTE = [
  "#EF5A75",
  "#F49C42",
  "#F6CD52",
  "#65BD99",
  "#45ADCD",
  "#6767D9",
  "#AC78CC",
  "#754F40",
  "#242A46",
];
export const PAPERS = ["#FFFDF7", "#F2F7FF", "#FFF0F2", "#EFF9F1"];
export function point(x: number, y: number): Point {
  return {
    x: Math.max(0, Math.min(1000, x)),
    y: Math.max(0, Math.min(1000, y)),
  };
}
export function newArtwork(
  id: string,
  now: number,
  template = "blank",
): Artwork {
  return {
    id,
    title: "Minha criação",
    template,
    background: PAPERS[0],
    strokes: [],
    stamps: [],
    fills: {},
    updatedAt: now,
  };
}
export function hasMarks(a: Artwork) {
  return (
    a.strokes.length > 0 ||
    a.stamps.length > 0 ||
    Object.keys(a.fills).length > 0
  );
}
export function pathOf(points: readonly Point[]) {
  if (!points.length) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y} l0.1,0.1`;
  return points
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}
export interface BrushStrategy {
  opacity: number;
  width(width: number): number;
  color(stroke: Stroke, index: number): string;
}
const plain = (opacity: number, scale: number): BrushStrategy => ({
  opacity,
  width: (w) => w * scale,
  color: (s) => s.color,
});
export const brushes: Readonly<Record<Brush, BrushStrategy>> = {
  marker: plain(0.88, 1),
  pencil: plain(0.62, 0.35),
  eraser: plain(1, 1.7),
  rainbow: {
    opacity: 0.95,
    width: (w) => w,
    color: (_, i) => PALETTE[Math.floor(i / 4) % 7],
  },
};
export interface ArtworkRepository {
  load(): Promise<readonly Artwork[]>;
  save(items: readonly Artwork[]): Promise<void>;
  loadDraft(): Promise<Artwork | null>;
  saveDraft(draft: Artwork): Promise<void>;
}
export interface PreferencesRepository {
  load(): Promise<{ reducedMotion: boolean; haptics: boolean }>;
  save(value: { reducedMotion: boolean; haptics: boolean }): Promise<void>;
}
export interface Clock {
  now(): number;
}
export interface IdGenerator {
  next(): string;
}
/** Command history stores bounded immutable snapshots. Branching drops redo. */
export class ArtHistory {
  private past: Artwork[] = [];
  private future: Artwork[] = [];
  constructor(public current: Artwork) {}
  execute(next: Artwork) {
    this.past.push(this.current);
    if (this.past.length > 40) this.past.shift();
    this.current = next;
    this.future = [];
  }
  undo() {
    const a = this.past.pop();
    if (a) {
      this.future.push(this.current);
      this.current = a;
    }
    return this.current;
  }
  redo() {
    const a = this.future.pop();
    if (a) {
      this.past.push(this.current);
      this.current = a;
    }
    return this.current;
  }
  get canUndo() {
    return this.past.length > 0;
  }
  get canRedo() {
    return this.future.length > 0;
  }
}
export function decodeArtwork(value: unknown): Artwork {
  if (!value || typeof value !== "object") throw Error("Arquivo inválido");
  const a = value as Artwork;
  const validColor = (s: unknown) =>
    typeof s === "string" && /^#[a-fA-F0-9]{6}$/.test(s);
  if (
    typeof a.id !== "string" ||
    a.id.length > 100 ||
    typeof a.title !== "string" ||
    a.title.length > 80 ||
    typeof a.template !== "string" ||
    !validColor(a.background) ||
    !Number.isFinite(a.updatedAt) ||
    !Array.isArray(a.strokes) ||
    a.strokes.length > MAX_STROKES ||
    !Array.isArray(a.stamps) ||
    a.stamps.length > 80 ||
    !a.fills ||
    typeof a.fills !== "object" ||
    Object.keys(a.fills).length > 30
  )
    throw Error("Arquivo inválido");
  for (const s of a.strokes) {
    if (
      typeof s.id !== "string" ||
      !Object.hasOwn(brushes, s.brush) ||
      !validColor(s.color) ||
      !Number.isFinite(s.width) ||
      s.width < 1 ||
      s.width > 80 ||
      !Array.isArray(s.points) ||
      s.points.length > MAX_POINTS
    )
      throw Error("Traço inválido");
    for (const p of s.points)
      if (
        !Number.isFinite(p.x) ||
        !Number.isFinite(p.y) ||
        p.x < 0 ||
        p.x > 1000 ||
        p.y < 0 ||
        p.y > 1000
      )
        throw Error("Ponto inválido");
  }
  for (const s of a.stamps)
    if (
      typeof s.id !== "string" ||
      !["★", "♥", "✿", "●"].includes(s.symbol) ||
      !validColor(s.color) ||
      !Number.isFinite(s.x) ||
      !Number.isFinite(s.y) ||
      s.x < 0 ||
      s.x > 1000 ||
      s.y < 0 ||
      s.y > 1000
    )
      throw Error("Carimbo inválido");
  for (const [k, v] of Object.entries(a.fills))
    if (k.length > 50 || !validColor(v)) throw Error("Cor inválida");
  return a;
}
