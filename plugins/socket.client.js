import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV !== 'production',
  connection: process.env.SOCKET_URL
}))
