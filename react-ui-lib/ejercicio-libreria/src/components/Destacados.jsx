
import imagen1 from '../assets/Imagenes/frenheit.jpg'
import imagen2 from '../assets/Imagenes/malinche.jpg'
import imagen3 from '../assets/Imagenes/el-nombre-del-viento-cronica-del-asesino-de-reyes-1.jpg'
import imagen4 from '../assets/Imagenes/siddharta.jpg'
import { BookCard } from './BookCard';

export function Destacados(){
    const destacados = [
        {id: 1 , titulo: "Farenheit 451", autor: "Ray Bradbury", imagen:imagen1},
        {id: 2, titulo: "Malinche", autor: "Laura Esquivel", imagen:imagen2},
        {id: 3, titulo: "El nombre del viento", autor: "Patrick Rothfuss", imagen:imagen3},
        {id:4, titulo: "Siddhartha", autor: "Hermann Hesse", imagen:imagen4 },
    ];

    return (
         <div className='books-grid'>
            {destacados.map((libro) => (
                <BookCard 
                    key={libro.id} 
                    {...libro} 
                />
            ))}
        </div>
    );

}
