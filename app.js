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

            if (apellidoRegistro.includes(apellidoIngresado) && codigoRegistro === codigoIngresado) {
                participanteEncontrado = true;
                participanteActualNombre = data.apellidoNombre;
                // Asignar correctamente el link de Drive registrado, o usar el por defecto si está vacío
                participanteActualDrive = (data.linkDrive && data.linkDrive.trim() !== "") ? data.linkDrive : FOTO_DEFAULT_DRIVE;
            }
        });

        if (participanteEncontrado) {
            participanteAutenticado = true;
            renderizarMenu();
            mostrarAnimacionBienvenida();
            registrarAccesoFirestore(participanteActualNombre, "participante");
        } else {
            mostrarPantallaLoginParticipante('Apellido o Código de Matrícula incorrectos o no registrados.');
        }
    } catch (e) {
        console.error("Error en validación de participante:", e);
        mostrarPantallaLoginParticipante('Error al conectar con la base de datos. Intente nuevamente.');
    }
}
