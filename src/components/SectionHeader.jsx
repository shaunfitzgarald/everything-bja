import { Typography, Box, Divider } from '@mui/material';

const SectionHeader = ({ title, subtitle, align = 'center' }) => {
  return (
    <Box sx={{ mb: 6, textAlign: align }}>
      <Typography 
        variant="h2" 
        component="h2" 
        sx={{ 
          color: 'primary.main', 
          fontWeight: 900, 
          letterSpacing: '-0.03em',
          mb: 1
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          {subtitle}
        </Typography>
      )}
      <Divider sx={{ mt: 3, width: align === 'center' ? '80px' : '40px', mx: align === 'center' ? 'auto' : 0, borderBottomWidth: 4, borderRadius: 2, borderColor: 'secondary.main' }} />
    </Box>
  );
};

export default SectionHeader;
