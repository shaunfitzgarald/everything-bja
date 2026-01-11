import { Card, CardActionArea, CardContent, Typography, Box, Avatar } from '@mui/material';
import { ExternalLink } from 'lucide-react';

const LinkCard = ({ title, url, icon, category, isFeatured }) => {
  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderRadius: 4, 
        border: isFeatured ? '2px solid' : '1px solid',
        borderColor: isFeatured ? 'primary.main' : 'divider',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(255, 20, 147, 0.15)',
        }
      }}
    >
      <CardActionArea href={url} target="_blank">
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Avatar sx={{ bgcolor: isFeatured ? 'primary.main' : 'secondary.main', mr: 2 }}>
            {icon || title[0]}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {category}
            </Typography>
          </Box>
          <ExternalLink size={18} color="#999" />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LinkCard;
