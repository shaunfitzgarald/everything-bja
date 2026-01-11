import { Container, Grid, Box, Typography } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import LinkCard from '../components/LinkCard';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { Instagram, Youtube, Twitter } from 'lucide-react';

const Social = () => {
  const { data: links, loading } = useFirestoreCollection('links');

  // Categorize links
  const socialLinks = links.filter(l => l.category === 'Social');
  const projectLinks = links.filter(l => l.category === 'Projects');
  const supportLinks = links.filter(l => l.category === 'Support');

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <SEOManager title="Socials" description="Connect with Brian Jordan Alvarez across all platforms." />
      <SectionHeader title="Get Connected" subtitle="Follow the journey, the characters, and the chaos." />

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Official Channels</Typography>
        <Grid container spacing={2}>
          {socialLinks.map(link => (
            <Grid item xs={12} key={link.id}>
              <LinkCard {...link} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {projectLinks.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Ongoing Projects</Typography>
          <Grid container spacing={2}>
            {projectLinks.map(link => (
              <Grid item xs={12} key={link.id}>
                <LinkCard {...link} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Social;
