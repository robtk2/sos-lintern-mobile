import React from "react";
import { StyleSheet } from "react-native";
import { useSOSStore } from "@store/useSOSStore";
import { Button } from "@components/ui/Button";

/**
 * Minimalist toggle for the SOS Morse audio.
 */
export const AudioToggle: React.FC = () => {
  const { soundEnabled, setSoundEnabled } = useSOSStore();

  return (
    <Button
      variant="icon"
      icon={soundEnabled ? "volume-high" : "volume-mute"}
      onPress={() => setSoundEnabled(!soundEnabled)}
      style={styles.button}
      testID="audio-toggle-button"
    />
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8, // Refined touch area
  },
});
