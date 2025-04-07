
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
const examID = ref(route.params.examId || 'undefined');

const fetchData = async () => {
  try {
    const roomData = await getAllData('../../data/room.json');
    usersData.value = roomData.users;
    examData.value = roomData.exams.find(exam => exam.id?.toString() === examID.value);
    if (examData.value) {
      examData.value.papers.forEach(paper => {
        const correctChoices = paper.options.filter(opt => opt.isCorrect);
        // Always initialize as array for consistent checkbox behavior
        userAnswers[paper.id] = [];
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
    
    const existingExamIndex = newHistory.findIndex(entry => entry.exam_id === parseInt(examID.value));

    if (existingExamIndex !== -1) {
      newHistory[existingExamIndex] = {
        exam_id: parseInt(examID.value),
        score: parseInt(totalScore.value),
      };
    } else {
      newHistory.push({
        exam_id: parseInt(examID.value),
        score: parseInt(totalScore.value),
      });
    }

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
    userAnswers[key] = [];
  });
  examResult.value = null;
  totalScore.value = 0;
  correctCount.value = 0;
  showResultPopup.value = false;
};

const isSubmitDisabled = computed(() => {
  return Object.values(userAnswers).every(ans => (Array.isArray(ans) ? ans.length === 0 : ans === ''));
});

// Helper function: For limiting selection in multiple choices
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
  <div class="exam-app bg-gray-100 min-h-screen">
    <navBar />
    <div class="container mx-auto px-4 py-4">
      <div v-if="examData" class="max-w-3xl mx-auto">
        
        <!-- Content area with white background -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <!-- Exam theory/description section -->
          <div class="mb-8 border-l-4 border-blue-400 pl-4">
            <h2 class="text-2xl font-bold uppercase border-b-2 border-black pb-2 mb-4 break-words">{{ examData.name }}</h2>
            <p class="text-gray-700 break-words">{{examData.description}}</p>
            <div class="mt-4">
              <span class="bg-blue-200 text-black px-6 py-2 rounded-full inline-block">{{ examData.category }}</span>
            </div>
          </div>
          
          <!-- Questions section - with fixed height and scrollable area -->
          <div class="max-h-[500px] overflow-y-auto pr-2">
            <div v-for="(paper, index) in examData.papers" :key="paper.id" class="mb-8 border-l-4 border-blue-400 pl-4">
              <div class="mb-4">
                <div class="mb-4 flex justify-between items-center">
                  <h3 class="text-xl font-bold mb-1">QUESTION {{ index + 1 }}</h3>
                  <!-- Display if it's a multiple or single choice question on the right side -->
                  <span class="text-sm text-gray-500">
                    {{ paper.options.filter(option => option.isCorrect).length > 1 ? 'Multiple Choice' : 'Single Choice' }}
                  </span>
                </div>
                <p class="font-semibold uppercase break-words">{{ paper.question || 'WHAT IS CORRECT JILL IN THIS ANSWER EIE!?' }}</p>
                    <!-- Display if it's a multiple or single choice question -->

              </div>
              
              <div class="ml-4">
                <div v-for="option in paper.options" :key="option.choice" class="mb-3">
                  <label class="flex items-start cursor-pointer">
                    <!-- Always use rounded checkbox style -->
                    <div class="mt-1 mr-3">
                      <div class="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        <div v-if="(Array.isArray(userAnswers[paper.id]) && userAnswers[paper.id].includes(option.choice)) || 
                                  (!Array.isArray(userAnswers[paper.id]) && userAnswers[paper.id] === option.choice)" 
                             class="w-4 h-4 rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                    
                    <!-- Hidden actual form elements for functionality -->
                    <input 
                    v-if="paper.options.filter(option => option.isCorrect).length > 1"  
                    type="checkbox"
                    v-model="userAnswers[paper.id]"
                    :value="option.choice"
                    :disabled="isOptionDisabled(paper, option)"
                    class="hidden"
                  />
                  <input 
                    v-else  
                    type="radio"
                    v-model="userAnswers[paper.id]"
                    :value="option.choice"
                    :name="'question_' + paper.id"
                    class="hidden"
                  />
                    <span class="text-lg break-words">{{ option.choice }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Submit button fixed at bottom -->
          <div class="mt-6">
            <button 
              @click="submitExam" 
              :disabled="isSubmitDisabled" 
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mr-4">
              SUBMIT
            </button>
            <button 
            @click="restartExam" 
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mr-4">
            RESTART
          </button>
          <button 
            @click="$router.push('/')" 
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full">
            HOME
          </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Popup Result with improved styling -->
    <div v-if="showResultPopup" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold">ผลลัพธ์</h2>
        </div>
        
        <div class="p-6">
          <div class="bg-blue-50 p-4 rounded-lg mb-6">
            <div class="flex justify-between items-center flex-wrap">
              <p class="text-xl font-semibold">คะแนนรวม: {{ totalScore }} / {{ maxScore }}</p>
              <p class="text-lg">ข้อที่ถูกทั้งหมด: {{ correctCount }}</p>
            </div>
          </div>
          
          <div v-for="(result, index) in examResult" :key="index" class="mb-6 border-l-4 pl-4" :class="result.correct ? 'border-green-500' : 'border-red-500'">
            <p class="font-bold mb-2 break-words">คำถาม: {{ result.question }}</p>
            <p class="mb-2">คะแนน: {{ result.score }}</p>
            <ul class="bg-gray-50 p-3 rounded">
              <li v-for="(choice, i) in result.userChoices" :key="i" class="py-1 flex items-center break-words">
                <span :class="{'font-semibold': choice.selected}">{{ choice.choice }}</span>
                <span v-if="choice.selected" class="ml-2">(เลือก)</span>
                <span v-if="choice.isCorrect" class="ml-2 text-green-600">✓</span>
                <span v-if="choice.selected && !choice.isCorrect" class="ml-2 text-red-600">✗</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button 
            @click="restartExam" 
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
            RESTART
          </button>
          <button 
            @click="$router.push('/')" 
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full">
            HOME
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Additional custom styles */
.break-words {
  word-wrap: break-word;
  word-break: break-word;
}

/* Ensure transitions are smooth */
button {
  transition: all 0.2s ease;
}

/* Style for exam questions display */
.border-l-4 {
  border-left-width: 4px;
}
</style>