import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
  type RefObject,
} from "react";
import { Slot, useRouter, usePathname } from "expo-router";
import type {
  StudioState,
  StudioViewModel,
} from "./src/application/StudioViewModel";
import {
  AccessibilityInfo,
  ActivityIndicator,
  AppState,
  BackHandler,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import * as SplashScreen from "expo-splash-screen";
import { captureRef, releaseCapture } from "react-native-view-shot";
import { Icon } from "./src/presentation/Icon";
import { createStudio } from "./src/application/composition";
import {
  Brand,
  Button,
  Entrance,
  styles as s,
  theme,
} from "./src/presentation/ui";
void SplashScreen.preventAutoHideAsync().catch(() => undefined);
const vm = createStudio();
type Dialog = {
  title: string;
  body: string;
  action: () => void;
  label: string;
};
type AtelierContextValue = {
  vm: StudioViewModel;
  state: StudioState;
  canvas: RefObject<View | null>;
  reduced: boolean;
  feedback: () => void;
  requestParent: (action: "parents" | "export") => void;
  setDialog: Dispatch<SetStateAction<Dialog | null>>;
};
const AtelierContext = createContext<AtelierContextValue | null>(null);
export function useAtelier() {
  const value = useContext(AtelierContext);
  if (!value) throw Error("Atelier provider missing");
  return value;
}
export default function App() {
  return (
    <SafeAreaProvider>
      <Atelier />
    </SafeAreaProvider>
  );
}
function Atelier() {
  const state = useSyncExternalStore(
    vm.subscribe,
    vm.getSnapshot,
    vm.getSnapshot,
  );
  const [welcome, setWelcome] = useState(true),
    [systemReduced, setSystemReduced] = useState(false),
    [dialog, setDialog] = useState<Dialog | null>(null),
    [parentAction, setParentAction] = useState<"parents" | "export" | null>(
      null,
    ),
    [answer, setAnswer] = useState(""),
    [gateError, setGateError] = useState(""),
    [challenge, setChallenge] = useState({ a: 0, b: 0 }),
    [exporting, setExporting] = useState(false);
  const attempts = useRef(0),
    blockedUntil = useRef(0),
    canvas = useRef<View>(null);
  const reduced = systemReduced || state.preferences.reducedMotion;
  const router = useRouter(),
    pathname = usePathname();
  useEffect(() => {
    if (!state.ready) return;
    const target = state.route === "home" ? "/" : `/${state.route}`;
    if (pathname !== target)
      router.replace(
        target as "/" | "/catalog" | "/studio" | "/gallery" | "/parents",
      );
  }, [state.route, state.ready, pathname, router]);
  useEffect(() => {
    void vm.initialize();
    void AccessibilityInfo.isReduceMotionEnabled().then(setSystemReduced);
    const a = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setSystemReduced,
    );
    const b = AppState.addEventListener("change", (status) => {
      if (status !== "active") {
        vm.revokeAdult();
        setParentAction(null);
        void vm.flushDraft().catch(() => undefined);
      }
    });
    return () => {
      a.remove();
      b.remove();
    };
  }, []);
  useEffect(() => {
    if (state.ready) void SplashScreen.hideAsync().catch(() => undefined);
  }, [state.ready]);
  useEffect(() => {
    if (state.route !== "parents") return;
    const timer = setTimeout(() => vm.revokeAdult(), 5 * 60_000);
    return () => clearTimeout(timer);
  }, [state.route]);
  const exit = () => {
    if (parentAction) {
      setParentAction(null);
      return;
    }
    if (state.route === "studio") {
      setDialog({
        title: "Vamos para o início?",
        body: "O rascunho fica guardado neste aparelho. Você pode continuar depois.",
        label: "Ir para o início",
        action: () => vm.navigate("home"),
      });
    } else {
      vm.revokeAdult();
      vm.navigate("home");
    }
  };
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (dialog) {
        setDialog(null);
        return true;
      }
      if (state.route !== "home" || parentAction) {
        exit();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [state.route, parentAction, dialog]);
  const requestParent = (action: "parents" | "export") => {
    setChallenge({
      a: 23 + Math.floor(Math.random() * 23),
      b: 13 + Math.floor(Math.random() * 19),
    });
    setAnswer("");
    setGateError("");
    setParentAction(action);
  };
  async function exportArt() {
    if (!vm.isAdult() || exporting) return;
    setExporting(true);
    let uri: string | undefined;
    try {
      if (Platform.OS === "web")
        throw Error("A exportação PNG está disponível no app Android e iOS.");
      if (!(await Sharing.isAvailableAsync()))
        throw Error("O compartilhamento não está disponível neste aparelho.");
      if (!vm.isAdult()) throw Error("Abra novamente a área de responsáveis.");
      uri = await captureRef(canvas, {
        format: "png",
        quality: 1,
        result: "tmpfile",
        width: 1600,
        height: 1600,
      });
      if (!vm.isAdult()) throw Error("Abra novamente a área de responsáveis.");
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        UTI: "public.png",
        dialogTitle: "Compartilhar criação do Ateliê Breda",
      });
    } catch (e) {
      setDialog({
        title: "Não foi possível exportar",
        body:
          e instanceof Error
            ? e.message
            : "Tente novamente. Seu desenho continua salvo.",
        label: "Tudo bem",
        action: () => undefined,
      });
    } finally {
      if (uri) releaseCapture(uri);
      setExporting(false);
      vm.revokeAdult();
    }
  }
  const unlock = () => {
    if (Date.now() < blockedUntil.current) {
      setGateError("Aguarde um minuto e tente novamente.");
      return;
    }
    if (answer.trim() !== String(challenge.a + challenge.b)) {
      attempts.current++;
      if (attempts.current >= 5) {
        blockedUntil.current = Date.now() + 60_000;
        attempts.current = 0;
      }
      setGateError("Essa resposta não confere. Peça ajuda a um responsável.");
      return;
    }
    attempts.current = 0;
    vm.grantAdult();
    const next = parentAction;
    setParentAction(null);
    if (next === "parents") vm.navigate("parents");
    else void exportArt();
  };
  const feedback = () => {
    if (state.preferences.haptics)
      void Haptics.selectionAsync().catch(() => undefined);
  };
  return (
    <AtelierContext.Provider
      value={{ vm, state, canvas, reduced, feedback, requestParent, setDialog }}
    >
      <SafeAreaView style={s.root}>
        <StatusBar style="dark" />
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1, opacity: state.ready && !welcome ? 1 : 0 }}
            pointerEvents={state.ready && !welcome ? "auto" : "none"}
            accessibilityElementsHidden={!state.ready || welcome}
            importantForAccessibility={
              state.ready && !welcome ? "auto" : "no-hide-descendants"
            }
          >
            {state.route !== "home" && (
              <View
                style={[s.row, { paddingHorizontal: 16, paddingVertical: 8 }]}
              >
                <Button label="← Início" tone="light" onPress={exit} />
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    fontWeight: "800",
                    color: theme.purple,
                  }}
                >
                  Ateliê Breda
                </Text>
              </View>
            )}
            <Slot />
          </View>
          {(!state.ready || welcome) && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme.paper,
              }}
            >
              {!state.ready ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <Brand />
                  <ActivityIndicator color={theme.purple} />
                  <Text style={s.subtitle}>Preparando suas cores…</Text>
                </View>
              ) : (
                <Entrance reduced={reduced}>
                  <ScrollView
                    contentContainerStyle={[
                      s.page,
                      { flexGrow: 1, justifyContent: "center" },
                    ]}
                  >
                    <Brand />
                    <View
                      style={{
                        padding: 30,
                        backgroundColor: theme.mint,
                        borderRadius: 40,
                        alignItems: "center",
                        marginVertical: 24,
                      }}
                    >
                      <Icon name="flower" size={120} />
                      <View style={s.row}>
                        <Icon name="brush" size={52} />
                        <Icon name="rainbow" size={80} />
                      </View>
                    </View>
                    <Text style={s.eyebrow}>BEM-VINDO AO ATELIÊ</Text>
                    <Text style={s.heading}>
                      Aqui, toda cor{"\n"}vira uma história.
                    </Text>
                    <Text style={s.subtitle}>
                      Desenhe, pinte e invente.{"\n"}Seu pequeno mundo começa
                      agora.
                    </Text>
                    <Button
                      label="Vamos brincar →"
                      onPress={() => setWelcome(false)}
                      testID="start-play"
                    />
                    <Text
                      style={[
                        s.subtitle,
                        { textAlign: "center", fontSize: 12 },
                      ]}
                    >
                      Uma criação original da breda_dev
                    </Text>
                  </ScrollView>
                </Entrance>
              )}
            </View>
          )}
        </View>
        <Modal
          visible={!!parentAction}
          transparent
          animationType={reduced ? "none" : "fade"}
          onRequestClose={() => setParentAction(null)}
        >
          <KeyboardAvoidingView
            style={s.modalBackdrop}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={s.modalCard}
            >
              <Icon name="lock" size={40} />
              <Text style={s.section}>Só um responsável</Text>
              <Text style={s.subtitle}>
                Para continuar, resolva esta conta. As compras e links ficam
                fora da brincadeira.
              </Text>
              <Text style={s.heading}>
                {challenge.a} + {challenge.b} = ?
              </Text>
              <TextInput
                accessibilityLabel="Resposta da conta"
                testID="parent-answer"
                style={s.input}
                value={answer}
                onChangeText={setAnswer}
                keyboardType="number-pad"
                maxLength={3}
                autoFocus
                secureTextEntry
              />
              <Text
                accessibilityLiveRegion="polite"
                style={{ color: "#A52F4F" }}
              >
                {gateError}
              </Text>
              <Button label="Continuar" onPress={unlock} />
              <Button
                label="Voltar à brincadeira"
                tone="light"
                onPress={() => setParentAction(null)}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
        <Modal
          visible={!!dialog || !!state.message || !!state.error || exporting}
          transparent
          animationType={reduced ? "none" : "fade"}
          onRequestClose={() => {
            if (!exporting) {
              setDialog(null);
              vm.dismiss();
            }
          }}
        >
          <View style={s.modalBackdrop}>
            <View style={s.modalCard}>
              {exporting ? (
                <>
                  <ActivityIndicator color={theme.purple} />
                  <Text style={s.section}>Preparando sua imagem…</Text>
                </>
              ) : dialog ? (
                <>
                  <Text style={s.section}>{dialog.title}</Text>
                  <Text style={s.subtitle}>{dialog.body}</Text>
                  <Button
                    label={dialog.label}
                    onPress={() => {
                      const action = dialog.action;
                      setDialog(null);
                      action();
                    }}
                  />
                  <Button
                    label="Voltar"
                    tone="light"
                    onPress={() => setDialog(null)}
                  />
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 55, textAlign: "center" }}>
                    {state.error
                      ? "☁️"
                      : state.messageKind === "saved"
                        ? "✨"
                        : "✿"}
                  </Text>
                  <Text style={s.section}>
                    {state.error
                      ? "Vamos tentar novamente?"
                      : "Olha que bonito!"}
                  </Text>
                  <Text accessibilityLiveRegion="polite" style={s.subtitle}>
                    {state.error ?? state.message}
                  </Text>
                  <Button label="Continuar" onPress={() => vm.dismiss()} />
                  {!state.error && state.messageKind === "saved" && (
                    <Button
                      label="Ver minha galeria"
                      tone="light"
                      onPress={() => {
                        vm.dismiss();
                        vm.navigate("gallery");
                      }}
                    />
                  )}
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </AtelierContext.Provider>
  );
}
