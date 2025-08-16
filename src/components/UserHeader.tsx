import React from 'react';
import { LogOut, User } from 'lucide-react';

interface UserHeaderProps {
  userEmail: string;
  onLogout: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ userEmail, onLogout }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>Logado como: {userEmail}</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default UserHeader;