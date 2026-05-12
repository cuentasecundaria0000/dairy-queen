/* ==========================================
   ESTADO Y PERSISTENCIA
   ========================================== */

let carrito =
    JSON.parse(localStorage.getItem('dq_carrito')) || [];

let ultimaCompra =
    JSON.parse(localStorage.getItem('dq_ultima_compra')) || [];

/* ==========================================
   INICIAR
   ========================================== */

document.addEventListener(
    'DOMContentLoaded',
    actualizarInterfaz
);

/* ==========================================
   GUARDAR
   ========================================== */

function guardarCarrito() {

    localStorage.setItem(
        'dq_carrito',
        JSON.stringify(carrito)
    );
}

/* ==========================================
   TOGGLE CARRITO
   ========================================== */

function toggleCart() {

    const sideCart =
        document.getElementById("side-cart");

    if(sideCart){

        sideCart.classList.toggle("active");

    }
}

/* ==========================================
   AGREGAR PRODUCTOS
   ========================================== */

function agregarAlCarrito(nombre, precio) {

    const existe =
        carrito.find(
            item => item.nombre === nombre
        );

    if(existe){

        existe.cantidad++;

    } else {

        carrito.push({
            nombre,
            precio,
            cantidad:1
        });

    }

    actualizarInterfaz();

    const sideCart =
        document.getElementById('side-cart');

    if(
        sideCart &&
        !sideCart.classList.contains('active')
    ){

        toggleCart();

    }
}

/* ==========================================
   QUITAR PRODUCTOS
   ========================================== */

function quitarProducto(nombre){

    const index =
        carrito.findIndex(
            item => item.nombre === nombre
        );

    if(index !== -1){

        if(carrito[index].cantidad > 1){

            carrito[index].cantidad--;

        } else {

            carrito.splice(index,1);

        }
    }

    actualizarInterfaz();
}

/* ==========================================
   ACTUALIZAR INTERFAZ
   ========================================== */

function actualizarInterfaz(){

    guardarCarrito();

    const listaItems =
        document.getElementById(
            'cart-items-list'
        );

    const totalElemento =
        document.getElementById(
            'cart-total'
        );

    const contadorTab =
        document.getElementById(
            'cart-count-tab'
        );

    if(!listaItems) return;

    listaItems.innerHTML = '';

    let total = 0;
    let totalItems = 0;

    /* ===== CARRITO VACÍO ===== */

    if(carrito.length === 0){

        listaItems.innerHTML = `

            <div class="empty-state">

                🍦

                <p>
                    Tu carrito está esperando un Blizzard
                </p>

            </div>

        `;

    }

    /* ===== PRODUCTOS ===== */

    else{

        carrito.forEach(item => {

            const subtotal =
                item.precio * item.cantidad;

            total += subtotal;

            totalItems += item.cantidad;

            const div =
                document.createElement('div');

            div.className =
                'cart-item-row';

            div.innerHTML = `

                <div class="item-info">

                    <span class="item-name">

                        ${item.nombre}
                        (x${item.cantidad})

                    </span>

                    <span class="item-subtotal-price">

                        $${subtotal.toFixed(2)}

                    </span>

                </div>

                <div class="item-controls-dq">

                    <button
                        onclick="quitarProducto('${item.nombre}')">

                        −

                    </button>

                    <button
                        onclick="agregarAlCarrito('${item.nombre}', ${item.precio})">

                        +

                    </button>

                </div>

            `;

            listaItems.appendChild(div);

        });
    }

    if(totalElemento){

        totalElemento.innerText =
            `$${total.toFixed(2)}`;

    }

    if(contadorTab){

        contadorTab.innerText =
            totalItems;

    }
}

/* ==========================================
   MODAL DQ
   ========================================== */

function mostrarDqModal(config){

    const overlay =
        document.getElementById(
            'modal-container'
        );

    const title =
        document.getElementById(
            'modal-title'
        );

    const text =
        document.getElementById(
            'modal-text'
        );

    const icon =
        document.getElementById(
            'modal-icon'
        );

    const btnPrimary =
        document.getElementById(
            'modal-btn-primary'
        );

    const btnSecondary =
        document.getElementById(
            'modal-btn-secondary'
        );

    if(!overlay) return;

    title.innerHTML =
        config.titulo || "Aviso";

    text.innerHTML =
        config.mensaje || "";

    icon.innerHTML =
        config.icono || "🍦";

    btnPrimary.innerText =
        config.textoBoton || "Aceptar";

    btnSecondary.style.display =
        config.mostrarCancelar
            ? "block"
            : "none";

    btnPrimary.onclick = null;

    btnPrimary.onclick = function(){

        if(config.alConfirmar){

            config.alConfirmar();

        }

        cerrarDqModal();
    };

    overlay.classList.add('active');
}

/* ==========================================
   CERRAR MODAL
   ========================================== */

function cerrarDqModal(){

    const overlay =
        document.getElementById(
            'modal-container'
        );

    if(overlay){

        overlay.classList.remove(
            'active'
        );

    }
}

/* ==========================================
   LIMPIAR CARRITO
   ========================================== */

function limpiarCarrito(){

    if(carrito.length === 0){

        mostrarDqModal({

            titulo:"Carrito vacío",

            mensaje:
                "No hay productos para eliminar.",

            icono:"⚠️",

            textoBoton:"Entendido",

            mostrarCancelar:false

        });

        return;
    }

    mostrarDqModal({

        titulo:"¿Vaciar carrito?",

        mensaje:
            "Todos los productos serán eliminados.",

        icono:"🗑️",

        textoBoton:"Sí, vaciar",

        mostrarCancelar:true,

        alConfirmar: () => {

            carrito = [];

            actualizarInterfaz();

        }

    });
}

/* ==========================================
   CONFIRMAR PEDIDO
   ========================================== */

function confirmarPedido(){

    if(carrito.length === 0){

        mostrarDqModal({

            titulo:"Carrito vacío",

            mensaje:
                "Agrega productos antes de ordenar.",

            icono:"⚠️",

            textoBoton:"Entendido",

            mostrarCancelar:false

        });

        return;
    }

    mostrarDqModal({

        titulo:"Confirmar pedido",

        mensaje:
            "¿Deseas enviar tu pedido?",

        icono:"🍰",

        textoBoton:"Sí, ordenar",

        mostrarCancelar:true,

        alConfirmar: () => {

            finalizarPedido();

        }

    });
}

/* ==========================================
   FINALIZAR PEDIDO
   ========================================== */

function finalizarPedido(){

    /* ===== GUARDAR COMPRA ===== */

    ultimaCompra = [...carrito];

    localStorage.setItem(
        'dq_ultima_compra',
        JSON.stringify(ultimaCompra)
    );

    /* ===== LIMPIAR ===== */

    carrito = [];

    actualizarInterfaz();

    /* ===== MENSAJE ===== */

    mostrarDqModal({

        titulo:"Pedido enviado",

        mensaje:`

            ✅ Tu pedido fue enviado correctamente.

            <br><br>

            Puedes revisar tu compra anterior
            cuando quieras.

            <br><br>

            <button
                class="btn-confirmar"
                onclick="verCompraAnterior()">

                Ver compra anterior

            </button>

        `,

        icono:"✅",

        textoBoton:"Aceptar",

        mostrarCancelar:false

    });
}

/* ==========================================
   VER COMPRA ANTERIOR
   ========================================== */

function verCompraAnterior(){

    if(ultimaCompra.length === 0){

        mostrarDqModal({

            titulo:"Sin compras",

            mensaje:
                "Aún no tienes compras anteriores.",

            icono:"📦",

            textoBoton:"Entendido",

            mostrarCancelar:false

        });

        return;
    }

    let contenido = "";

    let total = 0;

    ultimaCompra.forEach(item => {

        const subtotal =
            item.precio * item.cantidad;

        total += subtotal;

        contenido += `

            <p>

                🍦 ${item.nombre}
                x${item.cantidad}

                - $${subtotal.toFixed(2)}

            </p>

        `;
    });

    contenido += `

        <br>

        <strong>
            Total: $${total.toFixed(2)}
        </strong>

    `;

    mostrarDqModal({

        titulo:"Compra anterior",

        mensaje:contenido,

        icono:"🧾",

        textoBoton:"Cerrar",

        mostrarCancelar:false

    });
}
/* =========================================
   CONFIRMAR PEDIDO
========================================= */

function confirmarPedido() {

    if (carrito.length === 0) {

        mostrarDqModal({
            titulo: "Carrito vacío",
            mensaje: "Agrega productos antes de confirmar tu pedido.",
            icono: "⚠️",
            textoBoton: "Entendido",
            mostrarCancelar: false
        });

        return;
    }

    mostrarDqModal({
        titulo: "Confirmar pedido",
        mensaje: "¿Deseas enviar tu pedido?",
        icono: "🍦",
        textoBoton: "Sí, confirmar",
        mostrarCancelar: true,

        alConfirmar: () => {

            // Guardar compra anterior
            localStorage.setItem(
                "dq_ultima_compra",
                JSON.stringify(carrito)
            );

            // Mensaje de éxito
            mostrarDqModal({
                titulo: "Pedido enviado",
                mensaje: "Tu pedido fue enviado correctamente 🎉",
                icono: "✅",
                textoBoton: "Aceptar",
                mostrarCancelar: false
            });

            // Vaciar carrito
            carrito = [];

            actualizarInterfaz();
        }
    });
}

/* =========================================
   LIMPIAR CARRITO
========================================= */

function limpiarCarrito() {

    if (carrito.length === 0) {

        mostrarDqModal({
            titulo: "Carrito vacío",
            mensaje: "No hay productos para eliminar.",
            icono: "⚠️",
            textoBoton: "Aceptar",
            mostrarCancelar: false
        });

        return;
    }

    mostrarDqModal({
        titulo: "Vaciar carrito",
        mensaje: "¿Seguro que deseas eliminar todos los productos?",
        icono: "🗑️",
        textoBoton: "Sí, limpiar",
        mostrarCancelar: true,

        alConfirmar: () => {

            carrito = [];

            actualizarInterfaz();

            mostrarDqModal({
                titulo: "Carrito limpio",
                mensaje: "Todos los productos fueron eliminados.",
                icono: "✅",
                textoBoton: "Aceptar",
                mostrarCancelar: false
            });
        }
    });
}

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