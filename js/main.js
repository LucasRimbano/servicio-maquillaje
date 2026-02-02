document.addEventListener("DOMContentLoaded", () => {

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const btnTop = document.getElementById("btnTop");
  const offcanvasEl = document.getElementById("offcanvasDarkNavbar");
  const offcanvas = offcanvasEl ? bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl) : null;

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
 
    // Links normales (secciones por anchor)
  document.querySelectorAll(".js-nav").forEach(link => {
    link.addEventListener("click", () => {
      if (offcanvas) offcanvas.hide();
    });
  });

  // Links que van a un slide específico dentro de galería
  document.querySelectorAll(".js-slide").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const slide = Number(link.dataset.slide || 0);

      // ir a la sección galeria y luego al slide
      if (typeof fullpage_api !== "undefined") {
        fullpage_api.moveTo("galeria", slide);
      } else {
        // fallback: por si no está fullpage_api
        location.hash = "#galeria";
      }

      if (offcanvas) offcanvas.hide();
    });
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

function goToSection(anchor) {
  // Si fullPage está activo, navegar por API
  if (typeof fullpage_api !== "undefined" && fullpage_api && fullpage_api.moveTo) {
    try {
      fullpage_api.moveTo(anchor);
      return;
    } catch (e) {
      // cae al fallback
    }
  }

  // Fallback para mobile (cuando fullPage está desactivado por responsiveWidth)
  const section = document.querySelector(`.section.${anchor}`) || document.getElementById(anchor);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    // último fallback: hash
    location.hash = `#${anchor}`;
  }
}
