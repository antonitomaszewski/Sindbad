import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint testowy
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});


// Trasy użytkownika
app.use('/api/users', userRoutes);

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});