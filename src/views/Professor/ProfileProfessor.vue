<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import navBar from "@/components/navBar.vue";
import { userLogin } from "@/stores/loginDataUser.js";
import { getAllData } from "@/libs/apiData";
import Profile from "@/components/Profile.vue";
import { deleteUserById } from "@/libs/apiData";

const exams = ref([]);
const ownedExams = ref([]);
const users = ref([]);

const userLoginData = userLogin();

// ฟังก์ชันดึงข้อมูล exams
const fetchExams = async () => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_URL}/exams`;
    exams.value = await getAllData(apiUrl);

    // ข้อสอบที่ id ตรงกันกับ professor
    ownedExams.value = exams.value.filter(
      (exam) => exam.ownerExam_id == userLoginData.id
    );

    const usersApiUrl = `${import.meta.env.VITE_API_URL}/users`;
    users.value = await getAllData(usersApiUrl);
  } catch (error) {
    console.error(error.message);
  }
};

// ฟังก์ชันลบข้อสอบ
const deleteExam = async (examId) => {
  const apiUrl = `${import.meta.env.VITE_API_URL}/exams/${examId}`;
  console.log("Deleting Exam at URL:", apiUrl);

  if (confirm("Are you sure you want to delete this exam?")) {
    try {
      const status = await deleteUserById(apiUrl);
      console.log("Delete Response Status:", status);

      if (status === 200 || status === 204) {
        // ลบข้อมูลข้อสอบใน ownedExams
        ownedExams.value = ownedExams.value.filter(
          (exam) => exam.id !== examId
        );

        // ลบข้อมูลใน history
        users.value.forEach((user) => {
          user.history = user.history.filter(
            (record) => record.exam_id !== examId
          );
        });

        users.value.forEach((user) => {
          user.likeExam_Id = user.likeExam_Id.filter(
            (examIdInLike) => examIdInLike !== examId
          );
        });

        alert("Exam and associated data deleted successfully.");
      } else {
        alert("Failed to delete the exam.");
      }
    } catch (error) {
      console.error(error.message);
      alert("Failed to delete the exam.");
    }
  }
};

onMounted(() => {
  console.log(userLoginData.name);
  fetchExams();
});
</script>

<template>
  <navBar />
  <div class="flex flex-col md:flex-row justify-between items-start gap-6 p-6">
    <Profile />

    <div v-if="ownedExams.length" class="w-full md:w-4/5">
      <h2 class="text-lg font-semibold mb-4 text-gray-800">
        Your Created Exams
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(exam, index) in ownedExams"
          :key="index"
          class="bg-blue-400 text-white rounded-3xl shadow-md overflow-hidden w-full flex flex-col hover:cursor-pointer transition-transform transform hover:scale-105"
        >
          <RouterLink
            :to="{ name: 'EditExamPage', params: { quizId: exam.id } }"
          >
            <!-- Upper Section -->
            <div class="px-7 py-5 relative">
              <h2 class="text-4xl font-bold text-black">{{ exam.category }}</h2>
              <p class="font-semibold pb-[50px] text-2xl pt-[7px]">
                {{ exam.name }}
              </p>

              <button
                @click="deleteExam(exam.id)"
                class="absolute bottom-3 right-3 p-2 rounded-full text-white transition text-4xl"
              >
                🗑️
              </button>
            </div>
            <!-- Bottom Section (White Box) -->
            <div
              class="flex justify-between items-center bg-white p-3 text-black border-t w-full"
            >
              <div class="flex items-center">
                <span class="text-red-500 text-xl">❤️</span>
                <span class="ml-2 text-2xl font-semibold">{{
                  exam.likes
                }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
