import './style.css';

import './styles/variables.css';
import './styles/global.css';
import './styles/navbar.css';
import './styles/events.css';
import './styles/forms.css';
import './styles/profile.css';
import './styles/chat.css';

import { createNavbar } from './components/navbar.js';
import { initAssistantChat } from './components/aiChat.js';

import { createHomePage } from './pages/home.js';
import { createLoginPage } from './pages/login.js';
import { createRegistroPage } from './pages/registro.js';
import { createPerfilPage } from './pages/perfil.js';
import { createEventoPage } from './pages/evento.js';

import { validateSession } from './services/api.js';

const app = document.querySelector('#app');

async function router() {
  const hash = window.location.hash;

  app.innerHTML = '';

  // Navbar global
  app.appendChild(createNavbar());

  // =========================
  // PERFIL — RUTA PROTEGIDA
  // =========================

  if (hash === '#perfil') {
    const sessionToken = localStorage.getItem(
      'eventpass_session_token'
    );

    if (!sessionToken) {
      window.location.hash = '#login';
      return;
    }

    const loading = document.createElement('main');

    loading.className = 'form-page';

    loading.innerHTML = `
      <section class="form-container">

        <div class="form-header">
          <p class="form-eyebrow">
            EventPass · Seguridad
          </p>

          <h1 class="form-title">
            Verificando sesión
          </h1>

          <p class="form-description">
            Estamos comprobando que tu sesión siga activa.
          </p>
        </div>

      </section>
    `;

    app.appendChild(loading);

    try {
      const response = await validateSession(
        sessionToken
      );

      if (
        !response?.ok ||
        !response?.valida ||
        response?.estado_sesion !== 'ACTIVA'
      ) {
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
        return;
      }

      app.innerHTML = '';
      app.appendChild(createNavbar());
      app.appendChild(createPerfilPage());

      return;

    } catch (error) {
      console.error(
        'Error validando sesión:',
        error
      );

      app.innerHTML = '';
      app.appendChild(createNavbar());

      const errorPage = document.createElement('main');

      errorPage.className = 'form-page';

      errorPage.innerHTML = `
        <section class="form-container">

          <div class="form-header">
            <p class="form-eyebrow">
              EventPass · Error
            </p>

            <h1 class="form-title">
              No pudimos validar tu sesión
            </h1>

            <p class="form-description">
              Comprueba tu conexión e intenta nuevamente.
            </p>
          </div>

          <button
            type="button"
            class="btn form-submit"
            id="retry-session"
          >
            Intentar nuevamente
          </button>

        </section>
      `;

      errorPage
        .querySelector('#retry-session')
        .addEventListener('click', router);

      app.appendChild(errorPage);

      return;
    }
  }

  // =========================
  // RUTAS PÚBLICAS
  // =========================

  if (hash === '#login') {
    app.appendChild(createLoginPage());
    return;
  }

  if (hash === '#registro') {
    app.appendChild(createRegistroPage());
    return;
  }

  if (hash.startsWith('#evento?')) {
  app.appendChild(createEventoPage());
  return;
  }

  // Home por defecto
  app.appendChild(createHomePage());
}

window.addEventListener('hashchange', router);

router();

initAssistantChat();