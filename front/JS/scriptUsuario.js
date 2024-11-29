const formularioUsuario = document.getElementById('formUsuario');
const botonCrear = document.getElementById('crearUsuario');
const listaUsuariosDiv = document.getElementById('listaUsuarios');

// Función para crear la tabla
function crearTablaUsuarios() {
    if (document.getElementById('tablaUsuarios')) return;

    const tablaUsuarios = document.createElement('table');
    tablaUsuarios.id = "tablaUsuarios";
    tablaUsuarios.style.display = 'none';
    listaUsuariosDiv.appendChild(tablaUsuarios);  

    const thead = document.createElement('thead');
    const trEncabezado = document.createElement('tr');
    thead.appendChild(trEncabezado);

    const thNombre = document.createElement('th');
    thNombre.textContent = 'Nombre';
    const thEdad = document.createElement('th');
    thEdad.textContent = 'Edad';
    const thAcciones = document.createElement('th');
    thAcciones.textContent = 'Acciones';

    trEncabezado.appendChild(thNombre);
    trEncabezado.appendChild(thEdad);
    trEncabezado.appendChild(thAcciones);

    tablaUsuarios.appendChild(thead);

    // Crear el cuerpo de la tabla
    const tbody = document.createElement('tbody');
    tbody.id = 'usuariosTabla'; 
    tablaUsuarios.appendChild(tbody);
}

// Función para mostrar u ocultar la tabla 
function actualizarVisibilidadTabla() {
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    const tbody = document.getElementById('usuariosTabla');
    if (tbody && tbody.children.length > 0) {
        tablaUsuarios.style.display = 'table';
    } else {
        tablaUsuarios.style.display = 'none';
    }
}

// Función para agregar un usuario a la tabla
function agregarUsuarioATabla(usuario) {
    const tbody = document.getElementById('usuariosTabla');
    const tr = document.createElement('tr'); 

    const tdNombre = document.createElement('td');
    tdNombre.textContent = usuario.nombre;
    tr.appendChild(tdNombre);

    const tdEdad = document.createElement('td');
    tdEdad.textContent = usuario.edad;
    tr.appendChild(tdEdad);
    
    const tdAcciones = document.createElement('td');
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/usuarios/${usuario.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert(`${usuario.nombre} eliminado con éxito.`);
                tr.remove(); 
                actualizarVisibilidadTabla(); 
            } else {
                alert('Hubo un problema al eliminar el usuario.');
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

//Función para obtener los usuarios
async function obtenerUsuarios() {
    try {
        const response = await fetch('http://127.0.0.1:8000/usuarios/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
            }
        });
        if (response.ok) {
            const usuarios = await response.json();
            usuarios.forEach(usuario => agregarUsuarioATabla(usuario)); 
        } else {
            console.log('No se pudieron obtener los usuarios');
        }
        actualizarVisibilidadTabla(); 
    } catch (error) {
        console.log('Error al obtener los usuarios:', error);
    }
}


crearTablaUsuarios();
obtenerUsuarios();

//Evento para crear al usuario
botonCrear.addEventListener('click', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const edad = parseInt(document.getElementById('edad').value);

    if (!nombre || !edad) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Validación para el nombre 
    const nombreRegex = /^.{1,10}$/;
    if (!nombreRegex.test(nombre)) {
        alert("El nombre no puede tener más de 10 caracteres.");
        return;
    }

    // Validación para la edad 
    if (isNaN(edad) || edad < 0 || edad > 15) {
        alert("La edad debe estar entre 0 y 15.");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/usuarios/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ nombre, edad }), 
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Usuario creado:', data);
            alert('Usuario creado con éxito.');
            agregarUsuarioATabla(data);

        } else {
            alert('Hubo un problema al crear el usuario.');
        }
    } catch (error) {
        alert('Error al conectar con el servidor.');
    }
});

const botonVolver = document.getElementById('volver');
botonVolver.addEventListener('click', () => {
    window.location.href = "../../index.html";
});