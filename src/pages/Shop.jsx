import { Container, Box, Typography, Button, Skeleton } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import { useSiteConfig } from '../hooks/useFirestore';
import { ShoppingBag } from 'lucide-react';

const Shop = () => {
  const { data: config, loading } = useSiteConfig();

  if (loading) return <Container sx={{ py: 10 }}><Skeleton variant="rectangular" height={600} sx={{ borderRadius: 6 }} /></Container>;

  const isIframeMode = config.shopMode === 'iframe';

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <SEOManager title="Shop" description="Official Brian Jordan Alvarez merchandise." />
      <SectionHeader title="The Shop" subtitle="Wear the energy. official Everything BJA merch." />

      {isIframeMode ? (
        <Box sx={{ 
          width: '100%', 
          height: '80vh', 
          borderRadius: 6, 
          overflow: 'hidden', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          bgcolor: 'white',
          position: 'relative'
        }}>
          <iframe 
            src={config.shopUrl} 
            title="BJA Store" 
            style={{ width: '100%', height: '100%', border: 'none' }}
            loading="lazy"
          />
          <Box sx={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10 }}>
             <Button 
               variant="contained" 
               href={config.shopUrl} 
               target="_blank"
               startIcon={<ShoppingBag />}
             >
               Open in New Tab
             </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'background.paper', borderRadius: 8, border: '2px dashed', borderColor: 'primary.main' }}>
           <Typography variant="h3" sx={{ fontWeight: 900, mb: 3 }}>Redirecting to Store...</Typography>
           <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
             We're taking you to the official Everything BJA store. If you aren't redirected automatically, click the button below.
           </Typography>
           <Button 
             variant="contained" 
             size="large" 
             href={config.shopUrl || 'https://bjastore.com'} 
             target="_blank"
             sx={{ px: 6, py: 2, fontSize: '1.2rem' }}
           >
             Go to BJA Store
           </Button>
        </Box>
      )}
    </Container>
  );
};

export default Shop;
