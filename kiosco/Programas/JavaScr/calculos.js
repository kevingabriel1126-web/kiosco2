let carrito = [];

function sumar(boton) {
    let span = boton.parentElement.querySelector('.cantidad');
    let cantidad = parseInt(span.innerText);
    span.innerText = cantidad + 1;
}

function restar(boton) {
    let span = boton.parentElement.querySelector('.cantidad');
    let cantidad = parseInt(span.innerText);
    if (cantidad > 0) {
        span.innerText = cantidad - 1;
    }
}

function agregarCarrito(boton) {
    let caja = boton.closest('.caja');
    let nombre = caja.querySelector('h3').innerText;
    
    let precioTexto = caja.querySelector('.precio').innerText;
    let precio = parseFloat(precioTexto.replace('$', ''));
    
    let cantidadSpan = caja.querySelector('.cantidad');
    let cantidad = parseInt(cantidadSpan.innerText);

    if (cantidad === 0) {
        alert("Selecciona al menos 1 unidad para agregar al carrito.");
        return;
    }

    let itemExistente = carrito.find(item => item.nombre === nombre);
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, cantidad });
    }

    cantidadSpan.innerText = "0";
    
    actualizarPantallaCarrito();
}

function actualizarPantallaCarrito() {
    let lista = document.getElementById("lista-carrito");
    let spanTotal = document.getElementById("total");
    
    lista.innerHTML = ""; 
    let totalPrecio = 0;

    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        totalPrecio += subtotal;

        let li = document.createElement("li");
        li.innerHTML = `
            ${item.cantidad}x ${item.nombre} - $${subtotal} 
            <button onclick="eliminarItem(${index})" class="btn-eliminar">X</button>
        `;
        lista.appendChild(li);
    });

    spanTotal.innerText = totalPrecio;
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarPantallaCarrito();
}

function generarPDF() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. No hay nada para facturar.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Factura de Compra - Kiosco", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Producto", 20, 40);
    doc.text("Cantidad", 120, 40);
    doc.text("Subtotal", 160, 40);
    
    doc.line(20, 42, 190, 42); 

    let y = 50;
    let totalFinal = 0;

    carrito.forEach(item => {
        let subtotal = item.precio * item.cantidad;
        totalFinal += subtotal;

        doc.text(item.nombre, 20, y);
        doc.text(item.cantidad.toString(), 125, y);
        doc.text(`$${subtotal}`, 160, y);
        y += 10;
    });

    doc.line(20, y, 190, y);
    y += 10;
    
    doc.setFontSize(16);
    doc.text(`TOTAL A PAGAR: $${totalFinal}`, 120, y);

    doc.save("Factura_Kiosco.pdf");
}


