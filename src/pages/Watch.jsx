import { Container, Typography, Box, Grid, Skeleton, Button } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import { useSiteConfig, useFirestoreCollection } from '../hooks/useFirestore';

import VideoCarousel from '../components/VideoCarousel';

const Watch = () => {
  const { data: config, loading: configLoading } = useSiteConfig();
  const { data: videos, loading: videosLoading } = useFirestoreCollection('videos');

  const defaultBjaVideos = [
    { id: 'ZDn1iuHsJFw?si', title: 'Binge English Teacher Season 2 on Hulu!!' },
    { id: 'AqPyOJ-_bpY?si', title: "FX's English Teacher - Official Trailer - stream on Hulu" },
    { id: 'YziovxOn6kE?si', title: 'A Spy Movie - FULL MOVIE' }
  ];

  // If no videos in Firestore, use defaults
  const displayCarouselVideos = videos.length > 0 ? videos : defaultBjaVideos;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <SEOManager title="Watch" description="The official video collection of Brian Jordan Alvarez." />
      <SectionHeader title="Watch" subtitle="The latest and greatest videos, sketches, and characters." />
      
      {/* Video Carousel */}
      <VideoCarousel videos={displayCarouselVideos} />

      {/* Featured Video (Single) */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Featured Highlight</Typography>
        <Box sx={{ position: 'relative', pt: '56.25%', borderRadius: 6, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', bgcolor: 'grey.100' }}>
          {configLoading ? (
            <Skeleton variant="rectangular" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
          ) : (
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              src={config?.featuredVideo || "https://www.youtube.com/embed/RtHC29merkU?si=E4GhTf7atZeo6fte"}
              title="Featured Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </Box>
      </Box>

      {/* YouTube Channel CTA */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large"
          href="https://www.youtube.com/@BrianJordanAlvarez" 
          target="_blank"
          sx={{ borderRadius: 100, px: 6, py: 2 }}
        >
          Subscribe on YouTube
        </Button>
      </Box>


      {/* Video Grid (Optional additional videos from Firestore) */}
      {videos.length > 0 && (
        <Grid container spacing={4}>
          {videos.map((vid) => (
            <Grid item xs={12} sm={6} md={4} key={vid.id}>
              <Box sx={{ position: 'relative', pt: '56.25%', borderRadius: 4, overflow: 'hidden', mb: 2 }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src={vid.url}
                  title={vid.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{vid.title}</Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Watch;
