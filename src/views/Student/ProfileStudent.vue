<script setup>
import { ref, onMounted } from "vue";
import navBar from '@/components/navBar.vue';
import { userLogin } from '@/stores/loginDataUser.js';
import { getAllData } from "@/libs/apiData";
import Profile from "@/components/Profile.vue";

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
  <navBar />
  <div class="flex flex-col md:flex-row justify-between items-start gap-6 p-6">
    <Profile />

    <!-- ขวา -->
    <div v-if="userExams.length" class="w-full md:w-4/5">
      <h2 class="text-lg font-semibold mb-2">Your Exam History</h2>
      <ul class="space-y-2">
        <li v-for="(exam, index) in userExams" :key="index">
          <button @click="console.log(exam)"
            class="p-4 bg-white rounded-lg shadow-md border border-gray-200 w-full text-left hover:bg-gray-100 transition">
            <h3 class="text-gray-700 font-medium">{{ exam.name }}</h3>
            <p class="text-gray-600">{{ exam.description }}</p>
            <p class="text-gray-600">Category: {{ exam.category }}</p>
            <p class="text-gray-600">
              Score:
              <span
                :class="userLoginData.history.find(h => h.exam_id == exam.id)?.score >= 5 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                {{userLoginData.history.find(h => h.exam_id == exam.id)?.score}}
              </span>
            </p>
            <p class="text-gray-500 text-sm">
              Created by: {{ exam.owner ? exam.owner.name : 'Unknown' }}
            </p>
          </button>
        </li>
      </ul>
    </div>
    
  </div>
</template>
