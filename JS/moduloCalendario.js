function iniciarModuloCalendario() {
    var CAL_NOW = new Date(2026, 7, 15); // Fijado en Agosto 2026 para mostrar los datos
    var TODAY = new Date(CAL_NOW.getFullYear(), CAL_NOW.getMonth(), CAL_NOW.getDate());
    var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    var CLASES = {
        alta: 'bg-danger-subtle text-danger border-danger',
        media: 'bg-warning-subtle text-warning-emphasis border-warning',
        baja: 'bg-success-subtle text-success border-success',
        own: 'text-white border-0'
    };

    var EVENTS = {};
    function addEvent(date, texto, cat) {
        var key = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
        if (!EVENTS[key]) EVENTS[key] = [];
        EVENTS[key].push({ texto: texto, cat: cat });
    }

    // Eventos de prueba originales
    var d15 = new Date(2026, 7, 15);
    addEvent(d15, 'Implementar OAuth 2.0 · #001 · Media', 'media');
    addEvent(d15, 'Tarea A - tarea x · #002 · Media', 'media');
    addEvent(d15, 'Tarea x - tarea y · #003 · Media', 'media');
    addEvent(d15, 'Tarea y - tarea x · #004 · Media', 'media');
    addEvent(d15, 'Tarea x - tarea y · #005 · Baja', 'baja');

    var d20 = new Date(2026, 7, 20);
    addEvent(d20, 'Implementar OAuth 2.0 · #103 · Alta', 'alta');
    addEvent(d20, 'Tarea A w - tarea A · #102 · Alta', 'alta');
    addEvent(d20, 'Tarea x - tarea A · #103 · Alta', 'alta');
    addEvent(d20, 'Implementar OAuth 2 · #003 · Baja', 'baja');
    addEvent(d20, 'Tarea y - tarea y · #002 · Baja', 'baja');
    addEvent(d20, 'Tarea z - tarea z · #003 · Baja', 'baja');

    var currentYear = TODAY.getFullYear();
    var currentMonth = TODAY.getMonth();
    var viewMode = 'mes';
    var currentWeekStart = getMonday(new Date(TODAY));

    function getMonday(date) {
        var d = new Date(date), day = d.getDay();
        d.setDate(d.getDate() + ((day === 0) ? -6 : 1 - day));
        return d;
    }

    function getKey(y, m, d) { return y + '-' + m + '-' + d; }

    function badgeEl(ev) {
        var el = document.createElement('div');
        if (ev.cat === 'own') {
            el.className = 'event-badge';
            el.style.cssText = 'background:#7e22ce;color:#fff;border-left:3px solid #6b21a8;';
        } else {
            el.className = 'event-badge ' + CLASES[ev.cat];
        }
        el.textContent = ev.texto;
        return el;
    }

    function buildMonthView() {
        var titleEl = document.getElementById('calendarTitle');
        if (titleEl) titleEl.textContent = MESES[currentMonth] + ' ' + currentYear;

        var tbody = document.getElementById('monthBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        var firstDay = new Date(currentYear, currentMonth, 1);
        var totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        var startDow = firstDay.getDay();
        startDow = (startDow === 0) ? 6 : startDow - 1;

        var totalCells = Math.ceil((startDow + totalDays) / 7) * 7;
        var cellDate = new Date(firstDay);
        cellDate.setDate(1 - startDow);

        for (var row = 0; row < totalCells / 7; row++) {
            var tr = document.createElement('tr');
            for (var col = 0; col < 7; col++) {
                var d = cellDate.getDate(), m = cellDate.getMonth(), y = cellDate.getFullYear();
                var isCM = (m === currentMonth && y === currentYear);
                var isToday = (d === TODAY.getDate() && m === TODAY.getMonth() && y === TODAY.getFullYear());

                var td = document.createElement('td');
                td.className = 'calendar-day' + (isCM ? '' : ' other-month');
                if (isToday) td.style.cssText = 'background:#eff6ff;border:2px solid #0d6efd!important;';

                var hdr = document.createElement('div');
                hdr.className = 'd-flex justify-content-between align-items-center mb-1';
                var num = document.createElement('span');
                num.className = 'day-number';
                num.style.color = isToday ? '#0d6efd' : '';
                num.textContent = d;
                hdr.appendChild(num);

                if (isToday) {
                    var hoyB = document.createElement('span');
                    hoyB.className = 'badge rounded-pill text-white bg-primary';
                    hoyB.style.cssText = 'font-size:7px; padding: 2px 4px; margin-left: 5px;';
                    hoyB.textContent = 'HOY';
                    hdr.appendChild(hoyB);
                }
                td.appendChild(hdr);

                if (isCM) {
                    var key = getKey(y, m, d);
                    if (EVENTS[key]) {
                        var max = 2;
                        for (var i = 0; i < Math.min(EVENTS[key].length, max); i++) {
                            td.appendChild(badgeEl(EVENTS[key][i]));
                        }
                        if (EVENTS[key].length > max) {
                            var more = document.createElement('div');
                            more.style.cssText = 'font-size:10px;color:#999;padding-left:4px;';
                            more.textContent = '+ ' + (EVENTS[key].length - max) + ' mas';
                            td.appendChild(more);
                        }
                    }
                }

                td.addEventListener('click', function () {
                    var modalEl = document.getElementById('newTaskModal');
                    if (modalEl) {
                        var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                        modal.show();
                    }
                });
                tr.appendChild(td);
                cellDate.setDate(cellDate.getDate() + 1);
            }
            tbody.appendChild(tr);
        }
    }

    function buildWeekView() {
        var horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
        var weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        var sm = MESES[currentWeekStart.getMonth()], em = MESES[weekEnd.getMonth()];
        var same = currentWeekStart.getMonth() === weekEnd.getMonth();
        var titleEl = document.getElementById('calendarTitle');
        if (titleEl) {
            titleEl.textContent = same
                ? (currentWeekStart.getDate() + ' - ' + weekEnd.getDate() + ' de ' + sm + ' ' + currentWeekStart.getFullYear())
                : (currentWeekStart.getDate() + ' ' + sm + ' - ' + weekEnd.getDate() + ' ' + em + ' ' + weekEnd.getFullYear());
        }

        for (var i = 0; i < 7; i++) {
            var d = new Date(currentWeekStart);
            d.setDate(d.getDate() + i);
            var wDayEl = document.getElementById('wDay' + i);
            if (wDayEl) wDayEl.textContent = d.getDate() + ' ' + MESES[d.getMonth()].slice(0, 3);
        }

        var wb = document.getElementById('weekBody');
        if (!wb) return;
        wb.innerHTML = '';

        horas.forEach(function (hora) {
            var tr = document.createElement('tr');
            var tdH = document.createElement('td');
            tdH.style.cssText = 'font-size:.72rem;font-weight:700;background:#f8f9fa;text-align:center;vertical-align:top;padding-top:8px;color:#888;';
            tdH.textContent = hora;
            tr.appendChild(tdH);

            for (var i = 0; i < 7; i++) {
                var day = new Date(currentWeekStart);
                day.setDate(day.getDate() + i);
                var isToday = day.toDateString() === TODAY.toDateString();

                var td = document.createElement('td');
                td.className = 'calendar-day';
                td.style.height = '68px';
                if (isToday) td.style.cssText = 'height:68px;background:#eff6ff;border:2px solid #0d6efd!important;';

                if (hora === '08:00') {
                    var key = getKey(day.getFullYear(), day.getMonth(), day.getDate());
                    if (EVENTS[key]) {
                        for (var j = 0; j < Math.min(EVENTS[key].length, 2); j++) {
                            td.appendChild(badgeEl(EVENTS[key][j]));
                        }
                    }
                }
                td.addEventListener('click', function () {
                    var modalEl = document.getElementById('newTaskModal');
                    if (modalEl) {
                        var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                        modal.show();
                    }
                });
                tr.appendChild(td);
            }
            wb.appendChild(tr);
        });
    }

    function setViewCal(mode) {
        viewMode = mode;
        var visMes = document.getElementById('vistasMes');
        var visSem = document.getElementById('vistaSemana');
        var bMes = document.getElementById('btnMes');
        var bSem = document.getElementById('btnSemana');

        if (!visMes || !visSem) return;

        var acStyle = 'background:#0d6efd;color:#fff;border:none;';
        var inStyle = 'background:#fff;border:1px solid #ddd;color:#666;';

        if (mode === 'mes') {
            visMes.style.display = ''; visSem.style.display = 'none';
            if (bMes) bMes.style.cssText = acStyle;
            if (bSem) bSem.style.cssText = inStyle;
            buildMonthView();
        } else {
            visMes.style.display = 'none'; visSem.style.display = '';
            if (bSem) bSem.style.cssText = acStyle;
            if (bMes) bMes.style.cssText = inStyle;
            buildWeekView();
        }
    }

    // Listeners del DOM
    var eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var nombre = document.getElementById('eventName').value.trim();
            var cat = document.getElementById('eventProject').value;
            var dateVal = document.getElementById('eventDate').value;
            if (!nombre || !dateVal) return;

            var parts = dateVal.split('-');
            var y = parseInt(parts[0]), m = parseInt(parts[1]) - 1, d = parseInt(parts[2]);
            var key = getKey(y, m, d);
            if (!EVENTS[key]) EVENTS[key] = [];
            EVENTS[key].push({ texto: nombre, cat: cat });

            if (viewMode === 'mes') buildMonthView(); else buildWeekView();

            var modalEl = document.getElementById('newTaskModal');
            var mi = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            if (mi) mi.hide();
            e.target.reset();
        });
    }

    var btnMes = document.getElementById('btnMes');
    if (btnMes) btnMes.addEventListener('click', function () { setViewCal('mes'); });

    var btnSemana = document.getElementById('btnSemana');
    if (btnSemana) btnSemana.addEventListener('click', function () { setViewCal('semana'); });

    var btnPrev = document.getElementById('btnPrev');
    if (btnPrev) {
        btnPrev.addEventListener('click', function () {
            if (viewMode === 'mes') {
                currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; }
                buildMonthView();
            } else { currentWeekStart.setDate(currentWeekStart.getDate() - 7); buildWeekView(); }
        });
    }

    var btnNext = document.getElementById('btnNext');
    if (btnNext) {
        btnNext.addEventListener('click', function () {
            if (viewMode === 'mes') {
                currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; }
                buildMonthView();
            } else { currentWeekStart.setDate(currentWeekStart.getDate() + 7); buildWeekView(); }
        });
    }

    var btnHoy = document.getElementById('btnHoy');
    if (btnHoy) {
        btnHoy.addEventListener('click', function () {
            var now = new Date(2026, 7, 15);
            TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            currentYear = TODAY.getFullYear(); currentMonth = TODAY.getMonth();
            currentWeekStart = getMonday(new Date(TODAY));
            if (viewMode === 'mes') buildMonthView(); else buildWeekView();
        });
        
    }

    // Dibujar la tabla inicial al cargar el módulo
    setViewCal('mes');
}