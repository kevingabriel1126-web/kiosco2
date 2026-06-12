const express = require("express");
const db = require("./BaseDatos");

const router = express.Router();

router.get("/productos", (req, res) => {
    db.query("SELECT * FROM productos ORDER BY id", (err, results) => {
        if (err) return res.status(500).json({ error: "Error al obtener productos" });
        res.json(results);
    });
});


router.get("/productos/:id", (req, res) => {
    db.query("SELECT * FROM productos WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: "Error al obtener producto" });
        if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(results[0]);
    });
});


router.post("/productos", (req, res) => {
    const { nombre, precio, imagen, stock } = req.body;

    if (!nombre || precio === undefined || !imagen || stock === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios (nombre, precio, imagen, stock)" });
    }
    if (isNaN(precio) || precio < 0) {
        return res.status(400).json({ error: "El precio debe ser un número positivo" });
    }
    if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ error: "El stock debe ser un número positivo" });
    }

    db.query(
        "INSERT INTO productos (nombre, precio, imagen, stock) VALUES (?, ?, ?, ?)",
        [nombre, precio, imagen, stock],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Error al crear producto" });
            res.status(201).json({ mensaje: "Producto creado", id: result.insertId });
        }
    );
});

router.put("/productos/:id", (req, res) => {
    const { nombre, precio, imagen, stock } = req.body;
    const { id } = req.params;

    if (!nombre || precio === undefined || !imagen || stock === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    db.query(
        "UPDATE productos SET nombre = ?, precio = ?, imagen = ?, stock = ? WHERE id = ?",
        [nombre, precio, imagen, stock, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Error al actualizar producto" });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });
            res.json({ mensaje: "Producto actualizado" });
        }
    );
});

router.delete("/productos/:id", (req, res) => {
    db.query("DELETE FROM productos WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al eliminar producto" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });
        res.json({ mensaje: "Producto eliminado" });
    });
});

router.post("/vender", (req, res) => {
    const { id, cantidad } = req.body;

    if (!id || !cantidad || cantidad <= 0) {
        return res.status(400).json({ error: "Datos de venta inválidos" });
    }

    db.query("SELECT stock FROM productos WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).send("Error del servidor");
        if (results.length === 0) return res.status(404).send("Producto no encontrado");

        const stockActual = results[0].stock;
        if (stockActual < cantidad) {
            return res.status(400).send(`Stock insuficiente. Solo quedan ${stockActual} unidades.`);
        }

        db.query(
            "UPDATE productos SET stock = stock - ? WHERE id = ?",
            [cantidad, id],
            (err2) => {
                if (err2) return res.status(500).send("Error al actualizar stock");
                res.send("Venta registrada correctamente");
            }
        );
    });
});

module.exports = router;
