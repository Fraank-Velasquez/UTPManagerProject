function iniciarModuloTareas() {
    const formCrearTarea = document.getElementById('formCrearTarea');
    if (formCrearTarea) {
        formCrearTarea.addEventListener('submit', function (e) {
            e.preventDefault();

            const titulo = document.getElementById('tareaTitulo').value;
            const proyecto = document.getElementById('tareaProyecto').value;
            const desc = document.getElementById('tareaDesc').value || 'Sin descripción...';
            const prioridad = document.getElementById('tareaPrioridad').value;
            const fechaVal = document.getElementById('tareaFecha').value;

            let fechaStr = '--/--/----';
            if (fechaVal) {
                const [anio, mes, dia] = fechaVal.split('-');
                fechaStr = `${dia}/${mes}/${anio}`;
            }

            let badgeBg, badgeText, badgeColor, contenedorDestino;
            if (prioridad === 'Alta') {
                badgeBg = 'bg-danger'; badgeText = 'text-white'; badgeColor = 'bg-danger-subtle text-danger';
                contenedorDestino = document.getElementById('contenedor-alta');
            } else if (prioridad === 'Media') {
                badgeBg = 'bg-warning'; badgeText = 'text-dark'; badgeColor = 'bg-warning-subtle text-dark';
                contenedorDestino = document.getElementById('contenedor-media');
            } else {
                badgeBg = 'text-success'; badgeText = 'bg-light'; badgeColor = 'bg-success-subtle text-success';
                contenedorDestino = document.getElementById('contenedor-baja');
            }

            const numId = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');

            const tarjetaHTML = `
                <div class="col">
                    <div class="card border border-primary-subtle shadow-sm rounded-3 p-3 bg-white h-100" style="animation: fadeIn 0.4s ease;">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <div class="d-flex gap-2">
                                <input class="form-check-input mt-1 border-secondary-subtle shadow-none" type="checkbox">
                                <div class="lh-sm">
                                    <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.9rem;">${titulo}</h6>
                                    <span class="text-dark fw-bold" style="font-size: 0.75rem;">${proyecto}</span>
                                </div>
                            </div>
                            <span class="badge bg-primary text-white rounded-pill" style="font-size: 0.6rem;">NUEVO</span>
                        </div>
                        <p class="text-secondary mb-3 mt-2 lh-sm text-truncate" style="font-size: 0.75rem;">${desc}</p>
                        <div class="d-flex gap-2 mt-auto">
                            <span class="badge rounded-1 bg-light text-secondary border px-2 py-1">#${numId}</span>
                            <span class="badge rounded-1 ${badgeBg} ${badgeText} px-2 py-1">${prioridad}</span>
                            <span class="badge rounded-1 ${badgeColor} px-2 py-1">${fechaStr}</span>
                        </div>
                    </div>
                </div>
            `;

            if (contenedorDestino) {
                contenedorDestino.insertAdjacentHTML('afterbegin', tarjetaHTML);
            }

            // Cerrar el modal
            const modalEl = document.getElementById('modalCrearTarea');
            const modalObj = bootstrap.Modal.getInstance(modalEl);
            if (modalObj) modalObj.hide();

            e.target.reset();
        });
    }
}