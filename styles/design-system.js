// 🎨 FUTURE TITANS - DESIGN SYSTEM
// Apple-inspired with Red/White/Gold theme

export const colors = {
  // Primary Colors
  primary: {
    red: '#DC2626', // Bright red
    darkRed: '#991B1B', // Dark red for contrast
    lightRed: '#FEE2E2', // Light red for backgrounds
  },
  
  // Accent Colors
  accent: {
    gold: '#D97706', // Golden accent
    lightGold: '#FCD34D', // Light gold for highlights
    amber: '#F59E0B',
  },
  
  // Neutral Colors (Apple-like)
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    dark: '#1F2937', // Dark gray for text
    medium: '#6B7280', // Medium gray
    light: '#F3F4F6', // Light gray for backgrounds
    border: '#E5E7EB', // Border color
  },
  
  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Gradients
  gradients: {
    redToGold: 'linear-gradient(135deg, #DC2626 0%, #D97706 100%)',
    whiteToLight: 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)',
    darkOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
  }
};

export const typography = {
  // Font family - Apple-like
  fontFamily: {
    sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
    display: ['Sohne', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  },
  
  // Font sizes
  fontSize: {
    xs: { size: '12px', lineHeight: '16px' },
    sm: { size: '14px', lineHeight: '20px' },
    base: { size: '16px', lineHeight: '24px' },
    lg: { size: '18px', lineHeight: '28px' },
    xl: { size: '20px', lineHeight: '28px' },
    '2xl': { size: '24px', lineHeight: '32px' },
    '3xl': { size: '30px', lineHeight: '36px' },
    '4xl': { size: '36px', lineHeight: '40px' },
    '5xl': { size: '48px', lineHeight: '56px' },
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
};

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

export const transitions = {
  fast: 'all 0.15s ease-in-out',
  base: 'all 0.3s ease-in-out',
  slow: 'all 0.5s ease-in-out',
};

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};

// Component-specific styles
export const componentStyles = {
  button: {
    primary: {
      bg: colors.primary.red,
      text: colors.neutral.white,
      hover: colors.primary.darkRed,
      shadow: shadows.md,
    },
    secondary: {
      bg: colors.neutral.light,
      text: colors.primary.red,
      hover: colors.primary.lightRed,
    },
    ghost: {
      bg: 'transparent',
      text: colors.primary.red,
      hover: colors.primary.lightRed,
    }
  },
  
  card: {
    bg: colors.neutral.white,
    border: `1px solid ${colors.neutral.border}`,
    shadow: shadows.md,
    borderRadius: borderRadius.lg,
  },
  
  input: {
    bg: colors.neutral.white,
    border: `1px solid ${colors.neutral.border}`,
    focus: colors.primary.red,
    placeholder: colors.neutral.medium,
  }
};

// Utility functions
export const getContrastText = (bgColor) => {
  // Simple contrast checker
  return bgColor.includes('fff') || bgColor.includes('light') ? colors.neutral.dark : colors.neutral.white;
};

export const generateColorPalette = (primaryColor) => {
  return {
    50: 'rgba(220, 38, 38, 0.05)',
    100: 'rgba(220, 38, 38, 0.1)',
    200: 'rgba(220, 38, 38, 0.2)',
    300: 'rgba(220, 38, 38, 0.3)',
    400: 'rgba(220, 38, 38, 0.4)',
    500: primaryColor,
    600: 'rgba(200, 30, 30, 1)',
    700: 'rgba(180, 25, 25, 1)',
    800: 'rgba(155, 27, 27, 1)',
    900: 'rgba(120, 20, 20, 1)',
  };
};

