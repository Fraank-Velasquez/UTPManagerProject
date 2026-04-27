
function cargarModulo(nombreModulo) {

    const ruta = `Modulos/${nombreModulo}.html`;

    const contenedor = document.getElementById(`contenido-principal`)

    pintarBotonActivo(nombreModulo);

    fetch(ruta)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar el modulo`)
            }
            return respuesta.text();
        })
        .then(html => {
            contenedor.innerHTML = html;

            if (nombreModulo === 'tareas') {
                if (typeof iniciarModuloTareas === 'function') iniciarModuloTareas();
            } else if (nombreModulo === 'proyectos') {
                if (typeof iniciarModuloProyectos === 'function') iniciarModuloProyectos();
            } else if (nombreModulo === 'calendario') {
                if (typeof iniciarModuloCalendario === 'function') iniciarModuloCalendario();
            }


        })
        .catch(error => {
            console.error(`Error al cargar el modulo, ${error}`);
            contenedor.innerHTML = '<div class="alert alert-danger" role="alert"> Este modulo aun  esta en  desarrollo!  o tienes que abrirlo desde localHost o en VSCode utilizando LiveServer  </div > ';
        });

};

document.addEventListener(`DOMContentLoaded`, () => {

    const estaLogueado = sessionStorage.getItem('logueado');
    const pantallaCarga = document.getElementById('pantalla-carga');

    if (estaLogueado !== 'true') {
        window.location.href = 'Modulos/login.html';
        return;
    }
    pantallaCarga.style.opacity = '0';
    setTimeout(() => {
        pantallaCarga.classList.add('d-none');
    }, 500);

    cargarModulo(`inicio`)
});

// Lógica para cerrar sesión
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
        e.preventDefault();

        sessionStorage.removeItem('logueado');

        window.location.href = 'modulos/login.html';
    });
}

function pintarBotonActivo(nombreModulo) {
    const enlacesMenu = document.querySelectorAll('[data-modulo]');

    enlacesMenu.forEach(enlace => {
        const contenedorLi = enlace.parentElement;

        contenedorLi.classList.remove('activo');

        if (enlace.getAttribute('data-modulo') === nombreModulo) {
            contenedorLi.classList.add('activo');
        }
    });
}

