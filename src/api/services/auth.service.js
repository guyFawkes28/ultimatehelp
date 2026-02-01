export const  authUser = async (email,password) => {

    const url = `http://localhost:8080/users?email=${email}&password=${password}`

    try {
        const res = await fetch(url)
        if (!res.ok){

            throw new Error("Error al conectar al servidor");
        }

        const users = await res.json()

        return users.length > 0 ? users[0] : null

    } catch (error) {

        console.error("error de autenticacion",error)

        return null

        
    }
    
}




export const crearUsuario = async (user) => {

    try {

        const res = await fetch('http://localhost:8080/users',{

            method: 'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify(user)
        })
        
        if(!res.ok){

            throw new Error("Erro en la peticion");
            
        }
        
    } catch (error) {

        console.log("hubo un error en post")
        
    }
    
}