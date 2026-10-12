import { useState } from "react";
import { View, Text, Pressable, ScrollView, Switch } from "react-native";
import { StudioState, StudioViewModel } from "../application/StudioViewModel";
import { CATALOG } from "../domain/catalog";
import { newArtwork, hasMarks } from "../domain/artwork";
import { ArtworkSvg } from "./ArtCanvas";
import { Icon } from "./Icon";
import { Button, Brand, styles as s, theme } from "./ui";
export function Home({
  vm,
  state,
  askParent,
}: {
  vm: StudioViewModel;
  state: StudioState;
  askParent: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Brand />
      <View style={s.row}>
        <Text style={[s.eyebrow, { flex: 1 }]}>Ateliê Breda</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Área de responsáveis"
          onPress={askParent}
          style={s.tab}
        >
          <Icon name="lock" size={22} />
        </Pressable>
      </View>
      <Text style={s.heading}>Um mundo inteiro{"\n"}na ponta dos dedos.</Text>
      <Text style={s.subtitle}>
        Um pouquinho de imaginação.{"\n"}Um montão de cores.
      </Text>
      <View
        style={[
          s.card,
          {
            backgroundColor: theme.peach,
            overflow: "hidden",
            paddingBottom: 24,
          },
        ]}
      >
        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <View style={s.row}>
              <Icon name="flower" />
              <Icon name="spark" size={26} />
            </View>
            <Text style={[s.section, { fontSize: 28, marginTop: 12 }]}>
              Vamos criar?
            </Text>
            <Text
              style={[s.subtitle, { marginVertical: 12, color: "#785C63" }]}
            >
              O papel é seu.{"\n"}Não existe jeito errado.
            </Text>
          </View>
          <View
            style={{
              width: 130,
              height: 140,
              transform: [{ rotate: "8deg" }],
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <ArtworkSvg
              art={{
                ...newArtwork("hero", 0, "flower"),
                fills: {
                  "petal-0": "#EF5A75",
                  "petal-1": "#F6CD52",
                  "petal-2": "#AC78CC",
                  "petal-3": "#45ADCD",
                  "petal-4": "#65BD99",
                  "petal-5": "#F49C42",
                  center: "#FFE8A5",
                  stem: "#65BD99",
                  leaf: "#CBEEDF",
                },
              }}
            />
          </View>
        </View>
        <Button
          label="Desenhar livremente →"
          onPress={() => vm.newDrawing()}
          testID="new-drawing"
        />
      </View>
      <View style={s.grid}>
        <Pressable
          style={[s.tile, { backgroundColor: theme.mint }]}
          onPress={() => vm.navigate("catalog")}
          accessibilityRole="button"
          accessibilityLabel="Desenhos para colorir"
        >
          <Icon name="rainbow" size={44} />
          <Text style={s.section}>Colorir</Text>
          <Text style={s.subtitle}>12 pequenos mundos</Text>
        </Pressable>
        <Pressable
          style={[s.tile, { backgroundColor: theme.yellow }]}
          onPress={() => vm.navigate("gallery")}
          accessibilityRole="button"
          accessibilityLabel="Minha galeria"
        >
          <Icon name="gallery" size={44} />
          <Text style={s.section}>Minha galeria</Text>
          <Text style={s.subtitle}>
            {state.gallery.length} obras de imaginação
          </Text>
        </Pressable>
      </View>
      {hasMarks(state.art) && (
        <Button
          label="Continuar meu último desenho"
          tone="light"
          onPress={() => vm.navigate("studio")}
        />
      )}
      <Text style={[s.subtitle, { fontSize: 13, textAlign: "center" }]}>
        Sem anúncios. Sem pressa. Só imaginação.
      </Text>
    </ScrollView>
  );
}
export function Catalog({ vm }: { vm: StudioViewModel }) {
  const [filter, setFilter] = useState("Todos");
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.eyebrow}>ESCOLHA SEU MUNDO</Text>
      <Text style={s.heading}>Qual vai ganhar cor?</Text>
      <Text style={s.subtitle}>
        Pinte com o dedo ou toque em cada pedacinho.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.row}
      >
        {["Todos", "Bichinhos", "Natureza", "Imaginação"].map((x) => (
          <Pressable
            key={x}
            accessibilityRole="button"
            accessibilityState={{ selected: x === filter }}
            onPress={() => setFilter(x)}
            style={[
              s.tab,
              { backgroundColor: x === filter ? theme.mint : "white" },
            ]}
          >
            <Text style={{ fontWeight: "700", color: theme.ink }}>{x}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={s.grid}>
        {CATALOG.filter((t) => filter === "Todos" || t.category === filter).map(
          (t) => (
            <Pressable
              key={t.id}
              style={s.tile}
              accessibilityRole="button"
              accessibilityLabel={`Colorir ${t.title}`}
              onPress={() => vm.newDrawing(t.id)}
            >
              <View style={{ height: 140 }}>
                <ArtworkSvg art={newArtwork(t.id, 0, t.id)} />
              </View>
              <Text
                style={{ fontWeight: "800", color: theme.ink, fontSize: 16 }}
              >
                {t.title}
              </Text>
              <Text style={{ color: theme.muted, fontSize: 12 }}>
                {t.category}
              </Text>
            </Pressable>
          ),
        )}
      </View>
    </ScrollView>
  );
}
export function Gallery({
  vm,
  state,
}: {
  vm: StudioViewModel;
  state: StudioState;
}) {
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.eyebrow}>FEITO COM IMAGINAÇÃO</Text>
      <Text style={s.heading}>Minha pequena{"\n"}galeria.</Text>
      <Text style={s.subtitle}>
        Suas criações ficam aqui neste aparelho. Toque para continuar
        desenhando.
      </Text>
      {!state.gallery.length ? (
        <View style={[s.card, { alignItems: "center", padding: 40 }]}>
          <Icon name="gallery" size={64} />
          <Text style={s.section}>Sua primeira obra vem aí!</Text>
          <Text style={[s.subtitle, { textAlign: "center" }]}>
            Crie, salve e veja suas cores ganhar um lugar especial.
          </Text>
          <Button label="Fazer um desenho" onPress={() => vm.newDrawing()} />
        </View>
      ) : (
        <View style={s.grid}>
          {state.gallery.map((a, i) => (
            <Pressable
              key={a.id}
              style={s.tile}
              accessibilityRole="button"
              accessibilityLabel={`Abrir desenho ${i + 1}`}
              onPress={() => vm.reopen(a.id)}
            >
              <View style={{ aspectRatio: 1 }}>
                <ArtworkSvg art={a} />
              </View>
              <Text style={{ fontWeight: "800", color: theme.ink }}>
                Minha criação {state.gallery.length - i}
              </Text>
              <Text style={{ color: theme.muted, fontSize: 12 }}>
                {new Date(a.updatedAt).toLocaleDateString("pt-BR")}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
export function Parents({
  vm,
  state,
  onDelete,
}: {
  vm: StudioViewModel;
  state: StudioState;
  onDelete: (id: string) => void;
}) {
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Brand />
      <Text style={s.eyebrow}>ÁREA DE RESPONSÁVEIS</Text>
      <Text style={s.heading}>Pequenos artistas.{"\n"}Grandes cuidados.</Text>
      <View style={s.card}>
        <Text style={s.section}>Uma brincadeira tranquila</Text>
        <Text style={s.subtitle}>
          Não há conta infantil, anúncios, placares, cronômetros ou coleta de
          desenhos. Todas as atividades funcionam offline.
        </Text>
        <View style={s.row}>
          <Text style={[s.subtitle, { flex: 1 }]}>Reduzir animações</Text>
          <Switch
            accessibilityLabel="Reduzir animações"
            value={state.preferences.reducedMotion}
            onValueChange={(reducedMotion) =>
              void vm.preferences({ ...state.preferences, reducedMotion })
            }
          />
        </View>
        <View style={s.row}>
          <Text style={[s.subtitle, { flex: 1 }]}>Toques com vibração</Text>
          <Switch
            accessibilityLabel="Toques com vibração"
            value={state.preferences.haptics}
            onValueChange={(haptics) =>
              void vm.preferences({ ...state.preferences, haptics })
            }
          />
        </View>
      </View>
      <View style={s.card}>
        <Text style={s.section}>Privacidade e arquivos</Text>
        <Text style={s.subtitle}>
          Desenhos e preferências ficam no armazenamento do aplicativo.
          Desinstalar ou limpar os dados remove esse conteúdo. Não há backup em
          nuvem no app; o sistema pode incluir dados em seus próprios backups
          conforme a configuração do aparelho.
        </Text>
        <Text style={s.subtitle}>
          Exportar abre o compartilhamento do aparelho somente nesta área
          protegida. Você escolhe o destino. Nenhum desenho é enviado
          automaticamente à breda_dev.
        </Text>
        <Text style={s.subtitle}>
          A conta ajuda a separar os controles da brincadeira. Acompanhe o uso
          da criança.
        </Text>
      </View>
      <View style={[s.card, { backgroundColor: theme.mint }]}>
        <Text style={s.section}>Um ateliê completo</Text>
        <Text style={s.subtitle}>
          Explore todos os desenhos, pincéis e cores do ateliê. Tudo incluído,
          sem assinaturas ou compras dentro do aplicativo.
        </Text>
      </View>
      <Text style={s.section}>Gerenciar galeria</Text>
      {state.gallery.map((a, i) => (
        <View key={a.id} style={[s.card, s.row]}>
          <View style={{ width: 60, height: 60 }}>
            <ArtworkSvg art={a} />
          </View>
          <Text style={[s.subtitle, { flex: 1 }]}>
            Criação {state.gallery.length - i}
          </Text>
          <Button
            label="Excluir"
            tone="danger"
            disabled={state.busy}
            onPress={() => onDelete(a.id)}
          />
        </View>
      ))}
      <Text style={s.subtitle}>
        Criado pela breda_dev · Ateliê Breda 0.1.0{"\n"}Depois da brincadeira,
        que tal desenhar juntos no papel?
      </Text>
    </ScrollView>
  );
}
