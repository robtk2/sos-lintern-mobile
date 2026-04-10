export const theme = {
  colors: {
    primary: '#007AFF',
    background: '#000000',
    surface: '#121212',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    error: '#FF3B30',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      small: 12,
      body: 16,
      h1: 32,
      h2: 24,
    },
    fontFamily: {
      regular: 'System',
      bold: 'System',
    },
  },
  roundness: 12,
};

/**
 * Hook to access the theme tokens.
 * In the future, this can be expanded to support light/dark modes.
 */
export const useTheme = () => {
  // Logic for dynamic theme can be added here
  return theme;
};
