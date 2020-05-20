require('dotenv').config()

import colors from 'vuetify/es5/util/colors'
import session from 'express-session'
import redis from 'redis'

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient()

export default {
  mode: 'universal',

  server: {
    port: process.env.LISTEN_PORT,
    host: '127.0.0.1'
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'red' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/chatscroll.js', '~/plugins/moment.js', '~/plugins/socket.client.js', '~/plugins/timeago.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},

  oneSignal: {
    init: {
      appId: process.env.OS_APPID
      allowLocalhostAsSecureOrigin: true,
      safari_web_id: process.env.OS_SWEBID,
    },
    notifyButton: {
      enable: true,
      size: 'small',
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },

  serverMiddleware: [
    session({
      store: new RedisStore({ client: redisClient }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SECRET,
      cookie: { path: '/', httpOnly: true, secure: process.env.SECURE == 'true', maxAge: 31556952000 }
    }),
    // API middleware
    '~/api'
  ],
}
