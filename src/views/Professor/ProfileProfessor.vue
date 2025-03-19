<script setup>
import {userLogin} from '@/stores/loginDataUser.js'
import navBar from '@/components/navBar.vue'
import Profile from '@/components/Profile.vue'

const userLoginData = userLogin()
</script>

<template>
<navBar/>
<Profile />

     
</template>