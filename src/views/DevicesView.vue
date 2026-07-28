<template>
  <div class="devices">
    <nav class="nav">
      <RouterLink to="/home" class="logo">Orpheus</RouterLink>
      <div class="nav-links">
        <RouterLink to="/library">Biblioteca</RouterLink>
        <RouterLink to="/devices">Dispositivos</RouterLink>
      </div>
    </nav>

    <main class="content">
      <div class="header">
        <div>
          <p class="eyebrow">Hardware</p>
          <h1>Mis Dispositivos</h1>
        </div>
        <button class="btn-secondary" @click="loadDevices" :disabled="loading">
          {{ loading ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>

      <p v-if="error" class="alert error">{{ error }}</p>
      <p v-if="success" class="alert success">{{ success }}</p>

      <section class="device-list">
        <div v-if="loading && devices.length === 0" class="empty-state">
          <p>Cargando dispositivos...</p>
        </div>

        <div v-else-if="devices.length === 0" class="empty-state">
          <p>No tenés dispositivos registrados todavía.</p>
          <p class="hint">Obtené la MAC address corriendo <code>cat /sys/class/net/wlan0/address</code> en tu Raspberry Pi.</p>
        </div>

        <article v-for="device in devices" v-else :key="device.id" class="device-card">
          <span :class="['status-dot', { online: isOnline(device.last_seen) }]" />
          <div class="device-main">
            <h2>{{ device.name }}</h2>
            <p class="mono">{{ device.device_id }}</p>
          </div>
          <div class="device-meta">
            <span :class="['status-label', { online: isOnline(device.last_seen) }]">
              {{ isOnline(device.last_seen) ? 'Online' : 'Offline' }}
            </span>
            <span>{{ formatLastSeen(device.last_seen) }}</span>
          </div>
        </article>
      </section>

      <form class="register-form" @submit.prevent="registerDevice">
        <h2>Registrar nuevo dispositivo</h2>
        <div class="form-group">
          <label for="device-id">MAC Address</label>
          <input id="device-id" v-model.trim="form.device_id" type="text" placeholder="b8:27:eb:xx:xx:xx" />
        </div>
        <div class="form-group">
          <label for="device-name">Nombre</label>
          <input id="device-name" v-model.trim="form.name" type="text" placeholder="Orpheus #1" />
        </div>
        <button class="btn-primary" :disabled="saving">
          {{ saving ? 'Registrando...' : 'Registrar dispositivo' }}
        </button>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { createDevice, getDevices, type Device } from '@/services/api'

const devices = ref<Device[]>([])
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const form = reactive({ device_id: '', name: '' })

function isOnline(lastSeen: string | null) {
  if (!lastSeen) return false
  const lastSeenMs = new Date(lastSeen).getTime()
  if (Number.isNaN(lastSeenMs)) return false
  return Date.now() - lastSeenMs < 5 * 60 * 1000
}

function formatLastSeen(lastSeen: string | null) {
  if (!lastSeen) return 'Sin heartbeat'

  const diffMs = Date.now() - new Date(lastSeen).getTime()
  if (Number.isNaN(diffMs)) return 'Fecha desconocida'

  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000))
  if (diffMinutes < 1) return 'Recién visto'
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `Hace ${diffHours} h`

  const diffDays = Math.floor(diffHours / 24)
  return `Hace ${diffDays} d`
}

function validateForm() {
  const macPattern = /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/
  if (!macPattern.test(form.device_id)) {
    error.value = 'Ingresá una MAC address válida.'
    return false
  }
  if (form.name.length < 2) {
    error.value = 'Ingresá un nombre descriptivo.'
    return false
  }
  return true
}

async function loadDevices() {
  loading.value = true
  error.value = null
  try {
    const data = await getDevices()
    devices.value = data.devices
  } catch {
    error.value = 'No pudimos cargar tus dispositivos.'
  } finally {
    loading.value = false
  }
}

async function registerDevice() {
  error.value = null
  success.value = null
  if (!validateForm()) return

  saving.value = true
  try {
    const device = await createDevice({ device_id: form.device_id, name: form.name })
    devices.value = [device, ...devices.value]
    form.device_id = ''
    form.name = ''
    success.value = 'Dispositivo registrado.'
  } catch {
    error.value = 'No pudimos registrar el dispositivo. Verificá que no exista ya.'
  } finally {
    saving.value = false
  }
}

onMounted(loadDevices)
</script>

<style scoped>
.devices { min-height: 100vh; background: var(--color-bg); }

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  border-bottom: 1px solid var(--color-border);
}

.logo { font-size: 1.5rem; font-weight: 700; color: var(--color-accent-light); }
.nav-links { display: flex; gap: 2rem; }
.nav-links a { color: var(--color-text-muted); font-size: 0.95rem; }
.nav-links a:hover, .nav-links a.router-link-active { color: var(--color-text); }

.content { padding: 3rem 4rem; max-width: 900px; margin: 0 auto; }

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 2rem;
}

.eyebrow {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.header h1 { font-size: 2rem; }

.alert {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.alert.error { color: #ffb4b4; background: rgba(120, 20, 20, 0.18); }
.alert.success { color: #b8f7c5; background: rgba(20, 120, 50, 0.16); }

.device-list { display: grid; gap: 0.8rem; margin-bottom: 2.5rem; }

.device-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}

.status-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  background: #3a3a3a;
  flex: 0 0 auto;
}

.status-dot.online {
  background: #28c76f;
  box-shadow: 0 0 10px rgba(40, 199, 111, 0.45);
}

.device-main { flex: 1; min-width: 0; }
.device-main h2 { font-size: 1rem; margin-bottom: 0.25rem; }
.mono { color: var(--color-text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85rem; }

.device-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.status-label.online { color: #28c76f; }

.empty-state {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
  color: var(--color-text-muted);
  text-align: center;
}

.hint { margin-top: 0.5rem; font-size: 0.85rem; }
.hint code {
  background: #222;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--color-accent-light);
}

.register-form {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
}

.register-form h2 { font-size: 1.1rem; margin-bottom: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
.form-group label { font-size: 0.85rem; color: var(--color-text-muted); }

.form-group input {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.7rem 1rem;
  color: var(--color-text);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus { border-color: var(--color-accent); }

.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: white;
}

.btn-primary:hover:not(:disabled) { background: var(--color-accent-light); }

.btn-secondary {
  padding: 0.65rem 1rem;
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) { border-color: var(--color-accent); color: var(--color-accent-light); }
button:disabled { opacity: 0.55; cursor: default; }
</style>
