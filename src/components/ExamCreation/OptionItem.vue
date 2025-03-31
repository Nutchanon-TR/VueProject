<script setup>
const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  questionId: {
    type: [String, Number],
    required: true,
  },
  questionType: {
    type: String
  },
  mode: { type: String }
});

const emit = defineEmits(["updateOption", "deleteOption"]);

const removeOption = () => {
  emit("deleteOption", {
    questionId: props.questionId,
    optionId: props.option.id
  });
};

const handleChange = (e) => {
  const isChecked = e.target.checked;
  emit("updateOption", {
    ...props.option,
    isCorrect: isChecked
  });
};

const handleTextChange = (e) => {
  emit("updateOption", {
    ...props.option,
    text: e.target.value
  });
};
</script>

<template>
  <div class="flex items-center space-x-2">
    <input
      :type="questionType === 'single' ? 'radio' : 'checkbox'"
      :name="questionType === 'single' ? 'question-' + questionId : undefined"
      :checked="option.isCorrect"
      @change="handleChange"
    />
    <input
      type="text"
      v-model="option.text"
      @input="handleTextChange"
      placeholder="Enter option..."
      class="border p-1 rounded"
    />
    <button @click="removeOption" class="text-red-500">❌</button>
  </div>
</template>