import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@theme';

export type TextVariant = 'h1' | 'h2' | 'display' | 'data' | 'label' | 'body';

export interface TypographyProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  children?: React.ReactNode;
}

/**
 * Unified Typography component for the Rescue Node design system.
 * Shadows the native Text component with semantic variants.
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const variantStyle = styles[variant];
  const textColor = color || (variant === 'h2' || variant === 'label' ? theme.colors.textSecondary : theme.colors.text);

  return (
    <RNText 
      style={[
        variantStyle, 
        { color: textColor }, 
        style
      ]} 
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
  },
  h2: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 4,
  },
  display: {
    fontSize: 32,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  data: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginVertical: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  body: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
