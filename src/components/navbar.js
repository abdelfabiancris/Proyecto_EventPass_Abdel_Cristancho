import { logoutUser } from '../services/api.js';

export function createNavbar() {
  const navbar = document.createElement('header');

  navbar.className = 'navbar';

  const sessionToken = localStorage.getItem(
    'eventpass_session_token'
  );

  navbar.innerHTML = `
    <div class="navbar__container">

      <!-- LOGO -->
      <a
        href="#inicio"
        class="navbar__logo"
        aria-label="CinéPass inicio"
      >
        <span class="navbar__logo-main">
          CINÉPASS
        </span>

        <span class="navbar__logo-sub">
          CINE · EVENTOS · EXPERIENCIAS
        </span>
      </a>

      <!-- NAVEGACIÓN -->
      <nav
        class="navbar__nav"
        aria-label="Navegación principal"
      >
        <a
          href="#inicio"
          class="navbar__link"
          data-route="inicio"
        >
          Inicio
        </a>

        <a
          href="#agenda"
          class="navbar__link"
          data-route="agenda"
        >
          Eventos
        </a>

        <a
          href="#categorias"
          class="navbar__link"
          data-route="categorias"
        >
          Categorías
        </a>
      </nav>

      <!-- ACCIONES -->
      <div class="navbar__actions">

        ${
          sessionToken
            ? `
              <a
                href="#perfil"
                class="navbar__login"
                data-route="perfil"
              >
                Mi perfil
              </a>

              <button
                type="button"
                class="navbar__button navbar__button--ghost"
                id="logout-button"
              >
                Cerrar sesión
              </button>
            `
            : `
              <a
                href="#login"
                class="navbar__login"
                data-route="login"
              >
                Iniciar sesión
              </a>

              <a
                href="#registro"
                class="navbar__button"
              >
                Registrarme
              </a>
            `
        }

        <!-- MENU MOBILE -->
        <button
          type="button"
          class="navbar__toggle"
          aria-label="Abrir menú"
          aria-expanded="false"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </div>

    <!-- MENU MOBILE -->
    <div
      class="navbar__mobile-menu"
      aria-hidden="true"
    >
      <a
        href="#inicio"
        class="navbar__mobile-link"
        data-route="inicio"
      >
        Inicio
      </a>

      <a
        href="#agenda"
        class="navbar__mobile-link"
        data-route="agenda"
      >
        Eventos
      </a>

      <a
        href="#categorias"
        class="navbar__mobile-link"
        data-route="categorias"
      >
        Categorías
      </a>

      ${
        sessionToken
          ? `
            <a
              href="#perfil"
              class="navbar__mobile-link"
              data-route="perfil"
            >
              Mi perfil
            </a>
          `
          : `
            <a
              href="#login"
              class="navbar__mobile-link"
              data-route="login"
            >
              Iniciar sesión
            </a>

            <a
              href="#registro"
              class="navbar__mobile-link navbar__mobile-link--accent"
              data-route="registro"
            >
              Registrarme
            </a>
          `
      }
    </div>
  `;

  /* =========================================
     RUTA ACTUAL
     ========================================= */

  const currentHash = window.location.hash;

  function getCurrentRoute() {
    if (
      currentHash === '' ||
      currentHash === '#' ||
      currentHash === '#inicio'
    ) {
      return 'inicio';
    }

    if (
      currentHash === '#agenda' ||
      currentHash.startsWith('#evento?')
    ) {
      return 'agenda';
    }

    if (currentHash === '#categorias') {
      return 'categorias';
    }

    if (currentHash === '#login') {
      return 'login';
    }

    if (currentHash === '#registro') {
      return 'registro';
    }

    if (currentHash === '#perfil') {
      return 'perfil';
    }

    return '';
  }

  const currentRoute = getCurrentRoute();

  /* =========================================
     NAVEGACIÓN DESKTOP
     ========================================= */

  const routeLinks =
    navbar.querySelectorAll('[data-route]');

  routeLinks.forEach((link) => {
    const isActive =
      link.dataset.route === currentRoute;

    link.classList.toggle(
      'navbar__link--active',
      isActive
    );

    link.classList.toggle(
      'navbar__login--active',
      isActive &&
        link.classList.contains('navbar__login')
    );

    if (isActive) {
      link.setAttribute(
        'aria-current',
        'page'
      );
    } else {
      link.removeAttribute(
        'aria-current'
      );
    }
  });

  /* =========================================
     MENU MOBILE
     ========================================= */

  const toggle =
    navbar.querySelector(
      '.navbar__toggle'
    );

  const mobileMenu =
    navbar.querySelector(
      '.navbar__mobile-menu'
    );

  toggle?.addEventListener(
    'click',
    () => {
      const isOpen =
        mobileMenu.classList.toggle(
          'navbar__mobile-menu--open'
        );

      toggle.classList.toggle(
        'navbar__toggle--open',
        isOpen
      );

      toggle.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

      mobileMenu.setAttribute(
        'aria-hidden',
        String(!isOpen)
      );
    }
  );

  mobileMenu
    ?.querySelectorAll('a')
    .forEach((link) => {
      link.addEventListener(
        'click',
        () => {
          mobileMenu.classList.remove(
            'navbar__mobile-menu--open'
          );

          toggle.classList.remove(
            'navbar__toggle--open'
          );

          toggle.setAttribute(
            'aria-expanded',
            'false'
          );

          mobileMenu.setAttribute(
            'aria-hidden',
            'true'
          );
        }
      );
    });

  /* =========================================
     LOGOUT
     ========================================= */

  const logoutButton =
    navbar.querySelector(
      '#logout-button'
    );

  logoutButton?.addEventListener(
    'click',
    async () => {
      const token =
        localStorage.getItem(
          'eventpass_session_token'
        );

      try {
        logoutButton.disabled = true;

        logoutButton.textContent =
          'Saliendo...';

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

        window.location.hash =
          '#login';
      }
    }
  );

  return navbar;
}