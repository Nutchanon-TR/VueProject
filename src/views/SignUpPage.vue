<script setup>
import { onMounted, ref } from "vue";
import { getAllData } from "../libs/apiData.js";
const userData = ref([]);
const allowCreate = ref(false);
const emailSending = ref('');
const erroeEmailText = "Your email is already in use";


onMounted(async () => {
  try {
    userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`);
    console.log(userData.value);
  } catch (error) {
    console.error(error);
  }
});

const checkEmail = () => {
     const user = userData.value.find(user => user.email == emailSending.value);
     console.log(user);
     console.log(userData.value[1].email);
     console.log(emailSending.value);
     return user ? console.log(erroeEmailText) : createUser()
};

const createUser = (name, email, password) => {
     //   const user = {
          // //     name: name,
          // //     email: email,
          // //     password: password
          //   };
          //   userData.value.push(user);
          //   console.log(userData.value);
          console.log("Congreate");
};
</script>

<template>
  sign up page
  <div>
    <input type="text" placeholder="name" />
    <input type="email" placeholder="email" v-model="emailSending" @change="checkEmail"/>
    <input type="password" placeholder="password" />
    <button class="bg-blue-200 hover:bg-blue-300">sign up</button>
  </div>
</template>
