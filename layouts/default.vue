<template>
  <v-app :dark="darkMode">
    <v-navigation-drawer v-if="user.steamid" app permanent expand-on-hover mini-variant clipped>
      <v-layout column fill-height>
        <v-list dense nav class="py-0">
          <v-list-item two-line class='px-0'>
            <v-list-item-avatar>
              <img :src="user.avatarfull">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.personaname }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.steamid }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-for="item in items" :key="item.title" router :to="item.to" exact v-on:mouseover="hover(item, true)" v-on:mouseleave="hover(item, false)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title v-show="hoverState[item.title]" class="text-right">{{ item.tooltip }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-layout justify-bottom style="position: absolute; bottom: 0; margin-left: 9px;">
            <v-switch v-model="darkMode" label='Dark' dense></v-switch>
        </v-layout>

      </v-layout>
    </v-navigation-drawer>

    <v-app-bar app clipped-left style="height: 64px;">
      <v-toolbar-title>The Good 10 Man</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="user.personaname" v-on:click="logout" text>
        Logout <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn v-else v-on:click="login" text :loading="this.authWindow && !this.authWindow.closed">
        Login <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content style="padding-left: 56px;padding-bottom: 55px;">
      <v-container class="fill-height" fluid align="center" justify="center">
        <transition name="slide-up">
          <!-- <keep-alive> -->
          <nuxt />
          <!-- </keep-alive> -->
        </transition>
      </v-container>
    </v-content>

    <v-dialog v-model="dialog" max-width="350">
      <v-card>
        <v-card-title class="headline">Queue failed</v-card-title>

        <v-card-text>
          These players did not ready up and have been removed from queue:
        </v-card-text>

        <v-list dense>
          <v-list-item v-for="player in queueData.notready" :key="player.id">
            <v-list-item-avatar size="28" style="margin-right: 10px;">
              <v-img :src="player.steam.avatarfull"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="text-left" v-text="player.steam.personaname"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false">
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-bottom-sheet v-model="queueUp" persistent>
      <v-progress-linear :value="timeLeft" color="red"></v-progress-linear>
      <v-sheet class="text-center" height="200px">
        <v-btn class="mt-6" raised color="red" @click="ready" :disabled="isReady">{{ !isReady ? 'Accept' : 'Waiting on others...' }}</v-btn>
        <div class="py-3">A match is ready!</div>
      </v-sheet>
    </v-bottom-sheet>

    <Chat />
  </v-app>
</template>

<script>
  import Chat from '@/components/Chat.vue'
  import { parse, stringify } from 'flatted'
  import axios from 'axios'

  export default {
    components: {
      Chat
    },

    data: () => ({
      authWindow: null,
      queueData: {},
      timeLeft: 100,
      estimatedTime: new Date().getTime(),
      dialog: false,
      audio: null,
      stats: {},
      hoverState: [],
      player: {},
    }),

    computed: {
      user () {
        return this.$store.state.user
      },
      queueUp () {
        return this.$store.state.queueUp && (this.queueData.ready && (this.queueData.ready.findIndex(x => x.id == this.user.steamid) > -1 || this.queueData.notready.findIndex(x => x.id == this.user.steamid) > -1))
      },
      isReady () {
        return this.queueData.ready && this.queueData.ready.findIndex(x => x.id == this.user.steamid) > -1
      },
      darkMode: {
        get () {
          return this.$store.state.darkMode
        },
        set (val) {
          this.$store.dispatch('darkmode', val)
          this.$vuetify.theme.dark = val
        }
      },
      items () {
        return [
          { title: 'Home', icon: 'mdi-home', to: '/' },
          { title: 'Profile', icon: 'mdi-account', to: '/players/'+this.user.steamid, tooltip: 'Rating: ' + Math.round(this.stats.rating*100)/100 },
          { title: 'Players', icon: 'mdi-format-list-numbered', to: '/players' },
          { title: 'Matches', icon: 'mdi-play', to: '/matches' },
        ]
      }
    },

    methods: {
      hover (item, val) {
        this.hoverState[item.title] = val
        this.hoverState.push()
      },
      login: function () {
        window.location.pathname = '/api/login'
      },
      logout: function () {
        window.location.pathname = '/api/logout'
      },
      ready: function () {
        this.$socket.emit(`match-${this.player.match.id}-readyUp`, stringify(this.player))
      },
      getStats: function () {
        axios.get(process.env.API_DEMOS_ENDPOINT+"player/"+this.user.steamid+"/stats").then(res => {
          this.stats = res.data
        })
      },
      initPlayer: function () {
        this.$socket.emit('initPlayer', this.user)
      }
    },

    beforeMount () {
      this.audio = new Audio(process.env.BASE_URL + '/queue.mp3')
      this.$vuetify.theme.dark = this.darkMode

      if (this.user.steamid) {
        this.initPlayer()
        this.getStats()
        this.$store.dispatch('queueUp', false)
      }
    },

    sockets: {
      connect() {
        if (this.user.steamid) {
          this.initPlayer()
          this.getStats()
          this.$store.dispatch('queueUp', false)
        }
      },
      getPlayer (player) {
        player = parse(player)
        this.player = player
      },
      queueInfo (data) {
        data = parse(data)
        if (data.event == 'queueUp') {
          this.queueData = data
          if (this.queueData.ready.length == 0) {
            this.audio.play()
            this.estimatedTime = this.queueData.expireTime - (new Date()).getTime()
          }
          this.$store.dispatch('queueUp', true)

          const loadingInterval = setInterval(() => {
            const timeDiff = this.queueData.expireTime - new Date().getTime()
            this.timeLeft = Math.round((timeDiff/this.estimatedTime)*100000)/1000

            if (Math.round(this.timeLeft) == 0) {
              clearInterval(loadingInterval)
            }
          }, 100)


        } else if (data.event == 'queueExpired') {
          this.queueData = data
          this.$store.dispatch('queueUp', false)
          this.timeLeft = 100
          this.dialog = true
        } else if (data.event == 'pickPlayers') {
          this.$store.dispatch('queueUp', false)
          this.timeLeft = 100
          this.dialog = false
        }
      },
    },
  }
</script>

<style>
  html {
    overflow-y: auto !important;
  }
  .container-after-titlebar {
    top: 0 !important;
  }
  .window-title {
    font-family: 'Roboto', sans-serif;
  }

  /* Animation keyframes */
  .animate-warn {
    animation-delay: 1s;
    animation-duration: 5s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
    animation-name: jump;
    transform-origin: 50%;
    will-change: transform;
    -webkit-animation-duration: 5s;
    -webkit-animation-fill-mode: both;
    -webkit-animation-name: jump;
  }

  .animate-danger {
    animation-delay: 1s;
    animation-duration: 5s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
    animation-name: shake;
    transform-origin: 50% 0;
    will-change: transform;
    -webkit-animation-duration: 5s;
    -webkit-animation-fill-mode: both;
    -webkit-animation-name: shake;
  }

  .animate-active {
    animation-delay: 1s;
    animation-duration: 5s;
    animation-fill-mode: both;
    animation-iteration-count: 1;
    animation-name: active;
    transform-origin: 50% 0;
    will-change: transform;
    -webkit-animation-duration: 5s;
    -webkit-animation-fill-mode: both;
    -webkit-animation-name: active;
  }

  @keyframes active {
    0%,
    100% {
      transform: rotate(0) scale(1);
      -webkit-transform: rotate(0) scale(1);
    }
    50% {
      transform: rotate(0) scale(1.25);
      -webkit-transform: rotate(0) scale(1.25);
    }
  }

  @keyframes jump {
    0%,
    50%,
    100% {
      transform: translateY(0);
      -webkit-transform: translateY(0);
    }
    10%,
    20%,
    30%,
    40% {
      transform: translateY(-3px);
      -webkit-transform: translateY(-3px);
    }
    15%,
    25%,
    35%,
    45% {
      transform: translateY(0);
      -webkit-transform: translateY(0);
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
      -webkit-transform: translateX(0);
    }
    /* Fast Shake */
    1%,
    3%,
    5%,
    7%,
    9% {
      transform: translateX(-2px);
      -webkit-transform: translateX(-2px);
    }
    2%,
    4%,
    6%,
    8%,
    10% {
      transform: translateX(2px);
      -webkit-transform: translateX(2px);
    }
    /* Medium Shake */
    12%,
    16%,
    20%,
    24% {
      transform: translateX(-1px);
      -webkit-transform: translateX(-1px);
    }
    14%,
    18%,
    22%,
    26% {
      transform: translateX(1px);
      -webkit-transform: translateX(1px);
    }
    /* Slow Shake */
    30%,
    38%,
    46% {
      transform: translateX(-0.5px);
      -webkit-transform: translateX(-0.5px);
    }
    34%,
    42%,
    50% {
      transform: translateX(0.5px);
      -webkit-transform: translateX(0.5px);
    }
  }

  /* Items List Transitions */
  .list-in-enter-active,
  .list-in-leave-active {
    transition: all 0.25s ease;
  }

  .list-in-enter,
  .list-in-leave-to {
    opacity: 0;
    transform: scale(0.25);
  }

  /* List out */
  .list-out-enter-active,
  .list-out-leave-active {
    transition: all 0.25s ease;
  }

  .list-out-enter,
  .list-out-leave-to {
    opacity: 0;
    transform: scale(1.5);
  }

  /* List out delayed */
  .list-out-delayed-enter-active,
  .list-out-delayed-leave-active {
    transition: all 0.25s ease 0.1s;
  }

  .list-out-delayed-enter,
  .list-out-delayed-leave-to {
    opacity: 0;
    transform: scale(1.5);
  }

  /* Route change animations */
  .slide-up-enter-active,
  .slide-down-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-up-enter,
  .slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  /* Route change animations */
  .slide-down-enter-active,
  .slide-up-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-down-enter,
  .slide-up-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }

  /* Test right */
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-right-enter,
  .slide-right-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }

  /* Test left */
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-left-enter,
  .slide-left-leave-to {
    opacity: 0;
    transform: translateX(10px);
  }

  /* List animation */
  .list-complete-item {
    transition: all 0.25s;
  }

  .list-complete-enter,
  .list-complete-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .list-complete-leave-active {
    position: absolute;
  }

  /* Rotation */
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .rotating {
    animation: rotation 0.5s infinite linear;
  }
</style>
