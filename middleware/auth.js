export default function ({ store, error }) {
  if (!store.state.user.steamid) {
    error({
      message: 'You are not connected',
      statusCode: 403
    })
  }
}
