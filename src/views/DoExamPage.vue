<script setup>
import { ref, computed, reactive } from 'vue';
import navBar from '@/components/navBar.vue';

const examData = ref({
  id: "1",
  ownerExam_id: 1,
  name: "Math Quiz",
  description: "Test your mathematical skills.",
  category: "Math",
  likes: 0,
  papers: [
    {
      id: 1,
      question: "What is 2 + 2?",
      options: [
        { choice: "3", answer: false },
        { choice: "4", answer: true },
        { choice: "5", answer: false },
        { choice: "6", answer: false }
      ]
    },
    {
      id: 2,
      question: "Which numbers are prime?",
      options: [
        { choice: "2", answer: true },
        { choice: "4", answer: false },
        { choice: "5", answer: true },
        { choice: "9", answer: false }
      ]
    },
    {
      id: 3,
      question: "What is the square root of 16?",
      options: [
        { choice: "2", answer: false },
        { choice: "3", answer: false },
        { choice: "4", answer: true },
        { choice: "5", answer: false }
      ]
    }
  ]
});

// สร้าง userAnswers ให้เก็บตัวเลือกของผู้ใช้
const userAnswers = reactive({});
examData.value.papers.forEach(paper => {
  userAnswers[paper.id] = [];
});

const examResult = ref(null); // เก็บผลลัพธ์ของข้อสอบ
const score = ref(0); // เก็บคะแนน

const submitExam = () => {
  let correctCount = 0;

  const results = examData.value.papers.map(paper => {
    // ดึงคำตอบที่ถูกต้อง
    const correctAnswers = paper.options
      .filter(option => option.answer)
      .map(option => option.choice)
      .sort()
      .join(",");

    // คำตอบของผู้ใช้
    const userResponse = (userAnswers[paper.id] || [])
      .sort()
      .join(",");

    const isCorrect = correctAnswers === userResponse;
    if (isCorrect) correctCount++;

    return {
      question: paper.question,
      correct: isCorrect
    };
  });

  score.value = correctCount; // อัปเดตคะแนน
  examResult.value = results;
};

const isSubmitDisabled = computed(() => {
  return Object.values(userAnswers).every(ans => ans.length === 0);
});
</script>

<template>
  <navBar />
  <div>
    <h1>{{ examData.name }}</h1>
    <p>{{ examData.description }}</p>
    
    <div v-for="paper in examData.papers" :key="paper.id">
      <h3>{{ paper.question }}</h3>
      <div v-for="option in paper.options" :key="option.choice">
        <label>
          <input
            type="checkbox"
            :value="option.choice"
            v-model="userAnswers[paper.id]"
          />
          {{ option.choice }}
        </label>
      </div>
    </div>

    <button @click="submitExam" :disabled="isSubmitDisabled">Submit</button>

    <div v-if="examResult">
      <h2>Results</h2>
      <p><strong>Score: {{ score }} / {{ examData.papers.length }}</strong></p>
      <ul>
        <li v-for="(result, index) in examResult" :key="index">
          {{ result.question }} - 
          <span :style="{ color: result.correct ? 'green' : 'red' }">
            {{ result.correct ? 'True' : 'False' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
