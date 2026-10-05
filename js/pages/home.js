/**
 * URBAN CAPS · Página de inicio
 * Carga los productos destacados y gestiona el formulario de contacto.
 */

/** Selecciona los 8 productos con mejor combinación de rating y ventas. */
function obtenerDestacados(cantidad = 8) {
    return [...PRODUCTOS]
        .sort((a, b) => b.rating * b.ventas - a.rating * a.ventas)
        .slice(0, cantidad);
}

function renderizarDestacados() {
    const contenedor = document.getElementById("destacados-grid");
    if (!contenedor) return;

    renderizarEsqueletos(contenedor, 8);

    // Pequeño retardo para mostrar el estado de carga real.
    setTimeout(() => {
        renderizarProductos(obtenerDestacados(), contenedor, {
            textoBoton: "Ver producto"
        });
    }, 250);
}

function configurarFormularioContacto() {
    const formulario = document.getElementById("form-contacto");
    if (!formulario) return;

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (!formulario.checkValidity()) {
            formulario.classList.add("was-validated");
            return;
        }

        mostrarToast("¡Mensaje enviado! Te responderemos muy pronto.", "exito");
        formulario.reset();
        formulario.classList.remove("was-validated");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarDestacados();
    configurarFormularioContacto();
});
