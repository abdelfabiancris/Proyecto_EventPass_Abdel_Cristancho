export function createModal({
  title = "Mensaje",
  message = "",
  type = "info",
  confirmText = "Aceptar",
  cancelText = null,
  onConfirm = null,
} = {}) {
  const overlay = document.createElement("div");

  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      
      <button
        type="button"
        class="modal__close"
        aria-label="Cerrar"
      >
        ×
      </button>

      <div class="modal__content">

        <span class="modal__type">
          ${type}
        </span>

        <h2 class="modal__title">
          ${title}
        </h2>

        <p class="modal__message">
          ${message}
        </p>

        <div class="modal__actions">

          ${
            cancelText
              ? `
                <button
                  type="button"
                  class="btn btn-outline modal__cancel"
                >
                  ${cancelText}
                </button>
              `
              : ""
          }

          <button
            type="button"
            class="btn modal__confirm"
          >
            ${confirmText}
          </button>

        </div>

      </div>
    </div>
  `;

  const closeModal = () => {
    overlay.remove();
  };

  overlay.querySelector(".modal__close").addEventListener("click", closeModal);

  if (cancelText) {
    overlay
      .querySelector(".modal__cancel")
      .addEventListener("click", closeModal);
  }

  overlay.querySelector(".modal__confirm").addEventListener("click", () => {
    if (onConfirm) {
      onConfirm();
    }

    closeModal();
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  return overlay;
}
