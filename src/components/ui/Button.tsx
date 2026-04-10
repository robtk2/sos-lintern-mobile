import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@theme';
import { Typography } from './Typography';

export type ButtonVariant = 'primary' | 'ghost' | 'icon';

export interface ButtonProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: ButtonVariant;
  onPress: () => void;
  color?: string;
  size?: number;
  style?: ViewStyle;
  disabled?: boolean;
  testID?: string;
}

/**
 * Unified Button component for the Rescue Node Alpha.
 * Supports text, icon-only, and icon+text variants.
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  variant = 'primary',
  onPress,
  color,
  size = 24,
  style,
  disabled = false,
  testID,
}) => {
  const theme = useTheme();

  const isIconOnly = variant === 'icon' && icon && !label;
  const activeColor = color || theme.colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      activeOpacity={0.6}
      style={[
        styles.base,
        variant === 'icon' ? styles.iconBase : styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      hitSlop={isIconOnly ? { top: 15, bottom: 15, left: 15, right: 15 } : undefined}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={size} 
          color={disabled ? theme.colors.textSecondary : activeColor} 
        />
      )}
      {label && (
        <Typography 
          variant="label" 
          color={disabled ? theme.colors.textSecondary : theme.colors.text}
          style={icon ? { marginLeft: 8 } : undefined}
        >
          {label}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBase: {
    padding: 10,
  },
  primary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ghost: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
