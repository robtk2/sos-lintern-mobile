import React from 'react';
import { useSOSStore } from '@store/useSOSStore';
import { Typography } from "@components/ui/Typography";
import { Card } from "@components/ui/Card";
import { View, StyleSheet } from 'react-native';

/**
 * Component to display the current GPS coordinates for rescue signaling.
 * Features a high-visibility technical dashboard design.
 */
export const LocationDisplay: React.FC = () => {
  const { latitude, longitude } = useSOSStore();

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }

  return (
    <Card style={styles.container}>
      <Typography variant="label" style={styles.title}>RESCUE COORDINATES</Typography>
      <View style={styles.row}>
        <Typography variant="body" style={styles.coords}>LAT {latitude.toFixed(6)}°</Typography>
        <Typography variant="body" style={styles.coords}>LON {longitude.toFixed(6)}°</Typography>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  title: {
    marginBottom: 4,
    opacity: 0.8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  coords: {
    marginHorizontal: 10,
    fontFamily: 'monospace',
    fontSize: 14,
    textAlign: 'center',
  },
});
