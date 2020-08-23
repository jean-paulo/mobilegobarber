import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  // Enquanto o app estiver carregando mostra icone de carregamento
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  /* Se o usuário estiver autenticado mostra as páginas da aplicação,
   se não leva pra parte de autenticação */
  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
