<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { userLogin } from "./stores/loginDataUser.js";
import { getDataById,getAllData } from "@/libs/apiData.js";
const userLoginData = userLogin();
const router = useRouter();
const idUserData = ref("");
const allExams =ref([])
const quizId = ref("");

//load page and check cookie login
onMounted(async () => {
  if (document.cookie === "" || document.cookie === "empty") {
    console.log("No Cookie");
    router.push({ name: "LoginPage" });
  } else {
    idUserData.value = await getDataById(
      `${import.meta.env.VITE_API_URL}/users`,
      document.cookie
    );

    userLoginData.keepDataFromLogin(idUserData.value);

    // ✅ Log ดูข้อมูล
    console.log("User ID:", idUserData.value.id);

    // โหลดข้อมูล Quiz
    allExams.value = await getAllData(`${import.meta.env.VITE_API_URL}/exams`);
    const currentExam = allExams.value.find(
      (exam) => exam.userId === idUserData.value.id
    );

    if (currentExam) {
      quizId.value = currentExam.id;
      console.log("Quiz ID:", quizId.value); // ✅ Log ค่า Quiz ID
    } else {
      console.log("No quiz found for this user");
    }

    if (userLoginData.role === "admin") {
      router.push({ name: "AdminPage" });
    } else if (userLoginData.role === "professor") {
      router.push({ name: "HomePagePro" });
    } else if (userLoginData.role === "student") {
      router.push({ name: "HomePageStud" });
    }
  }
});

</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full bg-gray-800 text-white shadow-md">
    <div class="flex justify-around py-3">
      <!-- Login -->
      <RouterLink :to="{ name: 'LoginPage' }" class="nav-item">
        🔑 Login
      </RouterLink>

      <!-- Sign Up -->
      <RouterLink :to="{ name: 'SignUpPage' }" class="nav-item">
        📝 Sign Up
      </RouterLink>

      <!-- Professor Home -->
      <RouterLink :to="{ name: 'HomePagePro' }" class="nav-item">
        🏠 Prof Home
      </RouterLink>

      <!-- Professor Profile -->
      <RouterLink :to="{ name: 'ProfileProfessor' }" class="nav-item">
        👨‍🏫 Prof Profile
      </RouterLink>

      <!-- Create Exam -->
      <RouterLink :to="{ name: 'CreateExamPage' }" class="nav-item">
        ✏️ Create Exam
      </RouterLink>

      <!-- Edit Exam (params: { id: quizId })-->
      <RouterLink v-if="quizId" :to="{ name: 'EditExamPage' }" class="nav-item"> 
        🛠️ Edit Exam
      </RouterLink>

      <!-- Student Home -->
      <RouterLink :to="{ name: 'HomePageStud' }" class="nav-item">
        🎓 Stud Home
      </RouterLink>

      <!-- Student Profile -->
      <RouterLink :to="{ name: 'ProfileStudent' }" class="nav-item">
        👤 Stud Profile
      </RouterLink>

      <!-- Do Exam -->
      <RouterLink :to="{ name: 'DoExamPage' }" class="nav-item">
        📄 Do Exam
      </RouterLink>

      <!-- Admin Page -->
      <RouterLink :to="{ name: 'AdminPage' }" class="nav-item">
        👀 Admin
      </RouterLink>

      <!-- Manage Page -->
      <RouterLink :to="{ name: 'Manage' }" class="nav-item">
        ⚙️ Manage
      </RouterLink>
    </div>
  </nav>
  <RouterView />
</template>
