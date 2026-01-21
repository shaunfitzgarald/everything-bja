import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import SEOManager from '../components/SEOManager';
import { ShieldCheck } from 'lucide-react';

const Privacy = () => {
  const handleResetConsent = () => {
    localStorage.removeItem('bja_privacy_consent');
    window.location.reload();
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <SEOManager title="Privacy Policy" description="How we handle your data on the Everything BJA fan site." />
      <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <ShieldCheck size={40} color="#FF1493" />
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900 }}>Privacy Policy</Typography>
            <Typography variant="body2" color="text.secondary">Last Updated: {new Date().toLocaleDateString()}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, '& h6': { fontWeight: 800, mt: 4, mb: 1, fontSize: '1.2rem' } }}>
          <Typography variant="body1" paragraph>
            Welcome to the Everything BJA fan site. We value your privacy and believe in full transparency. This policy explains what data we collect (and what we don't) and how we use it to enhance your experience.
          </Typography>

          <Typography variant="h6">1. BrainBot AI Conversations</Typography>
          <Typography variant="body1" paragraph>
            When you chat with "BrianBot", your conversation history is processed by Google's Gemini AI.
          </Typography>
          <List dense>
            <ListItem><ListItemText primary="If you ACCEPT cookies: We log your chat sessions anonymously to help us understand what topics are popular. The Admin (site owner) can view these transcripts to improve the AI's responses." /></ListItem>
            <ListItem><ListItemText primary="If you DECLINE cookies: Your chat is NOT saved to our database. It is processed transiently by the AI and then discarded." /></ListItem>
          </List>

          <Typography variant="h6">2. Analytics & Tracking</Typography>
          <Typography variant="body1" paragraph>
            We use a custom, privacy-focused analytics system built on Firebase. We do NOT use third-party trackers like Google Analytics or Facebook Pixel.
          </Typography>
          <List dense>
            <ListItem><ListItemText primary="Click Tracking: We track which links, videos, and products you click on to see what content is trending." /></ListItem>
            <ListItem><ListItemText primary="Aggregation: Data is stored in aggregate (e.g., '100 clicks on TJ Mack') rather than attached to your personal identity." /></ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
            If you opt-out via the Cookie Banner, no individual click events are recorded.
          </Typography>

          <Typography variant="h6">3. External Content</Typography>
          <Typography variant="body1" paragraph>
            This site embeds content from YouTube and other platforms. We attempt to load privacy-enhanced versions (like youtube-nocookie.com) wherever possible. However, these third parties may still set their own essential cookies.
          </Typography>

          <Typography variant="h6">4. Your Data Rights</Typography>
          <Typography variant="body1" paragraph>
            You have the right to request a copy of any data we hold about you or request its deletion. Since we minimized personal data collection, we likely only hold anonymous logs.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6">Cookie Settings</Typography>
          <Typography variant="body1" paragraph>
            You can reset your cookie preferences at any time by clicking the button below. This will bring back the consent banner.
          </Typography>
          <Button variant="outlined" onClick={handleResetConsent} sx={{ borderRadius: 100, mt: 1 }}>
            Reset Cookie Consent
          </Button>

        </Box>
      </Paper>
    </Container>
  );
};

export default Privacy;
