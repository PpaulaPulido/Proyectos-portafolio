const url = "http://localhost:4000/clientes";

//cuando se crea un nuevo cliente
export const nuevoCliente = async cliente => {

    //se envian datos al servidor
    try {
        await fetch(url, {
            method: 'POST', 
            body: JSON.stringify(cliente), // data puede ser string o un objeto
            headers:{
              'Content-Type': 'application/json' // Y le decimos que los datos se enviaran como JSON
            }
        });
        window.location.href = 'index.html';
    } catch (error) {
        console.log(error);
    }
}

//Obtener todos los clientes
export const obtenerClientes = async () => {
    try {
        const resultado = await fetch(url);
        const clientes = await resultado.json();
        return clientes;
    } catch (error) {
        console.log(error);
    }
}
//obtener un cliente por su id
export const obtenerCliente = async id => {
    try {
        const resultado = await fetch(`${url}/${id}`);
        const cliente = await resultado.json();
        return cliente;
    } catch (error) {
        console.log(error);
    }
}


export const editarCliente = async cliente => {
    try {
        await fetch(`${url}/${cliente.id}`, {
            method: 'PUT', 
            body: JSON.stringify(cliente), // data puede ser string o un objeto
            headers:{
              'Content-Type': 'application/json' // Y le decimos que los datos se enviaran como JSON
            }
        });
    } catch (error) {
        console.log(error);
    }
}

//eliminar clientes
export const eliminarCliente = async id => {
    try {
        await fetch(`${url}/${id}`, { //se inyecta el id a la url
            method: 'DELETE'
        });
    } catch (error) {
        console.log(error);
    }
}