<template>
  <v-container class="text-center">
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          {{ errors[error.statusCode] ? errors[error.statusCode] : otherError }}
        </h1>
        <NuxtLink to="/">
          Home page
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
    }
  },
  data() {
    return {
      otherError: 'An error occurred',
      errors: {
        '404': '404 Not Found',
        '403': 'You must be logged in to be here'
      }
    }
  },
  head() {
    const title =
      this.errors[this.error.statusCode] ? this.errors[this.error.statusCode] : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
