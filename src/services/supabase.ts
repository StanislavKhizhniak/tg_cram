import { createClient } from '@supabase/supabase-js';
import type { Artist, CreateArtistData } from '../types/artist';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const artistService = {
  async getAllArtists(): Promise<Artist[]> {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Ошибка при получении артистов:', error);
      return [];
    }
  },

  async getArtistById(id: string): Promise<Artist | null> {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Ошибка при получении артиста:', error);
      return null;
    }
  },

  async createArtist(artistData: CreateArtistData): Promise<Artist | null> {
    try {
      const { data, error } = await supabase
        .from('artists')
        .insert([{
          ...artistData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Ошибка при создании артиста:', error);
      return null;
    }
  },

  async updateArtist(id: string, artistData: Partial<CreateArtistData>): Promise<Artist | null> {
    try {
      const { data, error } = await supabase
        .from('artists')
        .update({
          ...artistData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Ошибка при обновлении артиста:', error);
      return null;
    }
  },

  async deleteArtist(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Ошибка при удалении артиста:', error);
      return false;
    }
  },

  async searchArtists(query: string): Promise<Artist[]> {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .or(`nickname.ilike.%${query}%,type.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ошибка при поиске артистов:', error);
      return [];
    }
  }
};

export default artistService;
