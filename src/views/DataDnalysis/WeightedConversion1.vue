// 加权换算
<template>
  <div class="WeightedConversion">
    <div class="screen clearfix">
      <div class="t"><span class="el-icon-caret-right">筛选样本</span></div>
      <el-form ref="form" :model="query" label-width="120px">
        <el-form-item label="请选择大单位">
          <el-select v-model="query.departmentId " @change="selectUnitList" size="mini" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in OrganizationList" :key="index" :label="item.department"
              :value="item.departmentId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择小单位">
          <el-select v-model="query.unitId" @change="getTableList" size="mini" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in UnitList" :key="index" :label="item.UNIT" :value="item.unitId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择专业">
          <el-select v-model="query.professionalCode" @change="getTableList" size="mini" filterable placeholder="请选择"
            clearable>
            <el-option v-for="(item,index) in MajorList" :key="index" :label="item.professionalName"
              :value="item.professionalName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择入学年份">
          <el-select v-model="query.enrollmentYear " @change="getTableList" size="mini" filterable placeholder="请选择"
            clearable>
            <el-option v-for="(item,index) in yearList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="startBtn" @click="start" size="mini">开始分析</el-button>
    </div>
    <div class="result">
      <div class="t"><span class="el-icon-caret-right" >分析结果</span></div>
      <!-- v-show="tableShow" -->
        <table  v-if="lineData.length > 1 && lineData.length < 20 " border="1" cellspacing="0" > 
          <thead>
            <tr>
              <th style="width:100px" v-for="(th, index) in lineData" :key="index">
                {{ th.departmentName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="width:100px" v-for="(th, index) in lineData" :key="index">
                {{Math.round(th.avg)}}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else-if="lineData.length  == 1">全校加权平均分为{{lineData.length.toFixed(2)}}</div>
      <table border="1" cellspacing="0" v-else-if="lineData.length > 20 "> 
        <thead>
          <tr>
            <th style="width:100px" v-for="(th, index) in nameListX" :key="index">
              {{ th }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="width:100px" v-for="(th, index) in nameListX" :key="index">
              {{ th.enrollmentYear }}
            </td>
            <!-- <td v-for="(th, index) in lineData"  :key="index">{{th.avg}}</td> -->
          </tr>
          <tr>
            <!-- <td v-for="(th, index) in lineData"  :key="index">{{th.avg}}</td> -->
          </tr>
        </tbody>
      </table>
      <div v-show="lineData.length > 1 && lineData.length < 20 " ref="columnar" style="width: 800px; height:400px; margin-top: 50px;"></div>
    </div>
      <div v-show="lineData.length > 20" ref="brokenLine" style="width: 2000px;height:800px; margin-top: 50px;"></div>
      <!-- <el-button v-show="tableShow" class="export" @click="exportToExcel" size="mini" type="primary">导出结果</el-button> -->
    </div>
</template>
<script>
  import {
    getStudentAchievement, OriginalReliability, getMajorList,
    selectOrganizationList, selectUnitList
  } from "../../network/collection";
  export default {
    name: "",
    components: {},
    data() {
      return {
        yearList: ['所有年份', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        allOrganization: false, //是否全选所有大单位
        query: {
          enrollmentYear: '', //入学时间
          departmentId: '',  // 大单位
          unitId: '', //小单位
          professionalCode: '' //专业
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
        avg: '',
        yList: [],
      };
    },
    computed: {

    },
    created() {
      this.getStudentAchievement();
      this.getMajorList();
      this.selectOrganizationList();
    },
    //  avg: "78.41769497863255"
    // enrollmentYear: "2018"
    // professionalCode: "AE3F1A5C4E8C9A8BE055289DCB9FE050"
    // professionalName: "军事大数据工程（武警内卫总队机动分队指挥）
    mounted() { },
    methods: {
      // 加权平均算法
      getList() {
        this.OriginalReliability()
      },
      OriginalReliability() {
        const loading = this.$loading({
          lock: true,
          text: "AI实时计算中，请稍后...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.3)",
        });
        let obj = this.query;
        for (var key in obj) {
          if (obj[key] == '') {
            obj[key] = '-1'
          } else if (obj[key] == '所有年份') {
            this.query[key] = '1'
          }
        }
        OriginalReliability(obj).then(res => {
          this.nameListX =[];
          this.yList = []
          if (res.code == 200) {
            console.log(res);
            this.lineData = res.data
            if (this.lineData.length > 1) {
              for(var i = 0; i <this.lineData.length; i++) {
                this.nameListX.push(this.lineData[i].departmentName)
                this.yList.push(this.lineData[i].avg)
              }
              this.columnarChart()
            //   // 获取画线数据, 获取x轴单位名称
            //   for (let j = 0; j < this.lineData.length; j++) {
            //     this.yList.push(this.lineData[j].enrollmentYear);
            //     this.nameListX.push(this.lineData[j].professionalName);
            //     if (this.lineData[j].avg == null) {
            //       this.lineData[j].avg = '0';
            //     }
            //   }
            //   console.log(this.lineData);

            //   this.yList = this.unique(this.yList)
            //   this.yList = this.yList.sort()
            //   this.nameListX = this.unique(this.nameListX);
            //   let y = []
            //   for (var i = 0; i < this.yList.length; i++) {
            //     y.push({
            //       years: this.yList[i],
            //       data: []
            //     })
            //   }
            //   for (let i = 0; i < y.length; i++) {
            //     this.lineData.forEach(item => {
            //       if (item.enrollmentYear == y[i].years) {
            //         y[i].data.push(item)
            //       }
            //     })
            //   }
            //   this.years = y
            //   console.log(y.length);
            //   for (let i = 0; i < 1; i++) {
            //     this.years[0].data.forEach(yName => {
            //       this.nameListX.forEach(name => {
            //         if (yName.professionalName != name) {
            //           this.years[0].data.push({ avg: '0', professionalName: name })
            //         }
            //       })
            //     })
            //   }
            //   console.log(this.years[0]);
            //   for (var key in obj) {
            //     if (obj[key] == '-1') {
            //       this.query[key] = ''
            //     }
            //   }
            // }else {
            //   this.avg = this.lineData[0].avg
              for (var key in obj) {
                if (obj[key] == '-1') {
                  this.query[key] = ''
                }
              }
            }
            loading.close();
          } else {
            this.$message.error(res.message)
            loading.close();
          }
        }).catch(err => {
          loading.close();
        })
      },
      deteleObject(obj) {
        var uniques = [];
        var stringify = {};
        for (var i = 0; i < obj.length; i++) {
          var keys = Object.keys(obj[i]);
          keys.sort(function (a, b) {
            return (Number(a) - Number(b));
          });
          var str = '';
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

      // 查询大单位
      selectOrganizationList() {
        selectOrganizationList().then(res => {
          this.OrganizationList = res.data
          this.OrganizationList.unshift({ department: '所有大单位', departmentId: '1' })
        })
      },
      // 查询小单位
      selectUnitList(item) {
        let obj = {
          departmentId: item
        }
        selectUnitList(obj).then(res => {
          this.UnitList = res.data;
          this.UnitList.unshift({ UNIT: '所有小单位', unitId: '1' })
        })
      },
      // 获取专业列表
      getMajorList() {
        getMajorList().then(res => {
          if (res.code == 200) {
            this.MajorList = res.data;
            this.MajorList.unshift({ professionalName: '所有专业', professionalCode: '1' })
          }
        })
      },
      getTableList() { },
      drawLine() {
        this.tableShow = true;
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(this.$refs.brokenLine);
        console.log(this.unitList);
        // 绘制图表
        myChart.setOption({
          title: {
            text: '加权平均分析折线图'
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: this.nameListX
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: [
            {
              type: "category",
              boundarGap: false,
              data: this.yList,
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
          yAxis: [
            {
              type: "value",
              name: "平均分",
              min: 0,
              max: 100,
              interval: 10,
              axisLabel: {
                formatter: "{value}",
              },
            },
          ],
          series: this.series,
          // color: ["#fffb19", "#4ab0ee"],
        });
      },
      columnarChart() {
        console.log(this.yList);
        console.log(this.nameListX);
          // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(this.$refs.columnar);
        console.log(myChart);
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
       
          },
          xAxis: [
            {
              type: "category",
              boundarGap: false,
              data: this.nameListX,
              
              // axisLabel: {
              //   interval: 0,
              //   formatter: function (value) {
              //     return value.split("").join("\n");
              //   },
              // },
              // axisPointer: {
              //   type: "shadow",
              // },
            },
          ],
          yAxis: { type: 'value',
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
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                color: '#1068c0'
              }
            }
          ]
          // color: ["#fffb19", "#4ab0ee"],
        });
      },
      
      start() {
        this.getList()
      

      },
      unique(arr) {
        return Array.from(new Set(arr))
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
          // this.drawLine();
          this.datalist = []
          let listA = []
          let listB = []
          let obj = {}
          let b = {}
          // for(var i = 0; i < this.sourceData.length; i++) {          
          this.sourceData.forEach(item => {
            obj[item.name] = item.youngCandidates;
            b[item.name] = item.militaryExaminee;
            obj['类别'] = '青年考生';
            b['类别'] = '部队考生';
            listA.push(obj)
            listB.push(b)
          })
          listA = listA[0];
          listB = listB[0];
          this.datalist.push(listA)
          this.datalist.push(listB)
          console.log(this.datalist);
        }, 1000);
      },
      exportToExcel() {
        this.unitList.unshift('类别')
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
          width: 600px;
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