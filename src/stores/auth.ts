import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentUser, type User } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const currentUser = ref<User | null>(null)
  const initialized = ref(false)
  const isRestoring = ref(false)

  function setUser(user: User | null) {
    currentUser.value = user
    isAuthenticated.value = user !== null
  }

  async function restoreSession() {
    if (initialized.value || isRestoring.value) return

    isRestoring.value = true
    try {
      const user = await getCurrentUser()
      setUser(user)
    } catch {
      setUser(null)
    } finally {
      initialized.value = true
      isRestoring.value = false
    }
  }

  function logoutLocal() {
    setUser(null)
    initialized.value = true
  }

  return {
    isAuthenticated,
    currentUser,
    initialized,
    isRestoring,
    setUser,
    restoreSession,
    logoutLocal,
  }
})
