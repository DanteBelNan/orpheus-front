<template>
  <div class="library">
    <nav class="nav">
      <RouterLink to="/home" class="logo">Orpheus</RouterLink>
      <div class="nav-links">
        <RouterLink to="/library">Biblioteca</RouterLink>
        <RouterLink to="/devices">Dispositivos</RouterLink>
      </div>
    </nav>

    <main class="content">
      <div class="header">
        <h1>Biblioteca de Vinilos</h1>
        <div class="filters">
          <button
            v-for="f in filters"
            :key="f.value"
            :class="['filter-btn', { active: activeFilter === f.value }]"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <div class="vinyl-grid">
        <!-- Los vinilos se renderizan acá -->
        <p class="empty">No hay vinilos todavía. ¡Escaneá tu primer mini-vinilo!</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const activeFilter = ref('all')
const filters = [
  { label: 'Todos', value: 'all' },
  { label: 'Creados por mí', value: 'mine' },
  { label: 'Pendientes', value: 'pending' },
]
</script>

<style scoped>
.library { min-height: 100vh; background: var(--color-bg); }

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
.nav-links a { color: var(--color-text-muted); font-size: 0.95rem; }
.nav-links a:hover, .nav-links a.router-link-active { color: var(--color-text); }

.content { padding: 3rem 4rem; max-width: 1400px; margin: 0 auto; }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.header h1 { font-size: 2rem; }

.filters { display: flex; gap: 0.5rem; }

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  transition: all 0.2s;
}

.filter-btn:hover { border-color: var(--color-accent); color: var(--color-text); }
.filter-btn.active { background: var(--color-accent); border-color: var(--color-accent); color: white; }

.vinyl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.empty {
  color: var(--color-text-muted);
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem;
}
</style>
