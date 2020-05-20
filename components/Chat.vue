<template>
  <v-layout v-if="user && user.steamid" style="z-index: 999;">
    <v-flex style="position: fixed; bottom: 0;right: 0;transition: width 0.3s;max-width: 100%;" :style="expanded ? 'width: 420px;' : 'width: 103px;'">
      <v-badge color="red" v-if="notifications > 0" :content="notifications" left offset-y="17.5" offset-x="10" style="z-index: 99"></v-badge>
      <v-card class="elevation-12">
        <v-toolbar @click="expand" tile>
          <v-toolbar-title style="cursor: pointer;">
            Chat
            <v-icon>{{ expanded ? 'mdi-chevron-down' : 'mdi-chevron-up'}}</v-icon>
          </v-toolbar-title>
        </v-toolbar>
        <v-expand-transition>
          <div v-show="expanded">
            <v-list dense style="height: 225px;max-height: 225px;overflow-y: auto;" v-chat-scroll="{ smooth: true }">
              <v-list-item v-for="(msg, i) in messages" :key="i">
                <v-tooltip left nudge-right="5">
                  <template v-slot:activator="{ on }">
                    <v-list-item-avatar size="24" v-on="on">
                      <v-img :src="msg.avatar"></v-img>
                    </v-list-item-avatar>
                  </template>
                  <span>{{ msg.name }}</span>
                </v-tooltip>
                <v-list-item-content class="caption" style="word-break: break-all;width: 100%;">
                  {{ msg.text }}
                </v-list-item-content>
                <v-list-item-content style="max-width: 85px;">
                  <timeago :datetime="msg.timestamp" class="text-right" autoUpdate style="font-size: 10px;"></timeago>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-form @submit.prevent="submit" style="width: 100%;height: 40px;">
                <v-text-field v-model="text" label="Message" single-line solo-inverted append-icon="mdi-send" dense v-on:click:append="submit"></v-text-field>
              </v-form>
            </v-card-actions>
          </div>
        </v-expand-transition>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data: () => ({
    text: '',
    messages: [],
    expanded: false,
    notifications: 0,
    lastNotification: new Date().getTime()
  }),
  computed: {
    user () {
      return this.$store.state.user
    },
  },
  sockets: {
    messageData (data) {
      this.messages = data
      if (this.messages.length == 0) return

      let lastMsg = this.messages[this.messages.length-1]
      if (this.lastNotification < lastMsg.timestamp && !this.expanded ) {
        this.notifications++
      }
      this.lastNotification = new Date().getTime()
    },
  },
  methods: {
    submit () {
      this.text = this.text.trim()

      if (this.text.length < 2) return
      let message = {}
      message.name = this.user.personaname
      message.avatar = this.user.avatarfull
      message.text = this.text
      message.timestamp = new Date().getTime()

      this.messages.push(message)
      this.text = ''
      this.$socket.emit('sendMessage', message)
    },
    expand () {
      this.expanded = !this.expanded
      this.notifications = 0
    }
  }
}
</script>

<style>
</style>
