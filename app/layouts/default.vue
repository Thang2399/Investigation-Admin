<template>
  <div class="min-h-screen flex flex-col">
    <!--Sidebar-->
    <Sidebar/>
    <!-- Page content -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <slot />
    </main>

  </div>
</template>

<script setup lang="ts">
// nothing special required
</script>
