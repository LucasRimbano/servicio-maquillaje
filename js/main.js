document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // Helpers / refs
  // ============================
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const btnTop = document.getElementById("btnTop");
  const offcanvasEl = document.getElementById("offcanvasDarkNavbar");
  const offcanvas = offcanvasEl ? bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl) : null;

  // ============================
  // Popovers (click)
  // ============================
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => {
    new bootstrap.Popover(el, { trigger: "click" });
  });

  // ============================
  // AOS
  // ============================
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 900, once: false, disable: false });
  }

  // ============================
  // fullPage
  // ============================
  if (typeof fullpage === "undefined") {
    console.error("❌ fullpage NO cargó");
  } else {
    new fullpage("#fullpage", {
      autoScrolling: true,
      scrollBar: false,
      scrollOverflow: !isMobile,
      responsiveWidth: 768,
      navigation: true,

      fixedElements: ".navbar",
      // (ya no hay modal/form, pero lo dejo igual por compatibilidad)
      normalScrollElements: "[data-bs-toggle='popover'], .popover",
      paddingTop: "70px",

      anchors: ["inicio", "servicios", "reservar", "preguntas"],

      afterLoad: function (origin, destination) {
        if (typeof AOS !== "undefined") AOS.refreshHard();
        destination.item
          .querySelectorAll("[data-aos]")
          .forEach(el => el.classList.add("aos-animate"));
      },

      onLeave: function (origin, destination) {
        // cerrar popovers al salir
        document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => {
          const instance = bootstrap.Popover.getInstance(el);
          if (instance) instance.hide();
        });

        // reset AOS
        origin.item
          .querySelectorAll("[data-aos]")
          .forEach(el => el.classList.remove("aos-animate"));

        // botón top
        if (btnTop) {
          if (destination.index > 0) btnTop.classList.add("show");
          else btnTop.classList.remove("show");
        }
      }
    });
  }

  // ============================
  // Cerrar offcanvas al tocar links
  // ============================
  document.querySelectorAll(".js-nav").forEach(link => {
    link.addEventListener("click", () => {
      if (offcanvas) offcanvas.hide();
    });
  });

  // ============================
  // Botón subir arriba
  // ============================
  if (btnTop) {
    btnTop.addEventListener("click", () => {
      if (typeof fullpage_api !== "undefined") fullpage_api.moveTo("inicio");
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  setTimeout(() => {
    if (typeof AOS !== "undefined") AOS.refreshHard();
  }, 300);

  // ============================
  // ✅ RESERVA CLÁSICA (PROMPT + localStorage + consola + WhatsApp)
  // ============================
  class Cliente {
    static id = 0;

    constructor(nombre, evento, fecha, telefono) {
      this.id = ++Cliente.id;
      this.nombre = nombre;
      this.evento = evento;
      this.fecha = fecha;
      this.telefono = telefono;
    }

    descripcion() {
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

  const btnReserva = document.getElementById("btnReserva");
  if (!btnReserva) {
    console.warn("⚠️ No existe #btnReserva en el HTML");
    return;
  }

  btnReserva.addEventListener("click", () => {
    const nombre = prompt("Tu nombre:");
    if (!nombre) return;

    const evento = prompt("Tipo de evento (boda, 15, cumple, producción):");
    if (!evento) return;

    const fecha = prompt("Fecha (dd/mm/aaaa):");
    if (!fecha) return;

    const telefono = prompt("Tu teléfono / WhatsApp:");
    if (!telefono) return;

    const cliente = new Cliente(nombre.trim(), evento.trim(), fecha.trim(), telefono.trim());

    // guardar
    reservas.push(cliente);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    // mostrar en consola
    console.log("📌 Reserva guardada:", cliente);
    console.log("📦 Total reservas:", reservas);

    alert("✅ Reserva guardada. Te llevo a WhatsApp.");

    // WhatsApp
    const telefonoDestino = "54911XXXXXXXX"; // <-- CAMBIAR por el real
    const mensaje = encodeURIComponent(cliente.descripcion());
    window.open(`https://wa.me/${telefonoDestino}?text=${mensaje}`, "_blank");
  });
});
