import {
  getUserProfile,
  updateUser,
  requestTelegramLink,
  getRegistrations,
  cancelRegistration
} from '../services/api.js';

export function createPerfilPage() {
  const page = document.createElement('div');

  page.className = 'profile-page';

  page.innerHTML = `
    <main class="profile">

      <div class="container">

        <!-- =========================
             ENCABEZADO
             ========================= -->

        <div class="profile__header">

          <p class="form-eyebrow">
            EventPass · Mi cuenta
          </p>

          <h1 class="profile__title">
            Mi perfil
          </h1>

          <p class="profile__description">
            Consulta y actualiza la información de tu cuenta.
          </p>

        </div>


        <!-- =========================
             TARJETAS DEL PERFIL
             ========================= -->

        <div class="profile__grid">


          <!-- =========================
               INFORMACIÓN PERSONAL
               ========================= -->

          <section class="profile-card">

            <div class="profile-card__header">

              <span class="profile-card__number">
                01
              </span>

              <h2 class="profile-card__title">
                Información personal
              </h2>

            </div>


            <form id="profile-form" novalidate>

              <div class="form-group">

                <label
                  for="profile-nombre"
                  class="form-label"
                >
                  Nombre
                </label>

                <input
                  type="text"
                  id="profile-nombre"
                  name="nombre"
                  class="form-input"
                  value="Usuario EventPass"
                  required
                >

              </div>


              <div class="form-group">

                <label
                  for="profile-email"
                  class="form-label"
                >
                  Correo electrónico
                </label>

                <input
                  type="email"
                  id="profile-email"
                  name="email"
                  class="form-input"
                  value="usuario@eventpass.com"
                  disabled
                >

              </div>


              <div class="form-group">

                <label
                  for="profile-estado"
                  class="form-label"
                >
                  Estado de cuenta
                </label>

                <input
                  type="text"
                  id="profile-estado"
                  class="form-input"
                  value="ACTIVO"
                  disabled
                >

              </div>


              <div
                id="profile-message"
                class="form-message hidden"
                role="alert"
              ></div>


              <button
                type="submit"
                class="btn"
              >
                Guardar cambios
              </button>

            </form>

          </section>


          <!-- =========================
               TELEGRAM
               ========================= -->

          <section class="profile-card">

            <div class="profile-card__header">

              <span class="profile-card__number">
                02
              </span>

              <h2 class="profile-card__title">
                Telegram
              </h2>

            </div>


            <div class="telegram-status">

              <span class="telegram-status__label">
                Estado de vinculación
              </span>

              <strong class="telegram-status__value">
                No vinculado
              </strong>

              <p class="telegram-status__description">
                Vincula tu cuenta de Telegram para recibir
                notificaciones sobre tus eventos e inscripciones.
              </p>

            </div>


            <button
              type="button"
              id="telegram-link-btn"
              class="btn btn-outline"
            >
              Vincular Telegram
            </button>


            <div
              id="telegram-message"
              class="form-message hidden"
              role="alert"
            ></div>

          </section>


          <!-- =========================
               MIS INSCRIPCIONES
               ========================= -->

          <section class="profile-card profile-card--wide">

            <div class="profile-card__header">

              <span class="profile-card__number">
                03
              </span>

              <h2 class="profile-card__title">
                Mis inscripciones
              </h2>

            </div>


            <div
              id="registrations-status"
              class="form-message"
            >
              Cargando inscripciones...
            </div>


            <div
              id="registrations-list"
              class="registrations-list"
            ></div>

          </section>


        </div>

      </div>

    </main>
  `;


  // =========================
  // ELEMENTOS DEL PERFIL
  // =========================

  const profileForm =
    page.querySelector('#profile-form');

  const profileMessage =
    page.querySelector('#profile-message');

  const telegramButton =
    page.querySelector('#telegram-link-btn');

  const telegramMessage =
    page.querySelector('#telegram-message');


  // =========================
  // ACTUALIZAR PERFIL
  // =========================

  profileForm.addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();

      const usuarioId =
        localStorage.getItem(
          'eventpass_usuario_id'
        );

      const nombre =
        page
          .querySelector('#profile-nombre')
          .value
          .trim();

      const email =
        page
          .querySelector('#profile-email')
          .value
          .trim();


      if (!usuarioId) {

        profileMessage.textContent =
          'No hay una sesión de usuario válida.';

        profileMessage.className =
          'form-message form-message--error';

        return;
      }


      if (!nombre || !email) {

        profileMessage.textContent =
          'Nombre y correo son obligatorios.';

        profileMessage.className =
          'form-message form-message--error';

        return;
      }


      const submitButton =
        profileForm.querySelector(
          'button[type="submit"]'
        );


      try {

        submitButton.disabled = true;

        submitButton.textContent =
          'Guardando...';

        profileMessage.textContent =
          'Guardando cambios...';

        profileMessage.className =
          'form-message';


        const response =
          await updateUser({
            usuarioId,
            nombre,
            email
          });


        if (response?.ok === false) {

          throw new Error(
            response.mensaje ||
            'No fue posible actualizar el perfil.'
          );

        }


        profileMessage.textContent =
          'Perfil actualizado correctamente.';

        profileMessage.className =
          'form-message form-message--success';


      } catch (error) {

        console.error(
          'Error actualizando perfil:',
          error
        );


        profileMessage.textContent =
          error.message ||
          'No fue posible actualizar el perfil.';

        profileMessage.className =
          'form-message form-message--error';


      } finally {

        submitButton.disabled = false;

        submitButton.textContent =
          'Guardar cambios';

      }

    }
  );


  // =========================
  // VINCULAR TELEGRAM
  // =========================

  telegramButton.addEventListener(
    'click',
    async () => {

      const usuarioId =
        localStorage.getItem(
          'eventpass_usuario_id'
        );

      const sessionToken =
        localStorage.getItem(
          'eventpass_session_token'
        );


      if (!usuarioId || !sessionToken) {

        telegramMessage.textContent =
          'Tu sesión no es válida. Inicia sesión nuevamente.';

        telegramMessage.className =
          'form-message form-message--error';

        return;
      }


      try {

        telegramButton.disabled = true;

        telegramButton.textContent =
          'Generando código...';


        telegramMessage.textContent =
          'Generando código de vinculación...';

        telegramMessage.className =
          'form-message';


        const response =
          await requestTelegramLink({
            usuarioId,
            sessionToken
          });


        if (!response?.ok) {

          throw new Error(
            response?.mensaje ||
            'No fue posible generar el código de vinculación.'
          );

        }


        telegramMessage.innerHTML = `
          <strong>
            Código: ${response.codigo}
          </strong>
          <br><br>

          Abre Telegram y envía al bot:
          <br>

          <strong>
            /vincular ${response.codigo}
          </strong>

          <br><br>

          El código tiene una vigencia de 10 minutos.
        `;


        telegramMessage.className =
          'form-message form-message--success';


        telegramButton.textContent =
          'Código generado';


      } catch (error) {

        console.error(
          'Error generando código de Telegram:',
          error
        );


        telegramMessage.textContent =
          error.message ||
          'No fue posible generar el código de vinculación.';

        telegramMessage.className =
          'form-message form-message--error';


        telegramButton.disabled = false;

        telegramButton.textContent =
          'Vincular Telegram';

      }

    }
  );


  // =========================
  // CARGAR PERFIL
  // =========================

  loadUserProfile(page);
  loadUserRegistrations(page);


  return page;
}


// =========================
// CONSULTAR PERFIL
// =========================

async function loadUserProfile(page) {

  const usuarioId =
    localStorage.getItem(
      'eventpass_usuario_id'
    );


  if (!usuarioId) {
    return;
  }


  try {

    const response =
      await getUserProfile(usuarioId);


    if (
      !response?.ok ||
      !response?.usuario
    ) {

      throw new Error(
        response?.mensaje ||
        'No fue posible consultar el perfil.'
      );

    }


    const user =
      response.usuario;


    const nameInput =
      page.querySelector(
        '#profile-nombre'
      );


    const emailInput =
      page.querySelector(
        '#profile-email'
      );


    const stateInput =
      page.querySelector(
        '#profile-estado'
      );


    nameInput.value =
      user.nombre || '';


    emailInput.value =
      user.email_normalizado || '';


    stateInput.value =
      user.estado || '';


  } catch (error) {

    console.error(
      'Error cargando perfil:',
      error
    );


    const message =
      page.querySelector(
        '#profile-message'
      );


    message.textContent =
      error.message ||
      'No fue posible cargar tu perfil.';


    message.className =
      'form-message form-message--error';

  }

}

// =========================
// CARGAR INSCRIPCIONES
// =========================

async function loadUserRegistrations(page) {
  const sessionToken = localStorage.getItem(
    'eventpass_session_token'
  );

  const status = page.querySelector(
    '#registrations-status'
  );

  const list = page.querySelector(
    '#registrations-list'
  );

  if (!sessionToken) {
    status.textContent =
      'No hay una sesión válida.';

    status.className =
      'form-message form-message--error';

    return;
  }

  try {
    status.textContent =
      'Cargando tus inscripciones...';

    status.className =
      'form-message';

    list.innerHTML = '';

    const response =
      await getRegistrations(sessionToken);

    if (response?.ok === false) {
      throw new Error(
        response.mensaje ||
        'No fue posible consultar tus inscripciones.'
      );
    }

    const inscripciones =
      Array.isArray(response?.inscripciones)
        ? response.inscripciones
        : [];

    if (inscripciones.length === 0) {
      status.textContent =
        'Todavía no tienes inscripciones.';

      status.className =
        'form-message';

      list.innerHTML = `
        <div class="registration-empty">
          <span class="registration-empty__number">
            00
          </span>

          <h3>
            Sin inscripciones
          </h3>

          <p>
            Cuando reserves un evento,
            aparecerá aquí.
          </p>

          <a
            href="#eventos"
            class="btn btn-outline"
          >
            Explorar eventos
          </a>
        </div>
      `;

      return;
    }

    status.textContent =
      `${inscripciones.length} inscripción${
        inscripciones.length === 1 ? '' : 'es'
      }`;

    status.className =
      'form-message form-message--success';

    inscripciones.forEach((inscripcion) => {
      const item =
        document.createElement('article');

      item.className =
        'registration-item';

      const estado =
        inscripcion.estado || '';

      let estadoClass =
        'registration-item__status';

      if (estado === 'CONFIRMADA') {
        estadoClass +=
          ' registration-item__status--confirmed';
      }

      if (estado === 'LISTA_ESPERA') {
        estadoClass +=
          ' registration-item__status--waiting';
      }

      if (estado === 'CANCELADA') {
        estadoClass +=
          ' registration-item__status--cancelled';
      }

      item.innerHTML = `
        <div class="registration-item__info">

          <span class="registration-item__label">
            Evento
          </span>

          <h3 class="registration-item__title">
            ${inscripcion.evento_id || 'Evento EventPass'}
          </h3>

          ${
            inscripcion.nombre_acreditacion
              ? `
                <p>
                  A nombre de:
                  <strong>
                    ${inscripcion.nombre_acreditacion}
                  </strong>
                </p>
              `
              : ''
          }

          ${
            inscripcion.fecha_inscripcion
              ? `
                <p>
                  Inscripción:
                  ${inscripcion.fecha_inscripcion}
                </p>
              `
              : ''
          }

        </div>

        <div class="registration-item__actions">

          <span class="${estadoClass}">
            ${estado || 'SIN ESTADO'}
          </span>

          ${
            estado !== 'CANCELADA'
              ? `
                <button
                  type="button"
                  class="btn btn-outline registration-cancel-button"
                  data-evento-id="${inscripcion.evento_id}"
                >
                  Cancelar inscripción
                </button>
              `
              : ''
          }

        </div>
      `;

      const cancelButton =
        item.querySelector(
          '.registration-cancel-button'
        );

      if (cancelButton) {
        cancelButton.addEventListener(
          'click',
          async () => {
            await cancelUserRegistration(
              page,
              inscripcion.evento_id
            );
          }
        );
      }

      list.appendChild(item);
    });

  } catch (error) {
    console.error(
      'Error cargando inscripciones:',
      error
    );

    status.textContent =
      error.message ||
      'No fue posible cargar tus inscripciones.';

    status.className =
      'form-message form-message--error';

    list.innerHTML = '';
  }
}


// =========================
// CANCELAR INSCRIPCIÓN
// =========================

async function cancelUserRegistration(
  page,
  eventoId
) {
  const sessionToken =
    localStorage.getItem(
      'eventpass_session_token'
    );

  const status =
    page.querySelector(
      '#registrations-status'
    );

  if (!sessionToken || !eventoId) {
    status.textContent =
      'No fue posible cancelar la inscripción.';

    status.className =
      'form-message form-message--error';

    return;
  }

  try {
    status.textContent =
      'Cancelando inscripción...';

    status.className =
      'form-message';

    const response =
      await cancelRegistration({
        sessionToken,
        eventoId
      });

    if (response?.ok === false) {
      throw new Error(
        response.mensaje ||
        'No fue posible cancelar la inscripción.'
      );
    }

    status.textContent =
      'Inscripción cancelada correctamente.';

    status.className =
      'form-message form-message--success';

    await loadUserRegistrations(page);

  } catch (error) {
    console.error(
      'Error cancelando inscripción:',
      error
    );

    status.textContent =
      error.message ||
      'No fue posible cancelar la inscripción.';

    status.className =
      'form-message form-message--error';
  }
}