import { Router } from 'express';
import { getAllHotels, createHotel, updateHotel, deleteHotel } from './hotel.controller.js';

const router = Router();

// Crear un nuevo hotel
router.post('/', createHotel);

// Listar todos los hoteles
router.get('/', getAllHotels);

// Editar un hotel por ID
router.put('/:id', updateHotel);

// Eliminar un hotel por ID
router.delete('/:id', deleteHotel);

export { router as hotelRoutes };
