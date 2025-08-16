import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Pet } from '../types';
import PetCard from './PetCard';

interface PetGalleryProps {
  pets: Pet[];
  loading?: boolean;
}

const PetGallery: React.FC<PetGalleryProps> = ({ pets, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');

  const species = useMemo(() => {
    const uniqueSpecies = [...new Set(pets.map(pet => pet.species))];
    return uniqueSpecies.sort();
  }, [pets]);

  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.residentApartment.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecies = selectedSpecies === '' || pet.species === selectedSpecies;
      
      return matchesSearch && matchesSpecies;
    });
  }, [pets, searchTerm, selectedSpecies]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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

  if (pets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum pet cadastrado
          </h3>
          <p className="text-gray-500">
            Seja o primeiro a cadastrar um pet no condomínio!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome do pet, raça, morador ou apartamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors appearance-none bg-white"
          >
            <option value="">Todas as espécies</option>
            {species.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">
          {filteredPets.length} {filteredPets.length === 1 ? 'pet encontrado' : 'pets encontrados'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPets.map(pet => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>

      {filteredPets.length === 0 && pets.length > 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum pet encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar os filtros de busca
          </p>
        </div>
      )}
    </div>
  );
};

export default PetGallery;