

// svg para boton de tema claro/oscuro
export const iconoSun = `<svg viewBox="0 0 24 24" width="2em" height="2em" fill="#ffffff"><path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8V16Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4V8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16V20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"></path></svg>`;

export const iconoMoon = `<svg viewBox="0 0 24 24" width="2em" height="2em" fill="#000000" style="transform: scaleX(-1);"><path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8V16Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4V8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16V20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"></path></svg>`;


export function renderizarLayout() {
    const headerContainer = document.getElementById("header-container");
    const footerContainer = document.getElementById("footer-container");

    const nombreCliente = sessionStorage.getItem("nombreCliente") || "";

    const temaGuardado = localStorage.getItem("theme") || "light";
    const iconoTema = temaGuardado === "dark" ? iconoSun : iconoMoon;

    headerContainer.innerHTML = `
        <header id="header">
            <div class="header-content">
                <a class="header-logo" href="../views/index.html">
                    <img id="logo-principal" class="img-logo" src="../assets/img/logo.png" alt="logo" title="Tienda Peluditos" height="80px">
                    <img id="logo-texto" class="img-logo" src="../assets/img/texto-peluditos.png" alt="texto-peluditos" title="Tienda Peluditos" height="50px">                
                </a>
                <div class="name-container">
                    <h3 id="saludo">${nombreCliente ? `¡Hola, ${nombreCliente}!` : ''}</h3>
                </div>
                <nav class="header-nav">
                    <a class="nav-btn" href="../views/index.html">Inicio</a>
                    <a class="nav-btn" href="../views/productos.html">Productos</a>
                    <a class="nav-btn" href="../views/carrito.html">Carrito</a>
                    <button id="btn-theme-toggle" aria-label="Cambiar de tema" title="Cambiar de tema">${iconoTema}</button>
                </nav>
            </div>
        </header>
    `;

    footerContainer.innerHTML = `
        <footer>
            <p>&copy; 2026 Tienda Peluditos. Todos los derechos reservados.</p>
            <p> Desarrollado por: <strong>Matías Barboza y Guadalupe Valdez</strong></p>
        </footer>
    `;
}


export function renderProductos(lista) {
    const contenedorProductos = document.querySelector(".products-grid")

    const categoriaSeleccionada = sessionStorage.getItem("filtroActual") || "todos";

    if (!lista.length) {
        const contMensaje = document.querySelector(".no-products-container")
        contMensaje.classList.remove("hidden")
        return;
    }

    let listaFiltrada = lista;
    if (categoriaSeleccionada !== "todos") {
        listaFiltrada = lista.filter(p => p.type === categoriaSeleccionada);
    }

    contenedorProductos.innerHTML = listaFiltrada.map(p => `
        <article class="product-card">
            <div class="product-image">
                <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <div class="product-prices">
                    <p class="price">$${p.price}</p>
                    <span class="price-tax">
                        Precio sin impuestos: $${Math.floor(p.price / 1.21)}
                    </span>
                </div>
            </div>
            <div class="product-actions">
                <div class="quantity-container">
                    <button id="btn-minus-prod${p.id}" class="btn btn-minus">−</button>
                    <input type="tel" id="cantidad-prod${p.id}" class="product-quantity-input" step="1" value="1" readonly style="appearance:none;">
                    <button id="btn-plus-prod${p.id}" class="btn btn-plus">+</button>
                </div>
                <button id="btn-agregar-prod${p.id}" class="btn btn-primary">Agregar</button>
            </div>
        </article>
    `).join("");
}

export function renderCarrito(carrito) {
    const tbodyCarrito = document.querySelector(".cart-items");
    if (!tbodyCarrito) return;

    if (carrito.length === 0) {
        tbodyCarrito.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem;">
                    ¡Tu carrito está vacío! Revisa nuestros productos.
                </td>
            </tr>`;
        return;
    }

    tbodyCarrito.innerHTML = carrito.map(item => `
        <tr class="cart-item">
            <td class="td-product">
                <div class="cart-product-info">
                    <img src="../assets/img/${item.image}" alt="${item.name}">
                    <p>${item.name}</p>
                </div>
            </td>
            <td class="td-quantity">
                <div class="quantity-container">
                    <button id="btn-minus-cart${item.id}" class="btn btn-minus" data-id="${item.id}">−</button>
                    <input type="tel" id="cantidad-cart${item.id}" class="product-quantity-input" step="1" value="${item.cantidad}" readonly style="appearance:none; width: 40px; text-align: center;">
                    <button id="btn-plus-cart${item.id}" class="btn btn-plus" data-id="${item.id}">+</button>
                </div>
            </td>
            <td class="td-price">
                <div class="price-container">$${item.price * item.cantidad}</div>
            </td>
            <td>
                <button id="btn-eliminar-${item.id}" class="btn btn-primary td-delete" data-id="${item.id}">Eliminar</button>
            </td>
        </tr>
    `).join("");

    // CORRECCIÓN: Sumamos el total iterando el carrito
    const totalCarrito = carrito.reduce((acumulador, item) => acumulador + (item.price * item.cantidad), 0);

    tbodyCarrito.innerHTML += `
        <tr>
            <td class="td-total-price" colspan="3" style="text-align: end; padding: 2rem;">
            <p><strong>Total:</strong> $${totalCarrito}</p>
            </td>
        </tr>
    `;
}

export function mostrarModal(titulo, mensaje, onConfirmCallback = null) {
    const modal = document.getElementById("modal-container");
    if (!modal) return;
    
    document.getElementById("modal-title").innerText = titulo;
    document.getElementById("modal-message").innerText = mensaje;
    
    modal.classList.remove("hidden");
    
    const btnConfirm = document.getElementById("modal-btn-confirm");
    const btnCancel = document.getElementById("modal-btn-cancel");
    
    // Clonamos los botones para limpiar event listeners anteriores y evitar ejecuciones múltiples
    const newBtnConfirm = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);
    
    const newBtnCancel = btnCancel.cloneNode(true);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);
    
    newBtnCancel.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
    
    newBtnConfirm.addEventListener("click", () => {
        modal.classList.add("hidden");
        if (onConfirmCallback) onConfirmCallback();
    });
}

export function renderTicket() {
    const ticketContainer = document.querySelector(".ticket-container");
    if (!ticketContainer) return; 

    // Recuperamos los datos guardados en el paso anterior
    const ultimaCompra = JSON.parse(sessionStorage.getItem("ultimaCompra")) || [];
    const nombreCliente = sessionStorage.getItem("nombreCliente") || "Humano";
    const idVenta = sessionStorage.getItem("idVenta") || "N/A";
    
    if (ultimaCompra.length === 0) {
        ticketContainer.innerHTML = "<p>No hay datos de la última compra.</p>";
        return;
    }

    // Calculamos fecha y total
    const fechaActual = new Date().toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
    const totalCompra = ultimaCompra.reduce((acc, item) => acc + (item.price * item.cantidad), 0);

    // Inyectamos los datos en la cabecera
    document.querySelector(".ticket-id").innerHTML = `<strong>N° de pedido: </strong>${idVenta}`;
    document.querySelector(".ticket-user").innerHTML = `<strong>Usuario: </strong>${nombreCliente}`;
    document.querySelector(".ticket-date").innerHTML = `<strong>Fecha y hora: </strong>${fechaActual}`;

    // Inyectamos las filas de la tabla de productos
    const tbodyTicket = document.querySelector(".ticket-table tbody");
    tbodyTicket.innerHTML = ultimaCompra.map(item => `
        <tr class="ticket-item">
            <td class="ticket-item-name">${item.name}</td>
            <td class="ticket-qty">${item.cantidad}</td>
            <td class="ticket-item-price">$${item.price * item.cantidad}</td>
        </tr>
    `).join("");

    // Inyectamos el total
    document.querySelector(".total-price").innerText = `$${totalCompra}`;
}