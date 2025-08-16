import React, { useState } from 'react';
import { Upload, X, User, MapPin, Phone, Mail, Heart } from 'lucide-react';
import { FormData, Resident } from '../types';
import { convertToBase64, compressImage } from '../utils/imageUtils';
import { formatPhone, unformatPhone } from '../utils/phoneMask';
import MessageModal from './MessageModal';

interface RegistrationFormProps {
  onSubmit: (data: FormData) => void;
  existingResident?: Resident | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, existingResident }) => {
  const [formData, setFormData] = useState<FormData>({
    resident: {
      name: existingResident?.name || '',
      block: existingResident?.block || '',
      apartment: existingResident?.apartment || '',
      phone: existingResident?.phone || '',
      email: existingResident?.email || ''
    },
    pet: {
      name: '',
      species: '',
      breed: '',
      age: 0,
      description: '',
      photo: ''
    }
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Update form when existingResident changes
  React.useEffect(() => {
    if (existingResident) {
      setFormData(prev => ({
        ...prev,
        resident: {
          name: existingResident.name,
          block: existingResident.block,
          apartment: existingResident.apartment,
          phone: existingResident.phone,
          email: existingResident.email
        }
      }));
    }
  }, [existingResident]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setImagePreview(compressedImage);
        setFormData(prev => ({
          ...prev,
          pet: { ...prev.pet, photo: compressedImage }
        }));
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        setMessageModal({
          isOpen: true,
          title: 'Erro ao Processar Imagem',
          message: 'Erro ao processar a imagem. Tente novamente.',
          type: 'error'
        });
      }
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      pet: { ...prev.pet, photo: '' }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        pet: { name: '', species: '', breed: '', age: 0, description: '', photo: '' }
      }));
      setImagePreview('');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const species = ['Cão', 'Gato', 'Pássaro', 'Coelho', 'Hamster', 'Peixe', 'Outro'];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {existingResident ? 'Adicionar Novo Pet' : 'Cadastro de Pet'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados do Morador */}
          {!existingResident && (
            <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Dados do Morador
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.resident.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    resident: { ...prev.resident, name: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  placeholder="Digite seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bloco
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.resident.block || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    resident: { ...prev.resident, block: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  placeholder="Ex: 1, 2, 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apartamento
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.resident.apartment || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    resident: { ...prev.resident, apartment: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  placeholder="Ex: 101, 102, 201"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.resident.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setFormData(prev => ({
                    ...prev,
                      resident: { ...prev.resident, phone: formatted }
                    }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={formData.resident.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    resident: { ...prev.resident, email: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            </div>
          )}

          {existingResident && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cadastrando para:</h3>
              <p className="text-gray-900 font-medium">{existingResident.name}</p>
              <p className="text-gray-600 text-sm">Bloco {existingResident.block}, Apartamento {existingResident.apartment}</p>
            </div>
          )}

          {/* Dados do Pet */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Dados do Pet
            </h3>

            {/* Upload de Foto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Foto do Pet
              </label>
              
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Adicionar foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Pet
                </label>
                <input
                  type="text"
                  required
                  value={formData.pet.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pet: { ...prev.pet, name: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  placeholder="Nome do seu pet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Espécie
                </label>
                <select
                  required
                  value={formData.pet.species}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pet: { ...prev.pet, species: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                >
                  <option value="">Selecione a espécie</option>
                  {species.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raça
                </label>
                <input
                  type="text"
                  required
                  value={formData.pet.breed}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pet: { ...prev.pet, breed: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  placeholder="Raça do pet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade (anos)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="30"
                  value={formData.pet.age || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pet: { ...prev.pet, age: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                  placeholder="Idade"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.pet.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pet: { ...prev.pet, description: e.target.value }
                }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-none"
                placeholder="Conte um pouco sobre seu pet, personalidade, cuidados especiais..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Cadastrando...' : (existingResident ? 'Adicionar Pet' : 'Cadastrar Pet')}
          </button>
        </form>
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal(prev => ({ ...prev, isOpen: false }))}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
      />
    </div>
  );
};

export default RegistrationForm;