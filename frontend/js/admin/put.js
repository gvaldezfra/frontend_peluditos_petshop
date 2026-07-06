const url = "http://localhost:3000/api/products";
const botonBuscar = document.querySelector(".search-btn");
const contenedorForm = document.querySelector(".form-container");
const estadoMensaje = document.getElementById("estado-mensaje");
const contenedorProductos = document.querySelector(".products-grid");

async function obtenerProductosId() {
    const busquedaId = document.getElementById("busqueda").value;
    try {
        let respuesta = await fetch(`${url}/${busquedaId}`); 

        if (!respuesta.ok || busquedaId === ""){
            renderProductos([]);

            return;
        }
        let data = await respuesta.json();

        console.log(data); 

        productos = data.payload; 

        renderProductos([productos]);

    } catch (error) {
        console.error(error);
    } finally {
        contenedorForm.innerHTML = "";
        estadoMensaje.innerHTML = "";
    }
}

function renderProductos(lista) {

    if (!lista.length) {
        contenedorProductos.innerHTML = `<p class="no-products">No existe el producto con ese ID</p>`;
        return;
    }

    contenedorProductos.innerHTML = lista.map(p => `
        <article class="product-card">
            <div class="product-image">
                <img src="../assets/img/${p.image}" alt="${p.name}">
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
            <div class="product-status">
                <p>${estadoString(p.active)}</p>
            </div>
            <div class="product-actions">
                <input class="btn btn-primary" type="button" id="updateProduct-button" value="Modificar producto">
                <input class="btn btn-primary" type="button" id="deleteProduct-button" value="Eliminar producto">
                <input class="btn btn-primary" type="button" id="toggleProduct-button" value="Activar/desactivar producto">
            </div>
        </article>
            
            
    `).join("");

    // boton y funcionalidad actualizar producto
    const actualizarProductoButton = document.getElementById("updateProduct-button");

    actualizarProductoButton.addEventListener("click", event => {
        event.stopPropagation();

        formularioProducto(event, lista);
    });

    // boton y funcionalidad borrar producto
    const eliminarProductoButton = document.getElementById("deleteProduct-button");

    eliminarProductoButton.addEventListener("click", event => {
        event.stopPropagation();

        eliminarProducto(event);
    });

    // boton y funcionalidad activar/desactivar producto
    const estadoProductoButton = document.getElementById("toggleProduct-button");

    estadoProductoButton.addEventListener("click", event => {
        event.stopPropagation();

        cambiarEstadoProducto(event, lista);
    });

}

function estadoString(estado){
    return estado === 1 ? "Activo" : "Desactivado";
}

function formularioProducto(event, lista) {
    event.stopPropagation();

    contenedorProductos.innerHTML = "";
    console.log(lista);

    let htmlActualizarForm = `
        <h2> Actualizar producto </h2>

        <form id="updateProduct-form">
            <input type="hidden" id="idProd" name="id" value="${lista[0].id}">

            <label>Nombre producto</label>
            <input type="text" name="name" id="nombreProducto" value="${lista[0].name}" required>

            <label>Precio producto</label>
            <input type="number" name="price" id="precioProducto" value="${lista[0].price}" required>

            <label>Tipo producto</label>
            <select name="type" id="tipoProducto" required>
                <option value="comida">Comida</option>
                <option value="accesorio">Accesorio</option>
            </select>

            <label>Tipo mascota</label>
            <select name="pet" id="mascotaProducto" required>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
            </select>

            <label>Stock producto</label>
            <input type="number" name="stock" id="stockProducto" value="${lista[0].stock}" required>
            
            <label>Imagen producto</label>
            <input type="text" name="image" id="imagenProducto" value="${lista[0].image}" required>

            
            <div>
                <input type="submit" value="Actualizar producto">
            </div>
        </form>
    `

    contenedorForm.innerHTML = htmlActualizarForm;

    const updateProductForm =  document.getElementById("updateProduct-form");

    updateProductForm.addEventListener("submit", event => {
        actualizarProducto(event);
    });
}

function mostrarMensajes(tipo, mensaje){
    estadoMensaje.innerHTML = `
        <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}

async function actualizarProducto(event) {
    event.preventDefault();

    const confirmacion = confirm("¿Queres actualizar el producto?");
    const errores = [];

    if (!confirmacion) {
        alert("Actualizacion cancelada");
        obtenerProductosId();
        contenedorForm.innerHTML = "";
        return;
    }

    const formData = new FormData(event.target);

    const data = Object.fromEntries(formData.entries());
    data.price = Number(data.price);
    data.stock = Number(data.price);

    if (!data.name || data.name.trim().length < 2){
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (!data.price || isNaN(data.price) || Number(data.price) < 0){
        errores.push("El precio debe ser mayor a 0");
    }

    if (!data.type){
        errores.push("Seleccione un tipo de producto");
    }

    if (!data.pet){
        errores.push("Seleccione al tipo de mascota que pertenece");
    }

    if (!data.stock || isNaN(data.stock) || Number(data.stock) < 0){
        errores.push("El stock debe ser mayor a 0");
    }

    if (errores.length > 0){
        mostrarMensajes("error", errores.join("\n"));
    }

    try{
        const busquedaId = document.getElementById("busqueda").value;
        const respuesta = await fetch(`${url}/${busquedaId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok){
            mostrarMensajes("error", resultado.message);
        }

        contenedorForm.innerHTML = "";
        mostrarMensajes("exito", resultado.message);

    } catch (error) {
        mostrarMensajes("error", "Error al procesar la solicitud");
    }
}

async function eliminarProducto(event) {
    event.preventDefault();

    const confirmacion = confirm("¿Seguro queres eliminar el producto");

    if (!confirmacion){
        alert("No se ha eliminado el producto");
        return;
    }

    try {
        const busquedaId = document.getElementById("busqueda").value;
        const respuesta = await fetch(`${url}/${busquedaId}`, {
            method: "DELETE"
            });
        
        const resultado = await respuesta.json();
        mostrarMensajes("exito", resultado.message);

    }catch (error) {
        mostrarMensajes("error", "Error al procesar la solicitud");
    }

}

async function cambiarEstadoProducto(event, lista) {
    event.preventDefault();

    const confirmacion = confirm("¿Queres activar/desactivar el producto?");

    if (!confirmacion){
        alert("No se ha activado/desactivado el producto");
        return;
    }

    try {
        const busquedaId = document.getElementById("busqueda").value;

        const respuesta = await fetch(`${url}/${busquedaId}/estado`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ active: lista[0].active === 1 ? 0 : 1})
        });

        const resultado = await respuesta.json();

        obtenerProductosId();
        mostrarMensajes("exito", resultado.message);
    } catch (error) {
        mostrarMensajes("error", "Error al procesar la solicitud");
    }
}

function init(){

    botonBuscar.addEventListener("click", obtenerProductosId);

    const busquedaId = document.getElementById("busqueda")

    busquedaId.addEventListener("keydown", (event) => {
        if (event.key === "Enter"){
            obtenerProductosId();
        }
    });

}

init();