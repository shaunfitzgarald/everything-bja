import { Container, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const NotFound = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 15, textAlign: 'center' }}>
      <SEOManager title="404 - Not Found" />
      <Typography variant="h1" color="primary" sx={{ fontSize: '8rem', fontWeight: 900, mb: 0 }}>404</Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Oops! This page is lost in the chaos.</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
        It seems like you've wandered into a character that doesn't exist yet. Let's get you back to safety.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/" size="large" sx={{ px: 4 }}>
        Back to Everything BJA
      </Button>
    </Container>
  );
};

export default NotFound;
