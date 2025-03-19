<script setup>
import { ref, onMounted } from "vue";
import navBar from '@/components/navBar.vue';
import { userLogin } from '@/stores/loginDataUser.js';
import { getAllData } from "@/libs/apiData";
import { updateSomeData } from "@/libs/apiData";
import Profile from "@/components/Profile.vue";

const exams = ref([]); // เก็บข้อมูล exams
const userExams = ref([]); // เก็บข้อสอบที่ตรงกับ history.exam_id

// ฟังก์ชันดึงข้อมูล exams
const fetchExams = async () => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_URL}/exams`;
    // ใช้ฟังก์ชัน getAllData แทน fetch
    exams.value = await getAllData(apiUrl);
    // กรองเฉพาะข้อสอบที่ผู้ใช้เคยทำ
    userExams.value = exams.value.filter(exam =>
      userLoginData.history.some(historyItem => historyItem.exam_id == exam.id)
    );
  } catch (error) {
    console.error(error.message);
  }
};

const userLoginData = userLogin();

// สร้างตัวแปรสำหรับข้อมูลที่จะอัปเดต
const updatedUser = ref({
  name: userLoginData.name,
  email: userLoginData.email,
  bio: userLoginData.bio,
});

const errorMsg = ref('');
const successMsg = ref('');
const showUpdateForm = ref(false);

// ฟังก์ชันที่ใช้ในการอัปเดตข้อมูลผู้ใช้
const updateUserProfile = async () => {
  try {
    const userId = userLoginData.id;
    const apiUrl = `${import.meta.env.VITE_API_URL}/users`;

    // ใช้ updateSomeData แทน updateData
    const updatedData = await updateSomeData(apiUrl, userId, updatedUser.value);

    // อัปเดตข้อมูลใน store
    userLoginData.keepDataFromLogin(updatedData);

    successMsg.value = 'Profile updated successfully!';
    showUpdateForm.value = false;
  } catch (error) {
    errorMsg.value = error.message;
  }
};

onMounted(() => {
  console.log(userLoginData.name);
  fetchExams();
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
          <div class="p-4 bg-white rounded-lg shadow-md border border-gray-200">
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
          </div>
        </li>
      </ul>
    </div>


  </div>


</template>
