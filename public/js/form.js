/* forms.js — shared behaviour for login, signup, create-listing */

/* ── Show/hide password ── */
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  const isText = input.type === "text";
  input.type = isText ? "password" : "text";
  btn.style.opacity = isText ? "0.5" : "1";
}

/* ── Focus ring: gold on focus ── */
document.addEventListener("focusin", (e) => {
  if (e.target.matches(".form-input")) {
    e.target.closest(".input-wrap")?.classList.add("focused");
  }
});
document.addEventListener("focusout", (e) => {
  if (e.target.matches(".form-input")) {
    e.target.closest(".input-wrap")?.classList.remove("focused");
  }
});
