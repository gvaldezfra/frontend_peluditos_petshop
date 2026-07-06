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


//Para ver la contrasenia mientras se escribe en el login
const inputPass = document.getElementById("pass");
const btnTogglePass = document.getElementById("btn-toggle-pass");

// svg de Abierto/Cerrado
const svgOjoAbierto = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
`;

const svgOjoCerrado = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
`;

btnTogglePass.addEventListener("click", () => {
    if (inputPass.type === "password") {
        inputPass.type = "text"; 
        btnTogglePass.innerHTML = svgOjoCerrado; // Inyectamos el ojo tachado
    } else {
        inputPass.type = "password"; 
        btnTogglePass.innerHTML = svgOjoAbierto; // Inyectamos el ojo normal
    }
});

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