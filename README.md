# 🧢 Urban Caps — Tienda online de gorras

E-commerce completo y responsive para la compra y venta de gorras, construido
únicamente con **HTML5, CSS3, JavaScript vanilla (ES6+) y Bootstrap 5**.
No utiliza frameworks de JavaScript como React, Vue o Angular.

---

## 📄 Descripción

**Urban Caps** permite a los usuarios explorar un catálogo de más de 20 gorras,
navegar por categorías, buscar y filtrar productos, ver el detalle de cada
producto, administrar un carrito persistente (localStorage) y simular todo el
proceso de checkout con generación de número de pedido.

## 🛠 Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura de cada página |
| CSS3 | Variables, grid, animaciones, media queries |
| JavaScript ES6+ | Lógica de datos, filtros, carrito y checkout |
| Bootstrap 5.3 (CDN) | Grid, navbar, modals, forms, utilidades |
| Bootstrap Icons (CDN) | Iconografía |
| Google Fonts (CDN) | Montserrat (títulos) + Poppins (texto) |
| localStorage | Persistencia del carrito entre sesiones |

## 📁 Estructura de carpetas

```
urban-caps/
│
├── index.html                 # Página de inicio
│
├── pages/
│   ├── productos.html         # Catálogo con buscador y filtros
│   ├── producto.html          # Detalle (?id=1)
│   ├── carrito.html           # Carrito de compras
│   └── checkout.html          # Simulación de pago
│
├── css/
│   ├── styles.css             # Base, layout y estilos de páginas
│   ├── responsive.css         # Ajustes tablet / móvil
│   └── components.css         # Navbar, footer, tarjetas, botones
│
├── js/
│   ├── data/
│   │   └── productos.js       # Catálogo de productos (datos)
│   ├── components/
│   │   ├── navbar.js          # Barra de navegación compartida
│   │   ├── footer.js          # Pie de página compartido
│   │   └── productCard.js     # Tarjeta de producto reutilizable
│   ├── pages/
│   │   ├── home.js
│   │   ├── productos.js
│   │   ├── producto.js
│   │   ├── carrito.js
│   │   └── checkout.js
│   └── app.js                 # Núcleo: carrito, toasts, arranque
│
├── assets/
│   ├── img/
│   └── icons/
│       └── favicon.svg         # Ícono del sitio (SVG)
│
└── README.md
```

## ▶ Cómo ejecutar el proyecto

No requiere servidores ni compilación:

1. Descarga o clona la carpeta del proyecto.
2. Abre `index.html` con doble clic en cualquier navegador moderno
   (Chrome, Edge, Firefox o Safari).

> Las imágenes y librerías se cargan desde CDNs públicos, por lo que es
> necesario tener conexión a internet.

## ✅ Funcionalidades

- **Inicio**: hero, 6 categorías, 8 productos destacados, sección promocional,
  nosotros, contacto y footer completo.
- **Catálogo**: búsqueda en tiempo real, filtro por categoría, color y rango de
  precio, ordenamiento por precio / nombre / popularidad, chips de filtros
  activos, estado vacío y loading visual.
- **Detalle de producto**: galería con miniaturas, precio con descuento,
  selector visual de color, selector de cantidad con límite de stock,
  indicador de disponibilidad, "Agregar al carrito", "Comprar ahora" y
  productos relacionados.
- **Carrito**: aumentar / disminuir cantidades, eliminar líneas, vaciar con
  confirmación, subtotal, descuento, envío y total; persistencia con
  `localStorage`.
- **Contador del navbar**: se actualiza en todas las páginas al agregar,
  eliminar, modificar o vaciar productos.
- **Checkout**: formulario validado, 4 métodos de pago simulados, resumen del
  pedido en vivo y modal de éxito con número de pedido ficticio.
- **UX/UI**: toasts de Bootstrap, breadcrumbs, estados hover, skeletons de
  carga, botones disabled, alt descriptivos y labels asociados.
- **SEO**: `title` y `meta description` en cada página, etiquetas Open Graph,
  favicon SVG, `theme-color`, un solo `h1` por página y jerarquía de
  encabezados sin saltos (`h1 → h2 → h3`).
- **Responsive**: desktop, laptop, tablet y smartphone con el grid de Bootstrap
  y menú hamburguesa en pantallas pequeñas.

## ➕ Cómo agregar nuevos productos

Edita `js/data/productos.js` y agrega un objeto dentro del array `PRODUCTOS`:

```js
{
    id: 25,                          // debe ser único
    nombre: "Urban Classic Navy",
    categoria: "Urbanas",            // debe existir en el catálogo
    precio: 79900,                   // precio de lista en COP
    descuento: 10,                   // porcentaje (0 = sin descuento)
    colores: ["Azul", "Beige"],
    colorPrincipal: "Azul",
    descripcion: "Descripción comercial del producto.",
    materiales: "Algodón premium",
    ajuste: "Ajuste trasero regulable",
    stock: 15,
    rating: 4.8,                     // 0 a 5
    ventas: 320,                     // usado para ordenar por popularidad
    etiqueta: null,                  // "Nuevo" | "Oferta" | "Premium" | null
    imagen: "https://images.unsplash.com/...?w=800"
}
```

Las categorías, los filtros de color, el footer y las páginas relacionadas se
actualizan **automáticamente** a partir de los datos.

## 🎨 Cómo modificar los colores

Los colores oficiales están en `css/components.css`, dentro del bloque `:root`:

```css
:root {
    --uc-azul-marino: #0B1F33;
    --uc-azul-profundo: #123B5D;
    --uc-azul-medio: #2E6F95;
    --uc-beige-claro: #F4EBDD;
    --uc-beige: #DCC9A1;
    --uc-blanco: #FFFFFF;
    --uc-gris: #263238;
}
```

Cambia el valor hexadecimal y todo el sitio se actualiza. Para los swatches de
cada color de gorra, edita `COLORES_HEX` en `js/data/productos.js`.

## 🏷 Cómo modificar las categorías

Las categorías **no están hardcodeadas**: se derivan del campo `categoria` de
cada producto (array `CATEGORIAS` en `js/data/productos.js`).

1. Cambia o agrega el campo `categoria` en los productos.
2. Si creas una categoría nueva, actualiza la tarjeta correspondiente en
   `index.html` (sección *Categorías*) con su imagen y enlace.
3. El footer y los filtros se actualizan solos.

## 🧪 Verificación

- **Sintaxis**: los 10 archivos JavaScript pasan `node --check`.
- **Auditoría estática** de las 5 páginas: un solo `h1` por página, `alt` en
  todas las imágenes, `label` asociado a cada campo, sin `id` duplicados,
  `lang="es"`, `meta description` ≥ 50 caracteres y jerarquía de encabezados.
- **Pruebas funcionales headless** (jsdom) sobre las 5 páginas: render inicial,
  filtros y ordenamiento, detalle con color / cantidad / stock, carrito con
  totales y persistencia, y checkout completo hasta el modal de éxito:
  **70/70 comprobaciones OK** y 0 errores de consola.

## 📌 Notas

- Rutas relativas: `index.html` usa `css/...` y `pages/...`; las páginas dentro
  de `pages/` usan `../css/...` y `../pages/...` (controlado por `data-base`).
- El checkout es una **simulación**: no procesa pagos reales ni envía datos.
- Proyecto académico de la asignatura Lenguajes de Programación.
