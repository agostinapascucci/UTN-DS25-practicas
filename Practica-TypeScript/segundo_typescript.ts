// Enumerativas
enum ERROR_TYPES {
	NOT_FOUND,
	UNAUTHORIZED,
	FORBIDDEN
}

// Para utilizarla:
function mostrarMensaje (tipoDeError: ERROR_TYPES) {
	if (tipoDeError == ERROR_TYPES.NOT_FOUND) {
		console.log('No se encuentra el recurso')
	} else if (tipoDeError == ERROR_TYPES.UNAUTHORIZED) {
		console.log('No tienes permisos para acceder')
	} else if (tipoDeError == ERROR_TYPES.FORBIDDEN) {
		console.log('No tienes permisos para acceder')
	}
}

// Enums + constants
const enum ERROR_MESSAGES {
    NOT_FOUND = 'No se encuentra el recurso',   
    UNAUTHORIZED = 'No tienes permisos para acceder',
    FORBIDDEN = 'No tienes permisos para acceder'
}

// Asercion de tipos
const canvas = document.getElementById('canvas');
if (canvas instanceof HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
    }
}

// Interfaces
interface Persona {
    name: string;
    age: number;
    saludar: () => void;
}
const personaInterface: Persona = {
    name: "Ana",
    age: 28,
    saludar() {
        console.log(`Hola, me llamo ${this.name} y tengo ${this.age} años.`);
    },
}

// Interfaces dentro de otras interfaces
interface Producto {
    id: number;
    name: string;
    price: number;
    category: {
        id: number;
        name: string;
    };
}

interface Carrito {
    productos: Producto[];
    total: number;
    agregarProducto: (producto: Producto) => void;
}

// Narrowing
interface Mario {
    company: 'Nintendo';
    nombre: string;
    saltar: () => void;
}

interface Sonic {
    company: 'Sega';
    nombre: string;
    correr: () => void;
}

function jugar(personaje: Mario | Sonic) {
    if (personaje.company === 'Nintendo') {
        console.log(`Mario: ${personaje.nombre}`);
        personaje.saltar();
        return
    }

    // Si llega aquí, es Sonic
    console.log(`Sonic: ${personaje.nombre}`);
    personaje.correr();
}