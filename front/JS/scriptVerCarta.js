const selectUsuario = document.getElementById('usuario');
const listaCartas = document.getElementById('listaCartas');
const ordenarCartas = document.getElementById('ordenarCartasJuguetes');

// Función para cargar los usuarios desde la API
async function cargarUsuarios() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/usuarios`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const usuarios = await response.json();
            
            // Crear una opción por defecto
            const opcionUsuarioPorDefecto = document.createElement('option');
            opcionUsuarioPorDefecto.value = '';
            opcionUsuarioPorDefecto.textContent = 'Selecciona un usuario';
            selectUsuario.appendChild(opcionUsuarioPorDefecto);

            // Llenar el select con los usuarios obtenidos de la API
            usuarios.forEach(usuario => {
                const opcion = document.createElement('option');
                opcion.value = usuario.id;
                opcion.textContent = usuario.nombre;
                selectUsuario.appendChild(opcion);
            });

        } else {
            console.log('No se pudieron obtener los usuarios');
        }

    } catch (error) {
        console.error("Error cargando los usuarios:", error);
    }
}

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
            return reyes;


        } else {
            console.log('No se pudieron obtener los reyes');
        }

    } catch (error) {
        console.log('Error al obtener los reyes:', error);
    }
}


// Función para obtener las cartas de un usuario específico
async function obtenerCartas(idUsuario) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/cartas/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const cartas = await response.json();
            const reyes = await obtenerReyes();
            mostrarCartas(cartas.result, reyes);
        } else {
            console.log('No se pudieron obtener las cartas');
        }
    } catch (error) {
        console.log('Error al obtener las cartas:', error);
    }
}

function mostrarCartas(cartas, reyes) {
    listaCartas.innerHTML = '';


    if (cartas.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No se han encontrado cartas';
        listaCartas.appendChild(mensaje);
        return; 
    }

   
    const tabla = document.createElement('table');
    tabla.classList.add('tabla'); 

    const encabezado = document.createElement('thead');
    encabezado.innerHTML = `
            <tr>
                <th>Carta</th>
                <th>Rey Mago</th>
                <th>Cantidad</th>
                <th>Acciones</th>
            </tr>
        `;
    tabla.appendChild(encabezado);

  
    const cuerpoTabla = document.createElement('tbody');
    cartas.forEach((carta, i) => {
        const rey = reyes.find(rey => rey.id === carta.rey_mago_id);
        const nombreRey = rey ? rey.nombre : 'No encontrado';
        const fila = document.createElement('tr');
        fila.innerHTML = `
                <td>Carta ${i + 1}</td>
                <td>${nombreRey}</td> 
                <td>${carta.juguetes_ids.length}</td>
                <td>
                    <button class="eliminar" onclick="eliminarCarta(${carta.id})">X</button>
                </td>
            `;
        cuerpoTabla.appendChild(fila);
    });
    
    tabla.appendChild(cuerpoTabla);
    listaCartas.appendChild(tabla);
}

// Función para eliminar una carta
async function eliminarCarta(idCarta) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/cartas/${idCarta}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            alert('Carta eliminada correctamente');
        } else {
            console.log('No se pudo eliminar la carta');
        }
    } catch (error) {
        console.log('Error al eliminar la carta:', error);
    }
}


// Llamar a obtenerCartas cuando el usuario sea seleccionado
selectUsuario.addEventListener('change', (event) => {
    const idUsuarioSeleccionado = event.target.value;
    if (idUsuarioSeleccionado) {
        obtenerCartas(idUsuarioSeleccionado);
    }
});

cargarUsuarios();
obtenerReyes();

const botonVolver = document.getElementById('volver');
botonVolver.addEventListener('click', () => {
    window.location.href = "../../index.html";
});



