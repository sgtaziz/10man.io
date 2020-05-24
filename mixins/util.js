function firstLastMonth () {
  let date = new Date(), y = date.getUTCFullYear(), m = date.getUTCMonth()
  let firstDay = new Date(y, m, 1, 0, 0, 0).getTime()/1000
  let lastDay = new Date(y, m + 1, 0, 23, 59, 59).getTime()/1000

  return [firstDay, lastDay]
}

global.firstLastMonth = firstLastMonth

export default {
  methods: {
    firstLastMonth: () => {
      return firstLastMonth()
    }
  }
}
