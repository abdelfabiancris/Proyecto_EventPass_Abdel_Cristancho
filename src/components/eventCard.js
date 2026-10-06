import evt001 from '../assets/cinema/evt-001.webp';
import evt002 from '../assets/cinema/evt-002.webp';
import evt003 from '../assets/cinema/evt-003.webp';
import evt004 from '../assets/cinema/evt-004.webp';
import evt005 from '../assets/cinema/evt-005.webp';
import evt006 from '../assets/cinema/evt-006.webp';

/* =========================================================
   IMÁGENES LOCALES DE LOS EVENTOS
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
   FECHA
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
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsed);
}

/* =========================================================
   TIEMPO DEL EVENTO
   ========================================================= */

function getTimeMeta(event) {
  if (!event?.fecha || !event?.hora) {
    return {
      imminent: false,
      upcoming: false,
    };
  }

  const eventDate = new Date(
    `${event.fecha}T${event.hora}:00-05:00`
  );

  if (Number.isNaN(eventDate.getTime())) {
    return {
      imminent: false,
      upcoming: false,
    };
  }

  const diffHours =
    (eventDate.getTime() - Date.now()) / 3600000;

  return {
    imminent:
      diffHours >= 0 &&
      diffHours <= 24,

    upcoming:
      diffHours > 24 &&
      diffHours <= 168,
  };
}

/* =========================================================
   FALLBACK VISUAL
   ========================================================= */

function getFallbackTheme(category) {
  const normalized = String(
    category || 'cine'
  )
    .trim()
    .toLowerCase();

  if (normalized.includes('terror')) {
    return 'event-card__image--terror';
  }

  if (normalized.includes('drama')) {
    return 'event-card__image--drama';
  }

  if (normalized.includes('comedia')) {
    return 'event-card__image--comedia';
  }

  if (normalized.includes('romance')) {
    return 'event-card__image--romance';
  }

  if (
    normalized.includes('archivo') ||
    normalized.includes('cine')
  ) {
    return 'event-card__image--cine';
  }

  return 'event-card__image--default';
}

function getFallbackSymbol(category) {
  const normalized = String(
    category || ''
  ).toLowerCase();

  if (normalized.includes('terror')) {
    return '◒';
  }

  if (normalized.includes('drama')) {
    return '◈';
  }

  if (normalized.includes('comedia')) {
    return '✦';
  }

  if (normalized.includes('romance')) {
    return '♡';
  }

  return '✦';
}

/* =========================================================
   IMAGEN DEL EVENTO
   ========================================================= */

function getEventImage(event) {
  /*
   * Primero intentamos usar la imagen local
   * correspondiente al evento.
   */

  if (event?.evento_id) {
    const localImage =
      EVENT_IMAGES[event.evento_id];

    if (localImage) {
      return localImage;
    }
  }

  /*
   * Si por alguna razón no existe una imagen
   * local, respetamos imagen_url del backend.
   */

  return event?.imagen || '';
}

/* =========================================================
   TARJETA
   ========================================================= */

export function createEventCard(event) {
  const card =
    document.createElement('article');

  const availability = Number(
    event.disponibilidad ?? 0
  );

  const meta =
    getTimeMeta(event);

  const isFull =
    availability <= 0;

  const image =
    getEventImage(event);

  /* =======================================================
     IMAGEN
     ======================================================= */

  const imageMarkup = image
    ? `
      <img
        class="event-card__image"
        src="${image}"
        alt="${
          event.titulo ||
          'Evento cinematográfico'
        }"
        loading="lazy"
      >
    `
    : `
      <div
        class="
          event-card__image
          event-card__image--fallback
          ${getFallbackTheme(event.categoria)}
        "
        aria-hidden="true"
      >
        <span
          class="event-card__fallback-symbol"
        >
          ${getFallbackSymbol(
            event.categoria
          )}
        </span>

        <span
          class="event-card__fallback-title"
        >
          ${
            event.titulo ||
            'CinéPass'
          }
        </span>

        <span
          class="event-card__fallback-category"
        >
          ${
            event.categoria ||
            'Cine'
          }
        </span>
      </div>
    `;

  /* =======================================================
     CLASE DE TARJETA
     ======================================================= */

  card.className = [
    'event-card',
    isFull
      ? 'event-card--full'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  /* =======================================================
     DISPONIBILIDAD
     ======================================================= */

  const availabilityText =
    isFull
      ? '0 cupos libres'
      : `${availability} cupos libres`;

  /* =======================================================
     ESTADO
     ======================================================= */

  let statusText =
    'Aforo disponible';

  if (isFull) {
    statusText =
      'Agotado · Lista de espera';
  } else if (meta.imminent) {
    statusText =
      'Inminente · <24h';
  } else if (meta.upcoming) {
    statusText =
      'Próximamente';
  }

  /* =======================================================
     BOTÓN
     ======================================================= */

  const buttonText =
    isFull
      ? 'Ver lista de espera'
      : 'Ver evento';

  /* =======================================================
     HTML
     ======================================================= */

  card.innerHTML = `
    <div class="event-card__media">

      ${imageMarkup}

      <div
        class="event-card__scrim"
        aria-hidden="true"
      ></div>

      <span
        class="event-card__category"
      >
        ${
          event.categoria ||
          'CINE'
        }
      </span>

      <span
        class="
          event-card__status-badge
          ${
            isFull
              ? 'event-card__status-badge--full'
              : meta.imminent
                ? 'event-card__status-badge--imminent'
                : ''
          }
        "
      >
        ${statusText}
      </span>

      <div
        class="event-card__media-info"
        aria-hidden="true"
      >
        <span>
          ${
            event.organizador ||
            'CinéPass'
          }
        </span>

        <span>
          ${
            event.categoria ||
            'Cine'
          }
        </span>
      </div>

    </div>

    <div class="event-card__content">

      <div class="event-card__meta">

        <span>
          ${formatDate(event.fecha)}
          ·
          ${
            event.hora ||
            '--:--'
          } H
        </span>

        <span>
          ${
            event.ubicacion ||
            'Lugar por confirmar'
          }
        </span>

      </div>

      <h3
        class="event-card__title"
      >
        ${
          event.titulo ||
          'Evento sin nombre'
        }
      </h3>

      <p
        class="event-card__description"
      >
        ${
          event.descripcion ||
          'Una experiencia cinematográfica de EventPass.'
        }
      </p>

      <div
        class="event-card__footer"
      >

        <div
          class="
            event-card__availability-block
            ${
              isFull
                ? 'event-card__availability-block--full'
                : ''
            }
          "
        >

          <span>
            Aforo restante
          </span>

          <strong
            class="
              ${
                isFull
                  ? 'event-card__availability--full'
                  : ''
              }
            "
          >
            ${availabilityText}
          </strong>

        </div>

        <button
          class="event-card__button"
          type="button"
        >
          <span>
            ${buttonText}
          </span>

          <span
            class="event-card__button-arrow"
            aria-hidden="true"
          >
            →
          </span>
        </button>

      </div>

    </div>
  `;

  /* =======================================================
     NAVEGACIÓN
     ======================================================= */

  const goToEvent = () => {
    if (!event.evento_id) {
      return;
    }

    window.location.hash =
      `#evento?id=${encodeURIComponent(
        event.evento_id
      )}`;
  };

  /* Click en tarjeta */

  card.addEventListener(
    'click',
    (clickEvent) => {
      if (
        clickEvent.target.closest(
          '.event-card__button'
        )
      ) {
        return;
      }

      goToEvent();
    }
  );

  /* Click en botón */

  card
    .querySelector(
      '.event-card__button'
    )
    ?.addEventListener(
      'click',
      goToEvent
    );

  return card;
}