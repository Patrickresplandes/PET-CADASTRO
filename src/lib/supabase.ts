import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  console.error('📝 Verifique se você criou um arquivo .env com as seguintes variáveis:');
  console.error('   VITE_SUPABASE_URL=sua_url_do_supabase');
  console.error('   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase');
  console.error('🔗 Obtenha essas informações em: https://supabase.com/dashboard');
  throw new Error('Missing Supabase environment variables. Check console for details.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);