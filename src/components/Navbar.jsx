import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Watch', path: '/watch' },
  { label: 'Social', path: '/social' },
  { label: 'Credits', path: '/credits' },
  { label: 'Shop', path: '/shop' },
  { label: 'Press', path: '/press' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 800, color: 'primary.main' }}>
        Everything BJA
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <Button
              component={RouterLink}
              to={item.path}
              sx={{ textAlign: 'center', width: '100%', py: 1.5, color: 'text.primary' }}
            >
              <ListItemText primary={item.label} />
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ 
              fontWeight: 900, 
              color: 'primary.main', 
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Everything BJA <Box component="span" sx={{ ml: 1, fontSize: '0.8rem', bgcolor: 'primary.main', color: 'white', px: 1, py: 0.2, borderRadius: 1 }}>VERIFIED</Box>
          </Typography>

          {isMobile ? (
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button key={item.path} component={RouterLink} to={item.path} color="inherit">
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
