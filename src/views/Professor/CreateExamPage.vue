<script setup>
  import QuestionItem from "@/components/ExamCreation/QuestionItem.vue";
  import {addData} from '../../libs/apiData.js';
  import {ref} from 'vue';

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
    id: Date.now(),
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

const publishQuiz = async () => {
  const newExam = {
    id: Date.now(),
    ownerExam_id: 1,
    name: "New Quiz",
    description: "Test your knowledge!",
    category: "General",
    likes: 0,
    papers: questions.value.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options.map((o) => o.text),
      answer: q.options.filter((o) => o.isCorrect).map((o) => o.text),
    })),
  };
 
  try {
    await addData(`${import.meta.env.VITE_API_URL}/exams`,newExam)
    alert("Quiz Published!");
  } catch (error) {
    console.error("Error publishing quiz:", error);
  }
};
  </script>

<template>
   
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
  
  
  