<script setup>
import OptionItem from "@/components/ExamCreation/OptionItem.vue";

const props = defineProps({
  question:{
    type:Object
  }
  ,mode:{
    type:String
  }
});
const emit = defineEmits(["deleteQuestion", "addOption", "deleteOption", "toggleType","updateQuestion"]);

const removeQuestion = () => emit("deleteQuestion");
const addOption = () => emit("addOption");
const deleteOption = ({ questionId, optionId }) => {
  emit("deleteOption",  { questionId, optionId });
};
const toggleType = () => emit("toggleType");



const updateOption = (updatedOption) => {
  let updatedOptions;
  
  if (props.question.type === 'single') {
    updatedOptions = props.question.options.map(opt => ({
      ...opt,
      isCorrect: opt.id === updatedOption.id
    }));
  } else {
    updatedOptions = props.question.options.map(opt => 
      opt.id === updatedOption.id 
        ? { ...opt, isCorrect: updatedOption.isCorrect }
        : opt
    );
  }
  emit('updateQuestion', {
    ...props.question,
    options: updatedOptions
  });
};
</script>

<template>
  <div class="border p-[40px] rounded shadow-md mb-3 bg-white relative">
    <div class="flex justify-between items-center mb-2">
      <input
        type="text"
        v-model="question.question"
        placeholder="Enter your question..."
        class="w-full border-b-4 border-black font-bold text-xl focus:outline-non pb-[5px]"
      />
      <button @click="removeQuestion" class="text-red-500 ml-2">❌</button>
    </div>

    <p class="text-gray-500 text-lg font-bold">Type: {{ question.type.toUpperCase() }}</p>
    <button @click="toggleType" class="text-blue-500  font-bold hover:bg-blue-100">click to change option type</button>
    

    <div class="mt-2">
      <OptionItem
        v-for="opt in question.options"
        :key="opt.id"
        :option="opt"
        :questionId="question.id"
        :questionType="question.type"
        :mode="mode"
        @updateOption="updateOption"
        @deleteOption="deleteOption"
      />
      <button @click="addOption" class="text-gray-400 text-lg ml-[5px] mt-[10px] hover:underline">➕ Add Option</button>
    </div>
  </div>
</template>
<!-- <template>
  <div class="border p-3 rounded shadow-md mb-3 bg-white relative">
    <div class="flex justify-between items-center mb-2">
      <input
        type="text"
        v-model="question.question"
        placeholder="Write your question ..."
        class="w-full border-b-4 border-black font-bold text-lg focus:outline-none"
      />
    </div>

    <p class="text-gray-500 text-sm font-bold">TYPE: {{ question.type.toUpperCase() }}</p> -->

    <!-- <div class="mt-2 space-y-2">
      <OptionItem
        v-for="opt in question.options"
        :key="opt.id"
        :option="opt"
        :questionId="question.id"
        :questionType="question.type"
        :mode="mode"
        @updateOption="updateOption"
        @deleteOption="deleteOption"
      />
      <button @click="addOption" class="text-gray-400 ml-6 hover:underline">➕ ADD OPTION</button>
    </div> -->

    <!-- Control panel -->
    <!-- <div class="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-3 bg-blue-200 rounded-xl py-2 px-1 flex flex-col space-y-2 shadow-md z-10">
      <button @click="toggleType" class="bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-500 hover:bg-blue-100">M</button>
      <button @click="$emit('toggleType')" class="bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-500 hover:bg-blue-100">S</button>
      <button @click="$emit('deleteQuestion')" class="bg-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-100">
        <img src="../../assets/crosslogo.svg" alt="delete" class="w-4 h-4">
      </button>
    </div> -->
  <!-- </div>
</template> -->

