<script setup>
  const props = defineProps({
    option:{
      type:Object,
      required: true,
    },
     questionId:{
      type:[String, Number],
      required: true,
     },
      questionType:{
        type:String
      },
      mode:{type:String}
    });
  const emit = defineEmits(["deleteOption"]);
  
  const removeOption = () => {
  emit("deleteOption", {
    questionId: props.questionId,
    optionId: props.option.id
  });
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
  
  
  