import { defineStore } from 'pinia'

export const userLogin = defineStore('loginDataUser', {
  state:() => ({
    id: '',
    email: '',
    name: '',
    password: '',
    bio: "",
    role: "",
    history: [],
  }),
  actions:{
    keepDataFromLogin(data){
      this.id = data.id
      this.email = data.email
      this.name = data.name
      this.password = data.password
      this.bio = data.bio
      this.role = data.role
      this.history = data.history
    }
  }
})
