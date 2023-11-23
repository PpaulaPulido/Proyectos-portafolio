let cliente = {
    mesa: '',
    hora: '',
    pedido: [],
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);


function guardarCliente() {

    //con el value tomamos el valor que ingresa el usuario
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;


    // Revisar si hay campos vacios
    //some verifica que cumpla alguna de las condiciones 
    const camposVacios = [mesa, hora].some( campo => campo === '' );

    if(camposVacios) {
        // console.log('Si hay campos vacios');

        //veirificar si ya hay una alerta
        // Mostrar mensaje de error en el modal-body
        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            //elimnar alerta despuesde 3 segundos
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }
        return;
    } 

    // console.log('Todos los campos llenos');
    
    //asignar datos del formulario al objeto cliente
    cliente = { ...cliente, mesa, hora };
    //console.log(cliente);

    // Ocultar el modal...
    const modalFormulario = document.querySelector('#formulario');
    //getInstance obtiene el modal actual que tenemos
    const  modal = bootstrap.Modal.getInstance(modalFormulario);
    modal.hide();

    mostrarSecciones();
    obtenerPlatillos();
}

//mostrar Secciones
function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';
    
    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => mostrarPlatillos(resultado))
        .catch(error => console.log(error))
}

function mostrarPlatillos(platillos) {

    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(  platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'border-top' );

    
        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4', 'py-3');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'py-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3', 'py-3');
        categoria.textContent = categorias[platillo.categoria];


        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        //cantidad min es el minimo de pedidos que es cero
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function() {
            const cantidad = parseInt( inputCantidad.value );
           agregarPlatillo({...platillo, cantidad});
        }

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2', 'py-3');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    })
}


function agregarPlatillo(producto) {

    //extraer  el pedido actual
   let { pedido } = cliente;

   //revisar que la cantidad sea mayor a cero

   if (producto.cantidad > 0 ) {
        // Comprobar si el platillo ya esta en el carrito...
        if(pedido.some( articulo =>  articulo.id === producto.id )) {
            // Iterar para actualizar la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if( articulo.id === producto.id ) {
                    articulo.cantidad = producto.cantidad;
                } 
                return articulo;
            });

            // Se asigna al array a cliente pedido
            cliente.pedido  = [...pedidoActualizado];
        } else {
            // En caso de que el articulo no exista, es nuevo y se agrega
            cliente.pedido = [...pedido, producto];
        }
   } else {
    //eliminar elementos cuando la cantidad sea cero
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];       
   }

    limpiarHTML();

    if(cliente.pedido.length) {
        actualizarResumen();
    }  else {
        mensajePedidoVacio();
    }
}

function actualizarResumen() {

    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    // Mostrar la Mesa

    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');
    mesa.appendChild(mesaSpan);

    // Hora
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');
    hora.appendChild(horaSpan);


    // Mostrar los platillos Consumidos!
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos Pedidos';
    heading.classList.add('my-4','text-center');
    

    // Producto pedido iterar
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( articulo => {

        const { nombre, cantidad, precio, id } = articulo;
        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('text-center', 'my-4');
        nombreEl.textContent = nombre;

        const cantidadEl = document.createElement('P');        
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';


        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(articulo);

        // Botón para Eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar Pedido';

        // Funcion para eliminar ese contenido
        btnEliminar.onclick = function() {
            eliminarProducto( id );
        }
        
        // Agregar los Labels a sus contenedores
        cantidadEl.appendChild(cantidadValor)
        precioEl.appendChild(precioValor)
        subtotalEl.appendChild(subtotalValor);


        //agregar los elementos a la li
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);
        //agregar lista al grupo principal
        grupo.appendChild(lista);

    })

    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);
    

    // agregar al contenido
    contenido.appendChild(resumen)

    // Mostrar Calculadora de Propinas
    formularioPropinas();
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');
    while(contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(articulo){
    const {cantidad, precio} = articulo;
    return `$ ${cantidad * precio}`;
}

function eliminarProducto(id) {
    const { pedido } = cliente;
    cliente.pedido = pedido.filter( articulo => articulo.id !== id); 

    limpiarHTML();

    if(cliente.pedido.length) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    // El producto se eliminó, por lo tanto lo vamos a regresar a 0
    const productoEliminado = `#producto-${id}`; 
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio () {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade Productos al Pedido';

    contenido.appendChild(texto);
}

function formularioPropinas() {

    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario','card');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card','py-2','px-3','shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4','text-center');
    heading.textContent = 'Propina';

    // Propina 10%
    const checkBox10 = document.createElement('INPUT');
    checkBox10.type = "radio";
    checkBox10.name = 'propina';
    checkBox10.value = "10";
    checkBox10.classList.add('form-check-input');
    checkBox10.onclick = calcularPropina;

    const checkLabel10 = document.createElement('LABEL');
    checkLabel10.textContent = '10%';
    checkLabel10.classList.add('form-check-label');

    const checkDiv10 = document.createElement('DIV');
    checkDiv10.classList.add('form-check');

    checkDiv10.appendChild(checkBox10);
    checkDiv10.appendChild(checkLabel10);

    // Propina 25%

    const checkBox25 = document.createElement('INPUT');
    checkBox25.type = "radio";
    checkBox25.name = 'propina';
    checkBox25.value = "25";
    checkBox25.classList.add('form-check-input');
    checkBox25.onclick = calcularPropina;

    const checkLabel25 = document.createElement('LABEL');
    checkLabel25.textContent = '25%';
    checkLabel25.classList.add('form-check-label');

    const checkDiv25 = document.createElement('DIV');
    checkDiv25.classList.add('form-check');

    checkDiv25.appendChild(checkBox25);
    checkDiv25.appendChild(checkLabel25);

    // Propina 50%
    const checkBox50 = document.createElement('INPUT');
    checkBox50.type = "radio";
    checkBox50.name = 'propina';
    checkBox50.value = "50";
    checkBox50.classList.add('form-check-input');
    checkBox50.onclick = calcularPropina;

    const checkLabel50 = document.createElement('LABEL');
    checkLabel50.textContent = '50%';
    checkLabel50.classList.add('form-check-label');

    const checkDiv50 = document.createElement('DIV');
    checkDiv50.classList.add('form-check');

    checkDiv50.appendChild(checkBox50);
    checkDiv50.appendChild(checkLabel50);

    // Añadirlos a los formularios

    divFormulario.appendChild(heading);
    divFormulario.appendChild(checkDiv10);
    divFormulario.appendChild(checkDiv25);
    divFormulario.appendChild(checkDiv50);

    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);
}

function calcularPropina() {
    
    const radioSeleccionado = document.querySelector('[name="propina"]:checked').value;
    // console.log(radioSeleccionado);

    const {pedido} = cliente;
    // console.log(pedido);

    let subtotal = 0;
    pedido.forEach(articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar');

    // Propina
    const propina = ((subtotal * parseInt(radioSeleccionado)) / 100) ;
    const total = propina + subtotal;

    // Subtotal
    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;
    subtotalParrafo.appendChild(subtotalSpan);

    // Propina
    const propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fs-3', 'fw-bold');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;
    propinaParrafo.appendChild(propinaSpan);

    // Total
    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fs-3', 'fw-bold');
    totalParrafo.textContent = 'Total a Pagar: ';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    totalParrafo.appendChild(totalSpan);

    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv) {
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(divTotales);

}