  <script setup>
  import { onMounted, ref } from "vue";
  import { getAllData } from "@/libs/apiData";
  import { RouterLink} from 'vue-router'


  const examData = ref([]);
  const userData = ref([]);
  const selectedExam = ref(null); // ตัวแปรเก็บข้อสอบที่ถูกเลือก


  onMounted(async () => {
    try {
        examData.value = await getAllData(`${import.meta.env.VITE_API_URL}/exams`);
        userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`);

    } catch (error) {
        console.error(error);
    }
  });

  const byProfessor = (ownerId) => {
    const user = userData.value.find(user => user.id == ownerId);
    return user ? user.name : "Unknown";
  };

  const openExamModal = (exam) => {
    selectedExam.value = exam; // ตั้งค่าข้อสอบที่เลือก
    console.log(selectedExam.value);
    console.log(selectedExam.value.id);
    
  };

  const closeModal = () => {
    selectedExam.value = null;
  };
  </script>

  <template>
    <div class="bg-black-100 min-h-screen">
      <div class="p-6 mx-[50px] py-[40px]">
        <div class="grid grid-cols-3 gap-12 mx-[120px] mt-[-20px]">
          <button
            v-for="(exam, index) in examData"
            :key="index"
            @click="openExamModal(exam)"
            class="bg-blue-400 text-white rounded-3xl shadow-md overflow-hidden w-full text-left flex flex-col hover:cursor-pointer"
          >
            <!-- Upper Section -->
            <div class="px-7 py-5">
              <h2 class="text-4xl font-bold text-black">{{ exam.category }}</h2>
              <p class="font-semibold pb-[80px] text-2xl pt-[7px]">{{ exam.name }}</p>
            </div>

            <!-- Bottom Section (White Box) -->
            <div class="flex justify-between items-center bg-white p-2 text-black border-t w-full">
              <div class="flex items-center py-[10px]">
                <span class="text-red-500 text-xl pl-[30px]">❤️</span>
                <span class="ml-1 text-2xl font-semibold">{{ exam.likes }}</span>
              </div>
              <p class="text-gray-600 text-xl pr-[30px]">BY {{ byProfessor(exam.ownerExam_id) }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Pop-up Modal -->
    <div v-if="selectedExam" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 class="text-2xl font-bold">{{ selectedExam.name }}</h2>
        <p class="text-gray-700">{{ selectedExam.description }}</p>
        <p class="mt-2 text-sm text-gray-500">Category: {{ selectedExam.category }}</p>
        <p class="mt-2 text-sm text-gray-500">Likes: {{ selectedExam.likes }}</p>

        <div class="mt-4 flex justify-end">
          <button @click="closeModal" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition">
            Close
          </button>
          <RouterLink :to="{ name: 'DoExamPage' , params: { examId: selectedExam.id } }" class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
            Start to Exam
          </RouterLink>
        </div>
      </div>
    </div>
  </template>
