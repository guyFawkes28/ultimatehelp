import { obtenerIdUser, cerrarSesion } from "../utils/store.js"

export const ordersView = () => {

    return {

        render: () => `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
            <div class="container">
                <a class="navbar-brand fw-bold" href="#/menupage">Ver Menu</a>
                <a class="navbar-brand fw-bold" href="#/orders"> Mis ordenes </a>
                <a class="navbar-brand fw-bold" href="#/perfil"> Perfil </a>
                <button type="button" id="btn-cerrar-sesion" class="btn btn-danger">Cerrar sesion</button>
               
            </div>
        </nav>

        <div class="container mt-4">

                <div class="d-flex justify-content-between align-items-center mb-4">

                    <h2 class="fw-bold"> Mis Ordenes</h2>

                    <a href="#/menupage" class="btn btn-warning btn-sm">Hacer otro pedido</a>

                </div>
                <div id="contenedor-pedidos" class="row">

                    

                </div>

            </div>
        
        
        `,

        cargarRender: async () => {

            const userId = obtenerIdUser()

            const logout = document.getElementById("btn-cerrar-sesion")

            const contenedor = document.getElementById("contenedor-pedidos")

            logout.addEventListener("click", (e) => {

                e.preventDefault()
                cerrarSesion()
            })

            try {

                const res = await fetch(`http://localhost:8080/orders?userId=${userId}`)
                const pedidos = await res.json()

                if (pedidos.length === 0) {

                    contenedor.innerHTML = `
                    <div class="col-12 text-center mt-5">
                            <h4 class="text-muted">Aún no has pedido nada.</h4>
                            <p>¡Nuestro menu te esperando!</p>
                        </div>
                    
                    `
                    return
                }

                contenedor.innerHTML = pedidos.reverse().map(pedido => `
                    <div class="col-12 mb-3">
                        <div class="card shadow-sm border-0 border-start border-4 ${pedido.status === 'pendiente' ? 'border-warning' : 'border-success'}">
                            <div class="card-body py-3">
                                <div class="row align-items-center">
                                    <div class="col-md-2 text-center">
                                        <span class="text-muted small d-block">ID Pedido</span>
                                        <span class="fw-bold">#${pedido.id}</span>
                                    </div>
                                    <div class="col-md-3">
                                        <span class="text-muted small d-block">Fecha</span>
                                        <span class="small">${pedido.fecha}</span>
                                    </div>
                                    <div class="col-md-4">
                                        <span class="text-muted small d-block">Productos</span>
                                        <div class="small text-truncate">
                                            ${pedido.items.map(item => `<span class="badge bg-light text-dark border me-1">${item.name}</span>`).join('')}
                                        </div>
                                    </div>
                                    <div class="col-md-3 text-end">
                                        <h5 class="mb-1 fw-bold text-success">$${pedido.total.toLocaleString()}</h5>
                                        <span class="badge ${pedido.status === 'pendiente' ? 'bg-warning text-dark' : 'bg-success'}">
                                            ${pedido.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                    `).join('')

            } catch (error) {

                console.error("Error al cargar pedidos ->",error)

                contenedor.innerHTML = `<p class="text-danger text-center">No pudimos cargar tus pedidos. Revisa la conexión.</p>`

            }





        }
    }


}