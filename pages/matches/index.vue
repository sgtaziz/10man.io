<template>
  <v-container class="text-center">
    <h1 class="display-1 font-weight-bold mb-3">
      Matches
    </h1>

    <template>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" sm="9" md="9" lg="10">
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details style="margin: 0;padding: 0;" class="body-2 font-regular"></v-text-field>
            </v-col>
            <v-dialog v-model="createMatchDialog" max-width="600px">
              <template v-slot:activator="{ on }">
                <v-col cols="12" sm="3" md="3" lg="2">
                  <v-btn color="primary" style="width: 100%" v-on="on" outlined :loading="loading">New Match</v-btn>
                </v-col>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Create Match</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="7">
                        <v-text-field v-model="matchName" label="Match Name *" :rules="[v => !!v || 'Match Name is required']" required></v-text-field>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field v-model="password" label="Password" type="password"></v-text-field>
                      </v-col>
                      <v-col cols="12" v-if="gameType == 'csgo'">
                        <v-overflow-btn v-model="serverLocation" :items="availableLocations" persistent-hint hint="Server location *" dense :rules="[v => !!v || 'Location is required']" required></v-overflow-btn>
                      </v-col>
                      <v-col cols="6">
                        <v-slider v-model="playersPerTeam" thumb-size="24" thumb-label="always" min="1" max="5" label="Team Size" height="70px"></v-slider>
                      </v-col>
                      <v-col cols="6">
                        <v-overflow-btn v-model="gameType" :items="['csgo', 'valorant']" persistent-hint hint="Game" dense></v-overflow-btn>
                      </v-col>
                      <v-col cols="12">
                        <v-slider v-model="timeToReady" thumb-size="24" thumb-label="always" min="5" max="60" label="Ready Time Limit"></v-slider>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary darken-1" text @click="createMatchDialog = false">Close</v-btn>
                  <v-btn color="primary darken-1" text @click="createMatch" :disabled="matchName == '' || (serverLocation == '' && gameType == 'csgo')" :loading="creatingMatch">Create</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-card-title>
        <v-data-table class="text-left" :headers="headers" :items="matches" :search="search" :loading="loading" :fixed-header="true" @click:row="joinMatch">
          <template v-slot:item.password="{ item }">
            <v-icon :color="item.password ? 'red' : 'green'">{{ item.password ? 'mdi-lock' : 'mdi-lock-open-variant' }}</v-icon>
          </template>
          <template v-slot:item.players="{ item }">
            {{ item.players.length }}/{{ item.playersPerTeam * 2}}
          </template>
          <template v-slot:item.state="{ item }">
            <template v-if="item.state == 'queuing'">
              Waiting on players
            </template>
            <template v-else-if="item.state == 'pickPlayers'">
              Picking teams
            </template>
            <template v-else-if="item.state == 'mapVeto'">
              Vetoing maps
            </template>
            <template v-else-if="item.state == 'settingServer'">
              Spawning server
            </template>
            <template v-else-if="item.state == 'joinServer'">
              Joining server
            </template>
            <template v-else-if="item.state == 'knife'">
              Knifing for sides
            </template>
            <template v-else-if="item.state == 'live'">
              LIVE | {{ item.lastQueueInfo.score1 }} - {{ item.lastQueueInfo.score2 }}
            </template>
            <template v-else>
              Unknown state "{{ item.state }}"
            </template>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="joinMatchDialog" max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Join Match - {{ matchToJoin.name }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="passwordInput" label="Password" type="password" :error-messages="passError ? 'Unable to join match with given data.' : ''" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary darken-1" text @click="joinMatchDialog = false;passError = false">Close</v-btn>
            <v-btn color="primary darken-1" text @click="joinMatchPass" :disabled="passwordInput == ''" :loading="joinDisabled">Join</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script>
import axios from 'axios'
import { parse, stringify } from 'flatted'

export default {
  name: 'Matches',
  middleware: 'auth',
  head() {
    return {
      title: 'Matches'
    }
  },
  data: () => ({
    loading: true,
    createMatchDialog: false,
    creatingMatch: false,
    joinMatchDialog: false,
    joinDisabled: false,
    passError: false,
    search: '',
    matchName: '',
    password: '',
    passwordInput: '',
    gameType: 'csgo',
    serverLocation: '',
    availableLocations: [],
    playersPerTeam: 5,
    matches: [],
    matchToJoin: {},
    timeToReady: 25,
    headers: [
      { text: 'ID', value: 'id', width: 40, sortable: false },
      { text: 'Name', value: 'name' },
      { text: 'Status', value: 'state', width: 187 },
      { text: 'Owner', value: 'owner.steam.personaname', width: 180 },
      { text: 'Location', value: 'location', width: 187 },
      { text: 'Game', value: 'gameType', width: 90 },
      { text: 'Pass', value: 'password', width: 80 },
      { text: 'Players', value: 'players', width: 95 },
    ],
    player: { },
  }),

  computed: {
    user () {
      return this.$store.state.user
    },
  },

  methods: {
    createMatch (steamid32) {
      if (this.creatingMatch) return

      let tempPlayer = { ...this.player }
      delete tempPlayer.match

      this.$socket.emit('createMatch', {
        name: this.matchName,
        player: tempPlayer,
        timeToReady: this.timeToReady,
        pass: this.password,
        gameType: this.gameType,
        playersPerTeam: this.playersPerTeam,
        serverLocation: this.serverLocation
      })

      this.creatingMatch = true
    },

    joinMatch (match) {
      if (this.joinDisabled) return

      if (match.password) {
        this.matchToJoin = match
        this.joinMatchDialog = true
      } else {
        this.joinDisabled = true
        this.$socket.emit('joinMatch', stringify({ match: match }))
      }
    },

    joinMatchPass () {
      if (this.joinDisabled) return

      let match = this.matchToJoin
      this.$socket.emit('joinMatch', stringify({ match: match, password: this.passwordInput }))
    },
  },

  beforeMount () {
    this.$socket.emit('initPlayer', this.user)
    this.$socket.emit('getLocations', this.user)
  },

  sockets: {
    connect () {
      this.$socket.emit('initPlayer', this.user)
      this.$socket.emit('getLocations', this.user)
    },
    matchData (data) {
      data = parse(data)
      this.matches = data
      this.loading = false
    },
    getPlayer (player) {
      player = parse(player)
      this.player = player

      if (this.player.queued && this.player.match.id) {
        this.$router.push({ path: '/matches/'+this.player.match.id })
      }
    },
    matchJoined (mid) {
      this.$router.push({ path: '/matches/'+mid })
      this.joinDisabled = false
    },
    matchJoinFailed () {
      this.joinDisabled = false
      this.passError = true
    },
    locationData (data) {
      this.availableLocations = data
    },
  },
}
</script>

<style>
.v-data-table tr {
  cursor: pointer;
}
</style>
