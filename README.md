# 🎬 EventPass --- CinéPass

## 1. Nombre del proyecto

**EventPass --- CinéPass**

Aplicación web para la gestión de eventos relacionados con el mundo del
cine, desarrollada como proyecto integrador académico.

------------------------------------------------------------------------

## 2. Estudiante

**Nombre:** Abdel Fabian Cristancho Roshman

------------------------------------------------------------------------

## 3. Descripción del proyecto

EventPass es una aplicación web orientada a la gestión de eventos. En
esta implementación, la experiencia visual y temática está inspirada en
el cine y se presenta bajo el concepto **CinéPass**.

La aplicación permite consultar un catálogo público de eventos,
registrarse, iniciar y cerrar sesión, administrar información personal,
vincular una cuenta de Telegram, consultar inscripciones y cancelar
registros.

La lógica principal del sistema se encuentra centralizada en **n8n**,
que funciona como capa de automatización y backend del proyecto.

El frontend funciona como cliente y realiza las solicitudes HTTP hacia
los workflows de n8n. n8n se encarga de las validaciones, reglas de
negocio, persistencia y comunicación con los diferentes servicios.

------------------------------------------------------------------------

## 4. URL pública de Vercel

**URL:** [EventPass ---
CinéPass](https://proyecto-event-pass-abdel-cristanch.vercel.app/)

La aplicación debe estar publicada y disponible al momento de la
entrega.

------------------------------------------------------------------------

## 5. Arquitectura general

La arquitectura del proyecto sigue este flujo:

``` text
┌─────────────────────────┐
│     Aplicación Web      │
│      Vercel / Vite      │
└────────────┬────────────┘
             │ HTTP / Chat
             ▼
┌─────────────────────────┐
│           n8n           │
│  Workflows / Validación │
│    Reglas de negocio    │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│      Google Sheets      │
│ Persistencia académica  │
└────────────┬────────────┘
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
     Gmail Telegram IA
```

El frontend no se conecta directamente con Google Sheets. Las
operaciones de lectura y escritura pasan por n8n.

n8n es responsable de las validaciones, decisiones del negocio,
persistencia, estados, idempotencia, integraciones y notificaciones.

------------------------------------------------------------------------

## 6. Tecnologías utilizadas

### Frontend

-   HTML5
-   CSS3
-   JavaScript
-   Vite
-   JavaScript ES Modules
-   Diseño responsive
-   Componentes JavaScript reutilizables

### Automatización y backend

-   n8n
-   Webhooks
-   Form Trigger
-   Schedule Trigger
-   Telegram Trigger
-   Chat Trigger
-   Execute Sub-workflow Trigger
-   Google Sheets
-   Gmail
-   Google Gemini / modelo de IA

### Asistente conversacional

-   `@n8n/chat`
-   Versión utilizada: `@n8n/chat 1.4.1`

### Herramientas de desarrollo

-   Visual Studio Code
-   Git
-   GitHub
-   Vercel

------------------------------------------------------------------------

## 7. Workflows de n8n

El proyecto contiene los workflows de EventPass, incluido el workflow
adicional de check-in digital.

  -----------------------------------------------------------------------
  Workflow                Nombre                  Responsabilidad
  ----------------------- ----------------------- -----------------------
  WF01                    Usuarios CRUD           Crear, consultar,
                                                  actualizar y desactivar
                                                  usuarios

  WF02                    Autenticación y         Login, logout y
                          sesiones                validación de sesiones

  WF03                    Vinculación Telegram    Generar y validar
                                                  códigos de vinculación

  WF04                    Eventos CRUD            Administración de
                                                  eventos

  WF05                    Catálogo público        Consultar eventos y
                                                  disponibilidad

  WF06                    Inscripciones CRUD      Crear, consultar,
                                                  actualizar y cancelar
                                                  inscripciones

  WF07                    Lista de espera         Reasignación automática
                                                  de cupos

  WF08                    Recordatorios           Gestión de
                                                  recordatorios

  WF09                    Notificaciones          Envío centralizado de
                                                  notificaciones

  WF10                    Asistente EventPass     Atención conversacional
                                                  mediante IA

  WF11                    Check-in digital        Validar y registrar el
                                                  ingreso a un evento
  -----------------------------------------------------------------------

Los archivos JSON exportados de los workflows se encuentran en la
carpeta `n8n/`.

------------------------------------------------------------------------

## 8. Trigger principal de cada workflow

  Workflow                            Trigger principal
  ----------------------------------- ------------------------------
  WF01 --- Usuarios CRUD              Webhook
  WF02 --- Autenticación y sesiones   Webhook
  WF03 --- Vinculación Telegram       Webhook + Telegram Trigger
  WF04 --- Eventos CRUD               Form Trigger
  WF05 --- Catálogo público           Webhook
  WF06 --- Inscripciones CRUD         Webhook
  WF07 --- Lista de espera            Schedule Trigger
  WF08 --- Recordatorios              Schedule Trigger
  WF09 --- Notificaciones             Execute Sub-workflow Trigger
  WF10 --- Asistente EventPass        Chat Trigger
  WF11 --- Check-in digital           Webhook

Los triggers separan las operaciones HTTP, las automatizaciones
programadas, la integración con Telegram y la atención conversacional.

------------------------------------------------------------------------

## 9. Google Sheets y documentación de datos

La persistencia académica se distribuye en archivos independientes,
según el dominio de cada proceso.

**Carpeta de Google Drive con los archivos de hojas de cálculo:**\
[Consultar archivos de Google Sheets de
EventPass](https://drive.google.com/drive/folders/10HkojaDePV-sI4PR1Ec5VjJ2f8aK-1_6?usp=sharing)

Los archivos de hojas de cálculo también se incluyen en la carpeta
`sheets/` del repositorio.

### EP11_Checkin

-   **Pestaña:** `Checkins`
-   **Columnas:** `checkin_id`, `inscripcion_id`, `evento_id`,
    `usuario_id`, `fecha_checkin`, `resultado`, `detalle`.
-   **Resultados permitidos:** `EXITOSO`, `RECHAZADO` y `DUPLICADO`.

Esta hoja registra los intentos de check-in y proporciona trazabilidad
de los resultados. Cada dominio mantiene su propia persistencia; no se
utiliza un único archivo para todos los procesos.

------------------------------------------------------------------------

## 10. Comunicación Frontend → n8n

El frontend utiliza variables de entorno para almacenar las URLs de los
workflows. Las solicitudes se realizan mediante HTTP usando JavaScript.

``` text
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
Validación y reglas de negocio
   ↓
Google Sheets / servicios externos
   ↓
Respuesta JSON
   ↓
Frontend
   ↓
Interfaz actualizada
```

El frontend no realiza conexiones directas con Google Sheets.

------------------------------------------------------------------------

## 11. Endpoints y operaciones principales

Las URLs de los endpoints se configuran según los workflows de n8n y las
variables de entorno del proyecto.

### WF01 --- Usuarios

Operaciones: `CREATE`, `READ`, `UPDATE` y `DEACTIVATE`.

Permite crear usuarios, consultar perfiles, actualizar información y
desactivar cuentas.

### WF02 --- Autenticación

Operaciones: `LOGIN`, `LOGOUT` y `VALIDATE`.

Permite iniciar y cerrar sesión, validar una sesión existente y
comprobar su expiración y el estado del usuario.

### WF03 --- Telegram

Permite generar códigos de vinculación, consultar el estado de
vinculación y procesar códigos enviados desde Telegram.

### WF05 --- Catálogo

Permite consultar, filtrar y ver el detalle de los eventos publicados y
su disponibilidad.

### WF06 --- Inscripciones

Operaciones: `CREATE`, `READ`, `UPDATE` y `CANCEL`.

Permite crear y consultar inscripciones, actualizar una inscripción,
cancelar registros y gestionar disponibilidad y lista de espera.

### WF11 --- Check-in digital

Recibe una solicitud HTTP con `inscripcion_id` y `evento_id`. Valida la
existencia de la inscripción y del evento, que ambos correspondan, que
la inscripción esté en estado `CONFIRMADA` y que no exista un check-in
exitoso previo.

La respuesta distingue los resultados `EXITOSO`, `DUPLICADO` y
`RECHAZADO`. El endpoint de producción se configura en n8n; no se
incluye aquí una URL fija para evitar documentar una dirección que pueda
cambiar.

------------------------------------------------------------------------

## 12. Estados utilizados

### Usuarios

-   `ACTIVO`
-   `INACTIVO`

Una cuenta desactivada no debe iniciar ni mantener una sesión válida.

### Eventos

-   `BORRADOR`
-   `PUBLICADO`
-   `CERRADO`
-   `CANCELADO`

Solamente los eventos en estado `PUBLICADO` se muestran en el catálogo
público.

### Inscripciones

-   `CONFIRMADA`
-   `LISTA_ESPERA`
-   `CANCELADA`
-   `ASISTIO`

Las inscripciones confirmadas ocupan un cupo. Las inscripciones en lista
de espera quedan pendientes de una posible reasignación. Tras un
check-in exitoso, la inscripción pasa a `ASISTIO`.

------------------------------------------------------------------------

## 13. Hashing de contraseñas

Las contraseñas no se almacenan directamente como texto plano. Durante
el registro se genera información de seguridad mediante un salt y un
hash, almacenados como `password_hash` y `password_salt`.

Durante el login, el sistema recupera el salt almacenado, calcula
nuevamente el hash con la contraseña proporcionada y compara el
resultado con el valor almacenado. Así se evita guardar la contraseña
original.

------------------------------------------------------------------------

## 14. Manejo de sesiones

El workflow WF02 administra las sesiones de los usuarios. Una sesión
contiene información relacionada con el identificador de sesión, el
usuario asociado, la fecha de creación, la fecha de expiración y el
estado.

Una sesión no debe considerarse válida cuando no existe, está cerrada,
está expirada o pertenece a un usuario inactivo.

El frontend utiliza el token de sesión para realizar operaciones que
requieren autenticación.

------------------------------------------------------------------------

## 15. Idempotencia

La idempotencia evita que una misma solicitud produzca operaciones
duplicadas cuando se recibe más de una vez.

En los procesos de inscripción se realizan validaciones antes de crear
un registro, considerando el usuario, la sesión, el evento, el estado
del usuario, la disponibilidad y la existencia de una inscripción
previa.

En WF11 se consulta el historial de check-in para impedir un segundo
ingreso exitoso para la misma inscripción. Un intento repetido se
identifica como `DUPLICADO` y no debe generar otro check-in exitoso ni
volver a cambiar el estado de la inscripción.

------------------------------------------------------------------------

## 16. Lista de espera y reasignación

Cuando un evento no tiene cupos disponibles, una nueva inscripción puede
pasar a `LISTA_ESPERA`.

Cuando se libera un cupo, WF07 analiza las inscripciones pendientes y
prioriza por `fecha_inscripcion ASC`, es decir, a quien ingresó primero
a la lista de espera.

``` text
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
```

------------------------------------------------------------------------

## 17. Servicio central de notificaciones

El workflow `WF09_notificaciones` funciona como servicio central para
las notificaciones generadas por otros procesos.

Los canales contemplados son Gmail y Telegram. La centralización permite
separar las reglas de negocio del envío de comunicaciones.

WF11 invoca WF09 cuando el check-in es exitoso. Los intentos rechazados
o duplicados no deben activar una nueva notificación de check-in.

------------------------------------------------------------------------

## 18. Asistente IA

El proyecto incorpora un asistente conversacional para soporte de
EventPass mediante `WF10_eventpass_assistant` y el componente
`@n8n/chat`.

``` text
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
```

El asistente funciona como sistema de soporte y consulta; no debe
utilizarse para modificar directamente información crítica del sistema.
No debe crear ni eliminar usuarios, modificar eventos, cancelar
inscripciones, manipular directamente la base de datos ni ejecutar
operaciones administrativas no autorizadas.

------------------------------------------------------------------------

## 19. Examen --- Check-in digital

### Objetivo

Validar y registrar digitalmente el ingreso de una persona a un evento,
garantizando que la inscripción corresponda al evento y evitando
registrar dos veces un ingreso exitoso.

### Solicitud

El webhook de WF11 recibe una solicitud `POST` con los campos mínimos
`inscripcion_id` y `evento_id`.

Ejemplo de cuerpo JSON:

``` json
{
  "inscripcion_id": "INS-XXXXXXXX",
  "evento_id": "EVT-XXX"
}
```

Los identificadores anteriores son ilustrativos; deben reemplazarse por
los identificadores reales al realizar una prueba.

### Validaciones

-   La solicitud contiene los identificadores requeridos.
-   La inscripción existe.
-   El evento existe.
-   El evento corresponde a la inscripción.
-   La inscripción está en estado `CONFIRMADA`.
-   No existe un check-in exitoso previo para esa inscripción.
-   Las inscripciones `CANCELADA`, `LISTA_ESPERA` y cualquier otro
    estado no permitido se rechazan.

### Resultados

-   `EXITOSO`: el check-in se registra, se guarda la fecha y hora, y la
    inscripción cambia a `ASISTIO`.
-   `DUPLICADO`: el ingreso ya había sido registrado; no se crea otro
    check-in exitoso ni se modifica nuevamente el estado.
-   `RECHAZADO`: la solicitud no cumple las validaciones.

La respuesta HTTP diferencia los casos de éxito, duplicado y rechazo.

### Auditoría

Los intentos se registran en el archivo independiente `EP11_Checkin`,
pestaña `Checkins`, con los campos `checkin_id`, `inscripcion_id`,
`evento_id`, `usuario_id`, `fecha_checkin`, `resultado` y `detalle`.

### Integración con WF09

Cuando el check-in es exitoso, WF11 llama al workflow central
`WF09_notificaciones` para enviar la notificación por los canales
configurados. Un intento duplicado o rechazado no debe generar una nueva
notificación de check-in.

### Pruebas funcionales realizadas

-   Check-in válido: `EXITOSO`.
-   Segundo intento para la misma inscripción: `DUPLICADO`.
-   Inscripción inexistente: `RECHAZADO`.
-   Inscripción cancelada: `RECHAZADO`.
-   Evento diferente al asociado a la inscripción: `RECHAZADO`.

------------------------------------------------------------------------

## 20. Variables de entorno

El proyecto utiliza un archivo `.env` local para las URLs de los
workflows de n8n. El archivo `.env` real no debe subirse al repositorio.

El repositorio incluye `.env.example` con los nombres de las variables
necesarias, sin valores privados.

Variables documentadas para el frontend:

``` dotenv
VITE_N8N_WF01_URL=
VITE_N8N_WF02_URL=
VITE_N8N_WF03_URL=
VITE_N8N_WF05_URL=
VITE_N8N_WF06_URL=
VITE_N8N_WF10_URL=
```

Si el frontend incorpora una llamada directa a WF11, se deberá añadir
una variable para su URL al `.env.example` y al código que la utilice.
No deben almacenarse en el repositorio API keys, tokens de Telegram,
credenciales OAuth, contraseñas reales, secretos ni el archivo `.env`
privado.

------------------------------------------------------------------------

## 21. Instalación y ejecución

### Requisitos

-   Node.js
-   npm
-   Git

### Clonar el proyecto

``` bash
git clone https://github.com/abdelfabiancris/Proyecto_EventPass_Abdel_Cristancho.git
cd Proyecto_EventPass_Abdel_Cristancho
```

### Instalar dependencias

``` bash
npm install
```

### Configurar variables de entorno

Crear un archivo `.env` a partir de `.env.example` y agregar las URLs
correspondientes a los workflows de n8n.

### Ejecutar en desarrollo

``` bash
npm run dev
```

Vite mostrará la dirección local para acceder a la aplicación.

### Crear build de producción

``` bash
npm run build
```

### Previsualizar el build

``` bash
npm run preview
```

------------------------------------------------------------------------

## 22. Estructura del proyecto

La estructura puede variar según los archivos existentes en el
repositorio. La organización principal es:

``` text
Proyecto_EventPass_Abdel_Cristancho/
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
│   ├── WF10_eventpass_assistant.json
│   └── WF11_checkin_digital.json
├── sheets/
│   └── Archivos exportados de Google Sheets
├── docs/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── main.js
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

Los nombres de los archivos JSON deben coincidir con los nombres reales
guardados en `n8n/`.

------------------------------------------------------------------------

## 23. Funcionalidades principales

EventPass permite: - Consultar eventos públicos. - Filtrar eventos por
categoría. - Consultar el detalle de un evento. - Registrar usuarios. -
Iniciar y cerrar sesión. - Validar sesiones. - Consultar y actualizar el
perfil. - Vincular Telegram. - Consultar inscripciones. - Inscribirse a
eventos. - Gestionar disponibilidad y lista de espera. - Cancelar
inscripciones. - Gestionar eventos desde n8n. - Automatizar
reasignaciones. - Gestionar recordatorios y notificaciones. - Utilizar
un asistente conversacional de IA. - Validar y registrar el check-in
digital con control de duplicados.

------------------------------------------------------------------------

## 24. Seguridad

El proyecto mantiene separadas las configuraciones privadas de las
públicas.

-   `.env` se mantiene fuera del repositorio.
-   `.env.example` contiene los nombres de las variables, sin valores
    privados.
-   No se deben subir API keys, tokens ni credenciales.
-   Los archivos de datos exportados deben revisarse y anonimizarse si
    contienen información personal real.
-   Los workflows se entregan como JSON para permitir revisar su
    implementación y arquitectura.

------------------------------------------------------------------------

## 25. Entrega

El repositorio incluye el código fuente del frontend, los workflows JSON
de n8n, `.env.example`, el README, documentación y configuración para
ejecutar el proyecto mediante Vite.

Los archivos de Google Sheets se encuentran en `sheets/` y también
pueden consultarse en [la carpeta de Google Drive de
EventPass](https://drive.google.com/drive/folders/10HkojaDePV-sI4PR1Ec5VjJ2f8aK-1_6?usp=sharing).

La entrega incluye el workflow WF11 --- Check-in digital, el registro de
auditoría `EP11_Checkin` y su integración con el servicio central de
notificaciones WF09.

------------------------------------------------------------------------

## Autor

**Abdel Fabian Cristancho Roshman**\
EventPass --- CinéPass\
Proyecto integrador académico.
