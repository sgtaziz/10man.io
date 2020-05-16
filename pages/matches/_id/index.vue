<template>
  <v-container class="text-center">

    <h1 class="display-1 font-weight-bold mb-3">
      {{ !loading ? `Match #${$route.params.id}` : 'Loading...' }}
    </h1>

    <v-row v-if="!loading">
      <v-col cols="12" sm="4" md="4" lg="4">
        <v-card>

          <v-card-title class="subheading font-weight-bold">
            <v-edit-dialog :return-value.sync="teamnames[0]" v-if="isCapt1 && queueInfo.event != 'settingServer' && queueInfo.event != 'joinServer'" @save="setTeamName(0)">
              {{ teamnames[0] }}
              <template v-slot:input>
                <v-text-field v-model="teamnames[0]" :rules="[max16chars]" label="Edit" single-line counter autofocus></v-text-field>
              </template>
            </v-edit-dialog>
            <template v-else>{{ teamnames[0] }}</template>
          </v-card-title>
          <v-card-subtitle class="text-left">Captain: {{ capts['c0'] ? capts['c0'].steam.personaname : 'No captain' }}</v-card-subtitle>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-item v-for="player in team1" :key="player.id">
              <v-list-item-avatar size="28" style="margin-right: 10px;">
                <v-img :src="player.steam.avatarfull"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="text-left">
                  {{ player.steam.personaname }}
                  <span v-if="stats[player.id]" class="float-right overline">
                    Rating: {{ Math.round(stats[player.id].rating * 100)/100 }}
                  </span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-btn :color="isCapt1 ? 'red' : 'primary'" text v-on:click="setCapt('c0', isCapt1)" :disabled="isCapt2 || (capts.c0 && !isCapt1) || queueInfo.event || !inQueue">
              {{ isCapt1 ? "Give Up Captain" : "Captain" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>


      <v-col cols="12" sm="4" md="4" lg="4">
        <v-card>
          <v-card-title class="subheading font-weight-bold" v-if="queueInfo.event == 'pickPlayers'">Picking Teams</v-card-title>
          <v-card-title class="subheading font-weight-bold" v-else-if="queueInfo.event == 'mapVeto'">Vetoing Maps</v-card-title>
          <v-card-title class="subheading font-weight-bold" v-else-if="queueInfo.event == 'settingServer'">Spawning Server</v-card-title>
          <v-card-title class="subheading font-weight-bold" v-else-if="queueInfo.event == 'joinServer'">Join Server</v-card-title>
          <v-card-title class="subheading font-weight-bold" v-else-if="queueInfo.event == 'live'">LIVE {{ queueInfo.score1 }}-{{ queueInfo.score2 }}</v-card-title>
          <v-card-title class="subheading font-weight-bold" v-else>{{ inQueue ? "In Queue" : "Queue" }}</v-card-title>

          <v-card-subtitle class="text-left" v-if="queue.length < 10 && !queueInfo.event">+{{ 10 - queue.length }}</v-card-subtitle>
          <v-card-subtitle class="text-left" v-else-if="!capts.c0 || !capts.c1">Waiting on captains...</v-card-subtitle>
          <v-card-subtitle class="text-left" v-else-if="queueInfo.event == 'pickPlayers' && pickPos < 8">Waiting on {{ capts['c'+queueInfo.order[pickPos]].steam.personaname }}...</v-card-subtitle>
          <v-card-subtitle class="text-left" v-else-if="queueInfo.event == 'mapVeto' && queueInfo.maps.length > 1">Waiting on {{ capts['c'+queueInfo.turn].steam.personaname }}...</v-card-subtitle>
          <v-card-subtitle class="text-left" v-else-if="queueInfo.event == 'joinServer'">Server ready - {{ queueInfo.map }}</v-card-subtitle>
          <v-card-subtitle class="text-left" v-else-if="queueInfo.event == 'live'">Waiting on match to end...</v-card-subtitle>
          <v-card-subtitle class="text-left" v-else>Waiting on response from server...</v-card-subtitle>

          <v-divider></v-divider>

          <v-list v-if="queueInfo.event != 'mapVeto' && queueInfo.event != 'settingServer' && queueInfo.event != 'joinServer' && queueInfo.event != 'live'" dense>
            <v-list-item v-for="player in players" :key="player.id" @click="addTeam(player)" :inactive="queueInfo.event != 'pickPlayers' || capts['c'+queueInfo.order[pickPos]].id != player.id">
              <v-list-item-avatar size="28" style="margin-right: 10px;">
                <v-img :src="player.steam.avatarfull"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="text-left">
                  {{ player.steam.personaname }}
                  <span v-if="stats[player.id]" class="float-right overline">
                    Rating: {{ Math.round(stats[player.id].rating * 100)/100 }}
                  </span>
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon v-if="queueInfo.event == 'pickPlayers' && capts['c'+queueInfo.order[pickPos]].id == player.id">
                <v-icon color="primary">mdi-account-check</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
          <v-list v-else-if="queueInfo.event == 'mapVeto'" dense>
            <v-list-item v-for="map in queueInfo.maps" :key="map" @click="vetoMap(map)" :inactive="capts['c'+queueInfo.turn].id != player.id">
              <v-list-item-content>
                <v-list-item-title class="text-left" v-text="map"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon v-if="capts['c'+queueInfo.turn].id == player.id">
                <v-icon color="red">mdi-cancel</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
          <v-card-text v-else-if="queueInfo.event == 'joinServer'">
            <v-btn color="red" raised :href="'steam://connect/'+queueInfo.ip+'/'+queueInfo.password">Join Server</v-btn>
          </v-card-text>
          <v-card-text v-else>
            <v-progress-circular :size="70" :width="7" :color="queueInfo.event == 'joinServer' ? 'primary' : 'red'" indeterminate></v-progress-circular>
          </v-card-text>

          <v-card-text v-if="queueInfo.event == 'joinServer'">
            <v-text-field class="caption" :append-icon="showIP ? 'mdi-eye' : 'mdi-eye-off'" :type="showIP ? 'text' : 'password'" @click:append="showIP = !showIP" readonly outlined dense filled :value="queueInfo.connect">
            </v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn :color="inQueue ? 'red' : 'primary'" text v-on:click="joinQueue(inQueue)" :disabled="queueInfo.event">{{ inQueue ? 'Leave' : 'Join' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4" md="4" lg="4">
        <v-card>
          <v-card-title class="subheading font-weight-bold">
            <v-edit-dialog :return-value.sync="teamnames[1]" v-if="isCapt2 && queueInfo.event != 'settingServer' && queueInfo.event != 'joinServer'" @save="setTeamName(1)">
              {{ teamnames[1] }}
              <template v-slot:input>
                <v-text-field v-model="teamnames[1]" :rules="[max16chars]" label="Edit" single-line counter autofocus></v-text-field>
              </template>
            </v-edit-dialog>
            <template v-else>{{ teamnames[1] }}</template>
          </v-card-title>
          <v-card-subtitle class="text-left">Captain: {{ capts['c1'] ? capts['c1'].steam.personaname : 'No captain' }}</v-card-subtitle>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-item v-for="player in team2" :key="player.id">
              <v-list-item-avatar size="28" style="margin-right: 10px;">
                <v-img :src="player.steam.avatarfull"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="text-left">
                  {{ player.steam.personaname }}
                  <span v-if="stats[player.id]" class="float-right overline">
                    Rating: {{ Math.round(stats[player.id].rating * 100)/100 }}
                  </span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-btn :color="isCapt2 ? 'red' : 'primary'" text v-on:click="setCapt('c1', isCapt2)" :disabled="isCapt1 || (capts.c1 && !isCapt2) || queueInfo.event || !inQueue">
              {{ isCapt2 ? "Give Up Captain" : "Captain" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import { parse, stringify } from 'flatted'

export default {
  name: 'Queue',
  middleware: 'auth',
  head() {
    return {
      title: 'Match #'+this.$route.params.id
    }
  },
  data: () => ({
    queue: [],
    team1: [],
    team2: [],
    capts: [],
    queueInfo: [],
    maps: [],
    stats: [],
    teamnames: [],
    showIP: false,
    loading: true,
    player: {},
    max16chars: v => v.length <= 16 || 'Input too long!',
  }),

  computed: {
    user () {
      return this.$store.state.user
    },
    inQueue () {
      return this.queue.findIndex(x => x.id == this.player.id) > -1
    },
    isCapt1 () {
      return this.capts['c0'] && this.capts['c0'].id == this.player.id
    },
    isCapt2 () {
      return this.capts['c1'] && this.capts['c1'].id == this.player.id
    },
    pickPos () {
      return (this.team1.length + this.team2.length) - 2
    },
    players () {
      return this.queueInfo.event && this.queueInfo.event == 'pickPlayers' ? this.queueInfo.players : this.queue
    }
  },

  beforeMount () {
    this.$socket.emit('initPlayer', this.user)
  },

  sockets: {
    connect () {
      this.$socket.emit('initPlayer', this.user)
    },

    getPlayer (player) {
      player = parse(player)
      this.player = player

      if (this.player.match.id != this.$route.params.id) {
        this.$router.push({ path: '/matches' })
        return
      }

      this.emit('requestData', stringify(player))
    },

    queueData (data) {
      this.queue = parse(data)

      this.queue.forEach((player) => {
        if (!this.stats[player.id]) {
          axios.get(process.env.API_DEMOS_ENDPOINT+"player/"+player.id+"/stats").then(res => {
            this.stats[player.id] = res.data
            this.stats.push()
          })
        }
      })

      this.loading = false
    },

    team1Data (data) {
      data = parse(data)
      this.team1 = data

      this.team1.forEach((player) => {
        if (!this.stats[player.id]) {
          axios.get(process.env.API_DEMOS_ENDPOINT+"player/"+player.id+"/stats").then(res => {
            this.stats[player.id] = res.data
            this.stats.push()
          })
        }
      })
    },

    team2Data (data) {
      data = parse(data)
      this.team2 = data

      this.team2.forEach((player) => {
        if (!this.stats[player.id]) {
          axios.get(process.env.API_DEMOS_ENDPOINT+"player/"+player.id+"/stats").then(res => {
            this.stats[player.id] = res.data
            this.stats.push()
          })
        }
      })
    },

    teamData (data) {
      this.teamnames = data
    },

    captsData (data) {
      data = parse(data)
      this.capts = data
    },

    queueInfo (data) {
      data = parse(data)
      this.queueInfo = data

      if (data.event == 'queueExpired') {
        this.queueInfo = {}
      } else if (data.event == 'mapVeto') {
        this.maps = this.queueInfo.maps
      }
    }
  },

  methods: {
    setTeamName (id) {
      this.emit('setTeamName', { id: id, name: this.teamnames[id] })
    },

    joinQueue (leave) {
      if (leave && this.inQueue) {
        this.emit('leaveQueue', stringify(this.player))
        return
      }

      this.emit('joinQueue', this.player)
    },

    setCapt (data, leave) {
      if (!this.inQueue) return
      if (leave) {
        this.emit('removeCapt', data)
        return
      }

      this.emit('setCapt', stringify({ id: data, player: this.player }))
    },

    addTeam (data) {
      if (this.queueInfo.event == 'pickPlayers' && this.capts['c'+this.queueInfo.order[this.pickPos]].id == this.player.id) {
        const teamNum = this.queueInfo.order[this.pickPos] + 1
        if (this['team'+teamNum].length == 5) return

        this['team'+teamNum].push(data)
        this.emit('addTeam'+teamNum, stringify(data))
      }
    },

    vetoMap (data) {
      if (this.queueInfo.event == 'mapVeto' && this.queueInfo.maps.length > 1 && this.capts['c'+this.queueInfo.turn].id == this.player.id) {
        this.queueInfo.turn = 1 - this.queueInfo.turn
        this.emit('vetoMap', data)
      }
    },

    emit (channel, data) {
      this.$socket.emit('match-'+this.$route.params.id+'-'+channel, data)
    },
  },
}
</script>
