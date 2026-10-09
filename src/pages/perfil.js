import {
  getUserProfile,
  updateUser,
  requestTelegramLink,
  getTelegramStatus,
  getRegistrations,
  cancelRegistration,
  checkInRegistration,
} from "../services/api.js";


export function createPerfilPage() {

  const page = document.createElement("div");

  page.className = "profile-page";


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
                  required
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

              <strong
                class="telegram-status__value"
                id="telegram-status-value"
              >
                Pulsa para comprobar
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


  // =========================================================
  // ELEMENTOS
  // =========================================================

  const profileForm =
    page.querySelector("#profile-form");

  const profileMessage =
    page.querySelector("#profile-message");

  const telegramButton =
    page.querySelector("#telegram-link-btn");

  const telegramMessage =
    page.querySelector("#telegram-message");


  // =========================================================
  // ACTUALIZAR PERFIL
  // =========================================================

  profileForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const usuarioId =
        localStorage.getItem(
          "eventpass_usuario_id"
        );


      const nombre =
        page
          .querySelector("#profile-nombre")
          .value
          .trim();


      const email =
        page
          .querySelector("#profile-email")
          .value
          .trim();


      if (!usuarioId) {

        profileMessage.textContent =
          "No hay una sesión de usuario válida.";

        profileMessage.className =
          "form-message form-message--error";

        return;
      }


      if (!nombre || !email) {

        profileMessage.textContent =
          "Nombre y correo son obligatorios.";

        profileMessage.className =
          "form-message form-message--error";

        return;
      }


      const submitButton =
        profileForm.querySelector(
          'button[type="submit"]'
        );


      try {

        submitButton.disabled = true;

        submitButton.textContent =
          "Guardando...";


        profileMessage.textContent =
          "Guardando cambios...";

        profileMessage.className =
          "form-message";


        const response =
          await updateUser({
            usuarioId,
            nombre,
            email
          });


        if (response?.ok === false) {

          throw new Error(
            response.mensaje ||
            "No fue posible actualizar el perfil."
          );

        }


        profileMessage.textContent =
          "Perfil actualizado correctamente.";

        profileMessage.className =
          "form-message form-message--success";


      } catch (error) {

        console.error(
          "Error actualizando perfil:",
          error
        );


        profileMessage.textContent =
          error.message ||
          "No fue posible actualizar el perfil.";

        profileMessage.className =
          "form-message form-message--error";


      } finally {

        submitButton.disabled = false;

        submitButton.textContent =
          "Guardar cambios";

      }

    }
  );



  // =========================================================
  // VINCULAR TELEGRAM
  // =========================================================

  telegramButton.addEventListener(
    "click",
    async () => {

      const usuarioId =
        localStorage.getItem(
          "eventpass_usuario_id"
        );


      const sessionToken =
        localStorage.getItem(
          "eventpass_session_token"
        );


      if (!usuarioId || !sessionToken) {

        telegramMessage.textContent =
          "Tu sesión no es válida. Inicia sesión nuevamente.";

        telegramMessage.className =
          "form-message form-message--error";

        return;
      }


      try {

        telegramButton.disabled = true;

        telegramButton.textContent =
          "Comprobando...";


        telegramMessage.textContent =
          "Comprobando estado de Telegram...";

        telegramMessage.className =
          "form-message";


        // -------------------------------------------------
        // PRIMERO COMPROBAMOS SI YA ESTÁ VINCULADO
        // -------------------------------------------------

        const currentStatus =
          await getTelegramStatus({
            usuarioId,
            sessionToken
          });


        if (
          currentStatus?.ok &&
          currentStatus?.vinculado
        ) {

          setTelegramLinkedState(page);

          return;
        }


        // -------------------------------------------------
        // SI NO ESTÁ VINCULADO, GENERAMOS CÓDIGO
        // -------------------------------------------------

        telegramButton.textContent =
          "Generando código...";


        telegramMessage.textContent =
          "Generando código de vinculación...";

        telegramMessage.className =
          "form-message";


        const response =
          await requestTelegramLink({
            usuarioId,
            sessionToken
          });


        if (!response?.ok) {

          throw new Error(
            response?.mensaje ||
            "No fue posible generar el código de vinculación."
          );

        }


        // -------------------------------------------------
        // MOSTRAR CÓDIGO
        // -------------------------------------------------

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

          El código tiene una vigencia de
          <strong>10 minutos</strong>.
        `;


        telegramMessage.className =
          "form-message form-message--success";


        telegramButton.textContent =
          "Esperando vinculación...";


        // -------------------------------------------------
        // COMENZAR A COMPROBAR
        // -------------------------------------------------

        waitForTelegramLink(page);


      } catch (error) {

        console.error(
          "Error generando código de Telegram:",
          error
        );


        telegramMessage.textContent =
          error.message ||
          "No fue posible generar el código de vinculación.";

        telegramMessage.className =
          "form-message form-message--error";


        telegramButton.disabled = false;

        telegramButton.textContent =
          "Vincular Telegram";

      }

    }
  );



  // =========================================================
  // CARGAR DATOS INICIALES
  // =========================================================

  loadUserProfile(page);
  loadUserRegistrations(page);


  return page;
}



// =========================================================
// CONSULTAR PERFIL
// =========================================================

async function loadUserProfile(page) {

  const usuarioId =
    localStorage.getItem(
      "eventpass_usuario_id"
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
        "No fue posible consultar el perfil."
      );

    }


    const user =
      response.usuario;


    const nameInput =
      page.querySelector(
        "#profile-nombre"
      );


    const emailInput =
      page.querySelector(
        "#profile-email"
      );


    const stateInput =
      page.querySelector(
        "#profile-estado"
      );


    nameInput.value =
      user.nombre || "";


    emailInput.value =
      user.email_normalizado || "";


    stateInput.value =
      user.estado || "";


  } catch (error) {

    console.error(
      "Error cargando perfil:",
      error
    );


    const message =
      page.querySelector(
        "#profile-message"
      );


    message.textContent =
      error.message ||
      "No fue posible cargar tu perfil.";


    message.className =
      "form-message form-message--error";

  }

}

function formatRegistrationDate(date) {
  if (!date) {
    return 'Fecha por confirmar';
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

// =========================================================
// CARGAR INSCRIPCIONES
// =========================================================

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
      'Consultando tus inscripciones...';

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

    /* =========================================
       SIN INSCRIPCIONES
       ========================================= */

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
            href="#agenda"
            class="btn btn-outline"
          >
            Explorar eventos →
          </a>

        </div>
      `;

      return;
    }

    /* =========================================
       CONTADOR
       ========================================= */

    status.textContent =
      `${inscripciones.length} ${
        inscripciones.length === 1
          ? 'inscripción'
          : 'inscripciones'
      }`;

    status.className =
      'form-message form-message--success';

    /* =========================================
       TARJETAS
       ========================================= */

    inscripciones.forEach((inscripcion) => {
      const item =
        document.createElement('article');

      item.className =
        'registration-item';

      const estado =
        String(
          inscripcion.estado || 'SIN ESTADO'
        ).toUpperCase();

      let estadoClass =
        'registration-item__status';

      let estadoLabel =
        estado;

      if (estado === 'CONFIRMADA') {
        estadoClass +=
          ' registration-item__status--confirmed';

        estadoLabel =
          'Confirmada';
      }

      if (estado === 'LISTA_ESPERA') {
        estadoClass +=
          ' registration-item__status--waiting';

        estadoLabel =
          'Lista de espera';
      }

      if (estado === 'CANCELADA') {
        estadoClass +=
          ' registration-item__status--cancelled';

        estadoLabel =
          'Cancelada';
      }

      const inscripcionId = inscripcion.inscripcion_id;

      const puedeHacerCheckin =
        estado === "CONFIRMADA" && Boolean(inscripcionId);

      const yaAsistio = estado === "ASISTIO";
      

      item.innerHTML = `
        <div class="registration-item__top">

          <span class="registration-item__label">
            INSCRIPCIÓN
          </span>

          <span class="${estadoClass}">
            ${estadoLabel}
          </span>

        </div>

        <div class="registration-item__main">

          <span class="registration-item__event-label">
            Evento
          </span>

          <h3 class="registration-item__title">
            ${
              inscripcion.evento_nombre ||
              inscripcion.evento_id ||
              'Evento EventPass'
            }
          </h3>

          ${
            inscripcion.nombre_acreditacion
              ? `
                <p class="registration-item__guest">
                  A nombre de
                  <strong>
                    ${inscripcion.nombre_acreditacion}
                  </strong>
                </p>
              `
              : ''
          }

        </div>

        <div class="registration-item__meta">

          ${
            inscripcion.fecha_inscripcion
              ? `
                <div>
                  <span>
                    Fecha de inscripción
                  </span>

                  <strong>
                    ${formatRegistrationDate(
                      inscripcion.fecha_inscripcion
                    )}
                  </strong>
                </div>
              `
              : ''
          }

          <div>
            <span>
              Estado
            </span>

            <strong>
              ${estadoLabel}
            </strong>
          </div>

        </div>

        ${
          estado !== 'CANCELADA'
            ? `

        <div class="registration-item__actions">

          ${
            puedeHacerCheckin
              ? `
                <button
                  type="button"
                  class="btn registration-checkin-button"
                  data-inscripcion-id="${inscripcionId}"
                  data-evento-id="${inscripcion.evento_id}"
                >
                  Registrar asistencia
                </button>
              `
              : yaAsistio
                ? `
                  <button type="button" class="btn" disabled>
                    Asistencia registrada ✓
                  </button>
                `
                : ''
          }

          <button
            type="button"
            class="btn btn-outline registration-cancel-button"
            data-evento-id="${inscripcion.evento_id}"
          >
            Cancelar inscripción
          </button>

        </div>

            `
            : ''
        }
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

      
    const checkinButton = item.querySelector(
      ".registration-checkin-button"
    );

    console.log(
      "Botón de check-in encontrado:",
      Boolean(checkinButton)
    );

    if (checkinButton) {
      checkinButton.addEventListener("click", async () => {
        console.log("Clic en Registrar asistencia detectado");

        // El resto de tu función actual continúa aquí.

    const inscripcionId =
      checkinButton.dataset.inscripcionId;

    const eventoId =
      checkinButton.dataset.eventoId;

    checkinButton.disabled = true;
    checkinButton.textContent = "Registrando asistencia...";

    status.textContent = "Procesando check-in...";
    status.className = "form-message";

    try {
      const response = await checkInRegistration({
        inscripcionId,
        eventoId,
      });

      if (
        response?.ok !== true ||
        response?.resultado !== "EXITOSO"
      ) {
        throw new Error(
          response?.detalle ||
          response?.error ||
          "No fue posible registrar la asistencia."
        );
      }

      status.textContent =
        "¡Check-in exitoso! Tu asistencia quedó registrada.";

      status.className =
        "form-message form-message--success";

      await loadUserRegistrations(page);
    } catch (error) {
      console.error("Error en el check-in:", error);

      status.textContent =
        error.message ||
        "No fue posible registrar la asistencia.";

      status.className =
        "form-message form-message--error";

      checkinButton.disabled = false;
      checkinButton.textContent = "Registrar asistencia";
    }
  });
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



// =========================================================
// CANCELAR INSCRIPCIÓN
// =========================================================

async function cancelUserRegistration(
  page,
  eventoId
) {

  const sessionToken =
    localStorage.getItem(
      "eventpass_session_token"
    );


  const status =
    page.querySelector(
      "#registrations-status"
    );


  if (!sessionToken || !eventoId) {

    status.textContent =
      "No fue posible cancelar la inscripción.";

    status.className =
      "form-message form-message--error";

    return;
  }


  try {

    status.textContent =
      "Cancelando inscripción...";

    status.className =
      "form-message";


    const response =
      await cancelRegistration({
        sessionToken,
        eventoId
      });


    if (response?.ok === false) {

      throw new Error(
        response.mensaje ||
        "No fue posible cancelar la inscripción."
      );

    }


    status.textContent =
      "Inscripción cancelada correctamente.";

    status.className =
      "form-message form-message--success";


    await loadUserRegistrations(page);


  } catch (error) {

    console.error(
      "Error cancelando inscripción:",
      error
    );


    status.textContent =
      error.message ||
      "No fue posible cancelar la inscripción.";


    status.className =
      "form-message form-message--error";

  }

}



// =========================================================
// CARGAR ESTADO DE TELEGRAM
// =========================================================

async function loadTelegramStatus(page) {

  const usuarioId =
    localStorage.getItem(
      "eventpass_usuario_id"
    );


  const sessionToken =
    localStorage.getItem(
      "eventpass_session_token"
    );


  const statusElement =
    page.querySelector(
      "#telegram-status-value"
    );


  if (!statusElement) {
    return;
  }


  if (!usuarioId || !sessionToken) {

    statusElement.textContent =
      "No disponible";

    return;
  }


  try {

    const response =
      await getTelegramStatus({
        usuarioId,
        sessionToken
      });


    if (!response?.ok) {

      throw new Error(
        response?.mensaje ||
        "No fue posible consultar Telegram."
      );

    }


    if (response.vinculado) {

      setTelegramLinkedState(page);

    } else {

      statusElement.textContent =
        "No vinculado";


      const telegramButton =
        page.querySelector(
          "#telegram-link-btn"
        );


      if (telegramButton) {

        telegramButton.disabled = false;

        telegramButton.textContent =
          "Vincular Telegram";

      }

    }


  } catch (error) {

    console.error(
      "Error consultando estado de Telegram:",
      error
    );


    statusElement.textContent =
      "No disponible";

  }

}



// =========================================================
// ESTADO TELEGRAM VINCULADO
// =========================================================

function setTelegramLinkedState(page) {

  const statusElement =
    page.querySelector(
      "#telegram-status-value"
    );


  const telegramButton =
    page.querySelector(
      "#telegram-link-btn"
    );


  const telegramMessage =
    page.querySelector(
      "#telegram-message"
    );


  if (statusElement) {

    statusElement.textContent =
      "Vinculado";

  }


  if (telegramButton) {

    telegramButton.disabled =
      true;

    telegramButton.textContent =
      "Telegram vinculado";

  }


  if (telegramMessage) {

    telegramMessage.innerHTML = "";

    telegramMessage.className =
      "form-message hidden";

  }

}



// =========================================================
// ESPERAR VINCULACIÓN TELEGRAM
// =========================================================

async function waitForTelegramLink(page) {

  const statusElement =
    page.querySelector(
      "#telegram-status-value"
    );


  const telegramMessage =
    page.querySelector(
      "#telegram-message"
    );


  if (!statusElement) {
    return;
  }


  const usuarioId =
    localStorage.getItem(
      "eventpass_usuario_id"
    );


  const sessionToken =
    localStorage.getItem(
      "eventpass_session_token"
    );


  if (!usuarioId || !sessionToken) {
    return;
  }


  // -------------------------------------------------
  // 10 minutos
  // 3 segundos entre comprobaciones
  // -------------------------------------------------

  const maxAttempts = 200;

  let attempts = 0;


  const checkStatus =
    async () => {

      attempts++;


      try {

        const response =
          await getTelegramStatus({
            usuarioId,
            sessionToken
          });


        if (
          response?.ok &&
          response?.vinculado
        ) {

          // -------------------------------------------
          // YA SE VINCULÓ CORRECTAMENTE
          // -------------------------------------------

          setTelegramLinkedState(page);

          return;

        }


        // -------------------------------------------
        // TODAVÍA NO ESTÁ VINCULADO
        // -------------------------------------------

        if (
          attempts < maxAttempts
        ) {

          setTimeout(
            checkStatus,
            3000
          );

        } else {

          telegramMessage.textContent =
            "El código ha expirado. Genera uno nuevo.";

          telegramMessage.className =
            "form-message form-message--error";


          const telegramButton =
            page.querySelector(
              "#telegram-link-btn"
            );


          if (telegramButton) {

            telegramButton.disabled =
              false;

            telegramButton.textContent =
              "Vincular Telegram";

          }

        }


      } catch (error) {

        console.error(
          "Error comprobando vinculación de Telegram:",
          error
        );


        if (
          attempts < maxAttempts
        ) {

          setTimeout(
            checkStatus,
            3000
          );

        }

      }

    };


  // -------------------------------------------------
  // PRIMERA COMPROBACIÓN DESPUÉS DE 3 SEGUNDOS
  // -------------------------------------------------

  setTimeout(
    checkStatus,
    3000
  );

}