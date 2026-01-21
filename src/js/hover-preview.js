const preview = document.getElementById("hover-preview");

document.querySelectorAll(".post-item").forEach(item => {
  const img = item.dataset.image;
  if (!img) return;

  item.addEventListener("mouseenter", () => {
    preview.style.backgroundImage = `url(${img})`;
    preview.style.opacity = 1;
  });

  item.addEventListener("mouseleave", () => {
    preview.style.opacity = 0;
  });

  item.addEventListener("focus", () => {
    preview.style.backgroundImage = `url(${img})`;
    preview.style.opacity = 1;
  });

  item.addEventListener("blur", () => {
    preview.style.opacity = 0;
  });
});
