import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';
import ErrorModal from './ErrorModal';
import SuccessModal from './SuccessModal';

interface AuthFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onSignUp }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null);

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onSignUp(email, password);
        setSuccess({
          title: 'Conta Criada com Sucesso!',
          message: 'Sua conta foi criada com sucesso! Agora você pode cadastrar seus pets.'
        });
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      
      // Definir mensagens de erro específicas baseadas no tipo de erro
      let errorTitle = 'Erro de Autenticação';
      let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';

      if (error?.message) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid login credentials')) {
          errorTitle = 'Credenciais Inválidas';
          errorMessage = 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.';
        } else if (error.message.includes('Email not confirmed')) {
          errorTitle = 'E-mail Não Confirmado';
          errorMessage = 'Por favor, confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada e spam.';
        } else if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          errorTitle = 'Usuário Já Cadastrado';
          errorMessage = 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.';
        } else if (error.message.includes('Password should be at least') || error.message.includes('Password')) {
          errorTitle = 'Senha Muito Curta';
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (error.message.includes('Unable to validate email address') || error.message.includes('Invalid email')) {
          errorTitle = 'E-mail Inválido';
          errorMessage = 'Por favor, insira um endereço de e-mail válido.';
        } else if (error.message.includes('Too many requests')) {
          errorTitle = 'Muitas Tentativas';
          errorMessage = 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
        } else if (error.message.includes('Network')) {
          errorTitle = 'Erro de Conexão';
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        }
      }

      setError({ title: errorTitle, message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? 'Acesse seus pets cadastrados' : 'Cadastre-se para gerenciar seus pets'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                    placeholder="Sua senha"
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Entrando...' : 'Criando conta...'}
                  </div>
                ) : (
                  <>
                    {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                    {isLogin ? 'Entrar' : 'Criar conta'}
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={!!error}
        onClose={handleCloseError}
        title={error?.title || ''}
        message={error?.message || ''}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={!!success}
        onClose={handleCloseSuccess}
        title={success?.title || ''}
        message={success?.message || ''}
      />
    </>
  );
};

export default AuthForm;