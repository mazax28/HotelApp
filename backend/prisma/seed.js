import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Crear Hoteles
  const hotel1 = await prisma.hotel.create({
    data: {
      name: 'Hotel Paraíso Tropical',
      address: 'Avenida del Sol, 123, Ciudad Playa',
    },
  });

  const hotel2 = await prisma.hotel.create({
    data: {
      name: 'Montaña Azul Inn',
      address: 'Ruta Escénica, Km 45, Pueblo Montañoso',
    },
  });

  // Crear Habitaciones para Hotel Paraíso Tropical
  await prisma.room.createMany({
    data: [
      // Piso 1
      {
        number: '101',
        hotelId: hotel1.id,
        positionX: 0,
        positionY: 0,
        floor: '1',
        capacity: 2,
        description: 'Habitación estándar con vistas al jardín.',
      },
      {
        number: '102',
        hotelId: hotel1.id,
        positionX: 1,
        positionY: 0,
        floor: '1',
        capacity: 2,
        description: 'Habitación estándar con balcón.',
      },
      {
        number: '103',
        hotelId: hotel1.id,
        positionX: 2,
        positionY: 0,
        floor: '1',
        capacity: 3,
        description: 'Habitación triple, ideal para familias pequeñas.',
      },
      {
        number: '104',
        hotelId: hotel1.id,
        positionX: 0,
        positionY: 1,
        floor: '1',
        capacity: 1,
        description: 'Habitación individual económica.',
      },
      {
        number: '105',
        hotelId: hotel1.id,
        positionX: 1,
        positionY: 1,
        floor: '1',
        capacity: 4,
        description: 'Suite familiar con dos camas dobles.',
      },
      // Piso 2
      {
        number: '201',
        hotelId: hotel1.id,
        positionX: 0,
        positionY: 0,
        floor: '2',
        capacity: 2,
        description: 'Habitación deluxe con vistas al mar.',
      },
      {
        number: '202',
        hotelId: hotel1.id,
        positionX: 1,
        positionY: 0,
        floor: '2',
        capacity: 2,
        description: 'Habitación deluxe con jacuzzi.',
      },
      {
        number: '203',
        hotelId: hotel1.id,
        positionX: 2,
        positionY: 0,
        floor: '2',
        capacity: 1,
        description: 'Habitación individual superior.',
      },
    ],
  });

  // Crear Habitaciones para Montaña Azul Inn
  await prisma.room.createMany({
    data: [
      // Piso 1
      {
        number: 'A1',
        hotelId: hotel2.id,
        positionX: 0,
        positionY: 0,
        floor: 'A',
        capacity: 2,
        description: 'Cabaña rústica con chimenea.',
      },
      {
        number: 'A2',
        hotelId: hotel2.id,
        positionX: 1,
        positionY: 0,
        floor: 'A',
        capacity: 4,
        description: 'Cabaña familiar con dos habitaciones.',
      },
      {
        number: 'B1',
        hotelId: hotel2.id,
        positionX: 0,
        positionY: 1,
        floor: 'B',
        capacity: 2,
        description: 'Habitación con vistas al valle.',
      },
    ],
  });

  // Crear Clientes
  const cliente1 = await prisma.client.create({
    data: {
      document: '12345678A',
      firstName: 'Ana',
      lastName: 'Pérez',
    },
  });

  const cliente2 = await prisma.client.create({
    data: {
      document: 'B87654321',
      firstName: 'Carlos',
      lastName: 'Gómez',
    },
  });

  const cliente3 = await prisma.client.create({
    data: {
      document: 'C11223344',
      firstName: 'Lucía',
      lastName: 'Martínez',
    },
  });

  // Crear Reservas (opcional, puedes añadir más lógica para evitar solapamientos si es necesario)
  // Asegúrate de que los IDs de habitación existan y correspondan a los hoteles correctos.
  // Para simplificar, asumimos que las primeras habitaciones de cada hotel están disponibles.

  const habitacionHotel1 = await prisma.room.findFirst({
    where: { hotelId: hotel1.id },
  });
  const habitacionHotel2 = await prisma.room.findFirst({
    where: { hotelId: hotel2.id },
  });

  if (habitacionHotel1) {
    await prisma.reservation.create({
      data: {
        hotelId: hotel1.id,
        roomId: habitacionHotel1.id,
        clientId: cliente1.id,
        checkInDate: new Date('2025-06-01T14:00:00Z'),
        checkOutDate: new Date('2025-06-05T12:00:00Z'),
        guestCount: 2,
      },
    });
  }

  if (habitacionHotel2) {
    await prisma.reservation.create({
      data: {
        hotelId: hotel2.id,
        roomId: habitacionHotel2.id,
        clientId: cliente2.id,
        checkInDate: new Date('2025-07-10T14:00:00Z'),
        checkOutDate: new Date('2025-07-15T12:00:00Z'),
        guestCount: 1,
      },
    });
  }

  if (habitacionHotel1 && habitacionHotel1.id + 1) {
    // Intentar reservar otra habitación en hotel 1
    const otraHabitacionHotel1 = await prisma.room.findUnique({
      where: { id: habitacionHotel1.id + 1 },
    });
    if (otraHabitacionHotel1 && otraHabitacionHotel1.hotelId === hotel1.id) {
      await prisma.reservation.create({
        data: {
          hotelId: hotel1.id,
          roomId: otraHabitacionHotel1.id,
          clientId: cliente3.id,
          checkInDate: new Date('2025-05-20T14:00:00Z'), // Reserva para una fecha cercana a la actual
          checkOutDate: new Date('2025-05-22T12:00:00Z'),
          guestCount: 3,
        },
      });
    }
  }

  console.log('Datos de ejemplo creados exitosamente!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
