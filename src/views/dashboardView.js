import { cerrarSesion } from "../utils/store.js"



export const dashboardView = () => {

    let pedidosData = []

    const tabla = (pedidos) => {

        const container = document.getElementById("tabla-pedidos")

        container.innerHTML = pedidos.map(p => `
            <tr class="align-middle">
                <td><span class="fw-bold">#${p.id}</span></td>
                <td><small>${p.fecha}</small></td>
                <td>
                    ${p.items.map(item => `<span class="badge bg-light text-dark border small">${item.name}</span>`).join(' ')}
                </td>
                <td><span class="fw-bold text-success">$${p.total.toLocaleString()}</span></td>
                <td>
                    <select class="form-select form-select-sm select-estado" data-id="${p.id}">
                        <option value="pendiente" ${p.status === 'pendiente' ? 'selected' : ''}>Pendiente </option>
                        <option value="preparando" ${p.status === 'preparando' ? 'selected' : ''}>Preparando </option>
                        <option value="listo" ${p.status === 'listo' ? 'selected' : ''}>Listo</option>
                        <option value="entregado" ${p.status === 'entregado' ? 'selected' : ''}>Entregado </option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm btn-abrir-modal" 
                        data-id="${p.id}" 
                        data-bs-toggle="modal" 
                        data-bs-target="#modalEliminar">
                        Eliminar orden
                    </button>
                </td>
            </tr>        
            
        `).join('')

    }

    return {

        render: () => ` 

         <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
            <div class="container">
                <a class="navbar-brand fw-bold">RestorApp</a>
                <a class ="navbar-brand fw-bold" href="#/estadisticas">Estadisticas</a>
              
                <button type="button" id="btn-cerrar-sesion" class="btn btn-danger">Cerrar sesion</button>
               
            </div>
        </nav>
        
        <div class="container-fluid mt-4 px-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2><i class="bi bi-gear-fill"></i> Panel de Administración</h2>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-dark btn-filtro" data-estado="todos">Todos</button>
                        <button type="button" class="btn btn-outline-warning btn-filtro" data-estado="pendiente">Pendientes</button>
                        <button type="button" class="btn btn-outline-info btn-filtro" data-estado="preparando">En Cocina</button>
                        <button type="button" class="btn btn-outline-success btn-filtro" data-estado="listo">Listo</button>
                        <button type="button" class="btn btn-outline-success btn-filtro" data-estado="entregado">Entregados</button>
                        
                    </div>
                </div>

                <div class="card shadow-sm border-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-pedidos">
                                </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="modalEliminar" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center py-4" id="modal-contenido">
                            <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                            <h4 class="mt-3">¿Estás seguro?</h4>
                            <p class="text-muted">Esta acción no se puede deshacer.</p>
                            <div class="d-flex justify-content-center gap-2 mt-4">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-danger" id="btn-confirmar-eliminar">Eliminar Pedido</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        cargarRender: async () => {


            let idPedidoEliminar = null

            const filtrarPedidos = (estado) => {

                const filtrados = estado === "todos"
                    ? pedidosData : pedidosData.filter(p => p.status === estado)

                tabla(filtrados)


            }

            const cargarDatos = async () => {

                const res = await fetch('http://localhost:8080/orders')

                pedidosData = await res.json()

                tabla(pedidosData.reverse())
            }

            await cargarDatos()

            document.querySelectorAll(".btn-filtro").forEach(btn => {

                btn.addEventListener("click", (e) => filtrarPedidos(e.target.dataset.estado))
            })

            document.getElementById("tabla-pedidos").addEventListener("click", (e) => {

                const btn = e.target.closest(".btn-abrir-modal")

                if (btn) {
                    idPedidoEliminar = btn.dataset.id
                }
            })

            const btnConfirmar = document.getElementById("btn-confirmar-eliminar")

            const modalContenido = document.getElementById("modal-contenido")

            btnConfirmar.addEventListener("click", async () => {

                if (!idPedidoEliminar) return

                modalContenido.innerHTML = `

                    <div class="py-5">
                        <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;"></div>
                        <h5 class="mt-3">Eliminando pedido #${idPedidoEliminar}...</h5>
                    </div>
                
                
                `
                try {

                    await new Promise(resolve => setTimeout(resolve, 2000))

                    await fetch(`http://localhost:8080/orders/${idPedidoEliminar}`,

                        {
                            method: 'DELETE'
                        }
                    )

                    const modalElement = document.getElementById("modalEliminar")

                    const modalInstance = bootstrap.Modal.getInstance(modalElement)

                    modalInstance.hide()

                    pedidosData = pedidosData.filter(p => p.id != idPedidoEliminar)
                    tabla(pedidosData)

                    location.reload()

                } catch (error) {

                    alert("error al aleminar")
                    location.reload()
                }

            })

            const logout = document.getElementById("btn-cerrar-sesion")

            logout.addEventListener("click", (e) => {

                e.preventDefault
                cerrarSesion()
            })

            document.getElementById("tabla-pedidos").addEventListener("change", async (e) => {

                if (e.target.classList.contains("select-estado")) {

                    const id = e.target.dataset.id
                    const nuevoEstado = e.target.value

                    await fetch(`http://localhost:8080/orders/${id}`, {

                        method: "PATCH",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify({ status: nuevoEstado })
                    })
                    const pedidoIndex = pedidosData.findIndex(p => p.id == id)

                    if (pedidoIndex !== 1) {
                        pedidosData[pedidoIndex].status = nuevoEstado
                    }

                }

            })
        }

    }
}