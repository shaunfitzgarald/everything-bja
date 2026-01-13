import { useState } from 'react';
import { Box, Typography, IconButton, Paper, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VideoCarousel = ({ videos = [] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const maxSteps = videos.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  if (!videos.length) return null;

  return (
    <Box sx={{ width: '100%', position: 'relative', mb: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Video Carousel</Typography>
      
      <Paper 
        elevation={0}
        sx={{ 
          position: 'relative', 
          pt: '56.25%', 
          borderRadius: 6, 
          overflow: 'hidden',
          bgcolor: 'black',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}
      >
        <iframe
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          src={`https://www.youtube.com/embed/${videos[activeStep].id}`}
          title={videos[activeStep].title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Paper>

      {/* Navigation Controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        mt: 3, 
        gap: 2 
      }}>
        <IconButton 
          onClick={handleBack} 
          sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
        >
          <ChevronLeft />
        </IconButton>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {videos.map((_, index) => (
            <Box 
              key={index}
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: activeStep === index ? 'primary.main' : 'divider',
                transition: '0.3s'
              }} 
            />
          ))}
        </Box>

        <IconButton 
          onClick={handleNext} 
          sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{videos[activeStep].title}</Typography>
      </Box>
    </Box>
  );
};

export default VideoCarousel;
