import { loginUser } from "../services/api.js";

export function createLoginPage() {
  const page = document.createElement("div");

  page.className = "form-page";

  page.innerHTML = `
    <main class="form-container">

      <div class="form-header">
        <p class="form-eyebrow">
          EventPass · Acceso
        </p>

        <h1 class="form-title">
          Iniciar sesión
        </h1>

        <p class="form-description">
          Entra a tu cuenta para descubrir eventos
          y gestionar tus inscripciones.
        </p>
      </div>

      <form class="auth-form" id="login-form" novalidate>

        <div class="form-group">
          <label
            for="login-email"
            class="form-label"
          >
            Correo electrónico
          </label>

          <input
            type="email"
            id="login-email"
            name="email"
            class="form-input"
            placeholder="correo@ejemplo.com"
            required
          >
        </div>

        <div class="form-group">
          <label
            for="login-password"
            class="form-label"
          >
            Contraseña
          </label>

          <input
            type="password"
            id="login-password"
            name="password"
            class="form-input"
            placeholder="Tu contraseña"
            required
          >
        </div>

        <div
          id="login-message"
          class="form-message hidden"
          role="alert"
        ></div>

        <button
          type="submit"
          class="btn form-submit"
        >
          Entrar
        </button>

      </form>

      <div class="form-footer">
        <span>
          ¿Todavía no tienes una cuenta?
        </span>

        <a
          href="#registro"
          class="form-link"
        >
          Crear cuenta
        </a>
      </div>

    </main>
  `;

  const form = page.querySelector("#login-form");
  const message = page.querySelector("#login-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      message.textContent = "Completa todos los campos.";

      message.className = "form-message form-message--error";

      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Entrando...";

      message.textContent = "Verificando tus credenciales...";

      message.className = "form-message";

      const response = await loginUser({
        email,
        password,
      });

      if (response?.ok === false) {
        throw new Error(response.mensaje || "Email o contraseña incorrectos.");
      }

      if (!response?.session_token) {
        throw new Error("El servidor no devolvió una sesión válida.");
      }

      localStorage.setItem("eventpass_session_token", response.session_token);

      localStorage.setItem("eventpass_usuario_id", response.usuario_id);

      localStorage.setItem("eventpass_session_id", response.session_id);

      message.textContent = "Inicio de sesión correcto.";

      message.className = "form-message form-message--success";

      setTimeout(() => {
        window.location.hash = "#perfil";
      }, 800);
    } catch (error) {
      console.error("Error iniciando sesión:", error);

      message.textContent = error.message || "No fue posible iniciar sesión.";

      message.className = "form-message form-message--error";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Entrar";
    }
  });

  return page;
}
