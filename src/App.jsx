import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// Pages (to be implemented)
import Home from './pages/Home';
import Watch from './pages/Watch';
import Social from './pages/Social';
import Shop from './pages/Shop';
import Credits from './pages/Credits';
import Press from './pages/Press';
import Support from './pages/Support';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/social" element={<Social />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/press" element={<Press />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <Footer />
      <ChatBot />
    </Box>
  );
}

export default App;
