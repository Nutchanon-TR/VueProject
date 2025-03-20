<script setup>
import { ref, computed, reactive } from 'vue';
import navBar from '@/components/navBar.vue';

// ข้อมูลข้อสอบ
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

// เก็บคำตอบของผู้ใช้
const userAnswers = reactive({});
examData.value.papers.forEach(paper => {
  userAnswers[paper.id] = paper.options.filter(opt => opt.answer).length === 1 ? '' : [];
});

// คำนวณคะแนนเต็ม
const maxScore = computed(() => {
  return examData.value.papers.reduce((sum, paper) => sum + paper.options.filter(opt => opt.answer).length, 0);
});

// เก็บผลลัพธ์
const examResult = ref(null);
const totalScore = ref(0);
const correctCount = ref(0);
const showResultPopup = ref(false);

// ฟังก์ชันส่งคำตอบ
const submitExam = () => {
  let score = 0;
  let correctQuestions = 0;

  const results = examData.value.papers.map(paper => {
    const correctChoices = paper.options.filter(opt => opt.answer).map(opt => opt.choice);
    const userChoices = Array.isArray(userAnswers[paper.id]) ? userAnswers[paper.id] : [userAnswers[paper.id]];

    let correctAnswerCount = userChoices.filter(choice => correctChoices.includes(choice)).length;
    let incorrectAnswerCount = userChoices.filter(choice => !correctChoices.includes(choice)).length;

    let questionScore = correctAnswerCount;
    let isCorrect = incorrectAnswerCount === 0 && correctAnswerCount === correctChoices.length;

    if (isCorrect) correctQuestions++;

    score += questionScore;

    return {
      question: paper.question,
      correct: isCorrect,
      score: `${questionScore}/${correctChoices.length}`,
      userChoices: paper.options.map(opt => ({
        choice: opt.choice,
        selected: userChoices.includes(opt.choice),
        isCorrect: opt.answer
      }))
    };
  });

  totalScore.value = score;
  correctCount.value = correctQuestions;
  examResult.value = results;
  showResultPopup.value = true;
};

// รีเซ็ตข้อสอบ
const restartExam = () => {
  Object.keys(userAnswers).forEach(key => {
    userAnswers[key] = Array.isArray(userAnswers[key]) ? [] : '';
  });
  examResult.value = null;
  totalScore.value = 0;
  correctCount.value = 0;
  showResultPopup.value = false;
};

// ตรวจสอบว่า Submit ปิดใช้งานหรือไม่
const isSubmitDisabled = computed(() => {
  return Object.values(userAnswers).every(ans => (Array.isArray(ans) ? ans.length === 0 : ans === ''));
});
</script>

<template>
  <navBar />
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-bold">{{ examData.name }}</h1>
    <p class="mb-4">{{ examData.description }}</p>

    <div v-for="paper in examData.papers" :key="paper.id" class="bg-white p-4 rounded-lg shadow-md w-80 mb-4">
      <h3 class="font-semibold">{{ paper.question }}</h3>
      <div v-for="option in paper.options" :key="option.choice">
        <label class="flex items-center space-x-2">
          <input
            v-if="paper.options.filter(opt => opt.answer).length > 1"
            type="checkbox"
            :value="option.choice"
            v-model="userAnswers[paper.id]"
            class="w-4 h-4"
          />
          <input
            v-else
            type="radio"
            :value="option.choice"
            v-model="userAnswers[paper.id]"
            class="w-4 h-4"
          />
          <span>{{ option.choice }}</span>
        </label>
      </div>
    </div>

    <button @click="submitExam" :disabled="isSubmitDisabled" 
      class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 disabled:bg-gray-400">
      Submit
    </button>

    <!-- Popup Modal -->
    <div v-if="showResultPopup" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
        <h2 class="text-xl font-bold mb-2">Results</h2>
        <p class="text-lg"><strong>Score: {{ totalScore }} / {{ maxScore }}</strong></p>
        <p class="text-lg"><strong>Correct Answers: {{ correctCount }} / {{ examData.papers.length }}</strong></p>

        <div class="overflow-y-auto max-h-60 mt-4">
          <ul>
            <li v-for="(result, index) in examResult" :key="index" class="border-b py-2">
              <p>
                {{ result.question }} - 
                <span :class="result.correct ? 'text-green-500' : 'text-red-500'">
                  {{ result.correct ? '✅ Correct' : '❌ Incorrect' }}
                </span>
              </p>
              <ul>
                <li v-for="answer in result.userChoices" :key="answer.choice" class="flex items-center space-x-2">
                  <span :class="answer.selected ? 'text-blue-500' : 'text-gray-500'">
                    {{ answer.choice }}
                  </span>
                  <span :class="answer.isCorrect ? 'text-green-500' : 'text-red-500'">
                    {{ answer.isCorrect ? '✔' : '❌' }}
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div class="flex justify-between mt-4">
          <button @click="restartExam" class="bg-yellow-500 text-white px-4 py-2 rounded-lg">Restart</button>
          <button @click="showResultPopup = false" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Home</button>
          <button @click="showResultPopup = false" class="bg-green-500 text-white px-4 py-2 rounded-lg">Profile</button>
        </div>
      </div>
    </div>
  </div>
</template>
