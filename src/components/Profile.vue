<script setup>
import { ref, onMounted } from "vue";
import { userLogin } from '@/stores/loginDataUser.js';
import { updateSomeData } from "@/libs/apiData";

const userLoginData = userLogin();


const updatedUser = ref({
    name: userLoginData.name,
    email: userLoginData.email,
    bio: userLoginData.bio,
});

const errorMsg = ref('');
const successMsg = ref('');
const showUpdateForm = ref(false);


const updateUserProfile = async () => {
    try {
        const userId = userLoginData.id;
        const apiUrl = `${import.meta.env.VITE_API_URL}/users`;

        
        const updatedData = await updateSomeData(apiUrl, userId, updatedUser.value);

        
        userLoginData.keepDataFromLogin(updatedData);

        successMsg.value = 'Profile updated successfully!';
        showUpdateForm.value = false;
    } catch (error) {
        errorMsg.value = error.message;
    }
};

onMounted(() => {
    console.log(userLoginData.name);
});
</script>
<template>
    <div class="w-full md:w-1/5 p-6 bg-white">
        <img class="w-32 h-32 mx-auto" src="../assets/logo.svg" alt="" />


        <div v-if="!showUpdateForm" class="text-center">
            <h1 class="text-lg font-semibold text-gray-700">Profile of {{ userLoginData.name }}</h1>
            <p class="text-gray-600">Email: {{ userLoginData.email }}</p>
            <p class="text-gray-600">Role: {{ userLoginData.role }}</p>
            <p class="text-gray-600">Bio: {{ userLoginData.bio }}</p>

            <button @click="showUpdateForm = true"
                class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                Edit Profile
            </button>
        </div>

        <!-- ฟอร์มอัปเดตข้อมูล -->
        <div v-if="showUpdateForm" class="text-center">
            <input v-model="updatedUser.name" placeholder="Update Name" class="w-full p-2 border rounded-lg mt-2" />
            <input v-model="updatedUser.email" placeholder="Update Email" class="w-full p-2 border rounded-lg mt-2" />
            <textarea v-model="updatedUser.bio" placeholder="Update Bio"
                class="w-full p-2 border rounded-lg mt-2"></textarea>

            <div class="mt-4 flex justify-center gap-4">
                <button @click="updateUserProfile"
                    class="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
                    Update Profile
                </button>
                <button @click="showUpdateForm = false"
                    class="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
                    Cancel
                </button>
            </div>
        </div>
    </div>






</template>