<script setup>
import { onMounted } from "vue";
import {userLogin} from '@/stores/loginDataUser.js'
const userLoginData = userLogin()
onMounted(async() => {
  console.log("userLoginData: ",userLoginData)
  console.log("userLoginData.email: ",userLoginData.email)
  console.log("userLoginData.firstName: ",userLoginData.name)
  console.log("userLoginData.history: ",userLoginData.history[1])
  console.log("nav bar eiei")
})

</script>

<template>
     <nav class="bg-blue-400 flex justify-between items-center px-6 py-2">
       <h1 class="text-black font-bold text-lg">TEST2HUB</h1>
       
       <div class="flex items-center space-x-2">
         <span class="text-black font-bold">{{ userLoginData.name }}</span>
         <img 
           
           alt="User Avatar" 
           class="w-6 h-6 rounded-full border border-black"
         />
       </div>
     </nav>
   </template>