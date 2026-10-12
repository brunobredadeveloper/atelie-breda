import { useAtelier } from "../../App";
import { Home, Catalog, Gallery, Parents } from "./Screens";
import { StudioScreen } from "./StudioScreen";
import { Entrance } from "./ui";
export function HomeRoute() {
  const { vm, state, requestParent, reduced } = useAtelier();
  return (
    <Entrance reduced={reduced}>
      <Home vm={vm} state={state} askParent={() => requestParent("parents")} />
    </Entrance>
  );
}
export function CatalogRoute() {
  const { vm, reduced } = useAtelier();
  return (
    <Entrance reduced={reduced}>
      <Catalog vm={vm} />
    </Entrance>
  );
}
export function GalleryRoute() {
  const { vm, state, reduced } = useAtelier();
  return (
    <Entrance reduced={reduced}>
      <Gallery vm={vm} state={state} />
    </Entrance>
  );
}
export function ParentsRoute() {
  const { vm, state, reduced, setDialog } = useAtelier();
  if (!vm.isAdult() || state.route !== "parents") return null;
  return (
    <Entrance reduced={reduced}>
      <Parents
        vm={vm}
        state={state}
        onDelete={(id) =>
          setDialog({
            title: "Excluir esta criação?",
            body: "Ela será removida da galeria deste aparelho. Não há lixeira para desfazer.",
            label: "Excluir desenho",
            action: () => void vm.remove(id),
          })
        }
      />
    </Entrance>
  );
}
export function StudioRoute() {
  const { vm, state, reduced, canvas, feedback, requestParent, setDialog } =
    useAtelier();
  return (
    <Entrance reduced={reduced}>
      <StudioScreen
        vm={vm}
        state={state}
        captureRef={canvas}
        onTap={feedback}
        onExport={() => requestParent("export")}
        onClear={() =>
          setDialog({
            title: "Um papel novo?",
            body: "Você pode desfazer para recuperar as cores depois.",
            label: "Limpar o papel",
            action: () => vm.clear(),
          })
        }
      />
    </Entrance>
  );
}
