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
        <div>
          <p class="eyebrow">Colección</p>
          <h1>Biblioteca de Vinilos</h1>
        </div>
        <div class="filters">
          <button
            v-for="f in filters"
            :key="f.value"
            :class="['filter-btn', { active: activeFilter === f.value }]"
            @click="setFilter(f.value)"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>

      <div v-if="loading" class="empty">Cargando vinilos...</div>
      <div v-else-if="vinyls.length === 0" class="empty">No hay vinilos en esta vista.</div>

      <div v-else class="vinyl-grid">
        <article v-for="vinyl in vinyls" :key="vinyl.id" class="vinyl-card">
          <div class="art">
            <img v-if="vinyl.album_art_url" :src="vinyl.album_art_url" :alt="vinyl.album_name || vinyl.name || 'Vinilo'" />
            <div v-else class="art-placeholder">Orpheus</div>
            <span v-if="vinyl.status === 'pending'" class="badge">Pendiente</span>
          </div>

          <div class="card-body">
            <h2>{{ vinyl.name || vinyl.album_name || 'Vinilo sin configurar' }}</h2>
            <p>{{ vinyl.album_name || 'Escaneado, pendiente de álbum o playlist' }}</p>
            <span class="owner">Creador #{{ vinyl.created_by }}</span>
          </div>

          <div v-if="isOwner(vinyl)" class="card-actions">
            <button
              v-if="vinyl.status === 'pending'"
              class="btn-primary"
              @click="openConfigure(vinyl)"
            >
              Configurar
            </button>
            <button class="btn-danger" @click="removeVinyl(vinyl)" :disabled="deletingId === vinyl.id">
              {{ deletingId === vinyl.id ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </article>
      </div>
    </main>

    <div v-if="configuringVinyl" class="modal-backdrop" @click.self="closeConfigure">
      <section class="modal">
        <header class="modal-header">
          <div>
            <p class="eyebrow">Configurar</p>
            <h2>Asignar música</h2>
          </div>
          <button class="icon-button" @click="closeConfigure" aria-label="Cerrar">×</button>
        </header>

        <div class="search-row">
          <input
            v-model.trim="searchQuery"
            type="search"
            placeholder="Buscar álbum o playlist"
            @keyup.enter="runSearch"
          />
          <button class="btn-primary" @click="runSearch" :disabled="searching || searchQuery.length < 2">
            {{ searching ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>

        <p v-if="modalError" class="alert">{{ modalError }}</p>

        <div class="results">
          <button
            v-for="resource in resources"
            :key="resource.spotify_uri"
            :class="['result-item', { selected: selectedResource?.spotify_uri === resource.spotify_uri }]"
            @click="selectResource(resource)"
          >
            <img v-if="resource.art_url" :src="resource.art_url" :alt="resource.name" />
            <div v-else class="result-art">♪</div>
            <span>
              <strong>{{ resource.name }}</strong>
              <small>{{ resource.resource_type }} · {{ resource.artist || 'Spotify' }}</small>
            </span>
          </button>
        </div>

        <div class="form-group">
          <label for="vinyl-name">Nombre del vinilo</label>
          <input id="vinyl-name" v-model.trim="vinylName" type="text" placeholder="Viajes en ruta" />
        </div>

        <footer class="modal-footer">
          <button class="btn-secondary" @click="closeConfigure">Cancelar</button>
          <button class="btn-primary" @click="saveConfiguration" :disabled="saving || !selectedResource || vinylName.length < 2">
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  deleteVinyl,
  getVinyls,
  searchResources,
  updateVinyl,
  type Resource,
  type Vinyl,
} from '@/services/api'

type Filter = 'all' | 'mine' | 'pending'

const auth = useAuthStore()
const activeFilter = ref<Filter>('all')
const vinyls = ref<Vinyl[]>([])
const loading = ref(false)
const deletingId = ref<number | null>(null)
const error = ref<string | null>(null)

const configuringVinyl = ref<Vinyl | null>(null)
const searchQuery = ref('')
const resources = ref<Resource[]>([])
const selectedResource = ref<Resource | null>(null)
const vinylName = ref('')
const searching = ref(false)
const saving = ref(false)
const modalError = ref<string | null>(null)

const filters = computed(() => [
  { label: 'Todos', value: 'all' as const },
  { label: 'Creados por mí', value: 'mine' as const },
  { label: 'Pendientes', value: 'pending' as const },
])

function isOwner(vinyl: Vinyl) {
  return auth.currentUser?.id === vinyl.created_by
}

async function loadVinyls() {
  loading.value = true
  error.value = null
  try {
    const params =
      activeFilter.value === 'mine'
        ? { created_by: auth.currentUser?.id, page: 1, take: 50 }
        : activeFilter.value === 'pending'
          ? { status: 'pending' as const, page: 1, take: 50 }
          : { page: 1, take: 50 }

    const data = await getVinyls(params)
    vinyls.value = data.vinyls
  } catch {
    error.value = 'No pudimos cargar la biblioteca.'
  } finally {
    loading.value = false
  }
}

function setFilter(filter: Filter) {
  activeFilter.value = filter
  void loadVinyls()
}

function openConfigure(vinyl: Vinyl) {
  configuringVinyl.value = vinyl
  searchQuery.value = ''
  resources.value = []
  selectedResource.value = null
  vinylName.value = vinyl.name || ''
  modalError.value = null
}

function closeConfigure() {
  configuringVinyl.value = null
}

async function runSearch() {
  if (searchQuery.value.length < 2) return
  searching.value = true
  modalError.value = null
  try {
    const data = await searchResources(searchQuery.value)
    resources.value = data.items
    if (data.items.length === 0) {
      modalError.value = 'No encontramos resultados para esa búsqueda.'
    }
  } catch {
    modalError.value = 'No pudimos buscar en Spotify.'
  } finally {
    searching.value = false
  }
}

function selectResource(resource: Resource) {
  selectedResource.value = resource
  if (!vinylName.value) {
    vinylName.value = resource.name
  }
}

async function saveConfiguration() {
  if (!configuringVinyl.value || !selectedResource.value || vinylName.value.length < 2) return

  saving.value = true
  modalError.value = null
  try {
    const updated = await updateVinyl(configuringVinyl.value.id, {
      name: vinylName.value,
      spotify_uri: selectedResource.value.spotify_uri,
      album_name: selectedResource.value.name,
      album_art_url: selectedResource.value.art_url || '',
    })
    vinyls.value = vinyls.value.map((vinyl) => (vinyl.id === updated.id ? updated : vinyl))
    closeConfigure()
  } catch {
    modalError.value = 'No pudimos guardar la configuración.'
  } finally {
    saving.value = false
  }
}

async function removeVinyl(vinyl: Vinyl) {
  if (!window.confirm(`Eliminar ${vinyl.name || 'este vinilo'}?`)) return

  deletingId.value = vinyl.id
  error.value = null
  try {
    await deleteVinyl(vinyl.id)
    vinyls.value = vinyls.value.filter((item) => item.id !== vinyl.id)
  } catch {
    error.value = 'No pudimos eliminar el vinilo.'
  } finally {
    deletingId.value = null
  }
}

onMounted(loadVinyls)
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

.logo { font-size: 1.5rem; font-weight: 700; color: var(--color-accent-light); }
.nav-links { display: flex; gap: 2rem; }
.nav-links a { color: var(--color-text-muted); font-size: 0.95rem; }
.nav-links a:hover, .nav-links a.router-link-active { color: var(--color-text); }

.content { padding: 3rem 4rem; max-width: 1400px; margin: 0 auto; }

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.eyebrow {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.header h1 { font-size: 2rem; }
.filters { display: flex; gap: 0.5rem; }

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  transition: all 0.2s;
}

.filter-btn:hover { border-color: var(--color-accent); color: var(--color-text); }
.filter-btn.active { background: var(--color-accent); border-color: var(--color-accent); color: white; }

.alert {
  border: 1px solid rgba(180, 60, 60, 0.4);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  color: #ffb4b4;
  background: rgba(120, 20, 20, 0.18);
  font-size: 0.9rem;
}

.vinyl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.5rem;
}

.vinyl-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.art {
  position: relative;
  aspect-ratio: 1;
  background: #1d1d1d;
}

.art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.art-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--color-accent-light);
  font-weight: 700;
  background: radial-gradient(circle at 35% 25%, #2f1a4d, #121212 68%);
}

.badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: rgba(10, 10, 10, 0.78);
  border: 1px solid rgba(168, 85, 247, 0.45);
  color: var(--color-accent-light);
  font-size: 0.75rem;
  font-weight: 700;
}

.card-body { padding: 1rem; }
.card-body h2 { font-size: 1rem; margin-bottom: 0.35rem; }
.card-body p { color: var(--color-text-muted); font-size: 0.85rem; line-height: 1.35; min-height: 2.3em; }
.owner { display: block; color: #555; font-size: 0.75rem; margin-top: 0.7rem; }

.card-actions {
  display: flex;
  gap: 0.6rem;
  padding: 0 1rem 1rem;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.btn-primary {
  padding: 0.65rem 1rem;
  background: var(--color-accent);
  color: white;
}

.btn-primary:hover:not(:disabled) { background: var(--color-accent-light); }

.btn-secondary,
.btn-danger {
  padding: 0.65rem 1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-secondary:hover:not(:disabled) { border-color: var(--color-accent); color: var(--color-accent-light); }
.btn-danger:hover:not(:disabled) { border-color: #a33; color: #ffb4b4; }
button:disabled { opacity: 0.55; cursor: default; }

.empty {
  color: var(--color-text-muted);
  text-align: center;
  padding: 4rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.78);
}

.modal {
  width: min(620px, 100%);
  max-height: min(760px, calc(100vh - 2rem));
  overflow: auto;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.modal-header h2 { font-size: 1.4rem; }

.icon-button {
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  font-size: 1.4rem;
  line-height: 1;
}

.search-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.7rem;
  margin-bottom: 1rem;
}

.search-row input,
.form-group input {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--color-text);
  font-size: 0.95rem;
  outline: none;
}

.search-row input:focus,
.form-group input:focus { border-color: var(--color-accent); }

.results {
  display: grid;
  gap: 0.6rem;
  max-height: 280px;
  overflow: auto;
  margin-bottom: 1rem;
}

.result-item {
  display: grid;
  grid-template-columns: 56px 1fr;
  align-items: center;
  gap: 0.8rem;
  padding: 0.55rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text);
  text-align: left;
}

.result-item.selected { border-color: var(--color-accent-light); }
.result-item img,
.result-art {
  width: 56px;
  height: 56px;
  border-radius: 6px;
  object-fit: cover;
  background: #222;
}

.result-art {
  display: grid;
  place-items: center;
  color: var(--color-accent-light);
}

.result-item strong,
.result-item small { display: block; }
.result-item small { margin-top: 0.2rem; color: var(--color-text-muted); }

.form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 1rem; }
.form-group label { font-size: 0.85rem; color: var(--color-text-muted); }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-top: 1.5rem;
}
</style>
