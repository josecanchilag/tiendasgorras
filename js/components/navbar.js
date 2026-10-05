/**
 * URBAN CAPS · Componente Navbar
 * Construye la barra de navegación en todas las páginas y
 * calcula el enlace activo según la página actual.
 */

/** Enlaces del menú principal. */
const NAV_LINKS = (base) => [
    { texto: "Inicio", href: `${base}index.html`, pagina: "home" },
    { texto: "Catálogo", href: `${base}pages/productos.html`, pagina: "productos" },
    { texto: "Categorías", href: `${base}index.html#categorias`, pagina: "home", hash: "#categorias" },
    { texto: "Ofertas", href: `${base}pages/productos.html?ofertas=1`, pagina: "productos", oferta: true },
    { texto: "Nosotros", href: `${base}index.html#nosotros`, pagina: "home", hash: "#nosotros" },
    { texto: "Contacto", href: `${base}index.html#contacto`, pagina: "home", hash: "#contacto" }
];

/**
 * Determina qué enlace debe marcarse como activo.
 * @param {string} base - Ruta base ("../" en páginas internas).
 */
function obtenerEnlaceActivo(base) {
    const pagina = document.body.dataset.page || "home";
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);

    if (pagina === "home") {
        if (hash) return hash;
        return `${base}index.html`;
    }

    if (pagina === "productos") {
        if (params.get("ofertas") === "1") return "ofertas";
        if (params.get("categoria")) return "#categorias";
        return `${base}pages/productos.html`;
    }

    // producto, carrito y checkout dependen del catálogo
    return `${base}pages/productos.html`;
}

/** Renderiza el navbar dentro de #navbar-container. */
function renderizarNavbar() {
    const contenedor = document.getElementById("navbar-container");
    if (!contenedor) return;

    const base = document.body.dataset.base || "";
    const activo = obtenerEnlaceActivo(base);

    const enlaces = NAV_LINKS(base)
        .map((enlace) => {
            let referencia = enlace.hash || enlace.href;
            const esActivo = referencia === activo || (enlace.oferta && activo === "ofertas");
            return `
                <li class="nav-item">
                    <a class="nav-link${esActivo ? " active" : ""}" href="${enlace.href}"${esActivo ? ' aria-current="page"' : ""}>${enlace.texto}</a>
                </li>`;
        })
        .join("");

    contenedor.innerHTML = `
        <nav class="navbar navbar-expand-lg fixed-top uc-navbar" id="uc-navbar">
            <div class="container">
                <a class="navbar-brand" href="${base}index.html" aria-label="Urban Caps, ir al inicio">
                    <span class="uc-brand-mark" aria-hidden="true">UC</span>
                    <span class="uc-brand-text">Urban<span>Caps</span></span>
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#ucMenu"
                        aria-controls="ucMenu" aria-expanded="false" aria-label="Abrir menú de navegación">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="ucMenu">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                        ${enlaces}
                        <li class="nav-item ms-lg-2">
                            <a class="nav-link uc-cart-link" href="${base}pages/carrito.html"
                               aria-label="Ver carrito de compras" title="Carrito de compras">
                                <i class="bi bi-bag" aria-hidden="true"></i>
                                <span class="uc-cart-count" data-cart-count>0</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="uc-toast-container" id="uc-toasts" aria-live="polite" aria-atomic="true"></div>`;

    configurarScrollNavbar();
}

/** Añade sombra al navbar al hacer scroll. */
function configurarScrollNavbar() {
    const navbar = document.getElementById("uc-navbar");
    if (!navbar) return;

    const aplicarSombra = () => navbar.classList.toggle("is-scrolled", window.scrollY > 12);
    aplicarSombra();
    window.addEventListener("scroll", aplicarSombra, { passive: true });
}
