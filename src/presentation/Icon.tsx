import Svg, { Path, Circle, Rect, G } from "react-native-svg";
export function Icon({
  name,
  size = 36,
  color = "#7056CA",
}: {
  name: "lock" | "gallery" | "brush" | "spark" | "rainbow" | "flower";
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {name === "lock" ? (
        <G fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round">
          <Path d="M15 21V14a9 9 0 0 1 18 0v7" />
          <Rect x={10} y={21} width={28} height={22} rx={7} />
          <Path d="M24 29v6" />
        </G>
      ) : name === "gallery" ? (
        <G stroke={color} strokeWidth={3} fill="none" strokeLinejoin="round">
          <Rect x={5} y={7} width={38} height={34} rx={7} fill="#FFFDF7" />
          <Circle cx={15} cy={17} r={4} fill="#F6CD52" stroke="none" />
          <Path d="M8 34l12-12 8 9 8-7 7 10" />
        </G>
      ) : name === "brush" ? (
        <G stroke={color} strokeWidth={2.5} strokeLinejoin="round">
          <Path d="M12 34L32 5l10 8L22 39Z" fill="#F6CD52" />
          <Path d="M12 34c-9 0-3 11-10 11 17 4 26-3 20-6Z" fill="#EF5A75" />
          <Path d="m28 10 10 8" />
        </G>
      ) : name === "rainbow" ? (
        <G fill="none" strokeWidth={5} strokeLinecap="round">
          {["#EF5A75", "#F6CD52", "#65BD99", "#6767D9"].map((c, i) => (
            <Path
              key={c}
              d={`M${4 + i * 5} 40a${20 - i * 5} ${26 - i * 5} 0 0 1 ${40 - i * 10} 0`}
              stroke={c}
            />
          ))}
        </G>
      ) : name === "flower" ? (
        <G>
          {Array.from({ length: 6 }, (_, i) => (
            <Circle
              key={i}
              cx={24 + 12 * Math.cos((i * Math.PI) / 3)}
              cy={24 + 12 * Math.sin((i * Math.PI) / 3)}
              r={9}
              fill={
                [
                  "#EF5A75",
                  "#F49C42",
                  "#F6CD52",
                  "#65BD99",
                  "#45ADCD",
                  "#AC78CC",
                ][i]
              }
            />
          ))}
          <Circle cx={24} cy={24} r={8} fill="#FFE8A5" />
        </G>
      ) : (
        <Path d="m24 3 6 14 15 7-15 7-6 14-7-14L3 24l14-7Z" fill={color} />
      )}
    </Svg>
  );
}
