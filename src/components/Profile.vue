<script setup>
import { ref, onMounted,defineEmits  } from "vue";
import { userLogin } from '@/stores/loginDataUser.js';
import { updateSomeData } from "@/libs/apiData";

const userLoginData = userLogin();
const emit = defineEmits(['updateImageURL']);

const updatedUser = ref({
    name: userLoginData.name,
    bio: userLoginData.bio,
    imageURL: userLoginData.imageURL,
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

        emit('updateImageURL', updatedUser.value.imageURL);
        showUpdateForm.value = false;
    } catch (error) {
        errorMsg.value = error.message;
    }
};

onMounted(() => {
    console.log(userLoginData.name);
    console.log(userLoginData.imageURL);

});
</script>
<template>
    <div class="w-full md:w-2/6 p-6 bg-white">
        <img class="w-32 h-32 mx-auto" :src="userLoginData.imageURL" alt="Profile Image" />


        <div v-if="!showUpdateForm" class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
            <h1 class="text-2xl font-bold text-gray-800 mb-3">Profile of {{ userLoginData.name }}</h1>
            <div class="text-gray-600 space-y-2">
                <p><span class="font-semibold">Email:</span> {{ userLoginData.email }}</p>
                <p><span class="font-semibold">Role:</span> {{ userLoginData.role }}</p>
                <div class="border border-gray-300 bg-gray-100 p-3 rounded-md text-left">
                    <p class="font-semibold text-gray-700">Bio:</p>
                    <p class="text-gray-600 whitespace-pre-line">{{ userLoginData.bio }}</p>
                </div>
            </div>

            <button @click="showUpdateForm = true"
                class="mt-5 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
                Edit Profile
            </button>
        </div>



        <!-- ฟอร์มอัปเดตข้อมูล -->
        <div v-if="showUpdateForm" class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Edit Profile</h2>

            <div class="space-y-3">
                <input v-model="updatedUser.name" placeholder="Update Name"
                    class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />

                <input v-model="updatedUser.imageURL" placeholder="Update Image URL"
                    class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />


                <textarea v-model="updatedUser.bio" placeholder="Update Bio"
                    class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 resize-none"></textarea>
            </div>

            <div class="mt-5 flex justify-center gap-4">
                <button @click="updateUserProfile"
                    class="px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-transform transform hover:scale-105">
                    Update Profile
                </button>

                <button @click="showUpdateForm = false"
                    class="px-6 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-transform transform hover:scale-105">
                    Cancel
                </button>
            </div>
        </div>

    </div>
</template>