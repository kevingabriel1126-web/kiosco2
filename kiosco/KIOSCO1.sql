CREATE SCHEMA kiosco;
USE kiosco;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);



CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    imagen TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0 
);

INSERT INTO usuarios (usauario,contrasena) values ('admin','1234'),('susana','11233'),('catalina','786787');

