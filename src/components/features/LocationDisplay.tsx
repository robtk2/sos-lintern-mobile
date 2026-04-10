import React from 'react';
import { useSOSStore } from '@store/useSOSStore';
import { Typography } from "@components/ui/Typography";
import { Card } from "@components/ui/Card";
import { View, StyleSheet } from 'react-native';

import { usePermissions } from '@hooks/usePermissions';
import { PermissionError } from './PermissionError';

/**
 * Component to display the current GPS coordinates for rescue signaling.
 * Features a high-visibility technical dashboard design and permission handling.
 */
export const LocationDisplay: React.FC = () => {
  const { latitude, longitude } = useSOSStore();
  const { permissions, requestPermissions } = usePermissions();

  if (permissions.location === false) {
    return (
      <View style={styles.container}>
        <PermissionError 
          isInline
          message="Location permission required for rescue coordinates."
          onRetry={requestPermissions}
        />
      </View>
    );
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return (
      <Card style={styles.container}>
        <Typography variant="label" style={styles.title}>GPS STATUS</Typography>
        <Typography variant="body" style={styles.status}>WAITING FOR SIGNAL...</Typography>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <Typography variant="label" style={styles.title}>RESCUE COORDINATES</Typography>
      <View style={styles.coordsBlock}>
        <Typography variant="body" style={styles.coords}>LAT  {latitude.toFixed(6)}°</Typography>
        <Typography variant="body" style={styles.coords}>LON  {longitude.toFixed(6)}°</Typography>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 6,
    opacity: 0.8,
    textAlign: 'center',
  },
  coordsBlock: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  coords: {
    fontFamily: 'monospace',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  status: {
    fontFamily: 'monospace',
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
