<script setup>

import { ref,watch } from 'vue';

const emit = defineEmits(["quizCategory","sendQuizDescription","sendQuizName","mode"])

const props = defineProps({
    initialCategory: {type:String},
  initialQuizName: {type:String},
  initialDescription: {type:String}
})
const isOpen = ref(false);
const category = ref([
    {
        id:1,
        name:"Math"
    },
    {
        id:2,
        name:"Coding Language"
    },
    {
        id:3,
        name:"Science"
    },
    {
        id:4,
        name:"English"
    }
])
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selected = ref(props.initialCategory || "CATEGORY");
const quizName = ref(props.initialQuizName || "");
const quizDescription = ref(props.initialDescription || "");

watch(() => props.initialCategory, (newVal) => {
  selected.value = newVal || '';
});

watch(() => props.initialQuizName, (newVal) => {
  quizName.value = newVal || '';
});

watch(() => props.initialDescription, (newVal) => {
  quizDescription.value = newVal || '';
});



const selectCategory = (name) =>{
    selected.value = name
    isOpen.value = false;
    emit("quizCategory",name)
}

const sendQuizDescription = () =>{
    emit("sendQuizDescription", quizDescription.value);
}
const sendQuizName = () =>{
    emit("sendQuizName", quizName.value);
}


</script>

<template>
    <div class="border p-[30px] rounded shadow-md mb-3 bg-white">

    <div class="relative inline-block ">
        <button 
            @click="toggleDropdown" 
            class="bg-blue-300 text-black font-bold px-4 py-2 rounded-lg shadow-md flex items-center"
        >
            {{ selected }}
            <span class="ml-2">▼</span>
        </button>
        <br>
        <div 
            v-if="isOpen" 
            class="absolute mt-1 bg-white border border-gray-300 shadow-lg rounded-lg w-full"
        >
            <ul class="text-black">
                <li v-for="item in category" :key="item.id" @click="selectCategory(item.name)"  class="px-4 py-2 hover:bg-gray-200 cursor-pointer">{{ item.name }}</li>
            </ul>
        </div>
  </div>

        <div class="flex justify-between items-center">
            <input
                v-model="quizName"
                @input="sendQuizName()"
                type="text"
                placeholder="Enter your Quiz name..."
                class="w-full border p-1 rounded"
      />
        </div>
        <br>
        <div class="flex justify-between items-center">
            <textarea 
                @input="sendQuizDescription()"
                v-model="quizDescription"
                placeholder="Enter your Description..."
                class="w-full border p-1 rounded"
                rows="4" cols="50">
            </textarea>
        </div>
    </div>
</template>