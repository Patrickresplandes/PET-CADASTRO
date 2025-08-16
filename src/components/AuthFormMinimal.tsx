import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';

interface AuthFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onCheckEmail?: (email: string) => Promise<boolean>;
}

const AuthFormMinimal: React.FC<AuthFormProps> = ({ onLogin, onSignUp }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('error');

  const showMessage = (text: string, type: 'error' | 'success' | 'info' = 'error') => {
    setMessage(text);
    setMessageType(type);
  };

  const clearMessage = () => {
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    clearMessage();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await onLogin(email, password);
        // Se chegou aqui, login foi bem-sucedido - limpar formulário
        setEmail('');
        setPassword('');
      } else {
        await onSignUp(email, password);
        showMessage('Conta criada com sucesso! Você já está logado.', 'success');
        // Após cadastro, mudar para modo login mas manter email preenchido
        setIsLogin(true);
        setPassword('');
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Erro inesperado';
      
      if (errorMsg.includes('Invalid login credentials')) {
        showMessage(`Email "${email}" ou senha incorretos. Se não tem conta, clique em "Cadastre-se".`, 'error');

      } else if (errorMsg.includes('User already registered')) {
        showMessage(`Email "${email}" já está cadastrado. Tente fazer login.`, 'error');
        setIsLogin(true);
      } else if (errorMsg.includes('For security purposes') || errorMsg.includes('Too many requests')) {
        showMessage('Muitas tentativas. Aguarde 1 minuto e tente novamente.', 'error');
      } else {
        showMessage('Erro: ' + errorMsg, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    if (!isSubmitting) {
      setIsLogin(!isLogin);
      clearMessage();
      // Manter o email mas limpar senha
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Acesse sua conta' : 'Crie uma nova conta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearMessage(); // Limpar mensagens quando digitar
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Digite seu email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearMessage(); // Limpar mensagens quando digitar
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Sua senha"
                  minLength={6}
                />
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                messageType === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Entrando...' : 'Cadastrando...'}
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  {isLogin ? 'Entrar' : 'Cadastrar'}
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={switchMode}
              disabled={isSubmitting}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AuthFormMinimal;