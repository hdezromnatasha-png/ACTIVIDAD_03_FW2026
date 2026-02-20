const inst = Vue.createApp({
    // se ejecuta cuando Vue inicia
    created() {
        // carga planetas desde la API
        this.cargarPlanetas();
        // inicializa lista filtrada
        this.planetasFiltrados = this.planetas;
    },
    data() {
        return {
            planetas: [],
            planetasFiltrados: [],
            // null = ninguno seleccionado
            planetaSeleccionado: null,
            // cantidad total planetas, usado para progress bar
            totalAPI: 60
        }
    },
    methods: {
        // función que carga API
        cargarPlanetas() {
            let url = "https://swapi.dev/api/planets/";
            // vacía el arreglo planetas, para evitar que se dupliquen cuando se ejecute
            this.planetas = [];
            // se crea una función llamada "cargar"
            // recibe un parámetro llamado "direccion"
            // "direccion" es la URL de la página actual de la API que se va a consultar
            const cargar = (direccion) => {
                // axios.get hace una petición a internet a la URL que está en "direccion"
                // es decir, va a la API de Star Wars y pide los planetas
                axios.get(direccion).then(respuesta => {
                    // respuesta.data.results contiene un arreglo con los planetas de ESA página
                    // ejemplo: página 1 tiene 10 planetas, página 2 tiene otros 10, etc.

                    // concat une los planetas nuevos con los que ya estaban guardados
                    // this.planetas es el arreglo donde se guardan TODOS los planetas
                    // ejemplo:
                    // antes: this.planetas = [10 planetas]
                    // results = [otros 10 planetas]
                    // después: this.planetas = [20 planetas]
                    this.planetas = this.planetas.concat(respuesta.data.results);
                    // respuesta.data.next contiene la URL de la siguiente página
                    // ejemplo:
                    // page 1 → next = page 2
                    // page 2 → next = page 3
                    // page 6 → next = null

                    // aquí se verifica si existe otra página
                    if (respuesta.data.next) {
                        // si existe otra página, se vuelve a llamar la función "cargar"
                        // pero ahora con la URL de la siguiente página
                        // esto permite cargar automáticamente TODOS los planetas
                        cargar(respuesta.data.next);
                    }
                    else {
                        // si next es null, significa que ya NO hay más páginas
                        // entonces aquí ya tenemos los 60 planetas completos

                        // se copian los planetas al arreglo que usa la interfaz
                        // este arreglo es el que se muestra en pantalla
                        this.planetasFiltrados = this.planetas;
                    }
                });
            };
            // aquí se llama la función por primera vez
            // "url" contiene: https://swapi.dev/api/planets/
            // esto inicia todo el proceso de carga
            cargar(url);
        },
        filtrarClima(clima) {
            if (clima == "Todos") {
                this.planetasFiltrados = this.planetas;
            }
            else {
                this.planetasFiltrados =
                    this.planetas.filter(planeta => planeta.climate.includes(clima));
            }
        },
        mostrarDetalles(planeta) {
            this.planetaSeleccionado = planeta;
        },
        cerrarModal() {
            this.planetaSeleccionado = null;
        },
        eliminar(index) {
            this.planetasFiltrados.splice(index, 1);
        }
    },
    computed: {
        porcentaje() {
            // redondea el porcentaje
            return Math.round(
                (this.planetasFiltrados.length / this.totalAPI) * 100);
        }
    }
});
const app = inst.mount("#contenedor");