import express from 'express';

const app = express();
const port = 3000;

// Endpoint de ejemplo 'Hola Mundo'
app.get('/', (req, res) => {
  res.send('¡Hola Mundo desde mi primera API con TypeScript y Express!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

export default app;