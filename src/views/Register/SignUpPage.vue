<script setup>
import { onMounted, ref } from "vue";
import { getAllData, addData } from "./../../libs/apiData.js";
const userData = ref([]);
const allowCreate = ref(false);
const errorEmail = ref(false);
const errorEmailText = ref('');
//input value
const name = ref('');
const email = ref('');
const password = ref('');
//push data
const postData = ref('');

onMounted(async () => {
  try {
    userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`);
    console.log(userData.value);
  } catch (error) {
    console.error(error);
  }
});

const checkEmail = () => {
     const user = userData.value.find(user => user.email == email.value);
     console.log(user);
     console.log(email.value);
     if(user) {
          errorEmail.value = true;
          console.log("Email has already")
          errorEmailText.value = "Email has already"
     } 
     else if( !email.value.includes("@")){
          errorEmail.value = true;
          console.log("Email is not valid")
          errorEmailText.value = "Email is not valid"
     }
     else {
          errorEmail.value = false;
          console.log("You pass")
          console.log(name.value)
          console.log(password.value)
     }
};

const createUser = (nameData, emailData, passwordData) => {
  if (nameData !== "" || emailData !== "" || passwordData !== "" || errorEmail.value == false) {
    const user = {
          "email": emailData,
            "name": nameData,
            "password": passwordData,
            "bio": "",
            "role": "student",
            "history": [],
            };
          postData.value = user;
          console.log(postData.value);
          console.log(userData.value);
          console.log("name: ",nameData);
          console.log("email: ",emailData);
          console.log("password: ",passwordData);
          addData(`${import.meta.env.VITE_API_URL}/users`, postData.value);
          console.log("Congreate");
  }
  else {
    console.log("Cant access")
  }
};

</script>

<template>
  sign up page
  <div>
    <input type="text" placeholder="name" v-model="name" />
    <input type="email" placeholder="email" v-model="email" @change="checkEmail"/>
    <input type="password" placeholder="password" v-model="password" />
    <p v-if="errorEmail">{{ errorEmailText }}</p>
    <div>
      <button class="bg-blue-200 hover:bg-blue-300" :disabled="errorEmail" @click="createUser(name,email,password)">sign up</button>
    </div>
  </div>
  <br>
  <hr>
  <p>Santina87@hotmail.com</p>
  <p>{{ "name " + name }}</p>
  <p>{{ "password " + password }}</p>
</template>
