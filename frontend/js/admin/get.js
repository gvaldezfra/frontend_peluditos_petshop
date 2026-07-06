const url = "http://localhost:3000/api/products";
const now = window.location.pathname;
const botonBuscar = document.querySelector(".search-btn");
const contenedorProductos = document.querySelector(".products-grid");

async function obtenerProductos() {
    try {
        let respuesta = await fetch(url); 

        let data = await respuesta.json();

        console.log(data); 

        productos = data.payload; 

        renderProductos(productos);

    } catch (error) {
        console.error(error);
        //renderProductos(productos_locales);
    }
}

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
    }
}

function renderProductos(lista) {

    if (!lista.length) {
        contenedorProductos.innerHTML = `<p class="no-products">No hay productos</p>`;
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
            <p>${estadoString(p.active)}</p>
        </article>
    `).join("");
}

function estadoString(estado){
    return estado === 1 ? "Activo" : "Desactivado";
}

function init(){
    if (now.includes("get.html")){
        obtenerProductos();
    };
    if (now.includes("getId.html")){
        botonBuscar.addEventListener("click", obtenerProductosId);

        const busquedaId = document.getElementById("busqueda")

        busquedaId.addEventListener("keydown", (event) => {
            if (event.key === "Enter"){
                obtenerProductosId();
            }
        });
    };
}

init();