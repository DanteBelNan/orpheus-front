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
      <h1>Bienvenido</h1>
      <div class="quick-access">
        <RouterLink to="/library" class="quick-card">
          <span class="card-icon">◉</span>
          <h3>Biblioteca de Vinilos</h3>
          <p>Explorá el catálogo completo</p>
        </RouterLink>
        <RouterLink to="/devices" class="quick-card">
          <span class="card-icon">⊡</span>
          <h3>Mis Dispositivos</h3>
          <p>Gestioná tus Orpheus</p>
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
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

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.router-link-active {
  color: var(--color-text);
}

.content {
  padding: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content h1 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.quick-access {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 600px;
}

.quick-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 2rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text);
  transition: border-color 0.2s;
}

.quick-card:hover {
  border-color: var(--color-accent);
}

.card-icon {
  font-size: 2rem;
  color: var(--color-accent-light);
  margin-bottom: 0.5rem;
}

.quick-card h3 { font-size: 1rem; }
.quick-card p { color: var(--color-text-muted); font-size: 0.85rem; }
</style>
