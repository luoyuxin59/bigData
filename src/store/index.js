import Vue from 'vue'
import Vuex from 'vuex'
import {getStudentType} from '../network/collection'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tableList: [],
    tableLabel: [],
    notCleanData:[],  //未清洗数据
    cleanData: [],  //已清洗数据
    jsonList:{}, //保存接口采集json数据
    cleanJson: [],  //保存已清洗json数据
    getTableListQuery: {},
    dataName:'', //  来源数据库名
    tableName:'', // 来源数据表名
    tableUrl:'', // 来源数据库地址 
    total:'', //来源数据条数
    path: '',
    pageNum: '',  //页码
    term:'',
    connectionId: 35,
    studentTypeList:[]
  },
  mutations: {
    changeStudentTypeList(state, studentTypeList) {  
      console.log(studentTypeList.length);
          
      state.studentTypeList = studentTypeList
    }
  },
  actions: {
   async getStudentType(context, payload) {      
      let studentTypeList = []
      await getStudentType().then(res => {
        if(res.code == 200) {
          studentTypeList = res.data
          context.commit('changeStudentTypeList',studentTypeList)
        }
      })
    }
  },
  modules: {
  }
})
