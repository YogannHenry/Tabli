<template>
  <div class="table-detail-view">
    <div class="header-actions">
      <router-link to="/tables" class="btn btn-secondary">
        &larr; Retour
      </router-link>
    </div>

    <h1 class="title">Table de {{ id }}</h1>
    
    <div class="multiplication-list card">
      <div v-for="i in 10" :key="i" class="math-row">
        <span class="equation">{{ id }} &times; {{ i }}</span>
        <span class="equals">=</span>
        <span class="result">{{ id * i }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = computed(() => parseInt(route.params.id))
</script>

<style scoped>
.table-detail-view {
  padding-top: 10px;
  max-width: 400px;
  margin: 0 auto;
}

.header-actions {
  margin-bottom: 16px;
}

.multiplication-list {
  margin-top: 24px;
  padding: 24px 16px;
}

@media (min-width: 600px) {
  .table-detail-view {
    padding-top: 20px;
  }
  .header-actions {
    margin-bottom: 24px;
  }
  .multiplication-list {
    margin-top: 32px;
    padding: 32px 48px;
  }
}

.math-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 20px;
  border-bottom: 1px solid var(--border-color);
}

.math-row:last-child {
  border-bottom: none;
}

.equation {
  font-weight: 500;
  color: var(--text-secondary);
  width: 80px;
  text-align: right;
}

.equals {
  color: var(--text-secondary);
  margin: 0 16px;
}

.result {
  font-weight: 700;
  color: var(--accent-color);
  width: 60px;
}
</style>
