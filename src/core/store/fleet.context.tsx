
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react';

import type {
  Car,
  CarType,
  Empresa,
  Rental,
  RentalInput
} from '../model/car.model';

import { storage } from '../api/storage';
import { datesOverlap } from '../utils/dates';

const buildRental = (input: RentalInput): Rental => ({
  ...input,
  id: crypto.randomUUID(),
  estado: input.estado ?? 'reservado'
});


interface FleetContextValue {
  cars: Car[];
  types: CarType[];
  empresas: Empresa[];
  rentals: Rental[];

  addRental: (input: RentalInput) => void;
  updateRental: (rental: Rental) => void;
  deleteRental: (id: string) => void;

  getCar: (id: string) => Car | undefined;
  getEmpresa: (id: string) => Empresa | undefined;

  isAvailable: (
    carId: string,
    inicio: number,
    fin: number,
    excludeId?: string
  ) => boolean;
}

const FleetContext = createContext<FleetContextValue | null>(null);

export function FleetProvider({ children }: { children: ReactNode }) {
  const [cars] = useState<Car[]>(storage.getCars);
  const [types] = useState<CarType[]>(storage.getTypes);
  const [empresas] = useState<Empresa[]>(storage.getEmpresas);
  const [rentals, setRentals] = useState<Rental[]>(storage.getRentals);

  // ── Validaciones con "guard clauses": una función = una regla
  const assertEmpresaExists = (empresaId: string): void => {
    if (!getEmpresa(empresaId)) {
      throw new Error('La empresa seleccionada no existe.');
    }
  };

  const assertCarIsAvailable = (
    carId: string,
    inicio: number,
    fin: number,
    excludeId?: string,
    errorMessage = 'El coche no está disponible en esas fechas.'
  ): void => {
    if (!isAvailable(carId, inicio, fin, excludeId)) {
      throw new Error(errorMessage);
    }
  };





  useEffect(() => {
    storage.saveRentals(rentals);
  }, [rentals]);

  const getCar = (id: string) =>
    cars.find(car => car.id === id);

  const getEmpresa = (id: string) =>
    empresas.find(empresa => empresa.id === id);

  const isAvailable = (
    carId: string,
    inicio: number,
    fin: number,
    excludeId?: string
  ) => {
    if (fin <= inicio) return false;

    const car = getCar(carId);
    if (!car || car.estado === 'taller') return false;

    return !rentals.some(rental =>
      rental.carId === carId &&
      rental.id !== excludeId &&
      rental.estado !== 'devuelto' &&
      datesOverlap(inicio, fin, rental.inicio, rental.fin)
    );
  };

  const addRental = (input: RentalInput): void => {
    assertEmpresaExists(input.empresaId);
    assertCarIsAvailable(input.carId, input.inicio, input.fin);

    const rental = buildRental(input);
    setRentals(previous => [...previous, rental]);
  };


  const updateRental = (rental: Rental): void => {
    assertCarIsAvailable(
      rental.carId,
      rental.inicio,
      rental.fin,
      rental.id, // excluye el propio alquiler del solape
      'Existe otro alquiler en esas fechas.'
    );

    setRentals(previous =>
      previous.map(item =>
        item.id === rental.id ? rental : item
      )
    );
  };

  const deleteRental = (id: string) => {
    setRentals(previous =>
      previous.filter(item => item.id !== id)
    );
  };



  return (
    <FleetContext.Provider value={{
      cars,
      types,
      empresas,
      rentals,
      addRental,
      updateRental,
      deleteRental,
      getCar,
      getEmpresa,
      isAvailable
    }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  const context = useContext(FleetContext);

  if (!context) {
    throw new Error('useFleet debe utilizarse dentro de FleetProvider');
  }

  return context;
}
