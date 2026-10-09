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
    throw new Error("No se ha configurado la URL del workflow de n8n.");
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
      `n8n respondió con un formato no válido. HTTP ${response.status}`,
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `Error HTTP ${response.status}`,
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
export async function getEventsByCategory(categoria, visitorId = "") {
  return getCatalog({
    tipo: "FILTRO",
    categoria,
    visitorId,
  });
}

/**
 * Obtiene el detalle de un evento.
 */
export async function getEventById(eventoId, visitorId = "") {
  return getCatalog({
    tipo: "DETALLE",
    eventoId,
    visitorId,
  });
}

/**
 * Operaciones de usuarios mediante WF01.
 */
export async function createUser({ nombre, email, password }) {
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
export async function loginUser({ email, password }) {
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
    method: 'POST',
    body: JSON.stringify({
      operacion: 'READ',
      usuario_id: usuarioId
    })
  });
}

/**
 * Actualiza el perfil del usuario mediante WF01.
 */
export async function updateUser({
  usuarioId,
  nombre,
  email
}) {
  return request(N8N_WF01_URL, {
    method: 'POST',
    body: JSON.stringify({
      operacion: 'UPDATE',
      usuario_id: usuarioId,
      nombre,
      email
    })
  });
}

/**
 * Solicita un código temporal para vincular Telegram.
 */
export async function requestTelegramLink({
  usuarioId,
  sessionToken
}) {
  return request(N8N_WF03_URL, {
    method: 'POST',
    body: JSON.stringify({
      usuario_id: usuarioId,
      session_token: sessionToken
    })
  });
}

export async function getTelegramStatus({
  usuarioId,
  sessionToken
}) {
  return request(N8N_WF03_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      operation: "ESTADO",
      usuario_id: usuarioId,
      session_token: sessionToken
    })
  });
}

export async function createRegistration({
  sessionToken,
  eventoId,
  nombreAcreditacion,
  observaciones = ""
}) {
  return request(N8N_WF06_URL, {
    method: "POST",
    body: JSON.stringify({
      operation: "CREATE",
      session_token: sessionToken,
      evento_id: eventoId,
      nombre_acreditacion: nombreAcreditacion,
      observaciones,
      origen: "WEB"
    })
  });
}

export async function getRegistrations(sessionToken) {
  return request(N8N_WF06_URL, {
    method: "POST",
    body: JSON.stringify({
      operation: "READ",
      session_token: sessionToken,
    }),
  });
}

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

export async function checkInRegistration({
  inscripcionId,
  eventoId,
}) {
  return request(N8N_WF11_URL, {
    method: "POST",
    body: JSON.stringify({
      inscripcion_id: inscripcionId,
      evento_id: eventoId,
    }),
  });
}