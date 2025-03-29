import { defineStore } from 'pinia'

export const userLogin = defineStore('loginDataUser', {
  state:() => ({
    id: '',
    email: '',
    name: '',
    password: '',
    bio: "",
    role: "",
    imageURL: "",
    history: [],
    likeExam_Id: [],
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
      this.imageURL = data.imageURL;
    }
  }
})
