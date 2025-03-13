<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import {userLogin} from './stores/loginDataUser.js'
import { getDataById } from '@/libs/apiData.js'
const userLoginData = userLogin()
const idUserData = ref('')

//load page and check cookie login
onMounted(async() => {
  idUserData.value = await getDataById(`${import.meta.env.VITE_API_URL}/users`,document.cookie);
  console.log("idUserData.value: ",idUserData.value.id);
  console.log("App: ",document.cookie);
  userLoginData.keepDataFromLogin(idUserData.value)
  console.log("userLoginData: ",userLoginData)
  console.log("userLoginData.email: ",userLoginData.email)
  console.log("userLoginData.firstName: ",userLoginData.name)
  console.log("userLoginData.history: ",userLoginData.history[1])
})
</script>

<template>
 <nav class="fixed bottom-0 left-0 w-full bg-gray-800 text-white shadow-md">
    <div class="flex justify-around py-3">
      <!-- Login -->
      <RouterLink :to="{ name: 'LoginPage' }" class="nav-item">
        🔑 Login
      </RouterLink>
      
      <!-- Sign Up -->
      <RouterLink :to="{ name: 'SignUpPage' }" class="nav-item">
        📝 Sign Up
      </RouterLink>

      <!-- Professor Home -->
      <RouterLink :to="{ name: 'HomePagePro' }" class="nav-item">
        🏠 Prof Home
      </RouterLink>

      <!-- Professor Profile -->
      <RouterLink :to="{ name: 'ProfileProfessor' }" class="nav-item">
        👨‍🏫 Prof Profile
      </RouterLink>

      <!-- Create Exam -->
      <RouterLink :to="{ name: 'CreateExamPage' }" class="nav-item">
        ✏️ Create Exam
      </RouterLink>

      <!-- Edit Exam -->
      <RouterLink :to="{ name: 'EditExamPage' }" class="nav-item">
        🛠️ Edit Exam
      </RouterLink>

      <!-- Student Home -->
      <RouterLink :to="{ name: 'HomePageStud' }" class="nav-item">
        🎓 Stud Home
      </RouterLink>

      <!-- Student Profile -->
      <RouterLink :to="{ name: 'ProfileStudent' }" class="nav-item">
        👤 Stud Profile
      </RouterLink>

      <!-- Do Exam -->
      <RouterLink :to="{ name: 'DoExamPage' }" class="nav-item">
        📄 Do Exam
      </RouterLink>

      <!-- Admin Page -->
      <RouterLink :to="{ name: 'AdminPage' }" class="nav-item">
        ⚙️ Admin
      </RouterLink>
    </div>
  </nav>
  <RouterView />
</template>
