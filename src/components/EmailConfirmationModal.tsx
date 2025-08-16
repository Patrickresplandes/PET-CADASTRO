import React from 'react';
import { Mail, AlertCircle } from 'lucide-react';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  email 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Confirme seu E-mail</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Enviamos um link de confirmação para:
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="font-medium text-gray-900">{email}</p>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium mb-1">Importante:</p>
              <ul className="text-amber-700 space-y-1">
                <li>• Clique no link do e-mail para confirmar sua conta</li>
                <li>• Verifique também a pasta de spam/lixo</li>
                <li>• Você precisa confirmar o e-mail antes de fazer login</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationModal;
