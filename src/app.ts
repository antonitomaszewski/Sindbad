import express from 'express';
import userRoutes from './routes/userRoutes';
import cruiseRoutes from './routes/cruiseRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint testowy
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});


// Trasy użytkownika
app.use('/api/users', userRoutes);
app.use('/api/cruises', cruiseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/review', reviewRoutes);


// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

export { app };