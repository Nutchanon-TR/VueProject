<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import navBar from "@/components/navBar.vue";
import { userLogin } from "@/stores/loginDataUser.js";
import { getAllData } from "@/libs/apiData";
import Profile from "@/components/Profile.vue";
import { deleteUserById } from "@/libs/apiData";
import History from "@/components/History.vue";

const exams = ref([]);
const ownedExams = ref([]);
const users = ref([]);
const isShowingCreatedExams = ref(true);

const router = useRouter();
const userLoginData = userLogin();

const fetchExams = async () => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_URL}/exams`;
    exams.value = await getAllData(apiUrl);
    ownedExams.value = exams.value.filter(
      (exam) => exam.ownerExam_id == userLoginData.id
    );

    const usersApiUrl = `${import.meta.env.VITE_API_URL}/users`;
    users.value = await getAllData(usersApiUrl);
  } catch (error) {
    console.error(error.message);
  }
};

const deleteExam = async (examId) => {
  if (confirm("Are you sure you want to delete this exam?")) {
    try {
      const status = await deleteUserById(`${import.meta.env.VITE_API_URL}/exams`, examId);
      if (status === 200 || status === 204) {
        ownedExams.value = ownedExams.value.filter((exam) => exam.id !== examId);
        users.value.forEach((user) => {
          user.history = user.history.filter((record) => record.exam_id !== examId);
          user.likeExam_Id = user.likeExam_Id.filter((id) => id !== examId);
        });
        alert("Exam and associated data deleted successfully.");
      } else {
        alert("Failed to delete the exam.");
      }
    } catch (error) {
      console.error(error.message);
      alert("Failed to delete the exam.");
    }
  } else {
    router.push({ name: "ProfileProfessor" });
  }
};

onMounted(() => {
  console.log(userLoginData.name);
  fetchExams();
});
const updateImageUser = ref("");

const updateImage = (newImg) => {
  updateImageUser.value = newImg;
}
</script>

<template>
  <navBar :updateImage="updateImageUser" />
  <div class="flex flex-col md:flex-row justify-between items-start gap-6 p-6">
    <Profile @updateImageURL="updateImage" />

    <div class="w-full md:w-4/5 flex flex-col">
      <!-- Toggle Button -->
      <div class="flex justify-end mb-4">
        <button @click="isShowingCreatedExams = !isShowingCreatedExams"
          class="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition">
          {{ isShowingCreatedExams ? 'Show Your Exam History' : 'Show Your Created Exams' }}
        </button>
      </div>

      <!-- Your Created Exams Section -->
      <!-- Your Created Exams Section -->
      <div v-if="isShowingCreatedExams">
        <template v-if="ownedExams.length">
          <h2 class="text-lg font-semibold mb-4 text-gray-800">Your Created Exams</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(exam, index) in ownedExams" :key="index"
              class="bg-blue-400 text-white rounded-3xl shadow-md overflow-hidden w-full flex flex-col hover:cursor-pointer transition-transform transform hover:scale-105">
              <div class="px-7 py-5 relative">
                <RouterLink :to="{ name: 'EditExamPage', params: { quizId: exam.id } }">
                  <h2 class="text-4xl font-bold text-black">{{ exam.category }}</h2>
                  <p class="font-semibold pb-[50px] text-2xl pt-[7px]">
                    {{ exam.name }}
                  </p>
                </RouterLink>
                <button @click="deleteExam(exam.id)"
                  class="absolute bottom-3 right-3 p-2 rounded-full text-white transition text-4xl">
                  🗑️
                </button>
              </div>
              <div class="flex justify-between items-center bg-white p-3 text-black border-t w-full">
                <div class="flex items-center">
                  <span class="text-red-500 text-xl">❤️</span>
                  <span class="ml-2 text-2xl font-semibold">{{ exam.likes }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ถ้าไม่มีข้อสอบ -->
        <template v-else>
          <div class="w-full h-96 flex items-center justify-center bg-gray-200 rounded-3xl shadow-inner">
            <p class="text-gray-500 text-2xl">You have not created any exams yet.</p>
          </div>
        </template>
      </div>


      <!-- History Section -->
      <div v-else>
        <History />
      </div>
    </div>
  </div>
</template>
