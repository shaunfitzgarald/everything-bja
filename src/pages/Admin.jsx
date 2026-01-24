import { Container, Typography, Box, Button, TextField, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel, Divider, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFirestoreCollection, useSiteConfig, DEFAULT_CONFIG } from '../hooks/useFirestore';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, writeBatch, getDocs, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LogIn, Plus, Edit, Trash2, Save, RefreshCw, Mail, Sparkles, GripVertical, Image as ImageIcon, ArrowUpDown, Eye } from 'lucide-react';
import { fetchTmdbCredits } from '../services/tmdb.service';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, login, logout, loginWithEmail, checkAdmin } = useAuth();
  const { data: links, loading: linksLoading } = useFirestoreCollection('links');
  const { data: videos, loading: videosLoading } = useFirestoreCollection('videos');
  const { data: credits, loading: creditsLoading } = useFirestoreCollection('credits');
  const { data: pressPhotos, loading: pressPhotosLoading } = useFirestoreCollection('press_photos');
  const { data: characters, loading: charactersLoading } = useFirestoreCollection('characters');
  const { data: config, loading: configLoading } = useSiteConfig();
  const { data: conversations, loading: convsLoading } = useFirestoreCollection('conversations', 'timestamp');
  const { data: stats, loading: statsLoading } = useFirestoreCollection('analytics_stats', 'clickCount');
  const { data: contacts, loading: contactsLoading } = useFirestoreCollection('contacts', 'createdAt');

  const [editLink, setEditLink] = useState(null);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [tmdbId, setTmdbId] = useState('1071699'); // Default for BJA on TMDb
  const [tmdbKey, setTmdbKey] = useState('');
  const [openPressDialog, setOpenPressDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [chatSummary, setChatSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [uploadingBio, setUploadingBio] = useState(false);
  const [editPressPhoto, setEditPressPhoto] = useState(null);
  const [openCharacterDialog, setOpenCharacterDialog] = useState(false);
  const [editCharacter, setEditCharacter] = useState(null);

  const [syncing, setSyncing] = useState(false);
  
  // Credit State
  const [openCreditDialog, setOpenCreditDialog] = useState(false);
  const [editCredit, setEditCredit] = useState(null);
  const [uploadingCreditImg, setUploadingCreditImg] = useState(false);
  const [draggedCredit, setDraggedCredit] = useState(null);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

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

  const handleSaveCredit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let imageUrl = formData.get('currentImage');
    const imageFile = formData.get('imageFile');

    if (imageFile && imageFile.size > 0) {
      setUploadingCreditImg(true);
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `credits/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Credit image upload failed:", error);
        alert("Failed to upload image.");
        setUploadingCreditImg(false);
        return;
      }
      setUploadingCreditImg(false);
    }

    const creditData = {
      showName: formData.get('showName'),
      role: formData.get('role'),
      year: formData.get('year'),
      mediaType: formData.get('mediaType'), // 'movie', 'tv', 'stage'
      tmdbUrl: formData.get('tmdbUrl'),
      image: imageUrl,
      priority: parseInt(formData.get('priority')) || 0
    };

    if (editCredit?.id) {
      await updateDoc(doc(db, 'credits', editCredit.id), creditData);
    } else {
      // Default priority to top? or bottom? Let's use 0 or max.
      await addDoc(collection(db, 'credits'), creditData);
    }
    setOpenCreditDialog(false);
    setEditCredit(null);
  };

  const handleAutoSortCredits = async () => {
    if (!window.confirm("This will overwrite custom order with strict Chronological (Year Descending) order. Continue?")) return;
    
    const sorted = [...credits].sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      if (yearB !== yearA) return yearB - yearA;
      return a.showName.localeCompare(b.showName);
    });

    const batch = writeBatch(db);
    sorted.forEach((cre, index) => {
      batch.update(doc(db, 'credits', cre.id), { priority: index });
    });
    
    await batch.commit();
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedCredit(index);
    e.dataTransfer.effectAllowed = "move";
    // Transparent ghost image if desired, but default is usually fine
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedCredit === null || draggedCredit === dropIndex) return;

    // Reorder local array first for visual feedback (though Firestore hook will sync eventually)
    // We actually need to update Priorities in Firestore.
    // To minimize writes, we might need a smart strategy, but let's just reassign all priorities in the new order.
    // Sort items by current priority first to ensure we have the correct list state
    const sortedCredits = [...credits].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    
    const item = sortedCredits[draggedCredit];
    const newItems = [...sortedCredits];
    newItems.splice(draggedCredit, 1);
    newItems.splice(dropIndex, 0, item);

    const batch = writeBatch(db);
    newItems.forEach((cre, idx) => {
      // Only update if priority changed
      if (cre.priority !== idx) {
        batch.update(doc(db, 'credits', cre.id), { priority: idx });
      }
    });

    setDraggedCredit(null);
    await batch.commit();
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    let bioPdfUrl = formData.get('bioPdfUrl');
    const bioFile = formData.get('bioFile');

    if (bioFile && bioFile.size > 0) {
      setUploadingBio(true);
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `bio/bio_doc_${Date.now()}_${bioFile.name}`);
        const snapshot = await uploadBytes(storageRef, bioFile);
        bioPdfUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Bio upload failed:", error);
        alert("Failed to upload bio file.");
        setUploadingBio(false);
        return;
      }
      setUploadingBio(false);
    }

    const newConfig = {
      displayName: formData.get('displayName'),
      tagline: formData.get('tagline'),
      bio: formData.get('bio'),
      shopUrl: formData.get('shopUrl'),
      cameoUrl: formData.get('cameoUrl'),
      letterboxdUrl: formData.get('letterboxdUrl'),
      featuredVideo: formData.get('featuredVideo'),
      shopMode: formData.get('shopMode'),
      brianBotEnabled: formData.get('brianBotEnabled') === 'on',
      enableGradient: formData.get('enableGradient') === 'on',
      themeColor: formData.get('themeColor'),
      secondaryColor: formData.get('secondaryColor'),
      heroImage: formData.get('heroImage') || DEFAULT_CONFIG.heroImage,
      bioPdfUrl: bioPdfUrl
    };
    
    // Use setDoc with merge: true to create the document if it doesn't exist
    await setDoc(doc(db, 'config', 'site'), newConfig, { merge: true });
    alert("Site config updated!");
  };

  const handleSavePressPhoto = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const photoData = {
      name: formData.get('name'),
      url: formData.get('url'),
      priority: parseInt(formData.get('priority')) || 0
    };

    if (editPressPhoto?.id) {
      await updateDoc(doc(db, 'press_photos', editPressPhoto.id), photoData);
    } else {
      await addDoc(collection(db, 'press_photos'), photoData);
    }
    setOpenPressDialog(false);
    setEditPressPhoto(null);
  };

  const handleDeletePressPhoto = async (id) => {
    if (window.confirm("Delete this press photo?")) {
      await deleteDoc(doc(db, 'press_photos', id));
    }
  };

  const handleSaveCharacter = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const charData = {
        name: formData.get('name'),
        image: formData.get('image'),
        blurb: formData.get('blurb'),
        priority: parseInt(formData.get('priority')) || 0
      };

      if (editCharacter?.id) {
        await updateDoc(doc(db, 'characters', editCharacter.id), charData);
      } else {
        await addDoc(collection(db, 'characters'), charData);
      }
      setOpenCharacterDialog(false);
      setEditCharacter(null);
      alert("Character saved successfully!");
    } catch (error) {
      console.error("Error saving character:", error);
      alert("Failed to save character: " + error.message);
    }
  };


  const handleDeleteCharacter = async (id) => {
    if (window.confirm("Delete this character? This will remove them from the homepage lineup.")) {
      await deleteDoc(doc(db, 'characters', id));
    }
  };

  const groupedConversations = conversations.reduce((acc, msg) => {
    if (!acc[msg.sessionId]) {
      acc[msg.sessionId] = {
        sessionId: msg.sessionId,
        messages: [],
        timestamp: msg.timestamp,
        preview: ''
      };
    }
    acc[msg.sessionId].messages.push(msg);
    if (msg.role === 'user' && !acc[msg.sessionId].preview) {
      acc[msg.sessionId].preview = msg.text;
    }
    if (msg.timestamp?.seconds > (acc[msg.sessionId].timestamp?.seconds || 0)) {
       acc[msg.sessionId].timestamp = msg.timestamp;
    }
    return acc;
  }, {});

  const sortedSessions = Object.values(groupedConversations).sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

  const handleSummarizeChats = async () => {
    if (conversations.length === 0) return;
    setSummarizing(true);
    try {
      // Aggregate last 100 messages for a broad overview
      const recentMessages = conversations
        .sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
        .slice(0, 100)
        .map(m => `${m.role.toUpperCase()}: ${m.text}`)
        .join('\n');

      const prompt = `You are a high-level analytics assistant. I will provide a log of user conversations with an AI version of Brian Jordan Alvarez. Your goal is to provide a concise, high-energy summary (in Brian's voice) of what people are generally asking about, what characters they love, and any common themes or "vibes" you notice. Keep it professional but "BJA-style".\n\nCONVERSATION LOG:\n${recentMessages}`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { message: prompt, history: [] } }),
      });

      if (!response.ok) throw new Error('Summary failed');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value);
        setChatSummary(text);
      }
    } catch (e) {
      console.error("Summary error:", e);
      alert("Could not generate summary. Check console.");
    } finally {
      setSummarizing(false);
    }
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
          priority: 0 // Will need re-sorting later
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

  const handleAnalyzeInbox = async () => {
    setAnalyzing(true);
    try {
      const messagesToAnalyze = contacts.slice(0, 20).map(c => ({
        id: c.id,
        subject: c.subject,
        message: c.message
      }));

      if (messagesToAnalyze.length === 0) {
        alert("No messages to analyze!");
        setAnalyzing(false);
        return;
      }

      const response = await fetch('/api/analyzeInbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToAnalyze }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      const { data } = await response.json();
      
      const batch = writeBatch(db);
      data.forEach(item => {
        if (item.id && item.summary) {
          const docRef = doc(db, 'contacts', item.id);
          batch.update(docRef, {
            aiSummary: item.summary,
            priority: item.priority || 'Low',
            aiReasoning: item.reasoning || 'No reasoning provided',
            analyzedAt: new Date()
          });
        }
      });
      await batch.commit();

    } catch (error) {
      console.error("Error analyzing inbox:", error);
      alert("Failed to analyze inbox. Check console.");
    }
    setAnalyzing(false);
  };

  // Filter contacts for UI
  const highPriority = contacts.filter(c => c.priority === 'High');
  const otherContacts = contacts.filter(c => c.priority !== 'High');

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
            {configLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <form onSubmit={handleSaveConfig}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Display Name" name="displayName" defaultValue={config?.displayName} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Tagline" name="tagline" defaultValue={config?.tagline} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Hero Image URL" name="heroImage" defaultValue={config?.heroImage || '/assets/hero_bja.png'} />
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
                  <Box sx={{ mb: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Bio Document (PDF/Doc)</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label="Download URL"
                        name="bioPdfUrl"
                        defaultValue={config?.bioPdfUrl}
                        size="small"
                        helperText="Use the upload button or paste a link manually"
                      />
                      <Button variant="outlined" component="label" disabled={uploadingBio} sx={{ height: 40, whiteSpace: 'nowrap' }}>
                        {uploadingBio ? <CircularProgress size={20} /> : 'Upload File'}
                        <input type="file" name="bioFile" hidden accept=".pdf,.doc,.docx,.txt,.md" />
                      </Button>
                    </Box>
                  </Box>
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
                  <FormControlLabel 
                    control={<Switch name="brianBotEnabled" defaultChecked={config?.brianBotEnabled !== false} />} 
                    label="Enable BrianBot AI 🤖" 
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Theme Customization</Typography>
                    
                    <Box sx={{ display: 'flex', gap: 4, mb: 2, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Primary Color</Typography>
                        <input 
                          type="color" 
                          name="themeColor" 
                          defaultValue={config?.themeColor || '#FF1493'}
                          style={{ width: 60, height: 40, border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Secondary Color</Typography>
                        <input 
                          type="color" 
                          name="secondaryColor" 
                          defaultValue={config?.secondaryColor || '#8A2BE2'}
                          style={{ width: 60, height: 40, border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }} 
                        />
                      </Box>
                    </Box>

                    <FormControlLabel 
                      control={<Switch name="enableGradient" defaultChecked={config?.enableGradient === true} />} 
                      label="Enable Gradient Buttons 🌈" 
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" type="submit" startIcon={<Save />}>Save Config</Button>
                </Grid>
              </Grid>
            </form>
            )}
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


          <Paper sx={{ p: 4, borderRadius: 6, mt: 4, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>⚠️ Important Note</Typography>
            <Typography variant="body2">
              Using <b>TMDb Sync</b> (above) will DELETE all existing credits and replace them. 
              If you have manually added credits or reduced the list, syncing will undo that valid work.
              Use the manual "Manage Acting Credits" section for fine-tuning.
            </Typography>
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
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Manage Acting Credits</Typography>
                <Typography variant="body2" color="text.secondary">Drag to reorder • Earliest at top of list = 1st on site?</Typography>
                <Typography variant="caption" color="text.secondary">Current Order: Priority 0 (Top) → Priority N (Bottom)</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" startIcon={<ArrowUpDown />} onClick={handleAutoSortCredits}>
                  Auto-Sort (Year)
                </Button>
                <Button variant="contained" color="secondary" startIcon={<Plus />} onClick={() => { setEditCredit({}); setOpenCreditDialog(true); }}>
                  Add Credit
                </Button>
              </Box>
            </Box>
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50}></TableCell>
                  <TableCell width={80}>Image</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell width={80}>Priority</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...credits]
                  .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                  .map((credit, index) => (
                    <TableRow 
                      key={credit.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      sx={{ 
                        cursor: 'move',
                        opacity: draggedCredit === index ? 0.5 : 1,
                        bgcolor: draggedCredit === index ? 'action.hover' : 'inherit',
                        '&:hover': { bgcolor: 'action.hover' },
                        transition: 'all 0.2s'
                      }}
                    >
                      <TableCell><GripVertical size={20} style={{ opacity: 0.5 }} /></TableCell>
                      <TableCell>
                        <Box 
                          component="img" 
                          src={credit.image || 'https://placehold.co/100x150?text=No+Img'} 
                          sx={{ width: 40, height: 60, objectFit: 'cover', borderRadius: 1, bgcolor: 'grey.200' }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{credit.showName}</TableCell>
                      <TableCell>{credit.role}</TableCell>
                      <TableCell>{credit.year}</TableCell>
                      <TableCell>{credit.priority}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => { setEditCredit(credit); setOpenCreditDialog(true); }}><Edit size={18} /></IconButton>
                        <IconButton color="error" onClick={() => handleDeleteCredit(credit.id)}><Trash2 size={18} /></IconButton>
                      </TableCell>
                    </TableRow>
                ))}
                {credits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      No credits found. Sync from TMDb or add Manually!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* Character Management */}
          <Paper sx={{ p: 4, borderRadius: 6, mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Manage The Lineup (Characters)</Typography>
              <Button variant="contained" color="secondary" startIcon={<Plus />} onClick={() => { setEditCharacter({}); setOpenCharacterDialog(true); }}>Add Character</Button>
            </Box>
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Blurb</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...characters].sort((a,b) => (b.priority || 0) - (a.priority || 0)).map((char) => (
                  <TableRow key={char.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{char.name}</TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{char.blurb}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => { setEditCharacter(char); setOpenCharacterDialog(true); }}><Edit size={18} /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteCharacter(char.id)}><Trash2 size={18} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {characters.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      No characters added yet. Jazz up the homepage!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* Press Kit Management */}
          <Paper sx={{ p: 4, borderRadius: 6, mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Manage Press Kit Gallery</Typography>
              <Button variant="contained" color="secondary" startIcon={<Plus />} onClick={() => { setEditPressPhoto({}); setOpenPressDialog(true); }}>Add Photo</Button>
            </Box>
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pressPhotos.map((photo) => (
                  <TableRow key={photo.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{photo.name}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{photo.url}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => { setEditPressPhoto(photo); setOpenPressDialog(true); }}><Edit size={18} /></IconButton>
                      <IconButton color="error" onClick={() => handleDeletePressPhoto(photo.id)}><Trash2 size={18} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {pressPhotos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      No press photos added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* Site Statistics Overview */}
          <Paper sx={{ p: 4, borderRadius: 6, mt: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Site Statistics (Click Tracking)</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Total Clicks</TableCell>
                  <TableCell align="right">Last Interaction</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.sort((a,b) => (b.clickCount || 0) - (a.clickCount || 0)).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{s.label || s.itemId}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{s.category}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main' }}>{s.clickCount || 0}</TableCell>
                    <TableCell align="right">
                      {s.lastClicked?.toDate ? s.lastClicked.toDate().toLocaleString() : 'Just now'}
                    </TableCell>
                  </TableRow>
                ))}
                {stats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>No click data yet. Clicks are tracked once users interact.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* BrianBot Conversations Log */}
          <Paper sx={{ p: 4, borderRadius: 6, mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>BrianBot Conversations Log</Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleSummarizeChats} 
                disabled={summarizing || conversations.length === 0}
                startIcon={summarizing ? <CircularProgress size={18} /> : <Save size={18} />}
              >
                {summarizing ? 'Analyzing...' : 'Summarize Themes with AI'}
              </Button>
            </Box>

            {chatSummary && (
              <Box sx={{ mb: 4, p: 3, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>AI Vibe Check Summary:</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{chatSummary}</Typography>
                <Button size="small" sx={{ mt: 2, color: 'inherit' }} onClick={() => setChatSummary('')}>Clear Summary</Button>
              </Box>
            )}

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Session ID</TableCell>
                  <TableCell>Last Message</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSessions.map((session) => (
                  <TableRow key={session.sessionId}>
                    <TableCell>{session.timestamp?.toDate ? session.timestamp.toDate().toLocaleString() : 'Ongoing'}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{session.sessionId.substring(0, 15)}...</TableCell>
                    <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.preview}
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => { setSelectedSession(session); setOpenChatDialog(true); }}>
                        View Transcript
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedSessions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>No conversations recorded yet. Ensure users have "Accepted All" cookies.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>



        {/* High Priority Inbox section */}
        {highPriority.length > 0 && (
          <Grid item xs={12}>
             <Paper sx={{ p: 4, borderRadius: 6, mb: 4, bgcolor: '#fff5f5', border: '1px solid #ffcdd2' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#d32f2f', display: 'flex', alignItems: 'center', gap: 1 }}>
                  🔥 High Priority ({highPriority.length})
                </Typography>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>AI Summary</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {highPriority.map((msg) => (
                    <TableRow key={msg.id} hover sx={{ bgcolor: 'white' }}>
                      <TableCell>{msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : 'Just now'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>{msg.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{msg.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{msg.aiSummary || msg.subject}</Typography>
                        <Typography variant="caption" color="text.secondary">{msg.aiReasoning}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button 
                            size="small"
                            variant="outlined"
                            onClick={() => { setSelectedMessage(msg); setOpenMessageDialog(true); }}
                            startIcon={<Eye size={16} />}
                          >
                            View
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="error"
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          >
                            Reply
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
             </Paper>
          </Grid>
        )}

        {/* Contact Inbox */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 6, minHeight: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Mail /> Inbox ({otherContacts.length})
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={analyzing ? <CircularProgress size={20} /> : <Sparkles size={20} />}
                onClick={handleAnalyzeInbox}
                disabled={analyzing}
              >
                {analyzing ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>Subject/Summary</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {otherContacts.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell>{msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : 'Just now'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>{msg.name}</Typography>
                    </TableCell>
                    <TableCell>
                       {/* Show Summary if exists, otherwise Subject and Preview */}
                       {msg.aiSummary ? (
                          <Box>
                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>✨ {msg.aiSummary}</Typography>
                            <Typography variant="caption" color="text.secondary">Priority: {msg.priority || 'Low'}</Typography>
                          </Box>
                       ) : (
                          <Box>
                            <Typography variant="body2">{msg.subject}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {msg.message}
                            </Typography>
                          </Box>
                       )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => { setSelectedMessage(msg); setOpenMessageDialog(true); }}
                          startIcon={<Eye size={16} />}
                        >
                          View
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="primary"
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}&body=${encodeURIComponent(`\n\n\n--- On ${msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Recent date'}, ${msg.name} wrote:\n> ${msg.message}`)}`}
                        >
                          Reply
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {otherContacts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">No standard messages.</Typography>
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
      {/* Edit/Add Press Photo Dialog */}
      <Dialog open={openPressDialog} onClose={() => setOpenPressDialog(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSavePressPhoto}>
          <DialogTitle>{editPressPhoto?.id ? 'Edit Press Photo' : 'Add New Press Photo'}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Photo Name/Description" name="name" defaultValue={editPressPhoto?.name} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Image URL" name="url" defaultValue={editPressPhoto?.url} placeholder="e.g. https://.../image.jpg" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="number" label="Display Priority" name="priority" defaultValue={editPressPhoto?.priority || 0} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenPressDialog(false)}>Cancel</Button>
            <Button variant="contained" color="secondary" type="submit">Save Photo</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit/Add Character Dialog */}
      <Dialog open={openCharacterDialog} onClose={() => setOpenCharacterDialog(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSaveCharacter}>
          <DialogTitle>{editCharacter?.id ? 'Edit Character' : 'Add New Character'}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Character Name" name="name" defaultValue={editCharacter?.name} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Image URL" name="image" defaultValue={editCharacter?.image} placeholder="High-quality photo URL" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={4} label="Blurb / Description" name="blurb" defaultValue={editCharacter?.blurb} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="number" label="Display Priority" name="priority" defaultValue={editCharacter?.priority || 0} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenCharacterDialog(false)}>Cancel</Button>
            <Button variant="contained" color="secondary" type="submit">Save Character</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Conversation Dialog */}
      <Dialog open={openChatDialog} onClose={() => setOpenChatDialog(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Conversation Transcript
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{selectedSession?.sessionId}</Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#f9f9f9', py: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedSession?.messages.sort((a,b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)).map((msg, idx) => (
              <Box 
                key={idx} 
                sx={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.role === 'user' ? 'User' : 'BrianBot'} • {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString() : ''}
                </Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    borderRadius: 4, 
                    bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                    color: msg.role === 'user' ? 'white' : 'text.primary',
                    border: msg.role === 'model' ? '1px solid' : 'none',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenChatDialog(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCreditDialog} onClose={() => setOpenCreditDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSaveCredit}>
          <DialogTitle>{editCredit?.id ? 'Edit Credit' : 'New Credit'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField fullWidth required label="Show / Movie Name" name="showName" defaultValue={editCredit?.showName} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Role" name="role" defaultValue={editCredit?.role} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Year" name="year" defaultValue={editCredit?.year} placeholder="YYYY" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth select SelectProps={{ native: true }} label="Media Type" name="mediaType" defaultValue={editCredit?.mediaType || 'tv'}>
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                  <option value="stage">Stage / Theater</option>
                  <option value="web">Web Series</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Link (IMDb/TMDb)" name="tmdbUrl" defaultValue={editCredit?.tmdbUrl} />
              </Grid>
              
              <input type="hidden" name="currentImage" value={editCredit?.image || ''} />
              <input type="hidden" name="priority" value={editCredit?.priority ?? credits.length} />

              <Grid item xs={12}>
                <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.default' }}>
                   <Typography variant="subtitle2" gutterBottom>Poster Image</Typography>
                   <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                     {editCredit?.image && (
                       <Box component="img" src={editCredit.image} sx={{ width: 60, height: 90, objectFit: 'cover', borderRadius: 1 }} />
                     )}
                     <Box sx={{ flexGrow: 1 }}>
                       <Button variant="outlined" component="label" fullWidth disabled={uploadingCreditImg}>
                         {uploadingCreditImg ? <CircularProgress size={20} /> : 'Upload Wrapper/Poster'}
                         <input type="file" name="imageFile" hidden accept="image/*" />
                       </Button>
                       <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                         Leaves 'currentImage' if no file selected.
                       </Typography>
                     </Box>
                   </Box>
                </Box>
              </Grid>

            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreditDialog(false)}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={uploadingCreditImg}>Save Credit</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Message Dialog */}
      <Dialog open={openMessageDialog} onClose={() => setOpenMessageDialog(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {selectedMessage?.subject || 'No Subject'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              From: {selectedMessage?.name} ({selectedMessage?.email})
            </Typography>
          </Box>
          <Typography variant="caption">
            {selectedMessage?.createdAt?.toDate ? selectedMessage.createdAt.toDate().toLocaleString() : ''}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedMessage?.aiSummary && (
             <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2 }}>
               <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>✨ AI Analysis</Typography>
               <Typography variant="body2" sx={{ fontWeight: 600 }}>Summary: {selectedMessage.aiSummary}</Typography>
               <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.9 }}>Reasoning: {selectedMessage.aiReasoning}</Typography>
             </Box>
          )}
          
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {selectedMessage?.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenMessageDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            startIcon={<Mail />}
            href={`mailto:${selectedMessage?.email}?subject=Re: ${encodeURIComponent(selectedMessage?.subject || '')}&body=${encodeURIComponent(`\n\n\n--- On ${selectedMessage?.createdAt?.toDate ? selectedMessage.createdAt.toDate().toLocaleString() : 'Recent date'}, ${selectedMessage?.name} wrote:\n> ${selectedMessage?.message}`)}`}
          >
            Reply via Email
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default Admin;
