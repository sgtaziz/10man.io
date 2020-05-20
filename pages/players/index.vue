<template>
  <v-container class="text-center">
    <h1 class="display-1 font-weight-bold mb-3">
      Players
    </h1>

    <template>
      <v-card>
        <v-card-title>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table class="text-left" :headers="headers" :items="players" :search="search" :fixed-header="true" @click:row="playerClick" :options="{ sortBy: ['rating'], sortDesc: [true] }">
          <template v-slot:item.image="{ item }">
            <div class="p-2">
              <v-avatar size="32"><v-img :src="profiles[item.steamid].avatarfull" :alt="item.name"></v-img></v-avatar>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </v-container>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import BigNumber from "bignumber.js"

export default {
  name: 'Players',
  middleware: 'auth',
  head() {
    return {
      title: 'Players'
    }
  },
  data: () => ({
    search: '',
    headers: [
      { text: '', value: 'image', sortable: false, width: '1px'},
      { text: 'Name', value: 'name' },
      { text: 'Rating', value: 'rating', width: 85 },
      { text: 'RWS', value: 'rws', width: 80 },
      { text: 'Score', value: 'score', width: 85 },
      { text: 'ADR', value: 'adr', width: 80 },
      { text: 'KDR', value: 'kdr', width: 80 },
      { text: 'HS%', value: 'hs', width: 80 },
      { text: 'Wins', value: 'won', width: 80 },
    ],
  }),

  methods: {
    to64 (steamid32) {
      const steamidParts = steamid32.split(':')
      return (new BigNumber(steamidParts[2])).times(2).plus(new BigNumber('76561197960265728')).plus(new BigNumber(steamidParts[1])).toString()
    },
    playerClick (data) {
      this.$router.push({ path: '/players/'+data.steamid })
    }
  },

  async asyncData({ app }) {
    const { data } = await axios.get(process.env.API_ENDPOINT+"overview")

    const ids = []
    const players = []
    let profiles = []
    const promises = []

    for (let i = 0; i < data.length; i++) {
      const player = data[i]
      const steamidParts = player.steam.split(':')

      player.steamid = (new BigNumber(steamidParts[2])).times(2).plus(new BigNumber('76561197960265728')).plus(new BigNumber(steamidParts[1])).toString()
      ids.push(player.steamid)

      promises.push(axios.get(process.env.API_DEMOS_ENDPOINT+"player/"+player.steamid+"/stats"))
      players.push(player)
    }

    promises.push(axios.get(process.env.API_DEMOS_ENDPOINT+"steamids/info?steamids="+ids.join(',')))

    const results = await Promise.all(promises)

    results.forEach(res => {
      if (res.config.url.split('/')[4] == "steamids") {
        profiles = res.data
      } else {
        const index = players.findIndex(x => x.steamid == res.config.url.split('/')[5])

        if (index > -1) {
          players[index].rating = Math.round(res.data.rating * 100)/100 || 0
          players[index].rws = Math.round(res.data.rws/res.data.rounds * 100)/100 || 0
          players[index].hs = Math.round(res.data.hs_percent * 100)/100 || 0
          players[index].adr = Math.round(res.data.damage/res.data.rounds * 100)/100 || 0
          players[index].kdr = Math.round(res.data.kills/res.data.deaths * 100)/100 || 0
          players[index].won = res.data.won
        }
      }
    })
    console.log(profiles)
    return { players, profiles }
  },
}
</script>

<style>
.v-data-table tbody tr {
  cursor: pointer;
}
</style>
