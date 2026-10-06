# 🎬 EventPass — CinéPass

## 1. Nombre del proyecto

**EventPass — CinéPass**

Aplicación web para la gestión de eventos relacionados con el mundo del cine, desarrollada como proyecto integrador académico.

---

## 2. Estudiante

**Nombre:** [Escribe aquí tu nombre completo]

---

## 3. Descripción del proyecto

EventPass es una aplicación web orientada a la gestión de eventos. En esta implementación, la experiencia visual y temática está inspirada en el cine y se presenta bajo el concepto **CinéPass**.

La aplicación permite consultar un catálogo público de eventos, registrarse, iniciar y cerrar sesión, administrar información personal, vincular una cuenta de Telegram, consultar inscripciones y cancelar registros.

La lógica principal del sistema se encuentra centralizada en **n8n**, que funciona como capa de automatización y backend del proyecto.

El frontend funciona como cliente y realiza las solicitudes HTTP hacia los workflows de n8n. n8n se encarga de las validaciones, reglas de negocio, persistencia y comunicación con los diferentes servicios.

---

## 4. URL pública de Vercel

**URL:** [Agregar aquí la URL pública de Vercel]

> La aplicación deberá estar publicada en Vercel y la URL deberá encontrarse disponible al momento de la entrega.

---

# 5. Arquitectura general

La arquitectura del proyecto sigue el principio establecido para EventPass:

```text
┌─────────────────────────┐
│     Aplicación Web      │
│      Vercel / Vite      │
└────────────┬────────────┘
             │
             │ HTTP / Chat
             ▼
┌─────────────────────────┐
│           n8n           │
│  Workflows / Validación │
│    Reglas de negocio    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│      Google Sheets      │
│ Persistencia académica  │
└────────────┬────────────┘
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
    Gmail  Telegram  IA

    El frontend no se conecta directamente con Google Sheets.
Todas las operaciones de lectura y escritura pasan primero por n8n.
La arquitectura requerida establece que n8n sea responsable de las validaciones, decisiones del negocio, persistencia, estados, idempotencia, integraciones y notificaciones.    Texto pegado
6. Tecnologías utilizadas
Frontend
- HTML5
- CSS3
- JavaScript
- Vite
- JavaScript ES Modules
- Diseño responsive
- Componentes JavaScript reutilizables
Automatización y backend
- n8n
- Webhooks
- Form Trigger
- Schedule Trigger
- Telegram Trigger
- Chat Trigger
- Google Sheets
- Gmail
- Google Gemini / modelo de IA
Asistente conversacional
- @n8n/chat
Versión utilizada:
@ n8n/chat 1.4.1

Herramientas de desarrollo
- Visual Studio Code
- Git
- GitHub
- Vercel
7. Workflows de n8n
El proyecto cuenta con los 10 workflows obligatorios.
Workflow	Nombre	Responsabilidad
WF01	Usuarios CRUD	Crear, consultar, actualizar y desactivar usuarios
WF02	Autenticación y sesiones	Login, logout y validación de sesiones
WF03	Vinculación Telegram	Generación y validación de códigos de vinculación
WF04	Eventos CRUD	Administración de eventos
WF05	Catálogo público	Consulta pública y disponibilidad de eventos
WF06	Inscripciones CRUD	Crear, consultar, actualizar y cancelar inscripciones
WF07	Lista de espera	Reasignación automática de cupos
WF08	Recordatorios	Gestión de recordatorios
WF09	Notificaciones	Envío centralizado de notificaciones
WF10	Asistente EventPass	Atención conversacional mediante IA


Los archivos JSON de los workflows se encuentran en:
n8n/

8. Trigger utilizado por cada workflow
Workflow	Trigger principal
WF01_usuarios_crud	Webhook
WF02_auth_sesiones	Webhook
WF03_vinculacion_telegram	Webhook + Telegram Trigger
WF04_eventos_crud	Form Trigger
WF05_catalogo_publico	Webhook
WF06_inscripciones_crud	Webhook
WF07_reasignacion_lista_espera	Schedule Trigger
WF08_recordatorios	Schedule Trigger
WF09_notificaciones	Execute Sub-workflow Trigger
WF10_eventpass_assistant	Chat Trigger


El proyecto utiliza diferentes tipos de triggers para separar las operaciones HTTP, automatizaciones programadas, integración con Telegram y atención conversacional.
9. Google Sheets utilizados
La persistencia académica está distribuida en archivos independientes.
Archivo	Propósito
EP01_Usuarios	Información de usuarios
EP02_Sesiones	Sesiones de autenticación
EP03_Telegram	Vinculación de Telegram
EP04_Eventos	Información de eventos
EP05_Catalogo_Log	Registro de consultas del catálogo
EP06_Inscripciones	Inscripciones a eventos
EP07_Reasignaciones	Historial de reasignaciones
EP08_Recordatorios	Recordatorios
EP09_Notificaciones	Registro de notificaciones
EP10_Soporte	Información relacionada con soporte


Cada dominio mantiene su propia persistencia.
No se utiliza un único archivo de Google Sheets para almacenar todos los procesos.
10. Comunicación Frontend → n8n
El frontend utiliza variables de entorno para almacenar las URLs de los workflows.
Las solicitudes se realizan mediante HTTP utilizando JavaScript.
Flujo general:
Usuario
   ↓
Interfaz EventPass
   ↓
JavaScript
   ↓
Solicitud HTTP
   ↓
Webhook n8n
   ↓
Validación
   ↓
Reglas de negocio
   ↓
Google Sheets / servicios externos
   ↓
Respuesta JSON
   ↓
Frontend
   ↓
Interfaz actualizada

El frontend nunca realiza conexiones directas con Google Sheets.
11. Endpoints implementados
Los endpoints principales se encuentran definidos mediante las URLs de los workflows de n8n.
WF01 — Usuarios
Operaciones principales:
CREATE
READ
UPDATE
DEACTIVATE

Permite:
- Crear usuarios.
- Consultar perfiles.
- Actualizar información.
- Desactivar cuentas.
WF02 — Autenticación
Operaciones:
LOGIN
LOGOUT
VALIDATE

Permite:
- Iniciar sesión.
- Cerrar sesión.
- Validar una sesión existente.
- Comprobar expiración.
- Comprobar estado del usuario.
WF03 — Telegram
Permite:
Generar código de vinculación
Consultar estado de vinculación
Procesar código enviado desde Telegram

WF05 — Catálogo
Operaciones:
LISTADO
DETALLE
FILTRO

Permite consultar los eventos publicados y calcular su disponibilidad.
WF06 — Inscripciones
Operaciones:
CREATE
READ
UPDATE
CANCEL

Permite:
- Crear una inscripción.
- Consultar las inscripciones de un usuario.
- Actualizar una inscripción.
- Cancelar una inscripción.
- Gestionar disponibilidad y lista de espera.
12. Estados utilizados
Usuarios
ACTIVO
INACTIVO

Una cuenta desactivada no puede utilizarse para iniciar o mantener una sesión válida.
Eventos
BORRADOR
PUBLICADO
CERRADO
CANCELADO

Solamente los eventos con estado:
PUBLICADO

se muestran en el catálogo público.
Inscripciones
CONFIRMADA
LISTA_ESPERA
CANCELADA

Las inscripciones confirmadas ocupan un cupo.
Las inscripciones en lista de espera quedan pendientes de una posible reasignación.
13. Hashing de contraseñas
Las contraseñas no se almacenan directamente como texto plano.
Durante el registro se genera información de seguridad utilizando:
password
    ↓
salt
    ↓
hash
    ↓
password_hash

En la hoja de usuarios se almacenan:
password_hash
password_salt

Durante el login, el sistema recupera el salt almacenado y utiliza la contraseña proporcionada para generar nuevamente el hash y compararlo con el valor almacenado.
Esto permite evitar guardar la contraseña original.
14. Manejo de sesiones
El workflow WF02 administra las sesiones de los usuarios.
Una sesión contiene información relacionada con:
- Identificador de sesión.
- Usuario asociado.
- Fecha de creación.
- Fecha de expiración.
- Estado de la sesión.
Una sesión no debe considerarse válida cuando:
- No existe.
- Está cerrada.
- Está expirada.
- Pertenece a un usuario inactivo.
El frontend utiliza el token de sesión para realizar operaciones que requieren autenticación.
15. Idempotencia
La idempotencia se utiliza para evitar operaciones duplicadas cuando una misma solicitud puede llegar más de una vez.
En las operaciones relacionadas con inscripciones se realizan validaciones antes de crear un nuevo registro.
Entre las validaciones se considera:
- Usuario válido.
- Sesión válida.
- Evento existente.
- Evento publicado.
- Estado del usuario.
- Disponibilidad.
- Existencia de una inscripción previa.
Esto evita que una misma acción genere registros duplicados.
16. Lista de espera y reasignación
Cuando un evento no tiene cupos disponibles, una nueva inscripción puede pasar a:
LISTA_ESPERA

Cuando posteriormente se libera un cupo, el workflow WF07 analiza las inscripciones pendientes.
La prioridad de reasignación se determina mediante:
fecha_inscripcion ASC

Es decir, se prioriza a la persona que ingresó primero a la lista de espera.
El proceso general es:
Cupo liberado
      ↓
WF07
      ↓
Consultar inscripciones
      ↓
Buscar LISTA_ESPERA
      ↓
Ordenar por fecha de inscripción
      ↓
Seleccionar siguiente usuario
      ↓
Asignar cupo
      ↓
Registrar reasignación

17. Servicio central de notificaciones
Las notificaciones se gestionan mediante el workflow:
WF09_notificaciones

Este workflow funciona como servicio central para las notificaciones generadas por otros procesos.
Los canales contemplados son:
- Gmail
- Telegram
El objetivo es separar la lógica de negocio de la lógica encargada de enviar las comunicaciones.
18. Asistente IA
El proyecto incorpora un asistente conversacional para soporte de EventPass.
El asistente utiliza:
WF10_eventpass_assistant

El frontend integra el componente:
@n8n/chat

El flujo general es:
Usuario
   ↓
Chat EventPass
   ↓
n8n Chat Trigger
   ↓
Consulta de información
   ↓
Modelo de IA
   ↓
Respuesta
   ↓
Chat

Restricciones del asistente
El asistente funciona como un sistema de soporte y consulta.
No debe utilizarse para modificar directamente información crítica del sistema.
El asistente no debe:
- Crear usuarios.
- Eliminar usuarios.
- Modificar eventos.
- Cancelar inscripciones.
- Manipular directamente la base de datos.
- Ejecutar operaciones administrativas no autorizadas.
Su función principal es proporcionar información y asistencia conversacional.
19. Variables de entorno
El proyecto utiliza un archivo .env local para las URLs de los workflows de n8n.
Por seguridad, el archivo .env real no debe subirse al repositorio.
El repositorio incluye:
.env.example

Variables requeridas:
VITE_N8N_WF01_URL=
VITE_N8N_WF02_URL=
VITE_N8N_WF03_URL=
VITE_N8N_WF05_URL=
VITE_N8N_WF06_URL=
VITE_N8N_WF10_URL=

Estas variables permiten configurar las URLs de los workflows utilizados por el frontend.
No deben almacenarse en el repositorio:
- API Keys.
- Tokens de Telegram.
- Credenciales OAuth.
- Contraseñas reales.
- Secretos.
- Archivo .env privado.
20. Instalación y ejecución
Requisitos
Se recomienda tener instalado:
- Node.js
- npm
- Git
Clonar el proyecto
git clone https://github.com/abdelfabiancris/Proyecto_EventPass_Abdel_Cristancho.git

Ingresar al proyecto:
cd Proyecto_EventPass_Abdel_Cristancho

Instalar dependencias
npm install

Configurar variables de entorno
Crear un archivo:
.env

a partir de:
.env.example

Agregar las URLs correspondientes a los workflows de n8n.
Ejecutar en desarrollo
npm run dev

Vite mostrará la dirección local para acceder a la aplicación.
Crear build de producción
npm run build

Previsualizar el build
npm run preview

Estructura del proyecto
Proyecto_EventPass_Abdel_Cristancho/
│
├── n8n/
│   ├── WF01_usuarios_crud.json
│   ├── WF02_auth_sesiones.json
│   ├── WF03_vinculacion_telegram.json
│   ├── WF04_eventos_crud.json
│   ├── WF05_catalogo_publico.json
│   ├── WF06_inscripciones_crud.json
│   ├── WF07_reasignacion_lista_espera.json
│   ├── WF08_recordatorios.json
│   ├── WF09_notificaciones.json
│   └── WF10_eventpass_assistant.json
│
├── docs/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── main.js
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md

Funcionalidades principales
EventPass permite:
- Consultar eventos públicos.
- Filtrar eventos por categoría.
- Consultar el detalle de un evento.
- Registrar usuarios.
- Iniciar sesión.
- Cerrar sesión.
- Validar sesiones.
- Consultar y actualizar el perfil.
- Vincular Telegram.
- Consultar inscripciones.
- Inscribirse a eventos.
- Manejar disponibilidad.
- Utilizar lista de espera.
- Cancelar inscripciones.
- Gestionar eventos desde n8n.
- Automatizar reasignaciones.
- Gestionar recordatorios.
- Gestionar notificaciones.
- Utilizar un asistente conversacional de IA.
Seguridad
El proyecto mantiene separadas las configuraciones privadas de las públicas.
El archivo:
.env

se mantiene fuera del repositorio.
El archivo:
.env.example

solamente contiene los nombres de las variables necesarias, sin valores privados.
Los workflows de n8n se entregan como archivos JSON para permitir revisar la implementación y la arquitectura del sistema.
Entrega
El proyecto contiene:
- Código fuente del frontend.
- Workflows JSON de n8n.
- .env.example.
- README.
- Documentación.
- Configuración para ejecución mediante Vite.
La estructura del repositorio sigue los entregables establecidos para EventPass.    Se ha pegado el markdown(2)
Autor
EventPass — CinéPass
Proyecto integrador académico.

### ⚠️ Dos cosas antes de guardarlo

Hay **dos campos que deliberadamente dejé pendientes** para no inventar información:

```text
Nombre: Abdel Fabian Cristancho Roshman
URL: https://proyecto-event-pass-abdel-cristanch.vercel.app/

<<<<<<< HEAD
El resto está basado en la arquitectura y funcionalidades que ya construimos, y en los requisitos oficiales del taller.
=======
El resto está basado en la arquitectura y funcionalidades que ya construimos, y en los requisitos oficiales del taller.
>>>>>>> 83a8a16 (readme and main)
