import express from 'express';
import userRoutes from './routes/userRoutes';
import cruiseRoutes from './routes/cruiseRoutes';

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

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});