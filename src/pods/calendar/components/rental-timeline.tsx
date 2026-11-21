
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/style.css';

import type { RentalStatus } from '@/core/model/car.model';
import { useFleet } from '@/core/store/fleet.context';

interface Props {
  onCreateRental: (carId: string, date: number) => void;
  onEditRental: (rentalId: string) => void;
  statusFilter: RentalStatus | 'todos';
}

export function RentalTimeline({
  onCreateRental,
  onEditRental,
  statusFilter
}: Props) {

  const {
    cars,
    rentals,
    getEmpresa,
    updateRental
  } = useFleet();

  // Colores según el estado
  const statusColors: Record<RentalStatus, string> = {
    reservado: '#16a34a',
    entregado: '#dc2626',
    devuelto: '#9ca3af',
    taller: '#eab308'
  };

  // Grupos: vehículos
  const groups = cars.map(car => ({
    id: car.id,
    title: `${car.matricula} - ${car.descripcion}`,
    stackItems: true
  }));

  // Filtrar alquileres según el estado seleccionado
  const items = rentals
    .filter(rental =>
      statusFilter === 'todos' ||
      rental.estado === statusFilter
    )
    .map(rental => {
      const empresa = getEmpresa(rental.empresaId);

      const bgColor = statusColors[rental.estado];

      return {
        id: rental.id,
        group: rental.carId,
        title: empresa?.nombre ?? 'Empresa desconocida',
        start_time: rental.inicio,
        end_time: rental.fin,
        canMove: true,
        canResize: 'both' as const,
        bgColor,
        selectedBgColor: bgColor,
        color: '#ffffff'
      };
    });

  const now = Date.now();

  // Formatear horas
  function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // Mover alquiler
  function handleMove(
    itemId: number | string,
    dragTime: number,
    newGroupOrder: number
  ) {
    const rental = rentals.find(
      item => item.id === String(itemId)
    );

    const car = cars[newGroupOrder];

    if (!rental || !car) return;

    try {
      const duration = rental.fin - rental.inicio;

      updateRental({
        ...rental,
        carId: car.id,
        inicio: dragTime,
        fin: dragTime + duration
      });

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo mover'
      );
    }
  }

  // Redimensionar alquiler
  function handleResize(
    itemId: number | string,
    time: number,
    edge: 'left' | 'right'
  ) {
    const rental = rentals.find(
      item => item.id === String(itemId)
    );

    if (!rental) return;

    try {
      updateRental({
        ...rental,
        inicio: edge === 'left' ? time : rental.inicio,
        fin: edge === 'right' ? time : rental.fin
      });

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo modificar'
      );
    }
  }

  return (
    <div
      className="rental-timeline"
      onDragOver={event => event.preventDefault()}
      onDrop={event => {
        event.preventDefault();

        const carId = event.dataTransfer.getData('carId');

        if (carId) {
          onCreateRental(carId, now);
        }
      }}
    >
      <Timeline
        groups={groups}
        items={items}

        // defaultTimeStart={now - 7 * 86400000}
        // defaultTimeEnd={now + 30 * 86400000}

        defaultTimeStart={now - 1 * 86400000}
        defaultTimeEnd={now + 14 * 86400000}   // ~15 días → ~40px/día

        sidebarWidth={240}
        lineHeight={55}
        itemHeightRatio={0.75}

        stackItems
        canMove
        canChangeGroup
        canResize="both"

        dragSnap={15 * 60 * 1000}

        onItemMove={handleMove}
        onItemResize={handleResize}

        minZoom={86400000}
        maxZoom={365 * 86400000}

        onItemDoubleClick={itemId => {
          onEditRental(String(itemId));
        }}

        itemRenderer={({
          item,
          itemContext,
          getItemProps,
          getResizeProps
        }) => {

          const { left, right } = getResizeProps();

          const rental = rentals.find(
            r => r.id === String(item.id)
          );

          if (!rental) return null;

          const empresa = getEmpresa(rental.empresaId);

          // Obtener propiedades del elemento
          const itemProps = getItemProps();

          const {
            key,
            style,
            ...restItemProps
          } = itemProps;

          return (
            <div
              key={key}
              {...restItemProps}
              style={{
                ...style,
                background: itemContext.selected
                  ? item.selectedBgColor
                  : item.bgColor,
                color: '#ffffff',
                borderLeftWidth: 0,    // ✅ longhand, misma "familia" que usa la librería
                borderRightWidth: 0,
                borderRadius: '6px',
                overflow: 'hidden'
              }}
            >

              {itemContext.useResizeHandle && (
                <div {...left} />
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  height: '100%',
                  padding: '0 6px',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >

                <span>
                  {formatTime(rental.inicio)}
                </span>

                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    textAlign: 'center'
                  }}
                >
                  {empresa?.nombre ?? 'Empresa desconocida'}
                </span>

                <span>
                  {formatTime(rental.fin)}
                </span>

              </div>

              {itemContext.useResizeHandle && (
                <div {...right} />
              )}

            </div>
          );
        }}
      />

    </div>
  );
}
