import { Container, Box, Typography, Button, Skeleton } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import { useSiteConfig } from '../hooks/useFirestore';
import { ShoppingBag } from 'lucide-react';

const Shop = () => {
  const { data: config, loading } = useSiteConfig();

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Skeleton variant="rectangular" height={800} sx={{ borderRadius: 4 }} />
    </Container>
  );

  const shopUrl = config.shopUrl || 'https://bjastore.com';
  // Default to iframe unless specifically set to redirect
  const isIframeMode = config.shopMode !== 'redirect';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <SEOManager title="Shop" description="Official Brian Jordan Alvarez merchandise." />
      
      <Box sx={{ 
        bgcolor: 'background.paper', 
        pt: { xs: 8, md: 10 }, 
        pb: { xs: 4, md: 6 },
        textAlign: 'center',
        background: 'linear-gradient(to bottom, rgba(255, 20, 147, 0.05), transparent)'
      }}>
        <Container maxWidth="md">
          <SectionHeader title="The Shop" subtitle="Official Everything BJA Merch" />
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, pb: 8 }}>
        {isIframeMode ? (
          <Box sx={{ 
            width: '100%', 
            height: '1000px', // Taller for better browsing
            borderRadius: 4, 
            overflow: 'hidden', 
            boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
            bgcolor: 'white',
            position: 'relative',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <iframe 
              src={shopUrl} 
              title="BJA Store" 
              style={{ width: '100%', height: '100%', border: 'none' }}
              loading="lazy"
            />
            {/* Overlay Button for Mobile or convenience */}
            <Box sx={{ position: 'absolute', bottom: 30, right: 30, zIndex: 10 }}>
               <Button 
                 variant="contained" 
                 href={shopUrl} 
                 target="_blank"
                 startIcon={<ShoppingBag />}
                 sx={{ 
                   borderRadius: 100, 
                   px: 4, 
                   py: 1.5,
                   boxShadow: '0 8px 32px rgba(255, 20, 147, 0.4)',
                   '&:hover': { transform: 'scale(1.05)' }
                 }}
               >
                 Open in New Tab
               </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 12, 
            px: 4,
            bgcolor: 'background.paper', 
            borderRadius: 6, 
            boxShadow: '0 12px 40px rgba(0,0,0,0.05)'
          }}>
             <Typography variant="h3" sx={{ fontWeight: 900, mb: 3 }}>Redirecting to Store...</Typography>
             <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
               We're taking you to the official Everything BJA store.
             </Typography>
             <Button 
               variant="contained" 
               size="large" 
               href={shopUrl} 
               target="_blank"
               sx={{ borderRadius: 100, px: 8, py: 2, fontSize: '1.2rem' }}
             >
               Go to BJA Store
             </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Shop;
