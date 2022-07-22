// ID3决策
<template>
  <div class="Logistic">
    <div class="screen clearfix">
      <div class="t"><span class="el-icon-caret-right">筛选样本</span></div>
      <el-form ref="form" :model="form" label-width="130px">
        <el-form-item label="请选择数据表">
          <el-select
            v-model="query.tableName"
            @change="getTableList"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tableList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="请选择成绩字段">
          <el-select
            v-model="query.columnName"
            @change="select"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in fieldList"
              :key="index"
              :label="item.column_name"
              :value="item.column_name"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="请输入优良分数线">
          <el-input v-model="query.demarcation" size="mini" style="width: 150px"></el-input>
        </el-form-item>
      </el-form>
        <!-- <div class="select ">
          <el-checkbox-group  v-model="checkedCities">
            <el-checkbox v-for="(city,index) in fieldList" :label="city" :key="index" @change="select">{{city.column_name}}</el-checkbox>
          </el-checkbox-group>
        </div> -->
       
      <el-button type="primary" class="startBtn" @click="start"  size="mini">查询样本</el-button>
    </div>
    <!-- v-show="dataList.length > 0" -->
    <div class="dataSample"  v-show="dataList.length > 0">
       <div class="t"><span class="el-icon-caret-right">数据样本</span> 
        <!-- <el-select
            @change="changeData"
            v-model="changeNum"
            size="mini"
            placeholder="请选择"
          >
            <el-option label="所有" value="所有"> </el-option>
            <el-option label="0" value="0"> </el-option>
            <el-option label="1" value="1"> </el-option>
      </el-select> -->
      </div>
        <div   style="display: flex;">
          <div class="select ">
          <el-checkbox-group  v-model="checkedCities">
            <el-checkbox v-for="(city,index) in columnName" :label="city.nameA" :key="index" @change="selectName">{{city.nameA}}</el-checkbox>
          </el-checkbox-group>
        </div>
         <el-button style="width:80px;height:28px; margin: -5px 0 5px 15px"   type="primary" class="startBtn" @click="analyse"  size="mini">决策分析</el-button>
        <span style="margin-left:30px; line-height:20px; font-size:18px;" v-show="num != ''">分类器模型准确率为：
          <span style="color:#67C23A" v-if="num > '60%'">{{num}}</span>
          <span style="color:#F56C6C" v-else>{{num}}</span>

        </span>
        </div>
        <el-table :data="CdataShow" border style="width: 100%" height="300">
            <!-- 动态循环的列表 -->
            <template v-for="(item, index) in columnName">
              <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
               <el-table-column
              :key="index"
              :prop="item.nameA"
              :label="item.nameA"
            >
            </el-table-column>
            </template>
        </el-table>
         <div class="page">
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
 <!-- v-show="checkedCities.length > 0" -->
        <el-form  style="display: flex; flex-wrap:wrap;"  v-show="num != ''">
         <el-form-item style="width: 250px" :label="item.nameA"  label-width="50px" v-for="(item, index) in columnName" :key="index">
          <el-input v-bind:disabled="item.isInput" v-model="item.value" size="mini" style="width: 150px" ></el-input>
        </el-form-item>
        </el-form>
        <el-button v-show="num != ''" type="primary" class="forecastBtn" @click="forecast"  size="mini">开始预测</el-button>
    </div>
    <div class="result">
      <div class="t"><span class="el-icon-caret-right">分析结果</span></div>
      <div id="treeChart" :style="{width: '1200px', height: '300px', padding: '30px'}"></div>
    </div>
  </div>
</template>
<script>
import {selectResultPrediction,selectTableList,getTableList,selectDataset,logisticDataset,getLogisticResult,getPredictionResult,getID3} from "../../network/collection";
export default {
  name: "",
  components: {},
  data() {
    return {
      checkedCities:[],
      form: {},
      options: [],
      value: "",
      value1: "",
      value2: "",
      checkedCities: [], // 已选择的数据
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
      query: {
        columnName: '',
        demarcation: '',
        tableName: '',
      },
      dataList: [],
      columnName: [],
      analyseArr: [],
      inputList: [],
      CtotalPageData: [],

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
      forecastArr: [],  //预测参数
      num:'', //预测准确率
      predictionResults: '', //预测结果
      xData: [], // x轴名称
      vData: [], //  划线数据
      myChart: '',
      selectArr: [],
      changeNum: '',
      showList: [], //保存展示数据
      myChart: ''
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.selectDataset()
  },
  methods: {
    showChart(data) {
      console.log(data);
      
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.getElementById('treeChart'));
      console.log(data);
 
      // 指定图表的配置项和数据
      this.myChart.setOption({
        title: {
            text: ''
        },
        tooltip: {  
          /*返回需要的信息*/  
          formatter: function(param) {   
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;"> '
             + param.data.condition;  
          }  
        },
        series: [
            {
                type: 'tree',
                data: data,
                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',
                symbolSize: 7,
                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 13,
                },
                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                },
                // zlevel: 0,
                z: 1,
                expandAndCollapse: false,
                animationDuration: 550,
                animationDurationUpdate: 750
            }
        ]
      });
      // 使用刚指定的配置项和数据显示图表。
      // this.myChart.setOption(option);
    },
    // 开始预测
    forecast() {
      this.predictionResults = '';
      this.vData = [];
      this.xData = [];
      this.forecastArr = []
      const loading = this.$loading({
        lock: true,
        text: "数据预测中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      console.log(this.columnName);
      this.columnName.forEach(item => {
        let obj = {}
        if(item.value)  {
          obj[item.nameA] = item.value;
          this.forecastArr.push(obj)
        }else if(item.value === 0) {
          obj[item.nameA] = item.value;
          console.log(obj);
        }
        console.log(item.value);
        console.log(this.forecastArr);
        
      })
      this.forecastArr[0][this.forecastArr] = 0;
      let arr = []
      let objA = {}
      this.forecastArr.forEach(item => {
        for(let key in item) {
          objA[key] = item[key]
        }
      })
      arr.push(objA)
      getID3(arr).then(res => {
      console.log(res);
      if(res.code == 200) {
         loading.close()
        this.$message.success(res.message)
        this.predictionResults =  res.data;
        selectResultPrediction().then(res => {
          console.log(res);
          if(res.code == 200 ) {
            let arr = res.data;
            arr.forEach(item => {
              this.xData.push(Object.keys(item)[0])
            })
            arr.forEach(item => {
              this.xData.forEach(element => {
                if(item[element]) {
                  this.vData.push(item[element])
                }
              })
            })
            console.log(this.xData);
            console.log( this.vData)
          }else {
            this.$message.error(res.message)
            loading.close()
          }
       
    })
      }else {
        this.$message.error(res.message)
        loading.close()
      }
    }).catch(err => {
      this.$message.error('请求失败')
      loading.close()
    })
    },
    // 训练样本
    analyse() {
      let key = '成果得分'
      let classFieldObj = {
        classField: this.query.columnName
      }
      this.analyseArr= []
        this.dataList.forEach(element => {
          let obj = {};
          this.checkedCities.forEach(item => {
            obj[item] = element[item]
            if(!obj[item]) {
              obj[item] = 0;
            }
          
          })
          if(obj[key] != 0) {
            this.analyseArr.push(obj)          
          }
       })
      console.log(this.analyseArr);
      if(this.checkedCities.length >= 2) {
        // for(var i = 0; i <= this.checkedCities.length; i++) {
        //   if(this.checkedCities[i] == this.query.columnName ) {
        //     this.checkedCities.splice(i,1)
        //   }
        // }
        console.log(this.checkedCities);
        this.deleteZero(this.checkedCities,this.analyseArr)
        this.getLogisticResult(classFieldObj,this.analyseArr)
      }else {
        this.$message.error('请选择至少两个字段')
      }
     
    },
    deleteZero(keyList,dataList) {
      let arr = [];
      dataList.forEach(item => {
        keyList.forEach(key => {
          if(item[key] != 0) {
            arr.push(item)
          }
        })
      })
      console.log(arr);
      
    },
    getLogisticResult(obj,arr) {
      const loading = this.$loading({
        lock: true,
        text: "样本训练中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      getID3(obj,arr).then(res => {
        if(res.code == 200) {
          console.log(res.data);
          let arr = []
          arr.push(res.data)
          this.showChart(arr)
          
        }
        loading.close()
      }).catch(err => {
         this.$message.error('请求失败')
         loading.close()
      })
    },
    logisticDataset() {
      if(this.query.columnName && this.query.demarcation && this.query.tableName) {
        const loading = this.$loading({
          lock: true,
          text: "样本数据准备中，请稍后...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.3)",
        });
        this.columnName = [];
        this.dataList = [];
        console.log(this.query);
        logisticDataset(this.query).then(res => {
          if(res.code == 200) {
            if(this.query.tableName == 'math_view_student') {
              let key = '体能成绩'
              res.data.forEach(item => {
                if(item[key] != 0) {
                  this.dataList.push(item);
                  this.showList.push(item)
                }
              })
            }else {
              this.dataList = res.data;
              this.showList = res.data;
            }
            this.Ctotal = this.dataList.length;
            
        
        // let arr = [
        //   {
        //     '分数1': '800',
        //     '分数2': '90.1',
        //     '类别': 1,
        //   },
        //   {
        //     '分数1': '800',
        //     '分数2': '90.2',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '800',
        //     '分数2': '90.3',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '800',
        //     '分数2': '90.4',
        //     '类别': 0
        //   },
        //   {
        //     '分数1': '400',
        //     '分数2': '90.5',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '300',
        //     '分数2': '90.6',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '300',
        //     '分数2': '90.7',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '280',
        //     '分数2': '90.2',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '300',
        //     '分数2': '90.6',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '300',
        //     '分数2': '90.8',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '800',
        //     '分数2': '51.3',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '800',
        //     '分数2': '51.1',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '800',
        //     '分数2': '51.4',
        //     '类别': 1
        //   },
        //   {
        //     '分数1': '800',
        //     '分数2': '51.7',
        //     '类别': 0
        //   },
        //   {
        //     '分数1': '1800',
        //     '分数2': '51.0',
        //     '类别': 0
        //   },
        //   {
        //     '分数1': '1800',
        //     '分数2': '51.5',
        //     '类别': 0
        //   }
        // ]
        // 
              // 计算页数
          this.CcalcPageData();
            console.log( this.dataList[0]);
            for(var key in this.dataList[0]) {
              let obj = {
                nameA: key,
                value: '',
                isInput: true,
              }
              this.columnName.push(obj)              
              loading.close()
            }
          }else {
            loading.close()
             this.$message.error(res.message)
          }
          loading.close()
        })
      }else {
        this.$message.error('请完成样本筛选')
      }
    },
     // 查询表数据
    selectDataset() {
      this.num = ''

      selectDataset().then(res => {
        if(res.code == 200) {
          this.tableList = res.data;
          let arr = []
         this.tableList.forEach(item => {
          if(item.substr(0, 5) == 'math_') {
            console.log(item);
            arr.push(item)
          }
        }) 
        this.tableList =  arr;
        }
      })
    },
    // 查询表字段
    getTableList(value) {
      this.query.columnName = '';
      this.query.demarcation = '';
      this.dataList = [];
      this.showList = [];
      const loading = this.$loading({
        lock: true,
        text: "数据集准备中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      let obj = {
        pageNum: 1,
        pageSize: 1,
        tableName: value,
        connectionId: this.$store.state.connectionId,
      }
      getTableList(obj).then(res => {
        console.log(res);
        if(res.code == 200) {
          this.fieldList = res.data.columnComment;
          loading.close()
        }
      })
    },
  //  查询样本
    start() {
      this.logisticDataset();
      console.log(this.columnName);
      this.num = ''
      this.checkedCities =[]
      this.checkedCities.push(this.selectArr)   
    },
    selectName(value) {
      this.num = ''
      this.predictionResults = ''
      console.log(value);
      this.columnName.forEach(item => {
        console.log(item);
        item.value = '';
        item.isInput = true
        this.checkedCities.forEach(element => {
          if(item.nameA == this.selectArr) {
            item.isInput = true;
            item.value = 0
          }
          if(item.nameA == element) {
            item.isInput = false;
          }
        })
      })  
    },
    select(value) {
      this.query.demarcation = ''
      this.selectArr = '';
      this.selectArr = value
      this.checkedCities =[]
      // this.checkedCities.push(value)
      // console.log(this.checkedCities);
     
    },
  //  选择0或1
  changeData(value) {
    console.log(value);
    let arr = []
    if(value != '所有') {
      this.dataList.forEach(item => {
      if(item[this.selectArr] == value){
        arr.push(item)
        }
      })
      this.showList = arr;
      this.CcalcPageData()
    }else {
      this.showList = this.dataList;
      this.CcalcPageData()
    }
    this.Ctotal = this.showList.length;
   },
    drawLine() {
      this.myChart = this.$echarts.init(this.$refs.myEchart);
      var option = {
        xAxis: {
          type: 'category',
          data: this.xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.vData,
            type: 'line',
            smooth: true
          }
        ]
      }
       this.myChart.setOption(option);
    
      
    },
    openLoading() {
      const loading = this.$loading({
        lock: true,
        text: "AI实时计算中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
    },
     // 清洗数据分页方法
     
    CcalcPageData() {
      // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
      if (this.showList.length > 1) { 
        console.log(this.showList.length);
        
        this.CpageNum = Math.ceil(this.showList.length / this.CpageSize) || 1;
        console.log("总页数:", this.CpageNum);
      }
      // 数据分组
      for (let i = 0; i < this.CpageNum; i++) {
        // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
        // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
        this.CtotalPageData[i] = this.showList.slice(
          this.CpageSize * i,
          this.CpageSize * (i + 1)
        );
      }
      // 获取到数据后显示第一页内容,数组下标是从0开始的，这里一定要减去1，不然会丢失一组数据
      this.CdataShow = this.CtotalPageData[this.CcurrentPage - 1];
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
      // 这里仍然不要忘记减去1
      this.CdataShow = this.CtotalPageData[newPageNum - 1];
    },
    // 保留两位小数且不四舍五
    formatDecimal(num, decimal) {
      num = num.toString()
      let index = num.indexOf('.')
      if (index !== -1) {
          num = num.substring(0, decimal + index + 1)
      } else {
          num = num.substring(0)
      }
      return parseFloat(num).toFixed(decimal)
    },
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
.Logistic {
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
  .dataSample,
  .screen,
  .result {
    padding: 20px;
    box-shadow: inset 0px 0px 4px #daedff, 0px 0px 3px #1991ff;
    border-radius: 8px;
  }
  .dataSample {

    margin-bottom: 20px;
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
        width: 400px;
        float: left;
      }
    }
    .startBtn {
      margin-left: 50%;
      transform: translateX(-50%);
      
    }
  }

}
.forecastBtn {
      margin-left: 50%;
      transform: translateX(-50%);
      
    }
</style>
