import { Container, Typography, Box, Grid, Button, Paper, Divider } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import { Download, Mail } from 'lucide-react';

import { useSiteConfig, useFirestoreCollection } from '../hooks/useFirestore';

const Press = () => {
  const { data: config, loading: configLoading } = useSiteConfig();
  const { data: photos, loading: photosLoading } = useFirestoreCollection('press_photos');

  const biography = config?.bio || "Brian Jordan Alvarez is an actor, writer, and director based in Los Angeles. Known for his viral characters and sketches, Brian has built a massive following by blending high-energy performance with relatable, campy humor.";

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <SEOManager title="Press Kit" description="Official press materials for Brian Jordan Alvarez." />
      <SectionHeader title="Press Kit" subtitle="Everything you need for media, interviews, and more." />

      <Paper sx={{ p: 4, borderRadius: 6, mb: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Biography</Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {biography}
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }} href={config?.bioPdfUrl || "#"} target="_blank">
          Download Full Bio (PDF)
        </Button>
      </Paper>

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Media Assets</Typography>
      <Grid container spacing={4}>
        {photosLoading ? (
          [1, 2, 3].map(i => (
            <Grid size={{ xs: 12, sm: 4 }} key={i}>
              <Box sx={{ width: '100%', pt: '125%', borderRadius: 6, bgcolor: 'grey.100' }} />
            </Grid>
          ))
        ) : photos.length > 0 ? (
          photos.map((photo) => (
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
                   src={photo.url} 
                   alt={photo.name || 'Press Photo'}
                   style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                 />
              </Box>
              <Button 
                fullWidth 
                variant="outlined"
                href={photo.url}
                target="_blank"
                download
                startIcon={<Download size={18} />}
                sx={{ borderRadius: 4, fontWeight: 700 }}
              >
                High Res
              </Button>
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <Typography color="text.secondary">No press photos added yet.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Press;
