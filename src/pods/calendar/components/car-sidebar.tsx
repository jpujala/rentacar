
import { useFleet } from '@/core/store/fleet.context';

interface Props {
  onSelectCar: (carId: string) => void;
}

export function CarSidebar({ onSelectCar }: Props) {
  const { cars, types } = useFleet();

  return (
    <aside className="car-sidebar">
      <h3>Flota disponible</h3>
      <p>Arrastra o selecciona un vehículo</p>

      {types.map(type => {
        const typeCars = cars.filter(
          car => car.tipo === type.id && car.estado !== 'taller'
        );

        if (!typeCars.length) return null;

        return (
          <section key={type.id}>
            <h4>{type.nombre}</h4>

            {typeCars.map(car => (
              <div
                key={car.id}
                className="car-drag-item"
                draggable
                onDragStart={event => {
                  event.dataTransfer.setData('carId', car.id);
                }}
                onClick={() => onSelectCar(car.id)}
              >
                <strong>{car.matricula}</strong>
                <span>{car.descripcion}</span>
              </div>
            ))}
          </section>
        );
      })}
    </aside>
  );
}
