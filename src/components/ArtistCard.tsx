import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Edit, Instagram, Telegram, Email, Phone } from '@mui/icons-material';
import { Artist } from '../types/artist';

interface ArtistCardProps {
  artist: Artist;
  onEdit: (artist: Artist) => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onEdit }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h3" gutterBottom>
            {artist.nickname}
          </Typography>
          <Tooltip title="Редактировать">
            <IconButton
              size="small"
              onClick={() => onEdit(artist)}
              sx={{ ml: 1 }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {artist.type && (
          <Box mb={2}>
            <Chip
              label={artist.type}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        <Box display="flex" flexDirection="column" gap={1}>
          {artist.instagram && (
            <Box display="flex" alignItems="center" gap={1}>
              <Instagram color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {artist.instagram}
              </Typography>
            </Box>
          )}

          {artist.telegram && (
            <Box display="flex" alignItems="center" gap={1}>
              <Telegram color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {artist.telegram}
              </Typography>
            </Box>
          )}

          {artist.email && (
            <Box display="flex" alignItems="center" gap={1}>
              <Email color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {artist.email}
              </Typography>
            </Box>
          )}

          {artist.phone && (
            <Box display="flex" alignItems="center" gap={1}>
              <Phone color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {artist.phone}
              </Typography>
            </Box>
          )}
        </Box>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            Создан: {formatDate(new Date(artist.created_at))}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Обновлен: {formatDate(new Date(artist.updated_at))}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
