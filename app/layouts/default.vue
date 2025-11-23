<script setup lang="ts">
// nothing special required
import { computed, watch, ref  } from 'vue'
import {useSnackbar} from "~/composable/useSnackBar";

const route = useRoute()            // reactive route object
const { show, text, color } = useSnackbar()


/** Pretty print a slug -> Title Case */
function prettify(slug: string) {
  const decoded = decodeURIComponent(slug)
  return decoded
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .map(s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '')
      .join(' ')
}

const crumbs = computed(() => {
  // skip empty parts
  const parts = route.path.split('/').filter(Boolean) // e.g. ['question','create']
  return parts.map((part, idx) => {
    const href = '/' + parts.slice(0, idx + 1).join('/')
    const label = prettify(part)

    // optional: treat numeric segments as IDs (display as #id)
    const finalLabel = /^\d+$/.test(part) ? `#${part}` : label

    return { href, label: finalLabel }
  })
})


</script>

<template>
  <div class="max-h-screen h-full d-flex flex-row">
    <!--Sidebar-->
    <Sidebar/>

    <!-- Page content -->
    <div class="w-75 pa-10">
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item :href="'/'" :disabled="true">
          <NuxtLink to="#" class="text-h6 text-grey-darken-4 text-decoration-none">
            <v-icon
                icon="mdi-home"
                size="24"
                start
            ></v-icon>

            {{' '}}
            <span>/</span>
          </NuxtLink>

        </v-breadcrumbs-item>
        <v-breadcrumbs-item
            v-for="(c, i) in crumbs"
            :key="c.href"
            :href="c.href"
            :disabled="i === crumbs.length - 1"
            :text="c.label"
        >
          <NuxtLink :to="c.href" class="text-h6 text-grey-darken-4 text-decoration-none">
            {{ c.label }}
            {{' '}}
            <span>/</span>
          </NuxtLink>

        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-snackbar v-model="show" :color="color" timeout="3000">
        {{ text }}
      </v-snackbar>

      <slot />
    </div>

  </div>
</template>