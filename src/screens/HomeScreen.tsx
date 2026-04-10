import React from "react";
import { View, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import { useHomeLogic } from "@hooks/useHomeLogic";
import { usePermissions } from "@hooks/usePermissions";
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
  const { permissions, requestPermissions } = usePermissions();
  const { 
    sosActive, 
    torchState, 
    toggleSOS, 
    handleTimeChange 
  } = useHomeLogic();

  const handleSOSToggle = async () => {
    if (!permissions.camera) {
      const granted = await requestPermissions();
      if (!granted) return;
    }
    toggleSOS();
  };

  if (permissions.camera === false) {
    return (
      <PermissionError 
        message="Camera permission is required to control the flashlight for emergency signals."
        onRetry={requestPermissions}
      />
    );
  }

  return (
    <Screen style={styles.container}>
      {/* Hidden CameraView for Flashlight Control */}
      {permissions.camera && (
        <CameraView
          style={styles.hiddenCamera}
          facing="back"
          enableTorch={torchState}
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
  container: {
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
