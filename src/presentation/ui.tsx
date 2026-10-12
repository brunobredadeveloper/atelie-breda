import React, { useEffect, useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  View,
  StyleSheet,
  Image,
} from "react-native";
export const theme = {
  ink: "#29273F",
  muted: "#736D80",
  paper: "#FBF7EF",
  purple: "#7056CA",
  mint: "#CBEEDF",
  peach: "#FFE1D1",
  yellow: "#FFE8A5",
};
export function Button({
  label,
  onPress,
  tone = "purple",
  disabled = false,
  testID,
}: {
  label: string;
  onPress: () => void;
  tone?: "purple" | "light" | "danger";
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor:
            tone === "purple"
              ? theme.purple
              : tone === "danger"
                ? "#FFE0E4"
                : "#F0EAF8",
          opacity: disabled ? 0.4 : pressed ? 0.72 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          { color: tone === "purple" ? "white" : theme.ink },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
export function Brand() {
  return (
    <View style={styles.brand}>
      <Image
        source={require("../../assets/brand.png")}
        style={{ width: 32, height: 32, borderRadius: 8 }}
      />
      <Text style={{ fontWeight: "800", color: theme.ink, fontSize: 15 }}>
        breda_dev
        <Text style={{ color: theme.muted, fontWeight: "400" }}>
          {" "}
          / brincar & criar
        </Text>
      </Text>
    </View>
  );
}
export function Entrance({
  children,
  reduced = false,
}: {
  children: React.ReactNode;
  reduced?: boolean;
}) {
  const [opacity] = useState(() => new Animated.Value(reduced ? 1 : 0));
  useEffect(() => {
    if (reduced) {
      opacity.setValue(1);
      return;
    }
    const a = Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [reduced, opacity]);
  return (
    <Animated.View
      style={{
        flex: 1,
        opacity,
      }}
    >
      {children}
    </Animated.View>
  );
}
export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.paper },
  page: { padding: 22, gap: 18, paddingBottom: 30 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    color: theme.purple,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    color: theme.ink,
  },
  subtitle: { fontSize: 16, lineHeight: 24, color: theme.muted },
  section: { fontSize: 21, fontWeight: "800", color: theme.ink },
  button: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 15, fontWeight: "800" },
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#EDE6DD",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: {
    width: "47%",
    backgroundColor: "white",
    borderRadius: 22,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#EDE6DD",
  },
  tab: {
    padding: 12,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: "white",
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: theme.mint,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#24203699",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: theme.paper,
    borderRadius: 28,
    padding: 24,
    gap: 18,
    maxHeight: "85%",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDD4EB",
    padding: 16,
    fontSize: 22,
    color: theme.ink,
    minHeight: 56,
  },
});
