import React, { useState, useEffect } from 'react';
import { Plus, Heart } from 'lucide-react';
import { Pet, Resident } from '../types';
import PetCard from './PetCard';
import { databaseService } from '../services/database';

interface MyPetsViewProps {
  userId: string;
  onSwitchToRegister: () => void;
}

const MyPetsView: React.FC<MyPetsViewProps> = ({ userId, onSwitchToRegister }) => {
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [userResident, userPets] = await Promise.all([
        databaseService.getUserResident(userId),
        databaseService.getUserPets(userId)
      ]);
      
      setResident(userResident);
      setMyPets(userPets);
    } catch (error) {
      // Erro silencioso no carregamento de dados
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Heart className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Você ainda não se cadastrou
          </h3>
          <p className="text-gray-500 mb-6">
            Para ver seus pets, primeiro você precisa se cadastrar como morador
          </p>
          <button
            onClick={onSwitchToRegister}
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Fazer Cadastro
          </button>
        </div>
      </div>
    );
  }

  if (myPets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Olá, {resident.name}!
          </h2>
          <p className="text-gray-600">
            Apartamento {resident.apartment}
          </p>
        </div>

        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Heart className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Você ainda não cadastrou nenhum pet
          </h3>
          <p className="text-gray-500 mb-6">
            Cadastre seu primeiro pet para começar
          </p>
          <button
            onClick={onSwitchToRegister}
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Pet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Meus Pets
            </h2>
            <p className="text-gray-600">
              {resident.name} - Apartamento {resident.apartment}
            </p>
          </div>
          <button
            onClick={onSwitchToRegister}
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Pet
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">
          {myPets.length} {myPets.length === 1 ? 'pet cadastrado' : 'pets cadastrados'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myPets.map(pet => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default MyPetsView;