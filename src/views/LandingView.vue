<template>
  <div class="landing">
    <nav class="nav">
      <span class="logo">Orpheus</span>
      <div class="nav-actions">
        <RouterLink to="/login" class="btn btn-ghost">Iniciar sesión</RouterLink>
        <RouterLink to="/register" class="btn btn-primary">Registrarse</RouterLink>
      </div>
    </nav>

    <section class="hero">
      <h1>La música física,<br />en la era digital.</h1>
      <p>Apoyá un mini-vinilo en tu dispositivo Orpheus y tu álbum favorito empieza a sonar en Spotify.</p>
      <RouterLink to="/register" class="btn btn-primary btn-lg">Empezar ahora</RouterLink>
    </section>

    <section class="how-it-works">
      <h2>¿Cómo funciona?</h2>
      <div class="steps">
        <div class="step">
          <span class="step-number">01</span>
          <h3>Escaneá</h3>
          <p>Apoyá un mini-vinilo en el lector RFID de tu dispositivo Orpheus.</p>
        </div>
        <div class="step">
          <span class="step-number">02</span>
          <h3>Identificá</h3>
          <p>El sistema reconoce el vinilo y busca su álbum asociado en la nube.</p>
        </div>
        <div class="step">
          <span class="step-number">03</span>
          <h3>Reproducí</h3>
          <p>Spotify empieza a sonar automáticamente en tu dispositivo.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: var(--color-bg);
}

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
  letter-spacing: 0.05em;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8rem 2rem;
  background: linear-gradient(135deg, #0A0A0A 0%, #1a0a2e 50%, #0A0A0A 100%);
}

.hero h1 {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #F5F5F5, var(--color-accent-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  max-width: 480px;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.how-it-works {
  padding: 6rem 4rem;
  text-align: center;
}

.how-it-works h2 {
  font-size: 2rem;
  margin-bottom: 3rem;
  color: var(--color-text);
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.step {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  text-align: left;
}

.step-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-accent);
  display: block;
  margin-bottom: 1rem;
}

.step h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.step p {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-accent);
  color: white;
}

.btn-primary:hover {
  background: var(--color-accent-light);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-ghost:hover {
  border-color: var(--color-accent);
  color: var(--color-accent-light);
}

.btn-lg {
  padding: 0.9rem 2rem;
  font-size: 1rem;
}
</style>
