import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { Instagram, Youtube, Twitter } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, borderTop: '1px solid', borderColor: 'divider', mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
              Everything BJA
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The official corner of the internet for Brian Jordan Alvarez. Stay fabulous.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link component={RouterLink} to="/press" color="inherit" underline="none">Press Kit</Link>
              <Link component={RouterLink} to="/support" color="inherit" underline="none">Support / Venmo</Link>
              <Link component={RouterLink} to="/legal/privacy" color="inherit" underline="none">Privacy Policy</Link>
              <Link component={RouterLink} to="/admin" color="inherit" underline="none">Admin Login</Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
              Connect
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton component="a" href="https://instagram.com/brianjordanalvarez" target="_blank" color="inherit">
                <Instagram size={20} />
              </IconButton>
              <IconButton component="a" href="https://youtube.com/user/BrianJordanAlvarez" target="_blank" color="inherit">
                <Youtube size={20} />
              </IconButton>
              <IconButton component="a" href="https://tiktok.com/@brianjordanalvarez" target="_blank" color="inherit">
                <Twitter size={20} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Brian Jordan Alvarez. All rights reserved. Camp is a lifestyle.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
