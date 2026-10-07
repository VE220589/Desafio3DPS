export const DEFAULT_API_URL = 'https://6ac6c3edbea0e72cf5c93b47.mockapi.io/api/v1';

export const DEPARTMENTS = [
  'Sistemas',
  'Redes',
  'Hardware',
  'Desarrollo',
  'Seguridad',
] as const;

export const PRIORITIES = ['Alta', 'Media', 'Baja'] as const;

export const STATUSES = ['Abierto', 'En Proceso', 'Resuelto'] as const;

// Colores de soporte técnico para el UI y los Badges
export const THEME_COLORS = {
  primary: '#0F172A',     // Azul pizarra oscuro
  accent: '#2563EB',      // Azul corporativo
  background: '#F8FAFC',  // Gris claro de fondo
  surface: '#FFFFFF',
  text: '#1E293B',
  textMuted: '#64748B',
  border: '#E2E8F0',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
};

// Colores semánticos para el estado
export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'Abierto': { bg: '#FEE2E2', text: '#DC2626' },      // Rojo suave
  'En Proceso': { bg: '#FEF3C7', text: '#D97706' },   // Ámbar suave
  'Resuelto': { bg: '#D1FAE5', text: '#059669' },     // Verde suave
};

// Colores semánticos para la prioridad
export const PRIORITY_COLORS: Record<string, string> = {
  'Alta': '#EF4444',
  'Media': '#F59E0B',
  'Baja': '#3B82F6',
};