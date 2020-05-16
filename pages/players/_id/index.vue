<template>
  <v-container class="text-center" v-if="stats">

    <h1 class="display-1 font-weight-bold mb-3" v-if="profiles[$route.params.id]">
      <v-avatar size="64"><img :src="profiles[$route.params.id].avatarfull" class="my-3" /></v-avatar> <span style="margin-top: -20px;">{{ profiles[$route.params.id].personaname }}</span>
    </h1>

    <v-data-iterator :items="statItems" hide-default-footer v-if="stats">
      <v-row>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card>
            <v-list dense>
              <v-list-item>
                <v-list-item-content class="font-weight-bold">Win %</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[0].win }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">Won</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[0].won }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">Tied</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[0].tied }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">Lost</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[0].lost }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">Total</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[0].total }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card>
            <v-list dense>
              <v-list-item>
                <v-list-item-content class="font-weight-bold">KDR</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[1].kdr }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">HS %</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[1].hs }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">Rating</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[1].rating }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">RWS</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[1].rws }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">Clutch %</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[1].clutch }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card>
            <v-list dense>
              <v-list-item>
                <v-list-item-content class="font-weight-bold">ADR</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[2].adr }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">KPR</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[2].kpr }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">DPR</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[2].dpr }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">APR</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[2].apr }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">EKPR</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[2].ekpr }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card>
            <v-list dense>
              <v-list-item>
                <v-list-item-content class="font-weight-bold">3K</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[3].threek }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">4K</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[3].fourk }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">5K</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[3].fivek }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">EK Win %</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[3].entrywin }}</v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content class="font-weight-bold">FD Win %</v-list-item-content>
                <v-list-item-content class="align-end">{{ statItems[3].openkills }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-data-iterator>

    <v-data-table :headers="headers" :items="demoStats" item-key="demoid" @click:row="expandRow" show-expand single-expand :expanded.sync="expanded" :options="{ sortBy: ['timestamp'], sortDesc: [true] }" :loading="loading" class="elevation-5 text-left" disable-sort>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Matches</v-toolbar-title>
          <div class="flex-grow-1"></div>
        </v-toolbar>
      </template>
      <template v-slot:item.timestamp="{ item }">
        {{ new Date(item.timestamp * 1000) | moment("calendar") }}
      </template>
      <template v-slot:item.score="{ item }">
        <v-chip :color="getColor(item)">{{ item.score[0] + '-' + item.score[1] }}</v-chip>
      </template>
      <template v-slot:item.kills="{ item }">
        {{ matchStats[item.demoid].kills }}
      </template>
      <template v-slot:item.deaths="{ item }">
        {{ matchStats[item.demoid].deaths }}
      </template>
      <template v-slot:item.assists="{ item }">
        {{ matchStats[item.demoid].assists }} ({{ matchStats[item.demoid].assists_flash }})
      </template>
      <template v-slot:item.adr="{ item }">
        {{ Math.round(matchStats[item.demoid].damage/matchStats[item.demoid].rounds*100)/100 }}
      </template>
      <template v-slot:item.demo="{ item }">
        <v-icon @click="downloadDemo(item.demoid)">
          mdi-download
        </v-icon>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <TeamScoreboard :players="item.teams['2']" :profiles="profiles" name="Team 1" />
          <TeamScoreboard :players="item.teams['3']" :profiles="profiles" name="Team 2" />
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios'
import TeamScoreboard from '@/components/TeamScoreboard.vue'

export default {
  name: 'Profile',
  middleware: 'auth',
  head() {
    return {
      title: this.profiles[this.$route.params.id] ? this.profiles[this.$route.params.id].personaname : 'Loading...'
    }
  },
  components: {
    TeamScoreboard
  },

  data: () => ({
    stats: null,
    loading: true,
    statItems: [],
    demos: [],
    demoStats: [],
    playerTeam: [],
    profiles: [],
    expanded: [],
    matchStats: [],
    headers: [
      { text: 'Date', value: 'timestamp' },
      { text: 'Map', value: 'map' },
      { text: 'Score', value: 'score' },
      { text: 'Kills', value: 'kills' },
      { text: 'Deaths', value: 'deaths' },
      { text: 'Assists (FA)', value: 'assists' },
      { text: 'ADR', value: 'adr' },
      { text: 'Demo', value: 'demo' },
    ],
    user: {},
  }),

  watch: {
    '$route' () {
      this.stats = null
      this.loading = true
      this.statItems = []
      this.demos = []
      this.demoStats = []
      this.playerTeam = []
      this.expanded = []
      this.matchStats = []
      this.getData()
    },
  },

  methods: {
    expandRow (row) {
      if (this.expanded.includes(row)) {
        this.expanded = []
        return
      }

      this.expanded = []
      this.expanded.push(row)
    },
    getColor (item) {
      if (this.playerTeam[item.demoid] == item.winner) {
        return 'green'
      } else if (item.score[0] == item.score[1]) {
        return 'orange'
      } else {
        return 'red'
      }
    },
    downloadDemo (demoid) {
      window.location.href = 'https://10mandemos.horizonservers.net/demo_download/' + demoid
    },
    getData () {
      let steamIDs = []
      let promises = []

      axios.get("https://10mandemos.horizonservers.net/api/player/"+this.$route.params.id+"/stats").then(res => {
        this.stats = res.data
        this.statItems = [
          {
            win: Math.round(this.stats.won/(this.stats.won+this.stats.lost) * 100 * 100)/100,
            won: this.stats.won,
            tied: this.stats.tied,
            lost: this.stats.lost,
            total: this.stats.won+this.stats.lost
          },
          {
            kdr: Math.round(this.stats.kills/this.stats.deaths * 100)/100,
            hs: Math.round(this.stats.hs_percent * 100)/100,
            rating: Math.round(this.stats.rating * 100)/100,
            rws: Math.round(this.stats.rws/this.stats.rounds * 100)/100,
            clutch: (Math.round((this.stats['1v1_won']/this.stats['1v1_attempted']) * 100 * 100)/100) | 0
          },
          {
            adr: Math.round(this.stats.damage/this.stats.rounds * 100)/100,
            kpr: Math.round(this.stats.kills/this.stats.rounds * 100)/100,
            dpr: Math.round(this.stats.deaths/this.stats.rounds * 100)/100,
            apr: Math.round(this.stats.assists/this.stats.rounds * 100)/100,
            ekpr: Math.round(this.stats.entry_kills/this.stats.rounds * 100)/100,
          },
          {
            threek: this.stats.rounds_with_kills[3],
            fourk: this.stats.rounds_with_kills[4],
            fivek: this.stats.rounds_with_kills[5],
            entrywin: Math.round(this.stats.entry_kills/this.stats.entry_kills_attempted * 100 * 100)/100,
            openkills: Math.round(this.stats.open_kills/this.stats.open_kills_attempted * 100 * 100)/100
          }
        ]
      })

      axios.get("https://10mandemos.horizonservers.net/api/player/"+this.$route.params.id+"/demos?offset=0").then(res => {
        this.demos = res.data.demos

        for (let i = 0; i < this.demos.length; i++) {
          promises.push(axios.get("https://10mandemos.horizonservers.net/api/demo/"+this.demos[i].demoid+"/stats"))
        }

        Promise.all(promises).then(results => {
          results.forEach(res => {
            let demoStats = res.data
            this.demoStats.push(demoStats)
            for (let ii = 0; ii < demoStats.teams['2'].length; ii++) {
              if (demoStats.teams['2'][ii].steamid == this.user.steamid) {
                this.matchStats[demoStats.demoid] = demoStats.teams['2'][ii]
                this.playerTeam[demoStats.demoid] = 2
              }
              steamIDs.push(demoStats.teams['2'][ii].steamid)
            }

            for (let ii = 0; ii < demoStats.teams['3'].length; ii++) {
              if (demoStats.teams['3'][ii].steamid == this.user.steamid) {
                this.matchStats[demoStats.demoid] = demoStats.teams['3'][ii]
                this.playerTeam[demoStats.demoid] = 3
              }
              steamIDs.push(demoStats.teams['3'][ii].steamid)
            }

            demoStats.teams['2'].sort((a, b) => (a.kills > b.kills) ? -1 : 1)
            demoStats.teams['3'].sort((a, b) => (a.kills > b.kills) ? -1 : 1)

            this.matchStats.push({})
          })

          this.demoStats.sort((a, b) => (a.timestmap > b.timestmap) ? -1 : 1)
          let distinctSteamIDs = [...new Set(steamIDs)]

          for (let i = 0; i < distinctSteamIDs.length; i++) {
            let steamid = distinctSteamIDs[i]
            if (this.profiles[steamid]) {
              distinctSteamIDs.splice(i, 1)
            }
          }

          axios.get("https://10mandemos.horizonservers.net/api/steamids/info?steamids="+distinctSteamIDs.join(',')).then(res => {
            for (const steamid in res.data) {
              this.profiles[steamid] = res.data[steamid]
            }

            this.loading = false
          })
        })
      })

      axios.get("https://10mandemos.horizonservers.net/api/steamids/info?steamids="+this.$route.params.id).then(res => {
        this.profiles[this.$route.params.id] = res.data[this.$route.params.id]
        this.profiles.push({})
        this.user = res.data[this.$route.params.id]
      })
    },
  },

  beforeMount () {
    this.getData()
  },
}
</script>
