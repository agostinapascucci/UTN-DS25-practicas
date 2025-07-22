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
