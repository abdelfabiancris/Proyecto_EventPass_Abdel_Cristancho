export function createEventCard(event) {
  const card = document.createElement("article");

  card.className = "event-card";

  card.innerHTML = `
    <div class="event-card__image-wrapper">
      <img
        class="event-card__image"
        src="${event.imagen || "/placeholder-event.jpg"}"
        alt="${event.nombre || "Evento cinematográfico"}"
      />

      <span class="event-card__category">
        ${event.categoria || "CINE"}
      </span>
    </div>

    <div class="event-card__content">

      <span class="event-card__date">
        ${event.fecha || ""}
      </span>

      <h3 class="event-card__title">
        ${event.nombre || "Evento sin nombre"}
      </h3>

      <p class="event-card__description">
        ${event.descripcion || "Sin descripción disponible."}
      </p>

      <div class="event-card__info">

        <span class="event-card__location">
          ${event.lugar || "Lugar por confirmar"}
        </span>

        <strong class="event-card__availability">
          ${event.cupos_disponibles ?? 0} cupos
        </strong>

      </div>

      <button class="event-card__button" type="button">
        Ver evento
      </button>

    </div>
  `;

  // Toda la tarjeta es clickeable
  card.addEventListener("click", (eventClick) => {
    if (eventClick.target.closest(".event-card__button")) {
      return;
    }

    window.location.hash = `#evento?id=${encodeURIComponent(
      event.evento_id
    )}`;
  });

  // Botón "Ver evento"
  const button = card.querySelector(".event-card__button");

  button.addEventListener("click", () => {
    window.location.hash = `#evento?id=${encodeURIComponent(
      event.evento_id
    )}`;
  });

  return card;
}