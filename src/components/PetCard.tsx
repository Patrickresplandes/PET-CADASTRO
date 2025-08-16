import React from 'react';
import { MapPin, Calendar, Heart } from 'lucide-react';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="aspect-square overflow-hidden bg-gray-100">
        {pet.photo ? (
          <img
            src={pet.photo}
            alt={pet.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-16 h-16 text-gray-300" />
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {pet.species}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          {pet.breed} • {pet.age} {pet.age === 1 ? 'ano' : 'anos'}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{pet.residentName} - Bloco {pet.residentBlock}, Apt {pet.residentApartment}</span>
        </div>
        
        {pet.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {pet.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(pet.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;