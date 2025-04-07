<script setup>
  import QuestionItem from "@/components/ExamCreation/QuestionItem.vue";
  import navBar from '@/components/navBar.vue'
  import {addData,getAllData,updateSomeData,getDataById} from '../../libs/apiData.js';
  import {ref,onMounted} from 'vue';
  import {userLogin} from '@/stores/loginDataUser.js';
  import DescriptionItem from "@/components/ExamCreation/DescriptionItem.vue";
  import { useRouter } from "vue-router";

  const router = useRouter()
const props = defineProps({
    mode:{
      type:String,
      default: 'Creation'
    },
    quizId:{
      type:[String, Number]
    }
})
const liked = ref(0)
onMounted(async () => {
  if (props.mode === "Edit") {
    try {
      const quiz = await getDataById(`${import.meta.env.VITE_API_URL}/exams`, props.quizId);
      quizName.value = quiz.name || "";
      description.value = quiz.description || "";
      selectedCategory.value = quiz.category || "";
      liked.value = quiz.likes || 0 ;
      questions.value = quiz.papers.map((q) => ({
        id: q.id || Date.now(),
        question: q.question || "",
        type: q.options.filter(o => o.isCorrect).length > 1 ? "multiple" : "single",
        options: q.options.map((o, index) => ({
          id: index + 1,
          text: o.choice || "",
          isCorrect: o.isCorrect || false,
        })),
      }));
    } catch (error) {
      console.error("Error loading quiz data:", error);
    }
  }
});
  
  const userStore = userLogin()
  const nextId =ref(2)
  const questions = ref([]);

const addQuestion = () => {

  questions.value.push({
    id: nextId.value,
    question: "",
    type: "single",
    options: [{ id: 1, text: "", isCorrect: false }],
  });
  nextId.value++

  
};

const updateQuestion = (index, updatedQuestion) => {
  questions.value[index] = updatedQuestion;
};


const checkQuestion = () =>{
  let isValid = true;
  if(questions.value.length === 0){
    alert("You must add some question")
  }
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

const deleteOption = ({ questionId, optionId }) => {
  const question = questions.value.find(q => q.id === questionId);
  if (question) {
    question.options = question.options.filter(o => o.id !== optionId);
  }
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



const submitQuiz = async () => {
  if (!checkQuestion()) return;
    const res = await getAllData(`${import.meta.env.VITE_API_URL}/exams`)
    const lastId = res.length > 0 ? Math.max(...res.map(exam => Number(exam.id))) : 0
    const ExamID = (lastId + 1).toString()
    const currentUser = Number(userStore.id)
    const newExam = {
    id: ExamID  ,
    ownerExam_id: currentUser,
    name: quizName.value,
    description: description.value,
    category: selectedCategory.value,
    likes: liked.value,
    papers: questions.value.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options.map((o) => ({choice: o.text,isCorrect:o.isCorrect})),
    })),
  };
  try {
    
    if(props.mode === "Creation"){
        await addData(`${import.meta.env.VITE_API_URL}/exams` , newExam)
        alert("Quiz Created!");
        router.push({name:"HomePagePro"})
    }else if(props.mode === "Edit"){
        await updateSomeData(`${import.meta.env.VITE_API_URL}/exams`, props.quizId, newExam); 
        alert("Quiz Updated!");
        router.push({name:"HomePagePro"});
    }
    
  } catch (error) {
    console.error("Error publishing quiz:", error);
  }
};

  </script>

<template>
   <navBar/>
    <div class="p-5 mx-[300px]">
        <h1 class="text-4xl font-bold mb-[10px]">{{ mode === "Edit" ? "Edit Your Exam" : "Create Your Exam" }}</h1>
    
    <DescriptionItem
    :initial-category="selectedCategory"
    :initial-quiz-name="quizName"
    :initial-description="description"
     @quizCategory="setQuizCategory" 
     @sendQuizName="setQuizName" 
     @sendQuizDescription="setQuizDescription"
     ></DescriptionItem>
    <QuestionItem
      v-for="(q, index) in questions"
      :key="q.id"
      :question="q"
      :mode="mode"
      @deleteQuestion="deleteQuestion(index)"
      @addOption="addOption(index)"
      @updateQuestion="updateQuestion(index, $event)"
      @deleteOption="deleteOption($event)"
      @toggleType="toggleQuestionType(index)"
    />

    <button @click="addQuestion" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 shadow-md hover:bg-blue-700 transition duration-200">
      ➕ Add Question
    </button>

    <button @click="submitQuiz" class="w-full bg-[#00308F] text-white font-bold py-3 rounded-lg mt-4 shadow-md hover:bg-[#002772] transition duration-200">
       {{ mode === "Creation" ? "Publish" : "Confirm" }}
    </button>
    <button 
        
        @click="$router.go(-1)"
        class="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg mt-4 px-4 py-2 "
      >
        Cancel
      </button>

      
  </div>
  </template>
  
  
  