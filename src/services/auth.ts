import { supabase } from '../lib/supabase';
import { User } from '../types';

export const authService = {
  async signUp(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('Falha ao criar usuário');

    // Se o usuário foi criado mas precisa confirmar e-mail, vamos fazer login diretamente
    if (data.user && !data.user.email_confirmed_at) {
      // Tentar fazer login imediatamente após o cadastro
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        // Se não conseguir fazer login, retornar o usuário criado mesmo assim
        console.warn('Usuário criado mas não foi possível fazer login automático:', signInError);
      } else if (signInData.user) {
        return {
          id: signInData.user.id,
          email: signInData.user.email!
        };
      }
    }

    return {
      id: data.user.id,
      email: data.user.email!
    };
  },

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('Falha ao fazer login');

    return {
      id: data.user.id,
      email: data.user.email!
    };
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!
    };
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!
        });
      } else {
        callback(null);
      }
    });
  }
};