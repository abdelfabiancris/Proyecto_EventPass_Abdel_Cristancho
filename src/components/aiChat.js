
import { createChat } from '@n8n/chat';

export function initAssistantChat() {
  if (document.querySelector('#n8n-chat')) {
    return;
  }

  const webhookUrl =
    import.meta.env.VITE_N8N_WF10_URL;

  if (!webhookUrl) {
    console.error(
      'VITE_N8N_WF10_URL no está configurada.'
    );

    return;
  }

  let visitorId =
    localStorage.getItem(
      'eventpass_visitor_id'
    );

  if (!visitorId) {
    visitorId =
      window.crypto?.randomUUID?.() ||
      `VIS-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;

    localStorage.setItem(
      'eventpass_visitor_id',
      visitorId
    );
  }

  const usuarioId =
    localStorage.getItem(
      'eventpass_usuario_id'
    ) || '';

  const chatContainer =
    document.createElement('div');

  chatContainer.id = 'n8n-chat';

  document.body.appendChild(
    chatContainer
  );

  createChat({
    webhookUrl,

    target: '#n8n-chat',

    mode: 'window',

    loadPreviousSession: true,

    chatInputKey: 'chatInput',

    chatSessionKey: 'sessionId',

    metadata: {
      usuario_id: usuarioId,
      visitor_id: visitorId,
    },

    showWelcomeScreen: true,

    initialMessages: [
        'Bienvenido a CinéPass. 🎬',
        'Puedo ayudarte con eventos, fechas, lugares, categorías y el funcionamiento de la plataforma.',
        ],

    i18n: {
      en: {
        title:
          'CinéPass Assistant',

        subtitle:
          'Tu asistente cinematográfico',

        footer:
          'EventPass · Soporte informativo',

        getStarted:
          'Nueva conversación',

        inputPlaceholder:
          'Escribe tu pregunta...',
      },
    },
  });
}