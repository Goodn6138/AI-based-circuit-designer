const canvas = document.getElementById("canvas");
const sidebar = document.querySelector(".sidebar");

// Helper: make an element draggable
function makeDraggable(el) {
  let offsetX = 0, offsetY = 0;
  let dragging = false;

  el.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    el.style.cursor = "grabbing";
    e.stopPropagation();
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    let x = e.pageX - offsetX;
    let y = e.pageY - offsetY;
    // Keep inside canvas (optional)
    const rect = canvas.getBoundingClientRect();
    x = Math.max(rect.left, Math.min(x, rect.right - el.clientWidth));
    y = Math.max(rect.top, Math.min(y, rect.bottom - el.clientHeight));

    el.style.left = `${x - rect.left}px`;
    el.style.top = `${y - rect.top}px`;
  });

  window.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    el.style.cursor = "grab";
  });
}

// Create a part in the canvas
function addPart(type, x, y) {
  const el = document.createElement(type);
  el.classList.add("draggable");
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  makeDraggable(el);
  canvas.appendChild(el);
}

// Sidebar drag to canvas
sidebar.querySelectorAll(".part-item").forEach(item => {
  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", item.dataset.type);
  });

  // For better UX, allow click to also add
  item.addEventListener("click", () => {
    addPart(item.dataset.type, 20, 20);
  });
});

// Enable drop on canvas
canvas.addEventListener("dragover", (e) => {
  e.preventDefault();
});
canvas.addEventListener("drop", (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData("text/plain");
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  addPart(type, x, y);
});
