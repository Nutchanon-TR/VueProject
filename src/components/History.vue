<script setup>
import { ref, onMounted } from "vue";
import { userLogin } from '@/stores/loginDataUser.js';
import { getAllData,getDataById } from "@/libs/apiData";

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
  const allScores = [];

  users.value.forEach(user => {
    if (user.history && Array.isArray(user.history)) {
      const examHistories = user.history.filter(h => h.exam_id == examId);
      examHistories.forEach(history => {
        allScores.push(history.score);
      });
    }
  });

  if (allScores.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }

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
    const userDataGetAll = await getDataById(`${import.meta.env.VITE_API_URL}/users`, userLoginData.id);
    const userHistory = userDataGetAll.history || [];
    // กรองเฉพาะข้อสอบที่ผู้ใช้เคยทำ
    userExams.value = userHistory.map(historyItem => {
      const exam = exams.value.find(e => e.id == historyItem.exam_id);
      return {
        ...exam,
        score: historyItem.score // เพิ่มคะแนนของรอบนั้น
      };
    }).reverse();

  } catch (error) {
    console.error(error.message);
  }
};

const userLoginData = userLogin();

onMounted(() => {
  fetchExamsAndUsers();
});
</script>

<template>
  <div class="w-full h-screen overflow-y-auto bg-gray-100 p-6">
    <div class="flex-1 flex flex-col gap-6">
      <div v-for="(exam, index) in userExams" :key="index" class="rounded-lg overflow-hidden">
        <!-- Card Header -->
        <div class="bg-blue-400 text-white p-5 flex justify-between items-center">
          <div>
            <h2 class="text-3xl font-bold">{{ exam.category }}</h2>
            <p class="text-xl">{{ exam.name }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl mr-[15px] font-bold">SCORES :  {{ exam.score }}</p>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="bg-white p-5 flex justify-between items-center text-lg text-gray-800">
          <div>
            <p>
              <span class="font-medium">MIN:</span> {{ calculateExamStats(exam.id).min }} &nbsp;
              <span class="font-medium">MAX:</span> {{ calculateExamStats(exam.id).max }} &nbsp;
              <span class="font-medium">AVG:</span> {{ calculateExamStats(exam.id).avg.toFixed(2) }}
            </p>
          </div>
          <div>
            <p class="italic">BY: <span class="font-semibold">{{ exam.owner ? exam.owner.name : 'Unknown' }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
