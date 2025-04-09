<script setup>
import { onMounted, ref } from "vue";
import { getAllData } from "@/libs/apiData";
import { RouterLink } from "vue-router";
import Liked from "./Liked.vue";

const examData = ref([]);
const userData = ref([]);
const selectedExam = ref(null); // ตัวแปรเก็บข้อสอบที่ถูกเลือก

onMounted(async () => {
  try {
    examData.value = await getAllData(`${import.meta.env.VITE_API_URL}/exams`);
    userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`);
  } catch (error) {
    console.error(error);
  }
});

const byProfessor = (ownerId) => {
  const user = userData.value.find((user) => user.id == ownerId);
  return user ? user.name : "Unknown";
};

const openExamModal = (exam) => {
  selectedExam.value = exam; // ตั้งค่าข้อสอบที่เลือก
};

const closeModal = () => {
  selectedExam.value = null;
};

// const handleVisitProfile = (()=>{

// })
</script>

<template>
  <div class="bg-black-100 min-h-screen">
    <div class="p-6 mx-4 md:mx-[170px] py-10">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12"
      >
        <button
          v-for="(exam, index) in examData"
          :key="index"
          class="bg-blue-400 text-white rounded-3xl shadow-md overflow-hidden w-full text-left flex flex-col justify-between h-full hover:cursor-pointer"
        >
        <div @click="openExamModal(exam)">

          <!-- Upper Section -->
          <div class="px-6 py-5">
            <h2 class="text-2xl md:text-4xl font-bold text-black">
              {{ exam.category }}
            </h2>
            <p class="font-semibold pb-16 text-xl md:text-2xl pt-2">
              {{ exam.name }}
            </p>
          </div>
        </div>
          
          <!-- Bottom Section (White Box) - อยู่ล่างสุด -->
          <div
            class="flex justify-between items-center bg-white p-2 text-black border-t w-full"
          >
            <div class="flex items-center py-2">
              <Liked :examId="exam.id" :likes="exam.likes" />
              <!-- <span class="ml-1 text-lg md:text-2xl font-semibold">{{
                exam.likes
              }}</span> -->
            </div>
            <p class="text-gray-600 text-sm md:text-xl pr-6">
              BY {{ byProfessor(exam.ownerExam_id) }}
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>

  <!-- Pop-up Modal -->
  <div
    v-if="selectedExam"
    class="fixed inset-0 flex items-center justify-center bg-black/50 px-4"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h2 class="text-2xl font-bold">{{ selectedExam.name }}</h2>
      <p class="text-gray-700">{{ selectedExam.description }}</p>
      <p class="mt-2 text-sm text-gray-500">
        Category: {{ selectedExam.category }}
      </p>
      <p class="mt-2 text-sm text-gray-500">Likes: {{ selectedExam.likes }}</p>

      <div class="mt-4 flex flex-col md:flex-row justify-end">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition mb-2 md:mb-0"
        >
          Close
        </button>
        <RouterLink
          :to="{ name: 'DoExamPage', params: { examId: selectedExam.id } }"
          class="md:ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition text-center"
        >
          Start to Exam
        </RouterLink>
      </div>
    </div>
  </div>
</template>
