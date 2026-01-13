import { Container, Box, Typography, Grid, Skeleton, Button } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import LinkCard from '../components/LinkCard';
import SocialFeed from '../components/SocialFeed';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { Instagram, Youtube, Twitter, Clapperboard } from 'lucide-react';

const Social = () => {
  const { data: links, loading } = useFirestoreCollection('links');

  // Categorize links
  const socialLinks = links.filter(l => l.category === 'Social');
  const projectLinks = links.filter(l => l.category === 'Projects');
  const supportLinks = links.filter(l => l.category === 'Support');

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <SectionHeader title="Get Connected" subtitle="Follow the journey, the characters, and the chaos." />
      
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined" 
          href="https://www.imdb.com/name/nm2755723/" 
          target="_blank"
          startIcon={<Clapperboard size={18} />}
          sx={{ borderRadius: 4, px: 4 }}
        >
          IMDb Profile
        </Button>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Live Feeds</Typography>
        <Grid container spacing={6}>
          <Grid size={12}>
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Instagram size={20} /> Latest on Instagram
              </Typography>
              <SocialFeed type="instagram" url="https://www.instagram.com/brianjordanalvarez/" />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.16 1.02.16 2.13.84 2.91.68.75 1.71 1.15 2.73 1.05.77-.04 1.5-.43 2-1.03.54-.62.81-1.43.79-2.24V.02z"/></svg>
                TikTok Energy
              </Typography>
              <SocialFeed type="tiktok" url="https://www.tiktok.com/@brianjordanalvarez" />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 6, maxWidth: 'md', mx: 'auto' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Official Links</Typography>
        <Grid container spacing={2}>
          {socialLinks.map(link => (
            <Grid size={12} key={link.id}>
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
              <Grid size={12} key={link.id}>
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
