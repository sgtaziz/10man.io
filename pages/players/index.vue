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
        <v-data-table :headers="headers" :items="players" :search="search" :loading="loading" :fixed-header="true" @click:row="playerClick" :options="{ sortBy: ['rating'], sortDesc: [true] }">
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
      { text: 'Score', value: 'score' },
      { text: 'RWS', value: 'rws' },
      { text: 'Rating', value: 'rating' },
      { text: 'ADR', value: 'adr' },
      { text: 'KDR', value: 'kdr' },
      { text: 'HS%', value: 'hs' },
      { text: 'Wins', value: 'won' },
    ],
    players: [],
    loading: true,
    promises: [],
    profiles: [],
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

  beforeMount () {
    const tempPlayers = []

    axios.get(process.env.API_ENDPOINT+"overview").then(res => {
      const ids = []

      for (let i = 0; i < res.data.length; i++) {
        const data = res.data[i]

        data.steamid = this.to64(data.steam)
        ids.push(data.steamid)

        this.promises.push(axios.get(process.env.API_DEMOS_ENDPOINT+"player/"+data.steamid+"/stats"))
        tempPlayers.push(data)
      }

      this.promises.push(axios.get(process.env.API_DEMOS_ENDPOINT+"steamids/info?steamids="+ids.join(',')))

      Promise.all(this.promises).then(results => {
        results.forEach(res => {
          if (res.config.url.split('/')[4] == "steamids") {
            for (const steamid in res.data) {
              this.profiles[steamid] = res.data[steamid]
            }
          } else {
            const index = tempPlayers.findIndex(x => x.steamid == res.config.url.split('/')[5])

            if (index > -1) {
              tempPlayers[index].rating = Math.round(res.data.rating * 100)/100 || 0
              tempPlayers[index].rws = Math.round(res.data.rws/res.data.rounds * 100)/100 || 0
              tempPlayers[index].hs = Math.round(res.data.hs_percent * 100)/100 || 0
              tempPlayers[index].adr = Math.round(res.data.damage/res.data.rounds * 100)/100 || 0
              tempPlayers[index].kdr = Math.round(res.data.kills/res.data.deaths * 100)/100 || 0
              tempPlayers[index].won = res.data.won
            }
          }
        })

        this.players = tempPlayers
        this.loading = false
      })
    })
  },
}
</script>

<style>
.v-data-table tr {
  cursor: pointer;
}
</style>
