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
  <div class="text-white p-4 max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">Брондау мәліметтері</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="ticket in tickets" :key="ticket.id" class="mb-4">
        <div class="mb-2"><strong>Жүру:</strong> {{ ticket.trip.from }} ➔ {{ ticket.trip.to }}</div>
        <div class="mb-2"><strong>Шығу:</strong> {{ formatDate(ticket.trip.departure) }}</div>
        <div class="mb-2"><strong>Келу:</strong> {{ formatDate(ticket.trip.arrival) }}</div>
        <div class="mb-2"><strong>Орындар:</strong> {{ ticket.seats }}</div>
        <div class="mb-2"><strong>Жасалған:</strong> {{ formatDate(ticket.trip.departure) }}</div>
        <div class="mb-2"><strong>Күй:</strong> {{ ticket.trip.status }}</div>
        <div class="mb-2"><strong>Бағасы:</strong> {{ ticket.trip.price }} ₸</div>
        <div class="mt-4 w-full flex justify-center">
          <button
            @click="cancelBooking(ticket.id)"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Брондаудан бас тарту
          </button>
        </div>
        <p class="mt-4 text-gray-400 text-center">
          Сіз брондаудан кетуге екі сағат қалғанға дейін бас тарта аласыз.
        </p>
        <hr class="my-4 border-gray-600" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any styles needed for the ticket details page */
</style>
