import { FormEvent, useEffect, useState } from 'react';

import { useFleet } from '@/core/store/fleet.context';
import { RENTAL_STATUS_OPTIONS } from '@/core/model/car.model';
import type {
  Rental,
  RentalInput,
  RentalStatus
} from '@/core/model/car.model';

const DAY_MS = 24 * 60 * 60 * 1000;



function toDateTimeLocal(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (value: number) =>
    String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface Props {
  rental: Rental | null; // null => crear nuevo
  carId: string | null;
  initialDate: number;
  onClose: () => void;
}

export function RentalModal({
  rental,
  carId,
  initialDate,
  onClose
}: Props) {

  const {
    cars,
    empresas,
    getEmpresa,
    addRental,
    updateRental,
    deleteRental
  } = useFleet();

  // Cerrar con Escape
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const [empresaId, setEmpresaId] = useState<string>(
    rental?.empresaId ?? ''
  );

  const [estado, setEstado] = useState<RentalStatus>(
    rental?.estado ?? 'reservado'
  );

  const [inicio, setInicio] = useState<string>(
    toDateTimeLocal(rental?.inicio ?? initialDate)
  );

  const [fin, setFin] = useState<string>(
    toDateTimeLocal(
      rental?.fin ?? (rental?.inicio ?? initialDate) + DAY_MS
    )
  );

  const [observaciones, setObservaciones] = useState<string>(
    rental?.observaciones ?? ''
  );

  const [error, setError] = useState<string | null>(null);

  // 👇 Aquí está la clave: getEmpresa(empresaId) devuelve
  // la empresa seleccionada con todos sus datos
  const empresa = getEmpresa(empresaId);
  const car = cars.find(
    item => item.id === (rental?.carId ?? carId)
  );

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const start = new Date(inicio).getTime();
    const end = new Date(fin).getTime();

    if (!empresaId) {
      setError('Selecciona una empresa');
      return;
    }

    if (Number.isNaN(start) || Number.isNaN(end)) {
      setError('Las fechas no son válidas');
      return;
    }

    if (end <= start) {
      setError('La fecha de fin debe ser posterior al inicio');
      return;
    }

    const input: RentalInput = {
      carId: rental?.carId ?? carId ?? '',
      empresaId,
      inicio: start,
      fin: end,
      estado,
      observaciones: observaciones || undefined
    };

    try {
      if (rental) {
        updateRental({ ...rental, ...input });
      } else {
        addRental(input);
      }

      onClose(); // solo se cierra si todo fue bien

    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No se pudo guardar el alquiler'
      );
    }
  }


  function handleDelete() {
    if (!rental) return;

    if (window.confirm(`¿Eliminar el alquiler de ${empresa?.nombre ?? 'esta empresa'}?`)) {
      deleteRental(rental.id);
      onClose();
    }
  }

  return (
    <div className="modal-backdrop"
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form className="rental-modal" onSubmit={handleSave} onClick={event => event.stopPropagation()}>

        <h2>{rental ? 'Editar alquiler' : 'Nuevo alquiler'}</h2>

        {/* Vehículo (solo lectura) */}
        <label htmlFor="rentalCar">Vehículo</label>
        <input
          id="rentalCar"
          type="text"
          value={car ? `${car.matricula} - ${car.descripcion}` : ''}
          readOnly
        />

        {/* Empresa */}
        <label htmlFor="rentalEmpresa">Empresa</label>
        <select
          id="rentalEmpresa"
          value={empresaId}
          onChange={event =>
            setEmpresaId(event.target.value)
          }
        >
          <option value="">
            — Selecciona una empresa —
          </option>
          {empresas.map(item => (
            <option key={item.id} value={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>

        {/* 👇 Datos de la empresa seleccionada, debajo del desplegable */}
        {empresa && (
          <div className="empresa-info">
            <strong>{empresa.nombre}</strong>
            <span>Contacto: {empresa.contacto}</span>
            <span>Teléfono: {empresa.telefono}</span>
            <span>
              Email:{' '}
              <a href={`mailto:${empresa.email}`}>
                {empresa.email}
              </a>
            </span>
            {/* Si quieres, añade también:
            <span>CIF: {empresa.cif}</span>
            <span>Dirección: {empresa.direccion}</span> */}
          </div>
        )}

        {/* 👇 Seleccionable para CAMBIAR el estado */}
        <label htmlFor="rentalEstado">Estado</label>
        <select
          id="rentalEstado"
          value={estado}
          onChange={event =>
            setEstado(event.target.value as RentalStatus)
          }
        >
          {RENTAL_STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Fechas */}
        <label htmlFor="rentalInicio">Inicio</label>
        <input
          id="rentalInicio"
          type="datetime-local"
          value={inicio}
          onChange={event => setInicio(event.target.value)}
        />

        <label htmlFor="rentalFin">Fin</label>
        <input
          id="rentalFin"
          type="datetime-local"
          value={fin}
          onChange={event => setFin(event.target.value)}
        />

        {/* Observaciones */}
        <label htmlFor="rentalObservaciones">
          Observaciones
        </label>
        <input
          id="rentalObservaciones"
          type="text"
          value={observaciones}
          onChange={event =>
            setObservaciones(event.target.value)
          }
        />

        {error && <span className="error">{error}</span>}

        <div className="modal-actions">
          {rental && (
            <button
              type="button"
              className="btn-delete"
              onClick={handleDelete}
            >
              Eliminar
            </button>
          )}

          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit">Guardar</button>
        </div>

      </form>
    </div>
  );
}