<script setup>
import { onMounted, ref } from "vue";
import { getAllData } from "./../../libs/apiData.js";
import {userLogin} from '@/stores/loginDataUser.js'
import { getDataById } from '@/libs/apiData.js'


const userData = ref([]);
onMounted(async () => {
  try {
    userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`);
    console.log(userData.value);
  } catch (error) {
    console.error(error);
  }
});


const email = ref("");
const password = ref("");
const errorMsg = ref("");
const loginChecking = (pass) => {
  const userExist = userData.value.find((user) => user.email === email.value);
  errorMsg.value = "";
  if (email.value === "") {
    errorMsg.value = "Please fill your email";
    console.log("error: ", errorMsg.value);
  } else if (!email.value.includes("@")) {
    errorMsg.value = "Please fill @ on your email";
    console.log("error: ", errorMsg.value);
  } else if (!userExist) {
    errorMsg.value = "User not exist";
    console.log("error: ", errorMsg.value);
  } else if (pass === "") {
    errorMsg.value = "Please fill your password";
    console.log("error: ", errorMsg.value);
  } else if (userExist.password !== pass) {
    errorMsg.value = "Password is incorrect";
    console.log("error: ", errorMsg.value);
  } else {
    console.log("eiei");
    console.log(userExist.id);
    informUser(userExist.id);
  }
};

//load user data
const userLoginData = userLogin()
const idUserData = ref('')
//keep user data in pinia
const informUser = async(userId) => {
  document.cookie = `${userId}; path=/; max-age=3600*24*7; secure`;
  idUserData.value = await getDataById(`${import.meta.env.VITE_API_URL}/users`,document.cookie);
  userLoginData.keepDataFromLogin(idUserData.value)
  console.log("userLoginData: ",userLoginData)
  console.log("userLoginData.email: ",userLoginData.email)
  console.log("userLoginData.firstName: ",userLoginData.name)
  console.log("userLoginData.history: ",userLoginData.history[1])
  checkRoleRouteUser(userLoginData.role);
};

//Comming soon
const checkRoleRouteUser = (role) => {
  if (role === "student") {
    console.log("student");
  } else if (role === "professor") {
    console.log("professor");
  } else if (role === "admin") {
    console.log("admin");
  } else {
    console.log("error");
  }
};
</script>

<template>
  <input type="email" placeholder="EMAIL" v-model="email" />
  <input type="password" placeholder="PASSWORD" v-model="password" />
  <p class="text-red-500 mb-4">{{ errorMsg }}</p>
  <button @click="loginChecking(password)">LOG IN</button>
  <hr />
  <p>Anais_Romaguera@hotmail.com</p>
  <p>TMuRdzqO9PP3s0C</p>
</template>

<!-- <template>
  login page
  <div>
    <input type="email" placeholder="email" v-model="email" />
    <input type="password" placeholder="password" v-model="password" />
    <button
      class="bg-blue-200 hover:bg-blue-300"
      @click="loginChecking(password)"
    >
      login
    </button>
    {{ errorMsg }}
  </div>
</template> -->
