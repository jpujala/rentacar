
import type { Rental, RentalInput } from '@/core/model/car.model';

export interface RentalsApi {
  create: (input: RentalInput) => void;
  update: (rental: Rental) => void;
  remove: (id: string) => void;
}

export function createRentalsApi(
  addRental: (input: RentalInput) => void,
  updateRental: (rental: Rental) => void,
  deleteRental: (id: string) => void
): RentalsApi {
  return {
    create: addRental,
    update: updateRental,
    remove: deleteRental
  };
}
