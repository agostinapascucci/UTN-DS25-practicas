import app from './app'

// Puerto desde env ( con default 3000)
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running...`);
});
