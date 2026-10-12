export type Region = Readonly<{ id: string; d: string }>;
export type Template = Readonly<{
  id: string;
  title: string;
  category: "Bichinhos" | "Natureza" | "Imaginação";
  emoji: string;
  regions: readonly Region[];
}>;
const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0`;
const r = (id: string, d: string): Region => ({ id, d });
export const CATALOG: readonly Template[] = [
  {
    id: "cat",
    title: "Gatinho curioso",
    category: "Bichinhos",
    emoji: "🐱",
    regions: [
      r("body", ellipse(500, 640, 205, 220)),
      r("left-ear", "M290 375 L295 170 L445 285 Z"),
      r("right-ear", "M555 285 L705 170 L710 375 Z"),
      r("head", ellipse(500, 370, 220, 175)),
      r("nose", "M465 400 L535 400 L500 438 Z"),
      r("eye-left", ellipse(410, 350, 20, 30)),
      r("eye-right", ellipse(590, 350, 20, 30)),
    ],
  },
  {
    id: "bunny",
    title: "Coelho do jardim",
    category: "Bichinhos",
    emoji: "🐰",
    regions: [
      r("body", ellipse(500, 670, 200, 200)),
      r("ear-left", ellipse(400, 245, 65, 180)),
      r("ear-right", ellipse(600, 245, 65, 180)),
      r("head", ellipse(500, 470, 205, 160)),
      r("nose", ellipse(500, 490, 25, 18)),
      r("eye-left", ellipse(420, 445, 17, 23)),
      r("eye-right", ellipse(580, 445, 17, 23)),
    ],
  },
  {
    id: "fish",
    title: "Peixe de bolinhas",
    category: "Bichinhos",
    emoji: "🐟",
    regions: [
      r("tail", "M670 470 L870 310 L870 690 Z"),
      r("body", ellipse(455, 500, 260, 180)),
      r("fin", "M420 360 L500 240 L580 360 Z"),
      r("eye", ellipse(305, 460, 25, 25)),
      r("spot", ellipse(515, 500, 50, 50)),
    ],
  },
  {
    id: "butterfly",
    title: "Borboleta colorida",
    category: "Bichinhos",
    emoji: "🦋",
    regions: [
      r("wing-a", ellipse(310, 360, 180, 200)),
      r("wing-b", ellipse(690, 360, 180, 200)),
      r("wing-c", ellipse(340, 670, 135, 145)),
      r("wing-d", ellipse(660, 670, 135, 145)),
      r("body", ellipse(500, 500, 50, 240)),
      r("head", ellipse(500, 245, 65, 65)),
    ],
  },
  {
    id: "flower",
    title: "Flor do sol",
    category: "Natureza",
    emoji: "🌼",
    regions: [
      r("stem", "M475 500 L525 500 L525 900 L475 900 Z"),
      r("leaf", "M500 760 Q180 770 240 570 Q470 560 500 760 Z"),
      ...[0, 1, 2, 3, 4, 5].map((i) =>
        r(
          `petal-${i}`,
          ellipse(
            500 + 175 * Math.cos((i * Math.PI) / 3),
            380 + 175 * Math.sin((i * Math.PI) / 3),
            100,
            100,
          ),
        ),
      ),
      r("center", ellipse(500, 380, 100, 100)),
    ],
  },
  {
    id: "sun",
    title: "Um dia de sol",
    category: "Natureza",
    emoji: "☀️",
    regions: [
      ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        let x = 500 + 320 * Math.cos((i * Math.PI) / 4),
          y = 470 + 320 * Math.sin((i * Math.PI) / 4);
        return r(`ray-${i}`, ellipse(x, y, 35, 35));
      }),
      r("sun", ellipse(500, 470, 225, 225)),
      r(
        "cloud",
        "M150 850 Q100 730 240 710 Q270 570 420 710 Q570 690 540 850 Z",
      ),
    ],
  },
  {
    id: "tree",
    title: "Árvore de histórias",
    category: "Natureza",
    emoji: "🌳",
    regions: [
      r("trunk", "M420 430 L580 430 L600 890 L390 890 Z"),
      r("top", ellipse(500, 330, 300, 250)),
      r("apple-a", ellipse(370, 310, 40, 40)),
      r("apple-b", ellipse(620, 410, 40, 40)),
      r("apple-c", ellipse(510, 210, 40, 40)),
    ],
  },
  {
    id: "rainbow",
    title: "Depois da chuva",
    category: "Natureza",
    emoji: "🌈",
    regions: [
      ...[0, 1, 2, 3, 4].map((i) => {
        const rad = 380 - i * 60;
        return r(
          `arc-${i}`,
          `M${500 - rad} 720 A${rad} ${rad} 0 0 1 ${500 + rad} 720 L${500 + rad - 58} 720 A${rad - 58} ${rad - 58} 0 0 0 ${500 - rad + 58} 720 Z`,
        );
      }),
      r("cloud", ellipse(230, 720, 140, 80)),
    ],
  },
  {
    id: "rocket",
    title: "Foguete dos sonhos",
    category: "Imaginação",
    emoji: "🚀",
    regions: [
      r("fire", "M400 710 L500 930 L600 710 Z"),
      r("fin-a", "M380 450 L240 750 L400 680 Z"),
      r("fin-b", "M620 450 L760 750 L600 680 Z"),
      r(
        "rocket",
        "M380 720 L380 390 Q400 230 500 100 Q600 230 620 390 L620 720 Z",
      ),
      r("window", ellipse(500, 415, 75, 75)),
    ],
  },
  {
    id: "house",
    title: "Casa acolhedora",
    category: "Imaginação",
    emoji: "🏡",
    regions: [
      r("walls", "M250 450 L750 450 L750 850 L250 850 Z"),
      r("roof", "M150 470 L500 150 L850 470 Z"),
      r("door", "M430 850 L430 600 L570 600 L570 850 Z"),
      r("window-a", "M300 560 L385 560 L385 670 L300 670 Z"),
      r("window-b", "M615 560 L700 560 L700 670 L615 670 Z"),
    ],
  },
  {
    id: "boat",
    title: "Barquinho aventureiro",
    category: "Imaginação",
    emoji: "⛵",
    regions: [
      r("boat", "M160 680 L840 680 L700 850 L300 850 Z"),
      r("mast", "M480 180 L510 180 L510 680 L480 680 Z"),
      r("sail-a", "M460 200 L460 630 L170 630 Z"),
      r("sail-b", "M530 250 L820 630 L530 630 Z"),
    ],
  },
  {
    id: "icecream",
    title: "Sorvete de cores",
    category: "Imaginação",
    emoji: "🍦",
    regions: [
      r("cone", "M320 490 L680 490 L500 900 Z"),
      r("scoop", ellipse(500, 365, 200, 200)),
      r("cherry", ellipse(500, 130, 40, 40)),
      r("sprinkle-a", ellipse(400, 300, 20, 10)),
      r("sprinkle-b", ellipse(585, 350, 20, 10)),
    ],
  },
];
export function templateById(id: string) {
  return CATALOG.find((t) => t.id === id);
}
