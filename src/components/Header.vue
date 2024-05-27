<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const isAuthenticated = ref(false);
const isOpen = ref(false);

const userName = Cookies.get('userName');

const router = useRouter();

const checkAuth = () => {
  const token = Cookies.get('token');
  isAuthenticated.value = !!token;
};

const handleOpen = () => {
  isOpen.value = !isOpen.value;
};

onMounted(() => {
  checkAuth();
});

const handleLogout = () => {
  Cookies.remove('token');
  isAuthenticated.value = false;
  isOpen.value = false;
  router.push('/login');
};
</script>

<template>
  <div class="fixed z-50 w-full">
    <div class="relative z-10 max-w-[1000px] p-4 flex justify-between mx-auto text-sm">
      <div class="flex gap-10">
        <router-link to="/" class="flex items-center gap-1 text-gray-300 hover:text-white">
          <img
            class="w-4"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAuklEQVR4nO2RMQ7CMAxFM7QTZYerILgGdwFWuAgD3AZ6h44gdWCB6aFIbqUS1UmbbPRtUb79YseYiaEAGbAFzkAJPIEal1ruSsnamszXfAncGc8NWGiCK/FcNIEdOZaHJmhYBX5ZC7Buik0f3oCHSZBuRfbD/O26AJshgijMXwh2wAzYB/RzsiGCQs7zAIGT1QSVZOxrCuAQIPjNVprgRDxHTZAnEOS9ApF8JPhWg2NrZE0vddQENcn4ApCn0IhRHZwOAAAAAElFTkSuQmCC"
          />
          <span> Автобус рейстерін брондау </span>
        </router-link>
        <router-link to="/trips" class="text-gray-300 hover:text-white"> Рейстер </router-link>
        <router-link v-if="isAuthenticated" to="/tickets" class="text-gray-300 hover:text-white">
          Билеттер
        </router-link>
        <router-link to="/about" class="text-gray-300 hover:text-white"> Біз жайында </router-link>
      </div>
      <div class="flex items-center gap-3">
        <router-link v-if="!isAuthenticated" to="/login" class="text-gray-300 hover:text-white">
          Кіру
        </router-link>
        <router-link v-if="!isAuthenticated" to="/join" class="text-gray-300 hover:text-white">
          Тіркелу
        </router-link>

        <div class="relative">
          <span
            v-if="isAuthenticated"
            @click="handleOpen"
            class="text-gray-300 hover:text-white cursor-pointer"
            >{{ userName }}</span
          >
          <div
            v-if="isOpen"
            class="absolute py-2 px-3 bg-gray-900 bg-opacity-65 top-8 right-0 rounded"
          >
            <button @click="handleLogout" class="text-gray-300 hover:text-white">Шығу</button>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute inset-0 bg-gradient-to-b from-[#2c2c2c] to-transparent"></div>
  </div>
</template>

<style scoped>
.bg-gradient-to-b {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
}
</style>
