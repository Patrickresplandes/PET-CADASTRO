import { supabase } from '../lib/supabase';
import { User } from '../types';

export const authService = {
  async signUp(email: string, password: string): Promise<{ user: User; needsConfirmation: boolean }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          app_name: 'PET-CADASTRO'
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('Falha ao criar usuário');

    const user: User = {
      id: data.user.id,
      email: data.user.email!
    };

    // Verificar se o email precisa ser confirmado
    const needsConfirmation = !data.user.email_confirmed_at;

    if (needsConfirmation) {
      // Não tentar fazer login automático se precisa confirmar email
      return { user, needsConfirmation: true };
    }

    // Se o email já está confirmado, tentar fazer login automático
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!signInError && signInData.user) {
        return {
          user: {
            id: signInData.user.id,
            email: signInData.user.email!
          },
          needsConfirmation: false
        };
      }
    } catch (loginError) {
      console.warn('Erro no login automático após cadastro:', loginError);
    }

    return { user, needsConfirmation };
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

  async checkEmailExists(email: string): Promise<boolean> {
    // Estratégia simples: sempre retornar false para emails não cadastrados
    // Vamos verificar isso baseado no erro de login real
    // Por enquanto, retornar true (conservativo) para evitar rate limiting
    return true;
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