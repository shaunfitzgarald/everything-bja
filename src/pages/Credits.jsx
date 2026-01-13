import { Container, Typography, Box, Grid, Button, Paper, Skeleton, Link } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { RefreshCw, ExternalLink } from 'lucide-react';

const Credits = () => {
  const { data: items, loading } = useFirestoreCollection('credits', null);

  const credits = [...items].sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    return yearB - yearA;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <SEOManager title="Credits" description="Film, television, and digital credits for Brian Jordan Alvarez." />
      
      <Box sx={{ 
        bgcolor: 'background.paper', 
        pt: { xs: 8, md: 10 }, 
        pb: { xs: 6, md: 8 },
        textAlign: 'center',
        background: 'linear-gradient(to bottom, rgba(255, 20, 147, 0.05), transparent)'
      }}>
        <Container maxWidth="md">
          <SectionHeader title="Acting Credits" subtitle="Stage & Screen" />
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="outlined" 
              href="https://www.imdb.com/name/nm2755723/" 
              target="_blank"
              startIcon={<ExternalLink size={18} />}
              sx={{ borderRadius: 100, px: 3 }}
            >
              IMDb Profile
            </Button>
            <Button 
              variant="outlined" 
              href="https://letterboxd.com/actor/brian-jordan-alvarez/" 
              target="_blank"
              startIcon={<ExternalLink size={18} />}
              sx={{ borderRadius: 100, px: 3 }}
            >
              Letterboxd
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {loading ? (
            [1,2,3,4,5,6,7,8].map(i => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 3 }} key={i}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 4 }} />
              </Grid>
            ))
          ) : (
            credits.map((credit) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 3 }} key={credit.id}>
                <Link 
                  href={credit.tmdbUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ textDecoration: 'none', display: 'block', height: '100%' }}
                >
                  <Paper sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { 
                      transform: 'translateY(-10px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      '& .movie-overlay': { opacity: 1 }
                    }
                  }}>
                    {/* Poster Image */}
                    <Box sx={{ position: 'relative', pt: '150%', bgcolor: 'grey.100' }}>
                      {credit.image ? (
                        <img 
                          src={credit.image} 
                          alt={credit.showName}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.5 }}>{credit.showName}</Typography>
                        </Box>
                      )}
                      
                      {/* Hover Overlay */}
                      <Box className="movie-overlay" sx={{ 
                        position: 'absolute', 
                        bottom: 0, left: 0, right: 0, 
                        p: 2, 
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
                        color: 'white',
                        opacity: { xs: 1, md: 0 },
                        transition: 'opacity 0.3s'
                      }}>
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, textTransform: 'uppercase', color: 'primary.light' }}>
                          {credit.year}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                          {credit.showName}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {credit.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Link>
              </Grid>
            ))
          )}
          {!loading && credits.length === 0 && (
            <Grid size={12} sx={{ textAlign: 'center', py: 10 }}>
               <Typography variant="h6" color="text.secondary">No credits found. Check the Admin panel to sync!</Typography>
            </Grid>
          )}
        </Grid>

        {/* TMDb Attribution */}
        <Box sx={{ mt: 12, pb: 6, textAlign: 'center', opacity: 0.5 }}>
          <Typography variant="caption" component="p" gutterBottom sx={{ fontWeight: 600 }}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </Typography>
          <img 
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" 
            alt="TMDb Logo" 
            style={{ width: 80, marginTop: 12 }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Credits;
