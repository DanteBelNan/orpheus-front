<template>
  <div class="home">
    <nav class="nav">
      <span class="logo">Orpheus</span>
      <div class="nav-links">
        <RouterLink to="/library">Biblioteca</RouterLink>
        <RouterLink to="/devices">Dispositivos</RouterLink>
      </div>
    </nav>

    <main class="content">
      <section class="account-row">
        <div class="avatar">{{ initials }}</div>
        <div>
          <h1>Bienvenido</h1>
          <p>{{ auth.currentUser?.email }}</p>
        </div>
        <span class="spotify-badge">Spotify conectado</span>
      </section>

      <div class="quick-access">
        <RouterLink to="/library" class="quick-card">
          <span class="card-icon">◉</span>
          <h3>Biblioteca de Vinilos</h3>
          <p>{{ vinylCountText }}</p>
        </RouterLink>
        <RouterLink to="/devices" class="quick-card">
          <span class="card-icon">⊡</span>
          <h3>Mis Dispositivos</h3>
          <p>{{ deviceCountText }}</p>
        </RouterLink>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getDevices, getVinyls } from '@/services/api'

const auth = useAuthStore()
const deviceCount = ref<number | null>(null)
const vinylCount = ref<number | null>(null)
const error = ref<string | null>(null)

const initials = computed(() => {
  const email = auth.currentUser?.email || 'Orpheus'
  return email.slice(0, 2).toUpperCase()
})

const deviceCountText = computed(() => {
  if (deviceCount.value === null) return 'Gestioná tus Orpheus'
  if (deviceCount.value === 1) return '1 dispositivo registrado'
  return `${deviceCount.value} dispositivos registrados`
})

const vinylCountText = computed(() => {
  if (vinylCount.value === null) return 'Explorá el catálogo completo'
  if (vinylCount.value === 1) return '1 vinilo en catálogo'
  return `${vinylCount.value} vinilos en catálogo`
})

onMounted(async () => {
  try {
    const [devices, vinyls] = await Promise.all([
      getDevices(),
      getVinyls({ page: 1, take: 1 }),
    ])
    deviceCount.value = devices.amount
    vinylCount.value = vinyls.amount
  } catch {
    error.value = 'No pudimos cargar el resumen.'
  }
})
</script>

<style scoped>
.home { min-height: 100vh; background: var(--color-bg); }

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  border-bottom: 1px solid var(--color-border);
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent-light);
}

.nav-links { display: flex; gap: 2rem; }
.nav-links a { color: var(--color-text-muted); font-size: 0.95rem; transition: color 0.2s; }
.nav-links a:hover, .nav-links a.router-link-active { color: var(--color-text); }

.content { padding: 4rem; max-width: 1200px; margin: 0 auto; }

.account-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 2rem;
}

.avatar {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: var(--color-accent);
  color: white;
  font-weight: 800;
}

.account-row h1 { font-size: 1.5rem; margin-bottom: 0.2rem; }
.account-row p { color: var(--color-text-muted); font-size: 0.9rem; }

.spotify-badge {
  margin-left: auto;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(168, 85, 247, 0.35);
  color: var(--color-accent-light);
  font-size: 0.8rem;
  white-space: nowrap;
}

.quick-access {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 640px;
}

.quick-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 2rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  transition: border-color 0.2s;
}

.quick-card:hover { border-color: var(--color-accent); }
.card-icon { font-size: 2rem; color: var(--color-accent-light); margin-bottom: 0.5rem; }
.quick-card h3 { font-size: 1rem; }
.quick-card p { color: var(--color-text-muted); font-size: 0.85rem; }

.alert {
  max-width: 640px;
  margin-top: 1.5rem;
  border: 1px solid rgba(180, 60, 60, 0.4);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: #ffb4b4;
  background: rgba(120, 20, 20, 0.18);
  font-size: 0.9rem;
}
</style>
