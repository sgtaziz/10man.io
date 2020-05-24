const { Router } = require('express')
import axios from 'axios'
import BigNumber from "bignumber.js"

const router = Router()

function firstLastMonth () {
  let date = new Date(), y = date.getUTCFullYear(), m = date.getUTCMonth()
  let firstDay = new Date(y, m, 1, 0, 0, 0).getTime()/1000
  let lastDay = new Date(y, m + 1, 0, 23, 59, 59).getTime()/1000

  return [firstDay, lastDay]
}

// IN: String containing a steamID in any of the 3 formats
// OUT: String containing the steamID in the legacy format (e.g. STEAM_0:0:123456)
function ConvertToLegacy(inputID) {
  let number = new BigNumber(inputID)
  let firstPart = number.minus(new BigNumber('76561197960265728'))
  let z = firstPart.div(2).integerValue(BigNumber.ROUND_FLOOR)
  let y = number.mod(2)

  return 'STEAM_1:' + y + ':' + z
}

router.get('/players', async function(req, res) {
  const { data } = await axios.get(process.env.API_DEMOS_ENDPOINT+"players")
  let overview = await axios.get(process.env.API_ENDPOINT+"overview")
  overview = overview.data

  const players = []
  const promises = []
  const dates = firstLastMonth()

  for (let i = 0; i < data.players.length; i++) {
    const player = data.players[i]

    players.push(player)
    promises.push(axios.get(process.env.API_DEMOS_ENDPOINT+"player/"+player.steamid+"/stats?startDate="+dates[0]+"&endDate="+dates[1]))
  }

  const results = await Promise.all(promises)

  results.forEach(res => {
    const index = players.findIndex(x => x.steamid == res.config.url.split('/')[5])
    if (index > -1) {
      players[index].rating = Math.round(res.data.rating * 100)/100 || 0
      players[index].steam32 = ConvertToLegacy(players[index].steamid)

      const oIndex = overview.findIndex(x => x.steam == players[index].steam32)
      if (oIndex > -1) {
        players[index].discord = overview[oIndex].discord
      }
    }
  })

  res.json(players)
})

module.exports = router
