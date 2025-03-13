<script setup>
import { ref,onMounted,defineProps } from "vue";
import navBar from '@/components/navBar.vue'
import {userLogin} from '@/stores/loginDataUser.js'
const userLoginData = userLogin()
</script>

<template>
     <navBar/>
This is the Profile Student page
     
</template>