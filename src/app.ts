import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware do obsługi JSON
app.use(express.json());

// Endpoint testowy
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});