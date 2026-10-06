import { createEventCard } from '../components/eventCard.js';
import { getEvents, getEventsByCategory } from '../services/api.js';

export function createHomePage() {
  const page = document.createElement('div');
  page.className = 'home-page';

  page.innerHTML = `
    <main>
      <section class="hero" id="inicio">
        <div class="hero__backdrop"></div>
        <div class="hero__scrim"></div>
        <div class="hero__glow hero__glow--left"></div>

        <div class="container hero__container">
          <div class="hero__copy">
            <div class="hero__eyebrow">
              <span class="hero__eyebrow-dot"></span>
              EVENTPASS · EXPERIENCIAS CINEMATOGRÁFICAS
            </div>

            <h1 class="hero__title">
              Vive el cine.<br>
              <span>Más allá</span> de la pantalla.
            </h1>

            <p class="hero__description">
              Descubre eventos, encuentros y experiencias creadas para quienes viven el cine de verdad.
              Funciones especiales, retrospectivas y experiencias que comienzan mucho antes de la proyección.
            </p>

            <div class="hero__actions">
              <a class="btn hero__primary" href="#agenda">Explorar eventos <span>→</span></a>
              <a class="btn btn-outline" href="#categorias">Ver categorías</a>
            </div>
          </div>

          <div class="hero__side-note" aria-hidden="true">
            <span>DESCUBRE</span>
            <i></i>
          </div>
        </div>
      </section>

      <section class="events" id="agenda">
        <div class="container">
          <div class="section-heading">
            <div>
              <span class="section-heading__eyebrow">01 · AGENDA</span>
              <h2 class="section-heading__title">Eventos destacados</h2>
            </div>
            <p class="section-heading__description">
              Encuentra tu próxima experiencia cinematográfica y reserva tu lugar en nuestras funciones y encuentros.
            </p>
          </div>

          <div class="events__status-bar">
            <div class="events__status-main">
              <span class="events__live-dot"></span>
              <span id="events-count">Sincronizando cartelera…</span>
            </div>
            <div class="events__legend">
              <span><i class="legend-dot legend-dot--free"></i>Cupos libres</span>
              <span><i class="legend-dot legend-dot--soon"></i>Inminente</span>
              <span><i class="legend-dot legend-dot--full"></i>Agotado · lista de espera</span>
            </div>
          </div>

          <div id="events-status" class="form-message events__message">
            Cargando cartelera…
          </div>

          <div id="events-grid" class="events__grid" aria-live="polite"></div>
        </div>
      </section>

      <section class="categories" id="categorias">
        <div class="container">
          <div class="section-heading section-heading--compact">
            <div>
              <span class="section-heading__eyebrow">02 · EXPLORA</span>
              <h2 class="section-heading__title">Explora por categoría</h2>
            </div>
          </div>

          <div class="categories__grid" id="categories-grid">
            <button class="category category--active" type="button" data-category="">
              <span class="category__number">01</span>
              <span class="category__name">Toda la cartelera</span>
              <span class="category__action">Explorar →</span>
            </button>
          </div>
        </div>
      </section>

      <section class="concierge">
        <div class="container">
          <div class="concierge__card">
            <div class="concierge__mark">✦</div>
            <div class="concierge__copy">
              <span class="concierge__eyebrow">SISTEMA INTEGRADO EVENTPASS CORE</span>
              <h2>Validación inmediata con Concierge Telegram</h2>
              <p>
                Vincula tu cuenta de Telegram y recibe confirmaciones, recordatorios y avisos importantes de tus eventos.
              </p>
            </div>
            <a class="btn btn-outline concierge__button" href="#perfil">Abrir mi perfil →</a>
          </div>
        </div>
      </section>

      <footer class="site-footer">
        <div class="container">
          <div class="site-footer__grid">
            <div>
              <h3>CINÉPASS</h3>
              <p>
                Experiencias cinematográficas, eventos y encuentros para quienes entienden el cine como una experiencia que trasciende la pantalla.
              </p>
              <span class="site-footer__heritage">✦ EXPERIENCIAS CINEMATOGRÁFICAS</span>
            </div>

            <div>
              <h4>Cartelera & horarios</h4>
              <p>Consulta eventos publicados y disponibilidad en tiempo real.</p>
              <a href="#agenda">Ver cartelera →</a>
            </div>

            <div>
              <h4>Tu cuenta</h4>
              <a href="#login">Iniciar sesión</a>
              <a href="#registro">Crear cuenta</a>
              <a href="#perfil">Mi perfil</a>
            </div>

            <div>
              <h4>EventPass</h4>
              <p>Asistencia conversacional, Telegram, recordatorios y notificaciones centralizadas.</p>
              <a href="#categorias">Explorar experiencias →</a>
            </div>
          </div>

          <div class="site-footer__bottom">
            <span>© ${new Date().getFullYear()} EventPass · Proyecto académico</span>
            <div>
              <a href="#inicio">Volver arriba ↑</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  `;

  const grid = page.querySelector('#events-grid');
  const status = page.querySelector('#events-status');
  const count = page.querySelector('#events-count');
  const categoriesGrid = page.querySelector('#categories-grid');

  renderCategories(categoriesGrid);

  loadEvents(grid, status, count, categoriesGrid);

  return page;
}

function ensureVisitorId() {
  let visitorId = localStorage.getItem('eventpass_visitor_id');

  if (!visitorId) {
    visitorId = `VIS-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    localStorage.setItem('eventpass_visitor_id', visitorId);
  }

  return visitorId;
}

function getPublishedEvents(response) {
  return Array.isArray(response?.eventos) ? response.eventos : [];
}

function buildCategories(events) {
  return [...new Set(
    events
      .map((event) => String(event.categoria || '').trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'es'));
}

function getCategoryMeta(category) {
  const normalized = String(category || '')
    .trim()
    .toLowerCase();

  if (normalized.includes('terror')) {
    return {
      icon: '◒',
      description:
        'Historias oscuras, tensión y clásicos del horror.',
    };
  }

  if (normalized.includes('drama')) {
    return {
      icon: '◈',
      description:
        'Historias profundas, personajes y grandes actuaciones.',
    };
  }

  if (normalized.includes('comedia')) {
    return {
      icon: '✦',
      description:
        'Humor, ironía y experiencias para disfrutar en pantalla.',
    };
  }

  if (normalized.includes('romance')) {
    return {
      icon: '♡',
      description:
        'Historias de amor, encuentros y emociones inolvidables.',
    };
  }

  if (
    normalized.includes('cine') ||
    normalized.includes('archivo')
  ) {
    return {
      icon: '▣',
      description:
        'Clásicos, retrospectivas y patrimonio cinematográfico.',
    };
  }

  return {
    icon: '✦',
    description:
      'Descubre experiencias y encuentros alrededor del cine.',
  };
}

function renderCategories(categoriesGrid) {
  const categories = [
    {
      name: 'Toda la cartelera',
      value: '',
      icon: '▦',
      description:
        'Explora todas las experiencias cinematográficas publicadas.',
    },
    {
      name: 'Cine',
      value: 'Cine',
      icon: '▣',
      description:
        'Clásicos, retrospectivas y grandes experiencias cinematográficas.',
    },
    {
      name: 'Terror',
      value: 'Terror',
      icon: '◒',
      description:
        'Historias oscuras, tensión y clásicos del horror.',
    },
    {
      name: 'Drama',
      value: 'Drama',
      icon: '◈',
      description:
        'Historias profundas, personajes y grandes actuaciones.',
    },
    {
      name: 'Comedia',
      value: 'Comedia',
      icon: '✦',
      description:
        'Humor, ironía y experiencias para disfrutar en pantalla.',
    },
    {
      name: 'Romance',
      value: 'Romance',
      icon: '♡',
      description:
        'Historias de amor, encuentros y emociones inolvidables.',
    },
  ];

  categoriesGrid.innerHTML = categories
    .map(
      (category, index) => `
        <button
          class="category ${
            index === 0 ? 'category--active' : ''
          }"
          type="button"
          data-category="${category.value}"
        >

          <div class="category__top">

            <span class="category__number">
              ${String(index + 1).padStart(2, '0')}
            </span>

            <span
              class="category__icon"
              aria-hidden="true"
            >
              ${category.icon}
            </span>

          </div>

          <div class="category__body">

            <span class="category__name">
              ${category.name}
            </span>

            <span class="category__description">
              ${category.description}
            </span>

          </div>

          <span class="category__action">
            Explorar →
          </span>

        </button>
      `
    )
    .join('');
}

function renderEvents(eventsGrid, events) {
  eventsGrid.innerHTML = '';

  events.forEach((event) => {
    eventsGrid.appendChild(
      createEventCard({
        evento_id: event.evento_id,
        titulo: event.nombre,
        categoria: event.categoria,
        fecha: event.fecha,
        hora: event.hora,
        ubicacion: event.lugar,
        descripcion: event.descripcion,
        disponibilidad: event.cupos_disponibles,
        imagen: event.imagen_url,
        estado: event.estado,
      })
    );
  });
}

async function loadEvents(eventsGrid, status, count, categoriesGrid) {
  try {
    status.textContent = 'Cargando cartelera…';
    status.className = 'form-message events__message';

    const visitorId = ensureVisitorId();
    const response = await getEvents(visitorId);
    const events = getPublishedEvents(response);

    if (!events.length) {
      count.textContent = 'No hay eventos publicados';
      status.textContent = 'No hay eventos publicados en este momento.';
      renderCategories(categoriesGrid);
      return;
    }

    renderEvents(eventsGrid, events);
    renderCategories(categoriesGrid);

    count.textContent = `${events.length} evento${events.length === 1 ? '' : 's'} publicado${events.length === 1 ? '' : 's'} · sincronización en tiempo real (WF05)`;
    status.textContent = 'Cartelera actualizada correctamente.';
    status.className = 'form-message events__message events__message--success';

    categoriesGrid.querySelectorAll('[data-category]').forEach((button) => {
      button.addEventListener('click', async () => {
        const category = button.dataset.category || '';

        categoriesGrid.querySelectorAll('.category').forEach((item) => {
          item.classList.remove('category--active');
        });
        button.classList.add('category--active');

        try {
          status.textContent = category
            ? `Consultando ${category}…`
            : 'Consultando toda la cartelera…';
          status.className = 'form-message events__message';

          const filteredResponse = category
            ? await getEventsByCategory(category, visitorId)
            : await getEvents(visitorId);

          const filteredEvents = getPublishedEvents(filteredResponse);
          renderEvents(eventsGrid, filteredEvents);

          status.textContent = filteredEvents.length
            ? `${filteredEvents.length} experiencia${filteredEvents.length === 1 ? '' : 's'} encontrada${filteredEvents.length === 1 ? '' : 's'}.`
            : 'No hay eventos publicados en esta categoría.';
          status.className = 'form-message events__message events__message--success';
        } catch (error) {
          console.error('Error filtrando eventos:', error);
          status.textContent = error.message || 'No fue posible filtrar los eventos.';
          status.className = 'form-message events__message events__message--error';
        }
      });
    });
  } catch (error) {
    console.error('Error cargando eventos:', error);
    count.textContent = 'No se pudo sincronizar la cartelera';
    status.textContent = error.message || 'No fue posible cargar los eventos.';
    status.className = 'form-message events__message events__message--error';
  }
}
