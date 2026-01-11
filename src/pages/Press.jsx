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
      <Grid container spacing={3}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Box sx={{ width: '100%', pt: '100%', position: 'relative', borderRadius: 4, overflow: 'hidden', bgcolor: 'grey.200', mb: 1 }}>
               <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'grey.500' }}>Photo {i}</Typography>
            </Box>
            <Button fullWidth startIcon={<Download size={16} />}>High Res</Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Press;
