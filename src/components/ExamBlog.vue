<script setup>
import { onMounted, ref } from "vue";
import {getAllData} from "../libs/apiData.js";

const examData = ref([])
const userData = ref([])

onMounted (async () => {
   try {
      examData.value = await getAllData(`${import.meta.env.VITE_API_URL}/exams`)
      userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`)
      console.log(examData.value)
      console.log(userData.value)
   } catch (error) {
      console.error(error);
   }
})

const byProfessor = (ownerId) => {
   const user = userData.value.find(user => user.id == ownerId);
   return user ? user.name : "Unknown";
};
</script>

<template>
   <div class="bg-black-100 min-h-screen">
     <div class="p-6 mx-[50px]">
       <div class="grid grid-cols-3 gap-12 mx-[120px] mt-[-20px]">
         <button
           v-for="(exam, index) in examData"
           :key="index"
           class="bg-blue-400 text-white rounded-xl shadow-md overflow-hidden w-full text-left flex flex-col hover:cursor-pointer"
         >
           <!-- Upper Section -->
           <div class="px-7 py-5">
             <h2 class="text-4xl font-bold text-black">{{ exam.category }}</h2>
             <p class="font-semibold pb-[80px] text-2xl pt-[7px]">{{ exam.name }}</p>
           </div>
 
           <!-- Bottom Section (White Box) -->
           <div class="flex justify-between items-center bg-white p-2 text-black border-t w-full">
             <div class="flex items-center py-[10px]">
               <span class="text-red-500 text-xl pl-[30px]">❤️</span>
               <span class="ml-1 text-2xl font-semibold">{{ exam.likes }}</span>
             </div>
             <p class="text-gray-600 text-xl pr-[30px]">BY {{ byProfessor(exam.ownerExam_id) }}</p>
           </div>
         </button>
       </div>
     </div>
   </div>
 </template>