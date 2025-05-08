import { Router } from 'express';
import { createReservation, getAllReservations, getReservationById, updateReservation, deleteReservation } from './reservation.controller';

const router = Router();

// Crear una nueva reserva
router.post('/', createReservation);

// Obtener todas las reservas
router.get('/', getAllReservations);

// Obtener una reserva por ID
router.get('/:id', getReservationById);

// Actualizar una reserva
router.put('/:id', updateReservation);

// Eliminar una reserva
router.delete('/:id', deleteReservation);

export { router as reservationRoutes };
