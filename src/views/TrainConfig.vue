<template>
  <div class="train-config-view">
    <h1 class="title">Configuration</h1>
    <p class="subtitle">Choisissez les tables sur lesquelles vous souhaitez vous entraîner.</p>

    <div class="quick-select">
      <button class="btn btn-secondary" @click="selectGroup(1, 5)">Tables 1 à 5</button>
      <button class="btn btn-secondary" @click="selectGroup(6, 10)">Tables 6 à 10</button>
      <button class="btn btn-secondary" @click="selectAll()">Toutes</button>
      <button class="btn btn-secondary" @click="clearSelection()">Aucune</button>
    </div>

    <div class="table-selection grid">
      <label 
        v-for="i in 10" 
        :key="i" 
        class="card selection-card"
        :class="{ 'selected': selectedTables.includes(i) }"
      >
        <input 
          type="checkbox" 
          :value="i" 
          v-model="selectedTables"
          class="hidden-checkbox"
        >
        <span class="number">{{ i }}</span>
      </label>
    </div>

    <div class="actions">
      <button 
        class="btn btn-primary start-btn" 
        :disabled="selectedTables.length === 0"
        @click="startTraining"
      >
        Démarrer l'entraînement
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'
import gsap from 'gsap'

const router = useRouter()
const store = useQuizStore()

const selectedTables = ref([1, 2, 3, 4, 5])

onMounted(() => {
  gsap.fromTo('.title, .subtitle', 
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
  )
  
  gsap.fromTo('.quick-select .btn', 
    { y: 10, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power1.out', delay: 0.1 }
  )

  gsap.fromTo('.selection-card', 
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, stagger: 0.03, ease: 'back.out(1.2)', delay: 0.2 }
  )

  gsap.fromTo('.start-btn', 
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.5 }
  )
})

const selectGroup = (start, end) => {
  const newSelection = new Set(selectedTables.value)
  for (let i = start; i <= end; i++) {
    newSelection.add(i)
  }
  selectedTables.value = Array.from(newSelection).sort((a, b) => a - b)
}

const selectAll = () => {
  selectedTables.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}

const clearSelection = () => {
  selectedTables.value = []
}

const startTraining = () => {
  if (selectedTables.value.length === 0) return
  store.startSession(selectedTables.value)
  router.push('/quiz')
}
</script>

<style scoped>
.train-config-view {
  padding-top: 10px;
}

.quick-select {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

@media (min-width: 600px) {
  .train-config-view {
    padding-top: 20px;
  }
  .quick-select {
    gap: 12px;
    margin-bottom: 32px;
  }
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 16px;
    margin-bottom: 48px;
  }
}

.selection-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.selection-card:hover {
  transform: translateY(-2px);
}

.selection-card.selected {
  border-color: var(--accent-color);
  background-color: rgba(0, 113, 227, 0.05);
}

.hidden-checkbox {
  display: none;
}

.number {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-main);
}

.selection-card.selected .number {
  color: var(--accent-color);
}

.actions {
  display: flex;
  justify-content: center;
}

.start-btn {
  padding: 16px 48px;
  font-size: 18px;
}

.start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>
