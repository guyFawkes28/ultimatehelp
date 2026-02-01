import { obtenerRole, verificarLogueo } from "../utils/store.js"
import {  notFoundView} from "../views/notFoundView.js"
import { loginView } from "../views/loginView.js"
import { registerView } from "../views/registerView.js"
import { dashboardView } from "../views/dashboardView.js"
import { menuView } from "../views/menuView.js"
import { ordersView } from "../views/ordersView.js"
import { perfilView } from "../views/perfilView.js"
import { estadisticasView } from "../views/estadisticasView.js"


const routes = {

    "#/":loginView(),
    "#/login":loginView(),
    "#/register":registerView(),
    "#/dashboard":dashboardView(),
    "#/menupage":menuView(),
    "#/orders":ordersView(),
    "#/perfil":perfilView(),
    "#/estadisticas":estadisticasView()

}

export const gestorRutas = async () => {

    const app = document.getElementById("app")
    
    const isLogueo = verificarLogueo()

    const hash = window.location.hash || "#/login"

    //vericar si esta intentando acceder a una ruta protegida
    if((hash == "#/dashboard" || hash == "#/menupage" || hash == "#/orders" || hash == "#/perfil" || hash== "#/estadisticas") && !isLogueo) {

        const notFound = notFoundView()

        app.innerHTML = notFound.render()

        await notFound.cargarRender()

        return

    }

    const userRole = obtenerRole()

    if (isLogueo){

        if ((hash== "#/menupage" || hash == "#/orders" || hash == "#/perfil") && userRole=="admin"){

            window.location.hash = "#/dashboard"
            return
        }

        else if ((hash == "#/dashboard" || hash == "#/estadisticas") && userRole == "visitante"){

            window.location.hash = "#/menupage"
            return

        }
    }


    if ((hash == "#/login" || hash == "#/register" || hash == "#/") && verificarLogueo()){

        window.location.hash = (userRole == "admin") ? "#/dashboard" : "#/menupage"

        return
    }

    const vista = routes[hash]
    
    if(vista) {

        app.innerHTML = vista.render()

        await vista.cargarRender()

    }

    else {
        const notFound = notFoundView()

        app.innerHTML = notFound.render()

        await notFound.cargarRender()
    }
    
}