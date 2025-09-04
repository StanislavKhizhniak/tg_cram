import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import ArtistCard from '../components/ArtistCard';
import SearchAndSort from '../components/SearchAndSort';
import { Artist } from '../types/artist';
import { artistService } from '../services/supabase';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('nickname');
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await artistService.getAllArtists();
      setArtists(data);
    } catch (error) {
      console.error('Ошибка при загрузке артистов:', error);
      if (error instanceof Error && error.message.includes('Missing Supabase environment variables')) {
        setError('Ошибка подключения к базе данных: проверьте настройки Supabase в файле .env');
      } else if (error instanceof Error && error.message.includes('fetch')) {
        setError('Ошибка сети: проверьте подключение к интернету и доступность Supabase');
      } else {
        setError(`Ошибка при загрузке артистов: ${error instanceof Error ? error.message : String(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedArtists = useMemo(() => {
    let filtered = artists.filter(artist =>
      artist.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (artist.type && artist.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (artist.email && artist.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nickname':
          return a.nickname.localeCompare(b.nickname);
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        case 'createdAt':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'updatedAt':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, sortBy, artists]);

  const handleAddArtist = () => {
    navigate('/add-artist');
  };

  const handleEditArtist = (artist: Artist) => {
    navigate(`/edit-artist/${artist.id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Загрузка артистов...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          CRM для артистов
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddArtist}
          size="large"
        >
          Добавить артиста
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <SearchAndSort
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <Box mb={3}>
        <Typography variant="body2" color="text.secondary">
          Найдено артистов: {filteredAndSortedArtists.length} из {artists.length}
        </Typography>
      </Box>

      {filteredAndSortedArtists.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? 'Артисты не найдены' : 'Артисты не добавлены'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Добавьте первого артиста'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}>
          {filteredAndSortedArtists.map((artist) => (
            <Box key={artist.id}>
              <ArtistCard
                artist={artist}
                onEdit={handleEditArtist}
              />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
