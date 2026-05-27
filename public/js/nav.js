const nav = document.getElementById("mainNav");
window.addEventListener("scroll", () =>
  nav.classList.toggle("scrolled", window.scrollY > 20),
);

const ham = document.getElementById("hamburger");
const mob = document.getElementById("mobileMenu");
ham.addEventListener("click", () => {
  const open = mob.classList.toggle("open");
  ham.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
});
function closeMob() {
  mob.classList.remove("open");
  ham.classList.remove("open");
  document.body.style.overflow = "";
}

setTimeout(() => {
  const toasts = document.querySelectorAll(".action-toast-msg");
  toasts.forEach((t) => {
    t.style.transform = "translate(-50%, -50px) scale(0.2)";
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 500);
  });
}, 3000);
