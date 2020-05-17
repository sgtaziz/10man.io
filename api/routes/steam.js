const { Router } = require('express')
const steam   = require('steam-login')

const router = Router()

router.use(
  steam.middleware({
    realm: process.env.BASE_URL,
    verify: process.env.BASE_URL+'/api/verify',
    apiKey: process.env.STEAM_API
  })
)

router.get('/getUser', function(req, res) {
  res.send(req.user == null ? '{ }' : req.user._json).end()
})

router.get('/login', steam.authenticate(), function(req, res) {
  res.redirect('/')
})

router.get('/verify', steam.verify(), function(req, res) {
  res.redirect('/')
})

router.get('/logout', steam.enforceLogin('/'), function(req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router
