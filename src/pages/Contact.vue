<script setup lang="ts">
import { YandexMap } from 'vue-yandex-maps';
import { EnvelopeIcon, HomeIcon, PhoneIcon } from '@heroicons/vue/24/outline';

const settings = {
  apiKey: '405f74d5-bfb6-45c5-b774-69ca8da462ea',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1',
  center: [43.244827, 76.858338],
};

const handleSubmit = (e: Event) => {
  e.preventDefault();
  alert('Форма жіберілді');
};
</script>

<template>
  <div class="text-white px-6 pt-6 pb-10 max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg mt-10">
    <h1 class="text-4xl font-bold">Байланыс</h1>
    <div class="flex flex-col gap-14">
      <div class="mt-10 flex gap-10">
        <YandexMap
          style="width: 468px; height: 300px"
          :zoom="17"
          :settings="settings"
          :coordinates="settings.center"
        >
        </YandexMap>
        <div class="flex flex-col gap-4 text-xs">
          <div class="flex gap-4">
            <HomeIcon class="w-7 text-amber-300" />
            <div class="flex flex-col justify-center gap-1">
              <span class="">Қазақстан, Алматы</span>
              <span>Толе би, 294</span>
            </div>
          </div>
          <div class="flex gap-4">
            <PhoneIcon class="w-7 text-amber-300" />
            <div class="flex flex-col justify-center gap-1">
              <span>8 (7272) 70 33 33</span>
              <span>Дүйсенбі - Жұма</span>
            </div>
          </div>
          <div class="flex gap-4">
            <EnvelopeIcon class="w-7 text-amber-300" />
            <div class="flex flex-col justify-center gap-1">
              <span>info_bus@tav.aero</span>
            </div>
          </div>
        </div>
      </div>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-5 text-gray-700">
        <div class="flex gap-5 items-start text-xs">
          <div class="flex flex-col gap-4">
            <input
              required
              placeholder="Атыңыз"
              class="w-80 p-3 border placeholder-text-zinc-500 outline-none"
            />
            <input
              required
              type="email"
              name="Email"
              placeholder="Email"
              class="w-80 p-3 border placeholder-text-zinc-500 outline-none"
            />
          </div>
          <textarea
            required
            placeholder="Хатыңыз"
            class="w-80 h-[6.29rem] p-3 border placeholder-text-zinc-500 outline-none"
          ></textarea>
        </div>
        <button
          type="submit"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded w-fit"
        >
          Жіберу
        </button>
      </form>
    </div>
  </div>
</template>
