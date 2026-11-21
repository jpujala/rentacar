
import { useFleet } from '@/core/store/fleet.context';
import { StatusBadge } from '@/common/components/status-badge';

export function FleetCarSidebar() {
  const { cars, types } = useFleet();

  return (
    <div className="fleet-list">
      {types.map(type => (
        <section key={type.id}>
          <h2>{type.nombre}</h2>
          <p>{type.precioDia} €/día</p>

          {cars.filter(car => car.tipo === type.id).map(car => (
            <article className="fleet-card" key={car.id}>
              <div>
                <strong>{car.matricula}</strong>
                <p>{car.descripcion}</p>
                <small>{car.ocupantes} ocupantes</small>
              </div>
              <StatusBadge status={car.estado} />
              {car.danado && <span className="damage">Con daños</span>}
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
