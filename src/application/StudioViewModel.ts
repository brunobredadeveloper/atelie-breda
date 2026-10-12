import {
  ArtHistory,
  Artwork,
  ArtworkRepository,
  Brush,
  Clock,
  IdGenerator,
  MAX_GALLERY,
  MAX_POINTS,
  MAX_STROKES,
  Point,
  PreferencesRepository,
  Stroke,
  newArtwork,
} from "../domain/artwork";
export type Route = "home" | "catalog" | "studio" | "gallery" | "parents";
export type StudioState = Readonly<{
  ready: boolean;
  route: Route;
  art: Artwork;
  gallery: readonly Artwork[];
  brush: Brush;
  color: string;
  width: number;
  tool: "draw" | "fill" | "stamp";
  stamp: string;
  canUndo: boolean;
  canRedo: boolean;
  busy: boolean;
  message: string | null;
  messageKind: "saved" | "info";
  error: string | null;
  preferences: { reducedMotion: boolean; haptics: boolean };
}>;
export class StudioViewModel {
  private listeners = new Set<() => void>();
  private history: ArtHistory;
  private queue: Promise<void> = Promise.resolve();
  private adultUntil = 0;
  private storageReady = false;
  private state: StudioState;
  private draftTimer: ReturnType<typeof setTimeout> | undefined;
  private operation = 0;
  constructor(
    private readonly repo: ArtworkRepository,
    private readonly prefs: PreferencesRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {
    const art = newArtwork(ids.next(), clock.now());
    this.history = new ArtHistory(art);
    this.state = {
      ready: false,
      route: "home",
      art,
      gallery: [],
      brush: "marker",
      color: "#EF5A75",
      width: 24,
      tool: "draw",
      stamp: "★",
      canUndo: false,
      canRedo: false,
      busy: false,
      message: null,
      messageKind: "info",
      error: null,
      preferences: { reducedMotion: false, haptics: true },
    };
  }
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  getSnapshot = () => this.state;
  private update(v: Partial<StudioState>) {
    if ("message" in v && !v.messageKind) v = { ...v, messageKind: "info" };
    this.state = { ...this.state, ...v };
    this.listeners.forEach((fn) => fn());
  }
  async initialize() {
    try {
      const [gallery, draft, preferences] = await Promise.all([
        this.repo.load(),
        this.repo.loadDraft(),
        this.prefs.load(),
      ]);
      this.storageReady = true;
      if (draft) this.history = new ArtHistory(draft);
      this.update({
        ready: true,
        gallery,
        art: this.history.current,
        preferences,
      });
    } catch {
      this.update({
        ready: true,
        error:
          "Não foi possível abrir seus desenhos. Seus arquivos não foram apagados.",
      });
    }
  }
  navigate(route: Route) {
    if (route === "parents" && !this.isAdult()) return;
    this.update({ route, message: null });
  }
  newDrawing(template = "blank") {
    if (this.state.busy) return;
    this.operation++;
    this.history = new ArtHistory(
      newArtwork(this.ids.next(), this.clock.now(), template),
    );
    this.publish();
    this.navigate("studio");
  }
  reopen(id: string) {
    if (this.state.busy) return;
    const a = this.state.gallery.find((x) => x.id === id);
    if (a) {
      this.operation++;
      this.history = new ArtHistory(a);
      this.publish();
      this.navigate("studio");
    }
  }
  configure(
    v: Partial<
      Pick<StudioState, "brush" | "color" | "width" | "tool" | "stamp">
    >,
  ) {
    this.update(v);
  }
  private publish() {
    const art = this.history.current;
    this.update({
      art,
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
    });
    clearTimeout(this.draftTimer);
    if (!this.storageReady) return;
    this.draftTimer = setTimeout(() => {
      this.enqueue(() => this.repo.saveDraft(art)).catch(() =>
        this.update({
          error: "Não conseguimos salvar o rascunho. Tente salvar na galeria.",
        }),
      );
    }, 400);
  }
  private mutate(v: Partial<Artwork>) {
    this.history.execute({
      ...this.history.current,
      ...v,
      updatedAt: this.clock.now(),
    });
    this.publish();
  }
  addStroke(points: readonly Point[]) {
    if (this.state.busy || !points.length) return;
    if (this.state.art.strokes.length >= MAX_STROKES) {
      this.update({
        message: "Seu desenho está cheio de cores! Salve e comece outro.",
      });
      return;
    }
    const stroke: Stroke = {
      id: this.ids.next(),
      points: points.slice(0, MAX_POINTS),
      color: this.state.color,
      width: this.state.width,
      brush: this.state.brush,
    };
    this.mutate({ strokes: [...this.state.art.strokes, stroke] });
  }
  fill(id: string) {
    if (this.state.busy) return;
    this.mutate({ fills: { ...this.state.art.fills, [id]: this.state.color } });
  }
  stampAt(p: Point) {
    if (this.state.busy || this.state.art.stamps.length >= 80) return;
    this.mutate({
      stamps: [
        ...this.state.art.stamps,
        {
          id: this.ids.next(),
          ...p,
          symbol: this.state.stamp,
          color: this.state.color,
        },
      ],
    });
  }
  paper(background: string) {
    this.mutate({ background });
  }
  undo() {
    if (this.state.busy) return;
    this.history.undo();
    this.publish();
  }
  redo() {
    if (this.state.busy) return;
    this.history.redo();
    this.publish();
  }
  clear() {
    if (this.state.busy) return;
    this.mutate({ strokes: [], stamps: [], fills: {} });
  }
  private enqueue(work: () => Promise<void>) {
    const task = this.queue.catch(() => undefined).then(work);
    this.queue = task;
    return task;
  }
  async save() {
    if (this.state.busy) return;
    if (!this.storageReady) {
      this.update({
        error:
          "O armazenamento não abriu corretamente. Feche e reabra o app antes de salvar, para preservar os desenhos existentes.",
      });
      return;
    }
    const version = this.operation,
      art = this.state.art;
    const gallery = [art, ...this.state.gallery.filter((x) => x.id !== art.id)];
    if (gallery.length > MAX_GALLERY) {
      this.update({
        error:
          "A galeria chegou a 40 desenhos. Um responsável pode excluir os que não quiser guardar.",
      });
      return;
    }
    this.update({ busy: true });
    try {
      await this.enqueue(() => this.repo.save(gallery));
      this.update({
        gallery,
        busy: false,
        ...(version === this.operation
          ? {
              message: "Sua arte ganhou um lugar na galeria!",
              messageKind: "saved" as const,
            }
          : {}),
      });
    } catch {
      this.update({
        busy: false,
        error:
          "Não foi possível salvar. Seu desenho continua aqui para tentar novamente.",
      });
    }
  }
  grantAdult() {
    this.adultUntil = this.clock.now() + 5 * 60_000;
  }
  revokeAdult() {
    this.adultUntil = 0;
    if (this.state.route === "parents") this.navigate("home");
  }
  isAdult() {
    return this.clock.now() < this.adultUntil;
  }
  async preferences(value: StudioState["preferences"]) {
    if (!this.isAdult()) return;
    try {
      await this.enqueue(() => this.prefs.save(value));
      this.update({ preferences: value });
    } catch {
      this.update({ error: "Não foi possível salvar as preferências." });
    }
  }
  async remove(id: string) {
    if (!this.isAdult() || this.state.busy) return;
    this.update({ busy: true });
    const gallery = this.state.gallery.filter((a) => a.id !== id);
    try {
      await this.enqueue(() => this.repo.save(gallery));
      this.update({
        gallery,
        busy: false,
        message: "Desenho removido da galeria.",
      });
    } catch {
      this.update({
        busy: false,
        error: "Não foi possível excluir. Tente novamente.",
      });
    }
  }
  dismiss() {
    this.update({ message: null, error: null });
  }
  async flushDraft() {
    if (!this.storageReady) return;
    clearTimeout(this.draftTimer);
    await this.enqueue(() => this.repo.saveDraft(this.state.art));
  }
}
