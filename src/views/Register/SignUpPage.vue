<script setup>
import { onMounted, ref } from "vue";
import { getAllData, addData } from "./../../libs/apiData.js";
import { RouterLink, useRouter } from "vue-router";
const router = useRouter();
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
  } else if (email.value === "@") {
    errorMsg.value = "กวนตีนอ่อ😡";
    console.log("error: ", errorMsg.value);
  } else if (!email.value.includes("@")) {
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
    //delete
  ) {
    const user = {
      email: emailData,
      name: nameData,
      password: passwordData,
      bio: "",
      role: "student",
      imageURL: "",
      history: [],
      likeExam_Id: [],
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
  router.push({ name: "LoginPage" });
};
</script>

<template>
  <div class="flex flex-col items-center min-h-screen bg-white">
    <!-- Header with Back Button -->
    <div class="relative bg-blue-300 w-full h-[150px] flex items-center">
      <div
        class="absolute mt-[25px] ml-[25px] top-6 left-4 text-black font-bold text-3xl cursor-pointer"
        @click="goToLoginPage"
      >
        ← BACK
      </div>
    </div>

    <!-- Profile Icon -->
    <div class="relative w-full flex justify-center">
      <div
        class="absolute top-[-100px] bg-white rounded-full border-2 border-white p-[60px]"
      >
        <div class="w-20 h-20 flex items-center justify-center">
          <!-- <img src="/assets/profile.png" alt="profile" /> -->
           <h1 class="text-9xl mt-[-25px]">👴🏿</h1>
        </div>
      </div>
    </div>

    <!-- Sign Up Form -->
    <div class="mt-[120px] w-full max-w-md px-4 text-center">
      <h2 class="text-5xl font-bold mb-8">SIGN UP</h2>

      <input
        type="email"
        placeholder="USER_EMAIL"
        v-model="email"
        class="w-full px-4 py-3 mb-4 border border-black rounded-full focus:outline-none"
      />
      <input
        type="text"
        placeholder="USER_NAME"
        v-model="name"
        class="w-full px-4 py-3 mb-4 border border-black rounded-full focus:outline-none"
      />


      <input
        type="password"
        placeholder="PASSWORD"
        v-model="password"
        class="w-full px-4 py-3 mb-4 border border-black rounded-full focus:outline-none"
      />



      <p class="text-red-500 mt-2" v-if="errorMsg">{{ errorMsg }}</p>

      <button
        class="mt-4 px-6 py-2 w-32 text-2xl bg-white text-black font-bold rounded-none hover:cursor-pointer"
        @click="signUpChecking"
      >
        CREATE
      </button>
    </div>
  </div>
</template>
