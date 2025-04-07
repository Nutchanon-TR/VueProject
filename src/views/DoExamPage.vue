<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import navBar from '@/components/navBar.vue';
import { userLogin } from '@/stores/loginDataUser.js';
import { getAllData, updateSomeData } from "@/libs/apiData.js";

const examData = ref(null);
const usersData = ref([]);
const userAnswers = reactive({});
const examResult = ref(null);
const totalScore = ref(0);
const correctCount = ref(0);
const showResultPopup = ref(false);

const userLoginData = userLogin();
const userID = ref(userLoginData.id);

const route = useRoute();
const examID = ref(route.params.examId || 'undifined');

const fetchData = async () => {
  try {
    const roomData = await getAllData('../../data/room.json');
    usersData.value = roomData.users;
    examData.value = roomData.exams.find(exam => exam.id?.toString() === examID.value);
    if (examData.value) {
      examData.value.papers.forEach(paper => {
        const correctChoices = paper.options.filter(opt => opt.isCorrect);
        userAnswers[paper.id] = correctChoices.length === 1 ? '' : [];
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const maxScore = computed(() => {
  if (!examData.value) return 0;
  return examData.value.papers.reduce((sum, paper) => sum + paper.options.filter(opt => opt.isCorrect).length, 0);
});

const submitExam = async () => {
  if (!examData.value) return;
  let score = 0;
  let correctQuestions = 0;
  const results = examData.value.papers.map(paper => {
    const correctChoices = paper.options.filter(opt => opt.isCorrect).map(opt => opt.choice);
    const isMultiple = correctChoices.length > 1;
    const userChoices = Array.isArray(userAnswers[paper.id]) ? userAnswers[paper.id] : [userAnswers[paper.id]];

    let questionScore = 0;
    let isCorrect = false;

    if (isMultiple) {
      const correctSelected = userChoices.filter(choice => correctChoices.includes(choice)).length;
      const incorrectSelected = userChoices.filter(choice => !correctChoices.includes(choice)).length;

      if (userChoices.length === correctChoices.length && incorrectSelected === 0) {
        questionScore = correctSelected;
        isCorrect = true;
      } else {
        questionScore = correctSelected;
      }
    } else {
      isCorrect = correctChoices[0] === userChoices[0];
      questionScore = isCorrect ? 1 : 0;
    }

    if (isCorrect) correctQuestions++;
    score += questionScore;

    return {
      question: paper.question,
      correct: isCorrect,
      score: `${questionScore}/${correctChoices.length}`,
      userChoices: paper.options.map(opt => ({
        choice: opt.choice,
        selected: userChoices.includes(opt.choice),
        isCorrect: opt.isCorrect
      }))
    };
  });

  totalScore.value = score;
  correctCount.value = correctQuestions;
  examResult.value = results;
  showResultPopup.value = true;

  const user = usersData.value.find(u => u.id === userID.value);
  if (user) {
    const newHistory = user.history ? [...user.history] : [];
    newHistory.push({
      exam_id: parseInt(examID.value),
      score: parseInt(totalScore.value),
    });
    try {
      await updateSomeData(`${import.meta.env.VITE_API_URL}/users`, user.id, { history: newHistory });
      console.log("History updated successfully!");
    } catch (err) {
      console.error("Failed to update history:", err);
    }
  }
};

const restartExam = () => {
  Object.keys(userAnswers).forEach(key => {
    userAnswers[key] = Array.isArray(userAnswers[key]) ? [] : '';
  });
  examResult.value = null;
  totalScore.value = 0;
  correctCount.value = 0;
  showResultPopup.value = false;
};

const isSubmitDisabled = computed(() => {
  return Object.values(userAnswers).every(ans => (Array.isArray(ans) ? ans.length === 0 : ans === ''));
});

// ฟังก์ชันช่วย: สำหรับจำกัดการเลือกใน multiple choices
const isOptionDisabled = (paper, option) => {
  const userChoices = userAnswers[paper.id];
  if (!Array.isArray(userChoices)) return false;
  const correctChoicesCount = paper.options.filter(opt => opt.isCorrect).length;
  return userChoices.length >= correctChoicesCount && !userChoices.includes(option.choice);
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <navBar />
    <div v-if="examData">
      <h1 class="text-2xl font-bold mb-4">{{ examData.name }}</h1>
      <div v-for="paper in examData.papers" :key="paper.id" class="mb-6">
        <p class="font-semibold">{{ paper.question }}</p>
        <div v-for="option in paper.options" :key="option.choice" class="ml-4">
          <label>
            <input
              v-if="Array.isArray(userAnswers[paper.id])"
              type="checkbox"
              v-model="userAnswers[paper.id]"
              :value="option.choice"
              :disabled="isOptionDisabled(paper, option)"
            />
            <input
              v-else
              type="radio"
              v-model="userAnswers[paper.id]"
              :value="option.choice"
            />
            {{ option.choice }}
          </label>
        </div>
      </div>
      <button :disabled="isSubmitDisabled" @click="submitExam">ส่งคำตอบ</button>
      <button @click="restartExam">เริ่มใหม่</button>
      <button @click="$router.push('/')">กลับหน้าหลัก</button>
    </div>

    <!-- Popup Result -->
    <div v-if="showResultPopup" class="overlay" @click="showResultPopup = false">
      <div class="popup" @click.stop>
        <h2 class="text-xl font-bold">ผลลัพธ์</h2>
        <p>คะแนนรวม: {{ totalScore }} / {{ maxScore }}</p>
        <p>ข้อที่ถูกทั้งหมด: {{ correctCount }}</p>
        <div v-for="(result, index) in examResult" :key="index" class="my-4">
          <p><strong>คำถาม:</strong> {{ result.question }}</p>
          <p><strong>คะแนน:</strong> {{ result.score }}</p>
          <ul>
            <li v-for="(choice, i) in result.userChoices" :key="i">
              {{ choice.choice }}
              <span v-if="choice.selected">(เลือก)</span>
              <span v-if="choice.isCorrect">✅</span>
            </li>
          </ul>
        </div>
        <button @click="restartExam">เริ่มใหม่</button>
        <button @click="$router.push('/')">กลับหน้าหลัก</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 4px;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Popup Styles */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.popup button {
  background-color: #f44336;
  color: white;
}

.popup button:hover {
  background-color: #d32f2f;
}
</style>
