function iniciarModuloProyectos() {
    let proyectoActivo = 'Proyecto x'; // El proyecto por defecto al cargar
    const contenedorPestanas = document.getElementById('contenedor-pestanas-proyectos');
    const tableroKanban = document.getElementById('tablero-kanban-activo');
    const estadoVacio = document.getElementById('estado-vacio-proyecto');
    const tituloVacio = document.getElementById('titulo-estado-vacio');

    function actualizarVistaProyectos() {
        const tarjetas = document.querySelectorAll('.task-card');
        let tareasVisibles = 0;

        tarjetas.forEach(tarjeta => {
            // Mostrar solo si el atributo data-proyecto coincide con la pestaña actual
            if (tarjeta.getAttribute('data-proyecto') === proyectoActivo) {
                tarjeta.style.display = 'block';
                tareasVisibles++;
            } else {
                tarjeta.style.display = 'none';
            }
        });

        // Alternar entre Tablero y Estado Vacío
        if (tareasVisibles === 0) {
            tableroKanban.style.display = 'none';
            estadoVacio.style.display = 'flex';
            tituloVacio.innerText = proyectoActivo;
        } else {
            estadoVacio.style.display = 'none';
            tableroKanban.style.display = 'flex';
        }
    }

    // Lógica para Pestañas Dinámicas
    if (contenedorPestanas) {
        contenedorPestanas.addEventListener('click', (e) => {
            const boton = e.target.closest('.tab-btn');
            // Ignorar clics fuera de botones o en el botón de agregar
            if (!boton || boton.id === 'btnNuevoProyecto') return;

            // Quitar activo de todos y poner al seleccionado
            document.querySelectorAll('#contenedor-pestanas-proyectos .tab-btn').forEach(b => b.classList.remove('active'));
            boton.classList.add('active');

            // Cambiar proyecto activo y actualizar pantalla
            proyectoActivo = boton.innerText.trim();
            actualizarVistaProyectos();
        });
    }

    // Crear Nuevo Proyecto 
    const formCrearProyecto = document.getElementById('formCrearProyecto');
    if (formCrearProyecto) {
        formCrearProyecto.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombreNuevo = document.getElementById('nuevoNombreProyecto').value.trim();

            if (nombreNuevo) {
                const nuevoBoton = document.createElement('button');
                nuevoBoton.className = 'tab-btn';
                nuevoBoton.innerText = nombreNuevo;

                const btnMas = document.getElementById('btnNuevoProyecto');
                contenedorPestanas.insertBefore(nuevoBoton, btnMas);

                nuevoBoton.click();

                // Cerrar modal y limpiar
                const modalEl = document.getElementById('modalCrearProyecto');
                const modalObj = bootstrap.Modal.getInstance(modalEl);
                if (modalObj) modalObj.hide();
                e.target.reset();
            }
        });
    }

    // Botones para abrir Modal de Nueva Tarea
    const botonesCrear = document.querySelectorAll('.btn-create-task');
    const modalTareaEl = document.getElementById('modalCrearTareaProyecto');
    let modalTarea = null;

    if (modalTareaEl) modalTarea = new bootstrap.Modal(modalTareaEl);

    botonesCrear.forEach(btn => {
        btn.addEventListener('click', () => {
            if (modalTarea) modalTarea.show();
        });
    });

    // Crear nueva tarea
    const formCrearTarea = document.getElementById('formCrearTareaProyecto');
    if (formCrearTarea) {
        formCrearTarea.addEventListener('submit', function (e) {
            e.preventDefault();

            const titulo = document.getElementById('proyectoTareaTitulo').value;
            const desc = document.getElementById('proyectoTareaDesc').value || 'Sin descripción...';
            const prioridad = document.getElementById('proyectoTareaPrioridad').value;
            const fechaVal = document.getElementById('proyectoTareaFecha').value;

            let fechaStr = '--/--/----';
            if (fechaVal) {
                const [anio, mes, dia] = fechaVal.split('-');
                fechaStr = `${dia}/${mes}/${anio}`;
            }

            let badgeBg = 'bg-success', badgeText = 'text-white', badgeColor = 'bg-success-subtle text-success';
            if (prioridad === 'Alta') {
                badgeBg = 'bg-danger'; badgeText = 'text-white'; badgeColor = 'bg-danger-subtle text-danger';
            } else if (prioridad === 'Media') {
                badgeBg = 'bg-warning'; badgeText = 'text-dark'; badgeColor = 'bg-warning-subtle text-dark';
            }

            const numId = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');

            // INCLUIR el data-proyecto para que pertenezca a la pestaña actual
            const tarjetaHTML = `
                <div class="task-card" data-proyecto="${proyectoActivo}" style="animation: fadeIn 0.4s ease;">
                    <div class="d-flex justify-content-between">
                        <div class="task-title-group">
                            <i class="bi bi-square task-checkbox"></i>
                            <div>
                                <h6 class="task-title">${titulo}</h6>
                                <p class="task-desc">${desc}</p>
                            </div>
                        </div>
                        <div class="task-arrows">
                            <i class="bi bi-arrow-right fs-5 text-primary cursor-pointer btn-mover" title="Avanzar etapa"></i>
                        </div>
                    </div>
                    <div class="task-tags">
                        <span class="custom-badge badge-id">#${numId}</span>
                        <span class="badge rounded-1 ${badgeBg} ${badgeText} px-2 py-1">${prioridad}</span>
                        <span class="badge rounded-1 ${badgeColor} px-2 py-1"><i class="bi bi-calendar"></i> ${fechaStr}</span>
                    </div>
                </div>
            `;

            // Agregar a la columna "Por Hacer"
            const columnaPorHacer = document.querySelector('.kanban-column:nth-child(1)');
            const btnCrearColumna = columnaPorHacer.querySelector('.btn-create-task');
            btnCrearColumna.insertAdjacentHTML('afterend', tarjetaHTML);

            // Cerrar modal y actualizar 
            if (modalTarea) modalTarea.hide();
            e.target.reset();
            actualizarVistaProyectos();
        });
    }

    // Lógica del Kanban 
    if (tableroKanban) {
        tableroKanban.addEventListener('click', (e) => {
            const elemento = e.target;
            const tarjeta = elemento.closest('.task-card');
            if (!tarjeta) return;

            const columnas = Array.from(document.querySelectorAll('.kanban-column'));
            const indexActual = columnas.indexOf(tarjeta.closest('.kanban-column'));

            // Checkbox -> Enviar a Completadas
            if (elemento.classList.contains('task-checkbox')) {
                tarjeta.classList.toggle('done');
                if (tarjeta.classList.contains('done')) {
                    elemento.classList.replace('bi-square', 'bi-check-square-fill');
                    columnas[2].appendChild(tarjeta);
                    const flechas = tarjeta.querySelector('.task-arrows');
                    if (flechas) flechas.style.display = 'none';
                } else {
                    elemento.classList.replace('bi-check-square-fill', 'bi-square');
                    columnas[0].appendChild(tarjeta);
                    const flechas = tarjeta.querySelector('.task-arrows');
                    if (flechas) flechas.style.display = 'block';
                }
            }

            // Flecha -> Avanzar a la siguiente columna
            if (elemento.classList.contains('btn-mover')) {
                if (indexActual >= 0 && indexActual < columnas.length - 1) {
                    columnas[indexActual + 1].appendChild(tarjeta);
                    if (indexActual + 1 === 2) {
                        tarjeta.classList.add('done');
                        tarjeta.querySelector('.task-checkbox').classList.replace('bi-square', 'bi-check-square-fill');
                        elemento.parentElement.style.display = 'none';
                    }
                }
            }
        });
    }

    // Buscador
    const entradaBusqueda = document.querySelector('.search-box input');
    if (entradaBusqueda) {
        entradaBusqueda.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase();
            const tarjetas = document.querySelectorAll('.task-card');
            tarjetas.forEach(tarjeta => {
                // Solo busca dentro de las tareas que pertenecen al proyecto actual
                if (tarjeta.getAttribute('data-proyecto') === proyectoActivo) {
                    const titulo = tarjeta.querySelector('.task-title').innerText.toLowerCase();
                    const desc = tarjeta.querySelector('.task-desc').innerText.toLowerCase();
                    tarjeta.style.display = (titulo.includes(termino) || desc.includes(termino)) ? "block" : "none";
                }
            });
        });
    }

    // Inicializar la vista por defecto al cargar el módulo
    actualizarVistaProyectos();
}