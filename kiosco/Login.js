const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./BaseDatos");

const router = express.Router();

router.post("/registrar", async (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).send("Faltan datos");
    }

    try {
        const hash = await bcrypt.hash(contrasena, 10);

        db.query(
            "INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)",
            [usuario, hash],
            (err) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).send("Usuario ya existe");
                    }
                    return res.status(500).send("Error al registrar");
                }

                res.send("Usuario registrado correctamente");
            }
        );

    } catch (error) {
        res.status(500).send("Error del servidor");
    }
});

router.post("/login", (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).send("Faltan datos");
    }

    db.query(
        "SELECT * FROM usuarios WHERE usuario = ?",
        [usuario],
        async (err, results) => {

            if (err) {
                return res.status(500).send("Error del servidor");
            }

            if (results.length === 0) {
                return res.status(401).send("Usuario incorrecto");
            }

            const valido = await bcrypt.compare(
                contrasena,
                results[0].contrasena
            );

            if (!valido) {
                return res.status(401).send("Contraseña incorrecta");
            }

            res.status(200).send("Login correcto");
        }
    );
});

module.exports = router;