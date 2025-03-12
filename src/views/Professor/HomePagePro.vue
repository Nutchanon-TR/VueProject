<script setup>
import {} from "vue";
import ExamBlog from "@/components/ExamBlog.vue";
</script>
<template>
<div class="p-6 mx-[100px]">
       <div class="flex justify-between items-center">
         <div>
           <h1 class="text-2xl font-bold">PUBLISHED CLASSES</h1>
           <p class="text-gray-500 mb-4">These classes are available to students.</p>
         </div>
         <h2 class="text-2xl font-bold text-black">STUDENT</h2>
       </div>
       </div>
  <div>
    <ExamBlog />
  </div>
</template>
