import React from "react";

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "success";
}

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  titleColor?: string; // ex: "text-green-700"
  actions?: ActionButton[]; // botões dinâmicos
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  titleColor = "text-gray-900",
  actions = [],
}) => {
  if (!isOpen) return null;

  // mapear estilos conforme variant
  const variantClasses: Record<string, string> = {
    primary: "bg-gray-900 hover:bg-gray-800 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className={`text-xl font-bold mb-2 ${titleColor}`}>{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
          >
            Fechar
          </button>

          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg transition-colors ${
                variantClasses[action.variant || "primary"]
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
