
export type CarTypeId = string;

export type CarStatus = 'reservado' | 'entregado' | 'devuelto' | 'taller';

export type RentalStatus = 'reservado' | 'entregado' | 'devuelto' | 'taller';

export const RENTAL_STATUS_OPTIONS: Array<{
  value: RentalStatus;
  label: string;
}> = [
    { value: 'reservado', label: 'Reservado' },
    { value: 'entregado', label: 'Entregado' },
    { value: 'devuelto', label: 'Devuelto' },
    { value: 'taller', label: 'Taller' }
  ];

export interface CarType {
  id: CarTypeId;
  nombre: string;
  precioDia: number;
}

export interface Car {
  id: string;
  tipo: CarTypeId;
  matricula: string;
  ocupantes: number;
  danado: boolean;
  descripcion: string;
  estado: CarStatus;
}

export interface Empresa {
  id: string;
  nombre: string;
  cif: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
}

export interface Rental {
  id: string;
  carId: string;
  empresaId: string;
  inicio: number;
  fin: number;
  estado: RentalStatus;
  observaciones?: string;
}

export interface RentalInput {
  carId: string;
  empresaId: string;
  inicio: number;
  fin: number;
  estado?: RentalStatus;
  observaciones?: string;
}
