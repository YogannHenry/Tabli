<template>
  <div class="table-list-view">
    <h1 class="title">Les Tables</h1>
    <p class="subtitle">Sélectionnez une table pour commencer l'apprentissage.</p>

    <div class="tables-grid">
      <router-link 
        v-for="i in 10" 
        :key="i" 
        :to="`/tables/${i}`" 
        class="card table-card"
      >
        <span class="table-number">{{ i }}</span>
        <span class="table-label">Table de {{ i }}</span>
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
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
  )

  gsap.fromTo('.table-card', 
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.5)', delay: 0.2 }
  )
})
</script>

<style scoped>
.table-list-view {
  padding-top: 10px;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 24px;
}

@media (min-width: 600px) {
  .tables-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
    margin-top: 32px;
  }
}

.table-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
}

.table-number {
  font-size: 48px;
  font-weight: 700;
  color: var(--accent-color);
  line-height: 1;
  margin-bottom: 8px;
}

.table-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}
</style>
