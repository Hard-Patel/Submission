import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { login } from '../services/api';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { useAppDispatch } from '../store';

interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins: number;
}

export const useLogin = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const tryLogin = async (credentials: LoginCredentials, onSuccess: () => void) => {
    try {
      dispatch(loginStart());
      setIsLoggingIn(true);
      const response = await login(credentials);
      dispatch(loginSuccess(response));
      onSuccess();
    } catch (error) {
      console.error('Login failed:', error);
      dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  return {
    tryLogin,
    isLoggingIn,
  };
}; 