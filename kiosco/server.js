const express = require("express");
const path = require("path");

const loginRoutes = require("./Login");
const productosRoutes = require("./Productos");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "Programas")));

app.use(
    "/estilos",
    express.static(path.join(__dirname, "Programas", "estilos"))
);

app.use(loginRoutes);
app.use(productosRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Programas", "Kios_login.html"));
});

app.get("/ventas", (req, res) => {
    res.sendFile(path.join(__dirname, "Programas", "ventaspag2.html"));
});

app.get("/abm", (req, res) => {
    res.sendFile(path.join(__dirname, "Programas", "abm_productos.html"));
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
