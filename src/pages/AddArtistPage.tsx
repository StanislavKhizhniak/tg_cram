import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Alert, Snackbar } from '@mui/material';
import ArtistForm from '../components/ArtistForm';
import type { CreateArtistData } from '../types/artist';
import { artistService } from '../services/supabase';

const AddArtistPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [addedCount, setAddedCount] = useState(0);

  const handleSubmit = async (data: CreateArtistData) => {
    try {
      const newArtist = await artistService.createArtist(data);
      if (newArtist) {
        const newCount = addedCount + 1;
        setAddedCount(newCount);
        setSuccessMessage(`Артист "${data.nickname}" успешно добавлен! (Всего: ${newCount})`);
        setShowSuccess(true);
        // Возвращаем true для очистки формы
        return true;
      } else {
        alert('Ошибка при добавлении артиста');
        return false;
      }
    } catch (error) {
      console.error('Ошибка при добавлении артиста:', error);
      alert('Ошибка при добавлении артиста');
      return false;
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1">
          Добавить нового артиста
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          После добавления артиста форма очистится для добавления следующего
        </Typography>
        {addedCount > 0 && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 'medium' }}>
            ✅ Добавлено артистов: {addedCount}
          </Typography>
        )}
      </Box>

      <ArtistForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onSuccess={() => {
          // Форма очистится автоматически в ArtistForm
        }}
      />

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddArtistPage;
