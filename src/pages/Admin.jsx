import { Container, Typography, Box, Button, TextField, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirestoreCollection, useSiteConfig } from '../hooks/useFirestore';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { LogIn, Plus, Edit, Trash2, Save } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, loading: authLoading, login, logout } = useAuth();
  const { data: links, loading: linksLoading } = useFirestoreCollection('links');
  const { data: config, loading: configLoading } = useSiteConfig();

  const [editLink, setEditLink] = useState(null);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [siteConfig, setSiteConfig] = useState(null);

  if (authLoading) return <Container sx={{ py: 10 }}><Typography>Loading auth...</Typography></Container>;

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 15, textAlign: 'center' }}>
        <Paper sx={{ p: 6, borderRadius: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>Admin Login</Typography>
          <Typography sx={{ mb: 4, color: 'text.secondary' }}>Only authorized creators can access this palace.</Typography>
          <Button variant="contained" size="large" onClick={login} startIcon={<LogIn />}>Sign in with Google</Button>
        </Paper>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="sm" sx={{ py: 15, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Access Denied</Typography>
        <Typography color="text.secondary">Your account ({user.email}) is not on the VIP allowlist.</Typography>
        <Button sx={{ mt: 4 }} onClick={logout}>Sign Out</Button>
      </Container>
    );
  }

  const handleSaveLink = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const linkData = {
      title: formData.get('title'),
      url: formData.get('url'),
      category: formData.get('category'),
      priority: parseInt(formData.get('priority')),
      isFeatured: formData.get('isFeatured') === 'on',
      isActive: true
    };

    if (editLink?.id) {
      await updateDoc(doc(db, 'links', editLink.id), linkData);
    } else {
      await addDoc(collection(db, 'links'), linkData);
    }
    setOpenLinkDialog(false);
    setEditLink(null);
  };

  const handleDeleteLink = async (id) => {
    if (window.confirm("Delete this link? This is irreversible!")) {
      await deleteDoc(doc(db, 'links', id));
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newConfig = {
      displayName: formData.get('displayName'),
      tagline: formData.get('tagline'),
      bio: formData.get('bio'),
      shopUrl: formData.get('shopUrl'),
      featuredVideo: formData.get('featuredVideo'),
      shopMode: formData.get('shopMode')
    };
    await updateDoc(doc(db, 'config', 'site'), newConfig);
    alert("Site config updated!");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900 }}>Admin Dashboard</Typography>
        <Button variant="outlined" onClick={logout}>Sign Out</Button>
      </Box>

      <Grid container spacing={6}>
        {/* Site Config Section */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, borderRadius: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Site Configuration</Typography>
            <form onSubmit={handleSaveConfig}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Display Name" name="displayName" defaultValue={config?.displayName} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Tagline" name="tagline" defaultValue={config?.tagline} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={3} label="Bio" name="bio" defaultValue={config?.bio} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Shop URL" name="shopUrl" defaultValue={config?.shopUrl} />
                </Grid>
                <Grid item xs={12}>
                   <TextField fullWidth label="Featured Video Embed URL" name="featuredVideo" defaultValue={config?.featuredVideo} />
                </Grid>
                <Grid item xs={12}>
                   <TextField fullWidth select SelectProps={{ native: true }} label="Shop Mode" name="shopMode" defaultValue={config?.shopMode}>
                     <option value="link">Direct Link</option>
                     <option value="iframe">Iframe Embed</option>
                   </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" type="submit" startIcon={<Save />}>Save Config</Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Links Management */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Manage Links</Typography>
              <Button variant="contained" startIcon={<Plus />} onClick={() => { setEditLink({}); setOpenLinkDialog(true); }}>Add Link</Button>
            </Box>
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Featured</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{link.title}</TableCell>
                    <TableCell>{link.category}</TableCell>
                    <TableCell>{link.isFeatured ? '✅' : ''}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => { setEditLink(link); setOpenLinkDialog(true); }}><Edit size={18} /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteLink(link.id)}><Trash2 size={18} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit/Add Link Dialog */}
      <Dialog open={openLinkDialog} onClose={() => setOpenLinkDialog(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSaveLink}>
          <DialogTitle>{editLink?.id ? 'Edit Link' : 'Add New Link'}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Title" name="title" defaultValue={editLink?.title} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="URL" name="url" defaultValue={editLink?.url} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Category" name="category" defaultValue={editLink?.category || 'Social'} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="number" label="Priority" name="priority" defaultValue={editLink?.priority || 0} />
              </Grid>
              <Grid item xs={12}>
                 <FormControlLabel 
                   control={<Switch name="isFeatured" defaultChecked={editLink?.isFeatured} />} 
                   label="Featured (Show on Home)" 
                 />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenLinkDialog(false)}>Cancel</Button>
            <Button variant="contained" type="submit">Save Link</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Admin;
