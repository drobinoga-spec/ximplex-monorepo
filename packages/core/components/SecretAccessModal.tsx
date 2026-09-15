'use client';

import React from 'react';

interface SecretAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  errorMessage: string;
  passwordInput: string;
  onPasswordChange: (value: string) => void;
  isLoading?: boolean;
}

const modalStyles = `
  .secret-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .secret-modal-content {
    background-color: #3a3a3a;
    padding: 2.5rem;
    border-radius: 8px;
    border: 1px solid #555555;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .secret-modal-content h3 {
    color: #ffffff;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .secret-modal-content input {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #555555;
    border-radius: 4px;
    background-color: #2d2d2d;
    color: #ffffff;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .secret-modal-content input::placeholder {
    color: #999999;
  }

  .secret-modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .secret-modal-btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    flex: 1;
  }

  .secret-modal-btn-submit {
    background: linear-gradient(135deg, #c9845c 0%, #d9945c 100%);
    color: white;
  }

  .secret-modal-btn-submit:hover:not(:disabled) {
    background: linear-gradient(135deg, #d9945c 0%, #e9a46c 100%);
    transform: translateY(-2px);
  }

  .secret-modal-btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .secret-modal-btn-cancel {
    background-color: #555555;
    color: white;
  }

  .secret-modal-btn-cancel:hover:not(:disabled) {
    background-color: #666666;
  }

  .secret-modal-btn-cancel:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .secret-modal-error {
    color: #ff6b6b;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
`;

export function SecretAccessModal({
  isOpen,
  onClose,
  onSubmit,
  errorMessage,
  passwordInput,
  onPasswordChange,
  isLoading = false,
}: SecretAccessModalProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onSubmit(passwordInput);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{modalStyles}</style>
      <div 
        className="secret-modal-overlay" 
        onClick={onClose}
        role="presentation"
      >
        <div 
          className="secret-modal-content" 
          onClick={(e) => e.stopPropagation()}
        >
          <h3>Acceso Especial</h3>
          {errorMessage && <div className="secret-modal-error">{errorMessage}</div>}
          <input
            type="password"
            placeholder="Ingresa la contraseña"
            value={passwordInput}
            onChange={(e) => onPasswordChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            autoFocus
          />
          <div className="secret-modal-buttons">
            <button 
              className="secret-modal-btn secret-modal-btn-submit" 
              onClick={() => onSubmit(passwordInput)}
              disabled={isLoading}
            >
              {isLoading ? 'Validando...' : 'Entrar'}
            </button>
            <button 
              className="secret-modal-btn secret-modal-btn-cancel" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}