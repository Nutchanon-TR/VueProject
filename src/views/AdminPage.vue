<script setup>
import navBar from "@/components/navBar.vue";
import ManageUser from "@/components/ManageUser.vue";
import { ref } from "vue";

</script>

<template>
  <navBar />
  <div class="bg-gray-100 px-8 py-6">
    <div class="flex justify-between items-center mx-[50px] mt-[20px]">
      <div>
        <h1 class="text-4xl font-bold mb-1">USERS LIST</h1>
        <p class="text-xl">THESE USERS ARE AVAILABLE IN APPLICATION.</p>
      </div>
      <div>
        <h2 class="text-5xl font-bold">ADMIN</h2>
      </div>
    </div>
    <hr class="border-t-2 border-gray-800 mt-4 mx-[50px] mb-[40px]">
    <ManageUser />
  </div>
</template> 
