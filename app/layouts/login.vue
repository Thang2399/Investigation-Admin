<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow">
      <header class="mb-4 text-center">
        <h2 class="text-2xl font-semibold">Sign in</h2>
        <p class="text-sm text-gray-500">Welcome back — please sign in to continue</p>
      </header>

      <!-- Render the page content (login form) -->
      <slot />

      <footer class="mt-6 text-center text-sm text-gray-400">
        Forgot password? <NuxtLink to="/forgot">Reset</NuxtLink>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// you can add layout-specific composables here if needed
</script>
