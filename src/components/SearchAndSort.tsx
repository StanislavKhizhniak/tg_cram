import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Search } from '@mui/icons-material';

interface SearchAndSortProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const SearchAndSort: React.FC<SearchAndSortProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <TextField
        placeholder="Поиск по имени, типу или email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: <Search color="action" />
        }}
        sx={{ minWidth: 300, flexGrow: 1 }}
      />

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Сортировка</InputLabel>
        <Select
          value={sortBy}
          label="Сортировка"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <MenuItem value="nickname">По имени</MenuItem>
          <MenuItem value="type">По типу</MenuItem>
          <MenuItem value="createdAt">По дате создания</MenuItem>
          <MenuItem value="updatedAt">По дате обновления</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchAndSort;
