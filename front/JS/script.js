let botonUsuario = document.getElementById("btnUsuario");
let usuarioDiv = document.getElementById("usuario");

let botonJuguete = document.getElementById("btnJuguete");
let jugueteDiv = document.getElementById("juguete");

let botonCarta = document.getElementById("btnCarta");
let cartaDiv = document.getElementById("carta");

let botonRey = document.getElementById("btnRey");
let reyDiv = document.getElementById("rey");


function generarBotones(contenedor, tipo) {

  if (contenedor.innerHTML.trim() !== "") {
    contenedor.innerHTML = "";
    return;
  }

  let crearboton = document.createElement("button");
  crearboton.textContent = `Crear ${tipo}`;
  crearboton.addEventListener("click", () => {
    if (tipo == 'Usuario') {
      window.location.href = "front/HTML/indexUsuario.html";
    } else if (tipo == 'Juguete') {
      window.location.href = "front/HTML/indexJuguete.html";
    } else if (tipo == 'Carta') {
      window.location.href = "front/HTML/indexCarta.html";
    } else {
      window.location.href = "front/HTML/indexReyes.html";
    }

  });

  if (tipo === "Carta") {
    let verboton = document.createElement("button");
    verboton.textContent = "Ver Carta";
    verboton.addEventListener("click", () => {
      window.location.href = "front/HTML/verCarta.html";
    });
    contenedor.appendChild(verboton);
  }

  contenedor.appendChild(crearboton);
}




botonUsuario.addEventListener("click", () => {
  generarBotones(usuarioDiv, "Usuario");
});

botonJuguete.addEventListener("click", () => {
  generarBotones(jugueteDiv, "Juguete");
});

botonCarta.addEventListener("click", () => {
  generarBotones(cartaDiv, "Carta");
});


botonRey.addEventListener("click", () => {
  generarBotones(reyDiv, "Rey");
});


