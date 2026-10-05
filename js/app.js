/**
 * URBAN CAPS · Núcleo de la aplicación
 * Inicializa los componentes compartidos y concentra la lógica
 * del carrito (localStorage), los cálculos y los mensajes toast.
 *
 * Todas las páginas usan estas funciones, por lo que evitan
 * duplicar código entre vistas.
 */

const CLAVE_STORAGE = "urbanCapsCarrito";
const COSTO_ENVIO = 12000;
const ENVIO_GRATIS_DESDE = 200000;

/* ============================ Utilidades base ============================ */

/** Prefijo de ruta según la página actual ("" en index, "../" en /pages). */
function rutaBase(ruta) {
    const base = document.body?.dataset?.base || "";
    return `${base}${ruta}`;
}

/** Formatea un valor en pesos colombianos. */
function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor);
}

/** Precio de un producto aplicando su descuento. */
function calcularPrecioFinal(producto) {
    return Math.round(producto.precio * (1 - (producto.descuento || 0) / 100));
}

/** Busca un producto por su identificador. */
function obtenerProductoPorId(id) {
    return PRODUCTOS.find((producto) => producto.id === Number(id));
}

/** Quita tildes y pasa a minúsculas (búsquedas amigables). */
function normalizarTexto(texto) {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

/* ============================ Carrito: storage ============================ */

/** @returns {Array<{id:number,color:string,cantidad:number}>} */
function obtenerCarrito() {
    try {
        const datos = localStorage.getItem(CLAVE_STORAGE);
        const carrito = datos ? JSON.parse(datos) : [];
        return Array.isArray(carrito) ? carrito : [];
    } catch (error) {
        console.warn("No fue posible leer el carrito:", error);
        return [];
    }
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(carrito));
    } catch (error) {
        console.warn("No fue posible guardar el carrito:", error);
    }
    actualizarContadorCarrito();
}

/* ============================ Carrito: operaciones ============================ */

/**
 * Agrega un producto al carrito (o incrementa su cantidad si ya existe).
 * @param {object} producto - Producto a agregar.
 * @param {number} [cantidad=1] - Unidades a agregar.
 * @param {string} [color] - Color seleccionado.
 */
function agregarAlCarrito(producto, cantidad = 1, color = null) {
    if (!producto || producto.stock <= 0) {
        mostrarToast("Este producto no tiene stock disponible.", "error");
        return;
    }

    const carrito = obtenerCarrito();
    const colorElegido = color || producto.colorPrincipal;
    const existente = carrito.find((item) => item.id === producto.id && item.color === colorElegido);

    if (existente) {
        existente.cantidad = Math.min(existente.cantidad + cantidad, producto.stock);
    } else {
        carrito.push({
            id: producto.id,
            color: colorElegido,
            cantidad: Math.min(cantidad, producto.stock)
        });
    }

    guardarCarrito(carrito);
    mostrarToast(`${producto.nombre} agregado al carrito`, "exito");
    document.dispatchEvent(new CustomEvent("carrito:actualizado"));
}

/** Elimina una línea del carrito (producto + color). */
function eliminarDelCarrito(id, color) {
    const carrito = obtenerCarrito().filter(
        (item) => !(item.id === Number(id) && item.color === color)
    );
    guardarCarrito(carrito);
    mostrarToast("Producto eliminado del carrito.", "info");
    document.dispatchEvent(new CustomEvent("carrito:actualizado"));
}

/** Modifica la cantidad de una línea del carrito. */
function actualizarCantidad(id, color, cantidad) {
    const carrito = obtenerCarrito();
    const item = carrito.find((linea) => linea.id === Number(id) && linea.color === color);
    const producto = obtenerProductoPorId(id);
    if (!item || !producto) return;

    item.cantidad = Math.max(1, Math.min(cantidad, producto.stock));
    guardarCarrito(carrito);
    document.dispatchEvent(new CustomEvent("carrito:actualizado"));
}

/** Vacía por completo el carrito. */
function vaciarCarrito() {
    guardarCarrito([]);
    mostrarToast("Carrito vaciado.", "info");
    document.dispatchEvent(new CustomEvent("carrito:actualizado"));
}

/** Total de unidades en el carrito. */
function contarArticulos() {
    return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
}

/**
 * Calcula los valores del carrito desglosados.
 * @param {Array} [carrito] - Líneas del carrito (opcional).
 * @returns {{subtotal:number, descuento:number, envio:number, total:number, cantidad:number, items:Array}}
 */
function calcularTotal(carrito = obtenerCarrito()) {
    let subtotal = 0;
    let descuento = 0;
    let cantidad = 0;

    const items = carrito
        .map((linea) => {
            const producto = obtenerProductoPorId(linea.id);
            if (!producto) return null;

            const precioFinal = calcularPrecioFinal(producto);
            subtotal += producto.precio * linea.cantidad;
            descuento += (producto.precio - precioFinal) * linea.cantidad;
            cantidad += linea.cantidad;

            return {
                producto,
                color: linea.color,
                cantidad: linea.cantidad,
                precioUnitario: precioFinal,
                subtotalLinea: precioFinal * linea.cantidad
            };
        })
        .filter(Boolean);

    const neto = subtotal - descuento;
    const envio = carrito.length === 0 || neto >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;

    return {
        subtotal,
        descuento,
        envio,
        total: neto + envio,
        cantidad,
        items
    };
}

/** Actualiza el contador del navbar en todas las páginas. */
function actualizarContadorCarrito() {
    const total = contarArticulos();
    document.querySelectorAll("[data-cart-count]").forEach((badge) => {
        if (badge.textContent !== String(total)) {
            badge.textContent = total;
            badge.classList.add("is-bump");
            setTimeout(() => badge.classList.remove("is-bump"), 250);
        }
    });
}

/* ================================= Toast ================================= */

/**
 * Muestra un mensaje flotante usando el componente Toast de Bootstrap.
 * @param {string} mensaje - Texto del aviso.
 * @param {string} [tipo=info] - info | exito | error.
 */
function mostrarToast(mensaje, tipo = "info") {
    const contenedor = document.getElementById("uc-toasts");
    if (!contenedor || typeof bootstrap === "undefined") return;

    const iconos = {
        exito: "bi-check-circle-fill",
        error: "bi-exclamation-triangle-fill",
        info: "bi-info-circle-fill"
    };

    const toast = document.createElement("div");
    toast.className = `toast align-items-center fade uc-toast${tipo !== "info" ? ` uc-toast--${tipo}` : ""}`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${iconos[tipo] || iconos.info}" aria-hidden="true"></i>
            <span class="toast-body">${mensaje}</span>
            <button type="button" class="btn-close btn-close-white ms-2" data-bs-dismiss="toast" aria-label="Cerrar aviso"></button>
        </div>`;

    contenedor.appendChild(toast);
    toast.addEventListener("hidden.bs.toast", () => toast.remove());
    new bootstrap.Toast(toast, { delay: 3200 }).show();
}

/* =========================== Eventos globales =========================== */

/** Delegación de clics: cualquier botón [data-agregar] suma al carrito. */
function configurarDelegacionesGlobales() {
    document.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-agregar]");
        if (!boton || boton.disabled) return;

        const producto = obtenerProductoPorId(boton.dataset.agregar);
        if (producto) agregarAlCarrito(producto, 1, producto.colorPrincipal);
    });

    // Mantiene sincronizados los contadores si se abren dos pestañas.
    window.addEventListener("storage", actualizarContadorCarrito);
}

/* ============================== Arranque ============================== */
/* Se registra primero: los scripts de páginas se inicializan después. */
document.addEventListener("DOMContentLoaded", () => {
    renderizarNavbar();
    renderizarFooter();
    actualizarContadorCarrito();
    configurarDelegacionesGlobales();
});
