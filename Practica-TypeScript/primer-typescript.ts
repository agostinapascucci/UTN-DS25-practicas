const variable1: number = 123;
console.log(variable1);

// Objeto

const persona: { name: string; age: number } = {
    name: "Juan",
    age: 25,
}

function saludar(name: string): void {
	console.log(`Hola ${name}`)
}

function saludarPersona(persona: { name: string; age: number }): void {
    console.log(`Hola ${persona.name}, tienes ${persona.age} años.`);
}

// Arrow function
const sayHi = (name: string): void => {
    console.log(`Hola ${name}`);
}

const sayHiFromFunction = (fn : (name: string) => void) : void => {
    fn("Juan");
}

// Uso de las funciones
sayHiFromFunction(sayHi)

// Return never
function throwError(message: string): never {
    throw new Error(message);
}
// Template Union Types
type HeroID = `${string}-${string}-${string}-${string}-${string}`

// Union Types
type HeroPowerScale = 'local' | 'planetary' | 'galactic' | 'universal' | 'multiversal'

// Type alias

type HeroBasicInfo =
{
    name: string;
    age: number;
}

type HeroProperties =
{
    readonly id?: HeroID
    isActive: boolean;
    powerScale?: HeroPowerScale; // Propiedad opcional
}

type Hero = HeroBasicInfo & HeroProperties;

const hero: HeroBasicInfo = {
    name: "Superman",
    age: 30,
}

function createHero(input: HeroBasicInfo): Hero {
    const { name, age } = input;

    return {
        name,
        age,    
        id: crypto.randomUUID() as HeroID, // Generación de un ID único
        isActive: true,
        powerScale: undefined, // Inicialización de la propiedad opcional
    };               
} 

const Superman = createHero(hero);
Superman.powerScale = "planetary"; // Asignación de un valor a la propiedad opcional

// Type Indexing
type HeroPropertiesIndex = {
	isActive: boolean,
	address: {
		planet: string,
		city: string,
	}
}

const adressHero: HeroPropertiesIndex['address'] = {
	planet: 'Earth',
	city: 'Madrid'
}

// Type con Constants
const address = {
	planet: 'Earth',
	city: 'Madrid'
}

type Address = typeof address 

//Type form function return
function createAddress() {
	return {
		planet: 'Tierra',
		city: 'Barcelona'
	}
}
type AddressR = ReturnType<typeof createAddress>

// Arrays 

const languages: string[] = ['JavaScript', 'TypeScript', 'Python']; // Array de Strings
const numbers: Array<number> = [1, 2, 3, 4, 5]; // Array de Números, otra forma de definir un array

// Agregar un elemento al array
languages.push('Java');

// Agregar más de un tipo de dato al array
const mixedArray: (string | number)[] = ['JavaScript', 42, 'TypeScript', 100];

// Se pueden crear arrays con tus propios tipos
const heroesWBI : HeroBasicInfo[] = []

// Crear matrices
const matrix: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

type CellValue = 'X' | 'O' | null;
type GameBoard = [
    [CellValue, CellValue, CellValue],
    [CellValue, CellValue, CellValue],
    [CellValue, CellValue, CellValue]
]

const ticTacToeBoard: GameBoard = [
    ['X', null, 'O'],
    [null, 'X', null],
    [null, 'O', 'X']
];

// Tuplas
const heroTuple: [string, number, HeroPowerScale] = ['Superman', 30, 'planetary'];