import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFirestoreCollection, useSiteConfig } from '../hooks/useFirestore';
import { useAnalytics } from '../hooks/useAnalytics';
import { CardActionArea } from '@mui/material';

const CharacterCard = ({ char }) => {
  const { trackClick } = useAnalytics();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <Card 
      ref={cardRef}
      sx={{ 
        minWidth: { xs: 280, md: 350 },
        maxWidth: { xs: 280, md: 350 },
        borderRadius: 6,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          '& .char-overlay': { opacity: 1 }
        }
      }}
    >
      <CardActionArea onClick={() => trackClick(char.id || char.name, 'characters', char.name)}>
        <Box sx={{ position: 'relative', pt: '140%' }}>
        <CardMedia
          component="img"
          image={char.image}
          alt={char.name}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box 
          className="char-overlay"
          sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            p: 3, 
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            color: 'white',
            opacity: { xs: 1, md: 0.9 },
            transition: 'opacity 0.3s ease'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>{char.name}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>{char.blurb}</Typography>
        </Box>
      </Box>
    </CardActionArea>
  </Card>
  );
};

const CharacterGallery = () => {
  const { data: characters, loading } = useFirestoreCollection('characters');
  const scrollRef = useRef(null);

  const sortedCharacters = [...characters].sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading || sortedCharacters.length === 0) return null;

  return (
    <Box sx={{ position: 'relative', py: 6, my: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4, px: { xs: 2, md: 0 } }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>The Lineup</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>Iconic characters and high-energy vibes.</Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <IconButton onClick={() => scroll('left')} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={() => scroll('right')} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Box 
        ref={scrollRef}
        sx={{ 
          display: 'flex', 
          gap: 3, 
          overflowX: 'auto', 
          pb: 4,
          px: { xs: 2, md: 0 },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollSnapType: 'x proximity'
        }}
      >
        {sortedCharacters.map((char) => (
          <Box key={char.id} sx={{ scrollSnapAlign: 'start' }}>
            <CharacterCard char={char} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CharacterGallery;
