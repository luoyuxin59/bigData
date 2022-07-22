// 加权换算
<template>
  <div class="WeightedConversion">
    <div class="screen clearfix">
      <div class="t"><span class="el-icon-caret-right">筛选样本</span></div>
      <el-row>
      <el-form ref="form" :model="query" label-width="120px">
      <el-col :span="8"> 
      <el-form-item label="请选择大单位">
          <el-select
            v-model="query.departmentId"
            @change="selectUnitList"
            size="mini"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(item, index) in OrganizationList"
              :key="index"
              :label="item.department"
              :value="item.departmentId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
       <el-col :span="8">
        <el-form-item label="请选择小单位">
          <el-select
            v-model="query.unitId"
            @change="getTableList"
            size="mini"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(item, index) in UnitList"
              :key="index"
              :label="item.UNIT"
              :value="item.unitId"
            >
            </el-option>
          </el-select>
        </el-form-item>
       </el-col>
        <el-col :span="8">
          <el-form-item label="请选择专业">
          <el-select
            v-model="query.professionalCode"
            @change="getTableList"
            size="mini"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(item, index) in MajorList"
              :key="index"
              :label="item.professionalName"
              :value="item.professionalName"
            >
            </el-option>
          </el-select>
         </el-form-item>
        </el-col>
        <el-col :span="8">
             <el-form-item label="请选择入学年份">
          <el-select
            v-model="query.enrollmentYear"
            @change="getTableList"
            size="mini"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(item, index) in yearList"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
     <el-col :span="8">
         <el-form-item label="请选择学员层次">
          <el-select
            v-model="query.education"
            @change="getTableList"
            size="mini"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option label="所有" value="1"></el-option>
            <el-option label="本科" value="本科"></el-option>
            <el-option label="大专" value="大专"></el-option>
          </el-select>
        </el-form-item>
     </el-col>
     <el-col :span="8">
      <el-form-item>
        <el-button type="primary" class="startBtn" @click="start" size="mini">开始分析</el-button >
      </el-form-item>
     </el-col>
      </el-form>
      </el-row>
    </div>
    <div class="result">
      <div class="t"><span class="el-icon-caret-right">分析结果</span></div>
      <!-- v-show="tableShow" -->
      <!-- v-show="lineData.length > 1 && lineData.length < 20" -->
      <div v-show="source.length > 0">结果说明：本功能可展示指定范围的学员近三年来文化课加权换算标准分，可用于进行跨专业的横向对比</div>
      <!-- <div ref="columnar" v-show="lineEchart" style="width: 100%;height:400px; margin-top: 50px;"></div> -->

      <div ref="chart" id="chart"    style="width: 100%; height: 300px"></div>
      <div v-show="hotEchart" >注：&nbsp;&nbsp;X轴：单位&nbsp;&nbsp;&nbsp; Y轴：年份</div>
    </div>
    <!-- <div
      v-show="lineData.length > 20"
      ref="chart"
      style="width: 2000px;height:800px; margin-top: 50px;"
    ></div> -->
    <!-- <el-button v-show="tableShow" class="export" @click="exportToExcel" size="mini" type="primary">导出结果</el-button> -->
  </div>
</template>
<script>
import $ from "jquery";
import * as echarts from "echarts";
import {mathMax, mathMin} from "../../untils/mathUtils.js"
import {
  getStudentAchievement,
  OriginalReliability,
  getMajorList,
  selectOrganizationList,
  selectUnitList,
} from "../../network/collection";
import { getHeatmap, getColumnarMap } from "../../untils/echarts";

export default {
  name: "",
  components: {},
  data() {
    return {
      yearList: [
       {
         name: "所有年份",
         value: "1"
      },
      {
         name: "2010",
         value: "2010"
      },
      {
         name: "2011",
         value: "2011"
      },
      {
         name: "2012",
         value: "2012"
      },
      {
         name: "2013",
         value: "2013"
      },
      {
         name: "2014",
         value: "2014"
      },
      {
         name: "2015",
         value: "2015"
      },
      {
         name: "2016",
         value: "2016"
      },
      {
         name: "2017",
         value: "2017"
      },
      {
         name: "2018",
         value: "2018"
      },
      {
         name: "2019",
         value: "2019"
      },
      {
         name: "2020",
         value: "2020"
      },
      {
         name: "2021",
         value: "2021"
      },
      {
         name: "2022",
         value: "2022"
      },
      {
         name: "2023",
         value: "2023"
      },
      {
         name: "2024",
         value: "2024"
      },
      {
         name: "2025",
         value: "2025"
      },
      {
        name: "",
        value: "-1"
      }
      ],
      allOrganization: false, //是否全选所有大单位
      query: {
        enrollmentYear: "", //入学时间
        departmentId: "", // 大单位
        unitId: "", //小单位
        professionalCode: "", //专业
        education: ''
      },
      options: [],
      value: "",
      sourceData: [], //柱状图来源数据
      youngCandidates: [], //青年考生数据
      militaryExaminee: [], //部队考生数据
      unitList: [],
      columnComment: [],
      datalist: [],
      tableShow: false,
      MajorList: [], //  单位列表
      UnitList: [], //小单位lsit
      OrganizationList: [], //大单位list
      lineData: [],
      nameListX: [], // 保存x轴单位的名称
      years: [], //画线存储数据
      series: [],
      yList: [], // 保存年份
      avg: "",
      source: [],
      queryInfo:{
            enrollmentYear: "", //入学时间
            departmentId: "", // 大单位
            unitId: "", //小单位
            professionalCode: "", //专业
          },
      hotEchart: false,
      lineEchart: false
    };
  },
  computed: {},
  created() {
    this.getStudentAchievement();
    this.getMajorList();
    this.selectOrganizationList();
  },
  //  avg: "78.41769497863255"
  // enrollmentYear: "2018"
  // professionalCode: "AE3F1A5C4E8C9A8BE055289DCB9FE050"
  // professionalName: "军事大数据工程（武警内卫总队机动分队指挥）
  mounted() {
    

  },
  methods: {
    // 柱状图

    // 加权平均算法
    getList() {
      this.OriginalReliability();
    },
    // 获取数据
    OriginalReliability() {
      let obj = this.query;
      for (var key in obj) {
        if (obj[key] == "") {
          this.queryInfo[key] = -1;
        } else if (obj[key] == "所有年份") {
          this.queryInfo[key] = "1";
        }else if (obj[key] == "所有专业") {
          this.queryInfo[key] = "1";
        }else{
          this.queryInfo[key] = obj[key]
        }
      }
      this.getOriginalReliability(this.queryInfo)

    },
     getOriginalReliability(obj){
      const loading = this.$loading({
        lock: true,
        text: "AI实时计算中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      OriginalReliability(obj).then((res) => {
        this.hotEchart  = false
        if(res.code === 200) {
          console.log(res.data);
          let isHasYear = false
          for(let key in res.data[0]) {
            console.log(key);
            if(key === 'y') {
              // 走热力图
              isHasYear = true
            }
          }
          isHasYear ? this.heatChart(res.data) : this.columnChart(res.data)
          
        }
        if(res.data.length == 0 ){
          this.hotEchart = false
          this.$message.error('数据为空')
        }
        loading.close();
        })
     },
    // getOriginalReliability(obj){
    //   const loading = this.$loading({
    //     lock: true,
    //     text: "AI实时计算中，请稍后...",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.3)",
    //   });
    //   OriginalReliability(obj)
    //     .then((res) => {
    //       this.hotEchart  = false
    //       // 所有大单位+所有年份
    //       if(obj.departmentId == 1 && obj.enrollmentYear == 1 && obj.professionalCode == -1 && obj.unitId == -1) {
    //         this.nameListX = [];
    //         this.yList = [];
    //         if (res.code == 200) {
    //           console.log(res);
    //           this.lineData = res.data;
    //           console.log(this.lineData);
    //           this.heatChart(this.lineData);
    //           this.lineData.forEach((item) => {
    //             console.log(item.departmentName);
    //             this.yList.push(item.enrollmentYear);
    //             this.nameListX.push(item.departmentName);
    //           });
    //           this.yList = this.unique(this.yList);
    //           this.source.push(this.yList);
    //           this.nameListX = this.unique(this.nameListX);
    //           for (var i = 0; i < this.nameListX.length; i++) {
    //             let arr = [];
    //             arr.push(this.nameListX[i]);
    //             this.lineData.forEach((item) => {
    //               if (this.nameListX[i] == item.departmentName) {
    //                 arr.push(item.avg);
    //               }
    //             });
    //             this.source.push(arr);
    //           }
    //           console.log(this.source);
    //           this.hotEchart =  true
    //           loading.close();
    //         } else {
    //           this.$message.error(res.message);
    //           loading.close();
    //         }
    //       }
          
    //       // 所有大单位+指定年份
    //       if(obj.departmentId == 1 && obj.enrollmentYear != 1 && obj.enrollmentYear != -1 &&  obj.professionalCode == -1 && obj.unitId == -1) {
            
    //         this.nameListX = [];
    //         this.yList = [];
    //         if (res.code == 200) {
    //           console.log(res);
    //           this.lineData = res.data;
    //           console.log(this.lineData);
    //           this.heatChart(this.lineData);
    //           this.lineData.forEach((item) => {
    //             console.log(item.departmentName);
    //             this.yList.push(item.enrollmentYear);
    //             this.nameListX.push(item.departmentName);
    //           });
    //           this.yList = this.unique(this.yList);
    //           this.source.push(this.yList);
    //           this.nameListX = this.unique(this.nameListX);
    //           for (var i = 0; i < this.nameListX.length; i++) {
    //             let arr = [];
    //             arr.push(this.nameListX[i]);
    //             this.lineData.forEach((item) => {
    //               if (this.nameListX[i] == item.departmentName) {
    //                 arr.push(item.avg);
    //               }
    //             });
    //             this.source.push(arr);
    //           }
    //           console.log(this.source);
    //           this.hotEchart =  true
    //           loading.close();
    //         } else {
    //           this.$message.error(res.message);
    //           loading.close();
    //         }
    //       }
          
    //       // 指定大单位 + 所有小单位
    //       if(obj.departmentId != 1 && obj.departmentId != -1 && obj.enrollmentYear == -1 && obj.unitId == 1 && obj.professionalCode ==-1 ){
    //         this.hotEchart =  false
    //         this.nameListX =[];
    //         this.yList = []
    //         if (res.code == 200) {  
    //           this.lineData = res.data
    //           if (this.lineData.length > 1) {
    //             console.log(this.lineData);
    //             for(var i = 0; i <this.lineData.length; i++) {
    //               this.nameListX.push(this.lineData[i].unitName)                  
    //               this.yList.push(this.formatDecimal(this.lineData[i].avg,1))
    //             }
    //             this.columnarChart()
    //             loading.close()
    //             }
    //           }
    //         }
            
    //       // 查询全校
    //       if(obj.departmentId == -1 && obj.enrollmentYear == -1 && obj.unitId == -1 && obj.professionalCode ==-1 ){
    //         this.columnChart(res.data)
    //         loading.close()
    //       }
    //       if(res.data.length == 0 ){
    //           this.hotEchart = false
    //           this.source = []
    //           this.yList = []
    //           this.nameListX = []
    //           this.heatChart(this.lineData);
    //           this.columnarChart()
    //         this.$message.error('数据为空')
    //        }
    //         loading.close();
    //     })
    //     .catch((err) => {
    //       loading.close();
    //     });
    // },
    
    // 处理热力图数据展示
    heatChart(heatmapData) {
      console.log(heatmapData);
      var Xdata = [], // X轴 enrollmentYear
        Ydata = [], // Y轴 departmentName
        Vdata = []; // 数据
      // x轴是enrollmentYear，y轴是departmentName，值是四个相加的和
      $.each(heatmapData, function(index, element) {
        if (Xdata.indexOf(element.x) == -1)
          Xdata.push(element.x);
        if (Ydata.indexOf(element.y) == -1)
          Ydata.push(element.y);
           element.value = element.avg;
 
      });
      $.each(heatmapData, function(index, element) {
        let x = Xdata.indexOf(element.x),
            y = Ydata.indexOf(element.y),    
            v = Number(element.value).toFixed(2);
        Vdata.push([x, y, v]);
      });
      // let min = mathMax(mathArr )
      // let max = mathMin(mathArr )
      var optionH = getHeatmap(Xdata, Ydata, Vdata );
      window.echartObj.showCharts(optionH,'chart')
      var dom = document.getElementById(chart);
        setTimeout(() => {
        let imgEchart = new Image();
        console.log();
       imgEchart = dom.getDataURL({
        type: "png",
        pixelRatio: 1,// 倍数
        // backgroundColor: '#ccc'// 背景
      });
      imgEchart = imgEchart.replace(/^data:image\/\w+;base64,/, "")
      sessionStorage.setItem('WeightedConversion',imgEchart)
      } ,2000)
    },
    // 处理柱状图数据展示
    columnChart(columnData){
      console.log(columnData);
      let xData = [],
          yData = []
      for(var i = 0; i < columnData.length; i++) {
        xData.push(columnData[i].x)        
        yData.push(this.formatDecimal(columnData[i].avg,1))
      }
      console.log(xData, yData);
     let optionC =  getColumnarMap(xData, yData)
     window.echartObj.showCharts(optionC, 'chart')
    },
    deteleObject(obj) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
        }
      }
      uniques = uniques;
      return uniques;
    },
    unique(arr) {
      return Array.from(new Set(arr));
    },
    // 查询大单位
    selectOrganizationList() {
      selectOrganizationList().then((res) => {
        this.OrganizationList = res.data;
        this.OrganizationList.unshift({
          department: "所有大单位",
          departmentId: "1",
        });
      });
    },
    // 查询小单位
    selectUnitList(item) {
      let obj = {
        departmentId: item,
      };
      selectUnitList(obj).then((res) => {
        this.UnitList = res.data;
        this.UnitList.unshift({ UNIT: "所有小单位", unitId: "1" });
      });
    },
    // 获取专业列表
    getMajorList() {
      getMajorList().then((res) => {
        if (res.code == 200) {
          this.MajorList = res.data;
          this.MajorList.unshift({
            professionalName: "所有专业",
            professionalCode: "1",
          });
        }
      });
    },
    getTableList() {},
    columnarChart() {
      console.log(this.yList);
      console.log(this.nameListX);
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.chart);
      console.log(myChart);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        xAxis: [
          {
            type: "category",
            boundarGap: false,
            data: this.nameListX,
            

            axisLabel: {
              interval: 0,
              formatter: function (value) {
                return value.split("").join("\n");
              },
            },
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}",
          },
        },
        // {
        //   type: "value",
        //   name: "平均分",
        //   min: 0,
        //   max: 100,
        //   interval: 10,
        //   axisLabel: {
        //     formatter: "{value}",
        //   },
        // },

        series: [
          {
            data: this.yList,
            type: "bar",
            barWidth: 20,
            itemStyle: {
              width: '50px',
              color: "#1068c0",
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top',  // 在上方显示
                  textStyle: {
                    color: '#333',
                    fontSize: 10
                  }
                }
              }
            },
          },
        ],
        // color: ["#fffb19", "#4ab0ee"],
      },true);
    },

    start() {
      this.getList();
    },
    unique(arr) {
      return Array.from(new Set(arr));
    },
    getStudentAchievement() {
      getStudentAchievement({ parentUnitId: -1 }).then((res) => {
        if (res.code == 200) {
          this.sourceData = res.data.culturalBasis;
          this.$nextTick(() => {
            this.sourceData.forEach((item) => {
              this.unitList.push(item.name);
              this.militaryExaminee.push(item.militaryExaminee);
              this.youngCandidates.push(item.youngCandidates);
            });
          });
        }
      });
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
        this.datalist = [];
        let listA = [];
        let listB = [];
        let obj = {};
        let b = {};
        // for(var i = 0; i < this.sourceData.length; i++) {
        this.sourceData.forEach((item) => {
          obj[item.name] = item.youngCandidates;
          b[item.name] = item.militaryExaminee;
          obj["类别"] = "青年考生";
          b["类别"] = "部队考生";
          listA.push(obj);
          listB.push(b);
        });
        listA = listA[0];
        listB = listB[0];
        this.datalist.push(listA);
        this.datalist.push(listB);
        console.log(this.datalist);
      }, 1000);
    },
    exportToExcel() {
      this.unitList.unshift("类别");
      //excel数据导出
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../excel/Export2Excel");
        const tHeader = this.unitList;
        const filterVal = this.unitList;
        const list = this.datalist;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "采集模板");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
        // 保留两位小数点
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
.WeightedConversion {
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

    .el-form {
      .el-form-item {
        // width: 600px;
        float: left;
      }
    }

    .startBtn {
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }
}
table {
  width: 100%;

  th {
    white-space: nowrap;
  }
}

.export {
  margin: 30px 0 0 50%;
  transform: translateX(-50%);
}

.is-checked {
  background: none !important;
}
</style>
