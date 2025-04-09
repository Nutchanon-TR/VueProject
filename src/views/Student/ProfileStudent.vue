<script setup>
import { ref, onMounted } from "vue";
import navBar from '@/components/navBar.vue';
import { userLogin } from '@/stores/loginDataUser.js';
import Profile from "@/components/Profile.vue";
import History from "@/components/History.vue";

const userLoginData = userLogin();
const updateImageUser = ref("");
const updateImage = (newImg) => {
  updateImageUser.value = newImg;
}

</script>



<template>
  <navBar :updateImage="updateImageUser"/>
  <div class="flex flex-col md:flex-row justify-between items-start gap-6 p-6">
    <Profile @updateImageURL="updateImage"/>
    <!-- ขวา -->
     <History />
  </div>
</template>
