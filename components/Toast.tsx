
import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ messages, onRemove }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      {messages.map((m) => (
        <ToastItem key={m.id} message={m} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ message: ToastMessage; onRemove: (id: string) => void }> = ({ message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(message.id), 4000);
    return () => clearTimeout(timer);
  }, []);

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blueprint/10 text-blueprint border-blueprint/20'
  };

  return (
    <div className={`pointer-events-auto sketch-border px-6 py-4 flex items-center gap-3 animate-in slide-in-from-right-8 duration-300 sketch-shadow ${styles[message.type]}`}>
      <span className="font-sketch font-bold uppercase tracking-widest text-xs">{message.text}</span>
      <button onClick={() => onRemove(message.id)} className="opacity-40 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};
