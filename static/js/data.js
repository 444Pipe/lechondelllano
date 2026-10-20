/* =====================================================================
   Lechón del Llano — CONFIGURACIÓN DEL NEGOCIO
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que debes editar para cambiar el número de
   WhatsApp, horario, tamaños de lechona y testimonios.
   (Los precios se editan directamente en el menú de index.html).
   ===================================================================== */

window.LDL_CONFIG = {
  nombre: "Lechón del Llano",

  // Número de WhatsApp en formato internacional SIN "+" ni espacios.
  // Ejemplo Colombia: "573001234567"
  whatsapp: "573138347857",

  // Cómo se muestra el número en la página.
  telefonoVisible: "313 834 7857",

  // Dirección del punto de venta en Restrepo (reemplazar por la real).
  direccion: "Restrepo, Meta — Colombia",

  // Horario de atención en los días de venta (formato 24h "HH:MM").
  horario: {
    apertura: "11:00",
    cierre: "16:00",
    texto: "11:00 a. m. – 4:00 p. m. (o hasta agotar)"
  },

  // Días de venta: sábado (6), domingo (0) y lunes festivo (1 + festivo).
  diasVenta: [6, 0],
  lunesFestivo: true,

  // Municipios donde se entrega.
  ciudades: ["Restrepo", "Cumaral", "Villavicencio"],

  // Redes sociales (dejar "" para ocultar el ícono).
  redes: {
    facebook: "",
    instagram: "https://www.instagram.com/lechondelllano/",
    tiktok: ""
  },

  // Tamaños usados por la CALCULADORA (edita rangos y nombres a tu gusto).
  // "min" y "max" son número de personas que alcanza cada opción.
  // "icono" es el id del sprite SVG de las páginas: plato, cerdo, fiesta, brillo, trofeo o torta.
  tamanos: [
    { id: "porciones", nombre: "Porciones individuales", min: 1, max: 9, tipo: "Porciones", icono: "plato", detalle: "Porción de lechona con sus acompañamientos. Ideal para almorzar en Restrepo o pedir a domicilio." },
    { id: "cojin-p", nombre: "Cojín pequeño", min: 10, max: 15, tipo: "Cojín", icono: "cerdo", detalle: "El cojín rinde para una reunión pequeña: familia, amigos o un almuerzo de oficina." },
    { id: "cojin-m", nombre: "Cojín mediano", min: 16, max: 22, tipo: "Cojín", icono: "cerdo", detalle: "Perfecto para cumpleaños y reuniones medianas sin desperdicio." },
    { id: "cojin-g", nombre: "Cojín grande", min: 23, max: 30, tipo: "Cojín", icono: "cerdo", detalle: "El cojín más grande: rinde para hasta 30 personas con acompañamientos." },
    { id: "l50", nombre: "Lechona de 50 personas", min: 31, max: 50, tipo: "Lechona entera", icono: "fiesta", detalle: "Lechona entera pequeña, perfecta para fiestas familiares." },
    { id: "l80", nombre: "Lechona de 80 personas", min: 51, max: 80, tipo: "Lechona entera", icono: "fiesta", detalle: "Lechona entera para eventos medianos: grados, bautizos, primeras comuniones." },
    { id: "l100", nombre: "Lechona de 100 personas", min: 81, max: 100, tipo: "Lechona entera", icono: "brillo", detalle: "La más pedida para matrimonios, quince años y eventos empresariales." },
    { id: "l150", nombre: "Lechona de 150 personas", min: 101, max: 150, tipo: "Lechona entera", icono: "brillo", detalle: "Lechona grande para eventos con mucha gente. Reserva con anticipación." },
    { id: "l200", nombre: "Lechona de 200 personas", min: 151, max: 200, tipo: "Lechona entera", icono: "trofeo", detalle: "Nuestra lechona más grande. Incluye ayudante para servir en tu evento." }
  ],

  // Testimonios que rotan en la página.
  // IMPORTANTE: reemplázalos por reseñas REALES de tus clientes antes de publicar.
  testimonios: [
    {
      texto: "Pedimos la lechona de 100 para el grado de mi hija en Villavicencio y llegó a tiempo, calientica y con el ayudante sirviendo los platos. ¡Todo el mundo repitió!",
      nombre: "Cliente de Villavicencio",
      detalle: "Lechona para evento · 100 personas"
    },
    {
      texto: "Todos los domingos vamos por nuestra porción a Restrepo. La piel crocante y el arroz con la carne bien sazonada: no hay otra igual en el Llano.",
      nombre: "Cliente de Restrepo",
      detalle: "Porciones · Domingos"
    },
    {
      texto: "El cojín nos sirvió perfecto para la reunión familiar en Cumaral. Lo trajeron hasta la casa y rindió para todos. Súper recomendados.",
      nombre: "Cliente de Cumaral",
      detalle: "Cojín de lechona · Domicilio"
    }
  ]
};
