const mysql = require("mysql2");

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "1234",
    database: "kiosco",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Error de conexión a MySQL:", err.message);
    } else {
        console.log("¡Conectado a MySQL!");
        connection.release();
    }
});

module.exports = db;