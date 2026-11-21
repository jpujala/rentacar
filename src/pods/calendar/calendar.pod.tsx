import { useState } from 'react';

import { CarSidebar } from './components/car-sidebar';
import { RentalModal } from './components/rental-modal';
import { RentalTimeline } from './components/rental-timeline';

import { useFleet } from '@/core/store/fleet.context';
import { RENTAL_STATUS_OPTIONS, type Rental, type RentalStatus } from '@/core/model/car.model';

export function CalendarPod() {
  const { rentals } = useFleet();

  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(Date.now());

  const [selectedRental, setSelectedRental] =
    useState<Rental | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  // Filtro de estado
  const [statusFilter, setStatusFilter] =
    useState<RentalStatus | 'todos'>('todos');

  function handleCreateRental(carId: string, date: number) {
    setSelectedRental(null);
    setSelectedDate(date);
    setSelectedCar(carId);
    setModalOpen(true);
  }

  function handleEditRental(rentalId: string) {
    const rental = rentals.find(
      item => item.id === rentalId
    );

    if (!rental) return;

    setSelectedRental(rental);
    setSelectedCar(rental.carId);
    setSelectedDate(rental.inicio);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedRental(null);
    setSelectedCar(null);
  }

  return (
    <div className="calendar-pod">

      <header className="page-header">
        <div>
          <h1>Calendario de alquileres</h1>
          <p>Planificación y disponibilidad de vehículos</p>
        </div>
      </header>

      {/* Filtro de estado */}
      <div className="calendar-filters">
        <label htmlFor="statusFilter">
          Filtrar por estado:
        </label>

        <select
          id="statusFilter"
          value={statusFilter}
          onChange={event =>
            setStatusFilter(
              event.target.value as RentalStatus | 'todos'
            )
          }
        >
        <option value="todos">Todos los estados</option>
        {RENTAL_STATUS_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        </select>
      </div>

      <div className="calendar-workspace">

        <CarSidebar
          onSelectCar={carId =>
            handleCreateRental(carId, Date.now())
          }
        />

        <RentalTimeline
          onCreateRental={handleCreateRental}
          onEditRental={handleEditRental}
          statusFilter={statusFilter}
        />

      </div>

      {modalOpen && (
        <RentalModal
          rental={selectedRental}
          carId={selectedCar}
          initialDate={selectedDate}
          onClose={handleCloseModal}
        />
      )}

    </div>
  );
}