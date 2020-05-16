<template>
  <v-data-table :headers="pHeaders" :items="players" item-key="steamid" class="elevation-0" hide-default-footer :options="{ sortBy: ['kills'], sortDesc: [true] }" dense disable-sort  @click:row="playerClick">
    <template v-slot:top>
      <v-toolbar flat dense>
        <v-toolbar-title style="width: 100%;">{{ name }}</v-toolbar-title>
        <div class="flex-grow-1"></div>
      </v-toolbar>
    </template>
    <template v-slot:item.image="{ item }">
      <div class="p-2">
        <v-avatar size="18"><v-img :src="profiles[item.steamid].avatarfull" :alt="item.name"></v-img></v-avatar>
      </div>
    </template>
    <template v-slot:item.assists="{ item }">
      {{ item.assists }} ({{ item.assists_flash }})
    </template>
    <template v-slot:item.adr="{ item }">
      {{ Math.round(item.damage/item.rounds*100)/100 }}
    </template>
    <template v-slot:item.rws="{ item }">
      {{ Math.round(item.rws/item.rounds*100)/100 }}
    </template>
    <template v-slot:item.rating="{ item }">
      {{ Math.round(item.rating*100)/100 }}
    </template>
    <template v-slot:item.hs_percent="{ item }">
      {{ Math.round(item.hs_percent*100)/100 }}
    </template>
  </v-data-table>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      versions: process.versions,
      platform: require('os').platform(),
      pHeaders: [
        { text: '', value: 'image', sortable: false, width: '1px'},
        { text: 'Name', value: 'name' },
        { text: 'Kills', value: 'kills' },
        { text: 'Deaths', value: 'deaths' },
        { text: 'Assists (FA)', value: 'assists' },
        { text: 'HS %', value: 'hs_percent' },
        { text: 'ADR', value: 'adr' },
        { text: 'RWS', value: 'rws' },
        { text: 'Rating', value: 'rating' },
      ],
    }
  },

  methods: {
    playerClick (data) {
      this.$router.push({ path: '/players/'+data.steamid })
    },
  },

  props: ['players', 'name', 'profiles'],
})
</script>

<style></style>
