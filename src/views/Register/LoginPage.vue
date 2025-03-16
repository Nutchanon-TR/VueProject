<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { getAllData } from "./../../libs/apiData.js";
import { userLogin } from "@/stores/loginDataUser.js";
import { getDataById } from "@/libs/apiData.js";

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
const userLoginData = userLogin();
const idUserData = ref("");
//keep user data in pinia
const informUser = async (userId) => {
  document.cookie = `${userId}; path=/; max-age=3600*24*7; secure`;
  idUserData.value = await getDataById(
    `${import.meta.env.VITE_API_URL}/users`,
    document.cookie
  );
  userLoginData.keepDataFromLogin(idUserData.value);
  console.log("userLoginData: ", userLoginData);
  console.log("userLoginData.email: ", userLoginData.email);
  console.log("userLoginData.firstName: ", userLoginData.name);
  console.log("userLoginData.history: ", userLoginData.history[1]);
  checkRoleRouteUser();
};

const router = useRouter();
const checkRoleRouteUser = () => {
  if (userLoginData.role === "admin") {
    router.push({ name: "AdminPage" });
  } else if (userLoginData.role === "professor") {
    router.push({ name: "HomePagePro" });
  } else if (userLoginData.role === "student") {
    router.push({ name: "HomePageStud" });
  } else {
    console.log("error");
  }
};
</script>

<template>
  <div class="flex min-h-screen bg-white">
    <!-- Left Panel -->
    <div
      class="w-1/2 flex flex-col items-center justify-center p-12 border-r border-gray-200"
    >
      <h1 class="text-4xl font-bold mb-12">TEST2HUB</h1>

      <div class="w-full max-w-md space-y-6">
        <!-- Email Input -->
        <div class="relative">
          <input
            type="email"
            placeholder="EMAIL"
            v-model="email"
            class="w-full px-6 py-4 border-2 border-black rounded-full text-lg font-medium focus:outline-none"
          />
        </div>

        <!-- Password Input -->
        <div class="relative">
          <input
            type="password"
            placeholder="PASSWORD"
            v-model="password"
            class="w-full px-6 py-4 border-2 border-black rounded-full text-lg font-medium focus:outline-none"
          />
        </div>

        <!-- Error Message -->
        <p class="text-red-500" v-if="errorMsg">{{ errorMsg }}</p>

        <!-- Login Button -->
        <button
          @click="loginChecking(password)"
          class="w-full text-center py-3 text-2xl font-bold hover:opacity-90"
        >
          LOG_IN
        </button>

        <!-- Divider -->
        <div class="flex items-center justify-center space-x-4 my-4">
          <div class="h-px bg-gray-300 w-1/3"></div>
          <span class="text-gray-500">OR</span>
          <div class="h-px bg-gray-300 w-1/3"></div>
        </div>

        <!-- Sign Up Button -->
        <RouterLink :to="{ name: 'SignUpPage' }" class="block">
          <button
            class="w-full text-center py-3 text-2xl font-bold hover:opacity-90"
          >
            SIGN_UP
          </button>
        </RouterLink>
      </div>
    </div>

    <div class="w-1/2 bg-blue-300 flex items-center justify-center">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrjs6HDrges8WFWKTdJvelXAFrbIEEM6j_kQ&s" class="w-2/3 rounded-2xl" />
    </div>
  </div>
</template>
