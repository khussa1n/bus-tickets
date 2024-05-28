<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Cookies from 'js-cookie';
import { API } from '@/lib/headers';

const route = useRoute();

// Define reactive state variables
const tickets = ref<Ticket[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Function to format dates
function formatDate(dateStr: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateStr).toLocaleDateString('kk-KZ', options);
}

// Function to fetch the ticket data
async function fetchTickets() {
  try {
    const userId = Cookies.get('userId'); // Assuming userId is stored in cookies

    const response = await fetch(`${API}/tickets?user_id=${userId}&_relations=trips`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });

    if (!response.ok) {
      const errorResponse: ErrorResponse = await response.json();
      throw new Error(errorResponse.message);
    }

    tickets.value = await response.json();
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
}

// Fetch the ticket data when the component is mounted
onMounted(fetchTickets);

// Function to handle booking cancellation
async function cancelBooking(ticketId: number) {
  try {
    const response = await fetch(`${API}/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse: ErrorResponse = await response.json();
      throw new Error(errorResponse.message);
    }

    alert('Брондаудан бас тарту сәтті орындалды');
    tickets.value = tickets.value.filter((ticket) => ticket.id !== ticketId);
  } catch (err: any) {
    alert(err.message);
  }
}
</script>

<template>
  <div class="text-white p-6 max-w-6xl mx-auto bg-gray-900 rounded-lg shadow-lg mt-10">
    <h2 class="text-3xl font-bold mb-10 text-center border-b-2 pb-4">Брондау мәліметтері</h2>
    <div v-if="loading" class="text-center text-xl">Загрузка...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else class="grid md:grid-cols-2 gap-10" v-auto-animate>
      <div v-for="ticket in tickets" :key="ticket.id" class="bg-gray-800 p-6 rounded-lg shadow-md">
        <div class="mb-4">
          <strong class="block text-lg">Жүру:</strong>
          <span>{{ ticket.trip.from }} ➔ {{ ticket.trip.to }}</span>
        </div>
        <div class="mb-4">
          <strong class="block text-lg">Шығу:</strong>
          <span>{{ formatDate(ticket.trip.departure) }}</span>
        </div>
        <div class="mb-4">
          <strong class="block text-lg">Келу:</strong>
          <span>{{ formatDate(ticket.trip.arrival) }}</span>
        </div>
        <div class="mb-4">
          <strong class="block text-lg">Орындар:</strong>
          <span>{{ ticket.seats }}</span>
        </div>
        <div class="mb-4">
          <strong class="block text-lg">Жасалған:</strong>
          <span>{{ formatDate(ticket.trip.departure) }}</span>
        </div>
        <div class="mb-4">
          <strong class="block text-lg">Күй:</strong>
          <span>{{ ticket.trip.status }}</span>
        </div>
        <div class="mb-4">
          <strong class="block text-lg">Бағасы:</strong>
          <span>{{ ticket.trip.price }} ₸</span>
        </div>
        <div class="mt-6 w-full flex justify-center">
          <button
            @click="cancelBooking(ticket.id)"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            Брондаудан бас тарту
          </button>
        </div>
      </div>
    </div>
    <p class="mt-8 text-gray-400 text-center">
      Сіз брондаудан кетуге екі сағат қалғанға дейін бас тарта аласыз.
    </p>
  </div>
</template>

<style scoped>
/* Add any styles needed for the ticket details page */
</style>
