import React, { useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Youtube } from 'lucide-react';

const SocialFeed = ({ type, url }) => {
  const twitterContainerRef = useRef(null);

  useEffect(() => {
    // Load embed scripts if needed
    if (type === 'tiktok' && !window.tiktok_embed_js) {
      const script = document.createElement('script');
      script.id = 'tiktok-embed-script';
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      window.tiktok_embed_js = true;
    }
    
    if (type === 'instagram' && !window.instgrm) {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else if (type === 'instagram' && window.instgrm) {
      window.instgrm.Embeds.process();
    }

    if (type === 'twitter') {
      const loadTwitter = () => {
        if (window.twttr && window.twttr.widgets && twitterContainerRef.current) {
          // Clear container before creating
          twitterContainerRef.current.innerHTML = '';
          window.twttr.widgets.createTimeline(
            {
              sourceType: 'profile',
              screenName: 'brianjoralvarez'
            },
            twitterContainerRef.current,
            {
              height: 700,
              width: '100%',
              theme: 'light',
              chrome: 'noheader nofooter noborders transparent'
            }
          ).then(() => {
             // Widget loaded
          });
        }
      };

      if (!window.twttr) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = loadTwitter;
      } else {
        if (window.twttr.widgets) {
          loadTwitter();
        } else {
          window.twttr.ready(loadTwitter);
        }
      }
    }
  }, [type, url]);

  if (type === 'twitter') {
    return (
      <Box sx={{ 
        width: 'fit-content', 
        minWidth: '350px',
        maxWidth: '100%',
        mx: 'auto',
        borderRadius: '12px', 
        bgcolor: '#ffffff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)', 
        border: '1px solid', 
        borderColor: 'divider',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Box component="svg" viewBox="0 0 24 24" sx={{ width: 22, height: 22, fill: 'currentColor' }}>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Brian Jordan Alvarez</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>@brianjoralvarez • X Updates</Typography>
          </Box>
        </Box>
        <Box 
          ref={twitterContainerRef}
          sx={{ 
            p: 1, 
            height: 600, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress size={24} />
        </Box>
      </Box>
    );
  }

  if (type === 'tiktok') {
    // TikTok Username format for profile embed
    const username = url.split('@')[1]?.split('/')[0] || 'brianjordanalvarez';
    return (
      <Box sx={{ 
        width: 'fit-content',
        maxWidth: '100%',
        mx: 'auto',
        overflow: 'hidden', 
        borderRadius: '12px', // Slightly larger radius for the hug 
        bgcolor: '#ffffff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)', 
        border: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'center',
        p: 1 // Minimal padding
      }}>
        <Box sx={{ 
          width: '325px', // Fixed width for standard TikTok profile card
          // The embed script will fill this width
          '& .tiktok-embed': {
            margin: '0 !important',
          }
        }}>
          <blockquote 
            className="tiktok-embed" 
            cite={`https://www.tiktok.com/@${username}`} 
            data-unique-id={username} 
            data-embed-type="creator" 
            style={{ width: '100%', margin: 0 }}
          >
            <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </section>
          </blockquote>
        </Box>
      </Box>
    );
  }

  if (type === 'instagram') {
    return (
      <Box sx={{ 
        width: 'fit-content',
        maxWidth: '100%',
        mx: 'auto',
        borderRadius: '12px', 
        bgcolor: '#ffffff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)', 
        border: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <iframe
          src={`${url}embed`}
          width="400"
          height="600"
          frameBorder="0"
          scrolling="no"
          allowtransparency="true"
          title="Instagram Feed"
          style={{ border: 'none', maxWidth: '100%' }}
        />
      </Box>
    );
  }

  if (type === 'youtube') {
    return (
      <Box sx={{ 
        width: '100%',
        maxWidth: '800px', // Max width for video player
        aspectRatio: '16/9', // Force video aspect ratio container
        mx: 'auto',
        borderRadius: '12px', 
        bgcolor: '#ffffff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)', 
        border: '1px solid', 
        borderColor: 'divider',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }}>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Youtube size={18} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>YouTube Channel</Typography>
          </Box>
        </Box>

        <iframe
          src={`${url}`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video"
          style={{ border: 'none', flexGrow: 1 }}
        />
      </Box>
    );
  }

  return null;
};

export default SocialFeed;
