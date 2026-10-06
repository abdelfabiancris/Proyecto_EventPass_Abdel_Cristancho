import { createEventCard } from "../components/eventCard.js";
import { getEvents } from "../services/api.js";

export function createHomePage() {
  const page = document.createElement("div");

  page.className = "home-page";

  page.innerHTML += `
    <main>

      <section class="hero">

        <div class="hero__overlay"></div>

        <div class="container hero__content">

          <p class="hero__eyebrow">
            EVENTPASS · EXPERIENCIAS CINEMATOGRÁFICAS
          </p>

          <h1 class="hero__title">
            Vive el cine.
            <br>
            <span>Más allá de la pantalla.</span>
          </h1>

          <p class="hero__description">
            Descubre eventos, encuentros y experiencias
            creadas para quienes viven el cine de verdad.
          </p>

          <div class="hero__actions">
            <a href="#eventos" class="btn">
              Explorar eventos
            </a>

            <a href="#categorias" class="btn btn-outline">
              Ver categorías
            </a>
          </div>

        </div>

        <div class="hero__scroll">
          <span>Descubre</span>
          <span class="hero__scroll-line"></span>
        </div>

      </section>

      <section id="eventos" class="events">

        <div class="container">

          <div class="events__header">

            <div>
              <p class="events__eyebrow">
                01 · Agenda
              </p>

              <h2 class="events__title">
                Eventos destacados
              </h2>
            </div>

            <p class="events__description">
              Encuentra tu próxima experiencia cinematográfica
              y reserva tu lugar.
            </p>

          </div>

          <div id="events-status" class="form-message">
            Cargando eventos...
          </div>

          <div class="events__grid"></div>

        </div>

      </section>

      <section id="categorias" class="categories section">

        <div class="container">

          <div class="events__header">

            <div>
              <p class="events__eyebrow">
                02 · Explora
              </p>

              <h2 class="events__title">
                Explora por categoría
              </h2>
            </div>

          </div>

          <div class="categories__grid">

            <a href="#eventos" class="category">
              <span class="category__number">01</span>
              <span class="category__name">Cine</span>
            </a>

            <a href="#eventos" class="category">
              <span class="category__number">02</span>
              <span class="category__name">Terror</span>
            </a>

            <a href="#eventos" class="category">
              <span class="category__number">03</span>
              <span class="category__name">Drama</span>
            </a>

            <a href="#eventos" class="category">
              <span class="category__number">04</span>
              <span class="category__name">Comedia</span>
            </a>

          </div>

        </div>

      </section>

    </main>
  `;

  const eventsGrid = page.querySelector(".events__grid");
  const status = page.querySelector("#events-status");

  loadEvents(eventsGrid, status);

  return page;
}

async function loadEvents(eventsGrid, status) {
  try {
    status.textContent = "Cargando eventos...";
    status.className = "form-message";

    let visitorId = localStorage.getItem("eventpass_visitor_id");

    if (!visitorId) {
      visitorId =
        "VIS-" + Math.random().toString(36).slice(2, 10).toUpperCase();

      localStorage.setItem("eventpass_visitor_id", visitorId);
    }

    const response = await getEvents(visitorId);

    const events = Array.isArray(response?.eventos) ? response.eventos : [];

    eventsGrid.innerHTML = "";

    if (events.length === 0) {
      status.textContent = "No hay eventos publicados en este momento.";

      status.className = "form-message";

      return;
    }

    events.forEach((event) => {
      const card = createEventCard({
        evento_id: event.evento_id,
        titulo: event.nombre,
        categoria: event.categoria,
        fecha: event.fecha,
        ubicacion: event.lugar,
        descripcion: event.descripcion,
        disponibilidad: event.cupos_disponibles,
        imagen: event.imagen_url,
        estado: event.estado,
      });

      eventsGrid.appendChild(card);
    });

    status.textContent = `${events.length} eventos disponibles`;

    status.className = "form-message form-message--success";
  } catch (error) {
    console.error("Error cargando eventos:", error);

    status.textContent = error.message || "No fue posible cargar los eventos.";

    status.className = "form-message form-message--error";
  }
}
