
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
    // Define the URLs to fetch exam and user data
    const examsUrl = `${import.meta.env.VITE_API_URL}/exams`;
    const usersUrl = `${import.meta.env.VITE_API_URL}/users`;

    // Fetch the data from both the exam and users API
    const [examDataResponse, usersDataResponse] = await Promise.all([
      getAllData(examsUrl),  // Assuming you have an API for exams
      getAllData(usersUrl),  // Assuming you have an API for users
    ]);

    // Assuming roomData contains both users and exams
    const roomData = { exams: examDataResponse, users: usersDataResponse };

    // Store the roomData into local reactive references
    examData.value = roomData.exams.find(exam => exam.id?.toString() === examID.value);
    usersData.value = roomData.users;  // Set the users data for further use

    // Initialize userAnswers for all papers
    if (examData.value) {
      examData.value.papers.forEach(paper => {
        const correctChoices = paper.options.filter(opt => opt.isCorrect);
        // Initialize answers array for each paper
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
  const confirmed = window.confirm("Are you sure you want to submit?");
  if (!confirmed) return;
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
  const confirmed = window.confirm("Are you sure you want to restart?");
  if (!confirmed) return;
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

          <!-- Questions section - Remove scroll, let it overflow with page -->
          <div class="pr-2">
            <div v-for="(paper, index) in examData.papers" :key="paper.id" class="mb-8 border-l-4 border-blue-400 pl-4">
              <div class="mb-4">
                <div class="mb-4">
                  <div class="flex flex-wrap items-baseline">
                    <h3 class="text-xl font-bold mb-1 mr-2">QUESTION {{ index + 1 }} :</h3>
                    <p class="font-semibold break-words text-blue-700 text-xl font-bold">
                      {{ paper.question || 'No question' }}
                    </p>
                  </div>
                  <span class="text-sm text-gray-500 block mt-1">
                    {{ paper.options.filter(option => option.isCorrect).length > 1 ? 'Multiple Choice' : 'Single Choice' }}
                  </span>
                </div>
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
          <div class="mt-6 flex justify-center space-x-4">
            <button 
              @click="submitExam" 
              :disabled="isSubmitDisabled" 
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
              SUBMIT
            </button>
            <button 
              @click="restartExam" 
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full">
              RESTART
            </button>
          </div>


        </div>
      </div>
    </div>



    <!-- Popup Result with enhanced styling -->
    <div v-if="showResultPopup" class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col" @click.stop>
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div class="flex justify-center items-center">
            <h2 class="text-2xl font-bold">EXAM RESULTS</h2>
          </div>
        </div>
        
        <!-- Body with scrollable content -->
        <div class="flex-1 overflow-auto p-6">
          <!-- Score summary card -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 shadow-sm border border-blue-100">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
              <div class="flex items-center">
                <div class="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4">
                  <span class="text-2xl font-bold">{{ totalScore }}</span>
                </div>
                <div>
                  <p class="text-sm text-blue-700 uppercase font-semibold">TOTAL SCORE</p>
                  <p class="text-xl font-bold">{{ totalScore }} / {{ maxScore }} POINTS</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4">
                  <span class="text-2xl font-bold">{{ correctCount }}</span>
                </div>
                <div>
                  <p class="text-sm text-green-700 uppercase font-semibold">CORRECT</p>
                  <p class="text-xl font-bold">{{ correctCount }} / {{ examResult?.length || 0 }} QUESTIONS</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Questions results -->
          <div v-for="(result, index) in examResult" :key="index" 
              class="mb-6 rounded-xl overflow-hidden border shadow-sm"
              :class="result.correct ? 'border-green-300' : 'border-red-300'">
            <!-- Question header -->
            <div class="p-4" :class="result.correct ? 'bg-green-50' : 'bg-red-50'">
              <div class="flex items-center">
                <div class="rounded-full w-8 h-8 flex items-center justify-center mr-3"
                    :class="result.correct ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
                  <span>{{ index + 1 }}</span>
                </div>
                <p class="font-bold break-words flex-1">{{ result.question }}</p>
              </div>
              <div class="mt-2 flex justify-between items-center">
                <p class="text-sm font-medium">SCORE: {{ result.score }}</p>
                <span class="px-3 py-1 rounded-full text-sm font-medium"
                      :class="result.correct ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'">
                  {{ result.correct ? 'CORRECT' : 'INCORRECT' }}
                </span>
              </div>
            </div>
            
            <!-- Answer options -->
            <ul class="bg-white p-4 divide-y divide-gray-100">
              <li v-for="(choice, i) in result.userChoices" :key="i" 
                  class="py-3 flex items-center justify-between break-words"
                  :class="{
                    'bg-green-50': choice.isCorrect,
                    'bg-red-50': choice.selected && !choice.isCorrect
                  }">
                <div class="flex items-center">
                  <div class="w-6 h-6 rounded-full border flex items-center justify-center mr-3"
                      :class="{
                        'border-green-500 bg-green-100': choice.isCorrect,
                        'border-red-500 bg-red-100': choice.selected && !choice.isCorrect,
                        'border-gray-300': !choice.selected && !choice.isCorrect
                      }">
                    <span v-if="choice.selected" class="w-3 h-3 rounded-full"
                          :class="{
                            'bg-green-500': choice.isCorrect,
                            'bg-red-500': !choice.isCorrect
                          }"></span>
                  </div>
                  <span :class="{
                    'font-semibold': choice.selected || choice.isCorrect,
                    'text-green-700': choice.isCorrect,
                    'text-red-700': choice.selected && !choice.isCorrect
                  }">{{ choice.choice }}</span>
                </div>
                <div class="flex items-center">
                  <span v-if="choice.selected" class="text-sm italic mr-2 text-gray-500">(SELECTED)</span>
                  <span v-if="choice.isCorrect" class="text-green-600 font-bold">✓</span>
                  <span v-if="choice.selected && !choice.isCorrect" class="text-red-600 font-bold">✗</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Footer with action buttons -->
        <div class="bg-gray-50 p-6 border-t border-gray-200">
          <div class="flex justify-center gap-4">
            <button 
              @click="restartExam" 
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              RESTART
            </button>
            <button 
              @click="$router.push('/')" 
              class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
              </svg>
              HOME
            </button>
          </div>
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

