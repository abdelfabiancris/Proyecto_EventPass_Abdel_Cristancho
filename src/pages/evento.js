import {
  getEventById,
  createRegistration,
} from '../services/api.js';

import { createModal } from '../components/modal.js';

import evt001 from '../assets/cinema/evt-001.webp';
import evt002 from '../assets/cinema/evt-002.webp';
import evt003 from '../assets/cinema/evt-003.webp';
import evt004 from '../assets/cinema/evt-004.webp';
import evt005 from '../assets/cinema/evt-005.webp';
import evt006 from '../assets/cinema/evt-006.webp';

/* =========================================================
   IMÁGENES LOCALES
   ========================================================= */

const EVENT_IMAGES = {
  'EVT-001': evt001,
  'EVT-002': evt002,
  'EVT-003': evt003,
  'EVT-004': evt004,
  'EVT-005': evt005,
  'EVT-006': evt006,
};

/* =========================================================
   FORMATO DE FECHA
   ========================================================= */

function formatDate(date) {
  if (!date) {
    return 'Fecha por confirmar';
  }

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

/* =========================================================
   IMAGEN DEL EVENTO
   ========================================================= */

function getEventImage(event) {
  if (event?.evento_id && EVENT_IMAGES[event.evento_id]) {
    return EVENT_IMAGES[event.evento_id];
  }

  return event?.imagen_url || '';
}

/* =========================================================
   CREAR PÁGINA
   ========================================================= */

export function createEventoPage() {
  const page = document.createElement('div');

  page.className = 'event-page';

  page.innerHTML = `
    <main>
      <section class="event-detail">

        <div class="container event-detail__container">

          <div class="event-detail__loading">

            <span class="event-detail__loading-label">
              CINÉPASS · EVENTO
            </span>

            <h1>
              Cargando experiencia...
            </h1>

            <p>
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

/* =========================================================
   CARGAR EVENTO
   ========================================================= */

async function loadEvent(page) {
  const container = page.querySelector(
    '.event-detail__container'
  );

  const params = new URLSearchParams(
    window.location.hash.split('?')[1] || ''
  );

  const eventoId = params.get('id');

  if (!eventoId) {
    showError(
      page,
      'No se encontró el identificador del evento.'
    );

    return;
  }

  try {
    const response =
      await getEventById(eventoId);

    const event =
      response?.evento ||
      response?.event ||
      (
        Array.isArray(response?.eventos)
          ? response.eventos[0]
          : null
      );

    if (!event) {
      showError(
        page,
        'El evento no fue encontrado.'
      );

      return;
    }

    renderEvent(container, event);

  } catch (error) {
    console.error(
      'Error cargando evento:',
      error
    );

    showError(
      page,
      error.message ||
        'No fue posible cargar el evento.'
    );
  }
}

/* =========================================================
   RENDER DEL EVENTO
   ========================================================= */

function renderEvent(container, event) {
  const disponibilidad = Number(
    event.cupos_disponibles ?? 0
  );

  const estado =
    String(
      event.estado || ''
    ).toUpperCase();

  const isFull =
    disponibilidad <= 0;

  const image =
    getEventImage(event);

  let statusClass = '';

  let statusText =
    'Aforo disponible';

  if (estado === 'CANCELADO') {
    statusClass =
      'event-detail__status--cancelled';

    statusText =
      'Evento cancelado';

  } else if (estado === 'CERRADO') {
    statusClass =
      'event-detail__status--closed';

    statusText =
      'Evento cerrado';

  } else if (
    estado === 'PUBLICADO' &&
    isFull
  ) {
    statusClass =
      'event-detail__status--full';

    statusText =
      'Agotado · Lista de espera';
  }

  /* =======================================================
     BOTÓN
     ======================================================= */

  let buttonHTML = '';

  if (estado === 'CANCELADO') {
    buttonHTML = `
      <button
        type="button"
        class="event-detail__button event-detail__button--disabled"
        disabled
      >
        Evento cancelado
      </button>
    `;

  } else if (
    estado === 'PUBLICADO' &&
    disponibilidad > 0
  ) {
    buttonHTML = `
      <button
        type="button"
        id="event-register-btn"
        class="event-detail__button"
      >
        <span>
          Inscribirme
        </span>

        <span>
          →
        </span>
      </button>
    `;

  } else if (
    estado === 'PUBLICADO' &&
    disponibilidad <= 0
  ) {
    buttonHTML = `
      <button
        type="button"
        id="event-register-btn"
        class="event-detail__button event-detail__button--waitlist"
      >
        <span>
          Unirme a lista de espera
        </span>

        <span>
          →
        </span>
      </button>
    `;

  } else {
    buttonHTML = `
      <button
        type="button"
        class="event-detail__button event-detail__button--disabled"
        disabled
      >
        Evento no disponible
      </button>
    `;
  }

  /* =======================================================
     IMAGEN
     ======================================================= */

  const imageHTML = image
    ? `
      <img
        src="${image}"
        alt="${event.nombre || 'Evento cinematográfico'}"
        class="event-detail__image"
      >
    `
    : `
      <div
        class="event-detail__image event-detail__image--fallback"
        aria-hidden="true"
      ></div>
    `;

  /* =======================================================
     HTML
     ======================================================= */

  container.innerHTML = `

    <!-- REGRESAR -->
    <a
      href="#agenda"
      class="event-detail__back"
    >
      <span>←</span>
      Volver a eventos
    </a>

    <div class="event-detail__grid">

      <!-- ================================
           IMAGEN
           ================================= -->

      <div class="event-detail__visual">

        ${imageHTML}

        <div
          class="event-detail__visual-overlay"
          aria-hidden="true"
        ></div>

        <div class="event-detail__visual-top">

          <span class="event-detail__category">
            ${event.categoria || 'CINE'}
          </span>

          <span
            class="
              event-detail__status
              ${statusClass}
            "
          >
            ${statusText}
          </span>

        </div>

        <div class="event-detail__visual-bottom">

          <span>
            ${event.organizador || 'CinéPass'}
          </span>

          <span>
            ${event.evento_id || ''}
          </span>

        </div>

      </div>

      <!-- ================================
           INFORMACIÓN
           ================================= -->

      <div class="event-detail__content">

        <div class="event-detail__eyebrow">
          CINÉPASS · EXPERIENCIA CINEMATOGRÁFICA
        </div>

        <h1 class="event-detail__title">
          ${event.nombre || 'Evento sin nombre'}
        </h1>

        <p class="event-detail__description">
          ${
            event.descripcion ||
            'Una experiencia cinematográfica de CinéPass.'
          }
        </p>

        <!-- INFORMACIÓN PRINCIPAL -->

        <div class="event-detail__info-grid">

          <div class="event-detail__info-item">
            <span>
              Fecha
            </span>

            <strong>
              ${formatDate(event.fecha)}
            </strong>
          </div>

          <div class="event-detail__info-item">
            <span>
              Hora
            </span>

            <strong>
              ${event.hora || '--:--'}
            </strong>
          </div>

          <div class="event-detail__info-item">
            <span>
              Lugar
            </span>

            <strong>
              ${event.lugar || 'Por confirmar'}
            </strong>
          </div>

          <div class="event-detail__info-item">
            <span>
              Organizador
            </span>

            <strong>
              ${
                event.organizador ||
                'CinéPass'
              }
            </strong>
          </div>

        </div>

        <!-- ================================
             RESERVA
             ================================= -->

        <div class="event-detail__booking">

          <div class="event-detail__availability">

            <span>
              AFORO DISPONIBLE
            </span>

            <strong
              class="
                ${
                  isFull
                    ? 'event-detail__availability--full'
                    : ''
                }
              "
            >
              ${
                isFull
                  ? 'Agotado'
                  : disponibilidad
              }
            </strong>

            <small>
              ${
                isFull
                  ? 'Puedes ingresar a la lista de espera.'
                  : 'cupos disponibles'
              }
            </small>

          </div>

          <div class="event-detail__action">

            ${buttonHTML}

            <p class="event-detail__notice">
              ${
                isFull
                  ? 'Las personas en espera serán reasignadas automáticamente cuando se liberen cupos.'
                  : 'La inscripción requiere una sesión activa y una cuenta de Telegram vinculada.'
              }
            </p>

          </div>

        </div>

        <div class="event-detail__footer-line">

          <span>
            ESTADO
          </span>

          <strong>
            ${event.estado || 'N/D'}
          </strong>

        </div>

      </div>

    </div>
  `;

  /* =======================================================
     BOTÓN DE INSCRIPCIÓN
     ======================================================= */

  const registerButton =
    container.querySelector(
      '#event-register-btn'
    );

  if (!registerButton) {
    return;
  }

  registerButton.addEventListener(
    'click',
    async () => {

      const sessionToken =
        localStorage.getItem(
          'eventpass_session_token'
        );

      if (!sessionToken) {

        const modal = createModal({
          title: 'Inicia sesión',
          message:
            'Debes iniciar sesión antes de inscribirte a un evento.',
          type: 'EventPass',
          confirmText: 'Entendido',
        });

        document.body.appendChild(
          modal
        );

        return;
      }

      try {

        registerButton.disabled =
          true;

        registerButton.innerHTML = `
          <span>
            Procesando...
          </span>
        `;

        const response =
          await createRegistration({
            sessionToken,
            eventoId:
              event.evento_id,
            origen:
              'WEB',
          });

        if (response?.ok === false) {
          throw new Error(
            response.error ||
              response.mensaje ||
              'No fue posible realizar la inscripción.'
          );
        }

        const estadoRespuesta =
          String(
            response.estado || ''
          ).toUpperCase();

        let title =
          'Inscripción exitosa';

        let message =
          'Tu inscripción fue registrada correctamente.';

        let buttonText =
          'Inscrito ✓';

        if (
          estadoRespuesta ===
          'CONFIRMADA'
        ) {
          message =
            '¡Inscripción confirmada! Tu cupo ha sido reservado.';
        }

        if (
          estadoRespuesta ===
          'LISTA_ESPERA'
        ) {
          title =
            'Lista de espera';

          message =
            'El evento está lleno. Has sido agregado correctamente a la lista de espera.';

          buttonText =
            'En lista de espera';
        }

        const modal =
          createModal({
            title,
            message,
            type: 'EventPass',
            confirmText: 'Entendido',
          });

        document.body.appendChild(
          modal
        );

        registerButton.innerHTML = `
          <span>
            ${buttonText}
          </span>
        `;

      } catch (error) {

        console.error(
          'Error realizando inscripción:',
          error
        );

        let message =
          error.message ||
          'No fue posible realizar la inscripción.';

        if (
          String(message).includes(
            'TELEGRAM_NO_VINCULADO'
          )
        ) {
          message =
            'Debes vincular tu cuenta de Telegram antes de inscribirte.';
        }

        const modal =
          createModal({
            title:
              'No se pudo completar',
            message,
            type:
              'EventPass',
            confirmText:
              'Entendido',
          });

        document.body.appendChild(
          modal
        );

        registerButton.disabled =
          false;

        registerButton.innerHTML = `
          <span>
            ${
              disponibilidad > 0
                ? 'Inscribirme'
                : 'Unirme a lista de espera'
            }
          </span>

          <span>
            →
          </span>
        `;
      }
    }
  );
}

/* =========================================================
   ERROR
   ========================================================= */

function showError(page, message) {
  const container =
    page.querySelector(
      '.event-detail__container'
    );

  container.innerHTML = `

    <div class="event-detail__error">

      <span>
        CINÉPASS · ERROR
      </span>

      <h1>
        No pudimos cargar el evento
      </h1>

      <p>
        ${message}
      </p>

      <a
        href="#agenda"
        class="event-detail__button"
      >
        Volver a eventos →
      </a>

    </div>

  `;
}