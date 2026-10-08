<template>
  <div class="progress-view">
    <h1 class="title">Votre Progression</h1>
    <p class="subtitle">Suivez l'évolution de votre apprentissage pour chaque table.</p>

    <div class="stats-grid">
      <div 
        v-for="i in 10" 
        :key="i"
        class="card stat-card"
      >
        <div class="stat-header">
          <h2>Table de {{ i }}</h2>
          <span class="percentage">{{ getProgress(i) }}%</span>
        </div>
        
        <div class="progress-track">
          <div 
            class="progress-fill"
            :class="getProgressColorClass(getProgress(i))"
            :style="{ width: `${getProgress(i)}%` }"
          ></div>
        </div>
        
        <div class="stat-details">
          <span v-if="getAttempts(i) > 0">
            {{ getCorrect(i) }} / {{ getAttempts(i) }} réussites
          </span>
          <span v-else class="empty-state">
            Aucun essai
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuizStore } from '../stores/quiz'
import gsap from 'gsap'

const store = useQuizStore()

onMounted(() => {
  gsap.fromTo('.title, .subtitle', 
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
  )

  gsap.fromTo('.stat-card', 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.1 }
  )
})

const getProgress = (tableId) => {
  return store.getTableProgress(tableId)
}

const getAttempts = (tableId) => {
  return store.progress[tableId]?.total || 0
}

const getCorrect = (tableId) => {
  return store.progress[tableId]?.correct || 0
}

const getProgressColorClass = (percentage) => {
  if (percentage === 0) return 'bg-gray'
  if (percentage < 50) return 'bg-danger'
  if (percentage < 80) return 'bg-warning'
  return 'bg-success'
}
</script>

<style scoped>
.progress-view {
  padding-top: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 24px;
}

@media (min-width: 600px) {
  .progress-view {
    padding-top: 20px;
  }
  .stats-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 40px;
  }
}

.stat-card {
  display: flex;
  flex-direction: column;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stat-header h2 {
  font-size: 18px;
  margin: 0;
}

.percentage {
  font-weight: 700;
  font-size: 20px;
  color: var(--text-main);
}

.progress-track {
  height: 12px;
  background-color: var(--border-color);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}

.bg-gray { background-color: var(--text-secondary); }
.bg-danger { background-color: var(--danger); }
.bg-warning { background-color: var(--warning); }
.bg-success { background-color: var(--success); }

.stat-details {
  font-size: 14px;
  color: var(--text-secondary);
  text-align: right;
}

.empty-state {
  font-style: italic;
  opacity: 0.7;
}
</style>
