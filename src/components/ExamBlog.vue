<script setup>
import { onMounted, ref } from "vue";
import {getAllData} from "../libs/apiData.js";

const examData = ref([])
const userData = ref([])

onMounted (async () => {
   try {
      examData.value = await getAllData(`${import.meta.env.VITE_API_URL}/exams`)
      userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`)
      console.log(examData.value)
      console.log(userData.value)
   } catch (error) {
      console.error(error);
   }
})

const byProfessor = (ownerId) => {
   const user = userData.value.find(user => user.id == ownerId);
   return user ? user.name : "Unknown";
};
</script>

<template>
  <div>
    <h2>Component ExamManager</h2>
    <div v-for="(exam, index) in examData" :key="index">
      <hr>
      <p>category: {{ exam.category }}</p>
      <p>name: {{ exam.name }}</p>
      <p>like: {{ exam.likes }}</p>
      <p v-if="exam.papers.length > 1">question: {{ exam.papers[1].question }}</p>
      <p>by professor: {{ byProfessor(exam.ownerExam_id) }}</p>
      <hr>
    </div>
  </div>
</template>