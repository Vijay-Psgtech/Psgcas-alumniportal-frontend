// src/constants/designSystem.js
/**
 * 🎨 PREMIUM DESIGN SYSTEM 2026
 * Royal Blue & White Theme
 * International Level Creative Design
 */

// ============================================
// COLOR PALETTE - Royal Premium Colors
// ============================================
export const COLORS = {
  // Primary Royal Blue
  primary: {
    darkest: "#0F2847",      // Deep navy for text
    dark: "#1A3A52",         // Main dark blue
    main: "#2E5F8A",         // Primary blue
    light: "#4A7BA7",        // Light blue
    lighter: "#6B95B5",      // Lighter shade
    lightest: "#E8F1F8",     // Very light blue
  },

  // Secondary Accent Blues
  secondary: {
    main: "#3D7BC4",         // Bright blue accent
    light: "#5B95D4",        // Light accent
    lighter: "#8FB5E8",      // Very light accent
  },

  // Neutrals
  neutral: {
    white: "#FFFFFF",
    black: "#000000",
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
  },

  // Status Colors
  status: {
    success: "#10B981",      // Green
    warning: "#F59E0B",      // Orange
    error: "#EF4444",        // Red
    info: "#3B82F6",         // Light Blue
  },

  // Gradients
  gradients: {
    primary: "linear-gradient(135deg, #1A3A52 0%, #2E5F8A 100%)",
    primaryAlt: "linear-gradient(135deg, #2E5F8A 0%, #3D7BC4 100%)",
    secondary: "linear-gradient(135deg, #3D7BC4 0%, #5B95D4 100%)",
    accent: "linear-gradient(135deg, #1A3A52 0%, #3D7BC4 100%)",
    light: "linear-gradient(135deg, #E8F1F8 0%, #F0F5FB 100%)",
    darkToLight: "linear-gradient(180deg, #1A3A52 0%, #2E5F8A 50%, #3D7BC4 100%)",
  },
};

// ============================================
// TYPOGRAPHY
// ============================================
export const TYPOGRAPHY = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    secondary: "'Poppins', sans-serif",
    display: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Fira Code', monospace",
  },

  fontSize: {
    xs: "11px",
    sm: "12px",
    base: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "28px",
    "4xl": "32px",
    "5xl": "40px",
    "6xl": "48px",
    "7xl": "56px",
    "8xl": "64px",
  },

  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
    loose: 2,
  },

  letterSpacing: {
    tight: "-0.5px",
    normal: "0px",
    wide: "0.5px",
    wider: "1px",
    widest: "1.5px",
  },
};

// ============================================
// SPACING
// ============================================
export const SPACING = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
};

// ============================================
// BORDER RADIUS
// ============================================
export const BORDER_RADIUS = {
  none: "0px",
  xs: "2px",
  sm: "4px",
  base: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
};

// ============================================
// SHADOWS
// ============================================
export const SHADOWS = {
  xs: "0 1px 2px 0 rgba(15, 40, 71, 0.05)",
  sm: "0 1px 3px 0 rgba(15, 40, 71, 0.1), 0 1px 2px 0 rgba(15, 40, 71, 0.06)",
  base: "0 4px 6px -1px rgba(15, 40, 71, 0.1), 0 2px 4px -1px rgba(15, 40, 71, 0.06)",
  md: "0 10px 15px -3px rgba(15, 40, 71, 0.1), 0 4px 6px -2px rgba(15, 40, 71, 0.05)",
  lg: "0 20px 25px -5px rgba(15, 40, 71, 0.1), 0 10px 10px -5px rgba(15, 40, 71, 0.04)",
  xl: "0 25px 50px -12px rgba(15, 40, 71, 0.15)",
  "2xl": "0 25px 50px -12px rgba(15, 40, 71, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(15, 40, 71, 0.05)",
  premium: "0 20px 60px rgba(15, 40, 71, 0.2), 0 0 1px rgba(15, 40, 71, 0.1)",
};

// ============================================
// TRANSITIONS
// ============================================
export const TRANSITIONS = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  base: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
  smooth: "300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
  verySlow: "800ms cubic-bezier(0.4, 0, 0.2, 1)",
};

// ============================================
// BREAKPOINTS
// ============================================
export const BREAKPOINTS = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// ============================================
// Z-INDEX
// ============================================
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  notification: 700,
};

// ============================================
// COMPONENT STANDARDS
// ============================================
export const COMPONENTS = {
  button: {
    height: {
      sm: "36px",
      base: "42px",
      lg: "48px",
    },
    padding: {
      sm: "8px 16px",
      base: "12px 24px",
      lg: "16px 32px",
    },
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
  },

  input: {
    height: "42px",
    padding: "11px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    borderWidth: "2px",
  },

  card: {
    borderRadius: "12px",
    padding: "24px",
    shadow: "md",
  },

  navbar: {
    height: "64px",
    heightScrolled: "60px",
  },
};

// ============================================
// ANIMATION KEYFRAMES
// ============================================
export const ANIMATIONS = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(46, 95, 138, 0.5);
    }
    50% {
      box-shadow: 0 0 30px rgba(46, 95, 138, 0.8);
    }
  }
`;

// ============================================
// GLOBAL STYLES
// ============================================
export const GLOBAL_STYLES = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${TYPOGRAPHY.fontFamily.primary};
    color: ${COLORS.neutral.gray[800]};
    background: ${COLORS.neutral.gray[50]};
    line-height: 1.6;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  input, textarea, select {
    font-family: inherit;
  }

  /* Remove default list styles */
  ul, ol {
    list-style: none;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${COLORS.neutral.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${COLORS.primary.main};
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${COLORS.primary.dark};
  }

  /* Selection Styling */
  ::selection {
    background: ${COLORS.primary.main};
    color: white;
  }
`;

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TRANSITIONS,
  BREAKPOINTS,
  Z_INDEX,
  COMPONENTS,
  ANIMATIONS,
  GLOBAL_STYLES,
};