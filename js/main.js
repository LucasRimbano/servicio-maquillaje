document.addEventListener("DOMContentLoaded", () => {
  if (typeof fullpage === "undefined") {
    console.error("❌ fullpage NO cargó");
    return;
  }

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 900,
      once: false,
      disable: false
    });
  }

  new fullpage("#fullpage", {
    autoScrolling: true,
    scrollBar: false,       // ✅ clave
    scrollOverflow: true,   // ✅ si servicios es más alto que 100vh
    responsiveWidth: 768,   // ✅ mobile = scroll normal (AOS funciona mejor)
    navigation: true,
    slidesNavigation: true,
    controlArrows: true,
    fixedElements: ".navbar",
    anchors: ["inicio", "galeria", "servicios"],

    afterLoad: function(origin, destination) {
      // 1) refrescar mediciones
      if (typeof AOS !== "undefined") AOS.refreshHard();

      // 2) forzar animación al entrar
      destination.item.querySelectorAll("[data-aos]").forEach(el => {
        el.classList.add("aos-animate");
      });
    },

    onLeave: function(origin, destination) {
      // reset para reanimar
      origin.item.querySelectorAll("[data-aos]").forEach(el => {
        el.classList.remove("aos-animate");
      });
    }
  });

  setTimeout(() => {
    if (typeof AOS !== "undefined") AOS.refreshHard();
  }, 300);
});
