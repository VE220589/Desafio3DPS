// src/services/resourceService.ts
import { api } from './api';
import { Ticket, CreateTicketDTO, UpdateTicketDTO } from '../types/Entity';

const RESOURCE_PATH = '/tickets';

export const resourceService = {
  // GET: Obtener todos los tickets
  getTickets: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>(RESOURCE_PATH);
    return response.data;
  },

  // GET por ID: Obtener detalle de un ticket
  getTicketById: async (id: string): Promise<Ticket> => {
    const response = await api.get<Ticket>(`${RESOURCE_PATH}/${id}`);
    return response.data;
  },

  // POST: Crear un nuevo ticket
  createTicket: async (ticketData: CreateTicketDTO): Promise<Ticket> => {
    const payload: Partial<Ticket> = {
      ...ticketData,
      status: 'Abierto', // Estado inicial por defecto
      createdAt: new Date().toISOString(),
      imageUrl: ticketData.imageUrl?.trim() || 'https://i.postimg.cc/ZqDTYLYH/defaultimagehelpdesk.jpg',
    };
    const response = await api.post<Ticket>(RESOURCE_PATH, payload);
    return response.data;
  },

  // PUT / PATCH: Actualizar estado u observaciones del ticket
  updateTicket: async (id: string, updateData: UpdateTicketDTO): Promise<Ticket> => {
    const response = await api.put<Ticket>(`${RESOURCE_PATH}/${id}`, updateData);
    return response.data;
  },

  // DELETE: Eliminar o anular ticket
  deleteTicket: async (id: string): Promise<Ticket> => {
    const response = await api.delete<Ticket>(`${RESOURCE_PATH}/${id}`);
    return response.data;
  },
};