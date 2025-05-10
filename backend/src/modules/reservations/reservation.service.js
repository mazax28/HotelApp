import { prismaClient as prisma } from '../../utils/prisma.js';

const create = async data => {
  const { hotelId, roomId, clientId, checkInDate, checkOutDate, guestCount } =
    data;

  return await prisma.reservation.create({
    data: {
      hotelId: Number(hotelId),
      roomId: Number(roomId),
      clientId: Number(clientId),
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      guestCount: Number(guestCount), // Match schema field name
    },
    include: {
      hotel: true,
      room: true,
      client: true,
    },
  });
};

// Listado de reservas con filtros
const getAll = async filters => {
  const { hotelId, checkInDate, checkOutDate, clientDocument } = filters;

  // Verificar parámetros obligatorios
  if (!hotelId || !checkInDate) {
    throw new Error('Hotel ID y fecha de entrada son obligatorios');
  }

  // Construir condiciones de búsqueda
  const where = {
    hotelId: Number(hotelId),
    checkInDate: { gte: new Date(checkInDate) },
  };

  // Filtros opcionales
  if (checkOutDate) {
    where.checkOutDate = { lte: new Date(checkOutDate) };
  }

  // Si se proporciona el documento (CI) del cliente, buscamos primero el cliente
  if (clientDocument) {
    const client = await prisma.client.findUnique({
      where: { document: clientDocument },
      select: { id: true },
    });

    // Si encontramos el cliente, filtramos por su ID
    if (client) {
      where.clientId = client.id;
    } else {
      // Si no encontramos el cliente, devolvemos un array vacío ya que no habrá coincidencias
      return [];
    }
  }

  // Ejecutar consulta con filtros y ordenamiento
  return await prisma.reservation.findMany({
    where,
    include: {
      hotel: true,
      room: true,
      client: true,
    },
    orderBy: [
      { checkInDate: 'asc' },
      { room: { floor: 'asc' } },
      { room: { number: 'asc' } },
    ],
  });
};

// Obtener mapa de habitaciones por pisos con información de ocupación
const getRoomMapByFloor = async (hotelId, date) => {
  if (!hotelId) {
    throw new Error('El ID del hotel es obligatorio');
  }

  // Obtener todas las habitaciones del hotel con sus coordenadas
  const rooms = await prisma.room.findMany({
    where: {
      hotelId: Number(hotelId),
    },
    select: {
      id: true,
      number: true,
      floor: true,
      positionX: true,
      positionY: true,
      capacity: true,
      description: true,
    },
    orderBy: [{ floor: 'asc' }, { positionX: 'asc' }, { positionY: 'asc' }],
  });

  // Si se proporciona una fecha, verificar las habitaciones ocupadas
  let occupiedRoomIds = [];

  if (date) {
    const checkDate = new Date(date);

    // Buscar reservaciones activas en la fecha especificada
    const reservations = await prisma.reservation.findMany({
      where: {
        hotelId: Number(hotelId),
        AND: [
          { checkInDate: { lte: checkDate } }, // La fecha de check-in es antes o igual a la fecha especificada
          { checkOutDate: { gt: checkDate } }, // La fecha de check-out es después de la fecha especificada
        ],
      },
      select: {
        roomId: true,
        clientId: true,
        checkInDate: true,
        checkOutDate: true,
        guestCount: true,
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Obtener IDs de habitaciones ocupadas
    occupiedRoomIds = reservations.map(res => res.roomId);

    // Crear un mapa de reservas por ID de habitación
    const reservationsByRoomId = reservations.reduce((acc, reservation) => {
      acc[reservation.roomId] = {
        clientName: `${reservation.client.firstName} ${reservation.client.lastName}`,
        checkIn: reservation.checkInDate,
        checkOut: reservation.checkOutDate,
        guestCount: reservation.guestCount,
      };
      return acc;
    }, {});

    // Agregar información de reserva a las habitaciones ocupadas
    rooms.forEach(room => {
      if (occupiedRoomIds.includes(room.id)) {
        room.occupied = true;
        room.reservationInfo = reservationsByRoomId[room.id];
      } else {
        room.occupied = false;
      }
    });
  } else {
    // Si no hay fecha, marcar todas como disponibles
    rooms.forEach(room => {
      room.occupied = false;
    });
  }

  // Agrupar habitaciones por piso
  const roomsByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {});

  return roomsByFloor;
};

const reservationService = {
  create,
  getAll,
  getRoomMapByFloor,
};

export { reservationService };
