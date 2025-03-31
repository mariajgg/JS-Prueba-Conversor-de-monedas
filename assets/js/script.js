const total = document.querySelector("#resultado"); // Párrafo donde mostrar el resultado
const inputMoneda = document.querySelector("#cifra"); // Monto a convertir
const selecMoneda = document.querySelector("#moneda"); // Selector de Moneda a Convertir
const botonCalcular = document.querySelector("#calcular"); // Botón para Calcular
const identificador = document.querySelector("#identificador"); // Identificador para el gráfico

// Función para obtener datos de la API
const getApi = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    renderDom(data); // Llamar a renderDom con los datos obtenidos
  } catch (error) {
    console.error("Error:", error);
    total.innerHTML = "Error al cargar los datos.";
  }
};

// Función para procesar y mostrar los datos
const renderDom = (data) => {
  const valorDolar = Math.trunc(data.dolar.valor); // Valor del dólar (sin decimales)
  const valorEuro = Math.trunc(data.euro.valor); // Valor del euro (sin decimales)

  const monedaDif = selecMoneda.value; // Obtener el valor seleccionado en el <select>
  const montoIngresado = parseFloat(inputMoneda.value); // Obtener el monto desde el input

  // Verificar si el monto ingresado es válido
  if (isNaN(montoIngresado) || montoIngresado <= 0) {
    total.innerHTML = "Por favor, ingresa un monto válido.";
    return;
  }

  // Calcular conversiones
  const calcularDolar = montoIngresado / valorDolar; // Usar montoIngresado aquí
  const calcularEuro = montoIngresado / valorEuro; // Usar montoIngresado aquí

  // Formato de Moneda
  const formatoDolar = calcularDolar.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const formatoEuro = calcularEuro.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  });

  // Mostrar el resultado en el DOM según la moneda seleccionada
  if (monedaDif === "dolar") {
    identificador.innerHTML = `${data.dolar.codigo}`;
    total.innerHTML = `<p>Monto: ${formatoDolar} ${data.dolar.codigo}</p>`;
  } else if (monedaDif === "euro") {
    identificador.innerHTML = `${data.euro.codigo}`;
    total.innerHTML = `<p>Monto: ${formatoEuro} ${data.euro.codigo}</p>`;
  } else {
    total.innerHTML = `<p>Por favor selecciona una moneda válida.</p>`;
  }
};

// Función para manejar el evento de clic en el botón "Calcular"
const llamarApi = () => {
  // Llamar a la API
  getApi("https://mindicador.cl/api/");
};

// Escuchar el clic en el botón
botonCalcular.addEventListener("click", llamarApi);

const btn = document.getElementById("calcular");
const contenedor = document.querySelector(".container");

btn.addEventListener("click", () => {
  const input = document.querySelector("#moneda");
  const valorDolarApi = `https://mindicador.cl/api/${input.value}`;

  const ctx = document.getElementById("myChart");

  fetch(valorDolarApi)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.serie);
      const fechas = [];
      const valores = [];

      data.serie.forEach((element) => {
        // Convertir la fecha a un objeto Date
        const fechaObjeto = new Date(element.fecha);

        // Formatear la fecha
        const formato = new Intl.DateTimeFormat("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(fechaObjeto);

        fechas.push(formato); // Agregar la fecha formateada al arreglo
        valores.push(element.valor); // Agregar el valor al arreglo
      });

      // Crear el gráfico
      new Chart(ctx, {
        type: "line",
        data: {
          // Mostrar solo 10 fechas
          labels: fechas.slice(0, 10),
          datasets: [
            {
              label: "Valor",
              data: valores.slice(0, 10), // Mostrar solo 10 valores
              borderWidth: 1,
              borderColor: "blue",
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              suggestedMin: Math.min(...valores) - 50,
              suggestedMax: Math.max(...valores) + 50,
            },
          },
        },
      });
    })
    .catch((error) => {
      console.error("Error al obtener los datos de la API:", error);
    });
});
