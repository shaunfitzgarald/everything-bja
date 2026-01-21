import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, Button, Slide, Link } from '@mui/material';
import { ShieldCheck } from 'lucide-react';

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('bja_privacy_consent');
    if (!consent) {
      // Delay slightly for better UX
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem('bja_privacy_consent', choice);
    setOpen(false);
    // Reload or trigger event to update hooks if necessary
    window.dispatchEvent(new Event('privacyConsentChanged'));
  };

  if (!open) return null;

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper 
        elevation={24} 
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          left: { xs: 16, sm: 24 }, 
          right: { xs: 16, sm: 'auto' },
          maxWidth: { sm: 450 },
          p: 3, 
          borderRadius: 6, 
          zIndex: 9999,
          border: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
          bgcolor: 'rgba(255, 255, 255, 0.98)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Box sx={{ bgcolor: 'rgba(255, 20, 147, 0.1)', p: 1, borderRadius: 3, color: 'primary.main' }}>
            <ShieldCheck size={24} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
              Privacy & Cookies
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              We use cookies to understand how you interact with BJA's world. This helps us see which characters and videos you love most! By clicking "Accept All", you agree to our use of analytics.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button 
            variant="text" 
            size="small" 
            onClick={() => handleConsent('declined')}
            sx={{ fontWeight: 600, color: 'text.secondary' }}
          >
            Opt-Out
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            onClick={() => handleConsent('accepted')}
            sx={{ fontWeight: 800, borderRadius: 100, px: 3 }}
          >
            Accept All
          </Button>
        </Box>
      </Paper>
    </Slide>
  );
};

export default CookieConsent;
