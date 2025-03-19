<script setup>
import { ref } from "vue";
import navBar from '@/components/navBar.vue'
import {userLogin} from '@/stores/loginDataUser.js'
import { getDataById } from '@/libs/apiData.js'
const userLoginData = userLogin()
const idUserData = ref('')


const cookiesText = ref("");
const addCookie = async() => {
     document.cookie = `${cookiesText.value}; path=/; max-age=3600*24*7; secure`;
     idUserData.value = await getDataById(`${import.meta.env.VITE_API_URL}/users`,document.cookie);
     userLoginData.keepDataFromLogin(idUserData.value)
     console.log("Add: ", document.cookie); 
     console.log("Cookies Text: ", cookiesText.value); 
};

const checkCookies = async() => {
     console.log("Check Cookie",document.cookie);
     console.log("userLoginData: ",userLoginData)
  console.log("userLoginData.email: ",userLoginData.email)
  console.log("userLoginData.firstName: ",userLoginData.name)
  console.log("userLoginData.history: ",userLoginData.history[1])
};
</script>

<template>
  
  <navBar/>

This is the Admin page
<div>
     <input type="text" placeholder="name" v-model="cookiesText" />
    <button @click="addCookie" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
      Add Cookies
    </button>
    <button @click="checkCookies" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
      Check Cookies
    </button>
  </div>
</template>