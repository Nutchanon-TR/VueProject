<script setup>
  import QuestionItem from "@/components/ExamCreation/QuestionItem.vue";
  import navBar from '@/components/navBar.vue'
  import {addData,getAllData} from '../../libs/apiData.js';
  import {ref} from 'vue';
  import {userLogin} from '@/stores/loginDataUser.js';

  const userStore = userLogin()
  const nextId =ref(2)
  const questions = ref([
  {
    id: 1,
    question: "",
    type: "single",
    options: [
      { id: 1, text: "", isCorrect: false },
      { id: 2, text: "", isCorrect: false },
    ],
  },
]);

const addQuestion = () => {

  questions.value.push({
    id: nextId.value,
    question: "",
    type: "single",
    options: [{ id: 1, text: "", isCorrect: false }],
  });
  nextId.value++

  
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

const publishQuiz = async () => {
  try {
    const res = await getAllData(`${import.meta.env.VITE_API_URL}/exams`)
    const lastId = res.length > 0 ? Math.max(...res.map(exam => Number(exam.id))) : 0;
    const newId = lastId + 1;
    const toStringID = newId.toString()
    const currentUser = userStore.id
    const currentUser02 = Number(currentUser)
    const newExam = {
    id: toStringID  ,
    ownerExam_id: currentUser02,
    name: "New Quiz",
    description: "Test your knowledge!",
    category: "General",
    likes: 0,
    papers: questions.value.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options.map((o) => ({choice: o.text,isCorrect:o.isCorrect})),
    })),
  };
    await addData(`${import.meta.env.VITE_API_URL}/exams`,newExam)
    alert("Quiz Published!");
  } catch (error) {
    console.error("Error publishing quiz:", error);
  }
};
  </script>

<template>
   <navBar/>
    <div class="p-5">
    <h1 class="text-2xl font-bold">Create Your Quiz</h1>

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

    <button @click="publishQuiz" class="bg-green-500 text-white p-2 rounded mt-3">
      📤 Publish
    </button>
  </div>
  </template>
  
  
  