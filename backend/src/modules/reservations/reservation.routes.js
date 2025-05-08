import { Router } from 'express';
import { createReservation, getAllReservations, getReservationById, updateReservation, deleteReservation } from './reservation.controller';

const router = Router();

// Crear una nueva reserva
router.post('/', createReservation);

// Obtener todas las reservas
router.get('/', getAllReservations);


export { router as reservationRoutes };
