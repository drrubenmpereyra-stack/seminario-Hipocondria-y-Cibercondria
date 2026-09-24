// Estructura de menús por rol
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
        { id: 'est_materiales', label: 'Materiales, biblioteca', file: 'est_materiales.html' },
        { id: 'est_clase-en-vivo', label: 'Clase en vivo', file: 'est_meet.html' },
        { id: 'est_clase-grabada', label: 'Clase Grabada', file: 'est_drive.html' },
        { id: 'evaluacion', label: 'Trabajo de evaluación', file: 'est_acreditacion.html' },
        { id: 'est_certificado', label: 'Certificado', file: 'est_cert.html' },
        { id: 'est_pagos', label: 'Pagos', file: 'est_pagos.html' }
    ]
};

// Mapeo de vistas e iframes
const contenidosPaginas = {
    'participantes': { isIframe: true, url: 'participantes.html' },
    'materiales': { isIframe: true, url: 'mat_bib.html' },
    'clase-en-vivo': { isIframe: true, url: 'clase_meet.html' },
    'clase-grabada': { isIframe: true, url: 'clase_drive.html' },
    'acreditacion': { isIframe: true, url: 'acreditacion.html' },
    'certificado': { isIframe: true, url: 'certificado.html' },
    'pagos': { isIframe: true, url: 'pagos.html' },

    'est_materiales': { isIframe: true, url: 'est_materiales.html' },
    'est_clase-en-vivo': { isIframe: true, url: 'est_meet.html' },
    'est_clase-grabada': { isIframe: true, url: 'est_drive.html' },
    'evaluacion': { isIframe: true, url: 'est_acreditacion.html' },
    'est_certificado': { isIframe: true, url: 'est_cert.html' },
    'est_pagos': { isIframe: true, url: 'est_pagos.html' }
};

let rolActual = 'admin';
let adminAutenticado = false;
let participanteAutenticado = false;
let participanteActualNombre = '';

function cambiarRol(nuevoRol) {
    rolActual = nuevoRol;
    
    if (rolActual === 'admin') {
        if (!adminAutenticado) {
            renderizarMenuVacio('Acceso restringido: Ingrese credenciales de Administrador.');
            mostrarPantallaLoginAdmin();
        } else {
            renderizarMenu();
            cargarVista('participantes');
        }
    } else if (rolActual === 'participante') {
        if (!participanteAutenticado) {
            renderizarMenuVacio('Acceso restringido: Ingrese su Apellido y Código de Matrícula.');
            mostrarPantallaLoginParticipante();
        } else {
            renderizarMenu();
            cargarVista('est_materiales');
        }
    }
}

function renderizarMenuVacio(mensaje) {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.innerHTML = `<span style="font-size: 0.85rem; color: #475569; font-style: italic;">${mensaje}</span>`;
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

// Pantalla Login Administrador
function mostrarPantallaLoginAdmin(mensajeError = '') {
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
            <button class="login-btn" id="btnIngresarAdmin">Ingresar como Administrador</button>
            ${mensajeError ? `<div class="login-error">${mensajeError}</div>` : ''}
        </div>
    `;
    document.getElementById('btnIngresarAdmin').onclick = verificarLoginAdmin;
}

function verificarLoginAdmin() {
    const u = document.getElementById('usuarioLogin').value.trim();
    const p = document.getElementById('passwordLogin').value.trim();

    if (u === 'DRPEREYRA' && p === '235689') {
        adminAutenticado = true;
        renderizarMenu();
        cargarVista('participantes');
        registrarAccesoFirestore(u, "admin");
    } else {
        mostrarPantallaLoginAdmin('Usuario o contraseña incorrectos.');
    }
}

// Pantalla Login Participante (Valida contra Firestore)
function mostrarPantallaLoginParticipante(mensajeError = '') {
    const vista = document.getElementById('dynamicView');
    if (!vista) return;
    vista.innerHTML = `
        <div class="login-box">
            <h2>Acceso Nivel Participante</h2>
            <p>Ingrese su Apellido y Código de Matrícula:</p>
            <div class="form-group">
                <label>Usuario (Apellido):</label>
                <input type="text" id="partUsuario" placeholder="Ej. Pérez" autocomplete="off">
            </div>
            <div class="form-group">
                <label>Contraseña (Código Mat):</label>
                <input type="password" id="partPassword" placeholder="Ej. MP-1234">
            </div>
            <button class="login-btn" id="btnIngresarPart">Ingresar al Seminario</button>
            ${mensajeError ? `<div class="login-error">${mensajeError}</div>` : ''}
        </div>
    `;
    document.getElementById('btnIngresarPart').onclick = verificarLoginParticipante;
}

async function verificarLoginParticipante() {
    const apellidoIngresado = document.getElementById('partUsuario').value.trim().toLowerCase();
    const codigoIngresado = document.getElementById('partPassword').value.trim();

    if (!apellidoIngresado || !codigoIngresado) {
        mostrarPantallaLoginParticipante('Por favor complete ambos campos.');
        return;
    }

    const btn = document.getElementById('btnIngresarPart');
    btn.innerText = "Verificando en base de datos...";
    btn.disabled = true;

    try {
        if (!window.db || !window.firebaseFirestore) {
            throw new Error("Base de datos no inicializada.");
        }

        const { collection, getDocs } = window.firebaseFirestore;
        const querySnapshot = await getDocs(collection(window.db, "participantes"));
        
        let participanteEncontrado = false;

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const apellidoRegistro = (data.apellidoNombre || '').toLowerCase();
            const codigoRegistro = (data.codigoMat || '').trim();

            // Verificamos si el apellido ingresado coincide con el inicio o parte del campo Apellido y Nombre
            // y si la contraseña coincide exactamente con el código de matrícula registrado
            if (apellidoRegistro.includes(apellidoIngresado) && codigoRegistro === codigoIngresado) {
                participanteEncontrado = true;
                participanteActualNombre = data.apellidoNombre;
            }
        });

        if (participanteEncontrado) {
            participanteAutenticado = true;
            renderizarMenu();
            cargarVista('est_materiales');
            registrarAccesoFirestore(participanteActualNombre, "participante");
        } else {
            mostrarPantallaLoginParticipante('Apellido o Código de Matrícula incorrectos o no registrados.');
        }
    } catch (e) {
        console.error("Error en validación de participante:", e);
        mostrarPantallaLoginParticipante('Error al conectar con la base de datos. Intente nuevamente.');
    }
}

async function registrarAccesoFirestore(usuario, tipo) {
    try {
        if (window.db && window.firebaseFirestore) {
            const { collection, addDoc } = window.firebaseFirestore;
            await addDoc(collection(window.db, "accesos"), {
                usuario: usuario,
                rol: tipo,
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
        mostrarPantallaLoginAdmin();
        return;
    }
    if (rolActual === 'participante' && !participanteAutenticado) {
        mostrarPantallaLoginParticipante();
        return;
    }
    
    const vista = document.getElementById('dynamicView');
    if (!vista) return;

    let configVista = contenidosPaginas[idVista];
    
    if (!configVista) {
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

// Exponer funciones globales
window.cambiarRol = cambiarRol;
window.verificarLoginAdmin = verificarLoginAdmin;
window.verificarLoginParticipante = verificarLoginParticipante;

document.addEventListener('DOMContentLoaded', () => {
    adminAutenticado = false;
    participanteAutenticado = false;
    const selector = document.getElementById('roleSelector');
    if (selector) {
        selector.value = 'admin';
        selector.onchange = (e) => cambiarRol(e.target.value);
    }
    renderizarMenuVacio('Acceso restringido: Ingrese credenciales de Administrador.');
    mostrarPantallaLoginAdmin();
});
