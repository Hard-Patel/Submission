import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com', // Replace with your actual API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins: number;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}; 