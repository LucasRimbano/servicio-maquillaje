document.addEventListener("DOMContentLoaded", () => {

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const btnTop = document.getElementById("btnTop");

  // activar popovers
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  popoverTriggerList.forEach(el => new bootstrap.Popover(el, {
    trigger: "click"   // ✅ fuerza click aunque el HTML diga otra cosa
  }));

  if (typeof fullpage === "undefined") {
    console.error("❌ fullpage NO cargó");
    return;
  }

  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 900, once: false, disable: false });
  }

  new fullpage("#fullpage", {
    autoScrolling: true,
    scrollBar: false,
    scrollOverflow: !isMobile, // ✅ clave
    responsiveWidth: 768,
    navigation: true,
    slidesNavigation: true,
    controlArrows: true,
    fixedElements: ".navbar",
    normalScrollElements: '[data-bs-toggle="popover"], .popover',
    paddingTop: "70px",
    anchors: ["inicio", "servicios", "galeria", "preguntas"],

    afterLoad: function(origin, destination) {
      if (typeof AOS !== "undefined") AOS.refreshHard();
      
      destination.item.querySelectorAll("[data-aos]").forEach(el => el.classList.add("aos-animate"));
    },

    onLeave: function(origin, destination) {
      document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => {
        const instance = bootstrap.Popover.getInstance(el);
        if (instance) instance.hide();
      });
      origin.item.querySelectorAll("[data-aos]").forEach(el => el.classList.remove("aos-animate"));
      
       if(destination.index > 0){
        btnTop.classList.add("show");
      } else {
        btnTop.classList.remove("show");
      }
    
    }
  });
 
  // 🔥 subir arriba con fullPage (NO scrollTo)
  btnTop.addEventListener("click", () => {
    fullpage_api.moveTo(1);
  });

  setTimeout(() => {
    if (typeof AOS !== "undefined") AOS.refreshHard();
  }, 300);

  document.querySelectorAll(".js-goto-slide").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const slide = Number(btn.dataset.slide || 1);

    // sección 2 por anchor: "galeria"
    fullpage_api.moveTo("galeria", slide);
  });
});

});

class Cliente {

  static id = 0;

  constructor(nombre, evento, fecha, telefono){
    this.id = ++Cliente.id;
    this.nombre = nombre;
    this.evento = evento;
    this.fecha = fecha;
    this.telefono = telefono;
  }

  descripcion(){
  return `Hola Julieta 💄
    Quiero reservar maquillaje.

    👤 Nombre: ${this.nombre}
    💍 Evento: ${this.evento}
    📅 Fecha: ${this.fecha}
    📞 Teléfono: ${this.telefono}

    ¿Tenés disponibilidad para esa fecha?`;
  }

}

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];


const form = document.getElementById("formReserva");

form.addEventListener("submit", function(e){
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const evento = document.getElementById("evento").value;
  const fecha = document.getElementById("fecha").value;
  const telefono = document.getElementById("telefono").value;

  const cliente = new Cliente(nombre, evento, fecha, telefono);

  reservas.push(cliente);

  localStorage.setItem("reservas", JSON.stringify(reservas));

  // 👉 redirige a WhatsApp automáticamente
  const mensaje = encodeURIComponent(cliente.descripcion());
  window.open(`https://wa.me/54911XXXXXXXX?text=${mensaje}`);

  form.reset();

});
