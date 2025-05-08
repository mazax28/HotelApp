import { Router } from 'express';
import { createClient, getClientByDocument } from './client.controller';

const router = Router();

// Crear un cliente
router.post('/', createClient);

// Obtener un cliente por cédula
router.get('/:document', getClientByDocument);

export { router as clientRoutes };
