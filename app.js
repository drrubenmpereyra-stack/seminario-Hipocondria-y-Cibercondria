// Estructura de menús por rol
const menusPorRol = {
    admin: [
        { id: 'participantes', label: 'Participantes' },
        { id: 'materiales', label: 'Materiales, biblioteca' },
        { id: 'clase-en-vivo', label: 'Clase en vivo' },
        { id: 'clase-grabada', label: 'Clase Grabada' },
        { id: 'acreditacion', label: 'Trabajo para acreditación' },
        { id: 'certificado', label: 'Certificado' },
        { id: 'pagos', label: 'Pagos' }
    ],
    participante: [
        { id: 'materiales', label: 'Materiales, biblioteca' },
        { id: 'clase-en-vivo', label: 'Clase en vivo' },
        { id: 'clase-grabada', label: 'Clase Grabada' },
        { id: 'evaluacion', label: 'Trabajo Evaluación' },
        { id: 'certificado', label: 'Certificado' },
        { id: 'pagos', label: 'Pagos' }
    ]
};

const contenidosPaginas = {
    'participantes': { titulo: 'Gestión de Participantes (Administrador)', descripcion: 'Panel de control para supervisión y seguimiento de inscriptos.' },
    'materiales': { titulo: 'Materiales y Biblioteca Digital', descripcion: 'Repositorio bibliográfico institucional sobre nosografías contemporáneas.' },
    'clase-en-vivo': { titulo: 'Transmisión de Clase en Vivo', descripcion: 'Enlace de acceso a videoconferencias sincrónicas.' },
    'clase-grabada': { titulo: 'Archivos de Clases Grabadas', descripcion: 'Videoteca con el registro histórico de conferencias anteriores.' },
    'acreditacion': { titulo: 'Trabajos para Acreditación', descripcion: 'Gestión y calificación de trabajos finales presentados.' },
    'evaluacion': { titulo: 'Trabajo de Evaluación', descripcion: 'Espacio para la presentación y entrega de trabajos prácticos.' },
    'certificado': { titulo: 'Emisión de Certificados', descripcion: 'Generación de certificado oficial de la Clínica de la Convergencia.' },
    'pagos': { titulo: 'Estado de Pagos y Tesorería', descripcion: 'Control y registro financiero de la cursada.' }
};

let rolActual = 'admin';
let adminAutenticado = false;

function cambiarRol(nuevoRol) {
    rolActual = nuevoRol;
    if (rolActual === 'admin' && !adminAutenticado) {
        renderizarMenuVacio();
        mostrarPantallaLogin();
    } else {
        renderizarMenu();
        cargarVista(menusPorRol[rolActual][0].id);
    }
}

function renderizarMenuVacio() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.innerHTML = '<span style="font-size: 0.85rem; color: #475569; font-style: italic;">Acceso restringido: Ingrese credenciales de Administrador.</span>';
    }
}

function renderizarMenu() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    navMenu.innerHTML = '';
    
    menusPorRol[rolActual].forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        if (index === 0) btn.classList.add('active');
        btn.innerText = item.label;
        btn.onclick = () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cargarVista(item.id);
        };
        navMenu.appendChild(btn);
    });
}

function mostrarPantallaLogin(mensajeError = '') {
    const vista = document.getElementById('dynamicView');
    if (!vista) return;
    vista.innerHTML = `
        <div class="login-box">
            <h2>Acceso Nivel Administrador</h2>
            <p>Ingrese las credenciales institucionales:</p>
            <div class="form-group">
                <label>Usuario:</label>
                <input type="text" id="usuarioLogin" value="DRPEREYRA" autocomplete="off">
            </div>
            <div class="form-group">
                <label>Contraseña:</label>
                <input type="password" id="passwordLogin" value="235689">
            </div>
            <button class="login-btn" id="btnIngresarLogin">Ingresar</button>
            ${mensajeError ? `<div class="login-error">${mensajeError}</div>` : ''}
        </div>
    `;

    // Vincular evento de clic de forma segura
    document.getElementById('btnIngresarLogin').onclick = verificarLogin;
}

function verificarLogin() {
    const u = document.getElementById('usuarioLogin').value.trim();
    const p = document.getElementById('passwordLogin').value.trim();

    if (u === 'DRPEREYRA' && p === '235689') {
        adminAutenticado = true;
        renderizarMenu();
        cargarVista('participantes');
        registrarAccesoFirestore(u);
    } else {
        mostrarPantallaLogin('Usuario o contraseña incorrectos.');
    }
}

async function registrarAccesoFirestore(usuario) {
    try {
        if (window.db && window.firebaseFirestore) {
            const { collection, addDoc } = window.firebaseFirestore;
            await addDoc(collection(window.db, "accesos_admin"), {
                usuario: usuario,
                fecha: new Date().toISOString(),
                seminario: "Hipocondría y Cibercondría"
            });
        }
    } catch (e) {
        console.error("Error al registrar en Firestore: ", e);
    }
}

function cargarVista(idVista) {
    if (rolActual === 'admin' && !adminAutenticado) {
        mostrarPantallaLogin();
        return;
    }
    const c = contenidosPaginas[idVista] || { titulo: 'Sección', descripcion: 'En desarrollo.' };
    const vista = document.getElementById('dynamicView');
    if (!vista) return;
    
    vista.innerHTML = `
        <h2>${c.titulo}</h2>
        <p>${c.descripcion}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 0.9rem; color: #64748b;">Seminario Intensivo: Hipocondría y Cibercondría: El Terror al Cuerpo Enfermo en la Era de la Información | Dr. y Mgter. Rubén M. Pereyra</p>
    `;
}

// Exponer funciones globales necesarias para eventos nativos
window.cambiarRol = cambiarRol;
window.verificarLogin = verificarLogin;

document.addEventListener('DOMContentLoaded', () => {
    adminAutenticado = false;
    const selector = document.getElementById('roleSelector');
    if (selector) {
        selector.value = 'admin';
        selector.onchange = (e) => cambiarRol(e.target.value);
    }
    renderizarMenuVacio();
    mostrarPantallaLogin();
});
