<script setup>
import { onMounted, ref } from "vue";
import { getAllData, addData } from "./../../libs/apiData.js";
const userData = ref([]);
const errorMsg = ref("");
//input value
const name = ref("");
const email = ref("");
const password = ref("");
//push data
const postData = ref("");

onMounted(async () => {
  try {
    userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`);
    console.log(userData.value);
  } catch (error) {
    console.error(error);
  }
});

const signUpChecking = () => {
  const userExist = userData.value.find((user) => user.email === email.value);
  errorMsg.value = "";
  if (email.value === "") {
    errorMsg.value = "Please fill your email";
    console.log("error: ", errorMsg.value);
  }else if (email.value === "@") {
    errorMsg.value = "กวนตีนอ่อ😡";
    console.log("error: ", errorMsg.value);
  }  
  else if (!email.value.includes("@")) {
    errorMsg.value = "Please fill @ on your email";
    console.log("error: ", errorMsg.value);
  } else if (userExist) {
    errorMsg.value = "User has already exist";
    console.log("error: ", errorMsg.value);
  } else if (password.value === "") {
    errorMsg.value = "Please fill your password";
    console.log("error: ", errorMsg.value);
  } else if (name.value === "") {
    errorMsg.value = "Please fill your name";
    console.log("error: ", errorMsg.value);
  } else {
    console.log("Email is complete");
    createUser(name.value, email.value, password.value);
  }
};

const createUser = (nameData, emailData, passwordData) => {
  if (
    nameData !== "" ||
    emailData !== "" ||
    passwordData !== "" ||
    errorEmail.value == false
  ) {
    const user = {
      email: emailData,
      name: nameData,
      password: passwordData,
      bio: "",
      role: "student",
      history: [],
    };
    postData.value = user;
    console.log(postData.value);
    console.log(userData.value);
    console.log("name: ", nameData);
    console.log("email: ", emailData);
    console.log("password: ", passwordData);
    addData(`${import.meta.env.VITE_API_URL}/users`, postData.value);
    console.log("Congreate");
    goToLoginPage();
  } else {
    console.log("Cant access");
  }
};

const goToLoginPage = () => {
  console.log("Go to login page");
  //route to login page
};
</script>

<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-100">
    
    <!-- Profile Icon -->
    <div class="relative bg-blue-300 w-full h-32 flex justify-center items-center">
      <div class="absolute bottom-[-30px] bg-white p-2 rounded-full shadow-md">
        <div class="w-20 h-20 bg-black rounded-full flex items-center justify-center">
          <div class="w-10 h-10 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
    
    <!-- Back Button -->
    <div class="absolute top-4 left-4 text-black cursor-pointer">
      ← BACK
    </div>
    
    <!-- Sign Up Form -->
    <div class="mt-12 w-full max-w-sm p-6 bg-white shadow-md rounded-md text-center">
      <h2 class="text-lg font-bold">SIGN UP</h2>
      <input
        type="email"
        placeholder="USER_EMAIL"
        v-model="email"
        class="w-full px-4 py-2 mt-4 border rounded-full focus:outline-none"
      />
      <input
        type="text"
        placeholder="USER_NAME"
        v-model="name"
        class="w-full px-4 py-2 mt-4 border rounded-full focus:outline-none"
      />
      <input
        type="password"
        placeholder="PASSWORD"
        v-model="password"
        class="w-full px-4 py-2 mt-4 border rounded-full focus:outline-none"
      />
      <p class="text-red-500 mt-2" v-if="errorMsg">{{ errorMsg }}</p>
      <button
        class="mt-6 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
        @click="signUpChecking"
      >
        CREATE
      </button>
    </div>
  </div>
</template>

<style scoped>
input::placeholder {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
</style>

