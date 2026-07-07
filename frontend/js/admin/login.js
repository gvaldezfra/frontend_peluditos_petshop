const url = "http://localhost:3000/login";
const adminForm = document.getElementById("login-form");
const estadoMensaje = document.getElementById("estado-mensaje");

function mostrarMensajes(tipo, mensaje){
    estadoMensaje.innerHTML = `
        <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}

adminForm.addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = Object.fromEntries(formData.entries());

    const errores = [];

    if (!data.username){
        console.log(data.username);
        errores.push("Ingrese un usuario válido");
    }
    if (!data.password){
        errores.push("Ingrese una contraseña");
    }

    if (errores.length > 0){
        mostrarMensajes("error", errores.join("\n"));
        return;
    }

    console.log(data);

    try {
        const respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok){
            mostrarMensajes("error", resultado.message);
            return;
        }

        window.location.href = "/views/admin/get.html";
        mostrarMensajes("exito", resultado.message);
    } catch (error) {
        mostrarMensajes("error", "Error al procesar la solicitud");
    }
})