import {
  getEventById,
  createRegistration
} from "../services/api.js";import { createModal } from "../components/modal.js";

export function createEventoPage() {
  const page = document.createElement("div");

  page.className = "event-page";

  page.innerHTML = `
    <main>
      <section class="event-detail">

        <div class="container event-detail__container">

          <div class="event-detail__content">

            <p class="events__eyebrow">
              EventPass · Evento
            </p>

            <h1 class="event-detail__title">
              Cargando...
            </h1>

            <p class="event-detail__description">
              Estamos consultando la información del evento.
            </p>

          </div>

        </div>

      </section>
    </main>
  `;

  loadEvent(page);

  return page;
}

async function loadEvent(page) {
  const title = page.querySelector(".event-detail__title");
  const description = page.querySelector(".event-detail__description");
  const container = page.querySelector(".event-detail__container");

  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");

  const eventoId = params.get("id");

  if (!eventoId) {
    showError(page, "No se encontró el identificador del evento.");

    return;
  }

  try {
    const response = await getEventById(eventoId);

    const event =
      response?.evento ||
      response?.event ||
      (Array.isArray(response?.eventos) ? response.eventos[0] : null);

    if (!event) {
      showError(page, "El evento no fue encontrado.");

      return;
    }

    renderEvent(container, event);
  } catch (error) {
    console.error("Error cargando evento:", error);

    showError(page, error.message || "No fue posible cargar el evento.");
  }
}

function renderEvent(container, event) {
  const disponibilidad = Number(event.cupos_disponibles ?? 0);
  const estado = String(event.estado || "").toUpperCase();

  let buttonHTML = "";

  if (estado === "CANCELADO") {
    buttonHTML = `
      <button
        type="button"
        class="btn event-detail__button"
        disabled
      >
        Evento cancelado
      </button>
    `;
  } else if (estado === "PUBLICADO" && disponibilidad > 0) {
    buttonHTML = `
      <button
        type="button"
        id="event-register-btn"
        class="btn event-detail__button"
      >
        Inscribirme
      </button>
    `;
  } else if (estado === "PUBLICADO" && disponibilidad <= 0) {
    buttonHTML = `
      <button
        type="button"
        id="event-register-btn"
        class="btn event-detail__button"
      >
        Unirme a lista de espera
      </button>
    `;
  } else {
    buttonHTML = `
      <button
        type="button"
        class="btn event-detail__button"
        disabled
      >
        Evento no disponible
      </button>
    `;
  }

  container.innerHTML = `
    <div class="event-detail__content">

      <p class="events__eyebrow">
        ${event.categoria}
      </p>

      <h1 class="event-detail__title">
        ${event.nombre}
      </h1>

      <p class="event-detail__description">
        ${event.descripcion || ""}
      </p>

      <div class="event-detail__info">

        <div class="event-detail__item">
          <span class="event-detail__label">
            Fecha
          </span>

          <strong>
            ${event.fecha}
          </strong>
        </div>

        <div class="event-detail__item">
          <span class="event-detail__label">
            Hora
          </span>

          <strong>
            ${event.hora}
          </strong>
        </div>

        <div class="event-detail__item">
          <span class="event-detail__label">
            Lugar
          </span>

          <strong>
            ${event.lugar}
          </strong>
        </div>

        <div class="event-detail__item">
          <span class="event-detail__label">
            Organizador
          </span>

          <strong>
            ${event.organizador}
          </strong>
        </div>

      </div>

    </div>

    <aside class="event-detail__aside">

      <div class="event-detail__availability">

        <span class="event-detail__label">
          Disponibilidad
        </span>

        <strong>
          ${disponibilidad}
        </strong>

        <span>
          cupos disponibles
        </span>

      </div>

      ${buttonHTML}

      <p class="event-detail__status">
        Estado: ${event.estado}
      </p>

    </aside>
  `;

  const registerButton = container.querySelector("#event-register-btn");

  if (registerButton) {
    registerButton.addEventListener("click", async () => {

      const sessionToken = localStorage.getItem(
        "eventpass_session_token"
      );

      if (!sessionToken) {
        const modal = createModal({
          title: "Inicia sesión",
          message:
            "Debes iniciar sesión antes de inscribirte a un evento.",
          type: "EventPass",
          confirmText: "Entendido",
        });

        document.body.appendChild(modal);
        return;
      }

      try {
        registerButton.disabled = true;
        registerButton.textContent = "Procesando...";

        const response = await createRegistration({
          sessionToken,
          eventoId: event.evento_id,
          origen: "WEB"
        });

        if (response?.ok === false) {
          throw new Error(
            response.error ||
            response.mensaje ||
            "No fue posible realizar la inscripción."
          );
        }

        const estadoRespuesta =
          String(response.estado || "").toUpperCase();

        let message =
          "Tu inscripción fue registrada correctamente.";

        let title = "Inscripción exitosa";
        let buttonText = "Inscrito";

        if (estadoRespuesta === "CONFIRMADA") {
          message =
            "¡Inscripción confirmada! Tu cupo ha sido reservado.";
        }

        if (estadoRespuesta === "LISTA_ESPERA") {
          title = "Lista de espera";
          message =
            "El evento está lleno. Has sido agregado a la lista de espera.";
          buttonText = "En lista de espera";
        }

        const modal = createModal({
          title,
          message,
          type: "EventPass",
          confirmText: "Entendido",
        });

        document.body.appendChild(modal);

        registerButton.textContent = buttonText;

      } catch (error) {
        console.error(
          "Error realizando inscripción:",
          error
        );

        let message =
          error.message ||
          "No fue posible realizar la inscripción.";

        if (
          String(message).includes(
            "TELEGRAM_NO_VINCULADO"
          )
        ) {
          message =
            "Debes vincular tu cuenta de Telegram antes de inscribirte.";
        }

        const modal = createModal({
          title: "No se pudo completar",
          message,
          type: "EventPass",
          confirmText: "Entendido",
        });

        document.body.appendChild(modal);

        registerButton.disabled = false;

        registerButton.textContent =
          disponibilidad > 0
            ? "Inscribirme"
            : "Unirme a lista de espera";
      }
    });
  }
}

function showError(page, message) {
  const container = page.querySelector(".event-detail__container");

  container.innerHTML = `
    <div class="event-detail__content">

      <p class="events__eyebrow">
        EventPass · Error
      </p>

      <h1 class="event-detail__title">
        No pudimos cargar el evento
      </h1>

      <p class="event-detail__description">
        ${message}
      </p>

      <a href="#" class="btn">
        Volver a eventos
      </a>

    </div>
  `;
}
