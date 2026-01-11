import { Box, Typography, Button, Paper } from '@mui/material';

const FeaturedBanner = ({ title, description, buttonText, buttonLink, color = 'primary.main', image }) => {
  return (
    <Paper 
      sx={{ 
        p: 4, 
        borderRadius: 6, 
        bgcolor: color, 
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        mb: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 3
      }}
    >
      <Box sx={{ flex: 1, zIndex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>{title}</Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>{description}</Typography>
        <Button 
          variant="contained" 
          color="inherit" 
          href={buttonLink} 
          target="_blank"
          sx={{ color: color, bgcolor: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
        >
          {buttonText}
        </Button>
      </Box>
      {image && (
        <Box 
          component="img" 
          src={image} 
          sx={{ 
            width: { xs: '100%', md: '40%' }, 
            height: 'auto', 
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }} 
        />
      )}
    </Paper>
  );
};

export default FeaturedBanner;
