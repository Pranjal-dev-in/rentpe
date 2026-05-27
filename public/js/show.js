const photos = [];
let currentPhoto = 0;
listImg.map((img) => {
  photos.push(img.url.replace("/upload", "/upload/w_1400,q_80/"));
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const counter = document.getElementById("counter");

/* OPEN */
function openLightbox(index) {
  currentPhoto = index;
  updateLightbox();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

/* CLOSE */
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "auto";
}

/* UPDATE */
function updateLightbox() {
  lightboxImg.src = photos[currentPhoto];
  counter.innerText = `${currentPhoto + 1} / ${photos.length}`;
}

/* NEXT */
function nextPhoto() {
  currentPhoto = (currentPhoto + 1) % photos.length;
  updateLightbox();
}

/* PREV */
function prevPhoto() {
  currentPhoto = (currentPhoto - 1 + photos.length) % photos.length;
  updateLightbox();
}

/* KEYBOARD */
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") {
    closeLightbox();
  }
  if (e.key === "ArrowRight") {
    nextPhoto();
  }
  if (e.key === "ArrowLeft") {
    prevPhoto();
  }
});

/* CLICK OUTSIDE */
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// About toggle
let expanded = false;
const extra =
  " The hotel features elegantly decorated rooms with plush bedding, modern furnishings, and spectacular city views. Our dedicated concierge team is available 24/7 to ensure every aspect of your stay exceeds expectations.";
function toggleAbout() {
  const el = document.getElementById("aboutText");
  const btn = event.target;
  expanded = !expanded;
  if (expanded) {
    el.textContent += extra;
    btn.textContent = "Show less ‹";
  } else {
    el.textContent = el.textContent.replace(extra, "");
    btn.textContent = "Show more ›";
  }
}

//show - hide menu
const menuDot = document.querySelector(".menu-dot");
const hiddenMenu = document.querySelector(".hidden-menu-for-listing");

document.addEventListener("click", (e) => {
  const isMenuClicked = menuDot.contains(e.target);
  const isInsideMenu = hiddenMenu.contains(e.target);

  if (isMenuClicked) {
    hiddenMenu.classList.toggle("hide");
  } else if (!isInsideMenu) {
    hiddenMenu.classList.add("hide");
  }
});
