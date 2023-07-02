//ALTAS------------------------------------------------------------------------------------------------------
let URL = "https://horaciorizzuti.pythonanywhere.com/"

    let page = document.title
    switch (page) {
        case 'Alta':
            alta();
            break;
        case 'Listado':
            listado();
            break;
        case 'Modificaciones':
            modificaciones();
            break;

        case 'Baja':
            baja();
            break;  
    }

function alta (){
    // Capturamos el evento de envío del formulario
    document.getElementById('formulario').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitamos que se envie el form por ahora
    
        // Obtenemos los valores del formulario
        var codigo = document.getElementById('codigo').value;
        var descripcion = document.getElementById('descripcion').value;
        var cantidad = document.getElementById('cantidad').value;
        var precio = document.getElementById('precio').value;
       console.log(precio)
        // Creamos un objeto con los datos del producto
        var producto = {
            codigo: codigo,
            descripcion: descripcion,
            cantidad: cantidad,
            precio: precio
        };
        console.log(producto)
        // Realizamos la solicitud POST al servidor
        //let URL = "https://horaciorizzuti.pythonanywhere.com/"
        fetch(URL + 'productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        })
            .then(function (response) {
                // Código para manejar la respuesta
                if (response.ok) {
                    return response.json(); // Parseamos la respuesta JSON
                } else {
                    // Si hubo un error, lanzar explícitamente una excepción
                    // para ser "catcheada" más adelante
                    throw new Error('Error al agregar el producto.');
                }
            })
            .then(function (data) {
                alert('Producto agregado correctamente.');
                //Limpiamos el formulario.
                document.getElementById('codigo').value = "";
                document.getElementById('descripcion').value = "";
                document.getElementById('cantidad').value = "";
                document.getElementById('precio').value = "";
            })
            .catch(function (error) {
                // Código para manejar errores
                alert('Error al agregar el producto.');
            });
    })
}

//LISTADO------------------------------------------------------------------------------------------------------
//const URL = "http://127.0.0.1:5000/"
//const URL = "https://horaciorizzuti.pythonanywhere.com/"
//Realizamos la solicitud GET al servidor para obtener todos los productos
function listado(){
//let URL = "https://horaciorizzuti.pythonanywhere.com/"
fetch(URL + 'productos')
    .then(function (response) {
        if (response.ok) {
            return response.json(); // Parseamos la respuesta JSON
        } else {
            // Si hubo un error, lanzar explícitamente una excepción
            // para ser "catcheada" más adelante
            throw new Error('Error al obtener los productos.');
        }
    })
    .then(function (data) {
        var tablaProductos = document.getElementById('tablaProductos');

        // Iteramos sobre los productos y agregamos filas a la tabla
        data.forEach(function (producto) {
            var fila = document.createElement('tr');
            fila.innerHTML = '<td>' + producto.codigo + '</td>' +
                '<td>' + producto.descripcion + '</td>' +
                '<td align="right">' + producto.cantidad + '</td>' +
                '<td align="right">&nbsp; &nbsp;&nbsp; &nbsp;' + producto.precio + '</td>';
            tablaProductos.appendChild(fila);
        });
    })
    .catch(function (error) {
        // Código para manejar errores
        alert('Error al obtener los productos.');
    })
}

//MODIFICACIONES------------------------------------------------------------------------------------------------------
//const URL = "http://127.0.0.1:5000/"
//const URL = "https://horaciorizzuti.pythonanywhere.com/"
function modificaciones(){
const app = Vue.createApp({
    data() {
        return {
            codigo: '',
            mostrarDatosProducto: false,
            descripcion: '',
            cantidad: '',
            precio: ''
        }
    },
    methods: {
        obtenerProducto() {
            fetch(URL + 'productos/' + this.codigo)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Error al obtener los datos del producto.')
                    }
                })
                .then(data => {
                    this.descripcion = data.descripcion
                    this.cantidad = data.cantidad
                    this.precio = data.precio
                    this.mostrarDatosProducto = true
                })
                .catch(error => {
                    alert('Error al obtener los datos del producto.')
                })
        },
        guardarCambios() {
            const producto = {
                codigo: this.codigo,
                descripcion: this.descripcion,
                cantidad: this.cantidad,
                precio: this.precio
            }

            fetch(URL + 'productos/' + this.codigo, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Error al guardar los cambios del producto.')
                    }
                })
                .then(data => {
                    alert('Cambios guardados correctamente.')
                    location.reload()
                })
                .catch(error => {
                    alert('Error al guardar los cambios del producto.')
                })
        }
    }
})

app.mount('#app')
}

//BAJA------------------------------------------------------------------------------------------------------


        //const URL = "http://127.0.0.1:5000/"
        //const URL = "https://horaciorizzuti.pythonanywhere.com/"
function baja (){
        const app = Vue.createApp({
            data() {
                return {
                    productos: []
                }
            },
            methods: {
                obtenerProductos() {
                    // Obtenemos el contenido del inventario
                    fetch(URL + 'productos')
                        .then(response => {
                            if (response.ok) {
                                return response.json(); // Parseamos la respuesta JSON
                            } else {
                                // Si hubo un error, lanzar explícitamente una excepción
                                // para ser "catcheada" más adelante
                                throw new Error('Error al obtener los productos.');
                            }
                        })
                        .then(data => {
                            // El código Vue itera este elemento para generar la tabla
                            this.productos = data;
                        })
                        .catch(error => {
                            console.log('Error:', error);
                            alert('Error al obtener los productos.');
                        });
                },
                eliminarProducto(codigo) {
                    // Eliminamos el producto de la fila seleccionada
                    fetch(URL + `productos/${codigo}`, { method: 'DELETE' })
                        .then(response => {
                            if (response.ok) {
                                // Eliminar el producto de la lista después de eliminarlo en el servidor
                                this.productos = this.productos.filter(producto => producto.codigo !== codigo);
                                console.log('Producto eliminado correctamente.');
                            } else {
                                // Si hubo un error, lanzar explícitamente una excepción
                                // para ser "catcheada" más adelante
                                throw new Error('Error al eliminar el producto.');
                            }
                        })
                        .catch(error => {
                            // Código para manejar errores
                            alert('Error al eliminar el producto.');
                        });
                }
            },
            mounted() {
                //Al cargar la página, obtenemos la lista de productos
                this.obtenerProductos();
            }
        });

        app.mount('body');
    }

// ORIGINAL--------------------------------------------------------------------------------------------------
// //ALTAS------------------------------------------------------------------------------------------------------
// const app = {
//     //URL: "https://horaciorizzuti.pythonanywhere.com/",
//     //const URL = "http://127.0.0.1:5000/"
//     init: () => {
//     document.addEventListener("DOMContentLoaded",app.load);
//         console.log('HTML loaded');
//     },
//     load: () => {
//         //the page had finished loading its HTML
//         //app.showLoading();
//         app.getData();
//     },
//     getData: () => {
//     //let URL = "https://horaciorizzuti.pythonanywhere.com/"
//         //based on the current page...
//         // let page = document.getElementsByTagName("title")
//         let page = document.title
//         //title.textConten
//        console.log(page)
//         switch (page) {
//             case 'Alta':
//                 //console.log(page)
//                 app.alta();
//                 break;
//             case 'listado':
//             listado();
//            break;
//         }
//         },
//     //}
//     alta:()=>{
//         // Capturamos el evento de envío del formulario
//         document.getElementById('formulario').addEventListener('submit', function (event) {
//             event.preventDefault(); // Evitamos que se envie el form por ahora
        
//             // Obtenemos los valores del formulario
//             var codigo = document.getElementById('codigo').value;
//             var descripcion = document.getElementById('descripcion').value;
//             var cantidad = document.getElementById('cantidad').value;
//             var precio = document.getElementById('precio').value;
//            console.log(precio)
//             // Creamos un objeto con los datos del producto
//             var producto = {
//                 codigo: codigo,
//                 descripcion: descripcion,
//                 cantidad: cantidad,
//                 precio: precio
//             };
//             console.log(producto)
//             // Realizamos la solicitud POST al servidor
//             //let URL = "https://horaciorizzuti.pythonanywhere.com/"
//             let URL = "https://horaciorizzuti.pythonanywhere.com/"
//             fetch(URL + 'productos', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },