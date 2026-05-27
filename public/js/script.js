// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

const btns = document.querySelectorAll(".delete-btn");
btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const deleteMainPopUpbox = document.querySelector(
      ".delete-main-pop-up-box",
    );
    deleteMainPopUpbox.classList.remove("hide");
  });
});

const cancelBtn = document.querySelectorAll(".cancel-btn");
cancelBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const deleteMainPopUpbox = document.querySelector(
      ".delete-main-pop-up-box",
    );
    deleteMainPopUpbox.classList.add("hide");
  });
});

setTimeout(() => {
  const toasts = document.querySelectorAll(".toast-msg");
  toasts.forEach((t) => {
    t.style.transform = "translate(-50%, -50px) scale(0.2)";
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 500);
  });
}, 3000);
