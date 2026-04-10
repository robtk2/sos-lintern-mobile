import React from "react";
import { View, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import { useHomeLogic } from "@hooks/useHomeLogic";
import { Screen } from "@components/ui/Screen";

// Components
import { AppHeader } from "@components/features/AppHeader";
import { SOSActionButton } from "@components/features/SOSActionButton";
import { TimeWheelPicker } from "@components/features/TimeWheelPicker";
import { BatteryStatus } from "@components/features/BatteryStatus";
import { LocationDisplay } from "@components/features/LocationDisplay";
import { AudioToggle } from "@components/features/AudioToggle";
import { SOSCountdown } from "@components/features/SOSCountdown";
import { PermissionError } from "@components/features/PermissionError";
import { BatteryWarning } from "@components/features/BatteryWarning";

/**
 * Main application screen.
 * Orchestrates the hardware control and SOS signaling.
 */
export const HomeScreen: React.FC = () => {
  const {
    sosActive,
    torchState,
    hasPermission,
    handleSOSToggle,
    handleTimeChange,
  } = useHomeLogic();

  if (hasPermission === false) {
    return <PermissionError />;
  }

  return (
    <Screen style={styles.content}>
      {/* Hidden CameraView for Flashlight Control */}
      {hasPermission && (
        <CameraView
          style={styles.hiddenCamera}
          facing="back"
          enableTorch={torchState} // Managed by useSOSEngine
        />
      )}

      <AppHeader />

      <View style={styles.centerSection}>
        <BatteryWarning />
        <SOSActionButton active={sosActive} onPress={handleSOSToggle} />

        <SOSCountdown />
      </View>

      <View style={styles.controlsSection}>
        <TimeWheelPicker onTimeChange={handleTimeChange} />

        <LocationDisplay />

        <BatteryStatus />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: "100%",
    paddingVertical: 30,
    justifyContent: "space-between",
    alignItems: "center",
  },
  centerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  controlsSection: {
    width: "100%",
    alignItems: "center",
  },
  hiddenCamera: {
    width: 1,
    height: 1,
    opacity: 0.1,
    position: "absolute",
  },
});
