import { Container, Typography, Box, Grid, Button, Paper, Divider } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import { Download, Mail } from 'lucide-react';

const Press = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <SEOManager title="Press Kit" description="Official press materials for Brian Jordan Alvarez." />
      <SectionHeader title="Press Kit" subtitle="Everything you need for media, interviews, and more." />

      <Paper sx={{ p: 4, borderRadius: 6, mb: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Biography</Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Brian Jordan Alvarez is an actor, writer, and director based in Los Angeles. Known for his viral characters and sketches, Brian has built a massive following by blending high-energy performance with relatable, campy humor.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          His work ranges from critically acclaimed TV roles to independent digital series that have garnered millions of views globally. He is a pioneer in the "new media" space, proving that character-driven comedy has a permanent home on the internet.
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }}>Download Full Bio (PDF)</Button>
      </Paper>

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Media Assets</Typography>
      <Grid container spacing={4}>
        {[
          { id: 1, name: 'Main Portrait', file: 'brian1.jpg' },
          { id: 2, name: 'Character Study', file: 'brian2.jpg' },
          { id: 3, name: 'Action Shot', file: 'brian3.jpg' }
        ].map((photo) => (
          <Grid size={{ xs: 12, sm: 4 }} key={photo.id}>
            <Box sx={{ 
              width: '100%', 
              pt: '125%', 
              position: 'relative', 
              borderRadius: 6, 
              overflow: 'hidden', 
              bgcolor: 'background.paper', 
              mb: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              border: '1px solid',
              borderColor: 'divider'
            }}>
               <img 
                 src={`/assets/${photo.file}`} 
                 alt={photo.name}
                 style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
               />
            </Box>
            <Button 
              fullWidth 
              variant="outlined"
              href={`/assets/${photo.file}`}
              download={photo.file}
              startIcon={<Download size={18} />}
              sx={{ borderRadius: 4, fontWeight: 700 }}
            >
              High Res
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Press;
