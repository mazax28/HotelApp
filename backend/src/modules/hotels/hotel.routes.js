import { Router } from 'express';
import { getAllHotels, getHotelById, createHotel, updateHotel, deleteHotel } from './hotel.controller';

const router = Router();

// Crear un nuevo hotel
router.post('/', createHotel);

// Listar todos los hoteles
router.get('/', getAllHotels);

// Obtener un hotel específico por ID
router.get('/:id', getHotelById);

// Editar un hotel por ID
router.put('/:id', updateHotel);

// Eliminar un hotel por ID
router.delete('/:id', deleteHotel);

export { router as hotelRoutes };
