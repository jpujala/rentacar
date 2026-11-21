
import type {
  Car,
  CarType,
  Empresa,
  Rental
} from '../model/car.model';

import carsJson from '../../data/cars.json';
import typesJson from '../../data/car-types.json';
import empresasJson from '../../data/empresas.json';
import rentalsJson from '../../data/rentals.json';

const carsData = carsJson as Car[];
const typesData = typesJson as CarType[];
const empresasData = empresasJson as Empresa[];
const rentalsData = rentalsJson as Rental[];

const STORAGE_KEYS = {
  cars: 'rentacar-cars',
  types: 'rentacar-types',
  empresas: 'rentacar-empresas',
  rentals: 'rentacar-rentals'
};

function load<T>(key: string, initial: T): T {
  try {
    const value = localStorage.getItem(key);

    return value
      ? JSON.parse(value) as T
      : initial;
  } catch (error) {
    console.error(`Error leyendo ${key}:`, error);
    return initial;
  }
}

export const storage = {
  getCars: (): Car[] =>
    load<Car[]>(STORAGE_KEYS.cars, carsData),

  getTypes: (): CarType[] =>
    load<CarType[]>(STORAGE_KEYS.types, typesData),

  getEmpresas: (): Empresa[] =>
    load<Empresa[]>(STORAGE_KEYS.empresas, empresasData),

  getRentals: (): Rental[] =>
    load<Rental[]>(STORAGE_KEYS.rentals, rentalsData),

  saveCars: (data: Car[]): void =>
    localStorage.setItem(
      STORAGE_KEYS.cars,
      JSON.stringify(data)
    ),

  saveRentals: (data: Rental[]): void =>
    localStorage.setItem(
      STORAGE_KEYS.rentals,
      JSON.stringify(data)
    ),

  saveEmpresas: (data: Empresa[]): void =>
    localStorage.setItem(
      STORAGE_KEYS.empresas,
      JSON.stringify(data)
    )
};
