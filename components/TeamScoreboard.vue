<template>
  <v-data-table :headers="pHeaders" :items="players" item-key="steamid" class="elevation-0" hide-default-footer disable-sort dense  @click:row="playerClick">
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
    <template v-slot:item.3k="{ item }">
      {{ item.rounds_with_kills['3'] }}
    </template>
    <template v-slot:item.4k="{ item }">
      {{ item.rounds_with_kills['4'] }}
    </template>
    <template v-slot:item.5k="{ item }">
      {{ item.rounds_with_kills['5'] }}
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
        { text: '', value: 'image', width: 1},
        { text: 'Name', value: 'name' },
        { text: 'Kills', value: 'kills', width: 45 },
        { text: 'Deaths', value: 'deaths', width: 45 },
        { text: 'Assists', value: 'assists', width: 45 },
        { text: 'HS%', value: 'hs_percent', width: 45 },
        { text: 'ADR', value: 'adr', width: 45 },
        { text: 'RWS', value: 'rws', width: 45 },
        { text: 'Rating', value: 'rating', width: 80 },
        { text: '3k', value: '3k', width: 40 },
        { text: '4k', value: '4k', width: 40 },
        { text: '5k', value: '5k', width: 40 },
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
