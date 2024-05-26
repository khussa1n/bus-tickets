<script setup lang="ts">
import Header from '@/components/Header.vue';
</script>

<template>
  <Header />
  <div class="max-w-[1000px] px-4 pt-16 mx-auto text-sm text-white">
    <router-view></router-view>
  </div>
</template>
