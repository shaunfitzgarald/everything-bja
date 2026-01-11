import { Container, Box, Typography, Button, Paper, Grid } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import { Heart, Send } from 'lucide-react';

const Support = () => {
  const supportOptions = [
    { title: 'Venmo', handle: '@Brian-Jordan-Alvarez', url: 'https://venmo.com/Brian-Jordan-Alvarez', color: '#3d95ce' },
    { title: 'PayPal', handle: 'Donate via PayPal', url: 'https://paypal.me/bja', color: '#003087' },
  ];

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <SEOManager title="Support" description="Support the art and the chaos." />
      <SectionHeader title="Support" subtitle="If you're feeling generous, it goes straight to the art." />

      <Paper sx={{ p: 4, borderRadius: 6, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Heart size={48} style={{ marginBottom: '20px' }} />
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Digital Tip Jar</Typography>
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
          Your support helps keep the lights on and the wigs flowing. Thank you for being part of this movement.
        </Typography>

        <Grid container spacing={2}>
          {supportOptions.map((opt) => (
            <Grid item xs={12} key={opt.title}>
              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                href={opt.url}
                target="_blank"
                sx={{ 
                  bgcolor: 'white', 
                  color: opt.color, 
                  fontWeight: 800,
                  py: 2,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                }}
                startIcon={<Send />}
              >
                {opt.title}: {opt.handle}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Support;
