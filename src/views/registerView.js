import { crearUsuario } from "../api/services/auth.service.js"


export const registerView = () => ({

    render: () => {
        return `<div class="container d-flex align-items-center justify-content-center min-vh-100">
        <div class="row justify-content-center w-100">
            <div class="col-md-6 col-lg-5">
                <div class="card shadow-lg border-0">
                    <div class="card-body p-5">
                        <div class="text-center">
                            <h4 class="text-dark mb-4">Registrate</h4>
                        </div>
                        <form class="user">
                            <div class="mb-3">
                                <input class="form-control form-control-user" type="text"
                                id="name-user" placeholder="Ingrese Nombre" name="name-user">
                            </div>
                            <div class="mb-3">
                                <input class="form-control form-control-user" type="email"
                                id="email-user" placeholder="Ingrese Correo" name="email">
                            </div>
                            <div class="mb-3">
                                <input class="form-control form-control-user" type="password"
                                id="password-user" placeholder="Password" name="password">
                            </div>
                               <div class="mb-3">
                                <input class="form-control form-control-user" type="password"
                                id="confirm-password-user" placeholder="Password" name="password">
                            </div>
                            <div class="mb-3">
                                <select id="role-user" name="role" class="form-control form-control-user">
                                    <option value="" selected disabled>Seleccione Rol</option>
                                    <option value="admin">Admin</option>
                                    <option value="visitante">Visitante</option>
                               </select>
                            </div>
                          
                            <button class="btn btn-warning d-block w-100 btn-user" id="btn-registrar-user" type="button">Registrate</button>
                        </form>
                        
                    </div>

                </div>
            </div>
        </div>
        </div>`
    },
    cargarRender: () => {

        const btnregistro = document.getElementById("btn-registrar-user")

        btnregistro.onclick = async (e) => {

            e.preventDefault()

            const nameUser = document.getElementById("name-user").value
            const emailUser = document.getElementById("email-user").value
            const passwordUser = document.getElementById("password-user").value
            const confirmPassword = document.getElementById("confirm-password-user").value
            const role = document.getElementById("role-user").value


            if (!nameUser || !emailUser || !passwordUser || !confirmPassword) {

                alert("No pueden estar vacios los campos")

                return
            }
            
            if(!role || role == ""){
                alert("Debes escoger un rol")
                return
            }
            

            if (passwordUser !== confirmPassword) {

                alert("Las contraseñas no coinciden")

                return
            }

            const nuevoUser = {
                name: nameUser.trim(),
                email: emailUser,
                password: passwordUser,
                role: role
            }

            await crearUsuario(nuevoUser)

            alert("Se creo con exito")

            window.location.hash = "#/login"
        }
    }

})