<template>
  <v-container class="text-center" v-if="stats">

    <h1 class="display-1 font-weight-bold mb-3" v-if="user">
      <v-avatar size="64"><img :src="user.avatarfull" class="my-3" /></v-avatar> <span style="margin-top: -20px;">{{ user.personaname }}</span>
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

    <v-data-table :headers="headers" :items="demoStats" item-key="demoid" @click:row="expandRow" show-expand single-expand :expanded.sync="expanded" :options="{ sortBy: ['timestamp'], sortDesc: [true] }" class="elevation-5 text-left" disable-sort>
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
      title: this.user.personaname
    }
  },

  components: {
    TeamScoreboard
  },

  data: () => ({
    expanded: [],
    headers: [
      { text: 'Date', value: 'timestamp', width: 240 },
      { text: 'Map', value: 'map', width: 140 },
      { text: 'Score', value: 'score' },
      { text: 'Kills', value: 'kills', width: 50 },
      { text: 'Deaths', value: 'deaths', width: 50 },
      { text: 'Assists (FA)', value: 'assists', width: 100 },
      { text: 'ADR', value: 'adr', width: 80 },
      { text: 'Demo', value: 'demo', width: 80 },
    ],
  }),

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
      window.location.href = process.env.DEMOS_DL_ENDPOINT + demoid
    },
  },

  async asyncData({ params, error }) {
    let steamIDs = []
    let promises = []
    let profiles = []
    let user = {}

    let { data } = await axios.get(process.env.API_DEMOS_ENDPOINT+"player/"+params.id+"/stats")
    let stats = data
    let statItems = [
      {
        win: Math.round(stats.won/(stats.won+stats.lost) * 100 * 100)/100,
        won: stats.won,
        tied: stats.tied,
        lost: stats.lost,
        total: stats.won+stats.lost
      },
      {
        kdr: Math.round(stats.kills/stats.deaths * 100)/100,
        hs: Math.round(stats.hs_percent * 100)/100,
        rating: Math.round(stats.rating * 100)/100,
        rws: Math.round(stats.rws/stats.rounds * 100)/100,
        clutch: (Math.round((stats['1v1_won']/stats['1v1_attempted']) * 100 * 100)/100) | 0
      },
      {
        adr: Math.round(stats.damage/stats.rounds * 100)/100,
        kpr: Math.round(stats.kills/stats.rounds * 100)/100,
        dpr: Math.round(stats.deaths/stats.rounds * 100)/100,
        apr: Math.round(stats.assists/stats.rounds * 100)/100,
        ekpr: Math.round(stats.entry_kills/stats.rounds * 100)/100,
      },
      {
        threek: stats.rounds_with_kills[3],
        fourk: stats.rounds_with_kills[4],
        fivek: stats.rounds_with_kills[5],
        entrywin: Math.round(stats.entry_kills/stats.entry_kills_attempted * 100 * 100)/100,
        openkills: Math.round(stats.open_kills/stats.open_kills_attempted * 100 * 100)/100
      }
    ]

    let res = await axios.get(process.env.API_DEMOS_ENDPOINT+"steamids/info?steamids="+params.id)
    profiles[params.id] = res.data[params.id]
    user = res.data[params.id]
    if (!user.personaname) return error({ statusCode: 404, message: 'Player not found' })

    res = await axios.get(process.env.API_DEMOS_ENDPOINT+"player/"+params.id+"/demos?offset=0")
    let demos = res.data.demos

    for (let i = 0; i < demos.length; i++) {
      promises.push(axios.get(process.env.API_DEMOS_ENDPOINT+"demo/"+demos[i].demoid+"/stats"))
    }

    const demoStats = []
    const playerTeam = []
    const matchStats = []

    const results = await Promise.all(promises)
    results.forEach(res => {
      let demoStat = res.data
      demoStats.push(demoStat)

      for (let ii = 0; ii < demoStat.teams['2'].length; ii++) {
        if (demoStat.teams['2'][ii].steamid == user.steamid) {
          matchStats[demoStat.demoid] = demoStat.teams['2'][ii]
          playerTeam[demoStat.demoid] = 2
        }
        steamIDs.push(demoStat.teams['2'][ii].steamid)
      }

      for (let ii = 0; ii < demoStat.teams['3'].length; ii++) {
        if (demoStat.teams['3'][ii].steamid == user.steamid) {
          matchStats[demoStat.demoid] = demoStat.teams['3'][ii]
          playerTeam[demoStat.demoid] = 3
        }
        steamIDs.push(demoStat.teams['3'][ii].steamid)
      }

      demoStat.teams['2'].sort((a, b) => (a.kills > b.kills) ? -1 : 1)
      demoStat.teams['3'].sort((a, b) => (a.kills > b.kills) ? -1 : 1)
    })

    demoStats.sort((a, b) => (a.timestmap > b.timestmap) ? -1 : 1)
    const distinctSteamIDs = [...new Set(steamIDs)]

    for (let i = 0; i < distinctSteamIDs.length; i++) {
      let steamid = distinctSteamIDs[i]
      if (profiles[steamid]) {
        distinctSteamIDs.splice(i, 1)
      }
    }

    res = await axios.get(process.env.API_DEMOS_ENDPOINT+"steamids/info?steamids="+distinctSteamIDs.join(','))
    for (const steamid in res.data) {
      profiles[steamid] = res.data[steamid]
    }

    return { profiles, user, stats, statItems, demos, demoStats, matchStats, playerTeam }
  },
}
</script>

<style>
.v-data-table tbody tr {
  cursor: pointer;
}
</style>
