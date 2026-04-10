import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "@theme";
import { useSOSStore } from "@store/useSOSStore";
import { useSOSEngine } from "@hooks/useSOSEngine";
import { Typography } from "@components/ui/Typography";
import { Card } from "@components/ui/Card";

/**
 * Animated countdown overlay for the SOS signal.
 * Displays minutes and seconds remaining before auto-stop.
 */
export const SOSCountdown: React.FC = () => {
  const theme = useTheme();
  const { sosActive } = useSOSStore();
  const { remainingTime } = useSOSEngine();

  if (!sosActive || remainingTime <= 0) {
    return null;
  }

  const h = Math.floor(remainingTime / 3600);
  const m = Math.floor((remainingTime % 3600) / 60);
  const s = remainingTime % 60;

  return (
    <Card style={styles.container}>
      <Typography variant="display" color={theme.colors.primary}>
        {h.toString().padStart(2, "0")}:{m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}
      </Typography>
      <Typography variant="label" style={{ marginTop: -4, textAlign: 'center', opacity: 0.8 }}>
        SIGNAL ENDING
      </Typography>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: 'center',
    paddingVertical: 10,
  },
});
