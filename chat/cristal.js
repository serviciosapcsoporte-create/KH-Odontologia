/*!
 * Cristal — Asistente de ventas conversacional (scriptado, sin LLM)
 * Configuración para KH Odontología Estética. Lee window.CRISTAL_CONFIG.
 */
(function () {
  "use strict";

  var C = window.CRISTAL_CONFIG;
  if (!C) { return; }

  // ---- Estado de la conversación ----
  var state = {
    step: "intro",
    name: "",
    phone: "",
    email: "",
    pain: "",
    hot: false,
  };

  var messages = [];

  // ---- Utilidades ----
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function pushMsg(who, html, typing) {
    return new Promise(function (resolve) {
      var wrap = el("div", "cr-msg " + (who === "bot" ? "cr-bot" : "cr-user"));
      if (typing) {
        wrap.innerHTML = '<div class="cr-typing"><span></span><span></span><span></span></div>';
      } else {
        wrap.innerHTML = '<div class="cr-bubble">' + html + "</div>";
      }
      chatLog.appendChild(wrap);
      scrollDown();
      if (typing) {
        setTimeout(function () {
          wrap.innerHTML = '<div class="cr-bubble">' + html + "</div>";
          scrollDown();
          resolve();
        }, 650 + Math.random() * 500);
      } else {
        resolve();
      }
    });
  }

  function scrollDown() {
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function showQuick(opts) {
    quickBar.innerHTML = "";
    opts.forEach(function (o) {
      var b = el("button", "cr-quick", o.label);
      b.onclick = function () { handle(o.value); };
      quickBar.appendChild(b);
    });
  }

  function clearQuick() { quickBar.innerHTML = ""; }

  // ---- Lógica de flujo ----
  function handle(value) {
    if (value && value.step) {
      return goStep(value.step, value.data);
    }
    return classify(value);
  }

  function isAffirm(text) {
    var t = (text || "").toLowerCase();
    return /(si|sí|dale|vale|bueno|ok|esta bien|hagamos|activ|cotiz|quiero|adelante|proced|apart|envi|dejame|me interesa|hablemos|hablar|whatsapp|wa|contact|empez|contrat|compr|agend|cita|valor)/.test(t);
  }

  function isTalkIntent(text) {
    var t = (text || "").toLowerCase();
    return /(whatsapp|habla|hablemos|asesor|persona|llam|contacto|telefono|celular|doctor|dra|cita)/.test(t);
  }

  function classify(text) {
    var t = (text || "").toLowerCase();

    if (state.step === "offer" || state.step === "close") {
      if (isTalkIntent(t)) return goStep("wa");
      if (isAffirm(t)) return goStep("capture");
      return goStep("close");
    }

    if (isTalkIntent(t)) return goStep("wa");

    var pain = "otro";
    if (/(general|limpieza|diagnostico|control|chequeo|revision|encias|dolor|muel)/.test(t)) pain = "general";
    else if (/(cosmetica|blanqueam|carilla|sonrisa|bonit|estetic|diseño)/.test(t)) pain = "cosmetica";
    else if (/(rehabilit|protesis|corona|implant|falta diente)/.test(t)) pain = "rehabilitacion";
    else if (/(ortodonc|bracket|alineador|invisible|ortod|dientes torc)/.test(t)) pain = "ortodoncia";
    else if (/(endodonc|conducto|nervio|pulpa)/.test(t)) pain = "endodoncia";
    else if (/(cirug|extracc|cordal|muela juici|sabi)/.test(t)) pain = "cirugia";
    state.pain = pain;

    if (pain === "otro" && isAffirm(t)) return goStep("offer", { pain: state.pain || "otro" });

    return goStep("pain_" + pain);
  }

  function goStep(step, data) {
    state.step = step;
    if (data) Object.assign(state, data);

    switch (step) {
      case "intro":
        return startIntro();
      case "menu":
        return showMenu();
      case "pain_general":
        return painGeneral();
      case "pain_cosmetica":
        return painCosmetica();
      case "pain_rehabilitacion":
        return painRehabilitacion();
      case "pain_ortodoncia":
        return painOrtodoncia();
      case "pain_endodoncia":
        return painEndodoncia();
      case "pain_cirugia":
        return painCirugia();
      case "pain_otro":
        return painOtro();
      case "offer":
        return offer();
      case "close":
        return closeAsk();
      case "capture":
        return askData();
      case "wa":
        return goWA();
      default:
        return showMenu();
    }
  }

  function startIntro() {
    clearQuick();
    pushMsg("bot", "Hola, soy <strong>Cristal</strong> de " + C.brand + ". Estoy aquí porque veo que nos visitas y <strong>algo te trajo</strong>. ¿Buscas resolver algo hoy o solo estás mirando?")
      .then(function () {
        showQuick([
          { label: "Tengo un problema", step: "menu" },
          { label: "Solo estoy mirando", step: "close" },
          { label: "Quiero cotizar", step: "menu" },
        ]);
      });
  }

  function showMenu() {
    clearQuick();
    pushMsg("bot", "Cuéntame, ¿qué necesitas para tu sonrisa? Elige lo que más te interesa:")
      .then(function () {
        showQuick(C.pains);
      });
  }

  function painGeneral() {
    clearQuick();
    pushMsg("bot", "La <strong>odontología general</strong> es la base de tu salud bucal. Limpias, diagnósticos y controles para mantener tus dientes y encías sanos.")
      .then(function () {
        pushMsg("bot", "En " + C.brand + " te atendemos en Barrio La Alquería, Bogotá. ¿Te gustaría agendar una valoración general?");
      })
      .then(function () {
        showQuick([
          { label: "Quiero agendar", step: "capture", data: { pain: "general" } },
          { label: "Cuánto cuesta", step: "offer", data: { pain: "general" } },
          { label: "Hablar por WA", step: "wa" },
        ]);
      });
  }

  function painCosmetica() {
    clearQuick();
    pushMsg("bot", "Quieres una <strong>sonrisa más bonita</strong>. Blanqueamiento, carillas de porcelana y diseño de sonrisa con resultados increíbles.")
      .then(function () {
        pushMsg("bot", "Tu sonrisa es tu carta de presentación. La competencia ya está invirtiendo en su imagen. ¿Quieres que te muestre opciones?");
      })
      .then(function () {
        showQuick([
          { label: "Quiero sonreír", step: "capture", data: { pain: "cosmetica" } },
          { label: "Ver opciones", step: "offer", data: { pain: "cosmetica" } },
          { label: "Hablar por WA", step: "wa" },
        ]);
      });
  }

  function painRehabilitacion() {
    clearQuick();
    pushMsg("bot", "<strong>Rehabilitación Oral:</strong> prótesis, coronas e implantes dentales. Devolvemos la salud, la comodidad y la seguridad al momento de sonreír, hablar y masticar.")
      .then(function () {
        pushMsg("bot", "Cada día sin rehabilitar es un día con menos comodidad. ¿Aparto tu valoración esta semana?");
      })
      .then(function () {
        showQuick([
          { label: "Aparta mi valoración", step: "capture", data: { pain: "rehabilitacion" } },
          { label: "Ver beneficios", step: "offer", data: { pain: "rehabilitacion" } },
          { label: "Hablar por WA", step: "wa" },
        ]);
      });
  }

  function painOrtodoncia() {
    clearQuick();
    pushMsg("bot", "<strong>Ortodoncia:</strong> brackets tradicionales, estéticos o alineadores invisibles. Corregimos la posición de los dientes y la mordida para una sonrisa funcional.")
      .then(function () {
        pushMsg("bot", "Mientras decides, tus dientes siguen desalineados. ¿Lo dejamos para después?");
      })
      .then(function () {
        showQuick([
          { label: "Quiero alinear", step: "capture", data: { pain: "ortodoncia" } },
          { label: "Cómo funciona", step: "offer", data: { pain: "ortodoncia" } },
          { label: "Hablar por WA", step: "wa" },
        ]);
      });
  }

  function painEndodoncia() {
    clearQuick();
    pushMsg("bot", "<strong>Endodoncia:</strong> tratamiento de conducto moderno para conservar tus dientes. Eliminamos la infección y devolvemos la salud a tu pieza dental.")
      .then(function () {
        pushMsg("bot", "El dolor de muela no se va solo. Si lo dejas, empeora. ¿Agendamos tu valoración?");
      })
      .then(function () {
        showQuick([
          { label: "Quiero valoración", step: "capture", data: { pain: "endodoncia" } },
          { label: "Cuánto cuesta", step: "offer", data: { pain: "endodoncia" } },
          { label: "Hablar por WA", step: "wa" },
        ]);
      });
  }

  function painCirugia() {
    clearQuick();
    pushMsg("bot", "<strong>Cirugía Oral:</strong> extracción de terceros molares, implantes dentales y cirugías correctivas con precisión y seguridad. El mayor confort posible.")
      .then(function () {
        pushMsg("bot", "La cirugía oral requiere experiencia y tecnología. En " + C.brand + " tienes el equipo y las condiciones. ¿Aparto tu cita?");
      })
      .then(function () {
        showQuick([
          { label: "Apartar cita", step: "capture", data: { pain: "cirugia" } },
          { label: "Ver procedimientos", step: "offer", data: { pain: "cirugia" } },
          { label: "Hablar por WA", step: "wa" },
        ]);
      });
  }

  function painOtro() {
    clearQuick();
    pushMsg("bot", "Cuéntame con tus palabras ¿qué necesitas? Odontología general, estética, rehabilitación, ortodoncia, endodoncia, cirugía o algo diferente. Yo te digo si lo resolvemos.")
      .then(function () {
        showQuick(C.pains);
      });
  }

  function offer() {
    clearQuick();
    var p = state.pain || "otro";
    var svc = (C.servicesByPain && C.servicesByPain[p]) || C.fallbackService;
    pushMsg("bot", "Esto es lo que encaja contigo:")
      .then(function () {
        pushMsg("bot", svc);
      })
      .then(function () {
        pushMsg("bot", "La agenda de esta semana se está llenando. Si dejamos ir esta oportunidad, la toma quien sí decidió. ¿Avanzamos?");
      })
      .then(function () {
        showQuick([
          { label: "Sí, avancemos", step: "capture" },
          { label: "Quiero hablar con alguien", step: "wa" },
          { label: "Déjame pensarlo", step: "close" },
        ]);
      });
  }

  function closeAsk() {
    clearQuick();
    pushMsg("bot", "Entiendo. Pero seamos claros: mientras lo piensas, tu salud bucal no espera. Cuando decidas, el espacio puede no estar.")
      .then(function () {
        pushMsg("bot", "Te dejo abierto por si cambias de idea. ¿Quieres que te avise cuando haya un cupo libre?");
      })
      .then(function () {
        showQuick([
          { label: "Avísame y tomo datos", step: "capture" },
          { label: "Mejor háblale a alguien", step: "wa" },
          { label: "Gracias, después", step: "end" },
        ]);
      });
  }

  function askData() {
    clearQuick();
    pushMsg("bot", "Déjame tus datos y un asesor de " + C.brand + " te contacta en menos de 24h. <strong>Tus datos los tratamos bajo la Ley 1581</strong>.")
      .then(function () {
        renderCaptureForm();
      });
  }

  function renderCaptureForm() {
    var form = el("div", "cr-form");
    form.innerHTML =
      '<input class="cr-input" id="cr_name" placeholder="Tu nombre">' +
      '<input class="cr-input" id="cr_phone" placeholder="WhatsApp / teléfono">' +
      '<input class="cr-input" id="cr_email" placeholder="Correo (opcional)">' +
      '<button class="cr-send" id="cr_send">Enviar y apartar cupo</button>';
    chatLog.appendChild(form);
    scrollDown();
    document.getElementById("cr_send").onclick = function () {
      var name = document.getElementById("cr_name").value.trim();
      var phone = document.getElementById("cr_phone").value.trim();
      if (!name || !phone) {
        pushMsg("bot", "Necesito al menos tu nombre y un WhatsApp para apartar el cupo. ¿Me los das?");
        return;
      }
      state.name = name; state.phone = phone;
      state.email = document.getElementById("cr_email").value.trim();
      sendLead();
    };
  }

  function sendLead() {
    var payload = {
      name: state.name,
      phone: state.phone,
      email: state.email,
      pain: state.pain,
      source: "cristal_" + (C.site || "web"),
      brand: C.brand,
    };
    pushMsg("bot", "Recibiendo tus datos" + (state.name ? ", " + state.name : "") + "…").then(function () {
      fetch(C.formUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function () { successLead(); })
        .catch(function () { successLead(); });
    });
  }

  function successLead() {
    clearQuick();
    pushMsg("bot", "¡Listo! Cupo en proceso. Un asesor de " + C.brand + " te escribe en menos de 24h. Mientras tanto, si tienes prisa, háblale directo por WhatsApp.")
      .then(function () {
        showQuick([
          { label: "Escribir por WhatsApp", step: "wa" },
          { label: "Cerrar", step: "end" },
        ]);
      });
  }

  function goWA() {
    clearQuick();
    var txt = encodeURIComponent("Hola " + C.brand + ", escribo desde khodontologia.com. " + (state.pain ? "Mi interés: " + state.pain + ". " : "") + (state.name ? "Soy " + state.name + "." : ""));
    window.open(C.waUrl + "?text=" + txt, "_blank", "noopener");
    pushMsg("bot", "Te abrí WhatsApp con " + C.brand + ". Si no puedes ahora, déjame tus datos y te escribimos nosotros.");
    showQuick([
      { label: "Dejar mis datos", step: "capture" },
      { label: "Cerrar", step: "end" },
    ]);
  }

  // ---- Montaje del DOM ----
  var mount = document.getElementById(C.mountId || "cristal-mount");
  if (!mount) {
    mount = el("div");
    mount.id = "cristal-mount";
    document.body.appendChild(mount);
  }
  mount.innerHTML =
    '<div class="cr-launcher" id="cr-launcher" aria-label="Abrir asistente Cristal">' +
      '<span class="cr-avatar">C</span>' +
      '<span class="cr-launcher-dot"></span>' +
    '</div>' +
    '<div class="cr-panel" id="cr-panel" aria-hidden="true">' +
      '<div class="cr-header">' +
        '<div class="cr-header-info"><span class="cr-avatar sm">C</span>' +
          '<div><div class="cr-name">Cristal</div><div class="cr-role">' + C.brand + ' · Asesora virtual</div></div></div>' +
        '<button class="cr-close" id="cr-close" aria-label="Cerrar">×</button>' +
      '</div>' +
      '<div class="cr-log" id="cr-log"></div>' +
      '<div class="cr-quick" id="cr-quick"></div>' +
      '<div class="cr-inputbar">' +
        '<input class="cr-text" id="cr-text" placeholder="Escribe tu respuesta…" autocomplete="off">' +
        '<button class="cr-sendbtn" id="cr-sendbtn" aria-label="Enviar">➤</button>' +
      '</div>' +
      '<div class="cr-foot"><a href="' + C.policyUrl + '" target="_blank" rel="noopener noreferrer">Tus datos · Ley 1581</a></div>' +
    '</div>';

  var launcher = mount.querySelector("#cr-launcher");
  var panel = mount.querySelector("#cr-panel");
  var chatLog = mount.querySelector("#cr-log");
  var quickBar = mount.querySelector("#cr-quick");
  var textInput = mount.querySelector("#cr-text");
  var sendBtn = mount.querySelector("#cr-sendbtn");

  function openPanel() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    launcher.classList.add("hidden");
    if (state.step === "intro" && chatLog.children.length === 0) {
      goStep("intro");
    }
    setTimeout(function () { textInput.focus(); }, 200);
  }
  function closePanel() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    launcher.classList.remove("hidden");
  }

  launcher.onclick = openPanel;
  mount.querySelector("#cr-close").onclick = closePanel;

  function userSend() {
    var v = textInput.value.trim();
    if (!v) return;
    textInput.value = "";
    var um = el("div", "cr-msg cr-user");
    um.innerHTML = '<div class="cr-bubble">' + v.replace(/</g, "&lt;") + "</div>";
    chatLog.appendChild(um);
    scrollDown();
    handle(v);
  }
  sendBtn.onclick = userSend;
  textInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") userSend();
  });

  // proactivo: abrir solo el launcher a los 8s
  setTimeout(function () {
    if (!panel.classList.contains("open")) launcher.classList.add("pulse");
    setTimeout(function () { launcher.classList.remove("pulse"); }, 4000);
  }, 8000);
})();
