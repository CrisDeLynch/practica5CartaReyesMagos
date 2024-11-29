const botonBuscar = document.getElementById('botonBuscar');
const fotoArchivo = document.getElementById('fotoArchivo');
const nombreArchivo = document.getElementById('nombreArchivo');
const formularioJuguete = document.getElementById('formJuguetes');
const botonCrear = document.getElementById('crearJuguete');
const listaJuguetesDiv = document.getElementById('listaJuguetes');

// Cuando se hace clic en el botón de buscar, se activa el input de archivo
botonBuscar.addEventListener('click', () => {
    fotoArchivo.click();
});

// Cuando el usuario selecciona un archivo, actualizo el campo de texto con el nombre del archivo
fotoArchivo.addEventListener('change', () => {
    const archivo = fotoArchivo.files[0];
    nombreArchivo.value = archivo ? archivo.name : '';
});

// Función para crear la tabla de juguetes si no existe
function crearTablaImagen() {
    //Si existe no la creo
    if (document.getElementById('tablaImagen')) return; 

    const tablaImagen = document.createElement('table');
    tablaImagen.id = "tablaImagen";
    listaJuguetesDiv.appendChild(tablaImagen);

    const thead = document.createElement('thead');
    const trEncabezado = document.createElement('tr');
    thead.appendChild(trEncabezado);

    const thNombre = document.createElement('th');
    thNombre.textContent = 'Nombre';
    const thImagen = document.createElement('th');
    thImagen.textContent = 'Imagen';
    const thAcciones = document.createElement('th');
    thAcciones.textContent = 'Acciones';

    trEncabezado.appendChild(thNombre);
    trEncabezado.appendChild(thImagen);
    trEncabezado.appendChild(thAcciones);

    tablaImagen.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.id = 'juguetesTabla';
    tablaImagen.appendChild(tbody);
}

// Función para agregar un juguete a la tabla
function agregarJugueteATabla(juguete) {
    const tbody = document.getElementById('juguetesTabla');
    const tr = document.createElement('tr');

    const tdNombre = document.createElement('td');
    tdNombre.textContent = juguete.nombre;
    tr.appendChild(tdNombre);

    const tdImagen = document.createElement('td');
    const imagenElemento = document.createElement('img');
    imagenElemento.src = `../IMG/${juguete.imagen}.png`; 
    imagenElemento.style.width = '100px'; 
    tdImagen.appendChild(imagenElemento);
    tr.appendChild(tdImagen);

    const tdAcciones = document.createElement('td');
    const btnRemove = document.createElement('button');
    btnRemove.textContent = 'Eliminar';

    btnRemove.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/juguetes/${juguete.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert(`${juguete.nombre} eliminado con éxito.`);
                tr.remove();
                actualizarVisibilidadTabla();
            } else {
                alert('Hubo un problema al eliminar el juguete.');
            }
        } catch (error) {
            alert('Error al conectar con el servidor.');
        }
    });

    tdAcciones.appendChild(btnRemove);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
    actualizarVisibilidadTabla();
}

// Función para actualizar la visibilidad de la tabla
function actualizarVisibilidadTabla() {
    const tablaUsuarios = document.getElementById('tablaImagen');
    const tbody = document.getElementById('juguetesTabla');
    if (tbody && tbody.children.length > 0) {
        tablaUsuarios.style.display = 'table';
    } else {
        tablaUsuarios.style.display = 'none';
    }
}


// Función para obtener los juguetes desde el servidor
async function obtenerJuguetes() {
    try {
        const response = await fetch('http://127.0.0.1:8000/juguetes/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            const juguetes = await response.json();
            juguetes.forEach(juguete => agregarJugueteATabla(juguete));
        } else {
            console.log('No se pudieron obtener los juguetes');
        }
        actualizarVisibilidadTabla();
    } catch (error) {
        console.log('Error al obtener los juguetes:', error);
    }
}

crearTablaImagen();
obtenerJuguetes();

// Evento para crear un nuevo juguete
botonCrear.addEventListener('click', async (event) => {
    event.preventDefault();2

    const nombre = document.getElementById('nombre').value;
    const imagen = fotoArchivo.files[0];

    if (!imagen) {
        alert('Por favor, seleccione una imagen.');
        return;
    }

    const nombreRegex = /^.{1,20}$/;
    if (!nombreRegex.test(nombre)) {
        alert("El nombre no puede tener más de 20 caracteres.");
        return;
    }
    
    const imagenNombre = imagen.name.split('.')[0]; 

    try {
        const response = await fetch('http://127.0.0.1:8000/juguetes/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, imagen: imagenNombre }),
        });

        if (response.ok) {
            const data = await response.json();
            alert('Juguete creado con éxito.');
            agregarJugueteATabla(data); 
        } else {
            alert('Hubo un problema al crear el juguete.');
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
