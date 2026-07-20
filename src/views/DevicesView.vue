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
      <h1>Mis Dispositivos</h1>

      <div class="empty-state">
        <p>No tenés dispositivos registrados todavía.</p>
        <p class="hint">Obtené la MAC address corriendo <code>cat /sys/class/net/wlan0/address</code> en tu Raspberry Pi.</p>
      </div>

      <div class="register-form">
        <h2>Registrar nuevo dispositivo</h2>
        <div class="form-group">
          <label>MAC Address</label>
          <input v-model="form.device_id" type="text" placeholder="b8:27:eb:xx:xx:xx" />
        </div>
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="form.name" type="text" placeholder="Orpheus #1" />
        </div>
        <button class="btn-primary" @click="registerDevice">Registrar dispositivo</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const form = ref({ device_id: '', name: '' })

function registerDevice() {
  // TODO: llamar a POST /devices/
}
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

.content { padding: 3rem 4rem; max-width: 800px; margin: 0 auto; }
.content h1 { font-size: 2rem; margin-bottom: 2.5rem; }

.empty-state {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  color: var(--color-text-muted);
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
  border-radius: 12px;
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

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-primary:hover { background: var(--color-accent-light); }
</style>
