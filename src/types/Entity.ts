export type TicketPriority = 'Alta' | 'Media' | 'Baja';
export type TicketStatus = 'Abierto' | 'En Proceso' | 'Resuelto';
export type TicketDepartment = 'Sistemas' | 'Redes' | 'Hardware' | 'Desarrollo' | 'Seguridad';

export interface Ticket {
  id: string;
  title: string;
  department: TicketDepartment;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

// Tipo para el formulario al crear un ticket (sin id ni fecha generada)
export interface CreateTicketDTO {
  title: string;
  department: TicketDepartment;
  priority: TicketPriority;
  description: string;
  imageUrl?: string;
}

// Tipo para la actualización de un ticket
export interface UpdateTicketDTO {
  title?: string;
  department?: TicketDepartment;
  priority?: TicketPriority;
  status?: TicketStatus;
  description?: string;
}