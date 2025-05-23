// /*1. Definir una variable numérica, asignarle un valor y sumarle 5. */ 

// let numero1=10;
// numero1+=5;
// alert(numero1);

// /*2. Definir dos variables de cadenas, asignarles valores y concatenarlas. */ 
// let cadena1="Hola";
// let cadena2="Mundo";
// alert(cadena1+cadena2)

// /*3. Evaluar si dos números son iguales, diferentes, mayor o menor. Resolver utilizando 
// “if”/”else”. */
// let numero2=prompt("Ingrese un número");
// if(numero1>numero2){
//     alert(`El numero ${numero1} es mayor que el numero ${numero2}.`);
// }
// else if(numero1<numero2){
//     alert(`El numero ${numero2} es mayor que el numero ${numero1}.`);
// }
// else{
//     alert(`Numero 1: ${numero1}\nNumero 2: ${numero2}\nLos numeros son iguales.`);
// }

// /*4. Utilizando “switch”. Definir una variable numérica. Asignarle un valor entre 1 y 10; mostrar a 
// qué grupo pertenece: 
// ○ Grupo 1: del 1 al 3 
// ○ Grupo 2: del 4 al 6 
// ○ Grupo 3: del 7 al 10 - 
// Modifiquemos el ejercicio para que el número lo ingrese el usuario (con “prompt”). */
// let numero3=prompt("Ingrese un número del 1-10");
// switch (numero3){
//     case '1':
//     case '2':
//     case '3':
//         alert("Pertenece al Grupo 1");
//         break;
//     case '4':
//     case '5':
//     case '6':
//         alert("Pertenece al Grupo 2");
//         break;
//     case '7':
//     case '8':
//     case '9':
//     case '10':
//         alert("Pertenece al Grupo 3");
//         break;
//     default:
//         alert("No pertenece a ningun grupo");
//         break;
// }

// /*5. Realizar la sumatoria de 0 a 10 y devolver el valor de la misma. */
// let suma=0;
// for(var i=0; i<=10; i++){
//     suma+=i;
// }
// alert("Suma de 0 a 10: "+suma);

// /*6. Generar un array con 10 números, recorrerlo e ir multiplicando todos los elementos, 
// finalmente obtener el producto total.  */
// let arrayNumeros=[1, 3, 5, 7, 9, 11, 13, 15, 17, 21];
// let multiplicacion=1;
// for(var j=0; j<10; j++){
//     multiplicacion*=arrayNumeros[j];
// }
// alert("Resultado multiplicacion numeros impares del 1-21: "+multiplicacion);

// /*7. Crear una función que reciba dos valores y retorne el producto de los mismos. */
// function multiplicar(num1, num2){
//     return num1*num2;
// }

// numero1=prompt("Ingrese un numero: ");
// numero2=prompt("Ingrese otro numero: ");
// alert(numero1+"*"+numero2+"="+multiplicar(numero1,numero2));


// /*8. Crear una función que reciba dos cadenas y retorne la concatenación de la misma. */
// function concatenar(cad1, cad2){
//     return cad1+cad2;
// }
// cadena1=prompt("Ingrese una cadena: ");
// cadena2=prompt("Ingrese otra cadena: ");
// alert(`Cadena 1: ${cadena1} \nCadena 2: ${cadena2} \nConcatenacion: ${concatenar(cadena1,cadena2)}`);

// /*9. Crear una función, a partir de la lógica aplicada en ejercicio 3, que reciba dos valores y 
// muestre cuál es el mayor. En caso de ser iguales, deberá indicarlo. */
// function esMayor(num1, num2){

//     if(num1>num2){
//     alert(`El numero ${num1} es mayor que el numero ${num2}.`);
//     }
//     else if(num1<num2){
//         alert(`El numero ${num2} es mayor que el numero ${num1}.`);
//     }
//     else{
//         alert(`Numero 1: ${num1}\nNumero 2: ${num2}\nLos numeros son iguales.`);
//     }
// }

// numero1=prompt("Ingrese el numero 1: ");
// numero2=prompt("Ingrese el numero 2: ");
// esMayor(numero1, numero2);

// /*10. Crear una función que reciba un número y muestre tantos asteriscos como la cantidad de 
// veces que se pasó como parámetro. */

// function asteriscos(cantidad){
//     // Validar que el parámetro sea un número  y que sea positivo
//     if (!Number.isInteger(cantidad) || cantidad < 0) {
//         return "Por favor, ingrese un número entero positivo";
//     }
    
//     // Crear y retornar el string con los asteriscos
//     return "*".repeat(cantidad);

// }

// let cantAsteriscos = parseInt(prompt("Ingrese cantidad de asteriscos: "));
// alert(asteriscos(cantAsteriscos));

// /*11. Crear una función que reciba el monto de un producto, y el medio de pago: C (tarjeta de 
// crédito), E (efectivo) y D (tarjeta de débito).  
// Si el monto del producto es menor a $200 no se aplicará ningún descuento, pero si el monto 
// a abonar es entre $200 y $400 se aplicará un descuento del 30% si el medio de pago es 
// efectivo, 20% si se realiza con débito y 10% con tarjeta de crédito.  
// Para montos mayores a $400, el descuento es el mismo sin importar el medio de pago, 
// dicho descuento es del 40%.   */

// function montoFinal(monto, medioP){
//     if(medioP != 'E' && medioP != 'C' && medioP != 'D' ){
//          return 'El medio de pago no es valido.';
//     }
//     else {
//         if (monto >= 200 && monto<= 400){
//             switch(medioP){
//                 case 'C':
//                     return 'El monto total es $'+monto*0.9;
//                 case 'E':
//                     return 'El monto total es $'+monto*0.7;
//                 case 'D':
//                     return 'El monto total es $'+monto*0.8;
            
//             }
//         }
//         else if (monto>400){
//             return 'El monto total es $'+monto*0.6;
//         }
//         else{
//             return 'El monto total es $'+monto;
//         }
//     }
    
// }

// let monto = parseFloat(prompt("Ingrese monto a pagar: "));
// let medioP = prompt("'C'-> Tarjeta de Crédito \n'E'-> Efectivo \n'D'-> Tarjeta de Débito \nIngrese medio de pago:")
// alert(montoFinal(monto, medioP));

// /*12. Crear una función que reciba un número que represente la altura de un medio-árbol. 
// Deberá generar de manera escalonada el mismo. Ejemplo: si la altura es 5 deberá mostrar: 
// * 
// * * 
// * * * 
// * * * * 
// * * * * *  */
function escalera(altura){
    if (!Number.isInteger(altura) || altura <= 0) {
        return "Por favor, ingrese un número entero positivo";
    }
    
    let arbol = '';
    
    for (let k = 1; k <= altura; k++) {
        arbol += '* '.repeat(k);
        if (k < altura) { // Se agrega un salto de línea, menos en la ultima.
            arbol += '\n';
        }
    }
    return arbol;
}

// let alturaA = parseInt(prompt("Arbol de asteriscos\nIngrese altura: "));
// alert(escalera(alturaA));

/*13. Crear una función que reciba un número que indica el día de la semana y retorne una cadena 
de texto indicando a qué día corresponde. Ejemplo: si es 1, deberá retornar lunes, 2 
retornará martes, y así siguiendo. Si el día es 6 o 7 deberá retornar “fin de semana”. En caso 
de un valor que no represente un día de la semana deberá retornar un mensaje de error. */

// function diasSemana(dia){
//     if(!Number.isInteger(dia) || dia <= 0 || dia > 7){
//         return "Por favor, ingresar un numero del 1 al 7.";
//     }

//     switch(dia){
//         case 1:
//             return "Lunes";
//         case 2:
//             return "Martes";
//         case 3:
//             return "Miercoles";
//         case 4:
//             return "Jueves";
//         case 5:
//             return "Viernes";
//         case 6:
//         case 7:
//             return "Fin de semana";
//     }
// }

// let dia = parseInt(prompt("Dias de la semana\nIngrese un  numero del 1 al 7: "));
// alert(diasSemana(dia));

/*14. Crear una función que genere un array de varios elementos numéricos y muestre por 
pantalla el promedio de esos números. El tamaño y los valores deben ser ingresados por el 
usuario (comando prompt) en dicho orden.  
TIP: El dato ingresado con prompt es de tipo string, usar split() para quitar los espacios y 
usar la función Number para transformarlo.  */

// function promedioArray(arraynumeros){
//     let sumaArray = 0;
    
//     // Verificar si el array está vacío
//     if (arraynumeros.length === 0) {
//         return "El array está vacío";
//     }

//     // Verificar si todos los elementos son números válidos
//     for (let l = 0; l < arraynumeros.length; l++) {
//         if (isNaN(arraynumeros[l])) {
//             return "Error: Todos los elementos deben ser números";
//         }
//         sumaArray += arraynumeros[l];
//     }

//     // Calcular y retornar el promedio
//     return "El promedio es: " + (sumaArray / arraynumeros.length).toFixed(2);
// }

// let entrada = prompt("Promedio Array\nIngrese un array de números (sepárelos por comas): ");
// let numeros = entrada.split(',').map(num => Number(num.trim()));
// alert(promedioArray(numeros));

/*15. Utilizar la función que genera el medio-árbol (ejercicio 12): crear un campo de entrada que 
le permita al usuario ingresar la altura del mismo. Incluir un botón que al presionarlo, 
invoque a la función generada previamente con el valor ingresado por el usuario para que la 
misma muestre el medio-árbol. 
Deberá incluir validación de datos ingresados por el usuario.*/

function mostrarArbol(){
    const input = document.getElementById("altura").value;
    const altura = Number(input);
    const resultado = document.getElementById("resultado");
    const error = document.getElementById("error");

    if (!Number.isInteger(altura) || altura<=0 ){
        resultado.textContent = '';
        error.textContent = "Por favor, ingrese un número entero positivo.";
        return;
    }

    error.textContent = '';
    resultado.textContent = escalera(altura);
}