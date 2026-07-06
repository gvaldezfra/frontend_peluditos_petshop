const url = "http://localhost:3000/api/products";
const productForm = document.getElementById("form-product");
const estadoMensaje = document.getElementById("estado-mensaje");

function validarDatos(data){
    const errores = [];

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

    return errores;
}

function mostrarMensajes(tipo, mensaje){
    estadoMensaje.innerHTML = `
        <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}

productForm.addEventListener("submit", async event => {
    event.preventDefault(); //!!!detenemos el envio por defecto

    const formData = new FormData(event.target);
    console.log(formData);

    const data = Object.fromEntries(formData.entries());
    console.log(data);

    data.price = Number(data.price);
    data.stock = Number(data.stock);

    const errores = validarDatos(data);

    if (errores.length > 0){
        mostrarMensajes("error", errores.join("\n"));
        return;
    }

    try {
        const respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        console.log(respuesta);
        const resultado = await respuesta.json();

        if (!respuesta.ok){
            mostrarMensajes("error", resultado.message);
            return;
        }

        mostrarMensajes("exito", resultado.message);
    } catch (error){
        mostrarMensajes("error", "Error al procesar la solicitud");
    }
})