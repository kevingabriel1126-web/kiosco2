async function login() {
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario,
            contrasena
        })
    });

    const texto = await res.text();

    if (res.ok) {
        window.location.href = "/ventas";
    } else {
        document.getElementById("mensaje").innerText = texto;
    }
}

async function registrar() {
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    const res = await fetch("/registrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario,
            contrasena
        })
    });

    document.getElementById("mensaje").innerText =
        await res.text();
}