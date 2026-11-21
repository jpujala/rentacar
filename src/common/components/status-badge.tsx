
import type { CarStatus, RentalStatus } from '@/core/model/car.model';

type Status = CarStatus | RentalStatus;

const labels: Record<Status, string> = {
  reservado: 'Reservado',
  entregado: 'entregado',
  'en-': 'En ',
  taller: 'En taller',
  devuelto: 'Devuelto'
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`status-badge status-${status}`}>
      {labels[status]}
    </span>
  );
}
