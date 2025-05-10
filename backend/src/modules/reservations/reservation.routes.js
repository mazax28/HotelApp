import { Router } from 'express';
import {
  createReservation,
  getAllReservations,
  getRoomMapByFloor,
} from './reservation.controller.js';

const router = Router();

// Crear una nueva reserva
router.post('/', createReservation);

// Obtener todas las reservas
router.get('/', getAllReservations);

// Obtener mapa de habitaciones por pisos
router.get('/room-map', getRoomMapByFloor);

export { router as reservationRoutes };
