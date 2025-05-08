import { Router } from 'express';
import { createReservation, getAllReservations} from './reservation.controller.js';

const router = Router();

// Crear una nueva reserva
router.post('/', createReservation);

// Obtener todas las reservas
router.get('/', getAllReservations);


export { router as reservationRoutes };
