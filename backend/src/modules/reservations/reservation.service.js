import {prismaClient} from '../../utils/prisma.js'



const create = async (data) => {
  const { hotelId, roomId, clientId, checkInDate, checkOutDate, guestCount } = data;
  
  return await prisma.reservation.create({
    data: {
      hotelId: Number(hotelId),
      roomId: Number(roomId),
      clientId: Number(clientId),
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      guestCount: Number(numberOfPeople) // Match schema field name
    },
    include: {
      hotel: true,
      room: true,
      client: true
    }
  });
};

// Listado de reservas con filtros
const getAll = async (filters = {}) => {
  const { hotelId, checkInDate, checkOutDate, clientId } = filters;
  
  // Verificar parámetros obligatorios
  if (!hotelId || !checkInDate) {
    throw new Error('Hotel ID y fecha de entrada son obligatorios');
  }
  
  // Construir condiciones de búsqueda
  const where = {
    hotelId: Number(hotelId),
    checkInDate: { gte: new Date(checkInDate) }
  };
  
  // Filtros opcionales
  if (checkOutDate) {
    where.checkOutDate = { lte: new Date(checkOutDate) };
  }
  
  if (clientId) {
    where.clientId = Number(clientId);
  }
  
  // Ejecutar consulta con filtros y ordenamiento
  return await prisma.reservation.findMany({
    where,
    include: {
      hotel: true,
      room: true,
      client: true
    },
    orderBy: [
      { checkInDate: 'asc' },
      { room: { floor: 'asc' } },
      { room: { number: 'asc' } }
    ]
  });
};


const reservationService = {
  create,
  getAll,
};

export { reservationService };