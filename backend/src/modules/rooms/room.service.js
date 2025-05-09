import {prismaClient as prisma} from '../../utils/prisma.js'





// creacion de una habitacion
const create = async (data) => {
  const { hotelId, number, floor, capacity, description, positionX = 0, positionY = 0 } = data;
  
  return await prisma.room.create({
    data: {
      number: number,
      hotelId: Number(hotelId),
      floor,
      capacity: Number(capacity),
      description,
      positionX: Number(positionX),
      positionY: Number(positionY)
    }
  });
};

// Para la lista de habitaciones
const getAll = async (filters) => {
  const { checkInDate, checkOutDate, capacity } = filters;
   if (!checkInDate || !checkOutDate) {
    throw new Error('Las fechas de entrada y salida son requeridas');
  }
  
  // Base query para habitaciones
  const query = {
    include: {
      hotel: true
    }
  };
  
  // Filtro por capacidad si se proporciona
  if (capacity) {
    query.where = {
      capacity: {
        gte: Number(capacity)
      }
    };
  }
  
  // Obtener todas las habitaciones según los filtros de capacidad
  const rooms = await prisma.room.findMany(query);
  
  
  // Convertir fechas a objetos Date
  const startDate = new Date(checkInDate);
  const endDate = new Date(checkOutDate);
  
  // Buscar reservaciones que se traslapen con el periodo solicitado
  const reservations = await prisma.reservation.findMany({
    where: {
     
      AND: [
        { checkOutDate: { gt: startDate } }, // La salida de la reserva es después de la entrada solicitada
        { checkInDate: { lt: endDate } }    // La entrada de la reserva es antes de la salida solicitada
      ]
    },
    select: {
      roomId: true
    }
  });
  
  // Obtener IDs de habitaciones ocupadas
  const occupiedRoomIds = reservations.map(res => res.roomId);
  
  // Filtrar habitaciones disponibles
  return rooms.filter(room => !occupiedRoomIds.includes(room.id));
};




// para actualizar una habitacion
const update = async (id, data) => {
  const { number, floor, capacity, description, positionX, positionY } = data;
  try {
    return await prisma.room.update({
      where: { id },
      data: {
        number: number,
        floor,
        capacity: Number(capacity),
        description,
        positionX: Number(positionX),
        positionY: Number(positionY)
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null; // Room not found
    }
    throw error;
  }
};
;


const deleteRoom = async (id) => {
  try {
    return await prisma.room.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
};

const roomService = {
  create,
  getAll,
  update,
  delete: deleteRoom,
};

export { roomService };