<script setup lang="ts">
import { API } from '@/lib/headers';
import road from '../assets/road.png';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const info = ref('');
const isLoading = ref(false);

const router = useRouter();

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    info.value = 'Құпия сөздер сәйкес келмейді';
    return;
  }

  isLoading.value = true; // Start loading
  try {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: fullName.value,
        email: email.value,
        password: password.value,
      }),
    });

    if (res.ok) {
      // Redirect to the login page after successful registration
      router.push('/login');
    } else {
      const data = await res.json();
      info.value = data.message;
    }
  } catch (error) {
    console.error('An error occurred:', error);
    alert('An error occurred during registration. Please try again later.');
  } finally {
    isLoading.value = false; // Stop loading
  }
};
</script>

<template>
  <div
    class="absolute inset-0 z-10 pt-16 w-full h-screen flex items-center justify-center"
    :style="{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${road})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }"
  >
    <div class="text-white max-w-[1000px] text-sm -mt-10">
      <div class="bg-[#2c2c2c] bg-opacity-85 px-8 py-4 rounded-lg sm:w-96">
        <h2 class="text-2xl font-bold text-center text-white mb-8">Тіркелу</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="fullName" class="block text-gray-400 mb-2">Толық аты жөніңіз</label>
            <input
              type="text"
              id="fullName"
              v-model="fullName"
              class="w-full px-3 py-2 bg-white text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Толық аты жөніңіз"
              required
              :disabled="isLoading"
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="w-full px-3 py-2 bg-white text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Email"
              required
              :disabled="isLoading"
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-400 mb-2">Құпия сөз</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="w-full px-3 py-2 bg-white text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Құпия сөз"
              required
              :disabled="isLoading"
            />
          </div>
          <div class="mb-4">
            <label for="confirm-password" class="block text-gray-400 mb-2"
              >Құпия сөзді растаңыз</label
            >
            <input
              type="password"
              id="confirm-password"
              v-model="confirmPassword"
              class="w-full px-3 py-2 bg-white text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Құпия сөзді растаңыз"
              required
              :disabled="isLoading"
            />
          </div>
          <div class="mt-4 text-center text-red-500">
            <span>{{ info }}</span>
          </div>
          <div class="w-full flex justify-center mt-5">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-fit px-16 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <span v-if="isLoading">loading...</span>
              <span v-else>Тіркелу</span>
            </button>
          </div>
          <div class="mt-4 text-center">
            <router-link to="/login" class="text-gray-400 hover:underline"
              >Аккаунтыңыз бар ма? Кіру</router-link
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
