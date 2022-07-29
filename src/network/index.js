import axios from 'axios';
import BASE_URL from './config'
import { Notification } from 'element-ui';

export function request(config) {
  const instance = axios.create({
    // 10.16.131.90
    // baseURL: process.env.VUE_APP_BASE_URL, // url = base url + request url
       baseURL:  BASE_URL, // url = base url + request url
       timeout: 1000000
  })
  var token = sessionStorage.getItem('token');
  console.log(token);
  // 1请求拦截器
  instance.interceptors.request.use(config => {
    console.log(token,'请求拦截器');
      if(token) {
        config.headers['token']  = token
      }
    //   config.headers['username'] = userName;
    
      return config
  })
  // 2响应拦截器
  instance.interceptors.response.use(res => {
      // console.log(res);
      // if(res.data.Code == 401 ) {
      //  router.push('/login')
      // }else {
        if(res.data.code != 200 && res.data.code != 201 )  { 
          Notification.error({
            title:'未请求到资源',
            message: res.data.message
          })
        }
        return res.data
      // }
  }, err => {
 
    console.log(err);
    Notification.error({
      title:'请求资源失败',
      message: '数据异常'
    })
  })
  return instance(config)
}
