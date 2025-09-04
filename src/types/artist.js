// Типы для артистов
export const Artist = {
  id: 'string',
  nickname: 'string', // обязательное поле
  type: 'string?',
  instagram: 'string?',
  telegram: 'string?',
  email: 'string?',
  phone: 'string?',
  created_at: 'string', // Supabase использует snake_case и ISO строки
  updated_at: 'string'
};

export const CreateArtistData = {
  nickname: 'string',
  type: 'string?',
  instagram: 'string?',
  telegram: 'string?',
  email: 'string?',
  phone: 'string?'
};
