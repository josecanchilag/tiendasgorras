/**
 * URBAN CAPS · Componente Footer
 * Genera el pie de página compartido por todas las vistas.
 */

function renderizarFooter() {
    const contenedor = document.getElementById("footer-container");
    if (!contenedor) return;

    const base = document.body.dataset.base || "";
    const anio = new Date().getFullYear();

    const categorias = (typeof CATEGORIAS !== "undefined" ? CATEGORIAS : [])
        .map((categoria) => {
            const valor = encodeURIComponent(categoria);
            return `<li><a href="${base}pages/productos.html?categoria=${valor}">${categoria}</a></li>`;
        })
        .join("");

    contenedor.innerHTML = `
        <footer class="uc-footer">
            <div class="container">
                <div class="row g-4">
                    <div class="col-lg-4 col-md-6">
                        <a class="uc-footer-brand" href="${base}index.html">
                            <span class="uc-brand-mark" aria-hidden="true">UC</span>
                            Urban Caps
                        </a>
                        <p>
                            Tienda especializada en gorras urbanas, deportivas y premium.
                            Seleccionamos cada modelo para que encuentres la pieza que
                            representa tu estilo y te acompañe todos los días.
                        </p>
                        <div class="uc-socials">
                            <a href="#" aria-label="Instagram de Urban Caps"><i class="bi bi-instagram"></i></a>
                            <a href="#" aria-label="Facebook de Urban Caps"><i class="bi bi-facebook"></i></a>
                            <a href="#" aria-label="TikTok de Urban Caps"><i class="bi bi-tiktok"></i></a>
                            <a href="#" aria-label="X (Twitter) de Urban Caps"><i class="bi bi-twitter-x"></i></a>
                            <a href="#" aria-label="YouTube de Urban Caps"><i class="bi bi-youtube"></i></a>
                        </div>
                    </div>

                    <div class="col-lg-2 col-md-6 col-6">
                        <h2>Enlaces</h2>
                        <ul class="uc-footer-links">
                            <li><a href="${base}index.html">Inicio</a></li>
                            <li><a href="${base}pages/productos.html">Catálogo</a></li>
                            <li><a href="${base}index.html#ofertas">Ofertas</a></li>
                            <li><a href="${base}index.html#nosotros">Nosotros</a></li>
                            <li><a href="${base}pages/carrito.html">Carrito</a></li>
                            <li><a href="${base}pages/checkout.html">Checkout</a></li>
                        </ul>
                    </div>

                    <div class="col-lg-2 col-md-6 col-6">
                        <h2>Categorías</h2>
                        <ul class="uc-footer-links">
                            ${categorias}
                        </ul>
                    </div>

                    <div class="col-lg-4 col-md-6">
                        <h2>Contacto</h2>
                        <ul class="uc-footer-links uc-footer-contact">
                            <li><i class="bi bi-geo-alt"></i><span>Cra. 15 #93-45, Bogotá, Colombia</span></li>
                            <li><i class="bi bi-telephone"></i><span>+57 (601) 555 0142</span></li>
                            <li><i class="bi bi-envelope"></i><span>hola@urbancaps.com</span></li>
                            <li><i class="bi bi-clock"></i><span>Lun a Sáb · 9:00 a.m. – 7:00 p.m.</span></li>
                        </ul>
                        <h2 class="mt-4">Métodos de pago</h2>
                        <div class="uc-payments">
                            <span>VISA</span>
                            <span>Mastercard</span>
                            <span>AMEX</span>
                            <span>PSE</span>
                            <span>Nequi</span>
                            <span>Efecty</span>
                        </div>
                    </div>
                </div>

                <div class="uc-footer-bottom d-flex flex-wrap justify-content-between gap-2">
                    <span>&copy; ${anio} Urban Caps. Todos los derechos reservados.</span>
                    <span><a href="${base}index.html#nosotros">Términos</a> · <a href="${base}index.html#contacto">Soporte</a> · Proyecto académico</span>
                </div>
            </div>
        </footer>`;
}
