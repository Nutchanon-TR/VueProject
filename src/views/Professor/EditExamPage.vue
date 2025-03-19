<script setup>
import {userLogin} from '@/stores/loginDataUser.js'
import navBar from '@/components/navBar.vue'
const userLoginData = userLogin()
</script>

<template>
<navBar/>
This is the EditExamPage page
     
</template>