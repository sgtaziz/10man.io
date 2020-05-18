<template>
  <v-container class="text-center">
    <v-row>
      <v-col cols="12">
        <v-img :src="require('@/assets/csgo' + (this.$vuetify.theme.dark ? '-dark' : '') + '.png')" class="my-3" contain height="200" />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to 10man.io
        </h1>

        <p class="subheading font-weight-regular" v-if="!user.steamid">
          Please login to continue
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  head() {
    return {
      title: 'Home'
    }
  },
  components: {
  },
  computed: {
    user () {
      return this.$store.state.user
    },
  },
}
</script>
