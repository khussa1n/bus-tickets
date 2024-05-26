import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Trips from '@/pages/Trips.vue';
import Tickets from '@/pages/Tickets.vue';
import Login from '@/pages/Login.vue';
import Join from '@/pages/Join.vue';
import Cookies from 'js-cookie';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }, // Add meta field to require authentication
  },
  {
    path: '/trips',
    name: 'trips',
    component: Trips,
    meta: { requiresAuth: true }, // Add meta field to require authentication
  },
  {
    path: '/tickets',
    name: 'tickets',
    component: Tickets,
    meta: { requiresAuth: true }, // Add meta field to require authentication
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/join',
    name: 'join',
    component: Join,
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Add a navigation guard
router.beforeEach((to, from, next) => {
  const token = Cookies.get('token'); // Get the token from cookies
  const isAuthenticated = !!token; // Convert token to boolean

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    // If the route requires authentication and the user is not authenticated, redirect to login
    next({ name: 'login' });
  } else {
    // Otherwise, allow access
    next();
  }
});

export default router;
