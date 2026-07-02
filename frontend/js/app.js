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
                    <button id="btn-minus-prod${p.id}" class="btn btn-minus">−</button>
                    <input type="tel" id="cantidad-prod${p.id}" class="product-quantity" step="1" value="1" readonly style="appearance:none;">
                    <button id="btn-plus-prod${p.id}" class="btn btn-plus">+</button>
                </div>
                <button id="btn-agregar-prod${p.id}" class="btn btn-primary">Agregar</button>
            </div>
        </article>
    `).join("");
    asignarEventosBotones(lista);
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


//////////////////////////////////////////////////////////////////////////////
// Logica del carrito
//////////////////////////////////////////////////////////////////////////////

let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

function asignarEventosBotones(listaRenderizada) {
    listaRenderizada.forEach(p => {
        const btnMinus = document.getElementById(`btn-minus-prod${p.id}`);
        const btnPlus = document.getElementById(`btn-plus-prod${p.id}`);
        const btnAgregar = document.getElementById(`btn-agregar-prod${p.id}`);
        const inputCantidad = document.getElementById(`cantidad-prod${p.id}`);

        // Para RESTAR (no menos de 1)
        if (btnMinus) {
            btnMinus.addEventListener("click", () => {
                let cantidadActual = parseInt(inputCantidad.value);
                if (cantidadActual > 1) {
                    inputCantidad.value = cantidadActual - 1;
                }
            });
        }

        // Para SUMAR (no más del stock disponible)
        if (btnPlus) {
            btnPlus.addEventListener("click", () => {
                let cantidadActual = parseInt(inputCantidad.value);
                
                // Busco en el carrito si ya hay unidades de este producto
                const productoEnCarrito = carrito.find(item => item.id === p.id);
                const cantidadYaGuardada = productoEnCarrito ? productoEnCarrito.cantidad : 0;

                // Se verifica que la suma de la cantidad actual y la del carrito no supere el stock
                if ((cantidadActual + cantidadYaGuardada) < p.stock) {
                    inputCantidad.value = cantidadActual + 1;
                } else {
                    alert(`Solo hay ${p.stock} unidades en stock (Tienes ${cantidadYaGuardada} en tu carrito).`);
                }
            });
        }

        // Evento para AGREGAR AL CARRITO
        if (btnAgregar) {
            btnAgregar.addEventListener("click", () => {
                let cantidadElegida = parseInt(inputCantidad.value);
                
                // Pasamos el producto y la cantidad a la función principal
                agregarAlCarrito(p, cantidadElegida); 
                
                // Reiniciamos el input a 1 después de agregar (si hay stock)
                const productoEnCarrito = carrito.find(item => item.id === p.id);
                const totalFuturo = productoEnCarrito ? productoEnCarrito.cantidad : 0;
                
                if (totalFuturo < p.stock) {
                    inputCantidad.value = 1;
                } else {
                    inputCantidad.value = 0; // Si agotó el stock, dejamos el input en 0 
                }
            });
        }
    });
}

function agregarAlCarrito(producto, cantidadAñadida) {
    // Buscamos si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);
    const cantidadActualEnCarrito = productoExistente ? productoExistente.cantidad : 0;

    // No se agrega nada al carrito si supera el stock, se muestra la alerta
    if (cantidadActualEnCarrito + cantidadAñadida > producto.stock) {
        const disponibles = producto.stock - cantidadActualEnCarrito;
        alert(`No puedes agregar esa cantidad. Solo quedan ${disponibles} unidades disponibles para agregar.`);
        return; 
    }

    // Se agrega o actualiza el producto en el carrito
    if (productoExistente) {
        productoExistente.cantidad += cantidadAñadida;
    } else {
        carrito.push({ ...producto, cantidad: cantidadAñadida });
    }

    // Guardo el carrito actualizado en sessionStorage
    sessionStorage.setItem("carrito", JSON.stringify(carrito));

    console.log(`¡Agregado! Carrito actual:`, carrito);
    alert(`Agregaste ${cantidadAñadida} unidad(es) al carrito exitosamente.`);
}

//////////////////////////////////////////////////////////////////////////////
// Pantalla de carrito
//////////////////////////////////////////////////////////////////////////////

// Seleccionamos el tbody de la tabla del carrito
const tbodyCarrito = document.querySelector(".cart-table tbody");

// Traemos el carrito de sessionStorage 
// let carrito = JSON.parse(sessionStorage.getItem("carrito")) || []; 

// Renderiza el carrito en la tabla
function renderCarrito() {
    // Si no esta en la página del carrito, no hace nada
    if (!tbodyCarrito) return; 

    // Si el carrito está vacío, mostramos un mensaje
    if (carrito.length === 0) {
        tbodyCarrito.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem;">
                    ¡Tu carrito está vacío! Revisa nuestros productos!
                </td>
            </tr>`;
        return;
    }

    // Dibujamos las filas de la tabla 
    tbodyCarrito.innerHTML = carrito.map(item => `
        <tr class="cart-item">
            <td class="td-product">
                <div class="cart-product-info">
                    <img src="../assets/img/${item.image}" alt="${item.name}" width="50">
                    <p>${item.name}</p>
                </div>
            </td>

            <td class="td-quantity">
                <div class="quantity-container">
                    <button id="btn-minus-cart${item.id}" class="btn btn-minus">−</button>
                    <input 
                        type="tel" 
                        id="cantidad-cart${item.id}" 
                        class="product-quantity" 
                        step="1" 
                        value="${item.cantidad}" 
                        readonly 
                        style="appearance:none; width: 40px; text-align: center;"
                    >
                    <button id="btn-plus-cart${item.id}" class="btn btn-plus">+</button>
                </div>
            </td>

            <td class="td-price">
                <div class="price-container">$${item.price * item.cantidad}</div>
            </td>

            <td>
                <button id="btn-eliminar-${item.id}" class="btn btn-primary td-delete">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join("");

    // Asigno los eventos a los botones
    asignarEventosCarrito();
}

// Botones del carrito
function asignarEventosCarrito() {
    carrito.forEach(item => {
        const btnMinus = document.getElementById(`btn-minus-cart${item.id}`);
        const btnPlus = document.getElementById(`btn-plus-cart${item.id}`);
        const btnEliminar = document.getElementById(`btn-eliminar-${item.id}`);

        // RESTAR 
        if (btnMinus) {
            btnMinus.addEventListener("click", () => {
                if (item.cantidad > 1) {
                    item.cantidad -= 1;
                    actualizarCarritoYRenderizar();
                }
            });
        }

        // SUMAR (validando el stock disponible)
        if (btnPlus) {
            btnPlus.addEventListener("click", () => {
                if (item.cantidad < item.stock) {
                    item.cantidad += 1;
                    actualizarCarritoYRenderizar();
                } else {
                    alert(`No puedes agregar más. El stock máximo es ${item.stock}.`);
                }
            });
        }

        // ELIMINAR (se elimina el producto del carrito)
        if (btnEliminar) {
            btnEliminar.addEventListener("click", () => {
                // Se filtra el carrito para eliminar el producto con el id correspondiente
                carrito = carrito.filter(producto => producto.id !== item.id);
                actualizarCarritoYRenderizar();
            });
        }
    });
}

// Actualiza el carrito en el sessionStorage y vuelve a renderizar la tabla
function actualizarCarritoYRenderizar() {
    // Guardamos los cambios en el Storage
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    // Volvemos a dibujar la tabla para que se actualicen los números en pantalla
    renderCarrito();
}

// Ejecutamos la función render al cargar la página del carrito
renderCarrito();