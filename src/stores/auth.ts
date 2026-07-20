import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)

  function setAuthenticated(value: boolean) {
    isAuthenticated.value = value
  }

  return { isAuthenticated, setAuthenticated }
})
