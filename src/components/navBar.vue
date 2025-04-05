<script setup>
import { onMounted, reactive, ref } from "vue";
import { userLogin } from "@/stores/loginDataUser.js";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const userLoginData = userLogin();
const idUserData = reactive({
  id: "",
  email: "",
  name: "",
  password: "",
  bio: "",
  role: "",
  history: [],
});

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};


onMounted(async () => {
  console.log("userLoginData: ", userLoginData);
  console.log("userLoginData.email: ", userLoginData.email);
  console.log("userLoginData.firstName: ", userLoginData.name);
  console.log("userLoginData.history: ", userLoginData.history[1]);
  console.log("nav bar eiei");
});

const logout = () => {
  console.log("logout");
  document.cookie = "-1; path=/; max-age=0; secure"; // clear cookie
  userLoginData.keepDataFromLogin(idUserData);
  console.log("userLoginData: ", userLoginData);
  console.log("userLoginData.email: ", userLoginData.email);
  console.log("userLoginData.firstName: ", userLoginData.name);
  console.log("userLoginData.history: ", userLoginData.history[1]);
  router.push({ name: "LoginPage" });
};

const FindHomePage = () => {
  if (userLoginData.role === "admin") {
    router.push({ name: "AdminPage" });
  } else if (userLoginData.role === "professor") {
    router.push({ name: "HomePagePro" });
  } else if (userLoginData.role === "student") {
    router.push({ name: "HomePageStud" });
  }
};

const FindProfilePage = () => {
  if (userLoginData.role === "professor") {
    router.push({ name: "ProfileProfessor" });
  } else if (userLoginData.role === "student") {
    router.push({ name: "ProfileStudent" });
  } else if (userLoginData.role === "admin") {
    router.push({ name: "AdminPage" });
  }
};
</script>

<template>
  <nav
    class="bg-blue-500 flex justify-between items-center py-[20px] px-[50px]"
  >
    <button
      class="text-black font-bold text-3xl hover:cursor-pointer"
      @click="FindHomePage"
    >
      TEST2HUB
    </button>

    <div class="relative">
    <!-- Username Button -->
    <button
      class="text-black font-bold text-3xl hover:cursor-pointer"
      @click="toggleDropdown"
    >
      {{ userLoginData.name }} ▼
    </button>
    
    <!-- Dropdown Menu -->
    <div 
      v-show="isDropdownOpen"
      class="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10"
    >
      <button 
        class="w-full px-4 py-2 text-left hover:bg-gray-100 font-medium"
        @click="FindProfilePage"
      >
        PROFILE
      </button>
      <div class="border-b border-gray-200"></div>
      <button 
        class="w-full px-4 py-2 text-left hover:bg-gray-100 font-medium text-red-500"
        @click="logout"
      >
        LOGOUT
      </button>
    </div>
  </div>
  </nav>
</template>
