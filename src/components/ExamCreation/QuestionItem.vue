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


