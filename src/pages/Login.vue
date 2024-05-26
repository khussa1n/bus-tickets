<script setup lang="ts">
import { API } from '@/lib/headers';
import road from '@/assets/road.png';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const email = ref('');
const password = ref('');
const remember = ref(false);
const info = ref('');
const isLoading = ref(false);

const router = useRouter();

const handleSubmit = async () => {
  isLoading.value = true; // Start loading
  try {
    const res = await fetch(`${API}/auth`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      // Save token to cookies
      Cookies.set('token', data.token, { expires: remember.value ? 7 : 1 });
      Cookies.set('userId', data.data.id, { expires: remember.value ? 7 : 1 });
      Cookies.set('userName', data.data.fullName, { expires: remember.value ? 7 : 1 });

      // Redirect to the homepage after successful login
      window.location.href = '/';
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
    <div class="text-white max-w-[1000px] text-sm -mt-44">
      <div class="bg-[#2c2c2c] bg-opacity-85 px-8 py-4 rounded-lg sm:w-96">
        <h2 class="text-2xl font-bold text-center text-white mb-8">Кіру</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <input
              type="email"
              id="email"
              v-model="email"
              :disabled="isLoading"
              class="w-full px-3 py-2 text-white bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Email"
              required
            />
          </div>
          <div class="mb-4">
            <input
              type="password"
              id="password"
              v-model="password"
              :disabled="isLoading"
              class="w-full px-3 py-2 text-white bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Құпия сөз"
              required
            />
          </div>
          <div class="flex items-center mb-4">
            <input
              type="checkbox"
              id="remember"
              v-model="remember"
              :disabled="isLoading"
              class="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-gray-400">Есте сақтау</label>
          </div>
          <div class="mt-4 text-center text-red-500">
            <span>{{ info }}</span>
          </div>
          <div class="w-full flex justify-center mt-7">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-fit px-16 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <span v-if="isLoading">loading...</span>
              <span v-else>Кіру</span>
            </button>
          </div>
          <div class="mt-4 text-center">
            <router-link to="/join" class="text-gray-400 hover:underline"
              >Аккаунтыңыз жоқ па? Тіркелу</router-link
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
