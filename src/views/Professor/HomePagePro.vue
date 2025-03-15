<script setup>
import {} from "vue";
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
           <p class="text-2xl text-gray-500 mb-4">These classes are available to professor.
          </p>
         </div>
         <h2 class="text-4xl font-bold text-black">PROFESSOR</h2>
       </div>
       </div>
  <div>
    <ExamBlog />
  </div>
</template>
