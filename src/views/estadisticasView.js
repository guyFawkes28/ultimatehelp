import { cerrarSesion } from "../utils/store.js"

export const estadisticasView = () =>({

    render: ()=>{
        
        return `
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
                <div class="container">
                    <a class="navbar-brand fw-bold">RestorApp</a>
                    <a class="navbar-brand fw-bold" href="#/dashboard">Dashboard </a>
                    <button type="button" id="btn-cerrar-sesion" class="btn btn-danger">Cerrar sesion</button>
               
                </div>
            </nav>
            <div class="container-fluid mt-4 px-4">
                <div class="row mb-4">
                    <div class="col-md-4">
                <div class="card shadow-sm border-0  text-white p-3">
                    <label class="text-muted small d-block text-uppercase fw-bold">Ganancias Totales</label>
                    <h2 id="total-ganancias" class="fw-bold text-success">$0</h2>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow-sm border-0 p-3">
                    <label class="text-muted small d-block text-uppercase fw-bold">ordenes Totales</label>
                    <h2 id="total-ordenes" class="fw-bold text-dark">0</h2>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow-sm border-0 p-3">
                    <label class="text-muted small d-block text-uppercase fw-bold">Nuestros Clientes</label>
                    <h2 id="total-clientes" class="fw-bold text-primary">0</h2>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
             <h2><i class="bi bi-gear-fill"></i> Panel de Administración</h2>
             </div>

        <div class="mt-5 mb-4">
            <h3><i class="bi bi-people-fill"></i> Directorio de Clientes</h3>
        </div>
        <div class="card shadow-sm border-0 mb-5">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-usuarios">
                        </tbody>
                </table>
            </div>
        </div>
    </div>`
        },

        cargarRender: async ()=>{

            const tablaUsers = document.getElementById("tabla-usuarios")
            const ganancias = document.getElementById("total-ganancias")
            const totalOrdenes = document.getElementById("total-ordenes")
            const totalClientes = document.getElementById("total-clientes")

            try {

                const [resPedidos,resUsers] = await Promise.all([
                    fetch('http://localhost:8080/orders'),
                    fetch('http://localhost:8080/users')
                ])

                const pedidos = await resPedidos.json()
                const users = await resUsers.json()

                const gananciasTotales = pedidos.reduce((x,p) => x +(Number (p.total) || 0),0)

                ganancias.textContent = `$${gananciasTotales.toLocaleString()}`
                totalOrdenes.textContent = pedidos.length
                totalClientes.textContent = users.length

                tablaUsers.innerHTML = users.map(u => `
                    <tr class="align-middle">
                    <td class="text-capitalize">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-person-circle me-2 fs-5 text-secondary"></i>
                            <span class="fw-bold">${u.name}</span>
                        </div>
                    </td>
                    <td>${u.email}</td>
                    <td>
                        <span class="badge ${u.role === 'admin' ? 'bg-danger' : 'bg-info'} text-uppercase">
                            ${u.role}
                        </span>
                    </td>
                </tr>
             
                `).join('')

            }
                
             catch (error) {

                console.error("Error cargando estadísticas:", error);
                if(tablaUsers) tablaUsers.innerHTML = `
                <tr><td colspan="3" class="text-danger text-center">Error al conectar con el servidor</td></tr>`
                
            }

            document.getElementById("btn-cerrar-sesion")?.addEventListener("click", () => cerrarSesion());


        }


})

    

        
  