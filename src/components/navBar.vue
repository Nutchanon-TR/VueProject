<script setup>
import { onMounted, reactive, ref, computed, defineProps } from "vue";
import { userLogin } from "@/stores/loginDataUser.js";
import { useRouter } from "vue-router";

const props = defineProps({
  updateImage: {
    type: String,
  },
});

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

const logout = () => {
  document.cookie = "-1; path=/; max-age=0; secure"; // clear cookie
  userLoginData.keepDataFromLogin(idUserData);
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

const useImage = computed(() => {
  return (
    props.updateImage ||
    userLoginData.imageURL ||
    "https://www.tech101.in/wp-content/uploads/2018/07/blank-profile-picture.png"
  );
});
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

    <!-- image profile -->

    <div class="relative flex items-center space-x-4">
      <img
        :src="useImage"
        alt="Profile"
        class="w-16 h-16 rounded-full border-2 border-white shadow-lg"
      />
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
        class="absolute right-0 mt-[130px] w-40 bg-white shadow-lg rounded-md overflow-hidden z-10"
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
