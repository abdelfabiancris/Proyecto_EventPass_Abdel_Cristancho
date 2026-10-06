export function createEventCard(event) {
  const card = document.createElement("article");

  card.className = "event-card";

  // Clases visuales según el estado del evento
  if (event.estado === "CANCELADO") {
    card.classList.add("event-card--cancelled");
  }

  if (event.disponibilidad === 0) {
    card.classList.add("event-card--full");
  }

  let statusHTML = "";

  if (event.estado === "CANCELADO") {
    statusHTML = `
      <span class="event-card__status">
        Evento cancelado
      </span>
    `;
  } else if (event.disponibilidad === 0) {
    statusHTML = `
      <span class="event-card__status">
        Aforo completo
      </span>
    `;
  }

  card.innerHTML = `
    <div class="event-card__image-wrapper">
      <img
        class="event-card__image"
        src="${event.imagen}"
        alt="${event.titulo}"
      >

      <span class="event-card__category">
        ${event.categoria}
      </span>
    </div>

    <div class="event-card__content">

      <div class="event-card__date">
        ${event.fecha}
      </div>

      <h3 class="event-card__title">
        ${event.titulo}
      </h3>

      <p class="event-card__description">
        ${event.descripcion}
      </p>

      <div class="event-card__info">
        <span class="event-card__location">
          ${event.ubicacion}
        </span>

        <span class="event-card__availability">
          ${event.disponibilidad} cupos
        </span>
      </div>

      ${statusHTML}

    </div>
  `;

  return card;
}
