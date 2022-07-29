import Vue from 'vue';
import {
  Button, Message, MessageBox, Loading, Row, Select, Upload, Form, Input, FormItem, Checkbox, DatePicker, Table, TableColumn,
  Tree, Option, Pagination, Dialog, CheckboxGroup,Popconfirm, Col,  Tooltip, Menu, Submenu, MenuItem, MenuItemGroup, Drawer, Link,
  Switch
} from 'element-ui'
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Upload)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(CheckboxGroup)
Vue.use(Popconfirm)
Vue.use(Tooltip)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Drawer)
Vue.use(Link)
Vue.use(Switch)
Vue.prototype.$message = Message;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$loading = Loading.service;
