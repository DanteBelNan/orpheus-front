<template>
  <div class="callback-page">
    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
      <RouterLink to="/" class="btn-primary">Volver al inicio</RouterLink>
    </div>
    <div v-else class="loading-state">
      <div class="spinner" />
      <p>Autenticando con Spotify...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()
const error = ref<string | null>(null)

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (!code) {
    error.value = 'No se recibió el código de autorización.'
    return
  }

  try {
    await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/exchange`, {
      params: { code },
      withCredentials: true,
    })
    auth.setAuthenticated(true)
    router.push({ name: 'home' })
  } catch {
    error.value = 'Error al autenticar. Intentá de nuevo.'
  }
})
</script>

<style scoped>
.callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  flex-direction: column;
  gap: 1rem;
  color: var(--color-text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent-light);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.btn-primary {
  padding: 0.6rem 1.5rem;
  background: var(--color-accent);
  color: white;
  border-radius: 8px;
  font-size: 0.9rem;
}
</style>
