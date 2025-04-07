<script setup>
   import ExamForm from '@/components/ExamCreation/ExamForm.vue';
   import { ref } from 'vue';
   </script>
   
   <template>
     <ExamForm mode="Edit" :quizId="$route.params.id"></ExamForm>
   </template>
