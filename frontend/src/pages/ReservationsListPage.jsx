import React, { useState, useEffect } from 'react';
import { getAllReservations } from '../api/reservationApi';
import { getAllHotels } from '../api/hotelApi';
import RoomFloorMap from '../components/RoomFloorMap';

function ReservationsListPage() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [clientDocument, setClientDocument] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showRoomMap, setShowRoomMap] = useState(false);

  // Cargar hoteles al iniciar
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const hotelsData = await getAllHotels();
        setHotels(hotelsData);
        if (hotelsData.length > 0) {
          setSelectedHotelId(hotelsData[0].id.toString());
        }
      } catch (err) {
        setError('Error al cargar hoteles');
        console.error(err);
      }
    };
    loadHotels();
  }, []);

  // Buscar reservaciones
  const handleSearch = async e => {
    e.preventDefault();
    if (!selectedHotelId || !checkInDate) {
      setError('El hotel y la fecha de entrada son obligatorios');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const filters = {
        hotelId: selectedHotelId,
        checkInDate,
        checkOutDate: checkOutDate || undefined,
        clientDocument: clientDocument || undefined,
      };
      const data = await getAllReservations(filters);
      setReservations(data);
      if (data.length === 0) {
        setMessage(
          'No se encontraron reservaciones con los criterios seleccionados'
        );
      } else {
        setMessage(`Se encontraron ${data.length} reservaciones`);
      }
    } catch (err) {
      setError('Error al buscar reservaciones: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Listado de Reservaciones</h2>
      {/* Formulario de filtrado */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Filtros de Búsqueda</h3>
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hotel *</label>
              <select
                value={selectedHotelId}
                onChange={e => setSelectedHotelId(e.target.value)}
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
                Fecha de entrada *
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={e => setCheckInDate(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de salida
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={e => setCheckOutDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Cédula de Cliente
              </label>
              <input
                type="text"
                value={clientDocument}
                onChange={e => setClientDocument(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Opcional - CI del cliente"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar Reservaciones'}
            </button>

            {selectedHotelId && (
              <button
                type="button"
                onClick={() => setShowRoomMap(prev => !prev)}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                {showRoomMap
                  ? 'Ocultar Mapa de Habitaciones'
                  : 'Ver Mapa de Habitaciones'}
              </button>
            )}
          </div>
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

      {/* Mapa de habitaciones */}
      {showRoomMap && selectedHotelId && (
        <div className="mb-6">
          <RoomFloorMap
            hotelId={selectedHotelId}
            date={checkInDate || undefined}
          />
        </div>
      )}

      {/* Tabla de reservaciones */}
      {reservations.length > 0 && (
        <div className="bg-white shadow-md rounded p-6">
          <h3 className="text-xl font-semibold mb-4">Reservaciones</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Habitación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Huéspedes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map(reservation => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.hotel.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.room.number} ({reservation.room.floor})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.client.firstName}{' '}
                      {reservation.client.lastName}
                      <div className="text-xs text-gray-500">
                        Doc: {reservation.client.document}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(reservation.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(reservation.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.guestCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay resultados o no se ha buscado */}
      {reservations.length === 0 && !message && (
        <div className="bg-gray-100 p-8 text-center rounded-md">
          <p className="text-gray-500">
            Realiza una búsqueda para ver las reservaciones
          </p>
        </div>
      )}
    </div>
  );
}

export default ReservationsListPage;
