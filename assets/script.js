/* Luxury Elite Detailing — site interactions (reused as-is from naturewaylawn.com) */
(function () {
  "use strict";

  /* Prevent browser from restoring last scroll position on reload */
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Gallery filtering */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var items = document.querySelectorAll(".gallery-item");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      items.forEach(function (it) {
        var cat = it.getAttribute("data-cat") || "";
        it.style.display = (f === "all" || cat.indexOf(f) > -1) ? "" : "none";
      });
    });
  });

  /* Lightbox */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    document.querySelectorAll("[data-lightbox]").forEach(function (el) {
      el.addEventListener("click", function () {
        var src = el.getAttribute("data-lightbox") || (el.querySelector("img") && el.querySelector("img").src);
        if (src) { lbImg.src = src; lb.classList.add("open"); document.body.style.overflow = "hidden"; }
      });
    });
    function closeLB() { lb.classList.remove("open"); document.body.style.overflow = ""; }
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lightbox-close")) closeLB(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLB(); });
  }

  /* Lead form
     NOTE: if using Netlify Forms (recommended — see references/deploy-guide.md),
     remove this preventDefault handler and let the form submit natively with
     data-netlify="true" set on the <form>. Keep this demo handler only if you
     are wiring the form to a different backend that also needs a JS intercept. */
  var form = document.querySelector("#quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = form.querySelector(".form-success");
      if (ok) ok.style.display = "block";
      form.reset();
      if (ok) ok.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* Before / after sliders: range input drives --pos; nudge once on first view as a drag hint */
  document.querySelectorAll(".ba-slider").forEach(function (sl) {
    var r = sl.querySelector(".ba-range");
    if (!r) return;
    function set(v) { sl.style.setProperty("--pos", v + "%"); }
    var touched = false;
    var tags = sl.querySelectorAll(".ba-tag[data-show]");
    function mark(v) {
      tags.forEach(function (t) {
        var on = (t.getAttribute("data-show") === "before" && v >= 100) || (t.getAttribute("data-show") === "after" && v <= 0);
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    r.addEventListener("input", function () { touched = true; sl.classList.remove("ba-hint"); set(r.value); mark(+r.value); });
    /* Tap "Before" = show the full before photo, tap "After" = full after photo; tap the active one again to go back to 50/50 */
    tags.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.stopPropagation();
        touched = true;
        var target = t.getAttribute("data-show") === "before" ? 100 : 0;
        if (+r.value === target) target = 50;
        r.value = target;
        sl.classList.add("ba-hint");
        set(target); mark(target);
        clearTimeout(sl._hintT);
        sl._hintT = setTimeout(function () { sl.classList.remove("ba-hint"); }, 950);
      });
    });
    set(r.value);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "IntersectionObserver" in window) {
      var hio = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (!e.isIntersecting) return;
          hio.unobserve(sl);
          sl.classList.add("ba-hint");
          setTimeout(function () { if (!touched) set(28); }, 350);
          setTimeout(function () { if (!touched) set(72); }, 1250);
          setTimeout(function () { if (!touched) set(r.value); }, 2150);
          setTimeout(function () { sl.classList.remove("ba-hint"); }, 3100);
        });
      }, { threshold: 0.5 });
      hio.observe(sl);
    }
  });

  /* Package buttons pre-select the package in the quote form */
  var svcSelect = document.querySelector("#service");
  document.querySelectorAll("[data-package]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (svcSelect) svcSelect.value = b.getAttribute("data-package");
    });
  });

  /* Footer year */
  var yr = document.querySelector("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
