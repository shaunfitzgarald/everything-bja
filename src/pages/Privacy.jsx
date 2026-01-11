import { Container, Typography, Box, Paper } from '@mui/material';
import SEOManager from '../components/SEOManager';

const Privacy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <SEOManager title="Privacy Policy" />
      <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 900 }}>Privacy Policy</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>Last Updated: {new Date().toLocaleDateString()}</Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>1. Information We Collect</Typography>
          <Typography variant="body1" paragraph>
            We collect information you provide directly to us, such as when you fill out a contact form or sign up for updates. This may include your name, email address, and message content.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>2. How We Use Information</Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to communicate with you, respond to your inquiries, and improve our services. We do not sell your personal data to third parties.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>3. Analytics & Cookies</Typography>
          <Typography variant="body1" paragraph>
            We use Google Analytics to understand how visitors interact with our site. This uses cookies to collect anonymous usage data.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>4. Your Rights</Typography>
          <Typography variant="body1" paragraph>
            You have the right to request access to or deletion of your personal data. Please contact us via the contact form for any such requests.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Privacy;
