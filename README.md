# Orpheus Front

Frontend web de Project Orpheus. Construido con **Vue.js**, maneja la autenticación con Spotify, el catálogo de vinilos y la gestión de dispositivos.

---

## Stack

- Vue 3 (Composition API)
- Vue Router
- Pinia (manejo de estado)
- Axios (cliente HTTP)

---

## Vistas

### `/` — Landing *(pública)*
- Presenta el proyecto: concepto, cómo funciona, overview del hardware
- Barra de navegación con dos acciones: **"Iniciar sesión"** → `/login` y **"Registrarse"** → `/register`
- Los usuarios autenticados son redirigidos a `/home`

### `/register` — Registro *(pública)*
- Breve explicación de qué implica crear una cuenta
- Botón **"Continuar con Spotify"** → dispara el flujo OAuth de Spotify
- Tras OAuth exitoso: cuenta creada, redirige a `/home`

### `/login` — Login *(pública)*
- Botón **"Continuar con Spotify"** → dispara el flujo OAuth de Spotify
- Tras OAuth exitoso: sesión restaurada, redirige a `/home`

### `/auth/callback` — OAuth Callback *(pública)*
- Spotify redirige aquí tras la aprobación del usuario
- El frontend recibe el `code` y lo envía al API (`GET /auth/callback`)
- En éxito: la API setea la cookie de sesión JWT, redirige a `/home`
- En error: muestra mensaje de error, vuelve a `/`

### `/home` — Home *(requiere auth)*
- Punto de entrada principal de la app autenticada
- Muestra: info de la cuenta de Spotify conectada, dispositivos registrados con su estado (online/offline según `last_seen`), accesos rápidos a la biblioteca y gestión de dispositivos

### `/library` — Biblioteca de Vinilos *(requiere auth)*
- Muestra el **catálogo global completo** de vinilos
- Cada tarjeta muestra: portada del álbum, nombre, creador
- Los vinilos **pendientes** (sin álbum asignado) muestran un badge **"Pendiente"**
- El creador de un vinilo pendiente ve el botón **"Configurar"** → navega a `/vinyls/{id}/configure`
- Filtros: **Todos** / **Creados por mí** / **Pendientes**
- El creador puede eliminar sus propios vinilos (ícono de papelera, con confirmación)

### Modal: Configurar Vinilo *(solo el `created_by`)*
Se abre desde la tarjeta del vinilo pendiente en `/library`. No tiene ruta propia — es un modal sobre la vista actual. La autorización se valida en el API al hacer `PATCH /vinyls/{id}`; en el frontend el botón "Configurar" solo se renderiza si el usuario autenticado es el `created_by`.

**Paso 1 — Buscar recurso**
- Campo de búsqueda: llama a `GET /resources/search?q=...`
- Los resultados muestran **dos secciones diferenciadas**:
  - 🌐 Resultados de Spotify (búsqueda en vivo)
  - 📁 Recursos precargados del usuario (desde tabla `playlists`)
- Cada resultado muestra: portada, nombre, tipo (álbum/playlist), origen

**Paso 2 — Confirmar**
- Usuario selecciona un recurso
- Campo para ingresar un nombre personalizado para el vinilo (ej. "Viajes en ruta")
- Vista previa con la portada seleccionada
- Botón **"Guardar"** → llama a `PATCH /vinyls/{id}`

**Paso 3 — Listo**
- Modal muestra confirmación, se cierra y la tarjeta en `/library` se actualiza al estado `configured`

### `/playlists` — Recursos Precargados *(requiere auth)*
- Lista los recursos guardados por el usuario autenticado (álbumes y playlists de Spotify)
- Permite buscar y guardar nuevos recursos desde Spotify (`POST /playlists`)
- Permite eliminar recursos guardados (`DELETE /playlists/{id}`)
- Útil para tener los recursos favoritos disponibles sin depender de la búsqueda en vivo al momento de configurar un vinilo

### `/devices` — Mis Dispositivos *(requiere auth)*
- Lista los dispositivos registrados por el usuario autenticado
- Muestra: nombre del dispositivo, MAC address, último heartbeat, estado (online/offline)
- Formulario para registrar un nuevo dispositivo:
  - Campo MAC address (se obtiene corriendo `cat /sys/class/net/wlan0/address` en la Pi)
  - Campo nombre descriptivo (ej. "Orpheus #1")
  - Llama a `POST /device/register`

---

## Flujos

### Flujo de autenticación

```
Usuario en /
    │
    └─► Hace clic en "Iniciar sesión" o "Registrarse"
            │
            └─► GET /auth/login  (la API redirige a Spotify)
                    │
                    └─► Usuario aprueba en Spotify
                            │
                            └─► Spotify redirige a /auth/callback?code=...
                                    │
                                    └─► API intercambia code por tokens, setea cookie JWT
                                            │
                                            └─► Frontend redirige a /home
```

### Flujo de configurar vinilo pendiente

```
Usuario en /library  (ve un vinilo pendiente suyo)
    │
    └─► Hace clic en "Configurar"  →  abre modal sobre /library
            │
            └─► Escribe búsqueda  →  GET /resources/search?q=...
                    │
                    └─► Ve resultados combinados (Spotify + precargados)
                            │
                            └─► Selecciona recurso + ingresa nombre personalizado
                                    │
                                    └─► PATCH /vinyls/{id}
                                            │
                                            └─► Modal cierra, tarjeta se actualiza a "configured"
```

### Flujo de precargar un recurso

```
Usuario en /playlists
    │
    └─► Busca álbum o playlist en Spotify
            │
            └─► GET /resources/search?q=...  (solo fuente: spotify)
                    │
                    └─► Selecciona recurso  →  POST /playlists
                            │
                            └─► Recurso guardado, aparece en su lista local
                                    │
                                    └─► Disponible en /vinyls/{id}/configure sin búsqueda en vivo
```

---

## Route Guards

- Las rutas `/`, `/login`, `/register` y `/auth/callback` son públicas
- El resto requiere sesión autenticada (cookie JWT válida)
- Si la sesión falta o expiró, redirige a `/`
- El modal de configuración no tiene ruta propia — la autorización la maneja el API devolviendo `403` si el usuario no es el `created_by`

---

## Variables de Entorno

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base del API de Orpheus (ej. `http://localhost:8000`) |
