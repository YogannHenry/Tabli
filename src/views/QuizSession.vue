<template>
  <div class="quiz-session-view" v-if="session">
    <div v-if="!session.completed">
      <div class="quiz-header">
        <div class="progress-info">
          Question {{ session.currentIndex + 1 }} / {{ session.questions.length }}
        </div>
        <div class="score-info">
          Score: {{ session.score }}
        </div>
      </div>

      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${((session.currentIndex) / session.questions.length) * 100}%` }"
        ></div>
      </div>

      <Transition
        @enter="onEnter"
        @leave="onLeave"
        mode="out-in"
        :css="false"
      >
        <div :key="session.currentIndex" class="question-container">
          <div class="card question-card">
            <div class="equation">
              {{ currentQuestion.table }} &times; {{ currentQuestion.multiplier }} = ?
            </div>
          </div>

          <div class="options-grid">
            <button 
              v-for="option in options" 
              :key="option"
              class="btn card option-btn"
              :class="getOptionClass(option)"
              @click="selectAnswer(option, $event)"
              :disabled="showFeedback"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <div v-else class="results-view" ref="resultsView">
      <div class="icon-circle" :class="scorePercentage >= 80 ? 'bg-success' : 'bg-warning'">
        <svg v-if="scorePercentage >= 80" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      
      <h1 class="title">Entraînement terminé !</h1>
      <p class="subtitle">Votre score: {{ session.score }} / {{ session.questions.length }}</p>
      
      <div class="actions">
        <router-link to="/train" class="btn btn-secondary">Rejouer</router-link>
        <router-link to="/progress" class="btn btn-primary">Voir ma progression</router-link>
      </div>
    </div>
  </div>
  <div v-else class="error-view">
    <p>Aucune session en cours.</p>
    <router-link to="/train" class="btn btn-primary">Configurer l'entraînement</router-link>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useQuizStore } from '../stores/quiz'
import gsap from 'gsap'
import confetti from 'canvas-confetti'

const store = useQuizStore()
const session = computed(() => store.currentSession)
const resultsView = ref(null)

const currentQuestion = computed(() => {
  if (!session.value || session.value.completed) return null
  return session.value.questions[session.value.currentIndex]
})

const options = computed(() => {
  if (!currentQuestion.value) return []
  const correct = currentQuestion.value.answer
  
  const wrongAnswers = new Set()
  const t = currentQuestion.value.table
  const m = currentQuestion.value.multiplier
  
  wrongAnswers.add(t * (m + 1))
  wrongAnswers.add(t * (m > 1 ? m - 1 : m + 2))
  wrongAnswers.add((t > 1 ? t - 1 : t + 1) * m)
  
  wrongAnswers.delete(correct)
  
  let opts = Array.from(wrongAnswers).slice(0, 3)
  
  while (opts.length < 3) {
    let rand = correct + Math.floor(Math.random() * 10) - 5
    if (rand !== correct && rand > 0 && !opts.includes(rand)) {
      opts.push(rand)
    }
  }
  
  opts.push(correct)
  
  return opts.sort(() => Math.random() - 0.5)
})

const showFeedback = ref(false)
const selectedOption = ref(null)

const selectAnswer = (answer, event) => {
  if (showFeedback.value) return
  
  selectedOption.value = answer
  showFeedback.value = true
  
  const correct = currentQuestion.value.answer === answer
  const btn = event.currentTarget

  if (correct) {
    // Mini confetti from button
    const rect = btn.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight
    
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#34c759', '#ffffff'],
      disableForReducedMotion: true
    })

    // GSAP pop effect
    gsap.to(btn, {
      scale: 1.1,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    })
  } else {
    // GSAP shake effect
    gsap.to(btn, {
      x: () => (Math.random() > 0.5 ? 10 : -10),
      duration: 0.05,
      yoyo: true,
      repeat: 5,
      ease: 'power1.inOut',
      onComplete: () => gsap.set(btn, {x: 0})
    })
  }
  
  setTimeout(() => {
    store.answerQuestion(answer)
    showFeedback.value = false
    selectedOption.value = null
  }, 1000)
}

const getOptionClass = (option) => {
  if (!showFeedback.value) return ''
  
  const correct = currentQuestion.value.answer
  
  if (option === correct) return 'correct'
  if (option === selectedOption.value && option !== correct) return 'incorrect'
  
  return 'dimmed'
}

const scorePercentage = computed(() => {
  if (!session.value || session.value.questions.length === 0) return 0
  return (session.value.score / session.value.questions.length) * 100
})

// Transition hooks for question
const onEnter = (el, done) => {
  gsap.fromTo(el, 
    { opacity: 0, y: 20, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)', onComplete: done }
  )
}

const onLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    duration: 0.3, 
    ease: 'power2.in',
    onComplete: done
  })
}

// Watch for completion to show big confetti
watch(() => session.value?.completed, (isCompleted) => {
  if (isCompleted && scorePercentage.value >= 50) {
    nextTick(() => {
      gsap.fromTo('.results-view', 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.7)' }
      )
      
      const duration = 2000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#0071e3', '#34c759', '#ff9500']
        })
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#0071e3', '#34c759', '#ff9500']
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    })
  } else if (isCompleted) {
    nextTick(() => {
      gsap.fromTo('.results-view', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      )
    })
  }
})
</script>

<style scoped>
.quiz-session-view {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 10px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-weight: 600;
  color: var(--text-secondary);
}

.progress-bar {
  height: 8px;
  background-color: var(--border-color);
  border-radius: var(--radius-full);
  margin-bottom: 24px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.3s ease;
}

.question-card {
  padding: 40px 16px;
  text-align: center;
  margin-bottom: 24px;
}

.equation {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

@media (min-width: 600px) {
  .quiz-session-view {
    padding-top: 20px;
  }
  .progress-bar {
    margin-bottom: 32px;
  }
  .question-card {
    padding: 64px 24px;
    margin-bottom: 32px;
  }
  .equation {
    font-size: 56px;
  }
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.option-btn {
  font-size: 24px;
  font-weight: 600;
  padding: 24px;
  cursor: pointer;
}

.option-btn:hover:not(:disabled) {
  border-color: var(--accent-color);
}

.option-btn.correct {
  background-color: var(--success);
  color: white;
  border-color: var(--success);
}

.option-btn.incorrect {
  background-color: var(--danger);
  color: white;
  border-color: var(--danger);
  animation: shake 0.4s;
}

.option-btn.dimmed {
  opacity: 0.5;
}

.results-view {
  text-align: center;
  padding-top: 48px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
}

.bg-success { background-color: var(--success); }
.bg-warning { background-color: var(--warning); }

.results-view .actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 48px;
}

.error-view {
  text-align: center;
  padding-top: 48px;
}

.error-view p {
  margin-bottom: 24px;
  color: var(--text-secondary);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
