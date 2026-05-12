/* ==========================================
   CARRITO DE COMPRAS
   ========================================== */
let carrito = [];
const precios = { Oreo: 55, Brownie: 69, Reese: 65, Cheesecake: 65 };
const idsCards = Object.keys(precios);

function toggleCart() {
    document.getElementById('side-cart').classList.toggle('active');
}

function agregarCarrito(id, precio) {
    const item = carrito.find(p => p.id === id);
    item ? item.cantidad++ : carrito.push({ id, precio, cantidad: 1 });
    actualizarVista();
}

function modificar(id, delta) {
    const item = carrito.find(p => p.id === id);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) carrito = carrito.filter(p => p.id !== id);
    }
    actualizarVista();
}

function limpiarTodo() {
    if(confirm("¿Estás seguro de limpiar todo tu pedido?")) {
        carrito = [];
        actualizarVista();
    }
}

function actualizarVista() {
    const lista = document.getElementById('cart-items-list');
    const totalElem = document.getElementById('cart-total');
    const badgeTab = document.getElementById('cart-count-tab');
    
    let total = 0, count = 0;
    lista.innerHTML = carrito.length === 0 
        ? '<p class="empty-msg" style="text-align:center; color:#999; margin-top:50px;">Tu carrito está vacío</p>' 
        : '';

    carrito.forEach(p => {
        total += p.precio * p.cantidad;
        count += p.cantidad;
        lista.innerHTML += `
            <div class="item-row">
                <span>${p.id} (x${p.cantidad})</span>
                <strong>$${(p.precio * p.cantidad).toFixed(2)}</strong>
            </div>`;
    });

    totalElem.innerText = `$${total.toFixed(2)}`;
    if(badgeTab) badgeTab.innerText = count;

    // Actualizar botones dinámicos en las Cards
    idsCards.forEach(id => {
        const contenedor = document.getElementById(`controls-${id}`);
        if (!contenedor) return;
        const item = carrito.find(p => p.id === id);

        contenedor.innerHTML = (item && item.cantidad > 0) 
            ? `<div class="qty-pill">
                <button onclick="modificar('${id}', -1)">-</button>
                <span>${item.cantidad}</span>
                <button onclick="modificar('${id}', 1)">+</button>
               </div>`
            : `<button class="buy-btn" onclick="agregarCarrito('${id}', ${precios[id]})">Agregar</button>`;
    });
}

function pagar() {
    if (carrito.length === 0) return alert("Agrega algo antes de pagar.");
    const sucursal = document.getElementById('sucursal').value;
    alert(`¡Pedido recibido!\nRecoger en: ${sucursal}\nTotal: ${document.getElementById('cart-total').innerText}`);
    carrito = [];
    actualizarVista();
    toggleCart();
}

/* ==========================================
   BUSCADOR DQ (OPTIMIZADO)
   ========================================== */
const productosDQ = [
    { nombre: "Blizzards", link: "card1.html" },
    { nombre: "Pasteles DQ", link: "card2.html" },
    { nombre: "Helados DQ", link: "card3.html" },
    { nombre: "Bebidas DQ", link: "card4.html" },
    { nombre: "Promociones", link: "promociones.html" },
    { nombre: "Sucursales", link: "sucursales.html" },
    { nombre: "Preguntas frecuentes", link: "preguntas.html" }
];

window.addEventListener("load", () => {
    const input = document.getElementById("searchInput");
    const suggestions = document.getElementById("suggestions");
    const button = document.getElementById("searchBtn");

    if(!input || !suggestions || !button) return;

    const mostrar = (lista) => {
        suggestions.innerHTML = "";
        if(lista.length === 0) {
            suggestions.innerHTML = `<div class="suggestion-item">❌ No disponible</div>`;
        } else {
            lista.forEach(item => {
                const div = document.createElement("div");
                div.className = "suggestion-item";
                div.innerHTML = `🔍 ${item.nombre}`;
                div.onclick = () => window.location.href = item.link;
                suggestions.appendChild(div);
            });
        }
        suggestions.style.display = "block";
    };

    const buscar = () => {
        const valor = input.value.toLowerCase().trim();
        const encontrado = productosDQ.find(p => p.nombre.toLowerCase().includes(valor));
        if(encontrado) window.location.href = encontrado.link;
    };

    input.addEventListener("focus", () => mostrar(productosDQ));
    
    input.addEventListener("input", () => {
        const valor = input.value.toLowerCase().trim();
        const filtrados = productosDQ.filter(p => p.nombre.toLowerCase().includes(valor));
        mostrar(filtrados);
    });

    input.addEventListener("keypress", (e) => { if(e.key === "Enter") buscar(); });
    button.addEventListener("click", buscar);

    document.addEventListener("click", (e) => {
        if(!e.target.closest(".search-container")) suggestions.style.display = "none";
    });
});
/// =========================
// CARRITO GLOBAL DQ
// =========================

let carrito =
    JSON.parse(localStorage.getItem("dq_carrito")) || [];

/* =========================
   GUARDAR
========================= */

function guardarCarrito(){

    localStorage.setItem(
        "dq_carrito",
        JSON.stringify(carrito)
    );
}

/* =========================
   ABRIR / CERRAR
========================= */

function toggleCart(){

    const cart =
        document.getElementById("side-cart");

    if(cart){

        cart.classList.toggle("active");
    }

    actualizarCarrito();
}

/* =========================
   AGREGAR PRODUCTO
========================= */

function agregarAlCarrito(nombre, precio){

    const existe =
        carrito.find(
            item => item.nombre === nombre
        );

    if(existe){

        existe.cantidad++;

    }else{

        carrito.push({
            nombre,
            precio,
            cantidad: 1
        });
    }

    actualizarCarrito();
}

/* =========================
   MODIFICAR CANTIDAD
========================= */

function modificarCantidad(nombre, cambio){

    const item =
        carrito.find(
            p => p.nombre === nombre
        );

    if(item){

        item.cantidad += cambio;

        if(item.cantidad <= 0){

            carrito =
                carrito.filter(
                    p => p.nombre !== nombre
                );
        }
    }

    actualizarCarrito();
}

/* =========================
   ACTUALIZAR CARRITO
========================= */

function actualizarCarrito(){

    guardarCarrito();

    const lista =
        document.getElementById("cart-items-list");

    const totalElement =
        document.getElementById("cart-total");

    const contador =
        document.getElementById("cart-count-nav");

    if(!lista || !totalElement) return;

    lista.innerHTML = "";

    let total = 0;
    let cantidad = 0;

    if(carrito.length === 0){

        lista.innerHTML = `
            <p class="empty-msg">
                Tu carrito está vacío
            </p>
        `;
    }

    carrito.forEach(item => {

        total += item.precio * item.cantidad;

        cantidad += item.cantidad;

        lista.innerHTML += `

            <div class="cart-item-row">

                <div>

                    <strong>
                        ${item.nombre}
                    </strong>

                    <p>
                        x${item.cantidad}
                    </p>

                </div>

                <div>

                    <button onclick="
                        modificarCantidad(
                            '${item.nombre}', -1
                        )
                    ">−</button>

                    <button onclick="
                        modificarCantidad(
                            '${item.nombre}', 1
                        )
                    ">+</button>

                </div>

                <strong>
                    $${(
                        item.precio * item.cantidad
                    ).toFixed(2)}
                </strong>

            </div>
        `;
    });

    totalElement.innerText =
        "$" + total.toFixed(2);

    if(contador){

        contador.innerText = cantidad;
    }
}

/* =========================
   LIMPIAR
========================= */

function limpiarCarrito(){

    if(carrito.length === 0){

        alert("Tu carrito ya está vacío");

        return;
    }

    if(confirm(
        "¿Deseas vaciar el carrito?"
    )){

        carrito = [];

        actualizarCarrito();
    }
}

/* =========================
   CONFIRMAR PEDIDO
========================= */

function confirmarPedido(){

    if(carrito.length === 0){

        alert("Tu carrito está vacío");

        return;
    }

    const sucursal =
        document.getElementById("sucursal").value;

    localStorage.setItem(
        "ultima_compra",
        JSON.stringify(carrito)
    );

    alert(
        "🍦 Pedido confirmado\n\n" +
        "Sucursal: " + sucursal + "\n" +
        "Total: " +
        document.getElementById("cart-total").innerText
    );

    carrito = [];

    actualizarCarrito();

    toggleCart();
}

/* =========================
   VER COMPRA ANTERIOR
========================= */

function verCompraAnterior(){

    const anterior =
        JSON.parse(
            localStorage.getItem(
                "ultima_compra"
            )
        );

    if(!anterior){

        alert(
            "No hay compras anteriores"
        );

        return;
    }

    let texto =
        "🧾 Última compra\n\n";

    let total = 0;

    anterior.forEach(item => {

        texto +=
            `${item.nombre} x${item.cantidad}\n`;

        total +=
            item.precio * item.cantidad;
    });

    texto +=
        `\n💰 Total: $${total}`;

    alert(texto);
}

/* =========================
   INICIAR
========================= */

document.addEventListener(
    "DOMContentLoaded",
    actualizarCarrito
);
/* =========================================
   VER COMPRA ANTERIOR
========================================= */

function verCompraAnterior() {

    const compra =
        JSON.parse(localStorage.getItem("dq_ultima_compra"));

    if (!compra || compra.length === 0) {

        mostrarDqModal({
            titulo: "Sin compras",
            mensaje: "Todavía no tienes compras anteriores.",
            icono: "📄",
            textoBoton: "Aceptar",
            mostrarCancelar: false
        });

        return;
    }

    let resumen = "";

    compra.forEach(item => {

        resumen +=
            `${item.nombre} x${item.cantidad}\n`;

    });

    mostrarDqModal({
        titulo: "Compra anterior",
        mensaje: resumen,
        icono: "🧾",
        textoBoton: "Cerrar",
        mostrarCancelar: false
    });
}