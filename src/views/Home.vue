<template>
  <div class="home-view">
    <h1 class="title">Maîtrisez vos tables</h1>
    <p class="subtitle">La méthode la plus simple et élégante pour apprendre les tables de multiplication.</p>

    <div class="action-cards">
      <router-link to="/tables" class="card action-card">
        <div class="icon-circle bg-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
        </div>
        <h2>Apprendre</h2>
        <p>Révisez toutes les tables de 1 à 10 à votre rythme.</p>
      </router-link>

      <router-link to="/train" class="card action-card">
        <div class="icon-circle bg-orange">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        </div>
        <h2>S'entraîner</h2>
        <p>Testez vos connaissances avec des quiz rapides.</p>
      </router-link>

      <router-link to="/progress" class="card action-card">
        <div class="icon-circle bg-green">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        </div>
        <h2>Progression</h2>
        <p>Suivez vos succès et identifiez les tables à améliorer.</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'

onMounted(() => {
  gsap.fromTo('.title, .subtitle', 
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
  )
  
  gsap.fromTo('.action-card', 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
  )
})
</script>

<style scoped>
.home-view {
  text-align: center;
  padding-top: 20px;
}

@media (min-width: 600px) {
  .home-view {
    padding-top: 40px;
  }
}

.action-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 32px;
}

@media (min-width: 600px) {
  .action-cards {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
    margin-top: 48px;
  }
}

.action-card {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-decoration: none;
  color: var(--text-main);
}

.action-card h2 {
  font-size: 20px;
  margin-bottom: 8px;
}

.action-card p {
  color: var(--text-secondary);
  font-size: 14px;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
}

.bg-blue { background-color: var(--accent-color); }
.bg-orange { background-color: var(--warning); }
.bg-green { background-color: var(--success); }
</style>
