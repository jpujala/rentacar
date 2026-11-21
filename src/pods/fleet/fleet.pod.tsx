
import { FleetCarSidebar } from './components/car-sidebar';
import { useFleet } from '@/core/store/fleet.context';

export function FleetPod() {
  const { cars } = useFleet();

  const free = cars.filter(car => car.estado === 'libre').length;
  const workshop = cars.filter(car => car.estado === 'taller').length;

  return (
    <section className="fleet-pod">
      <header className="page-header">
        <div>
          <h1>Gestión de flota</h1>
          <p>Inventario de vehículos</p>
        </div>
      </header>

      <div className="stats-grid">
        <article>
          <span>Total vehículos</span>
          <strong>{cars.length}</strong>
        </article>
        <article>
          <span>Libres administrativamente</span>
          <strong>{free}</strong>
        </article>
        <article>
          <span>En taller</span>
          <strong>{workshop}</strong>
        </article>
      </div>

      <FleetCarSidebar />
    </section>
  );
}
