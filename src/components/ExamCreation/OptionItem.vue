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

//
</script>
<template>
  <div class="flex items-center space-x-2 pl-2 py-[10px]">
    <input
      :type="questionType === 'single' ? 'radio' : 'checkbox'"
      :name="questionType === 'single' ? 'question-' + questionId : undefined"
      :checked="option.isCorrect"
      @change="handleChange"
      class="form-radio text-blue-600"
    />
    <input
      type="text"
      v-model="option.text"
      placeholder="Write Option ..."
      class="border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-full text-lg font-bold text-gray-700 placeholder-gray-400"
    />
    <button @click="removeOption" class="text-gray-500 hover:text-red-500 font-bold text-lg">✕</button>
  </div>
</template>