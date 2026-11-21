
import { useFleet } from '@/core/store/fleet.context';
import { formatDate } from '@/core/utils/dates';
import type { Rental } from '@/core/model/car.model';

export function DashboardScene() {
  const {
    cars,
    rentals,
    empresas,
    getCar
  } = useFleet();

  const active = rentals.filter(
    (r: Rental) => r.estado === 'reservado'
  ).length;

  const reserved = rentals.filter(
    (r: Rental) => r.estado === 'reservado'
  ).length;

  const today = Date.now();

  const upcoming = rentals
    .filter((r: Rental) => r.inicio >= today)
    .sort((a: Rental, b: Rental) => a.inicio - b.inicio)
    .slice(0, 5);

  return (
    <main>
      <h1>Panel de control</h1>
      <p>Resumen general de Rent a Car</p>

      <div className="stats-grid">
        <article>
          <span>Vehículos</span>
          <strong>{cars.length}</strong>
        </article>

        <article>
          <span>Empresas</span>
          <strong>{empresas.length}</strong>
        </article>

        <article>
          <span>Alquileres activos</span>
          <strong>{active}</strong>
        </article>

        <article>
          <span>Reservas pendientes</span>
          <strong>{reserved}</strong>
        </article>
      </div>

      <h2>Próximos alquileres</h2>

      <div className="upcoming-list">
        {upcoming.map((rental: Rental) => (
          <article key={rental.id}>
            <strong>
              {getCar(rental.carId)?.matricula ?? rental.carId}
            </strong>

            <span>{formatDate(rental.inicio)}</span>
            <span>{formatDate(rental.fin)}</span>
          </article>
        ))}

        {upcoming.length === 0 && (
          <p>No hay próximos alquileres.</p>
        )}
      </div>
    </main>
  );
}
