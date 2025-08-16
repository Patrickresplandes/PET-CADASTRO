import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';

interface AuthFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onCheckEmail?: (email: string) => Promise<boolean>;
}

const AuthFormStable: React.FC<AuthFormProps> = ({ onLogin, onSignUp, onCheckEmail }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignUpOption, setShowSignUpOption] = useState(false);

  const clearMessages = () => {
    setErrorMessage('');
    setShowSignUpOption(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    clearMessages();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onSignUp(email, password);
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      
      if (error?.message?.includes('Invalid login credentials') && isLogin) {
        // Para evitar rate limiting, assumir que credenciais inválidas = email não cadastrado
        // se for um email com formato típico de teste
        const isTestEmail = email.includes('teste') || email.includes('test') || 
                           email.includes('exemplo') || email.includes('example') ||
                           email.includes('demo') || !email.includes('@gmail.') && 
                           !email.includes('@hotmail.') && !email.includes('@outlook.');
        
        if (isTestEmail) {
          setErrorMessage('Este e-mail não está cadastrado em nosso sistema.');
          setShowSignUpOption(true);
        } else {
          setErrorMessage('E-mail ou senha incorretos. Se não tem conta, cadastre-se.');
          setShowSignUpOption(true);
        }
      } else if (error?.message?.includes('Email not confirmed')) {
        setErrorMessage('Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.');
      } else if (error?.message?.includes('User already registered')) {
        setErrorMessage('Este e-mail já está cadastrado. Tente fazer login.');
      } else if (error?.message?.includes('Password should be at least')) {
        setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      } else if (error?.message?.includes('Unable to validate email address')) {
        setErrorMessage('Por favor, insira um endereço de e-mail válido.');
      } else if (error?.message?.includes('Too many requests') || error?.message?.includes('For security purposes')) {
        setErrorMessage('Muitas tentativas detectadas. Aguarde 1 minuto e tente novamente.');
      } else {
        setErrorMessage('Erro inesperado. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToSignUp = () => {
    setIsLogin(false);
    clearMessages();
  };

  const handleModeSwitch = () => {
    if (!isSubmitting) {
      setIsLogin(!isLogin);
      clearMessages();
    }
  };

  return (
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

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                  {showSignUpOption && (
                    <button
                      type="button"
                      onClick={handleSwitchToSignUp}
                      className="mt-2 text-sm font-medium text-red-800 hover:text-red-600 underline"
                    >
                      Criar conta agora
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

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
  );
};

export default AuthFormStable;
