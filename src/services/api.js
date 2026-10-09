const N8N_WF01_URL = import.meta.env.VITE_N8N_WF01_URL;
const N8N_WF02_URL = import.meta.env.VITE_N8N_WF02_URL;
const N8N_WF05_URL = import.meta.env.VITE_N8N_WF05_URL;
const N8N_WF03_URL = import.meta.env.VITE_N8N_WF03_URL;
const N8N_WF06_URL = import.meta.env.VITE_N8N_WF06_URL;
const N8N_WF11_URL = import.meta.env.VITE_N8N_WF11_URL;

/**
 * Realiza una petición HTTP a n8n.
 */
async function request(url, options = {}) {
  if (!url) {
    throw new Error(
      "No se ha configurado la URL del workflow de n8n."
    );
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `n8n respondió con un formato no válido. HTTP ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Error HTTP ${response.status}`
    );
  }

  return data;
}

/**
 * Consulta el catálogo público.
 *
 * operation:
 * LISTADO
 * DETALLE
 * FILTRO
 */
export async function getCatalog({
  tipo = "LISTADO",
  eventoId = "",
  categoria = "",
  visitorId = "",
} = {}) {
  return request(N8N_WF05_URL, {
    method: "POST",
    body: JSON.stringify({
      operation: tipo,
      evento_id: eventoId,
      categoria,
      visitor_id: visitorId,
    }),
  });
}

/**
 * Obtiene todos los eventos publicados.
 */
export async function getEvents(visitorId = "") {
  return getCatalog({
    tipo: "LISTADO",
    visitorId,
  });
}

/**
 * Obtiene eventos por categoría.
 */
export async function getEventsByCategory(
  categoria,
  visitorId = ""
) {
  return getCatalog({
    tipo: "FILTRO",
    categoria,
    visitorId,
  });
}

/**
 * Obtiene el detalle de un evento.
 */
export async function getEventById(
  eventoId,
  visitorId = ""
) {
  return getCatalog({
    tipo: "DETALLE",
    eventoId,
    visitorId,
  });
}

/**
 * Operaciones de usuarios mediante WF01.
 */
export async function createUser({
  nombre,
  email,
  password,
}) {
  return request(N8N_WF01_URL, {
    method: "POST",
    body: JSON.stringify({
      operacion: "CREATE",
      nombre,
      email,
      password,
    }),
  });
}

/**
 * Inicio de sesión mediante WF02.
 */
export async function loginUser({
  email,
  password,
}) {
  return request(N8N_WF02_URL, {
    method: "POST",
    body: JSON.stringify({
      operacion: "LOGIN",
      email,
      password,
    }),
  });
}

/**
 * Cierra una sesión activa.
 */
export async function logoutUser(sessionToken) {
  return request(N8N_WF02_URL, {
    method: "POST",
    body: JSON.stringify({
      operacion: "LOGOUT",
      session_token: sessionToken,
    }),
  });
}

/**
 * Valida una sesión existente.
 */
export async function validateSession(sessionToken) {
  return request(N8N_WF02_URL, {
    method: "POST",
    body: JSON.stringify({
      operacion: "VALIDATE",
      session_token: sessionToken,
    }),
  });
}

/**
 * Consulta el perfil del usuario mediante WF01.
 */
export async function getUserProfile(usuarioId) {
  return request(N8N_WF01_URL, {
    method: "POST",
    body: JSON.stringify({
      operacion: "READ",
      usuario_id: usuarioId,
    }),
  });
}

/**
 * Actualiza el perfil del usuario mediante WF01.
 */
export async function updateUser({
  usuarioId,
  nombre,
  email,
}) {
  return request(N8N_WF01_URL, {
    method: "POST",
    body: JSON.stringify({
      operacion: "UPDATE",
      usuario_id: usuarioId,
      nombre,
      email,
    }),
  });
}

/**
 * Solicita un código temporal para vincular Telegram.
 */
export async function requestTelegramLink({
  usuarioId,
  sessionToken,
}) {
  return request(N8N_WF03_URL, {
    method: "POST",
    body: JSON.stringify({
      usuario_id: usuarioId,
      session_token: sessionToken,
    }),
  });
}

/**
 * Consulta el estado de vinculación de Telegram.
 */
export async function getTelegramStatus({
  usuarioId,
  sessionToken,
}) {
  return request(N8N_WF03_URL, {
    method: "POST",
    body: JSON.stringify({
      operation: "ESTADO",
      usuario_id: usuarioId,
      session_token: sessionToken,
    }),
  });
}

/**
 * Crea una inscripción mediante WF06.
 */
export async function createRegistration({
  sessionToken,
  eventoId,
  nombreAcreditacion,
  observaciones = "",
}) {
  return request(N8N_WF06_URL, {
    method: "POST",
    body: JSON.stringify({
      operation: "CREATE",
      session_token: sessionToken,
      evento_id: eventoId,
      nombre_acreditacion: nombreAcreditacion,
      observaciones,
      origen: "WEB",
    }),
  });
}

/**
 * Consulta las inscripciones mediante WF06.
 */
export async function getRegistrations(sessionToken) {
  return request(N8N_WF06_URL, {
    method: "POST",
    body: JSON.stringify({
      operation: "READ",
      session_token: sessionToken,
    }),
  });
}

/**
 * Cancela una inscripción mediante WF06.
 */
export async function cancelRegistration({
  sessionToken,
  eventoId,
}) {
  return request(N8N_WF06_URL, {
    method: "POST",
    body: JSON.stringify({
      operation: "CANCEL",
      session_token: sessionToken,
      evento_id: eventoId,
    }),
  });
}

/**
 * Ejecuta el check-in mediante WF11.
 *
 * A diferencia de request(), esta función devuelve el cuerpo
 * de la respuesta aunque n8n responda con HTTP 409.
 *
 * Así, la interfaz puede interpretar el resultado DUPLICADO.
 * Los errores de red y las respuestas que no sean JSON válido
 * siguen generando un error.
 */
export async function checkInRegistration({
  inscripcionId,
  eventoId,
}) {
  if (!N8N_WF11_URL) {
    throw new Error(
      "No se ha configurado la URL del workflow WF11."
    );
  }

  const response = await fetch(N8N_WF11_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inscripcion_id: inscripcionId,
      evento_id: eventoId,
    }),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `WF11 respondió con un formato no válido. HTTP ${response.status}`
    );
  }

  // Un 409 puede representar un intento duplicado.
  // Devolvemos el cuerpo para que perfil.js interprete
  // response.resultado y muestre el mensaje correspondiente.
  if (response.status === 409) {
    return {
      ...data,
      httpStatus: response.status,
    };
  }

  // Los demás errores HTTP se manejan de forma explícita.
  if (!response.ok) {
    return {
      ...data,
      httpStatus: response.status,
      ok: false,
    };
  }

  return {
    ...data,
    httpStatus: response.status,
  };
}