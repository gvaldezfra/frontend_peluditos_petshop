//Productos locales por si falla la API

const productos_locales = [
    {
        id: 1,
        name: "Collar rojo",
        price: 3000,
        type: "accessory",
        pet: "dog",
        image: "collar.jpg",
        stock: 10
    },
    {
        id: 2,
        name: "Correa reforzada",
        price: 4500,
        type: "accessory",
        pet: "dog",
        image: "correa.jpg",
        stock: 8
    },
    {
        id: 3,
        name: "Arnés ajustable",
        price: 6000,
        type: "accessory",
        pet: "dog",
        image: "arnes.jpg",
        stock: 5
    },
    {
        id: 4,
        name: "Plato de acero",
        price: 2500,
        type: "accessory",
        pet: "dog",
        image: "plato.jpg",
        stock: 12
    },
    {
        id: 5,
        name: "Juguete mordedor",
        price: 2000,
        type: "accessory",
        pet: "dog",
        image: "mordedor.jpg",
        stock: 20
    },
    {
        id: 6,
        name: "Pelota resistente",
        price: 1800,
        type: "accessory",
        pet: "dog",
        image: "pelota.jpg",
        stock: 15
    },
    {
        id: 7,
        name: "Rascador para gatos",
        price: 7000,
        type: "accessory",
        pet: "cat",
        image: "rascador.jpg",
        stock: 4
    },
    {
        id: 8,
        name: "Collar con cascabel",
        price: 2200,
        type: "accessory",
        pet: "cat",
        image: "collar-gato.jpg",
        stock: 9
    },
    {
        id: 9,
        name: "Transportadora",
        price: 12000,
        type: "accessory",
        pet: "both",
        image: "transportadora.jpg",
        stock: 3
    },
    {
        id: 10,
        name: "Cama acolchada",
        price: 15000,
        type: "accessory",
        pet: "both",
        image: "cama.jpg",
        stock: 6
    },
    {
        id: 101,
        name: "Balanceado Premium Perro",
        price: 8500,
        type: "food",
        pet: "dog",
        image: "balanceado-perro.jpg",
        stock: 10
    },
    {
        id: 102,
        name: "Alimento Seco Gato Adulto",
        price: 7800,
        type: "food",
        pet: "cat",
        image: "balanceado-gato.jpg",
        stock: 8
    },
    {
        id: 103,
        name: "Lata Carne para Perro",
        price: 2500,
        type: "food",
        pet: "dog",
        image: "lata-perro.jpg",
        stock: 20
    },
    {
        id: 104,
        name: "Lata Atún para Gato",
        price: 2300,
        type: "food",
        pet: "cat",
        image: "lata-gato.jpg",
        stock: 15
    },
    {
        id: 105,
        name: "Snack Huesitos",
        price: 1800,
        type: "food",
        pet: "dog",
        image: "snack-huesos.jpg",
        stock: 25
    },
    {
        id: 106,
        name: "Snack Dental",
        price: 2000,
        type: "food",
        pet: "dog",
        image: "snack-dental.jpg",
        stock: 18
    },
    {
        id: 107,
        name: "Galletitas para Perro",
        price: 1500,
        type: "food",
        pet: "dog",
        image: "galletitas.jpg",
        stock: 30
    },
    {
        id: 108,
        name: "Sobres Húmedos Gato",
        price: 1200,
        type: "food",
        pet: "cat",
        image: "sobres-gato.jpg",
        stock: 22
    },
    {
        id: 109,
        name: "Alimento Cachorro",
        price: 9000,
        type: "food",
        pet: "dog",
        image: "cachorro.jpg",
        stock: 6
    },
    {
        id: 110,
        name: "Alimento Light Gato",
        price: 8200,
        type: "food",
        pet: "cat",
        image: "light-gato.jpg",
        stock: 7
    }
];

//////////////////////////////////////////////////////////////////////////////
// Funciones para obtener productos desde la API
//////////////////////////////////////////////////////////////////////////////

const url = "http://localhost:3000/api/products"; 

async function obtenerProductos() {
    try {
        let respuesta = await fetch(url); 

        let data = await respuesta.json();

        console.log(data); 

        productos = data.payload; 

        renderProductos(productos);



    } catch (error) {
        console.error(error);
        renderProductos(productos_locales);
    }
}


//////////////////////////////////////////////////////////////////////////////
// Pantalla inicio
//////////////////////////////////////////////////////////////////////////////

// Elementos del DOM
const overlay = document.getElementById("overlay-bienvenida");
const inputNombre = document.getElementById("nombre");
const saludo = document.getElementById("saludo");

// Cuando carga la página
if (overlay && saludo) {
    window.addEventListener("load", () => {
        const nombreGuardado = sessionStorage.getItem("nombre");

        if (!nombreGuardado) {
            overlay.classList.remove("hidden");
        } else {
            overlay.classList.add("hidden");
            saludo.textContent = `Hola, ${nombreGuardado}!`;
        }
    });
}

// Guardar nombre (solo sessionStorage)
function guardarNombre() {
    if (!inputNombre || !overlay || !saludo) return;

    const nombre = inputNombre.value.trim();

    if (!nombre) {
        alert("Ingresá un nombre");
        return;
    }

    sessionStorage.setItem("nombre", nombre);

    // Oculto el overlay y mostrar saludo
    overlay.classList.add("hidden");
    saludo.textContent = `Hola, ${nombre}!`;
}

// Botón ver productos
const btnVerProductos = document.querySelector(".btn-ver-productos");

if (btnVerProductos) {
    btnVerProductos.addEventListener("click", () => {
        window.location.href = "productos.html";
    });
}

// Barra búsqueda
const inputBusqueda = document.getElementById("busqueda");
const btnBuscar = document.querySelector(".search-btn");

//////////////////////////////////////////////////////////////////////////////
// Pantalla productos
//////////////////////////////////////////////////////////////////////////////

const contenedorProductos = document.querySelector(".products-grid");

if (!contenedorProductos) {
    console.warn("No se encontró .products-grid");
} else {
    obtenerProductos();
}


// Renderiza los productos
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

            <div class="product-actions">
                <div class="quantity-container">
                    <button class="btn btn-minus">−</button>
                    <span class="product-quantity">1</span>
                    <button class="btn btn-plus">+</button>
                </div>
                <button class="btn btn-primary">Agregar</button>
            </div>
        </article>
    `).join("");
}

obtenerProductos();

//Filtrar productos por tipo/orden/mascota

const estadoFiltros = {
    tipo: null,
    orden: null,
    mascota: []
};

// Seleccionamos los elementos del DOM para los filtros
const btnAlimentos = document.getElementById("btn-alimentos");
const btnAccesorios = document.getElementById("btn-accesorios");
const btnTodos = document.getElementById("btn-todos");
const formFiltros = document.querySelector(".filters-form");
const btnBorrarFiltros = document.getElementById("btn-borrar-filtros");
const btnAplicarFiltros = document.getElementById("btn-aplicar-filtros");

// Escuchamos los eventos de los botones de tipo de producto
addEventListener("click", (e) => {
    if (e.target === btnAlimentos) {
        estadoFiltros.tipo = "comida";
        ejecutarFiltros(); 
    } else if (e.target === btnAccesorios) {
        estadoFiltros.tipo = "accesorio";
        ejecutarFiltros(); 
    } else if (e.target === btnTodos) {
        estadoFiltros.tipo = null;
        ejecutarFiltros(); 
    }
});

// Escuchamos el evento de envío del formulario de filtros
if (formFiltros) {
    formFiltros.addEventListener("submit", (e) => {
        e.preventDefault();

        // Ocultamos el overlay de filtros
        const overlayFiltros = document.getElementById("filters-overlay");
        if (overlayFiltros) {
            overlayFiltros.classList.add("hidden");
        }
        
        const formData = new FormData(formFiltros);

        estadoFiltros.orden = formData.get("orden");
        // Usamos getAll para capturar todos los checkboxes seleccionados
        estadoFiltros.mascota = formData.getAll("mascota"); 
        
        ejecutarFiltros();
    });
}

function ejecutarFiltros() {
    let productosFiltrados = [...productos];

    // Filtrar por tipo
    if (estadoFiltros.tipo) {
        productosFiltrados = productosFiltrados.filter(p => p.type === estadoFiltros.tipo);
    }
    
    // Filtrar por mascota
    if (estadoFiltros.mascota && estadoFiltros.mascota.length > 0) {
        // Usamos .includes() porque ahora estadoFiltros.mascota es un Array
        productosFiltrados = productosFiltrados.filter(p => estadoFiltros.mascota.includes(p.pet));
    }
    
    // Ordenar productos
    if (estadoFiltros.orden === "az") {
        productosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
    } else if (estadoFiltros.orden === "za") {
        productosFiltrados.sort((a, b) => b.name.localeCompare(a.name));
    } else if (estadoFiltros.orden === "precio-mayor") {
        productosFiltrados.sort((a, b) => b.price - a.price);
    } else if (estadoFiltros.orden === "precio-menor") {
        productosFiltrados.sort((a, b) => a.price - b.price);
    }
    
    renderProductos(productosFiltrados);
}

function abrirFiltros() {
    const btnAbrirFiltros = document.getElementById("btn-abrir-filtros");
    const overlayFiltros = document.getElementById("filters-overlay");
    if (!btnAbrirFiltros || !overlayFiltros) {
        console.warn("No se encontró btn-abrir-filtros o filters-overlay");
        return;
    }
    btnAbrirFiltros.addEventListener("click", () => {
        overlayFiltros.classList.remove("hidden");
    });
}
abrirFiltros();
