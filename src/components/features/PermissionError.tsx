import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@theme';
import { Screen } from "@components/ui/Screen";
import { Typography } from "@components/ui/Typography";

interface PermissionErrorProps {
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isInline?: boolean;
  onRetry?: () => void;
}

/**
 * Flexible component to display missing permissions.
 * Supports full-screen (blocking) and inline (warning) layouts.
 */
export const PermissionError: React.FC<PermissionErrorProps> = ({ 
  message, 
  icon = 'alert-circle',
  isInline = false,
  onRetry
}) => {
  const theme = useTheme();

  const content = (
    <View style={isInline ? styles.inlineContent : styles.fullContent}>
      <Ionicons name={icon} size={isInline ? 24 : 64} color={theme.colors.error} />
      <Typography 
        variant={isInline ? 'label' : 'body'} 
        style={[styles.permissionText, isInline && styles.inlineText]}
      >
        {message}
      </Typography>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Typography variant="label" color={theme.colors.primary}>TAP TO RETRY</Typography>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isInline) {
    return content;
  }

  return (
    <Screen style={styles.container}>
      {content}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  fullContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 69, 58, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  permissionText: {
    textAlign: 'center',
    marginTop: 20,
  },
  inlineText: {
    marginTop: 8,
    paddingHorizontal: 15,
  },
  retryButton: {
    marginTop: 10,
    padding: 8,
  }
});
