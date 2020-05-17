const { Router } = require('express')
const https = require('https')

const router = Router()


router.get('/match/:id', function(req, res) {
  https.get(process.env.SOCKET_URL+'/match-'+req.params.id+'.json', (file) => {
    file.pipe(res)
  })
})

module.exports = router
