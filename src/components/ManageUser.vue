<script setup>
import { onMounted, ref } from "vue";
import { getAllData,getDataById, updateSomeData,deleteUserById } from "@/libs/apiData";

const userData = ref([]);
const userDataById = ref();
const activeDropdownId = ref(null);

const toggleDropdown = (userId) => {
  if (activeDropdownId.value === userId) {
    activeDropdownId.value = null;
  } else {
    activeDropdownId.value = userId;
  }
};


onMounted(async () => {
  try {
    userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`);
} catch (error) {
     console.error(error);
}
});

const getRoleName = (role) => {
     if(role === 'student'){
          return "STUDENT";
     }else if(role === 'professor'){
          return "PROFESSOR";
     }else if(role === 'admin'){
          return "ADMIN";
     }
};

const findUserId = async(id) => {
         userDataById.value = await getDataById(`${import.meta.env.VITE_API_URL}/users`,id);
};

const givePrivilege = async(id,roleChanging) => {
     await findUserId(id);
     if(userDataById.value.role !== roleChanging){
         await updateSomeData(`${import.meta.env.VITE_API_URL}/users`,id,{role:roleChanging});
         userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`);
     }else{
         console.log("role is the same");
     }

};

const deleteUser = async(id) => {
  if(confirm("Are you sure you want to delete this user?")){
    await findUserId(id);
    await deleteUserById(`${import.meta.env.VITE_API_URL}/users`,id);
    userData.value = await getAllData(`${import.meta.env.VITE_API_URL}/users`);
  }
};



</script>

<template>
   <div v-for="(user, index) in userData" :key="index" class="border border-black bg-white rounded-lg p-4 mb-4 mx-[50px] flex items-center justify-between">
    <div class="flex flex-col pl-5">
      <p class="font-bold text-2xl pb-1">{{ getRoleName(user.role) }}_ID: {{ user.id }}</p>
      <p class="font-bold">NAME: {{ user.name }}</p>
      <p class="font-bold">EMAIL: {{ user.email }}</p>
    </div>
    <div class="flex space-x-4">
      <div class="relative">
          <button 
          @click="toggleDropdown(user.id)" 
          class="bg-blue-300 text-black font-medium py-2 px-4 rounded-md hover:bg-blue-400"
        >
          GIVE PRIVILEGE
        </button>
        <div 
          v-if="activeDropdownId === user.id" 
          class="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10"
        >
          <button 
            @click="givePrivilege(user.id,'professor')" 
            class="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            PROFESSOR
          </button>
          <button 
            @click="givePrivilege(user.id,'student')" 
            class="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            STUDENT
          </button>
          <button 
            @click="givePrivilege(user.id,'admin')" 
            class="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            ADMIN
          </button>
        </div>
      </div>
      <button 
        @click="deleteUser(user.id)" 
        class="bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600"
      >
        REMOVE USER
      </button>
    </div>
  </div>
</template>
