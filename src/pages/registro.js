import { createUser } from "../services/api.js";

export function createRegistroPage() {
  const page = document.createElement("div");

  page.className = "form-page";

  page.innerHTML = `
    <main class="form-container">

      <div class="form-header">
        <p class="form-eyebrow">
          EventPass · Registro
        </p>

        <h1 class="form-title">
          Crear cuenta
        </h1>

        <p class="form-description">
          Regístrate para descubrir eventos y reservar
          tu lugar en tus experiencias favoritas.
        </p>
      </div>

      <form class="auth-form" id="registro-form" novalidate>

        <div class="form-row">

          <div class="form-group">
            <label
              for="registro-nombre"
              class="form-label"
            >
              Nombre
            </label>

            <input
              type="text"
              id="registro-nombre"
              name="nombre"
              class="form-input"
              placeholder="Tu nombre"
              required
            >
          </div>

          <div class="form-group">
            <label
              for="registro-apellido"
              class="form-label"
            >
              Apellido
            </label>

            <input
              type="text"
              id="registro-apellido"
              name="apellido"
              class="form-input"
              placeholder="Tu apellido"
              required
            >
          </div>

        </div>

        <div class="form-group">
          <label
            for="registro-email"
            class="form-label"
          >
            Correo electrónico
          </label>

          <input
            type="email"
            id="registro-email"
            name="email"
            class="form-input"
            placeholder="correo@ejemplo.com"
            required
          >
        </div>


        <div class="form-group">
          <label
            for="registro-password"
            class="form-label"
          >
            Contraseña
          </label>

          <input
            type="password"
            id="registro-password"
            name="password"
            class="form-input"
            placeholder="Crea una contraseña"
            required
          >
        </div>

        <div class="form-group">
          <label
            for="registro-password-confirm"
            class="form-label"
          >
            Confirmar contraseña
          </label>

          <input
            type="password"
            id="registro-password-confirm"
            name="passwordConfirm"
            class="form-input"
            placeholder="Repite tu contraseña"
            required
          >
        </div>

        <div
          id="registro-message"
          class="form-message hidden"
          role="alert"
        ></div>

        <button
          type="submit"
          class="btn form-submit"
        >
          Crear cuenta
        </button>

      </form>

      <div class="form-footer">
        <span>
          ¿Ya tienes una cuenta?
        </span>

        <a
          href="#login"
          class="form-link"
        >
          Iniciar sesión
        </a>
      </div>

    </main>
  `;

  const form = page.querySelector("#registro-form");
  const message = page.querySelector("#registro-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();


    const nombre = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const passwordConfirm = form.passwordConfirm.value;

    if (
      !nombre ||
      !apellido ||
      !email ||
      !password ||
      !passwordConfirm
    ) {
      message.textContent = "Completa todos los campos.";

      message.className = "form-message form-message--error";

      return;
    }

    if (password.length < 8) {
      message.textContent = "La contraseña debe tener mínimo 8 caracteres.";

      message.className = "form-message form-message--error";

      return;
    }

    if (password !== passwordConfirm) {
      message.textContent = "Las contraseñas no coinciden.";

      message.className = "form-message form-message--error";

      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Creando cuenta...";

      message.textContent = "Estamos creando tu cuenta...";

      message.className = "form-message";

      console.log("REGISTRO → antes de createUser");

      const usuario = await createUser({
        nombre: `${nombre} ${apellido}`,
        email,
        password,
      });

      console.log("REGISTRO → respuesta de createUser:", usuario);

      if (usuario?.ok === false) {
        throw new Error(usuario.mensaje || "No fue posible crear la cuenta.");
      }

      message.textContent =
        "Cuenta creada correctamente. Redirigiendo al inicio de sesión...";

      message.className = "form-message form-message--success";

      form.reset();

      setTimeout(() => {
        window.location.hash = "#login";
      }, 1500);
    } catch (error) {
      console.error("REGISTRO → ERROR COMPLETO:", error);
      console.error("REGISTRO → ERROR MESSAGE:", error?.message);
      console.error("REGISTRO → ERROR STACK:", error?.stack);

      message.textContent = error.message || "No fue posible crear la cuenta.";

      message.className = "form-message form-message--error";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Crear cuenta";
    }
  });

  return page;
}
