<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAllData, updateData } from "../../libs/apiData.js";
import QuestionItem from "@/components/ExamCreation/QuestionItem.vue";
import navBar from "@/components/navBar.vue";
import DescriptionItem from "@/components/ExamCreation/DescriptionItem.vue";
import { userLogin } from "@/stores/loginDataUser.js";

const route = useRoute();
const router = useRouter();
const quizId = route.params.id; // รับค่า ID จาก URL

const quizName = ref("");
const description = ref("");
const selectedCategory = ref("");
const questions = ref([]);


// ฟังก์ชันดึง userId จาก Cookie
const getUserIdFromCookie = () => {
  const cookies = document.cookie.split("; ");
  console.log(cookies.value)
  const userIdCookie = cookies.find((row) => row.startsWith("userId="));
  console.log(userIdCookie)
  return userIdCookie ? userIdCookie.split("=")[1] : null;
};

// เก็บข้อมูล user
const userLoginData = userLogin();
const userData = ref(null);




// 🟢 โหลดข้อมูลของ Quiz
const loadQuizData = async () => {
  try {
    const savedUserId = getUserIdFromCookie();
    if (!savedUserId) {
      alert("User is not logged in");
      router.push("/login"); // กลับไปหน้า login
      return;
    }
    const allExams = await getAllData(`${import.meta.env.VITE_API_URL}/exams`);
    const quiz = allExams.find((exam) => exam.id === quizId);
    if (savedUserId) {
      userData.value = await getDataById(
        `${import.meta.env.VITE_API_URL}/users`,
        savedUserId
      );
      userLoginData.keepDataFromLogin(userData.value);
      console.log("User Data:", userLoginData);
    }
    if (quiz) {
      quizName.value = quiz.name;
      description.value = quiz.description;
      selectedCategory.value = quiz.category;
      questions.value = quiz.papers.map((q, index) => ({
        id: index + 1,
        question: q.question,
        type: q.options.length > 1 ? "multiple" : "single",
        options: q.options.map((o, optIndex) => ({
          id: optIndex + 1,
          text: o.choice,
          isCorrect: o.isCorrect,
        })),
      }));
    }
  } catch (error) {
    console.error("Error loading quiz:", error);
  }
};

onMounted(loadQuizData);

// 🟢 ฟังก์ชันอัปเดต Quiz
const updateQuiz = async () => {
  if (!quizName.value.trim()) {
    alert("Please enter a quiz name.");
    return;
  }
  if (!selectedCategory.value.trim()) {
    alert("Please select a category.");
    return;
  }
  if (questions.value.length === 0) {
    alert("Please add at least one question.");
    return;
  }

  const updatedQuiz = {
    id: quizId,
    name: quizName.value,
    description: description.value,
    category: selectedCategory.value,
    papers: questions.value.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options.map((o) => ({
        choice: o.text,
        isCorrect: o.isCorrect,
      })),
    })),
  };

  try {
    await updateData(`${import.meta.env.VITE_API_URL}/exams/${quizId}`, updatedQuiz);
    alert("Quiz updated successfully!");
    router.push("/"); // กลับไปหน้าหลัก
  } catch (error) {
    console.error("Error updating quiz:", error);
  }
};

// 🟢 ฟังก์ชันจัดการคำถาม
const addQuestion = () => {
  questions.value.push({
    id: questions.value.length + 1,
    question: "",
    type: "single",
    options: [{ id: 1, text: "", isCorrect: false }],
  });
};

const deleteQuestion = (index) => {
  questions.value.splice(index, 1);
};

const addOption = (questionIndex) => {
  questions.value[questionIndex].options.push({
    id: Date.now(),
    text: "",
    isCorrect: false,
  });
};

const deleteOption = (questionIndex, optionId) => {
  questions.value[questionIndex].options = questions.value[questionIndex].options.filter(
    (o) => o.id !== optionId
  );
};

const toggleQuestionType = (index) => {
  questions.value[index].type = questions.value[index].type === "single" ? "multiple" : "single";
};

</script>

<template>
  <navBar />
  <div class="p-5">
    <h1 class="text-2xl font-bold">Edit Your Quiz</h1>

    <DescriptionItem
      :quizName="quizName"
      :quizCategory="selectedCategory"
      :quizDescription="description"
      @sendQuizName="(name) => (quizName = name)"
      @quizCategory="(category) => (selectedCategory = category)"
      @sendQuizDescription="(desc) => (description = desc)"
    />

    <QuestionItem
      v-for="(q, index) in questions"
      :key="q.id"
      :question="q"
      @deleteQuestion="deleteQuestion(index)"
      @addOption="addOption(index)"
      @deleteOption="deleteOption(index, $event)"
      @toggleType="toggleQuestionType(index)"
    />

    <button @click="addQuestion" class="bg-blue-500 text-white p-2 rounded mt-3">
      ➕ Add Question
    </button>

    <button @click="updateQuiz" class="bg-green-500 text-white p-2 rounded mt-3">
      💾 Update
    </button>
  </div>
</template>
