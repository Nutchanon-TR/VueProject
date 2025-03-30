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
const emit = defineEmits(["deleteQuestion", "addOption", "deleteOption", "toggleType"]);

const removeQuestion = () => emit("deleteQuestion");
const addOption = () => emit("addOption");
const deleteOption = (optionId) => {
  emit("deleteOption", {
    questionId: props.question.id,
    optionId
  });
};
const toggleType = () => emit("toggleType");
</script>

<template>
  <div class="border p-3 rounded shadow-md mb-3 bg-white">
    <div class="flex justify-between items-center">
      <input
        type="text"
        v-model="question.question"
        placeholder="Enter your question..."
        class="w-full border p-1 rounded"
      />
      <button @click="removeQuestion" class="text-red-500 ml-2">❌</button>
    </div>

    <p class="text-gray-500 text-sm">Type: {{ question.type.toUpperCase() }}</p>
    <button @click="toggleType" class="text-blue-500">Toggle Type (M)</button>

    <div class="mt-2">
      <OptionItem
        v-for="opt in question.options"
        :key="opt.id"
        :option="opt"
        :questionId="question.id"
        :questionType="question.type"
        :mode="mode"
        @deleteOption="deleteOption"
      />
      <button @click="addOption" class="text-green-500 mt-2">➕ Add Option</button>
    </div>
  </div>
</template>


