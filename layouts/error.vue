<template>
  <v-container class="text-center">
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          {{ error.message }}
        </h1>
        <NuxtLink to="/">
          Home
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    },
  },

  head() {
    const title = this.error.message
    return {
      title
    }
  }
}
</script>
