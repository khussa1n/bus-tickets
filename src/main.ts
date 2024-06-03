import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import YmapPlugin from 'vue-yandex-maps';

const app = createApp(App);

app.use(router);

app.use(autoAnimatePlugin);

const settings = {
  apiKey: '405f74d5-bfb6-45c5-b774-69ca8da462ea',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1',
};

app.use(YmapPlugin, settings);

app.mount('#app');
