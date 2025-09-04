import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Save } from '@mui/icons-material';
import type { Artist, CreateArtistData } from '../types/artist';

interface ArtistFormProps {
  artist?: Artist;
  onSubmit: (data: CreateArtistData) => Promise<boolean>;
  onCancel: () => void;
  onSuccess?: () => void;
}

const ArtistForm: React.FC<ArtistFormProps> = ({
  artist,
  onSubmit,
  onCancel,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CreateArtistData>({
    nickname: '',
    type: '',
    instagram: '',
    telegram: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<CreateArtistData>>({});
  const isEditing = !!artist;

  useEffect(() => {
    if (artist) {
      setFormData({
        nickname: artist.nickname,
        type: artist.type || '',
        instagram: artist.instagram || '',
        telegram: artist.telegram || '',
        email: artist.email || '',
        phone: artist.phone || ''
      });
    }
  }, [artist]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateArtistData> = {};

    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Никнейм обязателен';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (formData.phone && !/^[+]?[1-9]\d{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setFormData({
      nickname: '',
      type: '',
      instagram: '',
      telegram: '',
      email: '',
      phone: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const success = await onSubmit(formData);
        if (success) {
          clearForm();
          onSuccess?.();
        }
      } catch (error) {
        console.error('Ошибка при отправке формы:', error);
      }
    }
  };

  const handleChange = (field: keyof CreateArtistData, value: string) => {
    setFormData((prev: CreateArtistData) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: Partial<CreateArtistData>) => ({ ...prev, [field]: undefined }));
    }
  };



  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditing ? 'Редактировать артиста' : 'Добавить нового артиста'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {isEditing ? 'Измените данные артиста' : 'Заполните информацию о новом артисте'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gap: 3 }}>
          <TextField
            fullWidth
            label="Никнейм *"
            value={formData.nickname}
            onChange={(e) => handleChange('nickname', e.target.value)}
            error={!!errors.nickname}
            helperText={errors.nickname}
            required
          />

          <TextField
            fullWidth
            label="Тайп"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              fullWidth
              label="Instagram"
              value={formData.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="@username"
            />
            <TextField
              fullWidth
              label="Telegram"
              value={formData.telegram}
              onChange={(e) => handleChange('telegram', e.target.value)}
              placeholder="@username"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Телефон"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="+7 (999) 123-45-67"
            />
          </Box>

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={onCancel}>
              Отмена
            </Button>
            {!isEditing && (
              <Button 
                variant="outlined" 
                onClick={clearForm}
                sx={{ minWidth: '120px' }}
              >
                Очистить
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
            >
              {isEditing ? 'Сохранить' : 'Добавить'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default ArtistForm;
