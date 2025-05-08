import { Router } from 'express';
import { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom } from './room.controller';

const router = Router();

// Crear una nueva habitación
router.post('/', createRoom);

// Listar todas las habitaciones
router.get('/', getAllRooms);

// Obtener una habitación por ID
router.get('/:id', getRoomById);

// Actualizar una habitación
router.put('/:id', updateRoom);

// Eliminar una habitación
router.delete('/:id', deleteRoom);

// Filtrar habitaciones por hotel
router.get('/filter', getRoomByHotel);

export { router as roomRoutes };
