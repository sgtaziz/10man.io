import express from 'express'
import session from 'express-session'
import redis from 'redis'

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient()

const app = express()

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    cookie: { path: '/', httpOnly: true, secure: process.env.SECURE == 'true', maxAge: 31556952000 }
  })
)
// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

// Require API routes
const steam = require('./routes/steam')

// Import API Routes
app.use(steam)

// Export the server middleware
export default {
  path: '/api',
  handler: app
}
