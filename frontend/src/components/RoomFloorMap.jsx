import React, { useState, useEffect } from 'react';
import { getRoomMapByFloor } from '../api/reservationApi';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

// Componente para representar una habitación en el mapa
const RoomTile = ({ room, onClick }) => {
  const isOccupied = room.occupied;

  // Determinar el color de la habitación según su estado
  const getRoomColor = () => {
    if (isOccupied) return '#f44336'; // Rojo para ocupado
    if (room.maintenance) return '#ff9800'; // Naranja para mantenimiento
    return '#4caf50'; // Verde para disponible
  };

  return (
    <Tooltip
      title={
        <>
          <Typography variant="subtitle2">Habitación: {room.number}</Typography>
          <Typography variant="body2">
            Capacidad: {room.capacity} personas
          </Typography>
          {room.description && (
            <Typography variant="body2">
              Descripción: {room.description}
            </Typography>
          )}
          {isOccupied && room.reservationInfo && (
            <>
              <Typography variant="body2">
                Cliente: {room.reservationInfo.clientName}
              </Typography>
              <Typography variant="body2">
                Check-in:{' '}
                {new Date(room.reservationInfo.checkIn).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Check-out:{' '}
                {new Date(room.reservationInfo.checkOut).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Huéspedes: {room.reservationInfo.guestCount}
              </Typography>
            </>
          )}
        </>
      }
      arrow
      placement="top"
    >
      <Card
        onClick={() => onClick && onClick(room)}
        sx={{
          width: 80,
          height: 80,
          m: 0.5,
          position: 'absolute',
          left: `${room.positionX * 90}px`,
          top: `${room.positionY * 90}px`,
          backgroundColor: getRoomColor(),
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          '&:hover': {
            filter: 'brightness(90%)',
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
            zIndex: 10,
          },
        }}
      >
        <MeetingRoomIcon sx={{ fontSize: 24, mb: 0.5 }} />
        <Typography variant="subtitle1" fontWeight="bold">
          {room.number}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <PersonIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            {room.capacity}
          </Typography>
        </Box>
      </Card>
    </Tooltip>
  );
};

// Componente principal para el mapa de habitaciones por pisos
const RoomFloorMap = ({ hotelId, date }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomMap, setRoomMap] = useState({});
  const [currentFloor, setCurrentFloor] = useState('');
  const [floors, setFloors] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Calcular dimensiones para el contenedor del mapa
  const calculateMapDimensions = floorRooms => {
    if (!floorRooms || floorRooms.length === 0)
      return { width: 500, height: 500 };

    let maxX = 0;
    let maxY = 0;

    floorRooms.forEach(room => {
      maxX = Math.max(maxX, room.positionX);
      maxY = Math.max(maxY, room.positionY);
    });

    // Añadir margen para el tamaño de la habitación y espacio adicional
    return {
      width: (maxX + 1) * 90 + 50,
      height: (maxY + 1) * 90 + 50,
    };
  };

  // Cargar datos del mapa de habitaciones
  useEffect(() => {
    const fetchRoomMap = async () => {
      if (!hotelId) {
        setError('Se requiere ID del hotel');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getRoomMapByFloor(hotelId, date);

        setRoomMap(data);

        // Obtener la lista de pisos
        const floorNumbers = Object.keys(data).sort((a, b) => {
          // Intentar convertir a números para ordenar correctamente
          const numA = parseInt(a, 10);
          const numB = parseInt(b, 10);

          if (isNaN(numA) || isNaN(numB)) {
            // Si no son números, ordenar alfabéticamente
            return a.localeCompare(b);
          }

          // Ordenar numéricamente
          return numA - numB;
        });

        setFloors(floorNumbers);

        // Establecer el primer piso como piso actual si no hay piso seleccionado
        // o si el piso actual ya no está en la lista
        if (floorNumbers.length > 0) {
          if (!currentFloor || !floorNumbers.includes(currentFloor)) {
            setCurrentFloor(floorNumbers[0]);
          }
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el mapa de habitaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomMap();
  }, [hotelId, date, currentFloor]);

  // Cambiar el piso actual
  const handleChangeFloor = (event, newValue) => {
    setCurrentFloor(newValue);
    setSelectedRoom(null);
  };

  // Ajustar el nivel de zoom
  const handleZoom = direction => {
    if (direction === 'in' && zoomLevel < 1.5) {
      setZoomLevel(prev => prev + 0.1);
    } else if (direction === 'out' && zoomLevel > 0.6) {
      setZoomLevel(prev => prev - 0.1);
    }
  };

  // Manejar el clic en una habitación
  const handleRoomClick = room => {
    setSelectedRoom(room);
  };

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        flexDirection="column"
      >
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Box>
    );
  }

  // Mostrar mensaje si no hay habitaciones
  if (floors.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6">
          No se encontraron habitaciones para este hotel
        </Typography>
      </Box>
    );
  }
  // Obtener el piso actual válido (asegurarse de que exista en floors)
  const validCurrentFloor = floors.includes(currentFloor)
    ? currentFloor
    : floors[0] || '';

  // Obtener las habitaciones del piso actual
  const currentFloorRooms = roomMap[validCurrentFloor] || [];
  const { width, height } = calculateMapDimensions(currentFloorRooms);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Mapa de Habitaciones
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {date
          ? `Fecha: ${new Date(date).toLocaleDateString()}`
          : 'Todas las habitaciones'}
      </Typography>{' '}
      {/* Tabs para selección de pisos */}
      <Tabs
        value={floors.includes(currentFloor) ? currentFloor : floors[0] || ''}
        onChange={handleChangeFloor}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {floors.map(floor => (
          <Tab key={floor} label={`Piso ${floor}`} value={floor} />
        ))}
      </Tabs>
      {/* Controles y leyenda */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          {/* Leyenda */}
          <Box display="flex" gap={2} alignItems="center">
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: '#4caf50',
                  mr: 1,
                  borderRadius: '4px',
                }}
              />
              <Typography variant="body2">Disponible</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: '#f44336',
                  mr: 1,
                  borderRadius: '4px',
                }}
              />
              <Typography variant="body2">Ocupada</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: '#ff9800',
                  mr: 1,
                  borderRadius: '4px',
                }}
              />
              <Typography variant="body2">Mantenimiento</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Controles de zoom */}
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Typography variant="body2" sx={{ mr: 1 }}>
              Zoom: {Math.round(zoomLevel * 100)}%
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleZoom('out')}
              disabled={zoomLevel <= 0.6}
            >
              <ZoomOutIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleZoom('in')}
              disabled={zoomLevel >= 1.5}
            >
              <ZoomInIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      {/* Contenedor del mapa con dos columnas cuando hay una habitación seleccionada */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={selectedRoom ? 8 : 12}>
          {/* Contenedor del mapa */}
          <Box
            sx={{
              width: '100%',
              overflow: 'auto',
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: 2,
              height: '500px',
              background: '#f5f5f5',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: width * zoomLevel,
                height: height * zoomLevel,
                border: '1px dashed #ccc',
                borderRadius: 1,
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 89px, #dddddd 89px, #dddddd 90px), repeating-linear-gradient(90deg, transparent, transparent 89px, #dddddd 89px, #dddddd 90px)',
                transition: 'all 0.3s ease',
                transformOrigin: 'top left',
              }}
            >
              {/* Renderizar indicadores de pasillos */}
              {Array.from({ length: Math.ceil(height / 90) }).map(
                (_, index) => (
                  <Box
                    key={`corridor-h-${index}`}
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: `${index * 90 * zoomLevel + 45 * zoomLevel}px`,
                      width: '100%',
                      height: '2px',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    }}
                  />
                )
              )}

              {Array.from({ length: Math.ceil(width / 90) }).map((_, index) => (
                <Box
                  key={`corridor-v-${index}`}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: `${index * 90 * zoomLevel + 45 * zoomLevel}px`,
                    height: '100%',
                    width: '2px',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  }}
                />
              ))}

              {/* Renderizar habitaciones */}
              {currentFloorRooms.map(room => (
                <RoomTile key={room.id} room={room} onClick={handleRoomClick} />
              ))}
            </Box>
          </Box>

          {/* Estadísticas */}
          <Box mt={2}>
            {' '}
            <Typography variant="subtitle2">
              Habitaciones totales en el piso {validCurrentFloor}:{' '}
              {currentFloorRooms.length}
            </Typography>
            <Typography variant="subtitle2">
              Habitaciones ocupadas:{' '}
              {currentFloorRooms.filter(room => room.occupied).length}
            </Typography>
            <Typography variant="subtitle2">
              Habitaciones disponibles:{' '}
              {currentFloorRooms.filter(room => !room.occupied).length}
            </Typography>
          </Box>
        </Grid>

        {/* Panel de detalles de la habitación seleccionada */}
        {selectedRoom && (
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Detalles de la Habitación
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BedIcon
                  sx={{
                    mr: 1,
                    color: selectedRoom.occupied ? '#f44336' : '#4caf50',
                  }}
                />
                <Typography variant="h5">
                  Habitación {selectedRoom.number}
                </Typography>
                <Chip
                  label={selectedRoom.occupied ? 'Ocupada' : 'Disponible'}
                  color={selectedRoom.occupied ? 'error' : 'success'}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>

              <Typography variant="body1">
                <strong>Tipo:</strong> {selectedRoom.type || 'Estándar'}
              </Typography>
              <Typography variant="body1">
                <strong>Capacidad:</strong> {selectedRoom.capacity} personas
              </Typography>
              {selectedRoom.description && (
                <Typography variant="body1">
                  <strong>Descripción:</strong> {selectedRoom.description}
                </Typography>
              )}

              {selectedRoom.occupied && selectedRoom.reservationInfo && (
                <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle1">
                    Información de Reserva
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cliente:</strong>{' '}
                    {selectedRoom.reservationInfo.clientName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Check-in:</strong>{' '}
                    {new Date(
                      selectedRoom.reservationInfo.checkIn
                    ).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Check-out:</strong>{' '}
                    {new Date(
                      selectedRoom.reservationInfo.checkOut
                    ).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Huéspedes:</strong>{' '}
                    {selectedRoom.reservationInfo.guestCount}
                  </Typography>
                </Box>
              )}

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setSelectedRoom(null)}
              >
                Cerrar detalles
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default RoomFloorMap;
