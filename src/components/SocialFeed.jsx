import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const SocialFeed = ({ type, url }) => {
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
  }, [type]);

  if (type === 'tiktok') {
    // TikTok Username format for profile embed
    const username = url.split('@')[1]?.split('/')[0] || 'brianjordanalvarez';
    return (
      <Box sx={{ width: '100%', minHeight: 700, overflow: 'hidden', borderRadius: 8, bgcolor: 'background.paper', p: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'divider' }}>
        <blockquote 
          className="tiktok-embed" 
          cite={`https://www.tiktok.com/@${username}`} 
          data-unique-id={username} 
          data-embed-type="creator" 
          style={{ maxWidth: '100%', minWidth: '325px' }}
        >
          <section>
            <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
          </section>
        </blockquote>
      </Box>
    );
  }

  if (type === 'instagram') {
    return (
      <Box sx={{ width: '100%', minHeight: 700, overflow: 'hidden', borderRadius: 8, bgcolor: 'background.paper', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'divider' }}>
        <iframe
          src={`${url}embed`}
          width="100%"
          height="700"
          frameBorder="0"
          scrolling="no"
          allowtransparency="true"
          title="Instagram Feed"
          style={{ border: 'none', borderRadius: '32px' }}
        />
      </Box>
    );
  }

  return null;
};

export default SocialFeed;
