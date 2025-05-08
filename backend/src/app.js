import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {clientRoutes} from './modules/clients/client.routes.js';
import {roomRoutes} from './modules/rooms/room.routes.js';
import {hotelRoutes} from './modules/hotels/hotel.routes.js';
import {reservationRoutes} from './modules/reservations/reservation.routes.js';


const app = express();

const PORT = process.env.PORT || 3000;
app.use(morgan('dev'));

app.use(cors({
    origin: 'http://localhost:5173', // o tu frontend real
    credentials: true,
}
));

app.use(express.json());

app.use('/api/clients', clientRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/reservations', reservationRoutes);


export default app;