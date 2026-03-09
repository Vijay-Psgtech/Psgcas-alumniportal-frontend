/**
 * Global Theme Configuration
 * Use these values across all components for consistency
 */

export const THEME = {
  // Color Palette
  colors: {
    primary: '#0052CC',        // Vibrant Blue - main actions
    primaryDark: '#003B82',    // Deep Navy - headers
    primaryLight: '#1A73E8',   // Light Blue - hover states
    secondary: '#0369A1',      // Teal
    success: '#34A853',        // Green
    warning: '#FBBC04',        // Amber
    error: '#EA4335',          // Red
    neutral: {
      50: '#F9FAFB',
      100: '#F8F9FA',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      light: '#9CA3AF',
      inverse: '#FFFFFF',
    },
    bg: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      light: '#F3F4F6',
      overlay: 'rgba(31, 41, 55, 0.5)',
    },
  },

  // Typography
  typography: {
    fonts: {
      primary: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      serif: "'Georgia', 'Merriweather', serif",
    },
    sizes: {
      h1: '48px',
      h2: '36px',
      h3: '28px',
      h4: '24px',
      h5: '20px',
      bodyLarge: '16px',
      body: '14px',
      small: '12px',
      tiny: '11px',
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.8,
    },
  },

  // Spacing System (8px base)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
    '4xl': '64px',
  },

  // Shadows
  shadows: {
    subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
    light: '0 4px 12px rgba(0, 0, 0, 0.08)',
    medium: '0 10px 30px rgba(0, 0, 0, 0.12)',
    heavy: '0 20px 50px rgba(0, 0, 0, 0.15)',
    hover: '0 15px 40px rgba(0, 52, 204, 0.15)',
  },

  // Border Radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '1024px',
    desktop: '1400px',
  },

  // Z-index
  zIndex: {
    dropdown: 100,
    sticky: 500,
    fixed: 750,
    modal: 1000,
    popover: 1100,
    tooltip: 1200,
  },
};

/**
 * Helper function to create responsive CSS
 */
export const createResponsiveStyle = (mobile, tablet, desktop) => {
  return `
    ${mobile}
    @media (min-width: 641px) {
      ${tablet}
    }
    @media (min-width: 1025px) {
      ${desktop}
    }
  `;
};

/**
 * Global CSS to be added to all components
 */
export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: ${THEME.typography.fonts.primary};
    background: ${THEME.colors.bg.secondary};
    color: ${THEME.colors.text.primary};
    line-height: ${THEME.typography.lineHeight.relaxed};
  }

  /* Utility Classes */
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
  }

  @media (max-width: 1024px) {
    .container {
      padding: 0 30px;
    }
  }

  @media (max-width: 640px) {
    .container {
      padding: 0 16px;
    }
  }

  /* Button Base Styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    background: ${THEME.colors.primary};
    color: white;
    border: none;
    border-radius: ${THEME.radius.sm};
    font-family: ${THEME.typography.fonts.primary};
    font-size: ${THEME.typography.sizes.body};
    font-weight: ${THEME.typography.weights.semibold};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all ${THEME.transitions.base};
    text-decoration: none;
  }

  .btn:hover {
    background: ${THEME.colors.primaryLight};
    transform: translateY(-2px);
    box-shadow: ${THEME.shadows.hover};
  }

  .btn:active {
    transform: translateY(0);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Section Spacing */
  .section {
    padding: 80px 40px;
  }

  @media (max-width: 1024px) {
    .section {
      padding: 60px 30px;
    }
  }

  @media (max-width: 640px) {
    .section {
      padding: 40px 16px;
    }
  }

  /* Heading Styles */
  h1 {
    font-size: ${THEME.typography.sizes.h1};
    font-weight: ${THEME.typography.weights.bold};
    letter-spacing: -1px;
    line-height: ${THEME.typography.lineHeight.tight};
  }

  h2 {
    font-size: ${THEME.typography.sizes.h2};
    font-weight: ${THEME.typography.weights.bold};
    letter-spacing: -0.5px;
    line-height: ${THEME.typography.lineHeight.tight};
  }

  h3 {
    font-size: ${THEME.typography.sizes.h3};
    font-weight: ${THEME.typography.weights.semibold};
    line-height: ${THEME.typography.lineHeight.normal};
  }

  h4 {
    font-size: ${THEME.typography.sizes.h4};
    font-weight: ${THEME.typography.weights.semibold};
  }

  h5 {
    font-size: ${THEME.typography.sizes.h5};
    font-weight: ${THEME.typography.weights.semibold};
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleUp {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Focus States for Accessibility */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible {
    outline: 2px solid ${THEME.colors.primary};
    outline-offset: 2px;
  }
`;

export default THEME;