// K-means
<template>
  <div class="K-means">
    <div class="screen clearfix">
      <div class="t"><span class="el-icon-caret-right">筛选样本</span></div>
      <el-row>
        <el-form ref="form" :model="query" label-width="130px">
          <el-col :span="6">
            <el-form-item label="请选择数据表">
              <el-select
                v-model="query.tableName"
                @change="getTableList"
                size="mini"
                placeholder="请选择"
                style="width: 150px"
              >
                <el-option
                  v-for="item in tableList"
                  :key="item[0].tableName"
                  :label="item[0].dateSet"
                 :value="item[0].tableName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="请选择入学年份" v-if = "query.tableName.indexOf('student') != -1">
              <el-select
                @focus="isTable"
                v-model="query.year"
                size="mini"
                placeholder="请选择"
                style="width: 150px"
                clearable
              >
                <el-option
                  v-for="(item, index) in yearOptions"
                  :key="index"
                  :label="item[0]"
                  :value="item[0]"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-col :span="6"></el-col>
            <el-form-item
              label="请选择人员类别"
              v-if="query.tableName.indexOf('teacher') != -1"
            >
              <el-select
                @focus="isTable"
                v-model="query.personnelCategory"
                size="mini"
                placeholder="请选择"
                style="width: 150px"
                clearable
              >
                <el-option
                  v-for="(item, index) in personTypeOptions"
                  :key="index"
                  :label="item[0]"
                  :value="item[0]"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="请选择学历层次" v-if = "query.tableName.indexOf('student') != -1">
              <el-select
                v-model="query.cultivationLevel"
                size="mini"
                placeholder="请选择"
                style="width: 150px"
                clearable
              >
                <el-option label="本科" value="本科"> </el-option>
                <el-option label="专科" value="专科"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="请选择考生层次" v-if = "query.tableName.indexOf('student') != -1">
              <el-select
                v-model="query.studentCategory"
                clearable
                size="mini"
                placeholder="请选择"
                style="width: 150px"
              >
              <el-option
              v-for="(item, index) in $store.state.studentTypeList"
              :key="index"
              :label="item[0]"
              :value="item[0]"
            >
            </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item>
              <el-button
                type="primary"
                class="startBtn"
                @click="start"
                size="mini"
                >查询样本</el-button
              >
            </el-form-item>
          </el-col> -->
        </el-form>
        <!-- <div class="select ">
          <el-checkbox-group  v-model="checkedCities">
            <el-checkbox v-for="(city,index) in fieldList" :label="city" :key="index" @change="select">{{city.column_name}}</el-checkbox>
          </el-checkbox-group>
        </div> -->
      </el-row>
        <div class="select" >
         <el-checkbox-group  v-model="checkedCities" >
          <el-checkbox v-for="(city,index) in fieldList" :label="city" :key="index" @change="select">{{city.column_name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button type="primary" class="startBtn" @click="start"  size="mini">准备数据集</el-button>
    </div>
    <div class="result" style="margin-bottom: 20px">
      <div class="t"><span class="el-icon-caret-right">数据集</span></div>
      <el-form v-show="CdataShow.length > 0" style="display: flex">
        <el-form-item label="聚类数量" style="width:300px;">
          <el-input
            v-model="kmeansQuery.clustersNum"
            size="mini"
            style="width: 100px; margin-right: 20px"
          ></el-input>
        </el-form-item>
        <el-form-item label="请选择横坐标" style="width:300px;">
          <el-select
            v-model="coordinates.x"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in checkedCities"
              :key="index"
              :label="item.column_name"
              :value="item.column_name"
              style="width: 100px;"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择纵坐标" style="width:300px;">
          <el-select
            v-model="coordinates.y"
            size="mini"
            placeholder="请选择"
          >
            <el-option
               v-for="(item,index) in checkedCities"
              :key="index"
              :label="item.column_name"
              :value="item.column_name"
              style="width: 100px;"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" class="startBtn" v-show="CdataShow.length > 0" style="width: 80px;height:30px;"  @click="kmeans" size="mini" >开始分析</el-button>

      </el-form>

      <el-table :data="CdataShow"  v-show="CdataShow.length > 0" border style="width: 100%" height="300">
            <!-- 动态循环的列表 -->
            <template v-for="(item, index) in checkedCities">
              <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
               <el-table-column
              :key="index"
              :prop="item.column_name"
              :label="item.column_name"
            >
            </el-table-column>
            </template>
        </el-table>
         <div class="page"  v-show="CdataShow.length > 0">
            <el-pagination @size-change="ChandleSizeChange"
              @current-change="ChandleCurrentChange"
              :current-page="CcurrentPage"
              :page-sizes="[5, 10, 15, 30]"
              :page-size="CpageSize"
              :pager-count="5"
              layout="total, sizes, prev, pager, next"
              :total="Ctotal"
              background>
            </el-pagination>
        </div>
    </div>
    <div class="result">
      <div class="t"><span class="el-icon-caret-right">分析结果</span></div>
      <div v-show="k > 0" style="font-size: 16px;padding: 0 80px; line-height: 30px;">
           k-means算法是一种基于划分的聚类算法，根据给定的{{k}}个数据对象的数据集，构建{{kmeansQuery.clustersNum}}个划分聚类的方法，每个划分聚类即为一个簇。
        该方法将数据划分为{{kmeansQuery.clustersNum}}个簇，每个簇至少有一个数据对象，每个数据对象必须属于而且只能属于一个簇。
        同时要满足同一簇中的数据对象相似度高，不同簇中的数据对象相似度较小，聚类相似度利用各簇中对象的均值计算得来。得到{{kmeansQuery.clustersNum}}类典型的学员类别如下
      </div>
      <div  ref="chart" style="width:100%; height:600px"></div>
      <!-- <div v-for="(item, index) in dataList.clusters" :key="index">{{item.cluster}}</div> -->
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";

import {getPersonType, getYearsList, kmeans,selectTableList,getTableList,selectDataset,kmeansDataSet } from "../../network/collection";
export default {
  name: "",
  components: {},
  // 学员:就诊,消费,图书借阅,成绩,获奖  教员:课程量,科研能力,军事训练得分,荣誉表彰,评教成绩
  data() {
    return {
      personTypeOptions:[],
      yearOptions:[],
      cities: [],
      checkedCities: [], // 已选择的数据
      form: {},
      options: [],
      value: "",
      query: {
       tableName: '',
        personnelCategory: '',
        year: '',
        cultivationLevel: '',
        studentCategory: '',
      },
      kmeansQuery:{
        clustersNum:''
      },
      dataList: {},
      series:[],
      chart: null,
      getTableform: {
        connectionAddress: "192.168.1.85",
        connectionDatabaseName: "armedPolice",
        connectionId: this.$store.state.connectionId,
        connectionName: "武警1",
        connectionPassword: "Zlser_123",
        connectionPort: "3306",
        connectionType: "1",
        connectionUsername: "root",
        createdById: 1,
      },
      tableList: [],
      connectionId: '',
      fieldList:[],
      tableList:[],
      k: '',
      columnList:[],
      dataList: [],
      columnName: [],
      coordinates:{
        x: '',
        y: ''
      },
      CtotalPageData: [],
      centerList:[],
       // 共几页
      CpageNum: 1,
      // 每页显示数量
      CpageSize: 10,
      // 当前显示页码
      CcurrentPage: 1,
      // 总共多少条数据
      Ctotal: 0,
      // 当前要显示的数据
      CdataShow: [],
      other: [],
      checkeBoxList:[],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.selectDataset()
  },
  methods: {
    // 查询所有人员类别
    getPersonType(){
      console.log(this.query.tableName);
      let obj ={tableName: this.query.tableName}
      getPersonType(obj).then(res => {
        if(res.code == 200) {
         this.personTypeOptions = res.data
        }
      })
    },
    // 判断是否选择了数据表
    isTable(){
      if(this.query.tableName === '') {
          this.$message.error('请先选择数据表')
        this.$notify.error({
          title: '错误',
          message: '请先选择数据表'
        });
      }
    },
    // 获取年份
    getYearsList(){
       let obj ={tableName: this.query.tableName}
      getYearsList(obj).then(res => {
        this.yearOptions = res.data
        console.log( this.yearOptions);
      })
    },
    kmeansDataSet() {
      this.columnList = []
      this.checkedCities.forEach(item => {
        this.columnList.push(item.column_name)
      })
      const loading = this.$loading({
        lock: true,
        text: "数据集准备中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      kmeansDataSet(this.query, this.columnList).then(res => {
        console.log(res);
        if(res.code == 200) {
          this.dataList = res.data;
          for(let key in  this.dataList[0]){
            this.columnName.push(key)
          }
          loading.close()
          this.Ctotal = this.dataList.length;
          this.CcalcPageData();
        }else {
          this.$message.error(res.message)
        }
        loading.close()
      })
    },
      // 查询表数据
    selectDataset() {
       let obj = {
        type: '4'
      }
      selectDataset(obj).then(res => {
        if(res.code == 200) {
          this.tableList = res.data;
          let arr = []
          this.tableList.forEach(item => {
          // if(item.substr(0, 5) == 'math_') {
            console.log(item);
            arr.push(item)
          // }
        }) 
        this.tableList =  arr;
        }
      })
    },
    // 查询表字段
    getTableList(value) {
        this.checkedCities = []
        this.query.personnelCategory= ''
        this.query.year= ''
        this.query.cultivationLevel= ''
        this.query.studentCategory= ''
        
      if(this.query.tableName.indexOf('student') != -1) {
        this.getYearsList();
      }else {
        // 根据表名查询老师类别
        this.getPersonType()
      } 
      const loading = this.$loading({
        lock: true,
        text: "数据集准备中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      let obj = {
        pageNum: 1,
        pageSize: 1,
        type: '4',
        tableName: value,
        connectionId: this.$store.state.connectionId,
      }
      getTableList(obj).then(res => {
        if(res.code == 200) {
          console.log(res);
          this.CdataShow = [];
          this.centerList = [];
          this.fieldList = []
          this.dataList = [];
          this.coordinates.x ='';
          this.coordinates.y ='';
          this.k = 0;
          this.series =[];
          const arr = ['学员ID', '隶属单位','学员类别','培养层次','入学年份', '人员姓名', '小单位名称', '人员编号','人员类别','小单位代码']
          console.log(res.data.columnComment);
          res.data.columnComment.forEach(item => {
            if(arr.indexOf(item.column_name) === -1) this.fieldList.push(item)
          })
          // this.fieldList = res.data.columnComment;     
          console.log(this.fieldList);
    
               
          loading.close() 
        }
        loading.close()
      })
    },
    kmeans() {
      if(this.coordinates.x != this.coordinates.y) { 
      this.series = []
      const loading = this.$loading({
        lock: true,
        text: "AI实时计算中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      let list = [];
      this.dataList.forEach(item => {
        this.checkedCities.forEach(key => {
              if (key.column_name == '体能成绩' && item[key.column_name] != 0) {
                list.push(item)
              } else {
                //this.analyseArr.push(obj)
                //break
              }
            
          })

        })
        let list1 = [];
        if(list.length > 0) {
            list.forEach(item => {
            this.checkedCities.forEach(key => {
                if (key.column_name == '消费总额' && item[key.column_name] != 0) {
                  list1.push(item)
                } else {
                  //this.analyseArr.push(obj)
                  //break
                }
              
            })
          })
        }else {
          this.dataList.forEach(item => {
            this.checkedCities.forEach(key => {
                if (key.column_name == '消费总额' && item[key.column_name] != 0) {
                  list1.push(item)
                } else {
                  //this.analyseArr.push(obj)
                  //break
                }
              
            })
          })
        }
        let list2 = [];
        if(list1.length > 0 ) { 
          list1.forEach(item => {
            this.checkedCities.forEach(key => {
                if (key.column_name == '总评成绩' && item[key.column_name] != 0) {
                  list2.push(item)
                } else {
                  //this.analyseArr.push(obj)
                  //break
                }
              
            })
          })
        }else {
          this.dataList.forEach(item => {
            this.checkedCities.forEach(key => {
                if (key.column_name == '总评成绩' && item[key.column_name] != 0) {
                  list2.push(item)
                } else {
                  //this.analyseArr.push(obj)
                  //break
                }
              
            })
          })
        }
        
    
        // list1.forEach(it => {
        //   for (var key in list1[0]) {
        //     if(key == '总评成绩' ) {
        //       it[key] =  (it[key] - 24.57) / 68.66 + ''
        //     }else  if (key == '体能成绩' ) {
        //       it[key] = (it[key] - 23.5) / 66.7 + ''
        //     } else if (key == '消费总额' ) {
        //       it[key] = (it[key] - 1.25) / 3799.95 + ''
        //     }
        //   }
        // })
        if(list2.length == 0) {
          list2 = this.dataList
        }
      kmeans(this.kmeansQuery,list2).then((res) => {
        let list = {}
        if (res.code == 200) {
          this.series = [];
          this.centerList = [];
          var xList = [];
          var yList = [];
          this.other = []
          var oldList = [this.coordinates.x,this.coordinates.y]
          console.log(oldList);
          
          for(var i = 0; i < this.checkedCities.length; i++) {
            if(oldList.indexOf(this.checkedCities[i].column_name) == -1) {
              this.other.push(this.checkedCities[i].column_name )
            }
          } 
          console.log(this.other);
          
          this.k = res.data.clusters.length;
          list = res.data;
          // 组装中心点数据
           for(let a = 0; a < list.clusterCentroids.length; a++) {
            //  this.legendData.push(arr)
              let  obj = list.clusterCentroids[a];
              var arr = [];
              
              arr[0] = parseFloat(obj[this.coordinates.x])
              arr[1] = parseFloat(obj[this.coordinates.y])
              arr[2] = 0;
              arr[3] = '聚类点';
              for(var i = 0; i < this.other.length; i++) {
                console.log(arr);
                
                
                arr.push(obj[this.other[i]])
             
              }
                this.centerList.push(arr)
              
              
              // console.log( this.dataList.clusterCentroids);
          
              
            }
            // 组装散点数据
          var abnormalList = []
          for (let i = 0; i < list.clusterCentroids.length; i++) {
            list["data" + i] = [];
            for (let j = 0; j < list.clusters.length; j++) {
              if (list.clusters[j].type == i) {
                var arr = [];
                if(list.clusters[j].distance > 0.2) {
                  let obj = list.clusters[j];
                  let arr = [];
                  arr[0] = parseFloat(obj[this.coordinates.x])
                  arr[1] = parseFloat(obj[this.coordinates.y])  
                  arr[2] = parseFloat(obj.distance)    
                  arr[3] = '异常点';
                  for(var k = 0; k < this.other.length; k++) {                      
                    arr.push(obj[this.other[k]])
                  }    
                  abnormalList.push(arr)
                }else {
                  let obj = list.clusters[j];
                  var arr = [];
                  arr[0] = parseFloat(obj[this.coordinates.x])
                  xList.push(arr[0])
                  arr[1] = parseFloat(obj[this.coordinates.y])
                  arr[2] = parseFloat(obj.distance)   
                  arr[3] = i   
                  for(var k = 0; k < this.other.length; k++) {                      
                    arr.push(obj[this.other[k]])
                  } 
                  xList.push(arr[1])
                  
                  list["data" + i].push(arr);
                }
              }
            }
          }
          //  异常点
         
          // for (let i = 0; i < list.clusters.length; i++) {
          //   if(list.clusters[i].distance > 0.12) {
          //     let obj = list.clusters[i];
          //     let arr = [];
          //     arr[0] = parseFloat(obj[this.coordinates.x])
          //     arr[1] = parseFloat(obj[this.coordinates.y])              
          //     abnormalList.push(arr)
          //   }
          // }
          
          xList.sort(function(a,b) {
              return a - b;
            })
          this.minX = Math.floor(xList[0]);
          this.maxX = Math.ceil(xList[xList.length -1])
          
          // 数据整合，循环添加
          let objA = {
            type: 'effectScatter',
            symbolSize: 10,
            data: this.centerList,
            zlevel: 1,
            itemStyle: {
              color: '#2D96E1'
            }
          };
          this.series.push(objA)
          for (let l = 0; l < list.clusterCentroids.length; l++) {
              let objB = {  
              name: l,
              type: 'scatter',
              data: '',
           }
            objB.data =  list["data" + l]
            this.series.push(objB)
          }
          let objC = {
            type: 'effectScatter',
            symbolSize: 5,
            data: abnormalList,
            zlevel: 1,
            itemStyle: {
              color: 'red'
            }
          }
          this.series.push(objC)
          if(this.coordinates.x == '总评成绩') {
            this.drawChartA(list.clusters)
          }else {
            this.drawChart();
          }
          loading.close();
          setTimeout(() => {
            let imgEchart = new Image();
            imgEchart = this.chart.getDataURL({
            type: "png",
            pixelRatio: 1,// 倍数
            // backgroundColor: '#ccc'// 背景
            });
            imgEchart = imgEchart.replace(/^data:image\/\w+;base64,/, "")
            sessionStorage.setItem('Kmeans',imgEchart.replace(/^data:image\/\w+;base64,/, ""))
          },1000)
        }
        loading.close()
      }).catch(err => {
        loading.close()
        console.log(err);
         
      })
      }else {
        this.$message.error('横纵坐标不能相同，请从新选择')
      }
    },
    drawChartA(list) {  
      this.chart = echarts.init(this.$refs.chart);
      let  _that = this;
      this.chart.setOption({
        tooltip: {  
          /*返回需要的信息*/  
          formatter: function(param) {   
             
            var value = param.value;  
            console.log(value);
            console.log(_that.other);
            var point = ''
            
            point += '<div >'+ value[3]+ '</br>' 
             + _that.coordinates.x + '：' + value[0]  + '</br>' +  _that.coordinates.y + '：' + value[1] + '</br>';
            console.log(_that.other + '--' + point);

            for(var i = 0; i < _that.other.length; i++) {
              console.log(_that.other[i] + '' + value[3 + i]);
              
              point +=   _that.other[i] + '：' + value[4 + i] +'<br>'
            }
            console.log(point);
            
            return point
             
          }  
        },
        legend: {
          top: '15',
          textStyle: {
            color: '#fff',
          },
          data: this.legendData,
        },
        xAxis: {
          scale: true,
          splitNumber: 5,
          min: 40,
          max: 100
        },
        yAxis: {
          scale: true,
          // min: 400,
          // max: 100
        },
        series: this.series,
       
      },true);

    
    },
    drawChart(list) {
      this.chart = echarts.init(this.$refs.chart);
      let  _that = this;
      this.chart.setOption({
        
        tooltip: {  
          /*返回需要的信息*/  
          formatter: function(param) {  
            var value = param.value;  
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;"> '
              + value[3]  + '</br>'
              + _that.coordinates.x + ':' + value[0]  + '</br>' + _that.coordinates.y + ':' + value[1] +  '</br>' + '异常距离：' + value[2] +
              '</div>';  
          }  
        },
        legend: {
          top: '15',
          textStyle: {
            color: '#fff',
          },
          data: this.legendData,
        },
        xAxis: {
          scale: true,
          // splitNumber: 5,
          // min: 40,
          // max: 100
        },
        yAxis: {
          scale: true,
          // min: 400,
          // max: 100
        },
        series: this.series,
       
      },true);

    
    },
    select() {
      console.log(this.checkedCities);
    },
    start() {
      this.kmeansQuery.clustersNum = '';
      this.coordinates.x = ''
      this.coordinates.y = ''
      if(this.query.tableName && this.columnList && this.checkedCities.length > 1) {
        this.kmeansDataSet()
      }else {
        this.$message.error('请完成样本筛选')
      }
    },

    openLoading() {
      
      setTimeout(() => {
        loading.close();
      }, 2000);
    },
    // 清洗数据分页方法
    CcalcPageData() {
      // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
      if (this.dataList.length > 1) {
        this.CpageNum = Math.ceil(this.dataList.length / this.CpageSize) || 1;
        console.log("总页数:", this.CpageNum);
      }
      // 数据分组
      for (let i = 0; i < this.CpageNum; i++) {
        // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
        // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
        this.CtotalPageData[i] = this.dataList.slice(
          this.CpageSize * i,
          this.CpageSize * (i + 1)
        );
      }
      // 获取到数据后显示第一页内容,数组下标是从0开始的，这里一定要减去1，不然会丢失一组数据
      this.CdataShow = this.CtotalPageData[this.CcurrentPage - 1];
      console.log(this.CdataShow);
    },
    ChandleSizeChange(newPageSize) {
      this.CpageSize = newPageSize;
      // 重新计算页数并分组
      this.CcalcPageData();
    },
      // 当前页码发生变化
      ChandleCurrentChange(newPageNum) {
      console.log("当前页码:", newPageNum);
      this.CcurrentPage = newPageNum;
      // 这里仍然不要忘记减去1\
      console.log(this.CtotalPageData);

      console.log(this.CdataShow);
      this.CdataShow = this.CtotalPageData[newPageNum - 1];
      console.log(this.CdataShow);
      
    },
  },
  beforeDestroy () {
    if(this.chart != null) {
      this.chart.clear()
    }
  },
};
</script>

<style scoped lang="less">
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.K-means {
  .t {
      background: #edf6ff;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;

      span {
        font-weight: bold;
        color: #00a1f4;
        display: inline-block;
        padding: 8px 0px;
        border-radius: 24px;
        margin: 10px 30px;
       
      
      }
    }
  .screen,
  .result {
    padding: 20px;
    box-shadow: inset 0px 0px 4px #daedff, 0px 0px 3px #1991ff;
    border-radius: 8px;
  }
  .screen {
    margin-bottom: 20px;
    .t {
      background: #edf6ff;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    span {
      font-weight: bold;
      color: #00a1f4;
      display: inline-block;
      padding: 8px 0px;
      border-radius: 24px;
      margin: 10px 30px;
    }
    .el-form {
      .el-form-item {
        float: left;
      }
    }
    .startBtn {
      margin-top: 5px;
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
