import config from '../../constants/config'

const { apiUrl } = config

export default {
  createPaymentIntent: (options) =>
    window
      .fetch(`${apiUrl}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
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
          throw new Error('PaymentIntent API Error')
        } else {
          return data.client_secret
        }
      }),

  getProductDetails: (options) =>
    window
      .fetch(`${apiUrl}//product-details`, {
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
          return data
        }
      }),
}
