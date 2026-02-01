
export const iniciarSesionLocal = (user) =>{

    localStorage.setItem("user-id",user.id)

    localStorage.setItem("user-role",user.role)

    localStorage.setItem("user-email",user.email)

    localStorage.setItem("user-name",(user.name || '').trim())

}

export const cerrarSesion = ()=>{

    localStorage.clear()

    window.location.hash = "#/login"

    window.location.reload()
}

export const obtenerIdUser = () =>{
    
    return localStorage.getItem("user-id")
}

export const obtenerName = () =>{

    return localStorage.getItem("user-name")
}

export const obtenerEmail = () =>{

    return localStorage.getItem("user-email")
}

export const verificarLogueo = () =>{

    return localStorage.getItem("user-role") !== null 
    
}

export const obtenerRole = () =>{

    return localStorage.getItem("user-role")
}