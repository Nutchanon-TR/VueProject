<script setup>
import { ref, onMounted } from "vue";
import navBar from '@/components/navBar.vue';
import { userLogin } from '@/stores/loginDataUser.js';
import Profile from "@/components/Profile.vue";
import History from "@/components/History.vue";

const userLoginData = userLogin();

onMounted(() => {
  console.log(userLoginData.name);
});
</script>



<template>
  <navBar />
  <div class="flex flex-col md:flex-row justify-between items-start gap-6 p-6">
    <Profile />
    <!-- ขวา -->
     <History />
  </div>
</template>
