import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';
import ErrorModal from './ErrorModal';
import SuccessModal from './SuccessModal';

interface AuthFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onCheckEmail?: (email: string) => Promise<boolean>;
}

const AuthFormSimple: React.FC<AuthFormProps> = ({ onLogin, onSignUp, onCheckEmail }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [allowSignUp, setAllowSignUp] = useState(false);
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null);

  const resetStates = () => {
    setError(null);
    setSuccess(null);
    setAllowSignUp(false);
  };

  const handleModeSwitch = () => {
    if (!isSubmitting) {
      setIsLogin(!isLogin);
      resetStates();
    }
  };

  const handleModalSignUp = () => {
    setIsLogin(false);
    resetStates();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    resetStates();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onSignUp(email, password);
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error);

      let errorTitle = 'Erro de Autenticação';
      let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
      let shouldAllowSignUp = false;

      if (error?.message) {
        if (error.message.includes('Invalid login credentials')) {
          if (isLogin && onCheckEmail) {
            try {
              const emailExists = await onCheckEmail(email);
              if (!emailExists) {
                errorTitle = 'E-mail não cadastrado';
                errorMessage = 'Este e-mail não está registrado em nosso sistema. Deseja criar uma conta?';
                shouldAllowSignUp = true;
              } else {
                errorTitle = 'Senha Incorreta';
                errorMessage = 'A senha está incorreta. Verifique e tente novamente.';
              }
            } catch (checkError) {
              errorTitle = 'Credenciais Inválidas';
              errorMessage = 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.';
            }
          } else {
            errorTitle = 'Credenciais Inválidas';
            errorMessage = 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.';
          }
        } else if (error.message.includes('Email not confirmed')) {
          errorTitle = 'E-mail Não Confirmado';
          errorMessage = 'Tente fazer login novamente. Se o problema persistir, entre em contato com o suporte.';
        } else if (error.message.includes('User already registered')) {
          errorTitle = 'Usuário Já Cadastrado';
          errorMessage = 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.';
        } else if (error.message.includes('Password should be at least')) {
          errorTitle = 'Senha Muito Curta';
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (error.message.includes('Unable to validate email address')) {
          errorTitle = 'E-mail Inválido';
          errorMessage = 'Por favor, insira um endereço de e-mail válido.';
        } else if (error.message.includes('Too many requests')) {
          errorTitle = 'Muitas Tentativas';
          errorMessage = 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
        } else if (error.message.includes('Network')) {
          errorTitle = 'Erro de Conexão';
          errorMessage = 'Erro de conexão com o servidor. Verifique sua internet e tente novamente.';
        }
      }

      setError({ title: errorTitle, message: errorMessage });
      setAllowSignUp(shouldAllowSignUp);
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
                onClick={handleModeSwitch}
                disabled={isSubmitting}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <ErrorModal
          isOpen={true}
          onClose={() => setError(null)}
          title={error.title}
          message={error.message}
          allowSignUp={allowSignUp}
          onSignUp={handleModalSignUp}
        />
      )}

      {success && (
        <SuccessModal
          isOpen={true}
          onClose={() => setSuccess(null)}
          title={success.title}
          message={success.message}
        />
      )}
    </>
  );
};

export default AuthFormSimple;
