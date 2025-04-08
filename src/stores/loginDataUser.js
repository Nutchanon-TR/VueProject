import { defineStore } from 'pinia'
import { ref } from 'vue'

export const userLogin = defineStore('loginDataUser', () => {
  const id = ref('')
  const email = ref('')
  const name = ref('')
  const password = ref('')
  const bio = ref('')
  const role = ref('')
  const imageURL = ref('')
  const history = ref([])
  const likeExam_Id = ref([])

  function keepDataFromLogin(data) {
    id.value = data.id
    email.value = data.email
    name.value = data.name
    password.value = data.password
    bio.value = data.bio
    role.value = data.role
    history.value = data.history
    imageURL.value = data.imageURL
    likeExam_Id.value = data.likeExam_Id
  }

  return {
    id,
    email,
    name,
    password,
    bio,
    role,
    imageURL,
    history,
    likeExam_Id,
    keepDataFromLogin
  }
})
