// ==========================================
// 1. AUTENTICACIÓN GOOGLE
// ==========================================
function manejarRespuestaGoogle(response) {
    // Extraemos solo lo que necesitamos en una sola línea (Desestructuración)
    const { name, email, picture } = JSON.parse(atob(response.credential.split('.')[1]));

    console.log(`✅ ¡Usuario autenticado!\nNombre: ${name}\nCorreo: ${email}\nFoto URL: ${picture}`);
    //luego Enviar response.credential al servidor
}

const credenciales = {
    usuario: `admin`,
    password: `admin`
}

function validarLoginTemporal(event) {
    event.preventDefault();
    let usuario = document.getElementById(`email-login`).value;
    let password = document.getElementById(`password-login`).value;

    if (usuario === credenciales.usuario && password === credenciales.password) {
        sessionStorage.setItem('logueado', 'true');
        window.location.href = '../index.html';
    }
    else {
        alert(`autenticacion invalida, el usuario es: ${credenciales.usuario} y la contraseñia: es ${credenciales.password}`)
    }

};

function valiarRegistroUsaario(event) {
    event.preventDefault();

    alert(`AUN EN DESARROLLO :/ pipipi \t inicia sesión nomas mi king`)
}



// ==========================================
// 2. ANIMACIÓN DE FONDO (CANVAS)
// ==========================================
const canvas = document.getElementById('canvas-burbujas');
const ctx = canvas.getContext('2d');
let burbujasArray = [];

// función de redimensión para no repetir código
const ajustarLienzo = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init(); // Reinicia las burbujas al cambiar tamaño
};
window.addEventListener('resize', ajustarLienzo);

class Burbuja {
    constructor() {
        this.reset();
        // Sobrescribimos 'y' solo al nacer para que ya estén en pantalla
        this.y = Math.random() * canvas.height;
    }

    reset() {
        // Usamos 'radio' directamente en lugar de calcular tamaño/2 después
        this.radio = (Math.random() * 20) + 22.5;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + this.radio + (Math.random() * 200); // Bug corregido aquí (*)
        this.velocidadY = (Math.random() * 1.2) + 0.02;
        this.opacidad = Math.random() * 0.02;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacidad})`;
        ctx.fill();

        ctx.shadowBlur = 30;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.shadowBlur = 0; // Limpiar para evitar lag
    }

    update() {
        this.y -= this.velocidadY;
        if (this.y < -this.radio) this.reset();
        this.draw();
    }
}

function init() {
    // Forma moderna, limpia y rápida de crear el array de burbujas en 1 línea
    burbujasArray = Array.from({ length: 25 }, () => new Burbuja());
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bucle más moderno y legible que el for() tradicional
    burbujasArray.forEach(burbuja => burbuja.update());
}

// Arranque inicial
ajustarLienzo();
animate();