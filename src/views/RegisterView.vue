<template>
  <div class="auth-page">
    <RouterLink to="/" class="back-link">← Volver</RouterLink>
    <div class="auth-card">
      <h1>Crear cuenta</h1>
      <p>Conectá tu cuenta de Spotify para empezar a usar Orpheus. Necesitás Spotify Premium.</p>
      <a :href="loginUrl" class="btn-spotify">
        <span class="spotify-icon">♫</span>
        Continuar con Spotify
      </a>
      <p class="terms">Al continuar, aceptás que Orpheus acceda a tu cuenta de Spotify para gestionar la reproducción.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const loginUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/login`
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 2rem;
}

.back-link {
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.back-link:hover { color: var(--color-text); }

.auth-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-card h1 { font-size: 1.75rem; margin-bottom: 0.75rem; }

.auth-card > p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.btn-spotify {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.9rem;
  background: var(--color-accent);
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  transition: background 0.2s;
}

.btn-spotify:hover { background: var(--color-accent-light); }

.terms {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  line-height: 1.5;
}
</style>
