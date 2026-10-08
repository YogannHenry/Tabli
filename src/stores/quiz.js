import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    // Store progress in local storage
    progress: JSON.parse(localStorage.getItem('les10tabs_progress')) || {},
    currentSession: null
  }),
  actions: {
    startSession(tables) {
      // Generate questions based on selected tables
      let questions = []
      tables.forEach(table => {
        for (let i = 1; i <= 10; i++) {
          questions.push({ table, multiplier: i, answer: table * i })
        }
      })
      // Shuffle questions
      questions.sort(() => Math.random() - 0.5)
      // Limit to 20 questions for a session
      questions = questions.slice(0, 20)
      
      this.currentSession = {
        tables,
        questions,
        currentIndex: 0,
        score: 0,
        history: [], // { question, answerGiven, correct }
        completed: false
      }
    },
    answerQuestion(answer) {
      if (!this.currentSession || this.currentSession.completed) return false

      const q = this.currentSession.questions[this.currentSession.currentIndex]
      const correct = q.answer === answer
      
      if (correct) {
        this.currentSession.score++
      }

      this.currentSession.history.push({
        ...q,
        answerGiven: answer,
        correct
      })

      if (this.currentSession.currentIndex < this.currentSession.questions.length - 1) {
        this.currentSession.currentIndex++
      } else {
        this.currentSession.completed = true
        this.saveProgress()
      }
      return correct
    },
    saveProgress() {
      // Update progress per table
      const session = this.currentSession
      if (!session) return

      session.history.forEach(item => {
        if (!this.progress[item.table]) {
          this.progress[item.table] = { total: 0, correct: 0 }
        }
        this.progress[item.table].total++
        if (item.correct) {
          this.progress[item.table].correct++
        }
      })

      localStorage.setItem('les10tabs_progress', JSON.stringify(this.progress))
    }
  },
  getters: {
    getTableProgress: (state) => (tableId) => {
      const p = state.progress[tableId]
      if (!p || p.total === 0) return 0
      return Math.round((p.correct / p.total) * 100)
    }
  }
})
