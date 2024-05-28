<script setup lang="ts">
import { API } from '@/lib/headers';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const route = useRoute();
const router = useRouter();

// Define reactive state variables
const trips = ref<Trip[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10); // Default limit
const showModal = ref(false); // Modal visibility state
const selectedTrip = ref<Trip | null>(null); // Selected trip for booking
const seats = ref(1); // Number of seats to book

// Get search parameters from the route
const from = ref(route.query.from || '');
const to = ref(route.query.to || '');
const date = ref(route.query.date || '');

// Fetch data function
async function fetchData() {
  try {
    loading.value = true;

    // Build query parameters
    let queryParams = `?page=${currentPage.value}&limit=${limit.value}`;
    if (from.value) queryParams += `&from=${from.value}`;
    if (to.value) queryParams += `&to=${to.value}`;

    const token = Cookies.get('token');

    const response = await fetch(`${API}/trips${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result: PaginationResponse<Trip> = await response.json();
      trips.value = result.items;
      currentPage.value = result.meta.current_page;
      totalPages.value = result.meta.total_pages;
      totalItems.value = result.meta.total_items;
    } else if (!response.ok) {
      const err: ErrorResponse = await response.json();
      throw new Error(
        `Something went wrong: status ${err.statusCode}, ${err.error}, ${err.message}`,
      );
    }
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
}

// Change page function
function changePage(page: number) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

// Change limit function
function changeLimit(event: Event) {
  const target = event.target as HTMLInputElement;
  limit.value = target.value ? parseInt(target.value) : 10;
  currentPage.value = 1; // Reset to the first page
}

// Open modal function
function openModal(trip: Trip) {
  selectedTrip.value = trip;
  showModal.value = true;
}

// Close modal function
function closeModal() {
  showModal.value = false;
  selectedTrip.value = null;
}

// Confirm booking function
async function confirmBooking() {
  if (!selectedTrip.value) return;
  // Add your booking logic here
  // For example, make a POST request to your API
  try {
    const token = Cookies.get('token');
    const userId = Cookies.get('userId');

    if (!token) {
      router.push('/login');
      return;
    }

    const response = await fetch(`${API}/tickets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trip_id: selectedTrip.value.id,
        seats: seats.value,
        user_id: userId,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        `Something went wrong: status ${result.statusCode}, ${result.error}, ${result.message}`,
      );
    }

    alert('Брондау сәтті өтті!');
    router.push('/tickets');
    closeModal();
  } catch (err: any) {
    alert(err.message);
  }
}

// Fetch data when the component is mounted
onMounted(fetchData);

// Watch for changes in the current page and limit, and fetch data accordingly
watch([currentPage, limit, from, to, date], fetchData);
</script>

<template>
  <div class="text-white p-4">
    <h2 class="text-2xl font-bold mb-7">Автобус рейстерін іздеңіз</h2>
    <div class="mb-4 w-full flex justify-between items-center">
      <p>Барлығы {{ totalItems }}</p>
      <div>
        <label for="limit" class="mr-2">Жолдар саны:</label>
        <select
          id="limit"
          v-model="limit"
          @change="changeLimit"
          class="bg-gray-700 text-white p-2 rounded"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>

    <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div v-if="loading" class="text-center text-xl">Жүктеу...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-else v-auto-animate>
        <table class="w-full text-left">
          <thead class="bg-gray-700">
            <tr>
              <th class="p-2">Бағыт</th>
              <th class="p-2">Шығу уақыты</th>
              <th class="p-2">Келу уақыты</th>
              <th class="p-2">Орындар</th>
              <th class="p-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trip in trips" :key="trip.id" class="bg-gray-900 border-b border-gray-700">
              <td class="p-2">{{ trip.from }} ➔ {{ trip.to }}</td>
              <td class="p-2">
                {{
                  new Date(trip.departure).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </td>
              <td class="p-2">
                {{
                  new Date(trip.arrival).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </td>
              <td class="p-2">{{ trip.places }} бос орын бар</td>
              <td class="p-2">
                <button
                  @click="openModal(trip)"
                  class="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                >
                  Брондау
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between items-center mt-4">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
          >
            Алдыңғы
          </button>
          <span>Бет {{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
          >
            Келесі
          </button>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Жаңа тапсырыс</h3>
        <p><strong>Бағыт:</strong> {{ selectedTrip?.from }} ➔ {{ selectedTrip?.to }}</p>
        <p>
          <strong>Шығу:</strong>
          {{ selectedTrip && new Date(selectedTrip?.departure).toLocaleString() }}
        </p>
        <p><strong>Автобус:</strong> {{ selectedTrip?.bus }}</p>
        <div class="mt-4">
          <label for="seats" class="block mb-2">Орындар</label>
          <input
            type="number"
            id="seats"
            v-model="seats"
            min="1"
            :max="selectedTrip?.places"
            class="w-full p-2 bg-gray-900 text-white rounded-md"
          />
          <p class="mt-1">Барлығы {{ selectedTrip?.places }} орын бос</p>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button
            @click="closeModal"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Жабу
          </button>
          <button
            @click="confirmBooking"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Брондау
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #2c2c2c;
}

tbody tr:nth-child(even) {
  background-color: #3c3c3c;
}
</style>
``
