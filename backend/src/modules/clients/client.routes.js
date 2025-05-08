import { Router } from 'express';
import { createClient, getClientByDocument,getAll } from './client.controller';

const router = Router();

// Crear un cliente
router.post('/', createClient);
router.get('/', getAll);

// Obtener un cliente por cédula
router.get('/:document', getClientByDocument);

export { router as clientRoutes };
