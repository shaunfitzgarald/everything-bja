import { Container, Typography, Box, Grid, TextField, Button, Paper, Alert } from '@mui/material';
import { useState } from 'react';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <SEOManager title="Contact" description="Get in touch with the Everything BJA team." />
      <SectionHeader title="Contact" subtitle="Business inquiries, fan mail, or just saying hello." />

      <Paper sx={{ p: 4, borderRadius: 6 }}>
        {submitted ? (
          <Alert severity="success" sx={{ mb: 4, borderRadius: 4 }}>
            Message received! Our team will get back to you if it's a match made in heaven.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  multiline 
                  rows={6} 
                  label="How can we help?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  type="submit" 
                  disabled={loading}
                  sx={{ py: 1.5, fontWeight: 800 }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default Contact;
