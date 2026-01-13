import { Container, Typography, Box, Button, TextField, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel, Divider } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFirestoreCollection, useSiteConfig } from '../hooks/useFirestore';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, writeBatch, getDocs } from 'firebase/firestore';
import { LogIn, Plus, Edit, Trash2, Save, RefreshCw } from 'lucide-react';
import { fetchTmdbCredits } from '../services/tmdb.service';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, login, logout, loginWithEmail, checkAdmin } = useAuth();
  const { data: links, loading: linksLoading } = useFirestoreCollection('links');
  const { data: videos, loading: videosLoading } = useFirestoreCollection('videos');
  const { data: credits, loading: creditsLoading } = useFirestoreCollection('credits');
  const { data: config, loading: configLoading } = useSiteConfig();

  const [editLink, setEditLink] = useState(null);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [tmdbId, setTmdbId] = useState('1071699'); // Default for BJA on TMDb
  const [tmdbKey, setTmdbKey] = useState('');
  const [syncing, setSyncing] = useState(false);

  if (authLoading) return <Container sx={{ py: 10 }}><Typography>Loading auth...</Typography></Container>;

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      setAuthError("Failed to login. Please check your credentials.");
      console.error(error);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 15, textAlign: 'center' }}>
        <Paper sx={{ p: 6, borderRadius: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>Admin Login</Typography>
          <Typography sx={{ mb: 4, color: 'text.secondary' }}>Only authorized creators can access this palace.</Typography>
          
          <form onSubmit={handleEmailLogin}>
            <TextField 
              fullWidth 
              label="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField 
              fullWidth 
              type="password" 
              label="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            {authError && <Typography color="error" sx={{ mb: 2, fontSize: '0.875rem' }}>{authError}</Typography>}
            <Button fullWidth variant="contained" size="large" type="submit" sx={{ mb: 2 }}>Sign in with Email</Button>
          </form>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button fullWidth variant="outlined" size="large" onClick={login} startIcon={<LogIn />}>Sign in with Google</Button>
        </Paper>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="sm" sx={{ py: 15, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>Access Denied</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>Your account ({user.email}) is not on the VIP allowlist.</Typography>
        
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 4, textAlign: 'left', fontSize: '0.75rem', fontFamily: 'monospace' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>Debug Info:</Typography>
          <div>• Logged in as: {user.email}</div>
          <div>• Is Admin (Context): {isAdmin ? 'Yes' : 'No'}</div>
          <div>• Provider: {user.providerData[0]?.providerId}</div>
          <div>• Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID}</div>
          <Divider sx={{ my: 1 }} />
          <div>• Tip: Ensure 'admin/allowlist' exists with an 'emails' array in Firebase.</div>
        </Box>

        <Button variant="contained" sx={{ mt: 4, px: 4 }} onClick={() => window.location.reload()}>Refresh Page</Button>
        <Button variant="outlined" sx={{ mt: 2, px: 4, display: 'block', mx: 'auto' }} onClick={async () => {
          const res = await checkAdmin();
          if (res) alert("Access granted! Refreshing...");
          else alert("Still no luck. Check the 'Debug Info' above.");
        }}>Force Re-Check</Button>
        <Button sx={{ mt: 2, display: 'block', mx: 'auto' }} onClick={logout}>Sign Out</Button>
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
      priority: parseInt(formData.get('priority')) || 0,
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

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const videoData = {
      title: formData.get('title'),
      id: formData.get('videoId'), // YouTube ID
      priority: parseInt(formData.get('priority')) || 0,
      isActive: true
    };

    if (editVideo?.id) {
      await updateDoc(doc(db, 'videos', editVideo.id), videoData);
    } else {
      await addDoc(collection(db, 'videos'), videoData);
    }
    setOpenVideoDialog(false);
    setEditVideo(null);
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm("Delete this video?")) {
      await deleteDoc(doc(db, 'videos', id));
    }
  };

  const handleDeleteCredit = async (id) => {
    if (window.confirm("Delete this credit?")) {
      await deleteDoc(doc(db, 'credits', id));
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
      cameoUrl: formData.get('cameoUrl'),
      letterboxdUrl: formData.get('letterboxdUrl'),
      featuredVideo: formData.get('featuredVideo'),
      shopMode: formData.get('shopMode')
    };
    await updateDoc(doc(db, 'config', 'site'), newConfig);
    alert("Site config updated!");
  };

  const handleTmdbSync = async () => {
    const finalKey = tmdbKey || import.meta.env.VITE_TMDB_API_KEY;
    if (!finalKey) {
      alert("Please enter a TMDb API Key or set VITE_TMDB_API_KEY in .env");
      return;
    }
    
    setSyncing(true);
    try {
      const data = await fetchTmdbCredits(tmdbId, finalKey);
      if (data?.cast) {
        const batch = writeBatch(db);
        
        // Map TMDb cast to a clean list
        const filmography = data.cast.map(item => ({
          showName: item.title || item.name,
          role: item.character || 'Acting',
          year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
          tmdbId: item.id,
          mediaType: item.media_type,
          image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          tmdbUrl: item.media_type === 'movie' 
            ? `https://www.themoviedb.org/movie/${item.id}` 
            : `https://www.themoviedb.org/tv/${item.id}`,
          priority: 0 
        }));

        // Robust sort by year desc
        filmography.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return yearB - yearA;
        });

        // Clear old credits
        const snapshot = await getDocs(collection(db, 'credits'));
        snapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Add new ones (limit to top 40 for performance)
        for (const credit of filmography.slice(0, 40)) {
          const newDocRef = doc(collection(db, 'credits'));
          batch.set(newDocRef, credit);
        }

        await batch.commit();
        alert(`Successfully synced ${Math.min(filmography.length, 40)} credits from TMDb!`);
      } else {
        alert("No credits found on TMDb for this ID.");
      }
    } catch (error) {
      console.error("[SYNC ERROR] Details:", error);
      alert(`Sync failed: ${error.message}\n\nPlease check:\n1. Your TMDb API Key is correct\n2. Your internet connection\n3. The browser console for details`);
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900 }}>Admin Dashboard</Typography>
        <Button variant="outlined" onClick={handleLogout}>Sign Out</Button>
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
                  <TextField fullWidth label="Cameo URL" name="cameoUrl" defaultValue={config?.cameoUrl} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Letterboxd URL" name="letterboxdUrl" defaultValue={config?.letterboxdUrl} />
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

          {/* TMDb Sync Tool */}
          <Paper sx={{ p: 4, borderRadius: 6, mt: 4, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>TMDb Sync 🎬</Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
              Pull acting credits from The Movie Database. {import.meta.env.VITE_TMDB_API_KEY ? "✅ Key detected" : "⚠️ Key missing in .env"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="TMDb Person ID" 
                  value={tmdbId} 
                  onChange={(e) => setTmdbId(e.target.value)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  type="password"
                  label="TMDb API Key (Optional if in .env)" 
                  value={tmdbKey} 
                  onChange={(e) => setTmdbKey(e.target.value)}
                  placeholder={import.meta.env.VITE_TMDB_API_KEY ? "Using key from .env" : "Paste your API Key here"}
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleTmdbSync}
                  disabled={syncing}
                  startIcon={<RefreshCw />}
                  sx={{ py: 1.5, fontWeight: 800 }}
                >
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </Grid>
            </Grid>
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

          {/* Videos Management */}
          <Paper sx={{ p: 4, borderRadius: 6, mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Manage Videos Hub</Typography>
              <Button variant="contained" color="secondary" startIcon={<Plus />} onClick={() => { setEditVideo({}); setOpenVideoDialog(true); }}>Add Video</Button>
            </Box>
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>YouTube ID</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((vid) => (
                  <TableRow key={vid.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{vid.title}</TableCell>
                    <TableCell>{vid.id}</TableCell>
                    <TableCell>{vid.priority}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => { setEditVideo(vid); setOpenVideoDialog(true); }}><Edit size={18} /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteVideo(vid.id)}><Trash2 size={18} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Credits Management */}
          <Paper sx={{ p: 4, borderRadius: 6, mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Manage Acting Credits</Typography>
              <Typography variant="body2" color="text.secondary">Synced or manually added</Typography>
            </Box>
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {credits.map((credit) => (
                  <TableRow key={credit.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{credit.showName}</TableCell>
                    <TableCell>{credit.role}</TableCell>
                    <TableCell>{credit.year}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => handleDeleteCredit(credit.id)}><Trash2 size={18} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {credits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      No credits found. Try syncing from TMDb!
                    </TableCell>
                  </TableRow>
                )}
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

      {/* Edit/Add Video Dialog */}
      <Dialog open={openVideoDialog} onClose={() => setOpenVideoDialog(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSaveVideo}>
          <DialogTitle>{editVideo?.id ? 'Edit Video' : 'Add New Video'}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Video Title" name="title" defaultValue={editVideo?.title} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="YouTube Video ID (not full URL)" name="videoId" defaultValue={editVideo?.id} placeholder="e.g. X93pS6L8Lp8" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="number" label="Priority (Higher = First)" name="priority" defaultValue={editVideo?.priority || 0} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenVideoDialog(false)}>Cancel</Button>
            <Button variant="contained" color="secondary" type="submit">Save Video</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Admin;
