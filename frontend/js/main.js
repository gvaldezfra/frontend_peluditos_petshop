// =====================================================================
// IMPORTS
// Funciones de renderizado desde layout.js (se encargan 
// del header/footer, los productos, el carrito, el ticket y
// el modal genérico de mensajes)
// =====================================================================

import { renderCarrito, renderizarLayout, renderProductos, mostrarModal } from "./layout.js";
import { renderTicket } from "./layout.js";


// =====================================================================
// CONFIGURACIÓN
// =====================================================================

// URL base de la API. Se usa para traer productos y para registrar ventas
const API_URL = 'http://localhost:3000/api';


// =====================================================================
// DATOS DE RESPALDO
// Se usan SOLO si falla la conexión con la API (ver getActiveProducts),
// para que el front pueda seguir mostrándose aunque el backend esté caído
// =====================================================================
const productos_locales = [
    { id: 1, name: "Collar rojo", price: 3000, type: "accesorio", pet: "perro", image: "collar.jpg", stock: 10 },
    { id: 2, name: "Correa reforzada", price: 4500, type: "accesorio", pet: "perro", image: "correa.jpg", stock: 8 },
    { id: 3, name: "Arnés ajustable", price: 6000, type: "accesorio", pet: "perro", image: "arnes.jpg", stock: 5 },
    { id: 4, name: "Plato de acero", price: 2500, type: "accesorio", pet: "perro", image: "plato.jpg", stock: 12 },
    { id: 5, name: "Juguete mordedor", price: 2000, type: "accesorio", pet: "perro", image: "mordedor.jpg", stock: 20 },
    { id: 6, name: "Pelota resistente", price: 1800, type: "accesorio", pet: "perro", image: "pelota.jpg", stock: 15 },
    { id: 7, name: "Rascador para gatos", price: 7000, type: "accesorio", pet: "gato", image: "rascador.jpg", stock: 4 },
    { id: 8, name: "Collar con cascabel", price: 2200, type: "accesorio", pet: "gato", image: "collar-gato.jpg", stock: 9 },
    { id: 9, name: "Transportadora", price: 12000, type: "accesorio", pet: "both", image: "transportadora.jpg", stock: 3 },
    { id: 10, name: "Cama acolchada", price: 15000, type: "accesorio", pet: "both", image: "cama.jpg", stock: 6 },
    { id: 101, name: "Balanceado Premium Perro", price: 8500, type: "comida", pet: "perro", image: "balanceado-perro.jpg", stock: 10 },
    { id: 102, name: "Alimento Seco Gato Adulto", price: 7800, type: "comida", pet: "gato", image: "balanceado-gato.jpg", stock: 8 },
    { id: 103, name: "Lata Carne para Perro", price: 2500, type: "comida", pet: "perro", image: "lata-perro.jpg", stock: 20 },
    { id: 104, name: "Lata Atún para Gato", price: 2300, type: "comida", pet: "gato", image: "lata-gato.jpg", stock: 15 },
    { id: 105, name: "Snack Huesitos", price: 1800, type: "comida", pet: "perro", image: "snack-huesos.jpg", stock: 25 },
    { id: 106, name: "Snack Dental", price: 2000, type: "comida", pet: "perro", image: "snack-dental.jpg", stock: 18 },
    { id: 107, name: "Galletitas para Perro", price: 1500, type: "comida", pet: "perro", image: "galletitas.jpg", stock: 30 },
    { id: 108, name: "Sobres Húmedos Gato", price: 1200, type: "comida", pet: "gato", image: "sobres-gato.jpg", stock: 22 },
    { id: 109, name: "Alimento Cachorro", price: 9000, type: "comida", pet: "perro", image: "cachorro.jpg", stock: 6 },
    { id: 110, name: "Alimento Light Gato", price: 8200, type: "comida", pet: "gato", image: "light-gato.jpg", stock: 7 }
];


// =====================================================================
// ESTADO GLOBAL DE LA APP
// =====================================================================

// Productos que se muestran actualmente (vienen de la API o de productos_locales)
let productos = [];

// Carrito de compras. Se persiste en sessionStorage para sobrevivir
// a recargas de página (pero se borra si se cierra la pestaña)
let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];


// =====================================================================
// PRODUCTOS: obtener desde la API
// =====================================================================

// Trae los productos activos desde la API. Si la petición falla
// (por ejemplo, el backend no está corriendo), usa productos_locales
// como respaldo para que la app siga siendo utilizable
async function getActiveProducts() {
    try {
        let res = await fetch(`${API_URL}/products`);
        if (!res.ok) {
            throw new Error('Error en la conexión');
        }
        let data = await res.json(); // Convierto la respuesta a JSON

        productos = data.payload.filter(p => p.active === 1);

    } catch (error) {
        console.error('Hubo un problema. Usando datos locales.', error);
        productos = productos_locales;
    }
}


// =====================================================================
// BIENVENIDA: nombre del cliente
// =====================================================================

// Muestra el modal de bienvenida (solo en index) si todavía no hay un
// nombre guardado en la sesión, y escucha el botón "Continuar" para
// guardar el nombre y ocultar el modal
function inicializarBienvenida() {
    const modalBienvenida = document.getElementById("overlay-bienvenida");
    const btnContinuar = document.getElementById("btn-continuar");
    const inputNombre = document.getElementById("nombre");
    const nombreGuardado = sessionStorage.getItem("nombreCliente");

    // Si estamos en index y no hay nombre guardado, mostramos el modal
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        if (!nombreGuardado && modalBienvenida) {
            modalBienvenida.classList.remove("hidden");
        }

        if (btnContinuar) {
            btnContinuar.addEventListener("click", () => {
                const nombre = inputNombre.value.trim();
                if (nombre) {
                    sessionStorage.setItem("nombreCliente", nombre);
                    modalBienvenida.classList.add("hidden");
                    renderizarLayout(); // Re-renderiza para mostrar el saludo
                } else {
                    mostrarModal("Atención", "Por favor, ingresá tu nombre para continuar.");
                }
            });
        }
    }
}


// =====================================================================
// CARRITO: agregar producto
// =====================================================================

// Agrega "cantidad" unidades del producto "id" al carrito, validando
// que no se supere el stock disponible. Persiste el carrito actualizado
// en sessionStorage y avisa el resultado con el modal genérico
function agregarAlCarrito(id, cantidad) {
    // Busco la informacion del producto por id
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    // Verifico si ya hay de ese producto en el carrito
    const productoEnCarrito = carrito.find(item => item.id === id);
    const cantidadActual = productoEnCarrito ? productoEnCarrito.cantidad : 0;

    // Controlo el stock
    if (cantidadActual + cantidad > producto.stock) {
        alert(`¡No hay suficiente stock! Tienes ${cantidadActual} en el carrito y el stock máximo es de ${producto.stock}.`);
        return;
    }

    // Agregar o sumar al carrito
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
    } else {
        carrito.push({ ...producto, cantidad: cantidad });
    }

    // Guardo en sessionStorage y muestro mensaje de exito
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    console.log("Carrito guardado:", carrito);
    mostrarModal("¡Éxito!", `¡Agregaste ${cantidad}x ${producto.name} al carrito!`);

    // Resetea el input a 1
    const inputProd = document.getElementById(`cantidad-prod${id}`);
    if (inputProd) inputProd.value = 1;
}


// =====================================================================
// TEMA CLARO / OSCURO
// Esta función solo aplica el tema guardado al cargar la página
// El TOGGLE (cambiar de tema al hacer click) se maneja más abajo,
// dentro de la delegación de eventos 
// =====================================================================
function aplicarTemaGuardado() {
    const temaGuardado = localStorage.getItem("theme");
    if (temaGuardado === "dark") {
        document.body.classList.add("dark-theme");
    }
}


// =====================================================================
// DELEGACIÓN DE EVENTOS
// Un único listener de "click" en document maneja todas las
// interacciones de la app (delegación de eventos), para no tener que
// poner un listener por cada botón que se renderiza
// =====================================================================
document.addEventListener("click", (e) => {

    // Botones de elegir categoría (home y filtros de productos.html)
    const btnCategoria = e.target.closest("[data-cat]");
    if (btnCategoria) {
        const categoria = btnCategoria.dataset.cat;
        sessionStorage.setItem("filtroActual", categoria);
        if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
            window.location.href = "productos.html";
        } else {
            renderProductos(productos);
        }
    }

    // Botones "+" y "-" (sirven tanto para Productos como para el Carrito)
    if (e.target.classList.contains("btn-plus") || e.target.classList.contains("btn-minus")) {
        const isCart = e.target.id.includes("cart");
        const productId = isCart
            ? parseInt(e.target.dataset.id)
            : parseInt(e.target.closest(".quantity-container").querySelector(".product-quantity-input").id.replace("cantidad-prod", ""));

        const producto = productos.find(p => p.id === productId);
        const productoEnCarrito = carrito.find(item => item.id === productId);

        if (isCart) {
            // LÓGICA DENTRO DEL CARRITO (modifica la cantidad directamente)
            if (e.target.classList.contains("btn-plus")) {
                if (productoEnCarrito.cantidad < producto.stock) {
                    productoEnCarrito.cantidad += 1;
                } else {
                    mostrarModal("Límite alcanzado", `Solo hay ${producto.stock} unidades en stock.`);
                }
            } else if (e.target.classList.contains("btn-minus") && productoEnCarrito.cantidad > 1) {
                productoEnCarrito.cantidad -= 1;
            }
            sessionStorage.setItem("carrito", JSON.stringify(carrito));
            renderCarrito(carrito); // Re-renderizamos para actualizar totales

        } else {
            // LÓGICA EN LA PANTALLA DE PRODUCTOS (solo modifica el input, todavía no se agrega al carrito)
            const input = document.getElementById(`cantidad-prod${productId}`);
            let currentValue = parseInt(input.value);
            const cantidadYaEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
            const stockDisponible = producto.stock - cantidadYaEnCarrito;

            if (e.target.classList.contains("btn-plus")) {
                if (currentValue < stockDisponible) {
                    input.value = currentValue + 1;
                } else {
                    mostrarModal("Límite alcanzado", `Solo quedan ${stockDisponible} unidades disponibles para agregar.`);
                }
            } else if (e.target.classList.contains("btn-minus") && currentValue > 1) {
                input.value = currentValue - 1;
            }
        }
    }

    // Botón "Agregar al carrito" (pantalla Productos)
    if (e.target.id.startsWith("btn-agregar-prod")) {
        const productId = parseInt(e.target.id.replace("btn-agregar-prod", ""));
        const cantidad = parseInt(document.getElementById(`cantidad-prod${productId}`).value);
        agregarAlCarrito(productId, cantidad);
    }

    // Botón "Eliminar" del carrito (pantalla Carrito)
    if (e.target.classList.contains("td-delete")) {
        const productId = parseInt(e.target.dataset.id);
        carrito = carrito.filter(item => item.id !== productId);
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito(carrito);
    }

    // Botón "Finalizar compra": valida el carrito, pide confirmación
    // con el modal, registra la venta en la API y redirige al ticket
    if (e.target.classList.contains("btn-fin")) {
        if (carrito.length === 0) {
            mostrarModal("Carrito vacío", "No tienes productos en el carrito para comprar.");
            return;
        }

        // Usamos nuestro modal personalizado con un callback para la confirmación
        mostrarModal("Confirmar compra", "¿Estás seguro que deseas finalizar tu pedido?", async () => {

            // Obtenemos el nombre guardado en la bienvenida
            const nombreCliente = sessionStorage.getItem("nombreCliente") || "Cliente Anónimo";

            // Mapeamos el carrito al formato exacto que pide ventas.controller.js
            const productosParaBackend = carrito.map(item => ({
                id_product: item.id,
                amount: item.cantidad
            }));

            const payload = {
                name: nombreCliente,
                products: productosParaBackend
            };

            try {
                // Hacemos el POST a la API
                const response = await fetch("http://localhost:3000/api/ventas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    mostrarModal("Error", data.message || "Hubo un error al procesar la compra.");
                    return;
                }

                // Si es OK guardamos los datos para poder dibujar el ticket en la otra página
                sessionStorage.setItem("ultimaCompra", JSON.stringify(carrito));
                sessionStorage.setItem("idVenta", data.id_venta); // El controller devuelve el id_venta

                // Vaciamos el carrito actual
                carrito = [];
                sessionStorage.setItem("carrito", JSON.stringify(carrito));

                // Redirigimos a la pantalla del ticket
                window.location.href = "ticket.html";

            } catch (error) {
                console.error("Error al finalizar compra:", error);
                mostrarModal("Error", "No se pudo conectar con el servidor.");
            }
        });
    }

    // Botón "Descargar ticket" -> genera un PDF con html2pdf a partir del ticket renderizado
    if (e.target.classList.contains("btn-download")) {
        const ticketElement = document.querySelector(".ticket-container");
        const opciones = {
            margin: 0.5,
            filename: 'Ticket_Peluditos.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 }, // Mejora la resolución del PDF
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        // Ejecuta la librería que se carga en el HTML
        html2pdf().set(opciones).from(ticketElement).save();
    }

    // Botón "Volver a inicio" -> reinicia la app (autoservicio, no e-commerce)
    if (e.target.classList.contains("btn-back")) {
        // Borramos TODA la sesión (carrito, nombre, id de venta, etc.)
        sessionStorage.clear();
        // Redirigimos al inicio
        window.location.href = "index.html";
    }

    // Botón "Tema claro/oscuro": togglea la clase en <body>, guarda la
    // preferencia y actualiza en vivo el ícono y los logos (versión clara/oscura).
    const btnTheme = e.target.closest("#btn-theme-toggle");
    if (btnTheme) {
        // Cambiamos la clase en el body (usamos "dark-mode" según el CSS)
        document.body.classList.toggle("dark-mode");

        // Verificamos si quedó activo o no
        const isDark = document.body.classList.contains("dark-mode");

        // Guardamos la preferencia
        localStorage.setItem("theme", isDark ? "dark" : "light");

        // Cambiamos el icono del botón
        btnTheme.innerText = isDark ? "☀️" : "🌙";

        // Cambiamos el src del logo en vivo (hay un logo para fondo claro y otro para fondo oscuro)
        const logoPrincipal = document.getElementById("logo-principal");
        if (logoPrincipal) {
            logoPrincipal.src = isDark ? "../assets/img/logo-oscuro.png" : "../assets/img/logo.png";
        }

        // Ídem para el logo de texto PELUDITOS
        const logoTexto = document.getElementById("logo-texto");
        if (logoTexto) {
            logoTexto.src = isDark ? "../assets/img/texto-peluditos-oscuro.png" : "../assets/img/texto-peluditos.png";
        }
    }
});


// =====================================================================
// INICIALIZACIÓN DE LA APP
// =====================================================================

// Arranca la app: renderiza el header/footer, maneja la bienvenida, trae
// los productos y renderiza la pantalla que corresponda según la ruta
async function init() {
    // Renderizo el header y footer
    renderizarLayout();
    inicializarBienvenida();

    // Espero que carguen los productos de la API
    await getActiveProducts();

    if (window.location.pathname.includes('productos.html')) {
        renderProductos(productos);
    }
    if (window.location.pathname.includes('carrito.html')) {
        renderCarrito(carrito);
    }
    if (window.location.pathname.includes('ticket.html')) {
        // Importado desde layout.js arriba de todo en este archivo
        renderTicket();
    }
}


// =====================================================================
// EJECUCIÓN
// =====================================================================
aplicarTemaGuardado();
init();