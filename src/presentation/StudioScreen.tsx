import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { StudioState, StudioViewModel } from "../application/StudioViewModel";
import { PALETTE, PAPERS, Brush } from "../domain/artwork";
import { ArtCanvas } from "./ArtCanvas";
import { Button, styles as s, theme } from "./ui";
export function StudioScreen({
  state,
  vm,
  captureRef,
  onClear,
  onExport,
  onTap,
}: {
  state: StudioState;
  vm: StudioViewModel;
  captureRef: React.RefObject<View | null>;
  onClear: () => void;
  onExport: () => void;
  onTap: () => void;
}) {
  const [drawingSize, setDrawingSize] = useState(220);
  const modes: readonly { id: StudioState["tool"]; label: string }[] = [
    { id: "draw", label: "✎ Desenhar" },
    { id: "fill", label: "◒ Colorir" },
    { id: "stamp", label: "✿ Carimbos" },
  ];
  return (
    <View style={{ flex: 1, paddingHorizontal: 16, gap: 10 }}>
      <View style={[s.row, { justifyContent: "space-between" }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Desfazer"
          disabled={!state.canUndo}
          onPress={() => vm.undo()}
          style={[s.tab, { opacity: state.canUndo ? 1 : 0.4 }]}
        >
          <Text>↶</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refazer"
          disabled={!state.canRedo}
          onPress={() => vm.redo()}
          style={[s.tab, { opacity: state.canRedo ? 1 : 0.4 }]}
        >
          <Text>↷</Text>
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontWeight: "800",
            color: theme.ink,
          }}
        >
          Meu cantinho de cores
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpar desenho"
          onPress={onClear}
          style={s.tab}
        >
          <Text>⌫</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 100,
        }}
        onLayout={(e) =>
          setDrawingSize(
            Math.min(
              e.nativeEvent.layout.width,
              e.nativeEvent.layout.height,
              620,
            ),
          )
        }
      >
        <View
          style={{
            width: drawingSize,
            height: drawingSize,
            borderWidth: 5,
            borderColor: "white",
            borderRadius: 28,
            overflow: "hidden",
          }}
        >
          <ArtCanvas
            art={state.art}
            brush={state.brush}
            color={state.color}
            width={state.width}
            tool={state.tool}
            onStroke={(p) => vm.addStroke(p)}
            onStamp={(p) => {
              vm.stampAt(p);
              onTap();
            }}
            onFill={(id) => {
              vm.fill(id);
              onTap();
            }}
            captureRef={captureRef}
          />
        </View>
      </View>
      <ScrollView
        style={{ flexGrow: 0, maxHeight: 230 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
      >
        <View style={[s.row, { justifyContent: "center" }]}>
          {modes.map((m) => (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              accessibilityState={{ selected: state.tool === m.id }}
              onPress={() => vm.configure({ tool: m.id })}
              style={[
                s.tab,
                {
                  backgroundColor: state.tool === m.id ? theme.mint : "white",
                  flex: 1,
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={{ fontWeight: "700", fontSize: 12, color: theme.ink }}
              >
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingVertical: 3 }}
        >
          {PALETTE.map((c, i) => (
            <Pressable
              key={c}
              accessibilityRole="button"
              accessibilityLabel={
                [
                  "Rosa",
                  "Laranja",
                  "Amarelo",
                  "Verde",
                  "Azul",
                  "Roxo",
                  "Lilás",
                  "Marrom",
                  "Preto",
                ][i]
              }
              accessibilityState={{ selected: c === state.color }}
              onPress={() => {
                vm.configure({ color: c });
                onTap();
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                borderWidth: c === state.color ? 4 : 2,
                borderColor: c === state.color ? theme.ink : "white",
                backgroundColor: c,
              }}
            />
          ))}
        </ScrollView>
        {state.tool === "draw" ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.row}
            >
              {(
                [
                  { id: "marker", label: "Canetinha" },
                  { id: "pencil", label: "✏️ Lápis" },
                  { id: "rainbow", label: "Arco-íris" },
                  { id: "eraser", label: "Borracha" },
                ] as { id: Brush; label: string }[]
              ).map((b) => (
                <Pressable
                  key={b.id}
                  style={[
                    s.tab,
                    {
                      backgroundColor:
                        state.brush === b.id ? theme.peach : "white",
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: state.brush === b.id }}
                  onPress={() => vm.configure({ brush: b.id })}
                >
                  <Text style={{ color: theme.ink, fontWeight: "700" }}>
                    {b.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={[s.row, { justifyContent: "center" }]}>
              <Text style={{ color: theme.muted }}>Traço</Text>
              {[12, 24, 42].map((w) => (
                <Pressable
                  key={w}
                  style={[
                    s.tab,
                    {
                      minWidth: 60,
                      alignItems: "center",
                      backgroundColor: state.width === w ? theme.mint : "white",
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Espessura ${w}`}
                  accessibilityState={{ selected: state.width === w }}
                  onPress={() => vm.configure({ width: w })}
                >
                  <View
                    style={{
                      width: w / 2,
                      height: w / 2,
                      borderRadius: 30,
                      backgroundColor: theme.ink,
                    }}
                  />
                </Pressable>
              ))}
            </View>
          </>
        ) : state.tool === "stamp" ? (
          <View style={[s.row, { justifyContent: "center" }]}>
            {["★", "♥", "✿", "●"].map((x) => (
              <Pressable
                key={x}
                style={[
                  s.tab,
                  {
                    minWidth: 60,
                    alignItems: "center",
                    backgroundColor: state.stamp === x ? theme.peach : "white",
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Carimbo ${x}`}
                onPress={() => vm.configure({ stamp: x })}
              >
                <Text style={{ fontSize: 25, color: state.color }}>{x}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={[s.subtitle, { textAlign: "center", fontSize: 13 }]}>
            {state.art.template === "blank"
              ? "Escolha um desenho no catálogo para preencher regiões."
              : "Escolha a cor e toque em um pedacinho do desenho."}
          </Text>
        )}
        <View style={[s.row, { justifyContent: "center" }]}>
          <Text style={{ color: theme.muted }}>Papel</Text>
          {PAPERS.map((c) => (
            <Pressable
              key={c}
              accessibilityRole="button"
              accessibilityLabel={`Cor do papel ${c}`}
              onPress={() => vm.paper(c)}
              style={{
                backgroundColor: c,
                borderWidth: state.art.background === c ? 3 : 1,
                borderColor: "#736D80",
                width: 48,
                height: 48,
                borderRadius: 16,
              }}
            />
          ))}
        </View>
      </ScrollView>
      <View style={[s.row, { paddingBottom: 12 }]}>
        <View style={{ flex: 1 }}>
          <Button
            label={state.busy ? "Guardando…" : "✓ Guardar desenho"}
            onPress={() => void vm.save()}
            disabled={state.busy}
            testID="save-art"
          />
        </View>
        <Button
          label="Exportar"
          tone="light"
          onPress={onExport}
          disabled={state.busy}
        />
      </View>
    </View>
  );
}
