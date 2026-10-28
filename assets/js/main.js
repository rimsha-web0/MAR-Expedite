/* MAR Expedite LLC — site scripts */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: solid background after scrolling ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  var backdrop = document.querySelector(".nav-backdrop");
  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
    if (backdrop) backdrop.addEventListener("click", function () { setNav(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); } });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .img-reveal, .process");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Service rows: floating photo preview on hover ---------- */
  var preview = document.querySelector(".svc-preview");
  var rows = document.querySelectorAll(".svc-row[data-img]");
  if (preview && rows.length && window.matchMedia("(hover: hover)").matches) {
    var previewImg = preview.querySelector("img");
    var x = 0, y = 0, cx = 0, cy = 0, raf = null;
    function loop() {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      preview.style.left = cx + 24 + "px";
      preview.style.top = cy - 110 + "px";
      raf = requestAnimationFrame(loop);
    }
    rows.forEach(function (row) {
      row.addEventListener("mouseenter", function (e) {
        previewImg.src = row.getAttribute("data-img");
        previewImg.alt = "";
        x = cx = e.clientX; y = cy = e.clientY;
        preview.classList.add("is-visible");
        if (!raf) raf = requestAnimationFrame(loop);
      });
      row.addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; });
      row.addEventListener("mouseleave", function () {
        preview.classList.remove("is-visible");
        cancelAnimationFrame(raf); raf = null;
      });
    });
  }

  /* ---------- Gentle parallax on CTA band photo ---------- */
  var parallax = document.querySelectorAll("[data-parallax]");
  if (parallax.length && !reduceMotion) {
    var ticking = false;
    function updateParallax() {
      parallax.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        img.style.transform = "translate3d(0," + (p * -60).toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }, { passive: true });
    updateParallax();
  }

  /* ---------- Scroll progress bar + back-to-top button ---------- */
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  var topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "to-top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
  document.body.appendChild(topBtn);
  function onProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
    topBtn.classList.toggle("is-shown", window.scrollY > 700);
  }
  onProgress();
  window.addEventListener("scroll", onProgress, { passive: true });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = form.querySelector(".form-status");
  var submitBtn = form.querySelector("button[type=submit]");
  var phoneInput = form.querySelector("#phone");
  var smsBoxes = form.querySelectorAll("input[name^='sms_consent']");

  var validators = {
    first_name: function (v) { return v.trim() ? "" : "Please enter your first name."; },
    last_name: function (v) { return v.trim() ? "" : "Please enter your last name."; },
    email: function (v) {
      if (!v.trim()) return "Please enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address, like name@company.com.";
    },
    phone: function (v) {
      var digits = v.replace(/\D/g, "");
      var smsChecked = Array.prototype.some.call(smsBoxes, function (b) { return b.checked; });
      if (!digits) return smsChecked ? "Please enter a mobile number to receive text messages." : "";
      return digits.length === 10 || (digits.length === 11 && digits[0] === "1") ? "" : "Please enter a 10-digit U.S. phone number.";
    },
    service: function (v) { return v ? "" : "Please choose the service you need."; },
    message: function (v) { return v.trim().length >= 10 ? "" : "Please tell us a little about your shipment (at least 10 characters)."; }
  };

  function validateField(name) {
    var input = form.elements[name];
    if (!input || !validators[name]) return true;
    var msg = validators[name](input.value);
    var field = input.closest(".field");
    var err = field && field.querySelector(".field-error");
    if (field) field.classList.toggle("has-error", !!msg);
    if (err) err.textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  Object.keys(validators).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    input.addEventListener("blur", function () { if (input.value) validateField(name); });
    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("has-error")) validateField(name);
    });
  });
  smsBoxes.forEach(function (b) { b.addEventListener("change", function () { if (phoneInput.closest(".field").classList.contains("has-error") || b.checked) validateField("phone"); }); });

  // Format U.S. phone numbers as the user types: (949) 555-0123
  phoneInput.addEventListener("input", function () {
    var d = phoneInput.value.replace(/\D/g, "");
    if (d.length === 11 && d[0] === "1") d = d.slice(1);
    d = d.slice(0, 10);
    var out = d;
    if (d.length > 6) out = "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
    else if (d.length > 3) out = "(" + d.slice(0, 3) + ") " + d.slice(3);
    phoneInput.value = out;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    var firstInvalid = null;
    Object.keys(validators).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    // Honeypot for bots
    if (form.elements._honey && form.elements._honey.value) return;

    var data = new FormData(form);
    data.set("sms_consent_transactional", form.elements.sms_consent_transactional.checked ? "Yes — agreed to transactional texts" : "No");
    data.set("sms_consent_marketing", form.elements.sms_consent_marketing.checked ? "Yes — agreed to marketing texts" : "No");
    data.set("consent_timestamp", new Date().toISOString());
    data.set("page_url", window.location.href);

    // Deliver the message to the inbox in the background, then thank the visitor.
    fetch(form.getAttribute("action"), { method: "POST", body: data, headers: { Accept: "application/json" } })
      .catch(function () { /* the visitor still sees the confirmation below */ });

    var firstName = form.elements.first_name.value.trim();
    showThanks(firstName);
  });

  var thanks = document.getElementById("form-thanks");
  var formHead = document.querySelectorAll(".form-card > h2, .form-card > .form-intro");

  function showThanks(name) {
    if (!thanks) return;
    thanks.querySelector(".thanks-name").textContent = name ? ", " + name : "";
    form.hidden = true;
    formHead.forEach(function (el) { el.hidden = true; });
    thanks.hidden = false;
    // restart the check-mark animation each time
    var icon = thanks.querySelector(".thanks-icon");
    icon.replaceWith(icon.cloneNode(true));
    thanks.focus();
    thanks.closest(".form-card").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  var again = document.getElementById("send-another");
  if (again) {
    again.addEventListener("click", function () {
      form.reset();
      form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("has-error"); });
      thanks.hidden = true;
      form.hidden = false;
      formHead.forEach(function (el) { el.hidden = false; });
      form.elements.first_name.focus();
    });
  }
})();
