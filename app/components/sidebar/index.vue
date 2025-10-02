<script setup lang="ts">
const items = [
  {
    title: 'Item #1',
    value: 1,
  },
  {
    title: 'Item #2',
    value: 2,
  },
  {
    title: 'Item #3',
    value: 3,
  },
]

const menuItems = [
  {
    title: 'Question',
    link: '/question',
    icon: 'mdi-help'
  },
  {
    title: 'Survey',
    link: '/survey',
    icon: 'mdi-information'
  },
  {
    title: 'Answer',
    link: '/answer',
    icon: 'mdi-check'
  },
  {
    title: 'Session Answer',
    link: '/session-answer',
    icon: 'mdi-timelapse'
  },
]

</script>

<template>
  <div class="w-25 h-screen bg-teal-lighten-5 mx-auto pa-3 d-flex flex-column justify-space-between">
    <div>
      <Logo/>

      <v-card class="mx-auto mt-4 mb-4" color="teal-darken-1">
        <v-list nav dense>
          <v-list-item
              v-for="item in menuItems"
              :key="item.link"
              :to="item.link"
              link
              rounded
          >
            <v-list-item-content class="d-flex flex-row ga-2 align-center">
              <v-icon :size="24">{{ item.icon }}</v-icon>
              <v-list-item-title class="text-subtitle-1	">{{ item.title }}</v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </v-list>
      </v-card>
    </div>


    <v-btn
        class="ma-2"
        color="teal-darken-4"
    >
      <v-icon
          icon="mdi-logout"
          start
      ></v-icon>
      Log out
    </v-btn>

  </div>

</template>

<style scoped>

</style>