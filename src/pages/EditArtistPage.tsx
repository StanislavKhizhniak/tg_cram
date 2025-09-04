import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import ArtistForm from '../components/ArtistForm';
import { Artist, CreateArtistData } from '../types/artist';
import { artistService } from '../services/supabase';

const EditArtistPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadArtist(id);
    }
  }, [id]);

  const loadArtist = async (artistId: string) => {
    try {
      const data = await artistService.getArtistById(artistId);
      if (data) {
        setArtist(data);
      } else {
        setError('Артист не найден');
      }
    } catch (error) {
      console.error('Ошибка при загрузке артиста:', error);
      setError('Ошибка при загрузке артиста');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateArtistData): Promise<boolean> => {
    if (!id) return false;
    
    try {
      const updatedArtist = await artistService.updateArtist(id, data);
      if (updatedArtist) {
        alert('Артист успешно обновлен!');
        navigate('/');
        return true;
      } else {
        alert('Ошибка при обновлении артиста');
        return false;
      }
    } catch (error) {
      console.error('Ошибка при обновлении артиста:', error);
      alert('Ошибка при обновлении артиста');
      return false;
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Загрузка артиста...
        </Typography>
      </Container>
    );
  }

  if (error || !artist) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Артист не найден'}
        </Alert>
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            Не удалось загрузить артиста
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Возможно, артист был удален или произошла ошибка
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1">
          Редактировать артиста
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Измените данные артиста и сохраните изменения
        </Typography>
      </Box>

      <ArtistForm
        artist={artist}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default EditArtistPage;
