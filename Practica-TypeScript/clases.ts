class Sandwich {
    constructor(
        public name: string,
        public ingredients: string[],
        public price: number
    ) {}
    
    getDescription(): string {
        return `${this.name} with ${this.ingredients.join(', ')} - $${this.price.toFixed(2)}`;
    }
}


const sandwiches = new Sandwich('Club Sandwich', ['Turkey', 'Bacon', 'Lettuce', 'Tomato'], 8.99);
const sandwichDescription = sandwiches.getDescription();
console.log(sandwichDescription);

// También puede utilizarse el private o el protected
class ProtectedSandwich {
    constructor(
        public name: string,
        protected ingredients: string[],
        private price: number
    ) {}
    
    getDescription(): string {
        return `${this.name} with ${this.ingredients.join(', ')} - $${this.price.toFixed(2)}`;
    }
}
const protectedSandwich = new ProtectedSandwich('BLT', ['Bacon', 'Lettuce', 'Tomato'], 7.99);
protectedSandwich.price 
// Aparece como error, ya que es private y no se puede acceder directamente
protectedSandwich.ingredients
// Tampoco se puede acceder directamente, ya que es protected

class ChildSandwich extends ProtectedSandwich {
    constructor(name: string, ingredients: string[], price: number) {
        super(name, ingredients, price);
    }
    
    getChildDescription(): string {
        return `Child Sandwich: ${this.name} with ${this.ingredients.join(', ')}`;
    }
} // Desde una clase hija sí se puede acceder a los atributos protected

/*________________________________________________________________________*/

// Interfaces y clases
interface SandwichInterface {
    name: string;
    ingredients: string[];
    price: number;
    getDescription(): string;
}

class InterfaceSandwich implements SandwichInterface {
    constructor(
        public name: string,
        public ingredients: string[],
        public price: number
        public hola: string = 'Hola Mundo' // Esto es un error, ya que no está definido en la interfaz
    ) {}
    
    getDescription(): string {
        return `${this.name} with ${this.ingredients.join(', ')} - $${this.price.toFixed(2)}`;
    }

    getName(): string {
        return this.name;
    }
}