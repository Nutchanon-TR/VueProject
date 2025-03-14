<script setup>
import { ref, onMounted } from "vue";
import navBar from '@/components/navBar.vue';
import { userLogin } from '@/stores/loginDataUser.js';
import { updateData } from '@/libs/apiData.js';  // นำเข้า API updateData

const userLoginData = userLogin();

// สร้างตัวแปรสำหรับข้อมูลที่จะอัปเดต
const updatedUser = ref({
  name: userLoginData.name,
  email: userLoginData.email,
  bio: userLoginData.bio,
  // ไม่ต้องการเปลี่ยนแปลง role และ history
});

const errorMsg = ref('');
const successMsg = ref('');

// ตัวแปรสำหรับควบคุมการแสดงผลของฟอร์ม
const showUpdateForm = ref(false);

// ฟังก์ชันที่ใช้ในการอัปเดตข้อมูลผู้ใช้
const updateUserProfile = async () => {
  try {
    const userId = userLoginData.id;  // ใช้ ID ที่เก็บใน store หรือ cookie
    // เรียกใช้ API เพื่อติดต่อกับ Backend สำหรับการอัปเดตข้อมูล
    const updatedData = await updateData(`${import.meta.env.VITE_API_URL}/users`, userId, updatedUser.value);

    // อัปเดตข้อมูลใน store หลังจากการอัปเดตเสร็จ
    userLoginData.keepDataFromLogin(updatedData);

    // แสดงข้อความว่าอัปเดตสำเร็จ
    successMsg.value = 'Profile updated successfully!';
    showUpdateForm.value = false;  // ซ่อนฟอร์มหลังจากอัปเดตสำเร็จ
  } catch (error) {
    // แสดงข้อความผิดพลาดถ้ามีการเกิดข้อผิดพลาด
    errorMsg.value = error.message;
  }
};

// ตรวจสอบการอัปเดตข้อมูลหลังจาก component ถูกโหลด
onMounted(() => {
  console.log(userLoginData.name); // ตัวอย่างการแสดงชื่อผู้ใช้ใน console
});
</script>

<template>
  <navBar />
  <div class="w-100 h-100">
    <img class="w-32 h-32" src="../../assets/logo.svg" alt="" />
    <h1>This is the Profile Student page</h1>
    <h1>Profile of {{ userLoginData.name }}</h1>
    <p>Email: {{ userLoginData.email }}</p>
    <p>Role: {{ userLoginData.role }}</p>
    <p>Bio: {{ userLoginData.bio }}</p>

    <!-- ปุ่ม Edit Profile -->
    <button
      @click="showUpdateForm = !showUpdateForm"
      class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
      Edit Profile
    </button>

    <!-- ฟอร์มอัปเดตข้อมูลที่จะแสดงเมื่อ showUpdateForm เป็น true -->
    <div v-if="showUpdateForm">
      <div>
        <input v-model="updatedUser.name" placeholder="Update Name" />
        <input v-model="updatedUser.email" placeholder="Update Email" />
        <textarea v-model="updatedUser.bio" placeholder="Update Bio"></textarea>
      </div>
      <button
        @click="updateUserProfile"
        class="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
        Update Profile
      </button>
      <p v-if="errorMsg" class="text-red-500">{{ errorMsg }}</p>
      <p v-if="successMsg" class="text-green-500">{{ successMsg }}</p>
    </div>
  </div>
</template>
