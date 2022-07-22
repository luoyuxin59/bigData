<template>
  <div class="home">
    <div  class="titleImg">
      <img src="../assets/images/login/title.png" alt="" />
    </div>
    <span @click="loginOut" class="el-icon-switch-button"><span class="out">退出</span></span>
    <div class="platformList" ref="aList">
      <a class="an_1" href="javascript:void(0);" 
      @click="selectPlatform(index)"
      v-for="(item,index) in platformList" :key="index" :class="{active: item.isActive}">{{item.name}}</a>
      <div class="an_1" @click="createReport">报告下载</div>
     <!--  <a href="javascript:void(0);">数据采集平台</a> -->
    </div>
    <div class="content">
      <div class="nav">
        <sidebar class="dataCollection"  v-show="platformList[0].isActive" :items="itemsA"></sidebar>
        <sidebar class="dataCollection" v-show="platformList[1].isActive" :items="dataAnalysis"></sidebar>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import {loginOut,createReport, exportReport} from "../network/collection"
import Tree from "../components/common/Tree.vue";
import Sidebar from "../components/common/Sidebar.vue"
export default {
  name: "",
  components: {
    Tree,
    Sidebar
  },
  data() {
    return {
      currentLi: false,
      platformList: [
        {
          name: '数据采集',
          isActive: true,
          path: 'LibraryCollection'
        },
        // {
        //   name: '清洗质控',
        //   isActive: false,
        //   path: 'CreateRules'
        // },
         {
          name: '数据分析',
          isActive: false,
          path: "reliability",
        }
      ],
        itemsA: [
                {
                    icon: 'el-icon-lx-calendar',
                    index: '1',
                    title: '结构化数据采集',
                    subs: [
                        {
                            index: 'LibraryCollection',
                            title: '入库采集'
                        },
                        {
                            index: 'InterfaceCollect',
                            title: '接口采集',
                        },
                    ]
                },
              {
                    icon: 'el-icon-lx-calendar',
                    index: '2',
                    title: '半结构化数据采集',
                    subs: [
                        {
                            index: 'AutomaticCollection',
                            title: '自动采集'
                        },
                      
                    ]
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '3',
                    title: '非结构化数据采集',
                    subs: [
                        {
                            index: 'UnstructuredCollection',
                            title: '非结构化数据采集'
                        },
                      
                    ]
                },
                 {
                    icon: 'el-icon-lx-calendar',
                    index: '4',
                    title: '新建表格',
                    subs: [
                        {
                            index: 'CreateTable',
                            title: '新建表格'
                        },
                      
                    ]
                },
             {
                    icon: 'el-icon-lx-calendar',
                    index: '5',
                    title: '系统设置',
                    subs: [
                      {
                            index: 'DataClear',
                            title: '二次数据清洗'
                        },
                        {
                            index: 'Retrieve',
                            title: '图形化检索'
                        },
                        {
                            index: 'Set',
                            title: '查看清洗日志'
                        },
                        {
                            index: 'systemInfo',
                            title: '系统信息'
                        },
                        {
                            index: 'clearDictionary',
                            title: '清洗字典管理'
                        },
                      
                    ]
                },
            ],
      dataClean:  [
          {
          id: 1,
          label: '数据清洗',
          children: [
            {
              id: 5,
              label: '创建清洗规则',
              path: 'CreateRules'
            },
            {
              id: 6,
              label: '创建清洗规则组',
              path: 'CreateRuleGroup'
            },
            {
              id: 7,
              label: '查看类型转换规则',
              path: 'TypeRules'
            },
            {
              id: 8,
              label: '新建类型转换规则',
              path: 'CreateTypeRules'
            }
          ]
        },
      ],
      dataAnalysis: [
        {
            icon: 'el-icon-lx-calendar',
            index: '1',
            title: '数据分析',
            subs: [
                {
                    index: 'reliability',
                    title: '评教信度分析'
                },
                {
                    index: 'WeightedConversion',
                    title: '标准成绩分析',
                },
                  {
                    index: 'Logistic',
                    title: '回归预测分析',
                },
                  {
                    index: 'K-means',
                    title: '聚类挖掘分析',
                },
                 {
                    index: 'Factor',
                    title: '关联规则分析',
                },
                {
                    index: 'ID3',
                    title: '决策树分析',
                },
            ]
        },
      
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    let index = sessionStorage.getItem('index');
    if(index > 0) {
      for(var i = 0; i< this.platformList.length; i++) {
        this.platformList[i].isActive = false
      }
      sessionStorage.setItem('index',index)

       this.platformList[index].isActive = true;
    }
  },
  methods: {
     // 生成报告
     exportReport(){
      this.query = []
      let isOnLine = {
       isOnLine: false
      };
      let Reliability = sessionStorage.getItem('Reliability');
      let Kmeans = sessionStorage.getItem('Kmeans');
      // let Logistic = sessionStorage.getItem('Logistic');
      let WeightedConversion = sessionStorage.getItem('WeightedConversion');
      let Factor = sessionStorage.getItem('Factor');
      console.log(Reliability && Kmeans  && WeightedConversion && Factor)
      // 评教数据
      if(this.list){
        // if( Reliability && Kmeans && WeightedConversion && Factor) {
          if(this.list.cronbach){
            let objA = {
              algorithm: 'cronbach',
              result:this.list.cronbach,
              // result: '',
              img: ''
            }
            if( sessionStorage.getItem('Reliability')) {
              objA.img = sessionStorage.getItem('Reliability')
            }else {
              objA.img = ''
            }
            this.query.push(objA)
          
        
          }
          if(this.list.kmeans){
            let objB = {
              algorithm: 'kmeans',
              // JSON.stringify(this.list.kmeans)
              result: '',
              img: ''
            }
            if( sessionStorage.getItem('Kmeans')) {
              objB.img = sessionStorage.getItem('Kmeans')
            }else {
              objB.img = ''
            }
            this.query.push(objB)
          }
          if(this.list.logistic){
            let arr = []
            this.list.logistic.forEach(item => {
            item = JSON.stringify(item)
            console.log(item);
            arr.push(item)
            })
            arr = arr.toString()
            let objC = {
              algorithm: 'logistic',
              // result: "[" + arr + "]",
              result: '',
              img: ''
            }
            if(sessionStorage.getItem('Logistic') ){
              objC.img = sessionStorage.getItem('Logistic')
            }else {
              objC.img = ''
            }
            this.query.push(objC)
          }
          if(this.list.originalReliability) {
            let arrA = []
            this.list.originalReliability.forEach(item => {
            item = JSON.stringify(item)
            arrA.push(item)
            })
            arrA = arrA.toString()
            let objD = {
              algorithm: 'originalReliability',
              // result: "[" + arrA + "]",  
              result: '',
              img: ''
            }
            if(sessionStorage.getItem('WeightedConversion')){
              objD.img = sessionStorage.getItem('WeightedConversion')
            }else {
              objD.img = ''
            }

            this.query.push(objD)
          }
          if(this.list.apriori) {
            let arrB = []
            this.list.apriori.forEach(item => {
            item = JSON.stringify(item)
            arrB.push(item)
            })
            arrB = arrB.toString()
            let objF = {
              algorithm: 'apriori',
              // result: "[" + arrB + "]",
              result: '',
              img: ''
            }
            if(sessionStorage.getItem('Factor')) {
              objF.img = sessionStorage.getItem('Factor') 
            }else {
              objF.img = ''
            }

          this.query.push(objF)
          }
          exportReport(isOnLine,this.query).then(res => {
            console.log(res);
            
            if(res.code == 200) {
              console.log(res.data);
              window.open(res.data)
              this.$message.success(res.message)
            }else {
              console.log(res.message);
              
              this.$message.error(res.message)
            }
          //   console.log(response);
          //   const { data } = response;
          // const reader = new FileReader();
          // const filename = '分析报告';
          // if(data.type === 'applicationjson'){
          // 	reader.readAsText(data);
          // 	reader.onload = function () {
          // 		const { message, code } = JSON.parse(reader.result);
          // 		console.log(message + code);
          // 	}
          // }else{
          // 	var link = document.createElement('a');
          // 	var blob = new Blob([response.data]);
          // 	if('download' in link) {
          // 		link.download = filename;
          // 		link.style.display = 'none';
          // 		link.href = URL.createObjectURL(blob);
          // 		document.body.appendChild(link);
          // 		link.click(); //执行下载
          // 		URL.revokeObjectURL(link.href); //释放url
          // 		document.body.removeChild(link); //释放标签
          // 	} else {
          // 		navigator.msSaveBlob(blob, filename)
          // 	}
          //   }
          }).catch(err => {
            console.log(err);
          })
        // }else {
        //   this.$message.error('请先调用算法生成数据！')
        // }
      }
    },
   
    // 创建报告
    createReport(){
      createReport().then(res => {
        if(res.code == 200) {
          this.list = res.data;
          console.log(this.list );
          this.exportReport()
        }else {
          console.log(res.message);
          
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err);
        
          this.$message.error(err)
      })
        
    },
 
    // navli点击
    liAcive(li) {      
      console.log(li.isActive);
      if(li.isActive) {        
        this.dataCollection.forEach(item => {
          item.isActive = false          
        })
      }else {
        li.isActive = !li.isActive;
        console.log(li.isActive);
      }
    },
    selectPlatform(index) {
      for(var i = 0; i< this.platformList.length; i++) {
        this.platformList[i].isActive = false
      }
      sessionStorage.setItem('index',index)

       this.platformList[index].isActive = true;
       let path = sessionStorage.getItem('toPath')
       console.log(index);
       this.$router.push(this.platformList[index].path)

    
    },
    loginOut() {
        loginOut().then((res) => {
          console.log(res);
          this.$message.success("退出成功")
          this.$router.push('/login')
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('index')
          sessionStorage.removeItem('toPath')
          sessionStorage.removeItem('path')

        }).catch((err) => {
          this.$message.success("退出成功")
          this.$router.push('/login')

        });
      // this.$router.push('/login')
    }
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/tool.less";

.home {
  background: url("../assets/images/management/bg.jpg");
  .bg();
  .titleImg {
    .position-center();
    top: 70px;
  
  }
  .el-icon-switch-button {
    position: absolute;
    right: 40px;
    top: 40px;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    .out {
      margin-left: 5px;
      line-height: 30px;
      font-size: 18px;
    }
  }
  .platformList {
    position: absolute;
    right: 60px;
    top: 110px;
    .an_1 {
      text-decoration: none;
      color: #ccc;
      display: inline-block;
      font-size: 14px;
      border-radius: 30px;
      padding: 8px 25px 8px 25px;
      color: #333;
      margin: 0 8px;
      background: linear-gradient(to bottom, #fff, #ccc);
      cursor: pointer;
    }
    .active {
      color: #fff;
      background: linear-gradient(to bottom, #00b4fb, #008aec);
    }
  }
  .content {
    display: flex;
    height: 81%;
    padding-top: 155px;
    .nav {
      width: 222px;
      height: 100%;
      padding: 0 40px 0 40px;
      .dataCollection {
        height: 100%;
        background-color: #e3edf7;
        margin-bottom: 25px;
        width: 222px;
        border-radius: 5px;
      }
      .title {
        line-height: 42px;
        background: url("../assets/images/management/左侧菜单/yiji.png");
        color: #fff;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
      }
    }
    .main {
      width: 90%;
      // height: 94%;
      padding: 20px;
      margin-right: 40px;
      background-color: #fff;
      border-radius: 5px;
      overflow: auto;
    }
  }
}
ul , li {
  padding: 0;
  margin: 0;
  
}
a {
  text-decoration: none;
  color: #333;
}
.navBox ul{
  background-color: #fff;
  
}
.navLi {
  line-height: 35px;
  cursor: pointer;
  padding-left: 10px;

}
.open {
  background-color: aquamarine;
}
.liA {
  padding-left: 20px;
}
</style>
