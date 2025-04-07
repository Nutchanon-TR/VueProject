<script setup>
import { ref, onMounted } from "vue";
import { userLogin } from '@/stores/loginDataUser.js';
import { getAllData } from "@/libs/apiData";
import LoginPage from "@/views/Register/LoginPage.vue";

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

// คำนวณสถิติสำหรับข้อสอบจากผู้ใช้ทุกคน
const calculateExamStats = (examId) => {
  // รวบรวมคะแนนทั้งหมดสำหรับข้อสอบนี้จากผู้ใช้ทุกคน
  const allScores = [];
  
  // วนลูปผ่านผู้ใช้ทุกคนเพื่อหาคนที่ทำข้อสอบนี้
  users.value.forEach(user => {
    if (user.history && Array.isArray(user.history)) {
      const examHistory = user.history.find(h => h.exam_id == examId);
      if (examHistory) {
        allScores.push(examHistory.score);
      }
    }
  });
  
  // ถ้าไม่พบคะแนน ให้คืนค่าเป็นศูนย์
  if (allScores.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }
  
  // คำนวณ
  const min = Math.min(...allScores);
  const max = Math.max(...allScores);
  const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  
  return { min, max, avg };
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
  console.log(userLoginData.history);
  fetchExamsAndUsers();
});
</script>

<template>
  <div class="w-full h-screen overflow-y-auto bg-gray-100 p-6">
    <div class="flex-1 flex flex-col gap-4">
      <div v-for="(exam, index) in userExams" :key="index" class="rounded-lg overflow-hidden">
        <!-- Card Header -->
        <div class="bg-blue-400 text-white p-4 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">{{ exam.category }}</h2>
            <p class="text-white">{{ exam.name }}</p>
          </div>
          <div class="text-right">
            <p class="text-xl font-bold">{{ userLoginData.history.find(h => h.exam_id == exam.id)?.score }}</p>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="bg-white p-4 flex justify-between items-center">
          <div>
            <p>
              MIN: {{ calculateExamStats(exam.id).min }} 
              MAX: {{ calculateExamStats(exam.id).max }} 
              AVG: {{ calculateExamStats(exam.id).avg.toFixed(2) }}
            </p>
          </div>
          <div>
            <p>{{ exam.owner ? exam.owner.name : 'Unknown' }}</p>
          </div>
        </div>
      </div>
    </div>  
  </div>
</template>
