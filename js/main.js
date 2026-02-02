document.addEventListener("DOMContentLoaded", () => {

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

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
    anchors: ["inicio", "galeria", "servicios"],

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
    }
  });

  setTimeout(() => {
    if (typeof AOS !== "undefined") AOS.refreshHard();
  }, 300);

});
