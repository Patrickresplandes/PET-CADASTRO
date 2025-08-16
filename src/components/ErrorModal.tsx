import React from 'react';


interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  allowSignUp?: boolean; 
  onSignUp?: () => void; 
}

const ErrorModal: React.FC<ErrorModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message,
  allowSignUp = false, 
  onSignUp 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
          >
            Fechar
          </button>

          {allowSignUp && onSignUp && ( // 👈 só aparece quando pode cadastrar
            <button
              onClick={onSignUp}
              className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors"
            >
              Criar Conta
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
