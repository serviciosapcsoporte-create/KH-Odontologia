/* Loader de Cristal para KH Odontología Estética — define config y carga el motor */
(function () {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "chat/cristal.css";
  document.head.appendChild(link);

  window.CRISTAL_CONFIG = {
    site: "khodontologia",
    brand: "KH Odontología Estética",
    waUrl: "https://wa.me/573125759211",
    formUrl: "https://api.web3forms.com/submit",
    policyUrl: "#",
    pains: [
      { label: "Odontología General", step: "pain_general" },
      { label: "Cosmética Dental", step: "pain_cosmetica" },
      { label: "Rehabilitación Oral", step: "pain_rehabilitacion" },
      { label: "Ortodoncia", step: "pain_ortodoncia" },
      { label: "Endodoncia", step: "pain_endodoncia" },
      { label: "Cirugía Oral", step: "pain_cirugia" },
      { label: "Otro", step: "pain_otro" },
    ],
    servicesByPain: {
      general: "<strong>Odontología General:</strong> limpiezas, diagnósticos, controles periódicos y tratamientos básicos para mantener tus dientes y encías sanos en Barrio La Alquería.",
      cosmetica: "<strong>Cosmética Dental:</strong> blanqueamiento, carillas de porcelana y diseño de sonrisa. Realzamos la belleza natural de tus dientes con resultados increíbles.",
      rehabilitacion: "<strong>Rehabilitación Oral:</strong> prótesis, coronas e implantes dentales. Devolvemos la salud, la comodidad y la seguridad al momento de sonreír.",
      ortodoncia: "<strong>Ortodoncia:</strong> brackets tradicionales, estéticos o alineadores invisibles. Corregimos la posición de los dientes y la mordida.",
      endodoncia: "<strong>Endodoncia:</strong> tratamiento de conducto moderno para conservar tus dientes. Eliminamos la infección y devolvemos la salud.",
      cirugia: "<strong>Cirugía Oral:</strong> extracción de terceros molares, implantes dentales y cirugías correctivas con precisión y seguridad.",
      otro: "Somos una clínica odontológica integral en Barrio La Alquería, Bogotá. Atendemos odontología general, estética, rehabilitación, ortodoncia y más.",
    },
    fallbackService: "Somos una clínica odontológica integral en Barrio La Alquería, Bogotá. Atendemos odontología general, estética, rehabilitación, ortodoncia y más. Cotiza tu valoración.",
  };

  var s = document.createElement("script");
  s.src = "chat/cristal.js";
  document.body.appendChild(s);
})();
