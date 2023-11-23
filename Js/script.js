document.addEventListener("DOMContentLoaded", function () {
    function crearCard(datos) {
        // Crear elementos en HTML
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("card");

        const titulo = document.createElement("h2");
        titulo.textContent = datos.titulo;

        const imagen = document.createElement("img");
        imagen.src = datos.imagenURL; 
        imagen.alt = datos.alt;

        const boton = document.createElement("button");
        boton.textContent = datos.botonTexto;

        // Agregar un evento click para redirigir a otra página
        boton.addEventListener("click", function () {
            window.location.href = datos.botonURL;
        });

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(imagen);
        tarjeta.appendChild(boton);

        const contenedor = document.querySelector("#container");
        contenedor.appendChild(tarjeta);
    }

    // Acceder a FirstProjects desde el ámbito global (window)
    const projects = window.FirstProjects || [];

    projects.forEach((project) => {
        crearCard(project);
    });
});
