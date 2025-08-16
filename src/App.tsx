import React, { useState } from 'react';
import { Building } from 'lucide-react';
import Navigation from './components/Navigation';
import RegistrationForm from './components/RegistrationForm';
import PetGallery from './components/PetGallery';
import MyPetsView from './components/MyPetsView';
import AuthForm from './components/AuthForm';
import UserHeader from './components/UserHeader';
import MessageModal from './components/MessageModal';
import ErrorBoundary from './components/ErrorBoundary';
import { databaseService } from './services/database';
import { authService } from './services/auth';
import { supabase } from './lib/supabase';
import { Pet, Resident, FormData, User } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [pets, setPets] = useState<Pet[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [messageModal, setMessageModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Check authentication status on mount
  React.useEffect(() => {
    checkAuthStatus();
    
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        loadUserResident(user.id);
      } else {
        setResident(null);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        await loadUserResident(currentUser.id);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadUserResident = async (userId: string) => {
    try {
      const userResident = await databaseService.getUserResident(userId);
      setResident(userResident);
    } catch (error) {
      console.error('Erro ao carregar dados do morador:', error);
    }
  };

  const showMessage = (title: string, message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setMessageModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Load pets on component mount and when user changes
  React.useEffect(() => {
    if (user) {
      loadPets();
    }
  }, [user]);

  // Recarregar pets quando mudar para a aba de pets
  React.useEffect(() => {
    if (user && activeTab === 'pets') {
      loadPets();
    }
  }, [user, activeTab]);

  const loadPets = async () => {
    try {
      setLoading(true);
      if (user) {
        // Carregar pets do usuário logado
        const petsData = await databaseService.getUserPets(user.id);
        setPets(petsData);
      } else {
        // Carregar todos os pets (para a galeria)
        const petsData = await databaseService.getPets();
        setPets(petsData);
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      showMessage('Erro ao Carregar Pets', 'Erro ao carregar pets. Verifique sua conexão.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await authService.signIn(email, password);
      setUser(user);
      await loadUserResident(user.id);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const user = await authService.signUp(email, password);
      setUser(user);
      // Sucesso no cadastro - o usuário será redirecionado automaticamente
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setResident(null);
      setPets([]);
      setActiveTab('register');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const handleRegistration = async (data: FormData) => {
    if (!user) {
      showMessage('Acesso Negado', 'Você precisa estar logado para cadastrar pets.', 'error');
      return;
    }

    // Verificar se o email foi confirmado
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser && !currentUser.email_confirmed_at) {
        showMessage('E-mail Não Confirmado', 'Por favor, confirme seu e-mail antes de cadastrar pets. Verifique sua caixa de entrada e spam.', 'error');
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar confirmação de email:', error);
    }

    try {
      setLoading(true);
      
      let currentResident = resident;
      let pet: Pet;

      if (!currentResident) {
        // First time registration - create resident and pet
        const result = await databaseService.registerPetWithResident(data, user.id);
        currentResident = result.resident;
        pet = result.pet;
        setResident(currentResident);
      } else {
        // Add pet to existing resident
        pet = await databaseService.addPetToExistingResident(data.pet, currentResident);
      }
      
      // Update local state
      setPets(prev => [pet, ...prev]);
      
      // Recarregar pets para garantir sincronização
      await loadPets();
      
      // Show success message
      showMessage('Pet Cadastrado com Sucesso!', 'Pet cadastrado com sucesso!', 'success');
      setActiveTab('pets');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      showMessage('Erro ao Cadastrar Pet', 'Erro ao cadastrar pet. Tente novamente.', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="text-gray-700">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <AuthForm onLogin={handleLogin} onSignUp={handleSignUp} />
      </ErrorBoundary>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'register':
        return <RegistrationForm onSubmit={handleRegistration} existingResident={resident} />;
      case 'pets':
        return <PetGallery pets={pets} loading={loading} />;
      case 'my-pets':
        return <MyPetsView userId={user.id} onSwitchToRegister={() => setActiveTab('register')} />;
      default:
        return <RegistrationForm onSubmit={handleRegistration} existingResident={resident} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 relative">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <span className="text-gray-700">Carregando...</span>
            </div>
          </div>
        )}
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-gray-700 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    PetCondo
                  </h1>
                  <p className="text-sm text-gray-500">
                    Cadastro de Pets do Condomínio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <UserHeader userEmail={user.email} onLogout={handleLogout} />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="py-8">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                © 2025 PetCondo. Sistema de cadastro de pets para condomínio.
              </p>
            </div>
          </div>
        </footer>

        {/* Message Modal */}
        <MessageModal
          isOpen={messageModal.isOpen}
          onClose={() => setMessageModal(prev => ({ ...prev, isOpen: false }))}
          title={messageModal.title}
          message={messageModal.message}
          type={messageModal.type}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;