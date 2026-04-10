import React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@theme';
import { Screen } from "@components/ui/Screen";
import { Typography } from "@components/ui/Typography";

/**
 * Screen component to display when camera permissions are missing.
 * Essential for functionality as the flashlight requires camera access.
 */
export const PermissionError: React.FC = () => {
  const theme = useTheme();

  return (
    <Screen style={styles.container}>
      <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
      <Typography variant="body" style={styles.permissionText}>
        Camera permission is required to control the flashlight.
      </Typography>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
