import axios from 'axios';

export function request(config) {
  const instance = axios.create({
    baseURL: '',
    timeout: 10000
  })

  // 1.请求拦截
  instance.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers['token']  = token;
    } 
    return config
  })

  // 2响应拦截
  instance.interceptors.response.use(res => {
    if (res.data.Code == 401) {
      router.push('/login')
    } else {
      return res.data
    }
    return instance(config)
  })
  return instance(config)

}
