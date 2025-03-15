<script setup>
import { RouterLink } from "vue-router";
import ExamBlog from "@/components/ExamBlog.vue";
import navBar from '@/components/navBar.vue'
import {userLogin} from '@/stores/loginDataUser.js'
const userLoginData = userLogin()

</script>
<template>
          <navBar/>
          <div class="p-8 mt-[20px] mb-[-20px] mx-[170px]">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">PUBLISHED CLASSES</h1>
        <p class="text-lg text-gray-800 mb-4">THESE CLASSES ARE AVAILABLE TO PROFESSOR.</p>
        
        <!-- Create Form Button -->
         <RouterLink :to="{ name: 'CreateExamPage' }" class="block">
        <button class="bg-blue-400 hover:bg-blue-500 text-black font-bold py-3 px-5 rounded-2xl flex items-center">
          <span class="mr-1">+</span> CREATE FORM
        </button>
        </RouterLink>
      </div>
      <h2 class="text-4xl font-bold text-black">PROFESSOR</h2>
    </div>
    
    <!-- Horizontal Line -->
    <div class="border-b border-gray-400 mt-6"></div>
  </div>
  
  <div>
    <ExamBlog />
  </div>
</template>
