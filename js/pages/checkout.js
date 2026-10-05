/**
 * URBAN CAPS · Página de checkout (checkout.html)
 * Muestra el resumen del pedido, controla los métodos de pago
 * simulados y procesa la confirmación de la compra.
 */

const METODOS_TARJETA = ["Tarjeta de crédito", "Tarjeta de débito"];

/** Método de pago seleccionado en el formulario. */
function obtenerMetodoPago() {
    return document.querySelector('input[name="pago"]:checked')?.value || "";
}

/** Dibuja el resumen del pedido a partir del carrito. */
function renderizarResumenCheckout() {
    const resumen = calcularTotal();
    const lista = document.getElementById("checkout-resumen-lista");
    const vacio = document.getElementById("checkout-vacio");
    const formulario = document.getElementById("form-checkout");
    if (!lista) return;

    const sinProductos = resumen.items.length === 0;
    vacio?.classList.toggle("d-none", !sinProductos);
    formulario?.classList.toggle("d-none", sinProductos);

    lista.innerHTML = resumen.items
        .map(
            (item) => `
                <li>
                    <img src="${item.producto.imagen}" alt="Gorra ${item.producto.nombre}" loading="lazy">
                    <span class="uc-order-name">
                        <strong>${item.producto.nombre}</strong>
                        <span>${item.color}</span>
                    </span>
                    <span class="uc-order-qty">x${item.cantidad}</span>
                    <strong>${formatearPrecio(item.subtotalLinea)}</strong>
                </li>`
        )
        .join("");

    const setText = (id, texto) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = texto;
    };

    setText("checkout-subtotal", formatearPrecio(resumen.subtotal));
    setText("checkout-descuento", `-${formatearPrecio(resumen.descuento)}`);
    setText("checkout-envio", resumen.envio === 0 ? "Gratis" : formatearPrecio(resumen.envio));
    setText("checkout-total", formatearPrecio(resumen.total));
}

/** Alterna los campos visibles según el método de pago elegido. */
function actualizarMetodoPago() {
    const metodo = obtenerMetodoPago();
    const esTarjeta = METODOS_TARJETA.includes(metodo);

    document.getElementById("campos-tarjeta")?.classList.toggle("d-none", !esTarjeta);
    document.getElementById("info-transferencia")?.classList.toggle("d-none", metodo !== "Transferencia bancaria");
    document.getElementById("info-contraentrega")?.classList.toggle("d-none", metodo !== "Pago contra entrega");

    // Los datos de tarjeta solo son obligatorios cuando se usan.
    ["tarjeta-numero", "tarjeta-vence", "tarjeta-cvv"].forEach((id) => {
        const campo = document.getElementById(id);
        if (campo) campo.required = esTarjeta;
    });
}

/** Formatea el número de tarjeta en bloques de 4 dígitos. */
function formatearNumeroTarjeta(evento) {
    const digitos = evento.target.value.replace(/\D/g, "").slice(0, 16);
    evento.target.value = digitos.replace(/(.{4})/g, "$1 ").trim();
}

/** Formatea el vencimiento como MM/AA. */
function formatearVencimiento(evento) {
    const digitos = evento.target.value.replace(/\D/g, "").slice(0, 4);
    evento.target.value = digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
}

/** Genera un número de pedido ficticio. */
function generarNumeroPedido() {
    return `UC-${Date.now().toString().slice(-6)}`;
}

/** Confirma la compra (simulación): valida, "procesa" y muestra el éxito. */
function procesarCompra(evento) {
    evento.preventDefault();

    const formulario = evento.currentTarget;
    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        mostrarToast("Revisa los campos marcados para continuar.", "error");
        formulario.querySelector(":invalid")?.focus();
        return;
    }

    const boton = document.getElementById("btn-confirmar-compra");
    const resumen = calcularTotal();
    if (!resumen.items.length) {
        mostrarToast("Tu carrito está vacío.", "error");
        return;
    }

    boton.disabled = true;
    boton.querySelector(".btn-label").classList.add("d-none");
    boton.querySelector(".btn-loading").classList.remove("d-none");

    setTimeout(() => {
        const numero = generarNumeroPedido();

        document.getElementById("numero-pedido").textContent = numero;
        document.getElementById("resumen-exito").textContent =
            `${resumen.cantidad} ${resumen.cantidad === 1 ? "producto" : "productos"} · ` +
            `Total ${formatearPrecio(resumen.total)} · Pago: ${obtenerMetodoPago()}`;

        vaciarCarrito();
        renderizarResumenCheckout();

        bootstrap.Modal.getOrCreateInstance(document.getElementById("modal-exito")).show();

        boton.disabled = false;
        boton.querySelector(".btn-label").classList.remove("d-none");
        boton.querySelector(".btn-loading").classList.add("d-none");
        formulario.reset();
        formulario.classList.remove("was-validated");
        actualizarMetodoPago();
    }, 1200);
}

function configurarCheckout() {
    actualizarMetodoPago();

    document.querySelectorAll('input[name="pago"]').forEach((radio) =>
        radio.addEventListener("change", actualizarMetodoPago)
    );

    document.getElementById("tarjeta-numero")?.addEventListener("input", formatearNumeroTarjeta);
    document.getElementById("tarjeta-vence")?.addEventListener("input", formatearVencimiento);
    document.getElementById("tarjeta-cvv")?.addEventListener("input", (evento) => {
        evento.target.value = evento.target.value.replace(/\D/g, "").slice(0, 4);
    });

    document.getElementById("form-checkout")?.addEventListener("submit", procesarCompra);
}

document.addEventListener("DOMContentLoaded", () => {
    configurarCheckout();
    renderizarResumenCheckout();
    document.addEventListener("carrito:actualizado", renderizarResumenCheckout);
});
