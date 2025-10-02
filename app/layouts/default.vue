<template>
  <div class="max-h-screen h-full d-flex flex-row">
    <!--Sidebar-->
    <Sidebar/>

    <!-- Page content -->
    <div class="w-75">
      <slot />
    </div>

  </div>
</template>

<script setup lang="ts">
// nothing special required
</script>
