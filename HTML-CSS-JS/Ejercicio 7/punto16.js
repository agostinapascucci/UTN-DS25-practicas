document.addEventListener('DOMContentLoaded', () => {
    // Variables de estado
    let pisoActual = '';
    let deptoActual = '';
    let seleccionActual = ''; // Puede ser "piso" o "depto"

    // Referencias al visor
    const visor = document.getElementById("visor");

    // Función para validar piso y departamento
    function validarEntrada() {
        const pisoNum = parseInt(pisoActual);
        const dptoNum = parseInt(deptoActual);
        
        if (pisoActual.length !== 2) {
            return "El piso debe tener 2 dígitos (00-48)";
        }
        
        if (pisoNum < 0 || pisoNum > 48) {
            return "El piso debe estar entre 00 y 48";
        }
        
        if (dptoNum < 1 || dptoNum > 6) {
            return "El departamento debe estar entre 1 y 6";
        }
        
        return "válido";
    }

    // Botones especiales
    document.getElementById("Piso").addEventListener("click", () => {
        seleccionActual = 'piso';
        actualizarVisor();
    });

    document.getElementById("Depto").addEventListener("click", () => {
        seleccionActual = 'depto';
        actualizarVisor();
    });

    // Función para actualizar el visor
    function actualizarVisor(mensaje = '') {
        if (mensaje) {
            visor.textContent = mensaje;
            return;
        }
        visor.textContent = `Piso: ${pisoActual || '--'} | Dpto: ${deptoActual || '-'}`;
    }

    // Botón Llamar
    document.getElementById("call").addEventListener("click", () => {
        if (!pisoActual || !deptoActual) {
            actualizarVisor("Debe ingresar piso y departamento");
            return;
        }

        const validacion = validarEntrada();
        if (validacion === "válido") {
            actualizarVisor(`Llamando al piso ${pisoActual}, dpto ${deptoActual}`);
        } else {
            actualizarVisor(validacion);
        }
    });

    // Botón Borrar
    document.getElementById("clean").addEventListener("click", () => {
        pisoActual = '';
        deptoActual = '';
        seleccionActual = '';
        actualizarVisor();
    });

    // Función para agregar número
    function agregarNumero(num) {
        if (!seleccionActual) {
            actualizarVisor('Seleccione Piso o Dpto antes de ingresar números');
            return;
        }

        if (seleccionActual === 'piso') {
            if (pisoActual.length < 2) {
                pisoActual += num;
            }
        } else if (seleccionActual === 'depto') {
            if (deptoActual.length < 1) {
                deptoActual += num;
            }
        }
        actualizarVisor();
    }

    // Asociar botones numéricos
    document.getElementById("one").addEventListener("click", () => agregarNumero('1'));
    document.getElementById("two").addEventListener("click", () => agregarNumero('2'));
    document.getElementById("three").addEventListener("click", () => agregarNumero('3'));
    document.getElementById("four").addEventListener("click", () => agregarNumero('4'));
    document.getElementById("five").addEventListener("click", () => agregarNumero('5'));
    document.getElementById("six").addEventListener("click", () => agregarNumero('6'));
    document.getElementById("seven").addEventListener("click", () => agregarNumero('7'));
    document.getElementById("eight").addEventListener("click", () => agregarNumero('8'));
    document.getElementById("nine").addEventListener("click", () => agregarNumero('9'));
    document.getElementById("zero").addEventListener("click", () => agregarNumero('0'));
});
