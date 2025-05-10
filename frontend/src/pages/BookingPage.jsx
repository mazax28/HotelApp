import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../api/roomApi';
import { createClient, getClientByDocument } from '../api/clientApi';
import { createReservation } from '../api/reservationApi';
import { getAllHotels } from '../api/hotelApi';

function BookingPage() {
  // Estados para formulario de búsqueda
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [hotelId, setHotelId] = useState('');
  const [hotels, setHotels] = useState([]);

  // Estados para resultados y selección
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Estados para datos del cliente
  const [clientDocument, setClientDocument] = useState('');
  const [clientFirstName, setClientFirstName] = useState('');
  const [clientLastName, setClientLastName] = useState('');
  const [clientExists, setClientExists] = useState(false);
  const [clientId, setClientId] = useState(null);

  // Estados para mensajes y errores
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Cargar hoteles al iniciar
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const hotelsData = await getAllHotels();
        setHotels(hotelsData);
        if (hotelsData.length > 0) {
          setHotelId(hotelsData[0].id.toString());
        }
      } catch (err) {
        setError('Error al cargar hoteles');
        console.error(err);
      }
    };

    loadHotels();
  }, []);
  // No se necesita una función auxiliar, ya que estamos manejando la limpieza directamente en cada controlador de eventos

  // Buscar habitaciones disponibles
  const handleSearch = async e => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate || !hotelId) {
      setError('Fecha de entrada, fecha de salida y hotel son obligatorios');
      return;
    }

    // Validar que la fecha de salida sea posterior a la de entrada
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError('La fecha de salida debe ser posterior a la fecha de entrada');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const filters = {
        checkInDate,
        checkOutDate,
        hotelId,
        capacity: capacity || undefined,
      };

      const rooms = await getAllRooms(filters);
      setAvailableRooms(rooms);
      setShowResults(true);

      if (rooms.length === 0) {
        setMessage(
          'No hay habitaciones disponibles con los criterios seleccionados'
        );
      } else {
        setMessage(`Se encontraron ${rooms.length} habitaciones disponibles`);
      }
    } catch (err) {
      setError('Error al buscar habitaciones: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar una habitación
  const handleSelectRoom = room => {
    setSelectedRoom(room);
    setClientDocument('');
    setClientFirstName('');
    setClientLastName('');
    setClientExists(false);
    setClientId(null);
    setError('');
  };

  // Buscar cliente por cédula/documento
  const handleSearchClient = async () => {
    if (!clientDocument.trim()) {
      setError('Debe ingresar un número de cédula/documento');
      return;
    }

    setLoading(true);

    try {
      const client = await getClientByDocument(clientDocument);

      if (client) {
        setClientFirstName(client.firstName);
        setClientLastName(client.lastName);
        setClientExists(true);
        setClientId(client.id);
        setMessage('Cliente encontrado');
      } else {
        // No se encontró el cliente, limpiar campos para nuevo registro
        setClientFirstName('');
        setClientLastName('');
        setClientExists(false);
        setClientId(null);
        setMessage(
          'Cliente no encontrado. Complete los datos para registrarlo.'
        );
      }
    } catch (err) {
      // Si es error 404, significa que no existe el cliente
      if (err.response && err.response.status === 404) {
        setClientFirstName('');
        setClientLastName('');
        setClientExists(false);
        setClientId(null);
        setMessage(
          'Cliente no encontrado. Complete los datos para registrarlo.'
        );
      } else {
        setError('Error al buscar cliente: ' + err.message);
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Crear reserva
  const handleCreateReservation = async e => {
    e.preventDefault();

    if (!selectedRoom) {
      setError('Debe seleccionar una habitación');
      return;
    }

    if (!clientDocument.trim()) {
      setError('Debe ingresar la cédula/documento del cliente');
      return;
    }

    if (!clientExists && (!clientFirstName.trim() || !clientLastName.trim())) {
      setError('Debe ingresar nombre y apellido del cliente');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Si el cliente no existe, crearlo primero
      let clientIdToUse = clientId;

      if (!clientExists) {
        const newClient = await createClient({
          document: clientDocument,
          firstName: clientFirstName,
          lastName: clientLastName,
        });

        clientIdToUse = newClient.id;
      }

      // Crear la reserva
      const reservationData = {
        hotelId: selectedRoom.hotelId,
        roomId: selectedRoom.id,
        clientId: clientIdToUse,
        checkInDate,
        checkOutDate,
        numberOfPeople: capacity || selectedRoom.capacity,
      };

      await createReservation(reservationData);

      // Resetear formulario y mostrar mensaje de éxito
      setMessage('Reserva creada exitosamente');
      setSelectedRoom(null);
      setShowResults(false);
      setAvailableRooms([]);
      setClientDocument('');
      setClientFirstName('');
      setClientLastName('');
      setClientExists(false);
      setClientId(null);
    } catch (err) {
      setError('Error al crear la reserva: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Reservar Habitación</h2>

      {/* Formulario de búsqueda */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Búsqueda de Habitaciones</h3>
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hotel</label>{' '}
              <select
                value={hotelId}
                onChange={e => {
                  setHotelId(e.target.value);
                  if (showResults) {
                    setAvailableRooms([]);
                    setShowResults(false);
                    setSelectedRoom(null);
                  }
                }}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Seleccione un hotel</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Capacidad (personas)
              </label>{' '}
              <input
                type="number"
                value={capacity}
                onChange={e => {
                  setCapacity(e.target.value);
                  if (showResults) {
                    setAvailableRooms([]);
                    setShowResults(false);
                    setSelectedRoom(null);
                  }
                }}
                className="w-full border rounded p-2"
                placeholder="Opcional"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de entrada *
              </label>{' '}
              <input
                type="date"
                value={checkInDate}
                onChange={e => {
                  setCheckInDate(e.target.value);
                  if (showResults) {
                    setAvailableRooms([]);
                    setShowResults(false);
                    setSelectedRoom(null);
                  }
                }}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de salida *
              </label>{' '}
              <input
                type="date"
                value={checkOutDate}
                onChange={e => {
                  setCheckOutDate(e.target.value);
                  if (showResults) {
                    setAvailableRooms([]);
                    setShowResults(false);
                    setSelectedRoom(null);
                  }
                }}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar Habitaciones'}
          </button>
        </form>
      </div>

      {/* Mensajes de error o éxito */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {message && !error && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      {/* Resultados de búsqueda */}
      {showResults && availableRooms.length > 0 && (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Habitaciones Disponibles
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Habitación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Piso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableRooms.map(room => (
                  <tr
                    key={room.id}
                    className={selectedRoom?.id === room.id ? 'bg-blue-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.hotel.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.floor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.capacity} personas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleSelectRoom(room)}
                        className={`px-3 py-1 rounded text-white ${
                          selectedRoom?.id === room.id
                            ? 'bg-green-600'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {selectedRoom?.id === room.id
                          ? 'Seleccionada'
                          : 'Seleccionar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Formulario de reserva (solo visible si se seleccionó una habitación) */}
      {selectedRoom && (
        <div className="bg-white shadow-md rounded p-6">
          <h3 className="text-xl font-semibold mb-4">Datos del Cliente</h3>
          <form onSubmit={handleCreateReservation}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2 flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Cédula/Documento *
                  </label>
                  <input
                    type="text"
                    value={clientDocument}
                    onChange={e => setClientDocument(e.target.value)}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleSearchClient}
                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                    disabled={loading || !clientDocument.trim()}
                  >
                    Buscar Cliente
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={clientFirstName}
                  onChange={e => setClientFirstName(e.target.value)}
                  className="w-full border rounded p-2"
                  readOnly={clientExists}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  value={clientLastName}
                  onChange={e => setClientLastName(e.target.value)}
                  className="w-full border rounded p-2"
                  readOnly={clientExists}
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 mb-4 rounded">
              <h4 className="font-semibold mb-2">Resumen de la Reserva</h4>
              <p className="mb-1">
                <strong>Hotel:</strong> {selectedRoom.hotel.name}
              </p>
              <p className="mb-1">
                <strong>Habitación:</strong> {selectedRoom.number}
              </p>
              <p className="mb-1">
                <strong>Piso:</strong> {selectedRoom.floor}
              </p>
              <p className="mb-1">
                <strong>Fecha de entrada:</strong> {checkInDate}
              </p>
              <p className="mb-1">
                <strong>Fecha de salida:</strong> {checkOutDate}
              </p>
              <p>
                <strong>Personas:</strong> {capacity || selectedRoom.capacity}
              </p>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default BookingPage;
