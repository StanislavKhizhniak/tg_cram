import { createClient } from '@supabase/supabase-js';
import type { Artist, CreateArtistData } from '../types/artist';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;
let artistService: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables - using mock data');
  // В production используем mock данные вместо падения
  if (import.meta.env.PROD) {
    artistService = createMockService();
  } else {
    throw new Error('Missing Supabase environment variables');
  }
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  artistService = {

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
}

export { artistService };
export default artistService;

// Mock сервис для production без переменных окружения
function createMockService() {
  const mockArtists: Artist[] = [
    {
      id: '1',
      nickname: 'Demo Artist 1',
      type: 'Музыкант',
      instagram: '@demo1',
      telegram: '@demo1_tg',
      email: 'demo1@example.com',
      phone: '+7 (999) 111-11-11',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      nickname: 'Demo Artist 2',
      type: 'Художник',
      instagram: '@demo2',
      telegram: '@demo2_tg',
      email: 'demo2@example.com',
      phone: '+7 (999) 222-22-22',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return {
    async getAllArtists(): Promise<Artist[]> {
      console.log('Using mock data - no Supabase connection');
      return mockArtists;
    },

    async getArtistById(id: string): Promise<Artist | null> {
      return mockArtists.find(a => a.id === id) || null;
    },

    async createArtist(artistData: CreateArtistData): Promise<Artist | null> {
      const newArtist: Artist = {
        id: Date.now().toString(),
        ...artistData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockArtists.unshift(newArtist);
      return newArtist;
    },

    async updateArtist(id: string, artistData: Partial<CreateArtistData>): Promise<Artist | null> {
      const index = mockArtists.findIndex(a => a.id === id);
      if (index === -1) return null;
      
      mockArtists[index] = {
        ...mockArtists[index],
        ...artistData,
        updated_at: new Date().toISOString()
      };
      return mockArtists[index];
    },

    async deleteArtist(id: string): Promise<boolean> {
      const index = mockArtists.findIndex(a => a.id === id);
      if (index === -1) return false;
      
      mockArtists.splice(index, 1);
      return true;
    },

    async searchArtists(query: string): Promise<Artist[]> {
      const lowerQuery = query.toLowerCase();
      return mockArtists.filter(a => 
        a.nickname.toLowerCase().includes(lowerQuery) ||
        (a.type && a.type.toLowerCase().includes(lowerQuery)) ||
        (a.email && a.email.toLowerCase().includes(lowerQuery))
      );
    }
  };
}
