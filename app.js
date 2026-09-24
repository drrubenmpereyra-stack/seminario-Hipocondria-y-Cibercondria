// Estructura de menús por rol con sus respectivos archivos HTML mapeados
const menusPorRol = {
    admin: [
        { id: 'participantes', label: 'Participantes', file: 'participantes.html' },
        { id: 'materiales', label: 'Materiales, biblioteca', file: 'mat_bib.html' },
        { id: 'clase-en-vivo', label: 'Clase en vivo', file: 'clase_meet.html' },
        { id: 'clase-grabada', label: 'Clase Grabada', file: 'clase_drive.html' },
        { id: 'acreditacion', label: 'Trabajo para acreditación', file: 'acreditacion.html' },
        { id: 'certificado', label: 'Certificado', file: 'certificado.html' },
        { id: 'pagos', label: 'Pagos', file: 'pagos.html' }
    ],
    participante: [
        { id: 'materiales', label: 'Materiales, biblioteca', file: 'est_materiales.html' },
        { id: 'clase-en-vivo', label: 'Clase en vivo', file: 'est_meet.html' },
        { id: 'clase-grabada', label: 'Clase Grabada', file: 'est_drive.html' },
        { id: 'evaluacion', label: 'Trabajo de evaluación', file: 'est_acreditacion.html' },
        { id: 'certificado', label: 'Certificado', file: 'est_cert.html' },
        { id: 'pagos', label: 'Pagos', file: 'est_pagos.html' }
    ]
};

// Diccionario general con la asignación de iframes para cada vista
const contenidosPaginas = {
    // Nivel Administrador
    'participantes': { isIframe: true, url: 'participantes.html' },
    'materiales': { isIframe: true, url: 'mat_bib.html' },
    'clase-en-vivo': { isIframe: true, url: 'clase_meet.html' },
    'clase-grabada': { isIframe: true, url: 'clase_drive.html' },
    'acreditacion': { isIframe: true, url: 'acreditacion.html' },
    'certificado': { isIframe: true, url: 'certificado.html' },
    'pagos': { isIframe: true, url: 'pagos.html' },

    // Nivel Participante
    'est_materiales': { isIframe: true, url: 'est_materiales.html' },
    'est_clase-en-vivo': { isIframe: true, url: 'est_meet.html' },
    'est_clase-grabada': { isIframe: true, url: 'est_drive.html' },
    'evaluacion': { isIframe: true, url: 'est_acreditacion.html' },
    'est_certificado': { isIframe: true, url: 'est_cert.html' },
    'est_pagos': { isIframe: true, url: 'est_pagos.html' }
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
    const btnIngresar = document.getElementById('btnIngresarLogin');
    if (btnIngresar) btnIngresar.onclick = verificarLogin;
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
        console.error("Error al registrar acceso:", e);
    }
}

function cargarVista(idVista) {
    if (rolActual === 'admin' && !adminAutenticado) {
        mostrarPantallaLogin();
        return;
    }
    
    const vista = document.getElementById('dynamicView');
    if (!vista) return;

    // Buscar en el mapeo general o asociar el archivo correspondiente del menú activo
    let configVista = contenidosPaginas[idVista];
    
    if (!configVista) {
        // Fallback dinámico buscando en el menú actual si el ID coincide con el archivo
        const itemMenu = menusPorRol[rolActual].find(m => m.id === idVista);
        if (itemMenu) {
            configVista = { isIframe: true, url: itemMenu.file };
        }
    }

    if (configVista && configVista.isIframe) {
        vista.innerHTML = `
            <iframe src="${configVista.url}" style="width: 100%; height: 720px; border: none; background: transparent;"></iframe>
        `;
    } else {
        vista.innerHTML = `
            <h2>Sección en desarrollo</h2>
            <p>Contenido disponible próximamente.</p>
        `;
    }
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
