import { logoutUser } from '../services/api.js';

export function createNavbar() {
  const navbar = document.createElement('header');

  navbar.className = 'navbar';

  const sessionToken = localStorage.getItem(
    'eventpass_session_token'
  );

  navbar.innerHTML = `
    <div class="navbar__container">

      <a href="#" class="navbar__logo">
        <span class="navbar__logo-main">
          EventPass
        </span>

        <span class="navbar__logo-sub">
          Cine · Eventos · Experiencias
        </span>
      </a>

      <nav>
        <ul class="navbar__menu">

          <li>
            <a
              href="#"
              class="navbar__link"
            >
              Inicio
            </a>
          </li>

          <li>
            <a
              href="#eventos"
              class="navbar__link"
            >
              Eventos
            </a>
          </li>

          <li>
            <a
              href="#categorias"
              class="navbar__link"
            >
              Categorías
            </a>
          </li>

        </ul>
      </nav>

      <div class="navbar__actions">

        ${
          sessionToken
            ? `
              <a
                href="#perfil"
                class="navbar__login"
              >
                Mi perfil
              </a>

              <button
                type="button"
                class="btn"
                id="logout-button"
              >
                Cerrar sesión
              </button>
            `
            : `
              <a
                href="#login"
                class="navbar__link navbar__login"
              >
                Iniciar sesión
              </a>

              <a
                href="#registro"
                class="btn"
              >
                Registrarme
              </a>
            `
        }

        <button
          type="button"
          class="navbar__toggle"
          aria-label="Abrir menú"
        >
          ☰
        </button>

      </div>

    </div>
  `;

// =========================
// NAVEGACIÓN ACTIVA
// =========================

const currentHash = window.location.hash;

const navLinks = navbar.querySelectorAll(
  '.navbar__link'
);

// Quitar estado activo de todos
navLinks.forEach((link) => {
  link.classList.remove('navbar__link--active');
});

// =========================
// DETERMINAR PÁGINA ACTIVA
// =========================

let activeSelector = null;

if (
  currentHash === '#eventos' ||
  currentHash.startsWith('#evento?')
) {
  activeSelector = 'a[href="#eventos"]';

} else if (
  currentHash === '#categorias'
) {
  activeSelector = 'a[href="#categorias"]';

} else if (
  currentHash === '#login'
) {
  activeSelector = 'a[href="#login"]';

} else {
  // Cualquier otra situación corresponde al inicio
  activeSelector = 'nav a[href="#"]';
}

// =========================
// APLICAR ESTADO ACTIVO
// =========================

const activeLink = navbar.querySelector(
  activeSelector
);

if (activeLink) {
  activeLink.classList.add(
    'navbar__link--active'
  );
}

  // =========================
  // CERRAR SESIÓN
  // =========================

  const logoutButton = navbar.querySelector(
    '#logout-button'
  );

  if (logoutButton) {
    logoutButton.addEventListener(
      'click',
      async () => {
        const token = localStorage.getItem(
          'eventpass_session_token'
        );

        try {
          logoutButton.disabled = true;
          logoutButton.textContent = 'Saliendo...';

          if (token) {
            await logoutUser(token);
          }
        } catch (error) {
          console.error(
            'Error cerrando sesión:',
            error
          );
        } finally {
          localStorage.removeItem(
            'eventpass_session_token'
          );

          localStorage.removeItem(
            'eventpass_usuario_id'
          );

          localStorage.removeItem(
            'eventpass_session_id'
          );

          window.location.hash = '#login';
        }
      }
    );
  }

  return navbar;
}