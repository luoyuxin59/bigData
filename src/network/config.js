let BASE_URL = ''

if (process.env.NODE_ENV === 'development') {
  BASE_URL = process.env.VUE_APP_BASE_URL
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = window.api.baseURL
} else {
  BASE_URL = process.env.VUE_APP_BASE_URL
}

export default BASE_URL