import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Fab, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar,
  Fade,
  CircularProgress
} from '@mui/material';
import { MessageCircle, Send, X } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'model', text: "I love you, and I'm so happy you're here! I'm BrianBot (the AI version with similar energy). What's on your mind?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, streamingText, isOpen]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);
    setStreamingText('');

    try {
      // Use the newly added rewrite
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            message: currentMessage,
            history: chatHistory
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      setIsLoading(false); // Stop showing the "thinking" indicator as soon as streaming starts

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setStreamingText(accumulatedText);
      }

      setChatHistory(prev => [...prev, { role: 'model', text: accumulatedText }]);
      setStreamingText('');
    } catch (error) {
      console.error("Chat Error:", error);
      setChatHistory(prev => [...prev, { 
        role: 'model', 
        text: "Wait, I just had a total Darlise moment...Can you try again, Queen?" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Fab 
        color="primary" 
        aria-label="chat" 
        onClick={() => setIsOpen(!isOpen)}
        sx={{ 
          position: 'fixed', 
          bottom: 32, 
          right: 32, 
          zIndex: 2000,
          boxShadow: '0 8px 32px rgba(255, 20, 147, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1) rotate(5deg)',
          }
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Fab>

      <Fade in={isOpen}>
        <Paper 
          elevation={24}
          sx={{ 
            position: 'fixed', 
            bottom: 100, 
            right: 32, 
            width: { xs: 'calc(100% - 64px)', sm: 400 },
            height: 500, 
            zIndex: 2000,
            borderRadius: 6,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 800 }}>B</Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1 }}>BrianBot</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Radically Affirming You</Typography>
            </Box>
          </Box>

          <Box 
            ref={scrollRef}
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 10 }
            }}
          >
            {chatHistory.map((chat, index) => (
              <Box 
                key={index}
                sx={{ 
                  alignSelf: chat.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5
                }}
              >
                <Paper 
                  sx={{ 
                    p: 2, 
                    borderRadius: chat.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    bgcolor: chat.role === 'user' ? 'primary.main' : 'white',
                    color: chat.role === 'user' ? 'white' : 'text.primary',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: chat.role === 'model' ? '1px solid' : 'none',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2">{chat.text}</Typography>
                </Paper>
                <Typography variant="caption" sx={{ px: 1, color: 'text.secondary', alignSelf: chat.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {chat.role === 'user' ? 'You' : 'BrianBot'}
                </Typography>
              </Box>
            ))}
            
            {streamingText && (
              <Box sx={{ alignSelf: 'flex-start', maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Paper sx={{ p: 2, borderRadius: '20px 20px 20px 4px', bgcolor: 'white', color: 'text.primary', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2">{streamingText}</Typography>
                </Paper>
                <Typography variant="caption" sx={{ px: 1, color: 'text.secondary' }}>BrianBot</Typography>
              </Box>
            )}

            {isLoading && !streamingText && (
              <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                <CircularProgress size={16} color="primary" />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Brian is thinking...</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Talk to Brian..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 100 } }}
              />
              <IconButton 
                color="primary" 
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  '&:hover': { bgcolor: 'primary.dark' }, 
                  '&.Mui-disabled': { bgcolor: 'divider' } 
                }}
              >
                <Send size={18} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default ChatBot;
