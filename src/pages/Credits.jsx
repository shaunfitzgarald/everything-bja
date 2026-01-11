import { Container, Typography, Box, Grid, Card, CardContent, Link } from '@mui/material';
import SEOManager from '../components/SEOManager';
import SectionHeader from '../components/SectionHeader';
import { useFirestoreCollection, useSiteConfig } from '../hooks/useFirestore';
import { ExternalLink } from 'lucide-react';

const Credits = () => {
  const { data: credits, loading } = useFirestoreCollection('credits');
  const { data: config } = useSiteConfig();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <SEOManager title="Credits" description="Film, television, and digital credits for Brian Jordan Alvarez." />
      <SectionHeader title="Credits" subtitle="The work. The roles. The evolution." />

      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Link 
          href={config?.imdbUrl || "https://www.imdb.com/name/nm3247063/"} 
          target="_blank"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontWeight: 700, fontSize: '1.1rem' }}
        >
          View Full IMDb Profile <ExternalLink size={18} />
        </Link>
      </Box>

      <Grid container spacing={3}>
        {credits.map((credit) => (
          <Grid item xs={12} key={credit.id}>
            <Card sx={{ p: 1, borderRadius: 4 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{credit.showName}</Typography>
                  <Typography variant="body2" color="text.secondary">{credit.role} • {credit.year}</Typography>
                </Box>
                {credit.link && (
                  <IconButton href={credit.link} target="_blank">
                    <ExternalLink size={18} />
                  </IconButton>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
        {credits.length === 0 && !loading && (
          <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
             <Typography color="text.secondary">Default credits items will be populated in Firestore.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Credits;
