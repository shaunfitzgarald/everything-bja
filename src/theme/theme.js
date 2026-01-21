import { createTheme } from '@mui/material/styles';

export const createAppTheme = (options = {}) => {
  const {
    primaryColor = '#FF1493', // Default: Deep Pink
    secondaryColor = '#8A2BE2', // Default: Blue Violet
    enableGradient = false, // Default: Solid Color
  } = options;

  return createTheme({
    palette: {
      primary: {
        main: primaryColor,
        light: '#FF69B4', // This might need dynamic adjustment if strict adherence is needed, but keeping simple for now
        dark: '#C71585',
        contrastText: '#fff',
      },
      secondary: {
        main: '#8A2BE2', // Blue Violet
        light: '#9370DB', // Medium Purple
        dark: '#4B0082', // Indigo
        contrastText: '#fff',
      },
      accent: {
        main: '#FFD700', // Gold
        orange: '#FF8C00', // Dark Orange
        cyan: '#00CED1', // Dark Turquoise
      },
      background: {
        default: '#fdfdfd',
        paper: '#ffffff',
      },
      text: {
        primary: '#1a1a1a',
        secondary: '#666666',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '3rem',
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.25rem',
        letterSpacing: '-0.01em',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 100,
            padding: '10px 24px',
            textTransform: 'none',
            fontWeight: 600,
          },
          contained: {
            boxShadow: 'none',
            background: enableGradient 
              ? `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})` 
              : primaryColor,
            color: '#fff',
            '&:hover': {
              boxShadow: `0 4px 12px ${primaryColor}66`,
              background: enableGradient 
                ? `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})` 
                : undefined,
              filter: enableGradient ? 'brightness(1.1)' : 'none',
            },
          },
          outlined: {
            borderColor: primaryColor,
            color: primaryColor,
            '&:hover': {
              borderColor: primaryColor,
              backgroundColor: `${primaryColor}11`,
            },
          },
          text: {
            '&:hover': {
              backgroundColor: `${primaryColor}11`,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          },
        },
      },
    },
  });
};

const theme = createAppTheme(); // Default instance for backward compatibility if needed imports exist
export default theme;
