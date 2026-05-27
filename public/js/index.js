function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

function toggleSave(btn) {
  btn.classList.toggle("saved");
  btn.textContent = btn.classList.contains("saved") ? "♥" : "♡";
  showToast(
    btn.classList.contains("saved")
      ? "Saved to your wishlist"
      : "Removed from wishlist",
  );
}

document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-chip")
      .forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.dataset.filter;
    let v = 0;
    document.querySelectorAll(".listing-card").forEach((card) => {
      const show = f === "all" || card.dataset.tier === f;
      card.style.display = show ? "" : "none";
      if (show) v++;
    });
    document.getElementById("listingCount").textContent =
      v + " propert" + (v === 1 ? "y" : "ies");
  });
});

document.getElementById("searchInput").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  let v = 0;
  document.querySelectorAll(".listing-card").forEach((card) => {
    const show = card.textContent.toLowerCase().includes(q);
    card.style.display = show ? "" : "none";
    if (show) v++;
  });
  document.getElementById("listingCount").textContent =
    v + " propert" + (v === 1 ? "y" : "ies");
});

document.querySelectorAll(".btn-card-view").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // e.preventDefault();
    showToast(
      "Opening " +
        btn.closest(".listing-card").querySelector(".card-name").textContent +
        "…",
    );
  });
});
