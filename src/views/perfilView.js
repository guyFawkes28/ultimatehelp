import { obtenerName, obtenerIdUser, obtenerEmail, obtenerRole , cerrarSesion} from "../utils/store.js"



export const perfilView = () => {

    return {



        render: () =>
            `
         <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
            <div class="container">
                <a class="navbar-brand fw-bold" href="#/menupage">RestorApp</a>
                <a class="navbar-brand fw-bold" href="#/orders"> Mis ordenes </a>
                <a class="navbar-brand fw-bold" href="#/perfil"> Perfil </a>
                <button type="button" id="btn-cerrar-sesion" class="btn btn-danger">Cerrar sesion</button>
               
            </div>
        </nav>

        <div class="container mt-5">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card shadow-lg border-0">
                            <div class="card-header bg-dark text-white text-center py-4">
                                <div class="mb-3">
                                    <i class="bi bi-person-circle" style="font-size: 4rem;"></i>
                                </div>
                                <h3 id="perfil-nombre" class="mb-0 text-capitalize"></h3>
                                <span id="perfil-rol" class="badge bg-warning"></span>
                            </div>
                            <div class="card-body p-4">
                                <div class="mb-4">
                                    <label class="text-muted small d-block">Correo Electrónico</label>
                                    <h5 id="perfil-correo" class="fw-bold">---</h5>
                                </div>
                                
                                <div class="row text-center bg-light rounded py-3">
                                    <div class="col-6 border-end">
                                        <label class="text-muted small d-block">Pedidos</label>
                                        <h4 id="cantidad" class="fw-bold text-dark"></h4>
                                    </div>
                                    <div class="col-6">
                                        <label class="text-muted small d-block">Total Gastado</label>
                                        <h4 id="total" class="fw-bold text-success"></h4>
                                    </div>
                                </div>

                                <div class="mt-4 d-grid gap-2">
                                    <a href="#/orders" class="btn btn-outline-dark">
                                        <i class="bi bi-clock-history"></i> Ver historial completo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        
        
        `,
        cargarRender: async () => {

            const userId = obtenerIdUser()

            const nombre = obtenerName()

            const email = obtenerEmail()

            const rol = obtenerRole()

            const logout = document.getElementById("btn-cerrar-sesion")

            logout.addEventListener("click",(e)=>{

                e.preventDefault()
                cerrarSesion()
            })

            document.getElementById("perfil-nombre").innerText = `Hola, ${nombre}`

            document.getElementById("perfil-correo").innerText = `${email}`

            document.getElementById("perfil-rol").innerText = `${rol}`

            try {

                const res = await fetch(`http://localhost:8080/orders?userId=${userId}`)

                const pedidos = await res.json()

                if (pedidos.length > 0) {

                    document.getElementById("cantidad").innerText = pedidos.length

                    const totalGastado = pedidos.reduce((sum, p) => sum + p.total, 0)

                    document.getElementById("total").innerText = `$${totalGastado.toLocaleString()}`
                }

            } catch (error) {

                console.error("error en servicio", error)
            }
        }








    }



}




