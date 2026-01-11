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
    { label: 'TikTok', icon: <Twitter size={20} />, url: 'https://tiktok.com/@brianjordanalvarez' },
    { label: 'YouTube', icon: <Youtube size={20} />, url: 'https://youtube.com/user/BrianJordanAlvarez' },
    { label: 'Cameo', icon: <Clapperboard size={18} />, url: config.cameoUrl || '#' },
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
          <Grid item xs={12} md={7}>
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
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <FeaturedBanner 
                title="Official Merch" 
                description="Grab the latest Everything BJA drops. High quality, higher vibes."
                buttonText="Shop Now"
                buttonLink="/shop"
                image="https://via.placeholder.com/300x300?text=Merch+Preview" // Placeholder for now
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
