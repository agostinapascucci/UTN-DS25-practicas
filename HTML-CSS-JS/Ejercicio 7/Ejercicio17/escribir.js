// Arrays para cada fila del teclado
const numerosRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '¿', 'BackSpace'];
const primeraFila = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const segundaFila = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'];
const terceraFila = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '-'];

// Variable para almacenar el texto actual
let textoActual = '';

// Función para inicializar el teclado cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el elemento donde se muestra el texto
    const displayTexto = document.querySelector('.texto');
    
    // Función centralizada para mostrar el texto
    const actualizarDisplay = (texto) => {
        displayTexto.textContent = texto || 'Escribir...';
    };

    // Función para manejar el click en las teclas
    const manejarClickTecla = (e) => {
        const teclaValue = e.target.value;

        if (teclaValue === 'BackSpace') {
            // Eliminar el último carácter
            textoActual = textoActual.slice(0, -1);
        } else if (e.target.id === 'borrar') {
            // Borrar todo el texto
            textoActual = '';
        } else if (teclaValue === 'espace') {
            // Agregar espacio
            textoActual += ' ';
        } else if (teclaValue) {
            // Agregar la tecla presionada al texto
            textoActual += teclaValue;
        }

        actualizarDisplay(textoActual);
    };

    // Agregar event listeners a todos los botones
    const botones = document.querySelectorAll('button');
    botones.forEach(boton => {
        boton.addEventListener('click', manejarClickTecla);
    });
});
