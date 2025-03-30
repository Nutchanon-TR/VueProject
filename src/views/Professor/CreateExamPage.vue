<!-- <script setup>
  import QuestionItem from "@/components/ExamCreation/QuestionItem.vue";
  import navBar from '@/components/navBar.vue'
  import {addData,getAllData} from '../../libs/apiData.js';
  import {ref} from 'vue';
  import {userLogin} from '@/stores/loginDataUser.js';
  import DescriptionItem from "@/components/ExamCreation/DescriptionItem.vue";

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


const checkQuestion = () =>{
  let isValid = true;
  if (!quizName.value.trim()) {
    alert("Please enter a quiz name.");
    return false;
  }

  if (!selectedCategory.value.trim()) {
    alert("Please select a category.");
    return false;
  }

  if (questions.value.length === 0) {
    alert("Please add at least one question.");
    return false;
  }

  questions.value.forEach((q, qIndex) => {
    if (!q.question.trim()) {
      alert(`Please enter a question for Question ${qIndex + 1}`);
      isValid = false;
    }

    if (q.options.length < 2) {
      alert(`Question ${qIndex + 1} must have at least two choices.`);
      isValid = false;
    }
    q.options.forEach((option, optIndex) => {
      if (!option.text.trim()) {
        alert(`Choice ${optIndex + 1} in Question ${qIndex + 1} cannot be empty.`);
        isValid = false;
      }
    });

    if (!q.options.some(option => option.isCorrect)) {
      alert(`Please select a correct answer for Question ${qIndex + 1}`);
      isValid = false;
    }
  });

  return isValid;
}
  

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

const selectedCategory = ref("")
const setQuizCategory = (category) =>{
    selectedCategory.value = category
}
const quizName = ref("")
const setQuizName = (name) =>{
    quizName.value = name
}
const description = ref("")
const setQuizDescription = (desc) =>{
    description.value =desc
}

const publishQuiz = async () => {
  if (!checkQuestion()) return;
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
    name: quizName.value,
    description: description.value,
    category: selectedCategory.value,
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
    
    <DescriptionItem @quizCategory="setQuizCategory" @sendQuizName="setQuizName" @sendQuizDescription="setQuizDescription"></DescriptionItem>
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
  
  
   -->



   <script setup>
   import ExamForm from '@/components/ExamCreation/ExamForm.vue';
   import { ref } from 'vue';
   
   </script>
   
   <template>
     <ExamForm mode="Creation"></ExamForm>
   </template>