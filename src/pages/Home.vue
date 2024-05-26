<script setup lang="ts">
import bus from '../assets/home-bus.webp';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const from = ref('');
const to = ref('');
const date = ref('');
const router = useRouter();

type Query = {
  from?: string;
  to?: string;
  date?: string;
};

const handleSubmit = (e: Event) => {
  e.preventDefault();

  const query: Query = {};
  if (from.value) query.from = from.value;
  if (to.value) query.to = to.value;
  if (date.value) query.date = date.value;

  router.push({
    name: 'trips',
    query: query,
  });
};
</script>

<template>
  <div
    class="absolute inset-0 z-10 pt-16 w-full h-screen"
    :style="{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bus})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }"
  >
    <div
      class="text-white max-w-[1000px] -mt-20 px-4 mx-auto text-sm flex flex-col items-center justify-center h-full"
    >
      <h1 class="text-4xl font-bold mb-8">Автобус рейстерін іздеңіз</h1>
      <div class="bg-gray-800 bg-opacity-75 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <form class="flex flex-wrap justify-between items-center gap-4" @submit="handleSubmit">
          <div class="flex-1">
            <input
              type="text"
              v-model="from"
              placeholder="Алматы"
              class="w-full p-3 bg-gray-900 text-white rounded-md focus:outline-none"
            />
          </div>
          <div class="flex-1">
            <input
              type="text"
              v-model="to"
              placeholder="Шымкент"
              class="w-full p-3 bg-gray-900 text-white rounded-md focus:outline-none"
            />
          </div>
          <div class="flex-1">
            <input
              type="date"
              v-model="date"
              class="w-full p-3 bg-gray-900 text-white rounded-md focus:outline-none"
            />
          </div>
          <div>
            <button
              type="submit"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md"
            >
              Іздеу
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
