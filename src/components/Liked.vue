<script setup>
import { ref, computed } from "vue";
import { userLogin } from "@/stores/loginDataUser.js";
import { updateSomeData, getDataById } from "@/libs/apiData";

const userLoginData = userLogin();
const props = defineProps({
  examId: {
    type: [String, Number],
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const likeAmount = ref(props.likes || 0);
const likedByUser = ref(userLoginData.likeExam_Id.includes(props.examId));

const likedByUserCheck = computed(() => {
  return likedByUser.value;
});

const toggleLike = async () => {
  try {
    if (!likedByUser.value) {

      likeAmount.value += 1;

      await updateSomeData(
        `${import.meta.env.VITE_API_URL}/exams`,
        props.examId,
        {
          likes: likeAmount.value,
        }
      );

      userLoginData.likeExam_Id.push(props.examId);

      await updateSomeData(
        `${import.meta.env.VITE_API_URL}/users`,
        userLoginData.id,
        {
          likeExam_Id: userLoginData.likeExam_Id,
        }
      );

      likedByUser.value = true;
    } else {
      console.log("Removing like");

      likeAmount.value -= 1;
      await updateSomeData(
        `${import.meta.env.VITE_API_URL}/exams`,
        props.examId,
        {
          likes: likeAmount.value,
        }
      );

      const indexUserLikeThisExam = userLoginData.likeExam_Id.indexOf(props.examId);
      console.log("Index of examId in likeExam_Id:", indexUserLikeThisExam);
      if (indexUserLikeThisExam > -1) {
        userLoginData.likeExam_Id.splice(indexUserLikeThisExam, 1);
      }
      await updateSomeData(
        `${import.meta.env.VITE_API_URL}/users`,
        userLoginData.id,
        {
          likeExam_Id: userLoginData.likeExam_Id,
        }
      );
      likedByUser.value = false;
    }

    console.log("Current like status:", likedByUser.value);
    console.log("Current like count:", likeAmount.value);
  } catch (error) {
    console.error("Error updating like:", error);
  }
};
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <button
      @click="toggleLike"
      class="text-red-500 text-3xl pl-4 pb-2 transition-transform hover:scale-110"
    >
      <span v-if="likedByUserCheck">❤️</span>
      <span v-else>🤍</span>
    </button>

    <span class="ml-1 text-lg md:text-2xl font-semibold">{{ likeAmount }}</span>
  </div>
</template>
