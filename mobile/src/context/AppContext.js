import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext({});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [initialSplashCompleted, setInitialSplashCompleted] = useState(false);
  const [introductionCompleted, setIntroductionCompleted] = useState(false);

  const completeInitialSplash = () => {
    setInitialSplashCompleted(true);
  };

  const completeIntroduction = () => {
    setIntroductionCompleted(true);
  };

  const value = {
    initialSplashCompleted,
    introductionCompleted,
    completeInitialSplash,
    completeIntroduction,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
