const formularioRey = document.getElementById('formReyes');
const botonCrear = document.getElementById('crearRey');
const listaReyesDiv = document.getElementById('listaReyes');

// Función para crear la tabla si no existe
function crearTablaReyes() {
    if (document.getElementById('tablaReyes')) return;

    const tablaReyes = document.createElement('table');
    tablaReyes.id = "tablaReyes";
    listaReyesDiv.appendChild(tablaReyes);

    const thead = document.createElement('thead');
    const trEncabezado = document.createElement('tr');
    thead.appendChild(trEncabezado);

    const thNombre = document.createElement('th');
    thNombre.textContent = 'Nombre';
    const thAcciones = document.createElement('th');
    thAcciones.textContent = 'Acciones';

    trEncabezado.appendChild(thNombre);
    trEncabezado.appendChild(thAcciones);

    tablaReyes.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.id = 'reyesTabla';
    tablaReyes.appendChild(tbody);
}

// Función para agregar un rey a la tabla
function agregarReyATabla(rey) {
    const tbody = document.getElementById('reyesTabla');
    const tr = document.createElement('tr');

    const tdNombre = document.createElement('td');
    tdNombre.textContent = rey.nombre;
    tr.appendChild(tdNombre);

    const tdAcciones = document.createElement('td');
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';

 
    // Agregar funcionalidad al botón de eliminar
    btnEliminar.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/reyes_magos/${rey.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert(`${rey.nombre} eliminado con éxito.`);
                tr.remove();
                actualizarVisibilidadTabla(); 
            } else {
                alert('Hubo un problema al eliminar el rey.');
            }
        } catch (error) {
            alert('Error al conectar con el servidor.');
        }
    });
    

    tdAcciones.appendChild(btnEliminar);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
    actualizarVisibilidadTabla(); 
}

//Función para mostrar la tabla o para ocultarla si hay campos o no
function actualizarVisibilidadTabla() {
    const tablaReyes = document.getElementById('tablaReyes');
    const tbody = document.getElementById('reyesTabla');
    if (tbody && tbody.children.length > 0) {
        tablaReyes.style.display = 'table';
    } else {
        tablaReyes.style.display = 'none';
    }
}

//Función para obtener los reyes magos
async function obtenerReyes() {
    try {
        const response = await fetch('http://127.0.0.1:8000/reyes_magos/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const reyes = await response.json();
            reyes.forEach(rey => agregarReyATabla(rey));
        } else {
            console.log('No se pudieron obtener los reyes');
        }
        actualizarVisibilidadTabla(); 
    } catch (error) {
        console.log('Error al obtener los reyes:', error);
    }
}


crearTablaReyes();
obtenerReyes();

//Evento para crear al rey mago
botonCrear.addEventListener('click', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const nombresPosibles = ["Baltasar", "Melchor", "Gaspar"];

    if (!nombresPosibles.includes(nombre)) {
        alert("Nombre no válido. Los nombres disponibles son: Baltasar, Melchor y Gaspar");
        return;
    }
    try {

        const response = await fetch('http://127.0.0.1:8000/reyes_magos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre }),
        });

        if (response.ok) {
            const data = await response.json();
            alert('Rey creado con éxito.');
            agregarReyATabla(data);

        } else {
            alert('Hubo un problema al crear el rey.');
        }
    } catch (error) {
        alert('Error al conectar con el servidor.');
    }
});

const botonVolver = document.getElementById('volver');
//Evento para volver al index.html
botonVolver.addEventListener('click', () => {
    window.location.href = "../../index.html";
});


