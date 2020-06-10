import config from '../../constants/config'

const { apiUrl } = config

export default {
  getPublicStripeKey: () =>
    window
      .fetch(`${apiUrl}/public-key`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        } else {
          return null
        }
      })
      .then((data) => {
        if (!data || data.error) {
          console.log('API error:', { data })
          throw Error('API Error')
        } else {
          return data.publicKey
        }
      }),
}
