import { cerrarSesion, obtenerIdUser } from "../utils/store.js"

export const menuView = () => {
    let productosData = []
    let carrito = []

    // 1. Lógica para pintar los productos del menú
    const mostrarProductos = (productos) => {
        const root = document.getElementById("contenedor-productos")
        root.innerHTML = productos.map(p => `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="./src/assets/img/${p.img}" class="card-img-top" alt="${p.name}" style="height: 150px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title text-capitalize">${p.name}</h5>
                        <p class="badge bg-secondary">${p.category}</p>
                        <p class="fw-bold text-success">$${p.price.toLocaleString()}</p>
                        <button class="btn btn-success btn-sm btn-agregar" data-id="${p.id}">
                            Agregar al pedido
                        </button>
                    </div>
                </div>
            </div>
        `).join('')
    }

    // 2. Lógica para actualizar la vista del carrito
    const updateCarrito = () => {
        const lista = document.getElementById("resumen-lista")
        const total = document.getElementById("total-cuenta")
        const btn = document.getElementById("btn-confirmar")

        if (carrito.length > 0) {
            const itemsAgrupados = carrito.reduce((x, p) => {
                const encontrado = x.find(item => item.id === p.id)
                if (encontrado) {
                    encontrado.cantidad++
                } else {
                    x.push({ ...p, cantidad: 1 })
                }
                return x
            }, [])

            lista.innerHTML = itemsAgrupados.map(p => `
                <div class="d-flex justify-content-between align-items-center mb-2 bg-light p-2 rounded border-start border-success border-3">
                    <span class="small"><b>${p.cantidad}x</b> ${p.name}</span>
                    <div class="d-flex align-items-center">
                        <span class="fw-bold me-2 small">$${(p.price * p.cantidad).toLocaleString()}</span>
                        <button class="btn btn-sm btn-danger border-0 btn-quitar" data-id="${p.id}" title="Quitar uno">
                            &times;
                        </button>
                    </div>
                </div>
        `).join('')
            const suma = carrito.reduce((sum, p) => sum + p.price, 0)
            total.innerHTML = `$${suma.toLocaleString()}`
            btn.disabled = false
        } else {
            lista.innerHTML = `<p class="text-muted">No hay productos seleccionados.</p>`
            total.innerHTML = `$0`
            btn.disabled = true
        }
    }


    return {
        render: () => `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
            <div class="container">
                <a class="navbar-brand fw-bold">RestorApp</a>
                <a class="navbar-brand fw-bold" href="#/orders"> Mis ordenes </a>
                <button type="button" id="btn-cerrar-sesion" class="btn btn-danger">Cerrar sesion</button>
               
            </div>
        </nav>
        
            <div class="container mt-4">
                <div class="row">
                

                    <div class="col-md-8">
                        <h2 class="mb-3">Nuestro Menú</h2>
                        <div class="input-group mb-3">
                            <input type="text" id="buscador" class="form-control  " placeholder="Buscar plato...">
                        </div>
                        
                        <div class="d-flex gap-3 mt-2 mt-md-0 mb-3">
                            <button type="button" class="btn btn-outline-success btn-sm btn-filtro" data-cat="todas">Todas</button>
                            <button type="button" class="btn btn-outline-success btn-sm btn-filtro" data-cat="burgers">Hamburguesas</button>
                            <button type="button" class="btn btn-outline-success btn-sm btn-filtro" data-cat="pizza">Pizzas</button>
                            <button type="button" class="btn btn-outline-success btn-sm btn-filtro" data-cat="refresco">Bebidas</button>
                            <button type="button" class="btn btn-outline-success btn-sm btn-filtro" data-cat="dulces">Dulces</button>
                        </div>
                    

                        
            
                        <div class="row" id="contenedor-productos">
                        </div>
                        
                    </div>
                    
                    <div class="col-md-4">
                    
                        <div class="card p-3 border-dark sticky-top" style="top: 20px;">
                            <h4>Resumen del Pedido</h4>
                            <hr>
                            <div id="resumen-lista">
                                <p class="text-muted">No hay productos seleccionados.</p>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between fw-bold">
                                <span>Total:</span>
                                <span id="total-cuenta">$0</span>
                            </div>
                            <button id="btn-confirmar" class="btn btn-success w-100 mt-3" disabled>
                                Confirmar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>`,

        cargarRender: async () => {

            try {
                const res = await fetch('http://localhost:8080/products')
                productosData = await res.json()
                mostrarProductos(productosData)
            } catch (error) {
                console.error("error al cargar los productos ", error)
            }

            const buscador = document.getElementById("buscador")

            buscador.addEventListener("input", (e) =>{

                const texto = e.target.value.toLowerCase()

                const filtrados = productosData.filter(p => p.name.toLowerCase().includes(texto))

                mostrarProductos(filtrados)
            })

            document.querySelectorAll(".btn-filtro").forEach(btn =>{

                btn.addEventListener("click",(e)=>{

                    const cat = e.target.dataset.cat

                    document.querySelectorAll(".btn-filtro").forEach(b =>{

                        b.classList.replace('btn-success','btn-outline-success')
                    })

                    e.target.classList.replace('btn-outline-success','btn-success')
                    const filtrados = cat === "todas" ? productosData: productosData.filter(p => p.category.toLowerCase()===cat)

                    mostrarProductos(filtrados)
                })


            })

            const btnCerrarsesion = document.getElementById("btn-cerrar-sesion")
            btnCerrarsesion.addEventListener("click", (e) => {
                e.preventDefault()
                cerrarSesion()
            })

            document.getElementById("resumen-lista").addEventListener("click", (e) => {

                const quitarProductos = e.target.closest(".btn-quitar")

                if (quitarProductos) {

                    const id = quitarProductos.dataset.id

                    const index = carrito.findIndex(p => p.id == id)

                    if (index !== -1) {

                        carrito.splice(index, 1)

                        updateCarrito()
                    }
                }


            })


            document.getElementById("contenedor-productos").addEventListener("click", (e) => {
                if (e.target.classList.contains("btn-agregar")) {
                    const id = e.target.dataset.id
                    const producto = productosData.find(p => p.id == id)
                    carrito.push(producto)
                    updateCarrito()
                }
            })


            document.getElementById("btn-confirmar").addEventListener("click", async () => {
                const userId = obtenerIdUser()
                if (!userId) return alert("Debes iniciar sesión")

                const btn = document.getElementById("btn-confirmar");


                btn.disabled = true;
                btn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Procesando pedido...
                `;



                const pedido = {
                    userId: parseInt(userId),
                    items: carrito,
                    total: carrito.reduce((sum, p) => sum + p.price, 0),
                    status: "pendiente",
                    fecha: new Date().toLocaleString()
                }

                try {
                    const res = await fetch('http://localhost:8080/orders', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(pedido)
                    })

                    if (res.ok) {
                        setTimeout(() => {
                            carrito = []
                            window.location.hash = "#/orders"
                        }, 2000);
                    }
                } catch (error) {
                    console.error("error en el servidor", error)
                }
            })
        }
    }
}