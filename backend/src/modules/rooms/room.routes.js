import { Router } from 'express';
import { createRoom, getAllRooms, updateRoom, deleteRoom } from './room.controller.js';

const router = Router();

// Crear una nueva habitación
router.post('/', createRoom);

// Listar todas las habitaciones
router.get('/', getAllRooms);

// Actualizar una habitación
router.put('/:id', updateRoom);

// Eliminar una habitación
router.delete('/:id', deleteRoom);

export { router as roomRoutes };
