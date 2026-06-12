/* ============================================================
   settings.js  —  RentPe Settings page JavaScript
   ============================================================ */

/* ── PANEL SWITCHING ── */
function switchPanel(id, trigger) {
  /* hide all panels */
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("panel-" + id)?.classList.add("active");

  /* sidebar highlight */
  document
    .querySelectorAll(".sb-item")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelector('.sb-item[data-panel="' + id + '"]')
    ?.classList.add("active");

  /* mobile tab highlight */
  document
    .querySelectorAll(".mob-tab")
    .forEach((t) => t.classList.remove("active"));
  if (trigger?.classList?.contains("mob-tab")) {
    trigger.classList.add("active");
  } else {
    document.querySelectorAll(".mob-tab").forEach((t) => {
      if (t.getAttribute("onclick")?.includes("'" + id + "'"))
        t.classList.add("active");
    });
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── MARK FIELD CHANGED ── */
function mc(el) {
  el?.classList.add("changed");
}

/* ── BIO CHAR COUNT ── */
function bioLen(ta, spanId) {
  const el = document.getElementById(spanId);
  if (el) el.textContent = ta.value.length;
}

/* ── SAVE PANEL ── */
function save(btn, panelId) {
  const span = btn.querySelector("span");
  const orig = span.textContent;
  btn.classList.add("loading");
  span.textContent = "Saving…";
  setTimeout(() => {
    btn.classList.remove("loading");
    span.textContent = orig;
    document
      .querySelectorAll("#panel-" + panelId + " .ff.changed")
      .forEach((f) => f.classList.remove("changed"));
    toast("✓ Changes saved successfully!");
  }, 1400);
}

/* ── DISCARD ── */
function discard(panelId) {
  document
    .querySelectorAll("#panel-" + panelId + " .ff.changed")
    .forEach((f) => f.classList.remove("changed"));
  toast("Changes discarded.");
}

/* ── PASSWORD TOGGLE ── */
function tpw(id, btn) {
  const inp = document.getElementById(id);
  inp.type = inp.type === "password" ? "text" : "password";
  btn.style.opacity = inp.type === "text" ? "1" : "0.6";
}

/* ── PASSWORD STRENGTH ── */
function strCheck(val) {
  const fill = document.getElementById("strFill");
  const label = document.getElementById("strLabel");
  if (!fill || !label) return;
  if (!val) {
    fill.style.width = "0";
    label.textContent = "";
    return;
  }
  let s = 0;
  if (val.length >= 8) s++;
  if (/[A-Z]/.test(val)) s++;
  if (/[0-9]/.test(val)) s++;
  if (/[^A-Za-z0-9]/.test(val)) s++;
  const levels = [
    { w: "25%", c: "#e05", t: "Weak" },
    { w: "50%", c: "#f90", t: "Fair" },
    { w: "75%", c: "#fb0", t: "Good" },
    { w: "100%", c: "#2a9", t: "Strong" },
  ];
  const l = levels[s - 1] || levels[0];
  fill.style.width = l.w;
  fill.style.background = l.c;
  label.textContent = l.t;
  label.style.color = l.c;
}

/* ── AVATAR PREVIEW ── */
function prevAv(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target.result;
    const thumb = document.getElementById("avThumb");
    thumb.innerHTML = `<img src="${src}" alt="avatar" /><div class="av-over"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>`;

    /* sync sidebar avatar + nav icon */
    const sbAv = document.getElementById("sbAvatar");
    if (sbAv)
      sbAv.innerHTML = `<img src="${src}" alt="A" /><div class="sb-online"></div>`;
    const navIcon = document.getElementById("navProfileIcon");
    if (navIcon) navIcon.innerHTML = `<img src="${src}" alt="A" />`;

    toast("📸 Photo updated — saved automatically.");
  };
  reader.readAsDataURL(file);
  input.value = "";
}

function rmAv() {
  const thumb = document.getElementById("avThumb");
  thumb.innerHTML = `A<div class="av-over"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>`;
  toast("Profile photo removed.");
}

/* ── MODALS ── */
function openModal(id) {
  document.getElementById("modal-" + id).classList.add("open");
}
function closeModal(id) {
  document.getElementById("modal-" + id).classList.remove("open");
}

function confirmAction(id) {
  closeModal(id);
  if (id === "del-account") {
    toast("Account deleted. Redirecting…");
    setTimeout(() => (location.href = "index.html"), 1800);
  } else {
    toast("All listings deleted.");
  }
}

document.querySelectorAll(".modal-bg").forEach((m) => {
  m.addEventListener("click", (e) => {
    if (e.target === m) m.classList.remove("open");
  });
});

/* ── TOAST ── */
function toast(msg, dur = 2600) {
  const t = document.getElementById("toastEl");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), dur);
}

/* ── NAV SCROLL ── */
window.addEventListener("scroll", () =>
  document.getElementById("mainNav").classList.toggle("scrolled", scrollY > 20),
);

/* ── HAMBURGER ── */
const navHam = document.getElementById("navHam");
const navDrw = document.getElementById("navDrawer");
navHam.addEventListener("click", () => {
  const open = navDrw.classList.toggle("open");
  navHam.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
});
function closeDr() {
  navDrw.classList.remove("open");
  navHam.classList.remove("open");
  document.body.style.overflow = "";
}

/* ── INIT ── */
window.addEventListener("DOMContentLoaded", () => {
  const bio = document.getElementById("ep-bio");
  if (bio) bioLen(bio, "ep-bio-len");
});
