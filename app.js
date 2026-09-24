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
    'participantes': {
        titulo: 'Gestión de Participantes (Nivel Administrador)',
        descripcion: 'Panel de control administrativo para la supervisión, alta, baja y seguimiento de los inscriptos al Seminario Intensivo sobre Hipocondría y Cibercondría.'
    },
    'materiales': {
        titulo: 'Materiales y Biblioteca Digital',
        descripcion: 'Repositorio bibliográfico institucional. Acceso a textos fundamentales sobre nosografías contemporáneas, impacto de internet en la salud mental y viñetas clínicas de la Cibercondría.'
    },
    'clase-en-vivo': {
        titulo: 'Transmisión de Clase en Vivo',
        descripcion: 'Enlace de acceso a las videoconferencias sincrónicas dictadas por el Dr. y Mgter. Rubén M. Pereyra en el marco de la Clínica de la Convergencia.'
    },
    'clase-grabada': {
        titulo: 'Archivos de Clases Grabadas',
        descripcion: 'Videoteca con el registro histórico de las conferencias anteriores para visualización asincrónica y repaso de los ejes teóricos del seminario.'
    },
    'acreditacion': {
        titulo: 'Trabajos para Acreditación (Administrador)',
        descripcion: 'Gestión, revisión y calificación de los trabajos finales presentados por los cursantes para la acreditación formal del seminario.'
    },
    'evaluacion': {
        titulo: 'Trabajo de Evaluación (Participante)',
        descripcion: 'Espacio para la presentación y entrega del trabajo práctico evaluativo exigido para la aprobación del Seminario Intensivo.'
    },
    'certificado': {
        titulo: 'Emisión y Descarga de Certificados',
        descripcion: 'Generación del certificado oficial avalado por la Clínica de la Convergencia tras cumplir con los requisitos académicos de asistencia y evaluación.'
    },
    'pagos': {
        titulo: 'Estado de Pagos y Tesorería',
        descripcion: 'Control y registro de cuotas, aranceles y estado financiero correspondientes a la matriculación y cursada del seminario.'
    }
};

let rolActual = 'admin';
let adminAutenticado = false; // Estado de sesión del administrador

function cambiarRol(nuevoRol) {
    rolActual = nuevoRol;
    
    if (rolActual === 'admin' && !adminAutenticado) {
        renderizarMenuVacio();
        mostrarPantallaLogin();
    } else {
        renderizarMenu();
        const primerOpcion = menusPorRol[rolActual][0].id;
        cargarVista(primerOpcion);
    }
}

function renderizarMenuVacio() {
    const navMenu = document.getElementById('navMenu');
    navMenu.innerHTML = '<span style="font-size: 0.85rem; color: #475569; font-style: italic; padding: 6px 0;">Acceso restringido: Ingrese credenciales de Administrador para habilitar el menú.</span>';
}

function renderizarMenu() {
    const navMenu = document.getElementById('navMenu');
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
    const contenedor = document.getElementById('dynamicView');
    contenedor.innerHTML = `
        <div class="login-box">
            <h2>Acceso Nivel Administrador</h2>
            <p>Ingrese sus credenciales institucionales para acceder al panel de gestión del Dr. y Mgter. Rubén M. Pereyra.</p>
            <div class="form-group">
                <label for="usuarioLogin">Usuario:</label>
                <input type="text" id="usuarioLogin" placeholder="Ej. DRPEREYRA" autocomplete="off">
            </div>
            <div class="form-group">
                <label for="passwordLogin">Contraseña:</label>
                <input type="password" id="passwordLogin" placeholder="••••••">
            </div>
            <button class="login-btn" onclick="verificarLogin()">Ingresar</button>
            ${mensajeError ? `<div class="login-error">${mensajeError}</div>` : ''}
        </div>
    `;
}

function verificarLogin() {
    const usuarioIngresado = document.getElementById('usuarioLogin').value.trim();
    const passwordIngresado = document.getElementById('passwordLogin').value.trim();

    // Credenciales requeridas
    if (usuarioIngresado === 'DRPEREYRA' && passwordIngresado === '235689') {
        adminAutenticado = true;
        renderizarMenu();
        cargarVista(menusPorRol['admin'][0].id);
    } else {
        mostrarPantallaLogin('Usuario o contraseña incorrectos. Verifique sus datos.');
    }
}

function cargarVista(idVista) {
    if (rolActual === 'admin' && !adminAutenticado) {
        mostrarPantallaLogin();
        return;
    }

    const contenedor = document.getElementById('dynamicView');
    const contenido = contenidosPaginas[idVista] || {
        titulo: 'Sección en desarrollo',
        descripcion: 'Contenido disponible próximamente en el aula virtual.'
    };

    contenedor.innerHTML = `
        <h2>${contenido.titulo}</h2>
        <p>${contenido.descripcion}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 0.9rem; color: #64748b;">Seminario Intensivo: Hipocondría y Cibercondría: El Terror al Cuerpo Enfermo en la Era de la Información | Dr. y Mgter. Rubén M. Pereyra.</p>
    `;
}

// Inicialización automática al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    adminAutenticado = false;
    document.getElementById('roleSelector').value = 'admin';
    renderizarMenuVacio();
    mostrarPantallaLogin();
});