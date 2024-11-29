const selectUsuario = document.getElementById('usuario');
const selectRey = document.getElementById('rey');
const listaDeJuguetes = document.getElementById('listaJuguetes');
const listaDeCarta = document.getElementById('listaCarta');
const nombreDelRey = document.getElementById('nombreRey');
const nombreDelUsuario = document.getElementById('nombreUsuario');
const edadDelUsuario = document.getElementById('edadUsuario');
const buscadorJuguete = document.getElementById('buscarJuguete');
const listaJuguetes = document.getElementById('listaJuguetes');
const botonCrear = document.getElementById('crearCarta');

// Función para cargar usuarios y reyes magos 
async function cargarDatos() {
    const respuestaUsuarios = await fetch('http://127.0.0.1:8000/usuarios');
    const usuarios = await respuestaUsuarios.json();

    const respuestaReyes = await fetch('http://127.0.0.1:8000/reyes_magos');
    const reyes = await respuestaReyes.json();

    const respuestaJuguetes = await fetch('http://127.0.0.1:8000/juguetes');
    const juguetes = await respuestaJuguetes.json();

    // Llenar el select de usuarios
    const opcionUsuarioPorDefecto = document.createElement('option');
    opcionUsuarioPorDefecto.value = '';
    selectUsuario.appendChild(opcionUsuarioPorDefecto);

    usuarios.forEach(usuario => {
        const opcion = document.createElement('option');
        opcion.value = usuario.id;
        opcion.textContent = usuario.nombre;
        selectUsuario.appendChild(opcion);
    });

    // Llenar el select de reyes
    const opcionReyPorDefecto = document.createElement('option');
    opcionReyPorDefecto.value = '';
    selectRey.appendChild(opcionReyPorDefecto);

    reyes.forEach(rey => {
        const opcion = document.createElement('option');
        opcion.value = rey.id;
        opcion.textContent = rey.nombre;
        selectRey.appendChild(opcion);
    });

    // Mostrar juguetes
    juguetes.forEach(juguete => {
        const divJuguete = document.createElement('div');
        divJuguete.className = 'juguete';
        divJuguete.innerHTML = `
                    <img src="../IMG/${juguete.imagen}.png" alt="${juguete.nombre}">
                    <p>${juguete.nombre}</p>
                    <button class="añadir">+</button>
                `;
        divJuguete.querySelector('button').addEventListener('click', () => {
            agregarAJuguetes(juguete);
        });
        listaDeJuguetes.appendChild(divJuguete);
    });
}

// Función para agregar juguetes a la carta
function agregarAJuguetes(juguete) {
    const li = document.createElement('li');

    const imagen = document.createElement('img');
    imagen.src = `../IMG/${juguete.imagen}.png`;
    imagen.style.width = '50px';
    imagen.alt = juguete.nombre;

    const nombreJuguete = document.createElement('p');
    nombreJuguete.textContent = juguete.nombre;
    nombreJuguete.id = juguete.id;

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'X';
    botonEliminar.className = 'eliminar';
    botonEliminar.addEventListener('click', () => {
        li.remove();
    });

    li.appendChild(imagen);
    li.appendChild(nombreJuguete);
    li.appendChild(botonEliminar);

    listaDeCarta.appendChild(li);
}

// Buscador de juguetes
buscadorJuguete.addEventListener('input', () => {
    const filtro = buscadorJuguete.value.toLowerCase();

    const juguetesDivs = listaJuguetes.querySelectorAll('.juguete');
    juguetesDivs.forEach(div => {
        const nombreJuguete = div.querySelector('p').textContent.toLowerCase();
        if (nombreJuguete.includes(filtro)) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
});


// Al seleccionar un usuario u otro actualizar la carta dinámicamente
selectUsuario.addEventListener('change', async () => {
    const idUsuarioSeleccionado = selectUsuario.value;

    if (!idUsuarioSeleccionado) {
        nombreDelUsuario.textContent = '';
        edadDelUsuario.textContent = '';
        return;
    }
    const respuestaUsuarios = await fetch('http://127.0.0.1:8000/usuarios');
    const usuarios = await respuestaUsuarios.json();
    const usuarioSeleccionado = usuarios.find(usuario => usuario.id == idUsuarioSeleccionado);

    if (usuarioSeleccionado) {
        nombreDelUsuario.textContent = usuarioSeleccionado.nombre;
        edadDelUsuario.textContent = usuarioSeleccionado.edad;
    } else {
        console.error('Usuario no encontrado.');
    }
});

//Al seleccionar un rey u otro que se cambie dinamicamente el campo de la carta
selectRey.addEventListener('change', async () => {
    const idReySeleccionado = selectRey.value;
    const respuestaReyes = await fetch('http://127.0.0.1:8000/reyes_magos');
    const reyes = await respuestaReyes.json();
    const reySeleccionado = reyes.find(rey => rey.id == idReySeleccionado);
    if (reySeleccionado) {
        nombreDelRey.textContent = reySeleccionado.nombre;
    } else {
        console.error('Rey no encontrado.');
    }
});


cargarDatos();

//Evento para volver al index.html
const botonVolver = document.getElementById('volver');
botonVolver.addEventListener('click', () => {
    window.location.href = "../../index.html";
});

//Evento para crear una carta, no teniendo campos vacíos
botonCrear.addEventListener('click', async () => {
    const idUsuario = selectUsuario.value;
    const idRey = selectRey.value;
    const juguetesSeleccionados = [];

    listaDeCarta.querySelectorAll('li').forEach(e => {
        const elementoP = e.querySelector('p');
        if (elementoP) {
            const idJuguete = elementoP.id;
            if (idJuguete) {
                juguetesSeleccionados.push(idJuguete);
            }
        }
    });
    
    // Verificar que todos los campos
    if (!idUsuario || !idRey || listaDeCarta.length === 0 || juguetesSeleccionados.length === 0) {
        alert('Por favor, selecciona un usuario, un rey y al menos un juguete.');
        return;
    }

    // Crear el objeto de la carta
    const carta = {
        usuario_id: idUsuario,
        rey_mago_id: idRey,
        juguetes_ids: juguetesSeleccionados,
    };

    try {
        const respuesta = await fetch('http://127.0.0.1:8000/cartas/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carta),
        });

        if (respuesta.ok) {
            alert('¡Carta creada!');
            listaDeCarta.innerHTML = ''; 
            selectUsuario.value = '';
            selectRey.value = '';
        } else {
            alert('Error al crear la carta. Inténtalo de nuevo.');
        }
    } catch (error) {
        alert('No se pudo enviar la carta. Revisa la conexión.');
    }
});



