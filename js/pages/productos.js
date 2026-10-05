/**
 * URBAN CAPS · Página del catálogo (productos.html)
 * Buscador, filtros, ordenamiento y renderizado dinámico.
 */

const estadoCatalogo = {
    busqueda: "",
    categoria: "",
    color: "",
    precio: "",
    orden: "relevancia",
    soloOfertas: false
};

/** Rangos de precio disponibles en el filtro. */
const RANGOS_PRECIO = {
    "0-70000": { min: 0, max: 70000 },
    "70000-90000": { min: 70000, max: 90000 },
    "90000-130000": { min: 90000, max: 130000 },
    "130000-999999": { min: 130000, max: Infinity }
};

/** Completa los select de categoría y color con los datos del catálogo. */
function poblarSelectsFiltros() {
    const selectCategoria = document.getElementById("filtro-categoria");
    const selectColor = document.getElementById("filtro-color");

    if (selectCategoria) {
        CATEGORIAS.forEach((categoria) => {
            const opcion = document.createElement("option");
            opcion.value = categoria;
            opcion.textContent = categoria;
            selectCategoria.appendChild(opcion);
        });
    }

    if (selectColor) {
        COLORES.forEach((color) => {
            const opcion = document.createElement("option");
            opcion.value = color;
            opcion.textContent = color;
            selectColor.appendChild(opcion);
        });
    }
}

/** Aplica los filtros activos sobre el catálogo completo. */
function filtrarProductos(lista = PRODUCTOS) {
    const texto = normalizarTexto(estadoCatalogo.busqueda);
    const rango = estadoCatalogo.precio ? RANGOS_PRECIO[estadoCatalogo.precio] : null;

    const filtrados = lista.filter((producto) => {
        if (estadoCatalogo.soloOfertas && producto.descuento <= 0) return false;

        const coincideBusqueda =
            !texto ||
            normalizarTexto(producto.nombre).includes(texto) ||
            normalizarTexto(producto.categoria).includes(texto) ||
            normalizarTexto(producto.descripcion).includes(texto) ||
            normalizarTexto(producto.colores.join(" ")).includes(texto);

        const coincideCategoria = !estadoCatalogo.categoria || producto.categoria === estadoCatalogo.categoria;
        const coincideColor = !estadoCatalogo.color || producto.colores.includes(estadoCatalogo.color);
        const precioFinal = calcularPrecioFinal(producto);
        const coincidePrecio = !rango || (precioFinal >= rango.min && precioFinal <= rango.max);

        return coincideBusqueda && coincideCategoria && coincideColor && coincidePrecio;
    });

    return ordenarProductos(filtrados);
}

/** Ordena el listado según la opción seleccionada. */
function ordenarProductos(lista) {
    const copia = [...lista];

    switch (estadoCatalogo.orden) {
        case "precio-asc":
            return copia.sort((a, b) => calcularPrecioFinal(a) - calcularPrecioFinal(b));
        case "precio-desc":
            return copia.sort((a, b) => calcularPrecioFinal(b) - calcularPrecioFinal(a));
        case "nombre":
            return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
        case "popularidad":
            return copia.sort((a, b) => b.ventas * b.rating - a.ventas * a.rating);
        default:
            return copia.sort((a, b) => b.descuento - a.descuento || b.rating - a.rating);
    }
}

/** Actualiza el contador de resultados y los chips de filtros activos. */
function actualizarResumenCatalogo(total) {
    const contador = document.getElementById("resultados-contador");
    const chips = document.getElementById("filtros-activos");

    if (contador) {
        contador.innerHTML =
            total === 0
                ? "Sin resultados"
                : `<strong>${total}</strong> ${total === 1 ? "producto encontrado" : "productos encontrados"}`;
    }

    if (!chips) return;

    const activos = [];
    if (estadoCatalogo.soloOfertas) activos.push({ clave: "soloOfertas", texto: "Solo ofertas" });
    if (estadoCatalogo.busqueda) activos.push({ clave: "busqueda", texto: `“${estadoCatalogo.busqueda}”` });
    if (estadoCatalogo.categoria) activos.push({ clave: "categoria", texto: estadoCatalogo.categoria });
    if (estadoCatalogo.color) activos.push({ clave: "color", texto: estadoCatalogo.color });
    if (estadoCatalogo.precio) {
        const etiqueta = document.querySelector(`#filtro-precio[value="${estadoCatalogo.precio}"]`)?.textContent;
        activos.push({ clave: "precio", texto: etiqueta || "Rango de precio" });
    }

    chips.innerHTML = activos
        .map(
            (chip) =>
                `<button type="button" class="uc-chip" data-quitar="${chip.clave}" aria-label="Quitar filtro ${chip.texto}">${chip.texto} <i class="bi bi-x-lg"></i></button>`
        )
        .join("");
}

/** Vuelve a pintar el catálogo con los filtros actuales. */
function aplicarFiltrosCatalogo() {
    const grid = document.getElementById("catalogo-grid");
    const vacio = document.getElementById("catalogo-vacio");
    if (!grid) return;

    const productos = filtrarProductos();
    actualizarResumenCatalogo(productos.length);

    renderizarProductos(productos, grid, {
        textoBoton: "Ver detalles",
        alVacio: () => vacio?.classList.remove("d-none")
    });

    vacio?.classList.toggle("d-none", productos.length > 0);
}

/** Limpia todos los filtros y vuelve al catálogo completo. */
function limpiarFiltrosCatalogo() {
    Object.assign(estadoCatalogo, {
        busqueda: "",
        categoria: "",
        color: "",
        precio: "",
        orden: "relevancia",
        soloOfertas: false
    });

    // La URL limpia evita reaplicar los parámetros al recargar.
    try {
        window.history.replaceState({}, "", window.location.pathname);
    } catch (error) {
        // Algunos navegadores restringen history en archivos locales (file://).
    }

    const campos = {
        "filtro-busqueda": "",
        "filtro-categoria": "",
        "filtro-color": "",
        "filtro-precio": "",
        "filtro-orden": "relevancia"
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const campo = document.getElementById(id);
        if (campo) campo.value = valor;
    });

    aplicarFiltrosCatalogo();
}

/** Lee los parámetros de URL (?categoria=, ?ofertas=, ?q=) del enlace. */
function aplicarParametrosURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.get("categoria")) estadoCatalogo.categoria = params.get("categoria");
    if (params.get("color")) estadoCatalogo.color = params.get("color");
    if (params.get("q")) estadoCatalogo.busqueda = params.get("q");
    if (params.get("orden")) estadoCatalogo.orden = params.get("orden");
    estadoCatalogo.soloOfertas = params.get("ofertas") === "1";

    document.getElementById("filtro-busqueda").value = estadoCatalogo.busqueda;
    document.getElementById("filtro-categoria").value = estadoCatalogo.categoria;
    document.getElementById("filtro-color").value = estadoCatalogo.color;
}

function configurarEventosCatalogo() {
    const busqueda = document.getElementById("filtro-busqueda");
    let temporizador;

    busqueda?.addEventListener("input", (evento) => {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => {
            estadoCatalogo.busqueda = evento.target.value;
            aplicarFiltrosCatalogo();
        }, 250);
    });

    const enlaces = {
        "filtro-categoria": "categoria",
        "filtro-color": "color",
        "filtro-precio": "precio",
        "filtro-orden": "orden"
    };

    Object.entries(enlaces).forEach(([id, clave]) => {
        document.getElementById(id)?.addEventListener("change", (evento) => {
            estadoCatalogo[clave] = evento.target.value;
            aplicarFiltrosCatalogo();
        });
    });

    document.getElementById("btn-limpiar-filtros")?.addEventListener("click", limpiarFiltrosCatalogo);
    document.getElementById("btn-limpiar-filtros-vacio")?.addEventListener("click", limpiarFiltrosCatalogo);

    document.getElementById("filtros-activos")?.addEventListener("click", (evento) => {
        const chip = evento.target.closest("[data-quitar]");
        if (!chip) return;

        const clave = chip.dataset.quitar;
        if (clave === "soloOfertas") {
            estadoCatalogo.soloOfertas = false;
        } else if (clave === "orden") {
            estadoCatalogo.orden = "relevancia";
        } else {
            estadoCatalogo[clave] = "";
            const campo = document.getElementById(`filtro-${clave}`);
            if (campo) campo.value = "";
        }
        aplicarFiltrosCatalogo();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    poblarSelectsFiltros();
    aplicarParametrosURL();
    configurarEventosCatalogo();

    const grid = document.getElementById("catalogo-grid");
    if (grid) renderizarEsqueletos(grid, 8);

    setTimeout(aplicarFiltrosCatalogo, 250);
});
