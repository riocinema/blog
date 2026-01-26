// src/js/a11y-toggle.js
(function () {
  const KEY = "rio_a11y";
  const btn = document.getElementById("a11yToggle");
  if (!btn) return;

  function setState(on) {
    document.body.classList.toggle("a11y", on);
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    try {
      localStorage.setItem(KEY, on ? "1" : "0");
    } catch (e) {}
  }

  // init
  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch (e) {}
  setState(saved === "1");

  // click
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    setState(!document.body.classList.contains("a11y"));
  });

  // keyboard (space/enter)
  btn.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setState(!document.body.classList.contains("a11y"));
    }
  });
})();
