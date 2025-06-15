import React from 'react';
import { NewLayout } from './components/NewLayout';
import './estilosLayout.css';
import { BookCard } from './components/BookCard';
import { Destacados } from './components/Destacados'

function App() {
  return (
    <>
      <NewLayout logo={"https://img.freepik.com/vector-gratis/zapato-cristal-brillante-cenicienta_23-2148470395.jpg"} tituloSeccion="Libros Destacados" children={<Destacados/>}/>
    </>
  )
}

export default App
