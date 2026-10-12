import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { PanResponder, View, StyleSheet } from "react-native";
import Svg, { Path, Rect, Text as SvgText, G } from "react-native-svg";
import {
  Artwork,
  Brush,
  MAX_POINTS,
  Point,
  Stroke,
  brushes,
  pathOf,
  point,
} from "../domain/artwork";
import { templateById } from "../domain/catalog";
export const StrokeLayer = React.memo(function StrokeLayer({
  stroke,
  background,
}: {
  stroke: Stroke;
  background: string;
}) {
  const b = brushes[stroke.brush];
  if (stroke.brush === "rainbow" && stroke.points.length > 1)
    return (
      <G>
        {Array.from(
          { length: Math.ceil((stroke.points.length - 1) / 4) },
          (_, i) => (
            <Path
              key={i}
              d={pathOf(stroke.points.slice(i * 4, i * 4 + 5))}
              stroke={b.color(stroke, i * 4)}
              strokeWidth={b.width(stroke.width)}
              fill="none"
              strokeLinecap="round"
            />
          ),
        )}
      </G>
    );
  return (
    <Path
      d={pathOf(stroke.points)}
      stroke={stroke.brush === "eraser" ? background : stroke.color}
      strokeWidth={b.width(stroke.width)}
      strokeOpacity={b.opacity}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
});
export function ArtworkSvg({
  art,
  live,
  onFill,
}: {
  art: Artwork;
  live?: Stroke;
  onFill?: (id: string) => void;
}) {
  const template = templateById(art.template);
  return (
    <Svg width="100%" height="100%" viewBox="0 0 1000 1000">
      <Rect width={1000} height={1000} fill={art.background} />
      {template?.regions.map((r) => (
        <Path
          key={r.id}
          d={r.d}
          fill={art.fills[r.id] ?? art.background}
          stroke="#39354E"
          strokeWidth={8}
          strokeLinejoin="round"
          onPress={() => onFill?.(r.id)}
        />
      ))}
      {art.strokes.map((s) => (
        <StrokeLayer key={s.id} stroke={s} background={art.background} />
      ))}
      {live && <StrokeLayer stroke={live} background={art.background} />}{" "}
      {art.stamps.map((s) => (
        <SvgText
          key={s.id}
          x={s.x}
          y={s.y}
          textAnchor="middle"
          fontSize={100}
          fill={s.color}
        >
          {s.symbol}
        </SvgText>
      ))}
    </Svg>
  );
}
export function ArtCanvas({
  art,
  brush,
  color,
  width,
  tool,
  onStroke,
  onStamp,
  onFill,
  captureRef,
}: {
  art: Artwork;
  brush: Brush;
  color: string;
  width: number;
  tool: "draw" | "fill" | "stamp";
  onStroke: (p: readonly Point[]) => void;
  onStamp: (p: Point) => void;
  onFill: (id: string) => void;
  captureRef: React.RefObject<View | null>;
}) {
  const [live, setLive] = useState<Stroke>();
  const origin = useRef({ x: 0, y: 0 });
  const size = useRef(1),
    points = useRef<Point[]>([]),
    frame = useRef<number | undefined>(undefined);
  const latest = useRef({ brush, color, width, tool, onStroke, onStamp });
  useLayoutEffect(() => {
    latest.current = { brush, color, width, tool, onStroke, onStamp };
  }, [brush, color, width, tool, onStroke, onStamp]);
  const render = () =>
    setLive({
      id: "live",
      points: [...points.current],
      color: latest.current.color,
      width: latest.current.width,
      brush: latest.current.brush,
    });
  const responder = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs -- PanResponder registers event callbacks; it does not invoke them during render.
      PanResponder.create({
        onStartShouldSetPanResponder: () => latest.current.tool !== "fill",
        onMoveShouldSetPanResponder: () => latest.current.tool !== "fill",
        onPanResponderGrant: (e) => {
          const p = point(
            ((e.nativeEvent.pageX - origin.current.x) / size.current) * 1000,
            ((e.nativeEvent.pageY - origin.current.y) / size.current) * 1000,
          );
          if (latest.current.tool === "stamp") {
            latest.current.onStamp(p);
            return;
          }
          points.current = [p];
          render();
        },
        onPanResponderMove: (e) => {
          if (latest.current.tool !== "draw") return;
          const p = point(
              ((e.nativeEvent.pageX - origin.current.x) / size.current) * 1000,
              ((e.nativeEvent.pageY - origin.current.y) / size.current) * 1000,
            ),
            last = points.current.at(-1);
          if (last && Math.hypot(last.x - p.x, last.y - p.y) < 3) return;
          if (points.current.length >= MAX_POINTS) {
            latest.current.onStroke(points.current);
            points.current = [points.current.at(-1)!, p];
          } else points.current.push(p);
          if (frame.current === undefined)
            frame.current = requestAnimationFrame(() => {
              frame.current = undefined;
              render();
            });
        },
        onPanResponderRelease: () => {
          if (frame.current !== undefined) cancelAnimationFrame(frame.current);
          frame.current = undefined;
          if (latest.current.tool === "draw")
            latest.current.onStroke(points.current);
          points.current = [];
          setLive(undefined);
        },
        onPanResponderTerminate: () => {
          if (frame.current !== undefined) cancelAnimationFrame(frame.current);
          frame.current = undefined;
          if (points.current.length) latest.current.onStroke(points.current);
          points.current = [];
          setLive(undefined);
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [],
  );
  return (
    <View
      ref={captureRef}
      collapsable={false}
      testID="drawing-canvas"
      style={styles.canvas}
      onLayout={(e) => {
        size.current = e.nativeEvent.layout.width;
        captureRef.current?.measureInWindow((x, y) => {
          origin.current = { x, y };
        });
      }}
      {...responder.panHandlers}
    >
      <ArtworkSvg
        art={art}
        live={live}
        onFill={tool === "fill" ? onFill : undefined}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  canvas: {
    aspectRatio: 1,
    width: "100%",
    backgroundColor: "#FFFDF7",
    overflow: "hidden",
    borderRadius: 24,
  },
});
