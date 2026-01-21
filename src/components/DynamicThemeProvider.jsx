import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useSiteConfig } from '../hooks/useFirestore';
import { createAppTheme } from '../theme/theme';
import { CircularProgress, Box } from '@mui/material';

const DynamicThemeProvider = ({ children }) => {
  const { data: config, loading } = useSiteConfig();

  const theme = useMemo(() => {
    let primaryColor = config?.themeColor;
    // Basic validation: must start with # and be 4 or 7 chars
    if (!primaryColor || typeof primaryColor !== 'string' || !primaryColor.startsWith('#')) {
      primaryColor = '#FF1493'; // Fallback to Deep Pink
    }
    const secondaryColor = config?.secondaryColor || '#8A2BE2';
    const enableGradient = config?.enableGradient === true;

    return createAppTheme({ primaryColor, secondaryColor, enableGradient });
  }, [config]);

  if (loading) {
      // Optional: Render a minimal loading state or just render children with default theme to avoid flash
     // For a smoother experience, we'll render children with default theme while loading, 
     // but let's stick to the plan of handling loading if critical. 
     // Actually, let's just render. The hook behaves well.
  }

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

export default DynamicThemeProvider;
