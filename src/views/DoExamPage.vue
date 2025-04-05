  <script setup>
import { ref, computed, reactive,defineProps,onMounted } from 'vue';
import navBar from '@/components/navBar.vue';
import { getAllData } from "@/libs/apiData.js"; // นำเข้าฟังก์ชันในการดึงข้อมูลจาก room.json
import { userLogin } from "@/stores/loginDataUser.js";
const userLoginData = userLogin();
const props = defineProps({
  examId:{
      type:[String, Number],
      required: true
    }
})

// ข้อมูลข้อสอบและข้อมูลผู้ใช้
const examData = ref(null);
const usersData = ref([]);
const userAnswers = reactive({});
const usersID = ref('');
const examID = ref('');

// เก็บผลลัพธ์
const examResult = ref(null);
const totalScore = ref(0);
const correctCount = ref(0);
const showResultPopup = ref(false);

onMounted(() => {
  console.log("userLoginData: ", userLoginData.id);
  console.log("idExamForDoExam: ", props.examId);
});

// ฟังก์ชันดึงข้อมูลจาก room.json
onMounted( async () => {
  try {
    console.log("userLoginData: ", userLoginData.id);
  console.log("idExamForDoExam: ", props.examId);
    const roomData = await getAllData('../../data/room.json');
    usersData.value = roomData.users;
    
    // ค้นหาข้อสอบที่ตรงกับ examID ที่กรอก
    examData.value = roomData.exams.find(exam => exam.id === props.examId);
    
    if (examData.value) {
      // เก็บคำตอบของผู้ใช้
      examData.value.papers.forEach(paper => {
        userAnswers[paper.id] = paper.options.filter(opt => opt.answer).length === 1 ? '' : [];
      });

    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})


// คำนวณคะแนนเต็ม
const maxScore = computed(() => {
  if (!examData.value) return 0;
  return examData.value.papers.reduce((sum, paper) => sum + paper.options.filter(opt => opt.answer).length, 0);
});

// ฟังก์ชันส่งคำตอบ
const submitExam = () => {
  if (!examData.value) return;
  

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


  // อัพเดตข้อมูล history ของผู้ใช้
  const user = usersData.value.find(user => user.id === userLoginData.id);
  if (user) {
    user.history.push({
      exam_id: props.examId,
      score: totalScore.value,
    });
  }
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

  <div class="flex flex-col items-center mt-10 mb-20">
    <!-- Input สำหรับกรอก usersID และ examID -->
    <!-- <input v-model="usersID" placeholder="Enter User ID" class="mb-4 p-2 border rounded" />
    <input v-model="examID" placeholder="Enter Exam ID" class="mb-4 p-2 border rounded" />
    <button @click="fetchData" class="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4">Fetch Exam Data</button> -->

    <!-- แสดงชื่อข้อสอบและคำอธิบาย -->
    <h1 class="text-2xl font-bold">{{ examData?.name }}</h1>
    <p class="mb-4">{{ examData?.description }}</p>

    <!-- แสดงคำถามและตัวเลือก -->
    <div v-for="paper in examData?.papers" :key="paper.id" class="bg-white p-4 rounded-lg shadow-md w-80 mb-4">

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

      class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 mb-4 disabled:bg-gray-400">

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

            </li>
          </ul>
        </div>

        <div class="flex justify-center gap-4 mt-4">

          <button @click="restartExam" class="bg-yellow-500 text-white px-4 py-2 rounded-lg">Restart</button>
          <button @click="showResultPopup = false" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Home</button>
          <button @click="showResultPopup = false" class="bg-green-500 text-white px-4 py-2 rounded-lg">Profile</button>
        </div>
      </div>
    </div>
  </div>
</template>
