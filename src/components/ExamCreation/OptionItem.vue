<script setup>
  const props = defineProps(["option", "questionId", "questionType","mode"]);
  const emit = defineEmits(["deleteOption"]);
  
  // onMounted({

  // })
  const removeOption = () => {
    emit("deleteOption", props.option.id);
  };
  </script>

<template>
    <div class="flex items-center space-x-2">
      <input
        :type="questionType === 'single' ? 'radio' : 'checkbox'"
        :name="'question-' + questionId"
        @change="option.isCorrect = !option.isCorrect"
      />
      <input
        type="text"
        v-model="option.text"
        placeholder="Enter option..."
        class="border p-1 rounded"
      />
      <button @click="removeOption" class="text-red-500">❌</button>
    </div>
  </template>
  
  
  