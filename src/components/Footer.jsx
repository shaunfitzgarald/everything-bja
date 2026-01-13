import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { Instagram, Youtube, Twitter, Clapperboard } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, borderTop: '1px solid', borderColor: 'divider', mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
              Everything BJA
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The official corner of the internet for Brian Jordan Alvarez. Stay fabulous.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
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
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
              Connect
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <IconButton component="a" href="https://instagram.com/brianjordanalvarez" target="_blank" color="inherit" size="small">
                <Instagram size={20} />
              </IconButton>
              <IconButton component="a" href="https://tiktok.com/@brianjordanalvarez" target="_blank" color="inherit" size="small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.16 1.02.16 2.13.84 2.91.68.75 1.71 1.15 2.73 1.05.77-.04 1.5-.43 2-1.03.54-.62.81-1.43.79-2.24V.02z"/></svg>
              </IconButton>
              <IconButton component="a" href="https://youtube.com/user/BrianJordanAlvarez" target="_blank" color="inherit" size="small">
                <Youtube size={20} />
              </IconButton>
              <IconButton component="a" href="https://letterboxd.com/actor/brianjordanalvarez/" target="_blank" color="inherit" size="small">
                <Clapperboard size={20} />
              </IconButton>
              <IconButton component="a" href="https://www.imdb.com/name/nm2755723/" target="_blank" color="inherit" size="small">
                <Clapperboard size={20} />
              </IconButton>
              <IconButton component="a" href="https://twitter.com/brianjoralvarez" target="_blank" color="inherit" size="small">
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
