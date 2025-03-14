<script setup>
import { ref, onMounted } from "vue";
import navBar from '@/components/navBar.vue';
import { userLogin } from '@/stores/loginDataUser.js';
import { updateData } from '@/libs/apiData.js';  // นำเข้า API updateData
const exams = ref([]);
const selectedAnswers = ref({}); // เก็บคำตอบที่ผู้ใช้เลือก
const score = ref(0); // เก็บคะแนน

// โหลด JSON (สมมติว่าดึงจากไฟล์ room.json)
onMounted(async () => {
  const response = await fetch("/../../../data/room.json");
  exams.value = await response.json();
});

// ฟังก์ชันตรวจสอบคำตอบและคำนวณคะแนน
const checkAnswers = () => {
  score.value = 0;

  exams.value.exams.forEach((exam) => {
    exam.papers.forEach((question) => {
      const userAnswer = selectedAnswers.value[question.id] || [];
      const correctAnswer = question.answer;

      // ตรวจสอบว่าผู้ใช้ตอบถูกต้องหรือไม่ (ไม่สนลำดับ)
      if (JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort())) {
        score.value += 1; // เพิ่มคะแนนเมื่อคำตอบถูก
      }
    });
  });
};
</script>

<template>
  <div class="container">
    <h1>ข้อสอบ</h1>

    <div v-for="exam in exams.exams" :key="exam.id">
      <h2>ข้อสอบ {{ exam.id }}</h2>
      
      <div v-for="question in exam.papers" :key="question.id" class="question-box">
        <p>{{ question.question }}</p>
        
        <div v-for="choice in question.choices" :key="choice">
          <label>
            <input
              type="checkbox"
              :value="choice"
              v-model="selectedAnswers[question.id]"
            />
            {{ choice }}
          </label>
        </div>
      </div>
    </div>

    <button @click="checkAnswers">ตรวจคำตอบ</button>
    <h3>คะแนนที่ได้: {{ score }} / {{ exams.exams.reduce((acc, exam) => acc + exam.papers.length, 0) }}</h3>
  </div>
</template>
