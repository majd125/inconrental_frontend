'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextProps {
  showNotification: (message: string, type?: 'error' | 'success' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' | 'info'; id: number } | null>(null);

  const showNotification = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-right-8 fade-in duration-300">
          <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
            notification.type === 'error' ? 'bg-red-500 text-white border-red-500/20' :
            notification.type === 'success' ? 'bg-green-500 text-white border-green-500/20' :
            'bg-blue-500 text-white border-blue-500/20'
          }`}>
            <span className="material-symbols-outlined shrink-0 text-xl font-bold">
              {notification.type === 'error' ? 'error' : notification.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <p className="font-bold text-sm tracking-wide bg-black/10 px-2 py-0.5 rounded backdrop-blur-md">
              {notification.message}
            </p>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 transition-opacity">
              <span className="material-symbols-outlined text-sm font-bold">close</span>
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
