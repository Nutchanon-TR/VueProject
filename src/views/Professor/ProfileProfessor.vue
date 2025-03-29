<script setup>
import { ref, onMounted } from "vue";
import navBar from '@/components/navBar.vue';
import { userLogin } from '@/stores/loginDataUser.js';
import { getAllData } from "@/libs/apiData";
import Profile from "@/components/Profile.vue";
import { deleteUserById } from "@/libs/apiData";

const exams = ref([]); 
const ownedExams = ref([]); 
const users = ref([]); 

const userLoginData = userLogin();

// ฟังก์ชันดึงข้อมูล exams
const fetchExams = async () => {
    try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/exams`;
        exams.value = await getAllData(apiUrl);

        // ข้อสอบที่ id ตรงกันกับ professor
        ownedExams.value = exams.value.filter(exam => exam.ownerExam_id == userLoginData.id);

        
        const usersApiUrl = `${import.meta.env.VITE_API_URL}/users`;
        users.value = await getAllData(usersApiUrl);
    } catch (error) {
        console.error(error.message);
    }
};

// ฟังก์ชันลบข้อสอบ
const deleteExam = async (examId) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/exams/${examId}`;
    console.log("Deleting Exam at URL:", apiUrl);

    if (confirm("Are you sure you want to delete this exam?")) {
        try {
            const status = await deleteUserById(apiUrl);
            console.log("Delete Response Status:", status);

            if (status === 200 || status === 204) {
                // ลบข้อมูลข้อสอบใน ownedExams
                ownedExams.value = ownedExams.value.filter(exam => exam.id !== examId);

                // ลบข้อมูลใน history
                users.value.forEach(user => {
                    user.history = user.history.filter(record => record.exam_id !== examId);
                });

                users.value.forEach(user => {
                    user.likeExam_Id = user.likeExam_Id.filter(examIdInLike => examIdInLike !== examId);
                });

                alert("Exam and associated data deleted successfully.");
            } else {
                alert("Failed to delete the exam.");
            }
        } catch (error) {
            console.error(error.message);
            alert("Failed to delete the exam.");
        }
    }
};

onMounted(() => {
    console.log(userLoginData.name);
    fetchExams();
});
</script>


<template>
    <navBar />
    <div class="flex flex-col md:flex-row justify-between items-start gap-6 p-6">
        <Profile />

        <div v-if="ownedExams.length" class="w-full md:w-4/5">
            <h2 class="text-lg font-semibold mb-2">Your Created Exams</h2>
            <ul class="space-y-2">
                <li v-for="(exam, index) in ownedExams" :key="index">
                    <div
                        class="p-4 bg-white rounded-lg shadow-md border border-gray-200 w-full flex justify-between items-center">
                        <div>
                            <h3 class="text-gray-700 font-medium">{{ exam.name }}</h3>
                            <p class="text-gray-600">{{ exam.description }}</p>
                            <p class="text-gray-600">Category: {{ exam.category }}</p>
                        </div>
                        <button @click="deleteExam(exam.id)"
                            class="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition">
                            Delete
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
