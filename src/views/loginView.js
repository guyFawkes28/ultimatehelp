import { authUser } from "../api/services/auth.service.js"
import {iniciarSesionLocal} from "../utils/store.js"

export const loginView = () => ({

    render: () => {
        return ` 
        <div class="container d-flex align-items-center justify-content-center min-vh-100">
        <div class="row justify-content-center w-100">
            <div class="col-md-6 col-lg-5">
                <div class="card shadow-lg border-0">
                    <div class="card-body p-5">
                        <div class="text-center">
                            <h4 class="text-dark mb-4">Inicia Sesion</h4>
                        </div>
                        <form class="user" id="form-login">
                            <div class="mb-3">
                                <input class="form-control form-control-user" type="email"
                                id="email-user" placeholder="Ingrese Email" name="email">
                            </div>
                            <div class="mb-3">
                                <input class="form-control form-control-user" type="password"
                                id="password-user" placeholder="Password" name="password">
                            </div>
                            <button class="btn btn-success d-block w-100 btn-user" id="btn-login" type="submit">Login</button>
                        </form>
                        <div class="text-center"><a class="small" href="#/register">¿No tienes cuenta? Regístrate</a></div>
                    </div>

                </div>
            </div>
        </div>
    </div> `
    },

    cargarRender: () => {

        const formulario = document.getElementById("form-login")

        formulario.onsubmit = async (e) => {

            e.preventDefault()

            const email = document.getElementById("email-user").value.trim()
            const password = document.getElementById("password-user").value

            if (!email || !password) {
                alert("no puede dejar campos en blanco")
                return
            }

            try {

                const user = await authUser(email, password)

                if (user) {
                    iniciarSesionLocal(user)
                    alert ("Bienvenido "+user.name)
                    window.location.hash = "#/dashboard"

                }
                else{
                    alert("datos incorrectos")
                }

            } catch (error) {

                console.error("error",error)

            }

        }


    }
})
