/* =====================================================================
   Lechón del Llano — JavaScript principal
   - Sincroniza WhatsApp / teléfono desde data.js
   - Header, menú móvil, scrollspy, reveal, contadores
   - Festivos de Colombia (Ley Emiliani) → estado "hoy hay lechona"
   - Tabs del menú, calculadora de tamaño, armador de pedido
   - Galería con lightbox, testimonios, volver arriba
   ===================================================================== */
(function () {
  "use strict";

  const CFG = window.LDL_CONFIG || {};
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     1. WhatsApp y teléfono desde la configuración
     ------------------------------------------------------------------ */
  const WA_NUMBER = (CFG.whatsapp || "573000000000").replace(/\D/g, "");
  const waLink = (text) => "https://wa.me/" + WA_NUMBER + (text ? "?text=" + encodeURIComponent(text) : "");
  // Icono del sprite SVG incluido en cada página (<symbol id="i-...">).
  const svgIcon = (id, cls) => '<svg class="icon' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + id + '"></use></svg>';

  function syncContact() {
    $$("[data-wa]").forEach((a) => {
      const msg = a.getAttribute("data-wa") || "¡Hola Lechón del Llano! 🐷 Quiero hacer un pedido.";
      a.href = waLink(msg);
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-tel]").forEach((a) => {
      a.href = "tel:+" + WA_NUMBER;
      if (a.hasAttribute("data-tel-text")) a.textContent = CFG.telefonoVisible || a.textContent;
    });
    $$("[data-cfg]").forEach((el) => {
      const key = el.getAttribute("data-cfg");
      const val = key.split(".").reduce((o, k) => (o ? o[k] : undefined), CFG);
      if (typeof val === "string" && val) el.textContent = val;
    });
    // Redes sociales: ocultar si están vacías
    $$("[data-social]").forEach((a) => {
      const url = (CFG.redes || {})[a.getAttribute("data-social")];
      if (url) a.href = url; else a.style.display = "none";
    });
  }

  /* ------------------------------------------------------------------
     2. Header: sombra al hacer scroll, menú móvil, scrollspy
     ------------------------------------------------------------------ */
  function initHeader() {
    const header = $(".header");
    const toggle = $(".nav-toggle");
    const nav = $(".nav");
    const toTop = $(".to-top");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && nav) {
      const close = () => { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); };
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        nav.classList.toggle("is-open", !open);
      });
      nav.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    }

    if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    // Scrollspy
    const links = $$(".nav a[href^='#']");
    const sections = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
    if (sections.length && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
          }
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      sections.forEach((s) => io.observe(s));
    }
  }

  /* ------------------------------------------------------------------
     3. Reveal on scroll + contadores
     ------------------------------------------------------------------ */
  function initReveal() {
    const els = $$(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) || reduceMotion) { els.forEach((e) => e.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((e) => io.observe(e));
  }

  function initCounters() {
    const els = $$("[data-count]");
    if (!els.length) return;
    const run = (el) => {
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const prefix = el.getAttribute("data-prefix") || "";
      if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
      const dur = 1400; const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    els.forEach((e) => io.observe(e));
  }

  /* ------------------------------------------------------------------
     4. Festivos de Colombia (Ley 51 de 1983 / "Ley Emiliani")
     ------------------------------------------------------------------ */
  function easterSunday(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
      f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  const addDays = (d, n) => { const r = new Date(d.getFullYear(), d.getMonth(), d.getDate()); r.setDate(r.getDate() + n); return r; };
  const nextMonday = (d) => { const dow = d.getDay(); return dow === 1 ? d : addDays(d, (8 - dow) % 7); };
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const festivosCache = {};
  function festivosColombia(y) {
    if (festivosCache[y]) return festivosCache[y];
    const fijos = [[0, 1], [4, 1], [6, 20], [7, 7], [11, 8], [11, 25]].map(([m, d]) => new Date(y, m, d));
    const emiliani = [[0, 6], [2, 19], [5, 29], [7, 15], [9, 12], [10, 1], [10, 11]].map(([m, d]) => nextMonday(new Date(y, m, d)));
    const pascua = easterSunday(y);
    const movibles = [addDays(pascua, -3), addDays(pascua, -2), addDays(pascua, 43), addDays(pascua, 64), addDays(pascua, 71)];
    return (festivosCache[y] = [...fijos, ...emiliani, ...movibles]);
  }
  const esFestivo = (d) => festivosColombia(d.getFullYear()).some((f) => sameDay(f, d));
  const esDiaDeVenta = (d) => {
    const dias = CFG.diasVenta || [6, 0];
    if (dias.includes(d.getDay())) return true;
    return CFG.lunesFestivo !== false && d.getDay() === 1 && esFestivo(d);
  };
  function proximosDiasDeVenta(n, desde) {
    const out = []; let d = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate());
    for (let i = 0; i < 120 && out.length < n; i++) { if (esDiaDeVenta(d)) out.push(d); d = addDays(d, 1); }
    return out;
  }
  const fmtLargo = (d) => d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmtHora = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); const h12 = ((h + 11) % 12) + 1; return h12 + ":" + String(m).padStart(2, "0") + (h < 12 ? " a. m." : " p. m."); };

  function initDiasVenta() {
    const hoy = new Date();
    const status = $("[data-status]");
    const list = $("[data-dias]");
    const nextEl = $$("[data-proxima-venta]");
    const horario = CFG.horario || { apertura: "11:00", cierre: "16:00" };
    const proximos = proximosDiasDeVenta(6, hoy);
    const hoyVenta = esDiaDeVenta(hoy);
    const minAhora = hoy.getHours() * 60 + hoy.getMinutes();
    const siguiente = proximos.find((d) => !sameDay(d, hoy)) || proximos[0];

    if (status) {
      let txt, open = false;
      if (hoyVenta && minAhora >= toMin(horario.apertura) && minAhora < toMin(horario.cierre)) {
        txt = "¡Hoy hay lechona! Abierto hasta las " + fmtHora(horario.cierre); open = true;
      } else if (hoyVenta && minAhora < toMin(horario.apertura)) {
        txt = "¡Hoy hay lechona! Abrimos a las " + fmtHora(horario.apertura); open = true;
      } else if (hoyVenta) {
        txt = "Hoy ya cerramos · Próxima venta: " + fmtLargo(siguiente);
      } else {
        txt = "Próxima venta: " + fmtLargo(siguiente) + (siguiente.getDay() === 1 ? " (lunes festivo)" : "");
      }
      status.querySelector("[data-status-text]").textContent = txt;
      status.classList.toggle("is-open", open);
    }
    nextEl.forEach((el) => { el.textContent = cap(fmtLargo(siguiente)); });

    if (list) {
      list.innerHTML = proximos.map((d) => {
        const esHoy = sameDay(d, hoy);
        const festivo = d.getDay() === 1;
        return (
          '<div class="dia' + (esHoy ? " is-today" : "") + '" role="listitem">' +
          (festivo ? '<span class="dia__tag">Festivo</span>' : "") +
          '<div class="dia__weekday">' + (esHoy ? "Hoy" : d.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", "")) + "</div>" +
          '<div class="dia__num">' + d.getDate() + "</div>" +
          '<div class="dia__month">' + d.toLocaleDateString("es-CO", { month: "short" }).replace(".", "") + "</div>" +
          "</div>"
        );
      }).join("");
    }

    // ¿Hay lunes festivo en los próximos 10 días? → mensaje en el hero
    const aviso = $("[data-aviso-festivo]");
    if (aviso) {
      const lunes = proximos.find((d) => d.getDay() === 1 && (d - hoy) / 864e5 <= 10);
      if (lunes) { aviso.hidden = false; aviso.querySelector("strong").textContent = cap(fmtLargo(lunes)); }
    }
  }

  /* ------------------------------------------------------------------
     5. Tabs del menú
     ------------------------------------------------------------------ */
  function initTabs() {
    $$("[data-tabs]").forEach((root) => {
      const tabs = $$("[role='tab']", root);
      const panels = $$("[role='tabpanel']", root);
      const activate = (tab) => {
        tabs.forEach((t) => { t.setAttribute("aria-selected", String(t === tab)); t.tabIndex = t === tab ? 0 : -1; });
        panels.forEach((p) => p.classList.toggle("is-active", p.id === tab.getAttribute("aria-controls")));
      };
      tabs.forEach((t, i) => {
        t.addEventListener("click", () => activate(t));
        t.addEventListener("keydown", (e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            const n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
            tabs[n].focus(); activate(tabs[n]);
          }
        });
      });
      // Abrir una pestaña desde un enlace: #menu?tab=cojines  o data-open-tab
      $$("[data-open-tab]").forEach((btn) => btn.addEventListener("click", () => {
        const t = tabs.find((x) => x.getAttribute("aria-controls") === btn.getAttribute("data-open-tab"));
        if (t) activate(t);
      }));
    });
  }

  /* ------------------------------------------------------------------
     6. Calculadora de tamaño de lechona
     ------------------------------------------------------------------ */
  function recomendar(personas) {
    const tam = CFG.tamanos || [];
    if (!tam.length) return null;
    const max = tam[tam.length - 1];
    if (personas <= max.max) {
      const t = tam.find((x) => personas >= x.min && personas <= x.max) || max;
      return { items: [{ ...t, cantidad: 1 }], personas };
    }
    // Más personas que la lechona más grande → combinar
    const grandes = Math.floor(personas / max.max);
    const resto = personas - grandes * max.max;
    const items = [{ ...max, cantidad: grandes }];
    if (resto > 0) {
      const r = tam.find((x) => resto >= x.min && resto <= x.max) || tam[1] || max;
      items.push({ ...r, cantidad: 1 });
    }
    return { items, personas };
  }

  function initCalc() {
    const root = $("[data-calc]");
    if (!root) return;
    const num = $("input[type='number']", root);
    const range = $("input[type='range']", root);
    const out = $("[data-calc-result]", root);
    const render = (v) => {
      const personas = Math.max(1, Math.min(1000, parseInt(v, 10) || 1));
      num.value = personas; if (range) range.value = Math.min(personas, parseInt(range.max, 10));
      const rec = recomendar(personas);
      if (!rec) return;
      const principal = rec.items[0];
      const titulo = rec.items.map((it) => (it.cantidad > 1 ? it.cantidad + " × " : "") + it.nombre).join(" + ");
      const capacidad = rec.items.reduce((s, it) => s + it.max * it.cantidad, 0);
      const msg = "¡Hola Lechón del Llano! 🐷 Usé la calculadora de la página: tengo " + personas + " personas y me recomienda " + titulo + ". ¿Me pueden cotizar?";
      out.innerHTML =
        '<span class="label">Te recomendamos</span>' +
        '<div class="big">' + svgIcon(principal.icono || "cerdo") + "<span>" + titulo + "</span></div>" +
        '<p class="detail">' + principal.detalle + " Alcanza para hasta <strong>" + capacidad + " personas</strong>.</p>" +
        "<ul>" +
        "<li>Con sus acompañamientos</li>" +
        (personas >= 31 ? "<li>Opción de ayudante para servir en tu evento</li>" : "<li>Para llevar o a domicilio</li>") +
        "<li>Entrega en Restrepo, Cumaral y Villavicencio</li>" +
        "</ul>" +
        '<a class="btn btn--wa btn--sm" target="_blank" rel="noopener" href="' + waLink(msg) + '">' +
        waIcon() + " Cotizar para " + personas + " personas</a>";
      out.classList.remove("bump"); void out.offsetWidth; out.classList.add("bump");
    };
    num.addEventListener("input", (e) => render(e.target.value));
    if (range) range.addEventListener("input", (e) => render(e.target.value));
    $$("[data-calc-preset]", root).forEach((b) => b.addEventListener("click", () => render(b.getAttribute("data-calc-preset"))));
    render(num.value || 50);
  }

  /* ------------------------------------------------------------------
     7. Armador de pedido → WhatsApp
     ------------------------------------------------------------------ */
  function initOrderForm() {
    const form = $("[data-order-form]");
    if (!form) return;
    const bubble = $("[data-order-preview]");
    const fecha = $("[name='fecha']", form);
    if (fecha) { const t = new Date(); fecha.min = t.toISOString().slice(0, 10); }

    const labelCant = $("[data-cant-label]", form);
    const build = () => {
      const f = Object.fromEntries(new FormData(form).entries());
      const esEvento = f.tipo === "Lechona para evento (con ayudante)";
      const esPorcion = f.tipo === "Porciones";
      if (labelCant) labelCant.textContent = esPorcion ? "¿Cuántas porciones?" : "¿Para cuántas personas?";
      const lineas = ["¡Hola Lechón del Llano! 🐷", "Quiero hacer un pedido:"];
      if (f.tipo) lineas.push("• Producto: " + f.tipo);
      if (f.cantidad) lineas.push("• " + (esPorcion ? "Cantidad: " + f.cantidad + " porciones" : "Para: " + f.cantidad + " personas"));
      if (f.fecha) {
        const [y, m, d] = f.fecha.split("-").map(Number);
        const dt = new Date(y, m - 1, d);
        let fx = cap(dt.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
        if (f.hora) fx += " a las " + fmtHora(f.hora);
        lineas.push("• Fecha: " + fx);
        if (!esDiaDeVenta(dt) && !esEvento) lineas.push("  (sé que no es día de venta; ¿es posible con reserva?)");
      }
      if (f.entrega) lineas.push("• Entrega: " + f.entrega + (f.entrega.startsWith("Domicilio") && f.ciudad ? " en " + f.ciudad : ""));
      if (esEvento) lineas.push("• Incluir ayudante para servir los platos ✅");
      if (f.nombre) lineas.push("• Mi nombre: " + f.nombre);
      if (f.nota && f.nota.trim()) lineas.push("• Nota: " + f.nota.trim());
      lineas.push("¿Me confirman disponibilidad y precio? 🙏");
      return lineas.join("\n");
    };
    const update = () => {
      if (bubble) {
        bubble.textContent = build();
        bubble.setAttribute("data-hora", new Date().toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" }));
      }
    };
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      window.open(waLink(build()), "_blank", "noopener");
    });
    update();
  }

  /* ------------------------------------------------------------------
     8. Galería: placeholders si no hay foto + lightbox
     ------------------------------------------------------------------ */
  function initGallery() {
    const figs = $$(".gallery figure");
    if (!figs.length) return;
    figs.forEach((fig) => {
      const img = $("img", fig);
      const placeholder = () => {
        if (fig.classList.contains("is-placeholder")) return;
        fig.classList.add("is-placeholder");
        fig.insertAdjacentHTML("afterbegin", '<span class="gallery__ph">' + svgIcon(fig.getAttribute("data-icon") || "cerdo") + "</span>");
      };
      if (!img) { placeholder(); return; }
      const fail = placeholder;
      img.addEventListener("error", fail);
      if (img.complete && img.naturalWidth === 0) fail();
    });
    const lb = $(".lightbox");
    if (!lb) return;
    const lbImg = $("img", lb);
    const open = (src, alt) => { lbImg.src = src; lbImg.alt = alt || ""; lb.classList.add("is-open"); document.body.style.overflow = "hidden"; };
    const close = () => { lb.classList.remove("is-open"); document.body.style.overflow = ""; lbImg.src = ""; };
    figs.forEach((fig) => fig.addEventListener("click", () => {
      if (fig.classList.contains("is-placeholder")) return;
      const img = $("img", fig); open(img.currentSrc || img.src, img.alt);
    }));
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".lightbox__close")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ------------------------------------------------------------------
     9. Testimonios (slider)
     ------------------------------------------------------------------ */
  function initTestimonials() {
    const root = $("[data-slider]");
    if (!root) return;
    const track = $(".slider__track", root);
    const dotsWrap = $(".slider__dots", root);
    const items = CFG.testimonios || [];
    if (!items.length) { root.closest("section")?.remove(); return; }
    track.innerHTML = items.map((t) =>
      '<div class="slide"><article class="testimonial">' +
      '<div class="stars" aria-label="5 estrellas">' + svgIcon("estrella").repeat(5) + "</div>" +
      "<blockquote>“" + t.texto + "”</blockquote>" +
      "<cite>" + t.nombre + "<small>" + (t.detalle || "") + "</small></cite>" +
      "</article></div>").join("");
    dotsWrap.innerHTML = items.map((_, i) => '<button type="button" aria-label="Ver testimonio ' + (i + 1) + '"></button>').join("");
    const dots = $$("button", dotsWrap);
    let i = 0, timer;
    const go = (n) => {
      i = (n + items.length) % items.length;
      track.style.transform = "translateX(-" + i * 100 + "%)";
      dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
    };
    const play = () => { if (!reduceMotion) timer = setInterval(() => go(i + 1), 6500); };
    const stop = () => clearInterval(timer);
    dots.forEach((d, k) => d.addEventListener("click", () => { stop(); go(k); play(); }));
    $("[data-prev]", root)?.addEventListener("click", () => { stop(); go(i - 1); play(); });
    $("[data-next]", root)?.addEventListener("click", () => { stop(); go(i + 1); play(); });
    root.addEventListener("mouseenter", stop); root.addEventListener("mouseleave", play);
    let x0 = null;
    root.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", (e) => {
      if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { stop(); go(dx < 0 ? i + 1 : i - 1); play(); }
    });
    go(0); play();
  }

  /* ------------------------------------------------------------------
     10. Utilidades
     ------------------------------------------------------------------ */
  function waIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 1.67c4.56 0 8.24 3.69 8.24 8.24 0 4.56-3.68 8.24-8.24 8.24-1.56 0-3.06-.43-4.37-1.25l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.55 3.68-8.24 8.42-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01"/></svg>';
  }

  function initMisc() {
    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
    // Marquee: duplicar contenido para loop infinito
    $$(".marquee__track").forEach((t) => { t.innerHTML = t.innerHTML + t.innerHTML; });
  }

  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    syncContact();
    initHeader();
    initReveal();
    initCounters();
    initDiasVenta();
    initTabs();
    initCalc();
    initOrderForm();
    initGallery();
    initTestimonials();
    initMisc();
  });

  // API pública (por si se quiere usar desde consola o pruebas)
  window.LDL = { festivosColombia, esFestivo, esDiaDeVenta, proximosDiasDeVenta, recomendar, waLink };
})();
