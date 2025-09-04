export interface Artist {
  id: string;
  nickname: string;
  type?: string;
  instagram?: string;
  telegram?: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateArtistData {
  nickname: string;
  type?: string;
  instagram?: string;
  telegram?: string;
  email?: string;
  phone?: string;
}
