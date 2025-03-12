import { defineStore } from 'pinia';

export const userLogin = defineStore('user', {
  state: () => ({
     email: '',
      name: '',
      password: '',
      bio: '',
      role: '',
      history: [],
      id: ''
  }),
  actions: {
    changeUser(newData) {
      this.email = newData.email;
      this.name = newData.name;
      this.password = newData.password;
      this.bio = newData.bio;
      this.role = newData.role;
      this.history = newData.history;
      this.id = newData.id;
    }
    
  }
});