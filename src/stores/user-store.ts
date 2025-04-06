import { defineStore, acceptHMRUpdate } from 'pinia'
import { type User } from 'src/backend/db/users'

interface UserStore {
  user: User | null | undefined
}

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    user: undefined,
  }),

  actions: {
    setUser(user: User | null) {
      this.user = user ? { ...user } : null
    },
  },

  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
