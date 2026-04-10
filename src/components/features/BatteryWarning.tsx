import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";
import { Typography } from "@components/ui/Typography";
import { useTheme } from "@theme";
import { useSOSStore } from "@store/useSOSStore";
import { Ionicons } from "@expo/vector-icons";

/**
 * Animated warning banner for battery depletion risk.
 * Appears when the SOS timer exceeds estimated battery life.
 */
export const BatteryWarning: React.FC = () => {
  const theme = useTheme();
  const { batteryWarningActive, burnRate } = useSOSStore();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: batteryWarningActive ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [batteryWarningActive]);

  if (!batteryWarningActive) return null;

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: "rgba(255, 59, 48, 0.15)" }]}>
      <Ionicons name="warning-outline" size={18} color={theme.colors.error} />
      <Typography variant="label" color={theme.colors.error} style={styles.text}>
        {burnRate 
          ? "DEPLETION RISK: Timer exceeds battery life." 
          : "BATTERY RISK: Est. life is low (Learning in progress...)"}
      </Typography>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
    marginTop: 20,
    marginBottom: 5,
    marginHorizontal: 20,
  },
  text: {
    marginLeft: 10,
    fontSize: 11,
    fontWeight: "700",
  },
});
