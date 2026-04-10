import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from "@components/ui/Typography";
import { AudioToggle } from "./AudioToggle";

/**
 * Main application header component.
 * Displays the app title and current node designation.
 * Now includes the AudioToggle in a prominent position.
 */
export const AppHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Centered titles */}
      <View style={styles.header}>
        <Typography variant="h1">SOS LINTERN</Typography>
        <Typography variant="h2">RESCUE NODE ALPHA</Typography>
      </View>

      {/* Floating Toggle (Top Right Positioning) */}
      <View style={styles.toggleContainer}>
        <AudioToggle />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    marginBottom: 40,
  },
  header: {
    alignItems: 'center',
    width: '100%',
  },
  toggleContainer: {
    position: 'absolute',
    right: 20,
    top: 5,
  },
});
