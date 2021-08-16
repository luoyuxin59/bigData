import Vue from 'vue';
import {
  Button, Message, MessageBox, Loading, Row, Select, Upload, 
} from 'element-ui'
Vue.use(Button)
Vue.use(Row)
Vue.use(Select)
Vue.use(Upload)
Vue.prototype.$message = Message;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$loading = Loading.service;
