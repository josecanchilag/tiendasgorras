/**
 * URBAN CAPS · Página de detalle (producto.html?id=1)
 * Carga la información del producto, gestiona color/cantidad
 * y renderiza los productos relacionados.
 */

const estadoProducto = {
    producto: null,
    color: null,
    cantidad: 1
};

/** Lee el id de la URL (?id=n). */
function obtenerIdDesdeURL() {
    return Number(new URLSearchParams(window.location.search).get("id"));
}

/** Imágenes de la galería: la principal + dos de la misma categoría. */
function construirGaleria(producto) {
    const relacionadas = PRODUCTOS.filter(
        (item) => item.categoria === producto.categoria && item.id !== producto.id
    ).slice(0, 2);

    return [producto.imagen, ...relacionadas.map((item) => item.imagen)];
}

/** Renderiza la vista completa del producto. */
function renderizarProducto(producto) {
    const contenedor = document.getElementById("producto-contenido");
    if (!contenedor) return;

    const galeria = construirGaleria(producto);
    const precioFinal = calcularPrecioFinal(producto);
    const stock = obtenerEstadoStock(producto.stock);
    const agotado = producto.stock <= 0;
    const tieneDescuento = producto.descuento > 0;

    estadoProducto.producto = producto;
    estadoProducto.color = producto.colorPrincipal;
    estadoProducto.cantidad = 1;

    document.title = `${producto.nombre} | Urban Caps`;
    const tituloCarga = document.getElementById("producto-titulo-carga");
    if (tituloCarga) tituloCarga.textContent = producto.nombre;

    // Migas de pan con la categoría real
    const migas = document.getElementById("migas-producto");
    if (migas) {
        migas.innerHTML = `
            <li class="breadcrumb-item"><a href="${rutaBase("index.html")}">Inicio</a></li>
            <li class="breadcrumb-item"><a href="${rutaBase("pages/productos.html")}">Catálogo</a></li>
            <li class="breadcrumb-item"><a href="${rutaBase(`pages/productos.html?categoria=${encodeURIComponent(producto.categoria)}`)}">${producto.categoria}</a></li>
            <li class="breadcrumb-item active" aria-current="page">${producto.nombre}</li>`;
    }

    const opcionesColor = producto.colores
        .map(
            (color) => `
                <button type="button" class="uc-color-option${color === estadoProducto.color ? " selected" : ""}"
                        data-color="${color}" aria-pressed="${color === estadoProducto.color}">
                    <span class="uc-swatch" style="background:${COLORES_HEX[color] || "#ccc"}"></span> ${color}
                </button>`
        )
        .join("");

    const miniaturas = galeria
        .map(
            (imagen, indice) => `
                <button type="button" class="${indice === 0 ? "active" : ""}" data-miniatura="${imagen}"
                        aria-label="Ver imagen ${indice + 1} de ${producto.nombre}">
                    <img src="${imagen}" alt="Vista ${indice + 1} de la gorra ${producto.nombre}" loading="lazy">
                </button>`
        )
        .join("");

    const precioAnterior = tieneDescuento
        ? `<span class="uc-product-old-price">${formatearPrecio(producto.precio)}</span>
           <span class="uc-discount-tag">-${producto.descuento}% OFF</span>`
        : "";

    contenedor.innerHTML = `
        <div class="row g-4 g-lg-5">
            <!-- Galería -->
            <div class="col-lg-6">
                <div class="uc-product-gallery">
                    <img id="producto-imagen-principal" class="uc-product-main-img"
                         src="${galeria[0]}" alt="Gorra ${producto.nombre} en ${producto.colorPrincipal}">
                    <div class="uc-product-thumbs" role="group" aria-label="Galería de imágenes">
                        ${miniaturas}
                    </div>
                </div>
            </div>

            <!-- Información -->
            <div class="col-lg-6">
                <div class="uc-product-info">
                    <span class="uc-product-category">${producto.categoria}</span>
                    <h1>${producto.nombre}</h1>

                    <div class="uc-rating">
                        <span class="uc-stars" role="img" aria-label="Valoración ${producto.rating} de 5">${generarEstrellas(producto.rating)}</span>
                        <span><strong>${producto.rating.toFixed(1)}</strong> · ${producto.ventas} ventas</span>
                    </div>

                    <div class="uc-product-prices">
                        <span class="uc-product-price">${formatearPrecio(precioFinal)}</span>
                        ${precioAnterior}
                    </div>

                    <p class="uc-product-desc">${producto.descripcion}</p>

                    <!-- Colores -->
                    <div class="mb-4">
                        <span class="uc-option-label">Color: <strong id="color-seleccionado">${estadoProducto.color}</strong></span>
                        <div class="uc-color-picker" id="selector-color">${opcionesColor}</div>
                    </div>

                    <!-- Cantidad y stock -->
                    <div class="d-flex align-items-center gap-3 flex-wrap">
                        <div>
                            <span class="uc-option-label">Cantidad</span>
                            <div class="uc-qty-box">
                                <button type="button" id="cantidad-menos" aria-label="Disminuir cantidad">−</button>
                                <input type="text" id="cantidad-valor" value="1" inputmode="numeric"
                                       aria-label="Cantidad seleccionada" readonly>
                                <button type="button" id="cantidad-mas" aria-label="Aumentar cantidad">+</button>
                            </div>
                        </div>
                        <div>
                            <span class="uc-option-label">Disponibilidad</span>
                            <span class="uc-stock-pill uc-stock-pill--${stock.clase}">
                                <i class="bi ${stock.icono}"></i> ${stock.texto}
                            </span>
                        </div>
                    </div>

                    <!-- Acciones -->
                    <div class="uc-product-actions">
                        <button type="button" class="btn btn-primary btn-lg" id="btn-agregar" ${agotado ? "disabled" : ""}>
                            <i class="bi bi-bag-plus me-2"></i>${agotado ? "Producto agotado" : "Agregar al carrito"}
                        </button>
                        <button type="button" class="btn btn-outline-dark btn-lg" id="btn-comprar-ahora" ${agotado ? "disabled" : ""}>
                            <i class="bi bi-lightning-charge me-2"></i>Comprar ahora
                        </button>
                    </div>

                    <!-- Características -->
                    <dl class="uc-specs">
                        <div class="row"><dt class="col-5">Material</dt><dd class="col-7">${producto.materiales}</dd></div>
                        <div class="row"><dt class="col-5">Ajuste</dt><dd class="col-7">${producto.ajuste}</dd></div>
                        <div class="row"><dt class="col-5">Categoría</dt><dd class="col-7">${producto.categoria}</dd></div>
                        <div class="row"><dt class="col-5">Stock disponible</dt><dd class="col-7">${producto.stock} unidades</dd></div>
                    </dl>

                    <div class="uc-benefits">
                        <span><i class="bi bi-truck"></i> Envío gratis desde ${formatearPrecio(ENVIO_GRATIS_DESDE)}</span>
                        <span><i class="bi bi-arrow-repeat"></i> Cambios por 30 días</span>
                        <span><i class="bi bi-shield-check"></i> Compra protegida</span>
                    </div>
                </div>
            </div>
        </div>`;

    configurarEventosProducto();
}

/** Conecta los eventos de color, miniaturas, cantidad y acciones. */
function configurarEventosProducto() {
    const producto = estadoProducto.producto;

    document.getElementById("selector-color")?.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-color]");
        if (!boton) return;

        estadoProducto.color = boton.dataset.color;
        document.querySelectorAll("#selector-color .uc-color-option").forEach((opcion) => {
            const activa = opcion === boton;
            opcion.classList.toggle("selected", activa);
            opcion.setAttribute("aria-pressed", activa);
        });

        const etiqueta = document.getElementById("color-seleccionado");
        if (etiqueta) etiqueta.textContent = estadoProducto.color;
    });

    document.querySelector(".uc-product-thumbs")?.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-miniatura]");
        if (!boton) return;

        const imagen = document.getElementById("producto-imagen-principal");
        if (imagen) {
            imagen.style.opacity = "0";
            setTimeout(() => {
                imagen.src = boton.dataset.miniatura;
                imagen.style.opacity = "1";
            }, 180);
        }

        document.querySelectorAll(".uc-product-thumbs button").forEach((mini) =>
            mini.classList.toggle("active", mini === boton)
        );
    });

    const inputCantidad = document.getElementById("cantidad-valor");

    const actualizarCantidadUI = () => {
        inputCantidad.value = estadoProducto.cantidad;
        document.getElementById("cantidad-menos").disabled = estadoProducto.cantidad <= 1;
        document.getElementById("cantidad-mas").disabled = estadoProducto.cantidad >= producto.stock;
    };

    document.getElementById("cantidad-menos")?.addEventListener("click", () => {
        estadoProducto.cantidad = Math.max(1, estadoProducto.cantidad - 1);
        actualizarCantidadUI();
    });

    document.getElementById("cantidad-mas")?.addEventListener("click", () => {
        estadoProducto.cantidad = Math.min(producto.stock, estadoProducto.cantidad + 1);
        actualizarCantidadUI();
    });

    actualizarCantidadUI();

    document.getElementById("btn-agregar")?.addEventListener("click", () => {
        agregarAlCarrito(producto, estadoProducto.cantidad, estadoProducto.color);
    });

    document.getElementById("btn-comprar-ahora")?.addEventListener("click", () => {
        agregarAlCarrito(producto, estadoProducto.cantidad, estadoProducto.color);
        window.location.href = rutaBase("pages/checkout.html");
    });
}

/** Pinta los productos de la misma categoría. */
function renderizarRelacionados(producto) {
    const seccion = document.getElementById("relacionados-seccion");
    const grid = document.getElementById("relacionados-grid");
    if (!seccion || !grid) return;

    const relacionados = PRODUCTOS.filter(
        (item) => item.categoria === producto.categoria && item.id !== producto.id
    ).slice(0, 4);

    if (!relacionados.length) return;

    renderizarProductos(relacionados, grid, { textoBoton: "Ver detalles" });
    seccion.classList.remove("d-none");
}

/** Mensaje cuando el id no corresponde a ningún producto. */
function renderizarProductoNoEncontrado() {
    const contenedor = document.getElementById("producto-contenido");
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="uc-empty text-center">
            <i class="bi bi-emoji-frown"></i>
            <h2>Producto no encontrado</h2>
            <p>El producto que buscas no existe o ya no está disponible.</p>
            <a href="${rutaBase("pages/productos.html")}" class="btn btn-primary">Ver catálogo completo</a>
        </div>`;

    document.title = "Producto no encontrado | Urban Caps";
}

document.addEventListener("DOMContentLoaded", () => {
    const id = obtenerIdDesdeURL();
    const producto = obtenerProductoPorId(id);

    if (producto) {
        renderizarProducto(producto);
        renderizarRelacionados(producto);
    } else {
        renderizarProductoNoEncontrado();
    }
});
