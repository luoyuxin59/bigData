// ID3决策
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
            <el-form-item label="请选择入学年份">
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
            <el-form-item label="请选择学历层次">
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
            <el-form-item label="请选择考生层次">
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
          <el-col :span="6">
            <el-form-item label="请选择成绩字段">
              <el-select
                v-model="query.columnName"
                @change="select"
                size="mini"
                placeholder="请选择"
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
                ></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button
                type="primary"
                class="startBtn"
                @click="start"
                size="mini"
                >查询样本</el-button
              >
            </el-form-item>
          </el-col>
        </el-form>
        <!-- <div class="select ">
          <el-checkbox-group  v-model="checkedCities">
            <el-checkbox v-for="(city,index) in fieldList" :label="city" :key="index" @change="select">{{city.column_name}}</el-checkbox>
          </el-checkbox-group>
        </div> -->
      </el-row>
    </div>

    <!-- -->
    <div class="dataSample"  v-show="dataList.length > 0">
      <div class="t">
        <span class="el-icon-caret-right">数据样本</span>
      </div>
      <div>
        <el-row>
          <el-form :model="sampleParameters">
            <el-col :span="6">
            <el-tooltip
                class="item"
                effext="dark"
                content="当设置为True时表示不对决策树进行任何剪枝，此时设置confidenceFactor和minNumObj参数不生效"
                placement="top-start"
              >
              <el-form-item label="不剪枝处理 ">
                <el-select
                  v-model="sampleParameters.unpruned"
                  size="mini"
                  style="width:150px"
                  clearable
                  placeholder="请选择">
                  <el-option label="true" value="true"> </el-option>
                  <el-option label="false" value="false"> </el-option>
                </el-select>
              </el-form-item>
              </el-tooltip>
            </el-col>
             <el-col :span="6">
              <el-tooltip
                class="item"
                effext="dark"
                content="表示将标称属性以二叉形式分裂。当设置为False，表示按多分支方式进行分裂"
                placement="top-start"
              >
              <el-form-item label="二叉形式分裂">
                <el-select
                  v-model="sampleParameters.binary "
                  size="mini"
                  clearable
                  style="width:150px"
                  placeholder="请选择">
                  <el-option label="true" value="true"> </el-option>
                  <el-option label="false" value="false"> </el-option>
                </el-select>
              </el-form-item>
             ></el-tooltip>
            </el-col>
            <el-col :span="6">
            <el-tooltip
                class="item"
                effext="dark"
                content="默认值为0.25，confidenceFactor越小，剪枝越剧烈"
                placement="top-start"
              >
             <el-form-item label="置信水平">
                <el-input style="width:150px" clearable v-model="sampleParameters.confidence " size="mini"></el-input>
              </el-form-item>
              </el-tooltip>
            </el-col>
            <el-col :span="6">
            <el-tooltip
                class="item"
                effext="dark"
                content="设置单个节点数据集中拥有最小样本数的最小支持阈值。"
                placement="top-start"
              >
             <el-form-item label="最小支持度阈值">
                <el-input style="width:150px" clearable v-model="sampleParameters.minNum " size="mini"></el-input>
              </el-form-item>
              </el-tooltip>
            </el-col>
             
          </el-form>
        </el-row>
        <el-row>
        <el-col :span="22">
        <div class="select">
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
        </el-col>
        <el-col :span="2">
        <el-button
          style="width: 80px; height: 28px; margin: -5px 0 5px 15px"
          type="primary"
          class="startBtn"
          @click="analyse"
          size="mini"
          >决策分析</el-button
        >
        </el-col>
        </el-row>
        <span
          style="margin-left: 30px; line-height: 20px; font-size: 18px"
          v-show="num != ''"
          >分类器模型准确率为：
          <span style="color: #67c23a" v-if="num > '60%'">{{ num }}</span>
          <span style="color: #f56c6c" v-else>{{ num }}</span>
        </span>
      </div>
      <el-table :data="CdataShow" border style="width: 100%" height="300">
        <!-- 动态循环的列表 -->
        <template v-for="(item, index) in columnName">
          <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
          <el-table-column :key="index" :prop="item.nameA" :label="item.nameA">
          </el-table-column>
        </template>
      </el-table>
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
      <el-form style="display: flex; flex-wrap: wrap" v-show="num != ''">
        <el-form-item
          style="width: 250px"
          :label="item.nameA"
          label-width="50px"
          v-for="(item, index) in columnName"
          :key="index"
        >
          <el-input
            v-bind:disabled="item.isInput"
            v-model="item.value"
            size="mini"
            style="width: 150px"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- <el-button v-show="num != ''" type="primary" class="forecastBtn" @click="forecast" size="mini">开始预测</el-button> -->
    </div>
    <div class="result">
      <div class="t"><span class="el-icon-caret-right">分析结果</span></div>
      <div
        class="myEchart"
        id="treeChart"
        style="width: 100%; height: 450px"
      ></div>
    </div>

    <el-dialog
      title="节点详细信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-table :data="tableData" border style="width: 100%" height="570">
        <!-- 动态循环的列表 -->
        <template v-for="(item, index) in tableLabel">
          <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
          <el-table-column
            v-if="item.column_comment"
            :key="index"
            :prop="item.column_name"
            :label="item.column_comment"
          >
          </el-table-column>
          <el-table-column v-else :key="index" :prop="item" :label="item">
          </el-table-column>
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import $ from "jquery";
import "../../untils/d3.v3.min.js";
// import '../untils/d3.v3.min.js'

import {
  selectResultPrediction,
  selectTableList,
  getTableList,
  selectDataset,
  logisticDataset,
  getLogisticResult,
  getPredictionResult,
  getYearsList,
  getID3,
} from "../../network/collection";
import { getTree } from "../../untils/echarts";

export default {
  name: "",
  components: {},
  data() {
    return {
      sampleParameters: {
        unpruned: "",
        minNum:'',
        confidence:'',
        binary:''
      },
      tableData: [],
      tableLabel: [],
      dialogVisible: false,
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
      connectionId: "",
      fieldList: [],
      tableList: [],
      query: {
        columnName: "",
        demarcation: "",
        tableName: "",
        level: "",
        year: "",
        cultivationLevel: "",
        studentCategory: "",
        personnelCategory: "",
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
      forecastArr: [], //预测参数
      num: "", //预测准确率
      predictionResults: "", //预测结果
      xData: [], // x轴名称
      vData: [], //  划线数据
      myChart: "",
      selectArr: [],
      changeNum: "",
      showList: [], //保存展示数据
      myChart: "",
      yearOptions: [],
      checkeBoxList:[]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.selectDataset();
  },
  methods: {
    // 获取年份
    getYearsList() {
      let obj = { tableName: this.query.tableName };
      getYearsList(obj).then((res) => {
        this.yearOptions = res.data;
        console.log(this.yearOptions);
      });
    },
    // 判断是否选择了数据表
    isTable() {
      if (this.query.tableName === "") {
        this.$message.error("请先选择数据表");
        this.$notify.error({
          title: "错误",
          message: "请先选择数据表",
        });
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    showChart(treeData, id) {
      console.log(treeData);
      let _this = this;
      d3.selectAll("svg").remove(); //移除svg节点
      var margin = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 80,
        },
        width = $("#" + id).innerWidth(),
        height = $("#" + id).innerHeight();

      var i = 0;

      var tree = d3.layout.tree().size([height, width]);

      var diagonal = d3.svg.diagonal().projection(function(d) {
        return [d.y, d.x];
      });

      var svg = d3
        .select("#" + id)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + ",0)");
      update(treeData);

      function update(source) {
        // Compute the new tree layout.
        var nodes = tree.nodes(source).reverse(),
          links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) {
          d.y = d.depth * 115;
        });

        // Declare the nodes
        var node = svg.selectAll("g.node").data(nodes, function(d) {
          return d.id || (d.id = ++i);
        });

        // Enter the nodes.
        var nodeEnter = node
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
          });

        nodeEnter
          .append("circle")
          .attr("r", 10)
          .style("fill", "#fff");

        nodeEnter
          .append("text")
          .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
          })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
          })
          .text(function(d) {
            return d.name;
          })
          .style("fill", "#000")
          .style("fill-opacity", 1);

        // Declare the links
        var linkEnter = svg
          .selectAll("path.link")
          .append("g")
          .data(links, function(d) {
            return d.target.id;
          });

        linkEnter
          .enter()
          .insert("path", "g")
          .attr("class", "link")
          .attr("d", diagonal)
          .attr("id", function(d, i) {
            return "mypath" + i;
          });

        linkEnter
          .enter()
          .append("text")
          .attr("x", 55)
          .attr("y", 15)
          .style("fill", "#000")
          .style("font-size", "12px")
          .style("font-weight", "100")
          .append("textPath")
          .attr({
            "xlink:href": function(d, i) {
              return "#mypath" + i;
            },
          })
          .text(function(d, i) {
            // console.log(d)
            return d.target.condition;
            // return d.source.condition //+ d.target.condition
          });
        node.on("click", function(data) {
          console.log(data);
          _this.showInfoDialog(data.data);
        });
      }

      // d3Obj.getTree(data, "treeChart")
    },
    showInfoDialog(data) {
      // this.dialogVisible = true;
      console.log(data);
      if (!data) return;
      this.tableLabel = [];
      this.tableData = [];
      console.log(this.checkedCities);
      let list = [];
      data.map((item) => {
        list.push(item.split(","));
      });
      console.log(this.dataList);
      list.forEach((item) => {
        let obj = { 学员ID: item[0] };
        this.dataList.forEach((data) => {
          // console.log(data['学员ID'] + '----' + item['学员ID'] );
          if (data["学员ID"] === item[0]) {
            obj["人员姓名"] = data["人员姓名"];
          }
        });
        for (let i = 0; i < this.checkedCities.length; i++) {
          obj[this.checkedCities[i]] = item[i + 1];
        }
        this.tableData.push(obj);
      });
      this.tableLabel = ["学员ID", "人员姓名"];
      this.checkedCities.forEach((item) => {
        this.tableLabel.push(item);
      });
      this.dialogVisible = true;
    },

    // 去0
    deleteZero(dataList) {
      let key = "体能成绩";
      let key2 = "消费总额";
      let arr = [];
      for (var i = 0; i < dataList.length; i++) {
        dataList[i][key2] = Math.round(Math.random() * 200) + 800 + "";
        dataList[i][key] = Math.round(Math.random() * 50) + 50 + "";
        // if(dataList[i][key] != 0 && dataList[i][key2] != 0) {
        arr.push(dataList[i]);
        // }
        // })
      }
      console.log(arr);
      return arr;
    },
    // 训练样本
    analyse() {
      let obj = this.sampleParameters;
      obj.classField = this.query.columnName 
      if(obj.confidence.indexOf('f') === -1 && obj.confidence != '')   obj.confidence += 'f'
      if(obj.minNum != '') obj.minNum = parseInt(obj.minNum)
      this.analyseArr = [];
      this.dataList.forEach((element) => {
        let obj = {};
        obj["学员ID"] = element["学员ID"];
        this.checkedCities.forEach((item) => {
          obj[item] = element[item];
        });
        this.analyseArr.push(obj);
      });
      let list = [];
      this.analyseArr.forEach((item) => {
        this.checkedCities.forEach((key) => {
          if (key != this.query.columnName) {
            if (key == "体能成绩" && item[key] != 0) {
              list.push(item);
            } else {
              //this.analyseArr.push(obj)
              //break
            }
          }
        });
      });
      console.log(list);
      let list1 = [];
      if (list.length > 0) {
        list.forEach((item) => {
          this.checkedCities.forEach((key) => {
            if (key != this.query.columnName) {
              if (key == "消费总额") {
                list1.push(item);
                // } else {
                //   //this.analyseArr.push(obj)
                //   //break
              }
            }
          });
        });
      } else {
        this.analyseArr.forEach((item) => {
          this.checkedCities.forEach((key) => {
            if (key != this.query.columnName) {
              // && item[key] != 0
              if (key == "消费总额") {
                list1.push(item);
                // } else {
                //     //this.analyseArr.push(obj)
                //     //break
              }
            }
          });
        });
      }

      console.log(list1);
      console.log(list);
      // list1.forEach(it => {
      //   for (var key in list1[0]) {
      //     if(key == '总评成绩' && key != this.query.columnName) {
      //       it[key] =  (it[key] - 24.57) / 68.66 + ''
      //     }else  if (key == '体能成绩' && key != this.query.columnName) {
      //       it[key] = (it[key] - 23.5) / 66.7 + ''
      //     } else if (key == '消费总额' && key != this.query.columnName) {
      //       it[key] = (it[key] - 1.25) / 3799.95 + ''
      //     }
      //   }
      // })
      if (list1.length == 0) {
        list1 = this.analyseArr;
      }
      if (this.checkedCities.length >= 2) {
        console.log(list1.length);
        this.getLogisticResult(obj, list1);
      } else {
        this.$message.error("请选择至少两个字段");
      }
    },
    getLogisticResult(obj, arr) {
      console.log(arr.length);
      const loading = this.$loading({
        lock: true,
        text: "样本训练中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      let paramsObj = {
        dataSet: arr,
        valueMap: {},
      };
      let levelArr = this.query.level.split("/");
      paramsObj.valueMap[this.query.columnName] = levelArr;
      getID3(obj, paramsObj)
        .then((res) => {
          if (res.code == 200) {
            let d3Data = res.data;
            // console.log(res.data);
            // let d3Data = {
            //   name: "借书次数",
            //   condition: "",
            //   children: [
            //     {
            //       name: "借书次数",
            //       condition: "<=7",
            //       children: [
            //         {
            //           name: "借书次数",
            //           condition: " <= 5",
            //         },
            //         {
            //           condition: " > 5",
            //           name: ": A (16.0/6.0)",
            //           data: [
            //             "910402060347,C,7,647.25,",
            //             "910402060347,C,7,647.25,",
            //             "910402060327,A,7,692.02,",
            //           ],
            //         },
            //       ],
            //     },
            //     {
            //       name: ": B (8.0/2.0)",
            //       condition: ">7",
            //       data: [
            //         "910402060336,B,20,774.2,",
            //         "910402060336,B,20,774.2,",
            //         "910402060287,C,8,849.09,",
            //         "910402060287,C,8,849.09,",
            //         "910402060291,B,16,863.4,",
            //         "910402060291,B,16,863.4,",
            //         "910402060296,B,17,952.2,",
            //         "910402060296,B,17,952.2,",
            //       ],
            //     },
            //   ],
            // };
            // let arr = [];
            // arr.push(data);
            // d3Obj.getTree(arr, "echart5")
            console.log(d3Data);

            this.showChart(d3Data, "treeChart");
          }
          loading.close();
        })
        .catch((err) => {
          console.log(err);

          loading.close();
        });
    },
    logisticDataset() {
      if (
        this.query.columnName &&
        this.query.demarcation &&
        this.query.tableName
      ) {
        const loading = this.$loading({
          lock: true,
          text: "样本数据准备中，请稍后...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.3)",
        });
        this.columnName = [];
        this.dataList = [];
        this.showList = [];
        let params = {
          columnName: this.query.columnName,
          tableName: this.query.tableName,
          company: "",
          year: this.query.year,
          cultivationLevel: this.query.cultivationLevel,
          studentCategory: this.query.studentCategory,
          personnelCategory: this.query.personnelCategory,
        };
        logisticDataset(params).then((res) => {
          if (res.code == 200) {
            let selctKey = this.query.columnName;
            let scoreArr = this.query.demarcation.split("/").map(Number);
            let levelArr = this.query.level.split("/");
            res.data.forEach((item) => {
              for (var i = 0; i <= scoreArr.length; i++) {
                if (i == 0) {
                  if (item[selctKey] < scoreArr[i]) {
                    item[selctKey] = levelArr[i];
                    break;
                  }
                } else if (i == scoreArr.length) {
                  if (item[selctKey] >= scoreArr[i - 1]) {
                    item[selctKey] = levelArr[i];
                    break;
                  }
                } else {
                  if (
                    item[selctKey] >= scoreArr[i - 1] &&
                    item[selctKey] < scoreArr[i]
                  ) {
                    item[selctKey] = levelArr[i];
                    break;
                  }
                }
              }
            });
            this.dataList = res.data;
            this.showList = res.data;
            // }
            this.Ctotal = this.dataList.length;
            // 计算页数
            this.CcalcPageData();
            console.log(this.dataList[0]);
            const arr = ['学员ID', '隶属单位','学员类别','入学年份','培养层次', '人员姓名']
            for (var key in this.dataList[0]) {
              let obj = {
                nameA: key,
                value: "",
                isInput: true,
              };
              console.log(obj);
              if(arr.indexOf(key) === -1) this.checkeBoxList.push(obj)
              this.columnName.push(obj);
              
              loading.close();
            }
            
            // 准备checkBoxList
            

          } else {
            loading.close();
            this.$message.error(res.message);
          }
          loading.close();
        });
      } else {
        this.$message.error("请完成样本筛选");
      }
    },
    // 查询表数据
    selectDataset() {
      this.num = "";
      let obj = {
        type: "6",
      };
      selectDataset(obj).then((res) => {
        if (res.code == 200) {
          this.tableList = res.data;
          let arr = [];
          this.tableList.forEach((item) => {
            // if (item.substr(0, 5) == 'math_') {
            console.log(item);
            arr.push(item);
            // }
          });
          this.tableList = arr;
        }
      });
    },
    // 查询表字段
    getTableList(value) {
      this.query.columnName = "";
      this.changeNum = "";
      this.query.demarcation = "";
      this.query.level = "";
      this.query.year = "";
      this.query.cultivationLevel = "";
      this.query.studentCategory = "";
      this.query.personnelCategory = "";
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
        type: "6",
        tableName: value,
        connectionId: this.$store.state.connectionId,
      };
      getTableList(obj).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.fieldList = res.data.columnList;
          this.getYearsList();

          loading.close();
        }
         loading.close();
      });
    },
    //  查询样本
    start() {
      this.logisticDataset();
      console.log(this.columnName);
      this.num = "";
      this.checkedCities = [];
      this.checkedCities.push(this.selectArr);
    },
    selectName(value) {
      this.num = "";
      this.predictionResults = "";
      console.log(value);
      this.columnName.forEach((item) => {
        console.log(item);
        item.value = "";
        item.isInput = true;
        this.checkedCities.forEach((element) => {
          if (item.nameA == this.selectArr) {
            item.isInput = true;
            item.value = 0;
          }
          if (item.nameA == element) {
            item.isInput = false;
          }
        });
      });
    },
    select(value) {
      this.query.demarcation = "";
      this.selectArr = "";
      this.selectArr = value;
      this.checkedCities = [];
      this.dataList = [];
      this.showList = [];
      // this.checkedCities.push(value)
      // console.log(this.checkedCities);
    },
    //  选择0或1
    changeData(value) {
      console.log(value);
      let arr = [];
      if (value != "所有") {
        this.dataList.forEach((item) => {
          if (item[this.selectArr] == value) {
            arr.push(item);
          }
        });
        this.showList = arr;
        this.CcalcPageData();
      } else {
        this.showList = this.dataList;
        this.CcalcPageData();
      }
      this.Ctotal = this.showList.length;
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
      num = num.toString();
      let index = num.indexOf(".");
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1);
      } else {
        num = num.substring(0);
      }
      return parseFloat(num).toFixed(decimal);
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
        width: 360px;
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

#echart5 {
  height: 500px;
  background-color: #ccc;
}
</style>
