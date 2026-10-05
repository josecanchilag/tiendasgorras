/**
 * URBAN CAPS · Componente Tarjeta de Producto
 * Genera el HTML de cada tarjeta y las reutiliza en el home,
 * el catálogo y la sección de productos relacionados.
 */

/**
 * Convierte una valoración numérica en estrellas visuales.
 * @param {number} rating - Valoración de 0 a 5.
 */
function generarEstrellas(rating) {
    const completas = Math.floor(rating);
    const media = rating - completas >= 0.5;
    let html = "";

    for (let i = 1; i <= 5; i++) {
        if (i <= completas) html += '<i class="bi bi-star-fill" aria-hidden="true"></i>';
        else if (i === completas + 1 && media) html += '<i class="bi bi-star-half" aria-hidden="true"></i>';
        else html += '<i class="bi bi-star" aria-hidden="true"></i>';
    }
    return html;
}

/**
 * Estado del stock de un producto.
 * @returns {{clase: string, texto: string, icono: string}}
 */
function obtenerEstadoStock(stock) {
    if (stock <= 0) return { clase: "agotado", texto: "Agotado", icono: "bi-x-circle" };
    if (stock <= 5) return { clase: "bajo", texto: `¡Quedan ${stock} disponibles!`, icono: "bi-exclamation-circle" };
    return { clase: "ok", texto: `En stock (${stock})`, icono: "bi-check-circle" };
}

/** Swatches de colores de una tarjeta. */
function generarSwatches(colores) {
    return colores
        .map(
            (color) =>
                `<span class="uc-swatch" style="background:${COLORES_HEX[color] || "#ccc"}" title="${color}" aria-hidden="true"></span>`
        )
        .join("");
}

/**
 * Crea el HTML de una tarjeta de producto.
 * @param {object} producto - Producto a representar.
 * @param {object} [opciones] - Texto del botón de detalle y ruta actual.
 */
function crearTarjetaProducto(producto, opciones = {}) {
    const textoVer = opciones.textoBoton || "Ver detalles";
    const ruta = rutaBase(`pages/producto.html?id=${producto.id}`);
    const precioFinal = calcularPrecioFinal(producto);
    const stock = obtenerEstadoStock(producto.stock);
    const agotado = producto.stock <= 0;

    const descuento = producto.descuento > 0
        ? `<span class="uc-badge-discount">-${producto.descuento}%</span>`
        : "";

    const etiqueta = producto.etiqueta
        ? `<span class="uc-badge-label">${producto.etiqueta}</span>`
        : "";

    const precioAnterior = producto.descuento > 0
        ? `<span class="uc-price--old">${formatearPrecio(producto.precio)}</span>`
        : "";

    return `
        <article class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="uc-product-card">
                <div class="uc-card-media">
                    <a href="${ruta}" tabindex="-1" aria-hidden="true">
                        <img src="${producto.imagen}" alt="Gorra ${producto.nombre} de la categoría ${producto.categoria}" loading="lazy">
                    </a>
                    ${descuento}
                    ${etiqueta}
                </div>

                <div class="uc-card-body">
                    <span class="uc-card-category">${producto.categoria}</span>
                    <h3 class="uc-card-title"><a href="${ruta}">${producto.nombre}</a></h3>

                    <div class="uc-rating">
                        <span class="uc-stars" role="img" aria-label="Valoración ${producto.rating} de 5">${generarEstrellas(producto.rating)}</span>
                        <span>${producto.rating.toFixed(1)}</span>
                    </div>

                    <div class="uc-card-colors">
                        ${generarSwatches(producto.colores)}
                        <span>${producto.colores.join(" · ")}</span>
                    </div>

                    <div class="uc-card-prices">
                        <span class="uc-price">${formatearPrecio(precioFinal)}</span>
                        ${precioAnterior}
                    </div>

                    <span class="uc-card-stock uc-card-stock--${stock.clase}">
                        <i class="bi ${stock.icono}"></i> ${stock.texto}
                    </span>

                    <div class="uc-card-actions mt-auto">
                        <a href="${ruta}" class="btn btn-outline-dark btn-sm">${textoVer}</a>
                        <button type="button" class="btn btn-primary btn-sm" data-agregar="${producto.id}"
                                ${agotado ? "disabled" : ""} aria-label="Agregar ${producto.nombre} al carrito">
                            ${agotado ? "Agotado" : '<i class="bi bi-bag-plus me-1"></i> Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        </article>`;
}

/** Muestra esqueletos mientras se prepara el render. */
function renderizarEsqueletos(contenedor, cantidad = 8) {
    contenedor.innerHTML = Array.from({ length: cantidad })
        .map(() => '<div class="col-12 col-sm-6 col-md-4 col-lg-3"><div class="uc-skeleton"></div></div>')
        .join("");
}

/**
 * Pinta una lista de productos dentro de un contenedor (fila de grid).
 * @param {Array} productos - Productos a mostrar.
 * @param {string|HTMLElement} contenedor - Id o elemento del DOM.
 * @param {object} [opciones] - textos y comportamiento adicional.
 */
function renderizarProductos(productos, contenedor, opciones = {}) {
    const elemento = typeof contenedor === "string" ? document.getElementById(contenedor) : contenedor;
    if (!elemento) return;

    if (!productos.length) {
        elemento.innerHTML = "";
        elemento.classList.add("d-none");
        if (opciones.alVacio) opciones.alVacio();
        return;
    }

    elemento.classList.remove("d-none");
    elemento.innerHTML = productos.map((producto) => crearTarjetaProducto(producto, opciones)).join("");

    if (opciones.despues) opciones.despues(productos.length);
}
