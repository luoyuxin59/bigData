// Logistic
<template>
  <div class="Logistic">
    <div class="screen ">
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
            <el-checkbox-group  v-model="checkedCities" >
          <!-- :disabled="city.column_type.substr(0, 7) == 'varchar'" -->
        <el-checkbox  v-for="(city,index) in fieldList" :label="city" :key="index" @change="select(city.column_name)">{{city.column_name}}</el-checkbox>
      </el-checkbox-group>
      <div class="checkbox">
        <el-form  style="display: flex; flex-wrap: wrap;" label-width="100px">
          <!-- <el-col :span="4"> -->
          <el-form-item class="inputItem" style="width: 200px; margin-right:20px;" :label="item.column_name"  v-for="(item, index) in checkedCities" :key="index">
            <el-tooltip class="item" effext="dark" content="请按从小到大填写，用/分割，如：60/70/80" placement="top-start">
               <el-input  v-model="item.value" size="mini" style="width: 100px;" @input="onInput()" ></el-input>
            </el-tooltip>
            <el-tooltip class="item" effext="dark" content="从左至右对应分类标准，用/分割，如：差/良/优" placement="top-start">
               <el-input  v-model="item.value2" size="mini" style="width: 100px;" @input="onInput()" ></el-input>
            </el-tooltip>
               <!-- <el-input  v-model="item.value3" size="mini" style="width: 80px;" @input="onInput()"></el-input> -->
          </el-form-item>
          <!-- </el-col> -->
        </el-form>
        <table  v-if = "query.tableName.indexOf('student') != -1" border="1" cellspacing="0" style="width: 320px;">
          <thead>
            <tr>
              <th style="width: 100px">名称</th>
              <th style="width: 200px">参考取值范围</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>体能成绩</td>
              <td >1-100</td>
            </tr>
            <tr>
              <td>借书次数</td>
              <td>1-20</td>
            </tr>
            <tr>
              <td>就医次数</td>
              <td>1-20</td>
            </tr>
            <tr>
              <td>消费总额</td>
              <td>0-2000</td>
            </tr>
            <tr>
              <td>获奖得分</td>
              <td>0-100</td>
            </tr>
            <tr>
              <td>总评成绩</td>
              <td>0-100</td>
            </tr>
          </tbody>
        </table>
        <table  v-if = "query.tableName.indexOf('teacher') != -1" border="1" cellspacing="0" style="width: 320px;">
          <thead>
            <tr>
              <th style="width: 100px">名称</th>
              <th style="width: 200px">参考取值范围</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>成功得分</td>
              <td >1-100</td>
            </tr>
            <tr>
              <td>教育获奖</td>
              <td>1-100</td>
            </tr>
            <tr>
              <td>立功获奖</td>
              <td>1-100</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <el-row> -->
     
        <!-- </el-row> -->
      <el-button type="primary" class="startBtn" @click="start" size="mini">准备数据集</el-button>
    </div>
    <div class="result" style="margin-bottom: 20px;">
      <div class="t"><span class="el-icon-caret-right">数据集</span></div>
       <!-- <div style="display:flex"> -->
       <el-row>
         <el-form ref="form" :model="form" label-width="120px" v-show="CdataShow.length > 0">
          <el-col :span="8">
          <el-form-item label="请设置规则数量">
             <el-input v-model="aprioriQuery.ruleNum" size="mini" style="width: 180px;"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="8">
           <el-form-item label="评估度量类型">
            <el-select size="mini" v-model="aprioriQuery.metricType" placeholder="请选择">
              <el-tooltip class="item" effext="dark" content="置信度表示一个项集出现时，同一数据集中另一个项集出现的概率。" placement="top-start">
                <el-option   label="Confidence - 置信度"  :value="0"></el-option>
              </el-tooltip>
              <el-tooltip class="item" effext="dark" content="提升度假设 X 和 Y 为相互独立事件，测量项集 X 和 Y 同时发生的频率。" placement="top-start">
                <el-option   label="Lift - 提升度"  :value="1"></el-option>
              </el-tooltip> 
              <el-tooltip class="item" effext="dark" content="杠杆力测量项集 X 和 Y 被记录到同时出现的概率和假设项集 X 和 Y 为相互独立时可能同时出现的概率的差值。" placement="top-start">
                  <el-option   label="Leverage - 杠杆率"  :value="2"></el-option>
              </el-tooltip>
              <el-tooltip class="item" effext="dark" content="测量一个规则的强弱程度。" placement="top-start">
                <el-option   label="Conviction - 可信度"  :value="3"></el-option>
              </el-tooltip> 

          </el-select>
          </el-form-item>
          </el-col>
      </el-form> 
      <el-col :span="8">
         <el-button type="primary" class="startBtn" 
     v-show="CdataShow.length > 0"
      @click="getAprioriResult" size="mini"
      style="margin-left: 47%; width:80px;height:30px;"
        >开始分析</el-button>
        </el-col>
        </el-row>
       <!-- </div> -->
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
      <div class="t"><span class="el-icon-caret-right" >分析结果</span></div>
      <div ref="chart" style="width: 100%; height: 300px"></div>
      <el-button type="primary" class="startBtn" @click="isResult = true" size="mini" v-show="htmlStr" style="margin-left:47%" >查看原始结果</el-button>
      <div v-html="htmlStr" v-show="isResult"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import $ from "jquery";
import {getPersonType, getYearsList, apriori ,selectDataset,getTableList,getAprioriResult,getAprioriResult1} from "../../network/collection";
import {getHeatmap} from "../../untils/echarts";

export default {
  name: "",
  components: {},
  data() {
    return {
      personTypeOptions:[],
      yearOptions:[],
      checkedCities: [], // 已选择的数据
      form: {},
      options: [],
      value: "",
      dataList: [],
      tableList: [],
      fieldList:[],
      tableList:[],
      value1: '',
      query: {
        tableName: '',
        personnelCategory: '',
        year: '',
        cultivationLevel: '',
        studentCategory: ''
      },
      aprioriQuery: {
        ruleNum: '',
        metricType: ''
      },
      columnList: [],
      columnName:[],
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
      htmlStr: '',
      isResult: false,
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
    // apriori进行计算
    getAprioriResult() {
     if(this.aprioriQuery.ruleNum){
        const loading = this.$loading({
        lock: true,
        text: "数据集准备中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      let list = [];
      // this.dataList.forEach(item => {
      //   this.checkedCities.forEach(key => {
      //         if (key.column_name == '体能成绩' && item[key.column_name] != 0) {
      //           list.push(item)
      //         } else {
      //           //this.analyseArr.push(obj)
      //           //break
      //         }
            
      //     })

      //   })
      //   let list1 = [];
      //   if(list.length > 0) {
      //       list.forEach(item => {
      //       this.checkedCities.forEach(key => {
      //           if (key.column_name == '消费总额' && item[key.column_name] != 0) {
      //             list1.push(item)
      //           } else {
      //             //this.analyseArr.push(obj)
      //             //break
      //           }
              
      //       })
      //     })
      //   }else {
      //     this.dataList.forEach(item => {
      //       this.checkedCities.forEach(key => {
      //           if (key.column_name == '消费总额' && item[key.column_name] != 0) {
      //             list1.push(item)
      //           } else {
      //             //this.analyseArr.push(obj)
      //             //break
      //           }
              
      //       })
      //     })
      //   }
      //   let list2 = [];
      //   if(list1.length > 0 ) { 
      //     list1.forEach(item => {
      //       this.checkedCities.forEach(key => {
      //           if (key.column_name == '总评成绩' && item[key.column_name] != 0) {
      //             list2.push(item)
      //           } else {
      //             //this.analyseArr.push(obj)
      //             //break
      //           }
              
      //       })
      //     })
      //   }else {
      //     this.dataList.forEach(item => {
      //       this.checkedCities.forEach(key => {
      //           if (key.column_name == '总评成绩' && item[key.column_name] != 0) {
      //             list2.push(item)
      //           } else {
      //             //this.analyseArr.push(obj)
      //             //break
      //           }
              
      //       })
      //     })
      //   }
        // if(list2.length > 0) {
        //   list2 = this.dataList;
        // }
        // console.log(list2);
        let map ={}
        this.checkedCities.forEach(item => {
          let key = item.column_name;
          map[key] = item.value4;
        })
        let obj ={
          dataSet: this.dataList,
          valueMap:map
        }
      getAprioriResult1(this.aprioriQuery,obj).then(res => {
        if(res.code == 200) {
          this.$message.success(res.message)
          if(res.data.list.length > 0) {
            this.drawChart(res.data.list);
          }
          this.htmlStr = res.data.result;
          loading.close()
        }else {
           loading.close()
          this.$message.error(res.message)
        }
        loading.close()
        console.log(res);
      }).catch(err => {
         loading.close()
      })
     }else {
       this.$message.error('请设置规则数量')
     }
    },
    onInput(){
     this.$forceUpdate();
    },
     // 查询表数据
    selectDataset() {
       let obj = {
        type: '3'
      }
     selectDataset(obj).then(res => {  
       if(res.code == 200) {
         this.tableList =  res.data
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
      if(this.query.tableName.indexOf('student') != -1) {
        this.getYearsList();
      }else {
        // 根据表名查询老师类别
        this.getPersonType()
      } 
       this.checkedCities = []
       this.dataList = []
       this.CdataShow = []
       this.aprioriQuery.ruleNum = ''
       this.aprioriQuery.metricType = ''
        this.query.personnelCategory= ''
        this.query.year= ''
        this.query.cultivationLevel= ''
        this.query.studentCategory= ''
      const loading = this.$loading({
        lock: true,
        text: "数据集准备中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      let obj = {
        pageNum: 1,
        pageSize: 1,
        type: '7',
        tableName: value,
        connectionId: this.$store.state.connectionId,
      }
      getTableList(obj).then(res => {
        console.log(res);
        if(res.code == 200) {
          this.fieldList = res.data.columnComment;
          loading.close()
        }
        loading.close()
      }).catch(err => {
        this.$message.error(err)
         loading.close()
      })
    },
    apriori() {
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
      console.log(this.checkedCities);

      apriori(this.query, this.columnList).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.dataList = res.data;
          for(let key in  this.dataList[0]){
            this.columnName.push(key)
          }
          this.checkedCities.forEach(element => {
            var valueArr =  element.value.split("\/")
            element.value1 = element.value.split("\/").map(Number)
            element.value4 = element.value2.split("\/")
            let key = element.column_name
            element.value1.sort((a,b) => {return a - b});
            console.log(element.value1);
            
            this.dataList.forEach(item => {
              if(item[key]  === '0' || item[key]  == null) {
                item[key] = 0
              }

              let name = item[key]
              item[key] = item[key] * 1;
              for(var i = 0; i <= element.value1.length; i++) { 
                // if(item[key] <= element.value1[i]){
                //   item[key] = '0';
                //   this.dataList delete item
                // }
                if(i == 0) {
                  if(item[key] < element.value1[i]) {
                    item[key] = element.value4[i]
                    break
                  }
                }else if(i == element.value1.length ) {
                  if(item[key] >= element.value1[i-1]) {
                    item[key] =  element.value4[i]
                    break
                  }
                }else {
                  if(item[key] >= element.value1[i-1] && item[key] < element.value1[i]) {
                     item[key]  = element.value4[i] ;
                     break
                   }                             
                }
              }
              console.log( name+ '---'+ item[key]);
              
            })
            console.log(this.dataList);
            
            // this.dataList.forEach(item => {
            //     if( item[key] > element.value) {
            //       item[key]  = '0';
            //     }else {
            //       item[key]  = '1'
            //     }
              
            // })
            console.log(this.dataList[0]);
            
          })
          console.log( this.dataList);
          this.Ctotal = this.dataList.length;
          this.CcalcPageData();
     
          loading.close()
        }
        loading.close()
      }).catch(err => {
        loading.close()
        console.log(err);
      })
    },
    
    drawChart(heatmapData) {
      var Xdata = [], // X轴 premise
        Ydata = [], // Y轴 consequence
        Vdata = []; // 数据
      // x轴是premise，y轴是consequence，值是四个相加的和
      $.each(heatmapData, function(index, element) {
        if (Ydata.indexOf(element.consequence) == -1)
          Ydata.push(element.consequence);
        if (Xdata.indexOf(element.premise) == -1) Xdata.push(element.premise);
        element.value =
          Number(element.leverage) +
          Number(element.confidence) +
          Number(element.lift) +
          Number(element.conviction);
      });
      $.each(heatmapData, function(index, element) {
        let x = Xdata.indexOf(element.premise),
          y = Ydata.indexOf(element.consequence),
          v = Number(element.value).toFixed(2);
        Vdata.push([x, y, v]);
      });
      console.log(Vdata);
      var optionH = getHeatmap(Xdata, Ydata, Vdata);
      console.log(optionH);
      this.showCharts(optionH, "echart7");

    },
    select() {
      console.log(this.checkedCities);
      this.checkedCities.forEach(item => {
        item.value = '';
        item.value1 = '';
        item.value2 = '';
        item.value3 = '';
        // item.value3 = ''
      })
      console.log(this.columnList);
    },
    showCharts(option, domName, mapStyle) {
      console.log(option);
      var dom = this.$refs.chart
      mapStyle = mapStyle || 'healthCN';
      var myChart = echarts.init(dom, mapStyle);
      if (option && typeof option === "object") {
        myChart.clear();
        myChart.setOption(option, true);
        window.addEventListener("resize", function() {
          try {
            myChart.resize();
          } catch (e) {}
        });
      }
     
      setTimeout(() => {
         let imgEchart = new Image();
      imgEchart = myChart.getDataURL({
        type: "png",
        pixelRatio: 1,// 倍数
        // backgroundColor: '#ccc'// 背景
      });
        imgEchart = imgEchart.replace(/^data:image\/\w+;base64,/, "")
        sessionStorage.setItem('Factor',imgEchart)
      },1500)
   
        
      return myChart;
    },
    start() {
      if(this.query.tableName && this.columnList && this.checkedCities.length > 0) {
        this.openLoading();
      }else {
        this.$message.error('请完成样本筛选')
      }
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
        this.apriori();
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
      // 这里仍然不要忘记减去1
      this.CdataShow = this.CtotalPageData[newPageNum - 1];
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
  .screen,
  .result {
    // background-color: #333;
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
    .selectTable {
      display: flex;
      .el-form-item {
        width: 600px;
      }
    }
    .startBtn {
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }
}
.selectBox {
  width: 45%;
  height: 300px;
  background-color: #f5f5f5;
  border: 1px solid rgb(230, 230, 230);
}
.left {
  float: left;
}
.right {
  float: right;
}
.is-checked {
  background: none !important;
}
.spit {
  position: absolute;
  left: 302;
}
.inputItem input{
  float: left;
}
.checkbox {
  display: flex;
  justify-content: space-between;
}
table {
  overflow-x: none;
}

</style>
