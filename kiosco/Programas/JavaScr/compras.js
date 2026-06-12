document.addEventListener("DOMContentLoaded", cargarProductos);

    // 1. CARGAR PRODUCTOS DESDE MYSQL
    function cargarProductos() {
        fetch("/productos")
            .then(res => res.json())
            .then(productos => {
                const contenedor = document.getElementById("catalogo-productos");
                contenedor.innerHTML = ""; 

                productos.forEach(prod => {
                    // Si no hay stock, el producto se muestra deshabilitado o avisa "Sin Stock"
                    const tieneStock = prod.stock > 0;
                    
                    const estructuraProducto = `
                        <div class="caja" data-id="${prod.id}" data-stock="${prod.stock}">
                            <img src="${prod.imagen}" alt="${prod.nombre}">
                            <h3>${prod.nombre}</h3>
                            <p class="precio">$${prod.precio}</p>
                            <p class="stock-texto" style="color: ${tieneStock ? '#666' : 'red'}; font-weight: bold;">
                                ${tieneStock ? `Stock disponible: ${prod.stock}` : '¡AGOTADO!'}
                            </p>
                            
                            <div class="contador">
                                <button onclick="restar(this)" ${!tieneStock ? 'disabled' : ''}>-</button>
                                <span class="cantidad">0</span>
                                <button onclick="sumar(this)" ${!tieneStock ? 'disabled' : ''}>+</button>
                            </div>
                            
                            <button class="btn-agregar" onclick="agregarCarrito(this)" ${!tieneStock ? 'disabled' : ''}>
                                ${tieneStock ? 'Agregar' : 'Sin Stock'}
                            </button>
                        </div>
                    `;
                    contenedor.innerHTML += estructuraProducto;
                });
            })
            .catch(err => console.error("Error cargando productos:", err));
    }

    // 2. FUNCIÓN SUMAR (Controlando el límite de stock de la caja)
    function sumar(boton) {
        const caja = boton.closest(".caja");
        const stockMaximo = parseInt(caja.getAttribute("data-stock"));
        const cantidadSpan = caja.querySelector(".cantidad");
        
        let cant = parseInt(cantidadSpan.innerText);
        
        if (cant < stockMaximo) {
            cantidadSpan.innerText = cant + 1;
        } else {
            alert(`No podés agregar más unidades. El stock máximo es de ${stockMaximo}.`);
        }
    }

    // 3. FUNCIÓN RESTAR
    function restar(boton) {
        const cantidadSpan = boton.parentElement.querySelector(".cantidad");
        let cant = parseInt(cantidadSpan.innerText);
        if (cant > 0) cantidadSpan.innerText = cant - 1;
    }

    // 4. FUNCIÓN AGREGAR AL CARRITO (Conexión con el servidor para descontar stock)
    function agregarCarrito(boton) {
        const caja = boton.closest(".caja");
        const idProducto = caja.getAttribute("data-id");
        const nombre = caja.querySelector("h3").innerText;
        const cantidad = parseInt(caja.querySelector(".cantidad").innerText);
        
        if (cantidad === 0) return alert("Selecciona al menos 1 unidad");
        
        // Enviamos la venta al backend mediante POST
        fetch("/vender", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: idProducto, cantidad: cantidad })
        })
        .then(res => {
            if (!res.ok) return res.text().then(text => { throw new Error(text) });
            return res.text();
        })
        .then(data => {
            alert(`¡Venta exitosa!\nAgregado: ${cantidad} x ${nombre}`);
            // Volvemos a pedir los productos para actualizar los números de stock en pantalla
            cargarProductos(); 
        })
        .catch(err => {
            alert("Error: " + err.message);
        });
    }