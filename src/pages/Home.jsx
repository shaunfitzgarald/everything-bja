import { Container, Box, Typography, Button, Grid, Avatar, Skeleton } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import FeaturedBanner from '../components/FeaturedBanner';
import LinkCard from '../components/LinkCard';
import { useSiteConfig, useFirestoreCollection } from '../hooks/useFirestore';
import { Instagram, Youtube, Twitter, ShoppingBag, Clapperboard } from 'lucide-react';

const Home = () => {
  const { data: config, loading: configLoading } = useSiteConfig();
  const { data: links, loading: linksLoading } = useFirestoreCollection('links');

  if (configLoading) return <Container sx={{ py: 10 }}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 6 }} /></Container>;

  const featuredLinks = links.filter(link => link.isFeatured);
  const quickLinks = [
    { label: 'Instagram', icon: <Instagram size={20} />, url: 'https://instagram.com/brianjordanalvarez' },
    { label: 'TikTok', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.16 1.02.16 2.13.84 2.91.68.75 1.71 1.15 2.73 1.05.77-.04 1.5-.43 2-1.03.54-.62.81-1.43.79-2.24V.02z"/></svg>, url: 'https://tiktok.com/@brianjordanalvarez' },
    { label: 'YouTube', icon: <Youtube size={20} />, url: 'https://youtube.com/user/BrianJordanAlvarez' },
    { label: 'Letterboxd', icon: <Clapperboard size={18} />, url: config.letterboxdUrl || 'https://letterboxd.com/actor/brianjordanalvarez/' },
    { label: 'IMDb', icon: <Clapperboard size={18} />, url: "https://www.imdb.com/name/nm2755723/" },
    { label: 'Twitter', icon: <Twitter size={20} />, url: 'https://twitter.com/brianjoralvarez' },
    { label: 'Cameo', icon: <Clapperboard size={18} />, url: config.cameoUrl || 'https://www.cameo.com/brianjordanalvarez' },
    { label: 'Venmo', icon: <ShoppingBag size={18} />, url: 'https://venmo.com/u/brianjordanalvarez' },
  ];

  return (
    <Box>
      <SEOManager 
        title="Home" 
        description={config.tagline} 
        personData={{ image: config.heroImage }}
      />

      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 6, md: 10 },
        textAlign: 'center',
        background: 'radial-gradient(circle at top right, rgba(255, 20, 147, 0.05), transparent), radial-gradient(circle at bottom left, rgba(138, 43, 226, 0.05), transparent)'
      }}>
        <Container maxWidth="md">
          <Avatar 
            src={config.heroImage} 
            sx={{ width: 140, height: 140, mx: 'auto', mb: 4, border: '4px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
          />
          <Typography variant="h1" gutterBottom sx={{ mb: 2 }}>
            {config.displayName}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 500, fontStyle: 'italic', opacity: 0.8 }}>
            "{config.tagline}"
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {quickLinks.map((link) => (
              <Button 
                key={link.label}
                variant="outlined" 
                startIcon={link.icon}
                href={link.url}
                target="_blank"
                sx={{ px: 3, borderRadius: 100 }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 7 }}>
            <SectionHeader title="The Essentials" subtitle="Everything you need, all in one place." align="left" />
            
            {linksLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 4 }} />)
            ) : (
              featuredLinks.map(link => (
                <LinkCard key={link.id} {...link} />
              ))
            )}
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button variant="text" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                View All Social Links →
              </Button>
            </Box>
          </Grid>

          {/* Sidebar Area */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <FeaturedBanner 
                title="Official Merch" 
                description="Grab the latest Everything BJA drops. High quality, higher vibes."
                buttonText="Shop Now"
                buttonLink="/shop"
                image="/assets/store_mug.png"
              />

              <Box sx={{ mt: 4, p: 3, borderRadius: 6, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Youtube color="#FF0000" /> Featured Video
                </Typography>
                <Box sx={{ position: 'relative', pt: '56.25%', borderRadius: 4, overflow: 'hidden' }}>
                  <iframe
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    src={config.featuredVideo}
                    title="Featured Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </Box>
                <Button fullWidth variant="contained" sx={{ mt: 2 }} href="/watch">
                  More Videos
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
