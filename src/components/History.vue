<script setup>
import { ref, onMounted } from "vue";
import { userLogin } from '@/stores/loginDataUser.js';
import { getAllData } from "@/libs/apiData";

const exams = ref([]); // เก็บข้อมูล exams
const userExams = ref([]); // เก็บข้อสอบที่ตรงกับ history.exam_id
const users = ref([]); // เก็บข้อมูล users

// ฟังก์ชันเชื่อมโยง ownerExam_id กับ users
const getExamWithOwner = (exams, users) => {
  return exams.map(exam => {
    const owner = users.find(user => user.id == exam.ownerExam_id);
    return {
      ...exam,
      owner: owner ? { id: owner.id, name: owner.name, email: owner.email } : null
    };
  });
};

// ฟังก์ชันดึงข้อมูล exams และ users
const fetchExamsAndUsers = async () => {
  try {
    const examsUrl = `${import.meta.env.VITE_API_URL}/exams`;
    const usersUrl = `${import.meta.env.VITE_API_URL}/users`;

    // ดึงข้อมูล exams และ users
    const [examsData, usersData] = await Promise.all([
      getAllData(examsUrl),
      getAllData(usersUrl)
    ]);

    // อัปเดตข้อมูล users
    users.value = usersData;

    // รวมข้อมูล owner เข้าไปใน exams
    exams.value = getExamWithOwner(examsData, users.value);

    // กรองเฉพาะข้อสอบที่ผู้ใช้เคยทำ
    userExams.value = exams.value.filter(exam =>
      userLoginData.history.some(historyItem => historyItem.exam_id == exam.id)
    );

  } catch (error) {
    console.error(error.message);
  }
};

const userLoginData = userLogin();

onMounted(() => {
  console.log(userLoginData.name);
  fetchExamsAndUsers();
});
</script>



<template>
  <div class="w-full h-screen overflow-y-auto bg-gray-100 p-6">
    <div v-if="userExams.length">
      <h2 class="text-2xl font-bold mb-4">Your Exam History</h2>

      <ul class="space-y-4">
        <li v-for="(exam, index) in userExams" :key="index">
          <button @click="console.log(exam)"
            class="p-4 bg-white rounded-lg shadow-md border border-gray-300 w-full text-left hover:bg-gray-200 transition">
            <h3 class="text-lg font-semibold text-gray-800">{{ exam.name }}</h3>
            <p class="text-gray-600">{{ exam.description }}</p>
            <p class="text-gray-600">Category: {{ exam.category }}</p>
            <p class="text-gray-700">
              Score:
              <span
                :class="userLoginData.history.find(h => h.exam_id == exam.id)?.score >= 5 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                {{ userLoginData.history.find(h => h.exam_id == exam.id)?.score }}
              </span>
            </p>
            <p class="text-sm text-gray-500">
              Created by: {{ exam.owner ? exam.owner.name : 'Unknown' }}
            </p>
          </button>
        </li>
      </ul>
    </div>

    <p v-else class="text-center text-gray-500 text-xl font-semibold mt-10">❌ History is empty</p>
  </div>
</template>

  

