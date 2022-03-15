document.addEventListener('DOMContentLoaded', () => {

        let baseDeDatos = [];
    
        let carrito = [];
        const divisa = '$';
        const DOMitems = document.getElementById('items');
        const DOMcarrito = document.querySelector('#carrito');
        const DOMtotal = document.querySelector('#total');
        const DOMbotonVaciar = document.querySelector('#boton-vaciar');
        const miLocalStorage = window.localStorage;
    
        const listaDeProductos = [
            { id: 1,nombre: "Nueces", precio: 100, stock: 120},
            {id: 2,nombre: "Almendras",precio: 120,stock: 110},
            {id: 3, nombre: "Mani", precio: 21, stock: 150},
            {id: 4,nombre: "Mani con sal",precio: 600, stock: 1000},
            {id: 5, nombre: "Pistachos",precio: 80,stock: 240},
            {id: 6,nombre: "Castañas",precio: 80,stock: 201},
            {id: 7,nombre: "Aceite de coco ",precio: 80,stock: 124},
            {id: 8,nombre: "Aceite de canola",precio: 80,stock: 138},
            {id: 9,nombre: "Aceite de girasol",precio: 80,stock: 20},
            {id: 10,nombre: "Aceite de oliva", precio: 100, stock: 58},
            {id: 11,nombre: "Semillas de sesamo",precio: 120,stock: 100},
            {id: 12,nombre: "Quinoa",precio: 120,stock: 120},
            {id: 13,nombre: "Queso de cabra 250 mg",precio: 120,stock: 589},
            {id: 14,nombre: "Queso de cabra 500 mg",precio: 120,stock: 50},
            {id: 15,nombre: "Queso de bufala 250 mg",precio: 120,stock: 340},
            {id: 16,nombre: "Queso de bufala 500 mg",precio: 120,stock: 30},
            {id: 17,nombre: "Mani con chocolate",precio: 120,stock: 100},
            {id: 18,nombre: "Almendras con chocolate",precio: 120,stock: 12},
            {id: 19,nombre: "Semillas de lino",precio: 120,stock: 12},
            {id: 20,nombre: "Semillas de girasol",precio: 120,stock: 120},
            {id: 21,nombre: "Semillas de chia",precio: 120,stock: 60},
            {id: 22,nombre: "Mix de semillas",precio: 120,stock: 170},
            {id: 23,nombre: "Garbanzos",precio: 120,stock: 70},
            {id: 24,nombre: "Pasas de uvas",precio: 120,stock: 100},
            {id: 25,nombre: "Lentejas",precio: 120,stock: 230}
        ]
    
        function renderizarProductos() {
            listaDeProductos.forEach((info) => {
                // Estructura
                const miNodo = document.createElement('div');
                miNodo.classList.add('card', 'col-sm-4');
                // Body
                const miNodoCardBody = document.createElement('div');
                miNodoCardBody.classList.add('card-body');
                // Titulo
                const miNodoTitle = document.createElement('h5');
                miNodoTitle.classList.add('card-title');
                miNodoTitle.textContent = info.nombre;
                // Precio
                const miNodoPrecio = document.createElement('p');
                miNodoPrecio.classList.add('card-text');
                miNodoPrecio.textContent = `${info.precio}$`;
                //Stock
                const miNodoStock = document.createElement('p');
                miNodoStock.classList.add('card-text');
                miNodoStock.textContent = `${info.stock}`;
                // Boton 
                const miNodoBoton = document.createElement('button');
                miNodoBoton.classList.add('btn', 'btn-primary');
                miNodoBoton.textContent = 'Comprar';
                miNodoBoton.setAttribute('marcador', info.id);
                // LE DAMOS EL ATRIBUTO
                miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
                // Insertamos
                miNodoCardBody.appendChild(miNodoTitle);
                miNodoCardBody.appendChild(miNodoPrecio);
                miNodoCardBody.appendChild(miNodoStock);
                miNodoCardBody.appendChild(miNodoBoton);
                miNodo.appendChild(miNodoCardBody);
                DOMitems.appendChild(miNodo);
            });
        }
    
        /**
        * Evento para añadir un producto al carrito de la compra
        */
        function anyadirProductoAlCarrito(e) {
            // Anyadimos el Nodo a nuestro carrito
            carrito.push(e.target.getAttribute('marcador'))
            // GET ATRIBUTE TRAEMOS EL VALOR QUE PASAMOS POR PARAMETRO
            // Actualizamos el carrito 
            renderizarCarrito();
            // Actualizamos el LocalStorage
            guardarCarritoEnLocalStorage();
        }
    
        /**
        * Dibuja todos los productos guardados en el carrito
        */
        function renderizarCarrito() {
            // Vaciamos todo el html
            DOMcarrito.textContent = '';
            // Quitamos los duplicados
            console.log(carrito)
            const carritoSinDuplicados = [...new Set(carrito)]; 
            //console.log(carritoSinDuplicados)
            // Generamos los Nodos a partir de carrito
            carritoSinDuplicados.forEach((item) => {
                // Obtenemos el item que necesitamos de la variable base de datos
                const miItem = listaDeProductos.filter((itemBaseDatos) => {
                    // ¿Coincide las id? Solo puede existir un caso
                    return itemBaseDatos.id === parseInt(item);
                });
                // Cuenta el número de veces que se repite el producto
                const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                    // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                    return itemId === item ? total += 1 : total;
                }, 0);
                // Creamos el nodo del item del carrito
                const miNodo = document.createElement('li');
                miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
                miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
                // Boton de borrar
                const miBoton = document.createElement('button');
                miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                miBoton.textContent = 'Cancelar';
                miBoton.style.marginLeft = '1rem';
                miBoton.dataset.item = item;
                miBoton.addEventListener('click', borrarItemCarrito);
                // Mezclamos nodos
                miNodo.appendChild(miBoton);
                DOMcarrito.appendChild(miNodo);
            });
            // Renderizamos el precio total en el HTML
            DOMtotal.textContent = calcularTotal();
        }
    
        /**
        * Evento para borrar un elemento del carrito
        */
        function borrarItemCarrito(e) {
            // Obtenemos el producto ID que hay en el boton pulsado
            const id = e.target.dataset.item;
            // Borramos todos los productos
            carrito = carrito.filter((carritoId) => {
                return carritoId !== id;
            });
            // volvemos a renderizar
            renderizarCarrito();
            // Actualizamos el LocalStorage
            guardarCarritoEnLocalStorage();
    
        }
    
        /**
         * Calcula el precio total teniendo en cuenta los productos repetidos
         */
        function calcularTotal() {
            // Recorremos el array del carrito 
            [1,1,1,3,4]
            return carrito.reduce((total, item) => {
                // De cada elemento obtenemos su precio
                const miItem = listaDeProductos.filter((itemBaseDatos) => {
                    return itemBaseDatos.id === parseInt(item);
                });
                // Los sumamos al total
                return total + miItem[0].precio;
            }, 0).toFixed(2);
        // lE DA CANTIDAD DE DECIMALES EL TOFIX EN EL PRECIO FINAL... NADA ES PARA QUE QUEDE CON LOS CENTAVOS DEL VALOR
        }
    
        /**
        * Varia el carrito y vuelve a dibujarlo
        */
        function vaciarCarrito() {
            // Limpiamos los productos guardados
            carrito = [];
            // Renderizamos los cambios
            renderizarCarrito();
            // Borra LocalStorage
            localStorage.clear();
    
        }
    
        function guardarCarritoEnLocalStorage () {
            miLocalStorage.setItem('carrito', JSON.stringify(carrito));
        }
    
        function cargarCarritoDeLocalStorage () {
            // ¿Existe un carrito previo guardado en LocalStorage?
            if (miLocalStorage.getItem('carrito') !== null) {
                // Carga la información
                carrito = JSON.parse(miLocalStorage.getItem('carrito'));
            }
        }
    
        // Eventos
        DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    
        // Inicio
        cargarCarritoDeLocalStorage();
        renderizarProductos();
        renderizarCarrito();
    }); 