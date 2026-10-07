import axios from 'axios';
import { DEFAULT_API_URL } from '../constants/config';

export let currentBaseUrl = DEFAULT_API_URL;

export const api = axios.create({
  baseURL: currentBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para actualizar dinámicamente la BaseURL desde la pantalla settings.tsx
export const updateApiBaseUrl = (newUrl: string) => {
  currentBaseUrl = newUrl.trim();
  api.defaults.baseURL = currentBaseUrl;
};