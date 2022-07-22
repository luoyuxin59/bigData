<template>
  <div class="Logistic">
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
        </el-col>
           <el-col :span="6">
          <el-form-item label="请选择人员类别" v-if = "query.tableName.indexOf('teacher') != -1">
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
        <el-form-item label="请选择学历层次"  v-if = "query.tableName.indexOf('student') != -1">
          <el-select
            v-model="query.cultivationLevel"
            size="mini"
            placeholder="请选择"
            style="width: 150px"
            clearable
          >
            <el-option label="本科"  value="本科" > </el-option>
            <el-option label="专科"  value="专科" > </el-option>
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
            style="width: 150px">
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
           <el-col :span="6">
        <el-form-item label="请选择分类字段">
          <el-select
            v-model="query.columnName"
            @change="select"
            size="mini"
            placeholder="请选择分类字段"
            style="width: 150px"
            
          >
            <el-option
              v-for="(item, index) in fieldList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
           <el-col :span="6">
        <el-form-item label="请输入分类标准">
          <el-tooltip
            class="item"
            effext="dark"
            content="请按从小到大填写，用/分割"
            placement="top-start"
            
          >
            <el-input
              v-model="query.demarcation"
              size="mini"
              style="width: 150px"
              placeholder="80/85"
              clearable
            ></el-input>
          </el-tooltip>
        </el-form-item>
        </el-col>
           <el-col :span="6">
        <el-form-item label="请输入分类等级">
          <el-tooltip
            class="item"
            effext="dark"
            content="从左至右对应分类标准，用/分割"
            placement="top-start"
          >
            <el-input
              v-model="query.level"
              size="mini"
              style="width: 150px"
              placeholder="差/良/优"
              clearable
            ></el-input>
          </el-tooltip>
        </el-form-item>
        </el-col>
           <el-col :span="6">
        <el-form-item>
          <el-button type="primary" class="startBtn" @click="start" size="mini"
        >查询样本</el-button
      >
        </el-form-item>
        </el-col>
      </el-form>
      </el-row>
      <!-- <div class="select ">
          <el-checkbox-group  v-model="checkedCities">
            <el-checkbox v-for="(city,index) in fieldList" :label="city" :key="index" @change="select">{{city.column_name}}</el-checkbox>
          </el-checkbox-group>
        </div> -->

      
    </div>
    <!-- v-show="dataList.length > 0" -->
    <div class="dataSample" >
      <div class="t">
        <span class="el-icon-caret-right">数据样本</span>
        <el-select
          @change="changeData"
          v-model="changeNum"
          size="mini"
          placeholder="请选择"
        >
          <el-option label="所有" value="所有"> </el-option>
          <el-option
            v-for="(item, index) in query.level.split('\/')"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <span style="color: #333">岭参数λ：</span>
         <el-tooltip
            class="item"
            effext="dark"
            content="L2正则化可以防止模型过度拟合，建议取值范围 [0, 0.1]。岭参数的值越大，影响系统的值越小。"
            placement="top-start" >
        <el-input  style="width:150px"  size="mini" v-model="query.hyperparameter" placeholder=""></el-input>
         </el-tooltip>
         <el-button
          style="width:80px;height:28px; margin: 0 0 5px 15px"
          type="primary"
          class="startBtn"
          @click="analyse"
          size="mini" >训练样本</el-button>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <div class="select ">
          <el-checkbox-group v-model="checkedCities">
            <el-checkbox
              v-for="(city, index) in checkeBoxList"
              :label="city.nameA"
              :key="index"
              @change="selectName"
            >
              {{ city.nameA }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <span
        style="margin-left:30px; line-height:20px; font-size:16px;"
        v-show="num != ''"
        >分类器模型准确率为：
        <span style="color:#67C23A" v-if="num > 0.6">{{ num }}%</span>
        <span style="color:#F56C6C" v-else>{{ num }}%</span>
      </span>
     
        
      </div>
     
      <el-table v-if="CdataShow.length > 0" :data="CdataShow" border style="width: 100%" height="300">
        <!-- 动态循环的列表 -->
        <template v-for="(item, index) in columnName">
          <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
          <el-table-column :key="index" :prop="item.nameA" :label="item.nameA">
          </el-table-column>
        </template>
      </el-table>
       <div v-else>
        暂无数据...
      </div>
      <div class="page">
        <el-pagination
          @size-change="ChandleSizeChange"
          @current-change="ChandleCurrentChange"
          :current-page="CcurrentPage"
          :page-sizes="[5, 10, 15, 30]"
          :page-size="CpageSize"
          :pager-count="5"
          layout="total, sizes, prev, pager, next"
          :total="Ctotal"
          background
        >
        </el-pagination>
      </div>
      <!-- v-show="checkedCities.length > 0" -->
      <el-form style="display: flex; flex-wrap:wrap;" v-show="num != ''">
        <el-form-item
          style="width: 150px;margin-right: 15px;"
          :label="item.nameA"
          v-for="(item, index) in columnName"
          v-if="!item.isInput"
          :key="index"
        >
          <el-input
            v-bind:disabled="item.isInput"
            v-model="item.value"
            size="mini"
            style="width: 100px"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        v-show="num != ''"
        type="primary"
        class="forecastBtn"
        @click="forecast"
        size="mini"
        >开始预测</el-button
      >
    </div>
    <!-- v-show="predictionResults" -->
    <div class="result" v-show="predictionResults">
      <div class="t"><span class="el-icon-caret-right">分析结果</span></div>
      <div style="display: flex">
        <div style=" height: 200px; width:30%;">
          <div>本次预测结果所属{{ predictionResults }}类</div>
        </div>
        <div style="display: flex;">
          <div>
            <el-button
              v-show="predictionResults"
              type="primary"
              class="yingxiang"
              @click="yingxiang"
              size="mini"
              >查看影响系数</el-button
            >
          </div>
          <div class="yingxiangReslut">
            <table
              border="1"
              v-show="result"
              cellspacing="0"
              style="width: 250px;"
            >
              <thead>
                <tr>
                  <th colspan="2">影响系统</th>
                  <!-- <th style="width: 200px">结果</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in result">
                  <td style="width: 150px;">{{ item[0] }}</td>
                  <td style="width: 100px">{{ item[1].toFixed(3) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- <div ref="myEchart" style="width: 600px; height: 300px"></div> -->
      </div>
    </div>
  </div>
</template>
<script>

import {getPersonType, getYearsList, selectResultPrediction, selectTableList, getTableList, selectDataset, logisticDataset, getLogisticResult, getPredictionResult, selectDegree } from "../../network/collection";
export default {
  name: "",
  components: {},
  data() {
    return {
      personTypeOptions:[],
      yearOptions:[],
      checkedCities: [],
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
      fieldList: [],
      tableList: [],
      query: {
        columnName: '',
        demarcation: '',
        tableName: '',
        level: '',
        year:'',
        cultivationLevel: '',
        studentCategory: '',
        personnelCategory: '',
        hyperparameter:''
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
      num: '', //预测准确率
      predictionResults: '', //预测结果
      xData: [], // x轴名称
      vData: [], //  划线数据
      myChart: '',
      selectArr: [],
      changeNum: '',
      showList: [], //保存展示数据
      result: [],
      checkeBoxList:[],
      dataSetList:[]  //保存模型数据
    };
  },
  computed: {},
  created() { },
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
    yingxiang() {
      this.result = []
      selectDegree().then(res => {
        if (res.code == 200) {
          // this.result = res.data;
          res.data.forEach(item => {
            let arr = []
            for (let key in item) {
              arr[0] = key;
              arr[1] = item[key]
              this.result.push(arr)
            }
          });
        }
      })
    },
    // 开始预测
    forecast() {
      this.predictionResults = '';
      this.result = ''
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
        if (item.value) {
          obj[item.nameA] = item.value;
          this.forecastArr.push(obj)
        } else if (item.value === 0) {
          obj[item.nameA] = item.value;
          console.log(obj);
        }
      })
      let levelArr =  this.query.level.split("\/");
      this.forecastArr[0][this.query.columnName] = levelArr[0];
      let arr = this.dataSetList
      let objA = {}
      this.forecastArr.forEach(item => {
        for (let key in item) {
          objA[key] = item[key]
        }
      })
      arr.push(objA)
      console.log(objA);
      for (var key in objA) {
        if (key == '体能成绩' && key != this.query.columnName) {
          objA[key] = (objA[key] - 23.5) / 66.7 + ''
        }
        if (key == '消费总额' && key != this.query.columnName) {
          objA[key] = (objA[key] - 23.5) / 66.7 + ''
        }
        if (key == '总评成绩' && key != this.query.columnName) {
          objA[key] = (objA[key] - 24.57) / 68.66 + ''
        }

      }
      let classFieldObj = {
        classField: this.query.columnName,
      }
      let paramsObj = {
          dataSet: arr,
          valueMap:{}
        }
      paramsObj.valueMap[this.query.columnName] = levelArr
      getPredictionResult(classFieldObj, paramsObj).then(res => {
        console.log(res);
        if (res.code == 200) {
          loading.close()
          this.$message.success(res.message)
          this.predictionResults = res.data;
          selectResultPrediction().then(res => {
            console.log(res);
            if (res.code == 200) {
              let arr = res.data;
              arr.forEach(item => {
                this.xData.push(Object.keys(item)[0])
              })
              arr.forEach(item => {
                this.xData.forEach(element => {
                  if (item[element]) {
                    this.vData.push(item[element])
                  }
                })
              })
            } else {
              this.$message.error(res.message)
              loading.close()
            }

          })
        } else {
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
      let obj = {
        classField: this.query.columnName,
        tableName: this.query.tableName,
        hyperParameter: this.query.hyperparameter

      }
      this.analyseArr = []
      console.log(this.checkedCities);

      this.dataList.forEach(element => {
        let obj = {};
        this.checkedCities.forEach(item => {
          obj[item] = element[item]
        })
        this.analyseArr.push(obj)

      })
      let list = [];
      this.analyseArr.forEach(item => {
        this.checkedCities.forEach(key => {
          if (key != this.query.columnName) {
            if (key == '体能成绩' && item[key] != 0) {
              list.push(item)
            } else {
              //this.analyseArr.push(obj)
              //break
            }
          }
        })
      })
      let list1 = [];
      if (list.length > 0) {
        list.forEach(item => {
          this.checkedCities.forEach(key => {
            if (key != this.query.columnName) {
              if (key == '消费总额' && item[key] != 0) {
                console.log(item);
                list1.push(item)
              } else {
                //this.analyseArr.push(obj)
                //break
              }
            }
          })
        })
      } else {
        this.analyseArr.forEach(item => {
          this.checkedCities.forEach(key => {
            if (key != this.query.columnName) {
              if (key == '消费总额' && item[key] != 0) {
                list1.push(item)
              } else {
                //this.analyseArr.push(obj)
                //break
              }
            }
          })
        })
      }
      console.log(list1);
      // 按照任老师要求对数据处理
      // list1.forEach(it => {
      //   for (var key in list1[0]) {
      //     console.log(key);
      //     if (key == '总评成绩' && key != this.query.columnName) {
      //       it[key] = (it[key] - 24.57) / 68.66 + ''
      //     } else if (key == '体能成绩' && key != this.query.columnName) {
      //       it[key] = (it[key] - 23.5) / 66.7 + ''
      //     } else if (key == '消费总额' && key != this.query.columnName) {
      //       it[key] = (it[key] - 1.25) / 3799.95 + ''
      //     }
      //   }
      // })
      if (list1.length == 0) {
        list1 = this.analyseArr
      }
      if (this.checkedCities.length >= 2) {

        let  paramsObj ={
          dataSet: list1,
          valueMap:{}
        }
        paramsObj.valueMap[this.query.columnName] = this.query.level.split("\/");
        let dataSet = {}
        this.getLogisticResult(obj, paramsObj)
      } else {
        this.$message.error('请选择至少两个字段')
      }

    },
    getLogisticResult(obj, arr) {
      const loading = this.$loading({
        lock: true,
        text: "样本训练中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      getLogisticResult(obj, arr).then(res => {
        if (res.code == 200) {
          console.log(res);
          this.num = this.formatDecimal(res.data.result * 100, 4)
          this.dataSetList = res.data.dataSet
          // this.$message.success(res.message + '预测准确率:' + this.num)
        }
        loading.close()
      }).catch(err => {
        this.$message.error('请求失败')
        loading.close()
      })
    },
    logisticDataset() {
      if (this.query.columnName && this.query.demarcation && this.query.tableName) {
        const loading = this.$loading({
          lock: true,
          text: "样本数据准备中，请稍后...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.3)",
        });
        let params = {
          columnName: this.query.columnName,
          tableName: this.query.tableName,
          company:'',
          year:this.query.year,
          cultivationLevel: this.query.cultivationLevel,
          studentCategory:this.query.studentCategory,
          personnelCategory: this.query.personnelCategory,
        }
        this.columnName = [];
        this.dataList = [];
        logisticDataset(params).then(res => {
          if (res.code == 200) {
            // if (this.query.tableName == 'math_view_student') {
            //   let key = '体能成绩'
            //   res.data.forEach(item => {
            //     if(item[key] != 0) {
            //       this.dataList.push(item);
            //       this.showList.push(item)
            //     }
            //   })
            // }else {
            let selctKey = this.query.columnName;
            let scoreArr = this.query.demarcation.split("\/").map(Number)
            let levelArr = this.query.level.split("\/")

            res.data.forEach(item => {
              for (var i = 0; i <= scoreArr.length; i++) {
                if (i == 0) {
                  if (item[selctKey] < scoreArr[i]) {
                    item[selctKey] = levelArr[i];
                    break;
                  }
                } else if (i == scoreArr.length) {
                  if(item[selctKey] >= scoreArr[i - 1]) {
                    item[selctKey] = levelArr[i];
                    break;
                  }
                }else {
                  if(item[selctKey] >= scoreArr[i -1] && item[selctKey] < scoreArr[i]) {
                    item[selctKey] = levelArr[i];
                    break;
                  }
                }
              }
            })
            this.dataList = res.data;
            this.showList = res.data;
            // }
            this.Ctotal = this.dataList.length;
            // 计算页数
            this.CcalcPageData();
            console.log(this.dataList[0]);
            const arr = ['学员ID', '隶属单位','学员类别','培养层次','入学年份', '人员姓名', '小单位名称', '人员编号','人员类别','小单位代码']
            for (var key in this.dataList[0]) {
              let obj = {
                nameA: key,
                value: '',
                isInput: true,
              }
              if(arr.indexOf(key) === -1) this.checkeBoxList.push(obj)
              this.columnName.push(obj)
              loading.close()
            }
          } else {
            loading.close()
            this.$message.error(res.message)
          }
          loading.close()
        })
      } else {
        this.$message.error('请完成样本筛选')
      }
    },
    // 查询表数据
    selectDataset() {
      this.num = ''
      let obj = {
        type: '3'
      }
      selectDataset(obj).then(res => {
        if (res.code == 200) {
          this.tableList = res.data;
          let arr = []
          this.tableList.forEach(item => {
            // if (item.substr(0, 5) == 'math_') {
              console.log(item);
              arr.push(item)
            // }
          })
          this.tableList = arr;
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
      this.query.columnName = '';
      this.changeNum = ''
      this.query.demarcation = '';
      this.query.level = ''
      this.query.year = ''
      this.query.cultivationLevel = ''
      this.query.studentCategory = ''
       this.query.personnelCategory = ''
       this.CdataShow = [],
       this.checkeBoxList = []
      this.dataList = [];
      this.showList = [];
      this.checkeBoxList = []
      const loading = this.$loading({
        lock: true,
        text: "数据集准备中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      let obj = {
        pageNum: 1,
        pageSize: 1,
        type: '3',
        tableName: value,
        connectionId: this.$store.state.connectionId,
      }
      
      getTableList(obj).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.fieldList = res.data.columnList;
         
          loading.close()
        }
      })
      
    },
    //  查询样本
    start() {
      this.logisticDataset();
      console.log(this.query);
      this.num = ''
      this.checkedCities = []
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
          if (item.nameA == this.selectArr) {
            item.isInput = true;
            item.value = 0
          }
          if (item.nameA == element) {
            item.isInput = false;
          }
        })
      })
    },
    select(value) {
      this.query.demarcation = ''
      this.selectArr = '';
      this.selectArr = value
      this.checkedCities = []
      this.dataList = [];
      this.showList = []
      // this.checkedCities.push(value)
      // console.log(this.checkedCities);

    },
    //  选择0或1
    changeData(value) {
      let arr = []
      if (value != '所有') {
        this.dataList.forEach(item => {
          if (item[this.selectArr] == value) {
            arr.push(item)
          }
        })
        this.showList = arr;
        this.CcalcPageData()
      } else {
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
        /* width: 400px; */
        margin-right: 50px;
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

.yingxiang {
  margin-left: 30px;
}

.yingxiangReslut {
  margin-left: 80px;
}
</style>
