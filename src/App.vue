<template>
  <div class="page-container">
    <header class="app-header">
      <router-link to="/" class="logo">Les10Tabs</router-link>
      <nav class="main-nav">
        <router-link to="/tables" class="nav-link">Apprendre</router-link>
        <router-link to="/train" class="nav-link">S'entraîner</router-link>
        <router-link to="/progress" class="nav-link">Progression</router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-bottom: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--border-color);
}

@media (min-width: 600px) {
  .app-header {
    flex-direction: row;
    justify-content: space-between;
    gap: 0;
  }
}

.logo {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent-color);
  letter-spacing: -0.05em;
  text-align: center;
}

.main-nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (min-width: 600px) {
  .main-nav {
    gap: 16px;
  }
}

.nav-link {
  font-weight: 500;
  padding: 8px 12px;
  border-radius: var(--radius-full);
  transition: background-color 0.2s, color 0.2s;
  color: var(--text-secondary);
  font-size: 14px;
}

@media (min-width: 600px) {
  .nav-link {
    padding: 8px 16px;
    font-size: 16px;
  }
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-main);
}

.nav-link.router-link-active {
  background-color: var(--accent-color);
  color: white;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
