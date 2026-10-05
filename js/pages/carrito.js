/**
 * URBAN CAPS · Página del carrito (carrito.html)
 * Renderiza las líneas del carrito, permite modificar cantidades,
 * eliminar productos y muestra el resumen con los cálculos.
 */

/** Fila de un producto dentro del carrito. */
function crearFilaCarrito(item) {
    const { producto, color, cantidad, precioUnitario, subtotalLinea } = item;
    const stock = obtenerEstadoStock(producto.stock);
    const ruta = rutaBase(`pages/producto.html?id=${producto.id}`);

    return `
        <div class="uc-cart-item" data-id="${producto.id}" data-color="${color}">
            <div class="uc-cart-product">
                <a href="${ruta}">
                    <img src="${producto.imagen}" alt="Gorra ${producto.nombre}" loading="lazy">
                </a>
                <div>
                    <h3><a href="${ruta}">${producto.nombre}</a></h3>
                    <div class="uc-cart-meta">
                        <span class="uc-swatch" style="background:${COLORES_HEX[color] || "#ccc"}"></span>
                        Color: ${color}
                    </div>
                    <div class="uc-cart-meta">${producto.categoria}</div>
                </div>
            </div>

            <div class="uc-cart-cell">
                <span class="uc-cart-cell--label">Precio</span>
                ${formatearPrecio(precioUnitario)}
            </div>

            <div class="uc-cart-cell">
                <span class="uc-cart-cell--label">Cantidad</span>
                <div class="uc-qty-box">
                    <button type="button" data-accion="menos" aria-label="Disminuir cantidad de ${producto.nombre}"
                            ${cantidad <= 1 ? "disabled" : ""}>−</button>
                    <input type="text" value="${cantidad}" readonly aria-label="Cantidad de ${producto.nombre}">
                    <button type="button" data-accion="mas" aria-label="Aumentar cantidad de ${producto.nombre}"
                            ${cantidad >= producto.stock ? "disabled" : ""}>+</button>
                </div>
                <span class="uc-cart-meta mt-1">${stock.texto}</span>
            </div>

            <div class="uc-cart-cell">
                <span class="uc-cart-cell--label">Subtotal</span>
                ${formatearPrecio(subtotalLinea)}
            </div>

            <div class="uc-cart-actions">
                <button type="button" class="uc-icon-btn uc-icon-btn--danger" data-accion="eliminar"
                        aria-label="Eliminar ${producto.nombre} del carrito" title="Eliminar producto">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        </div>`;
}

/** Actualiza el bloque de resumen (subtotal, envío, descuento, total). */
function renderizarResumenCarrito(resumen) {
    const setText = (id, texto) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = texto;
    };

    setText("resumen-subtotal", formatearPrecio(resumen.subtotal));
    setText("resumen-descuento", `-${formatearPrecio(resumen.descuento)}`);
    setText("resumen-envio", resumen.envio === 0 ? "Gratis" : formatearPrecio(resumen.envio));
    setText("resumen-total", formatearPrecio(resumen.total));

    const nota = document.getElementById("nota-envio");
    if (nota) {
        nota.innerHTML =
            resumen.envio === 0
                ? '<i class="bi bi-truck"></i><span>¡Tienes envío gratis en tu pedido!</span>'
                : `<i class="bi bi-truck"></i><span>Agrega ${formatearPrecio(ENVIO_GRATIS_DESDE - (resumen.subtotal - resumen.descuento))} más y el envío es gratis.</span>`;
    }
}

/** Renderiza el carrito completo según el localStorage. */
function renderizarCarrito() {
    const vacio = document.getElementById("carrito-vacio");
    const contenido = document.getElementById("carrito-contenido");
    const lista = document.getElementById("carrito-lista");
    if (!vacio || !contenido || !lista) return;

    const resumen = calcularTotal();

    if (!resumen.items.length) {
        vacio.classList.remove("d-none");
        contenido.classList.add("d-none");
        return;
    }

    vacio.classList.add("d-none");
    contenido.classList.remove("d-none");
    lista.innerHTML = resumen.items.map(crearFilaCarrito).join("");
    renderizarResumenCarrito(resumen);
}

/** Maneja los clics de cantidad y eliminación dentro del listado. */
function configurarEventosCarrito() {
    const lista = document.getElementById("carrito-lista");

    lista?.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-accion]");
        if (!boton || boton.disabled) return;

        const fila = boton.closest(".uc-cart-item");
        const id = Number(fila.dataset.id);
        const color = fila.dataset.color;
        const item = obtenerCarrito().find((linea) => linea.id === id && linea.color === color);
        if (!item) return;

        switch (boton.dataset.accion) {
            case "mas":
                actualizarCantidad(id, color, item.cantidad + 1);
                break;
            case "menos":
                actualizarCantidad(id, color, item.cantidad - 1);
                break;
            case "eliminar":
                eliminarDelCarrito(id, color);
                break;
        }
        // La mutación dispara "carrito:actualizado" que vuelve a pintar la vista.
    });

    // Confirmación antes de vaciar todo el carrito
    document.getElementById("btn-vaciar-carrito")?.addEventListener("click", () => {
        bootstrap.Modal.getOrCreateInstance(document.getElementById("modal-confirmar-vaciar")).show();
    });

    document.getElementById("btn-confirmar-vaciar")?.addEventListener("click", () => {
        bootstrap.Modal.getInstance(document.getElementById("modal-confirmar-vaciar"))?.hide();
        vaciarCarrito();
        renderizarCarrito();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();
    configurarEventosCarrito();

    // Mantiene la vista al día si el carrito cambia en otra pestaña.
    document.addEventListener("carrito:actualizado", renderizarCarrito);
});
