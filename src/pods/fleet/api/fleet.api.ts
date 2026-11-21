
import { useFleet } from '@/core/store/fleet.context';

export function useFleetApi() {
  const { cars, types, getCar } = useFleet();

  return {
    cars,
    types,
    getCar,
    availableCars: cars.filter(car => car.estado === 'libre'),
    damagedCars: cars.filter(car => car.danado),
    workshopCars: cars.filter(car => car.estado === 'taller')
  };
}
