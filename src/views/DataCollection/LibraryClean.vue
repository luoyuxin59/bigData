// 数据库采集数据清洗
<template>
  <div class="library-clean">
    <el-row :gutter="24" class="title" style="margin-bottom:30px">
      <!-- <el-col style="text-align:center" :span="6" v-show="this.$store.state.dataName"><span>来源数据库名称：{{this.$store.state.dataName}}</span></el-col> -->
      <!-- <el-col style="text-align:center" :span="6" v-show="this.$store.state.tableName"><span>来源数据表名称：{{this.$store.state.tableName}}</span></el-col> -->
      <el-col
        style="text-align:center"
        :span="12"
        v-show="this.$store.state.tableUrl"
        ><span>来源数据库地址：{{ this.$store.state.tableUrl }}</span></el-col
      >
      <el-col
        style="text-align:center"
        :span="12"
        v-show="this.$store.state.total"
        ><span>来源数据共: {{ this.$store.state.total }}条</span></el-col
      >
    </el-row>
    <rules-list :rulesList="rulesList"></rules-list>
    <el-row :gutter="24" class="clean-datas">
      <el-col :span="11" class="unwashed">
        <div class="title">待清洗数据</div>
        <!-- <div class="title">{{tableLabel[0].column_comment}}</div> -->
        <div class="tableContent">
          <el-table :data="dataShow" border height="450" width="100%">
            <!-- 动态循环的列表 -->
            <template v-for="(item, index) in tableLabel">
              <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
              <el-table-column
                v-if="item.column_comment != ''"
                :key="index"
                :prop="item.column_name"
                :label="item.column_comment"
              >
                <template slot="header">
                  <span>{{ item.column_comment }}</span>
                  <span class="explain" @click="bindRules(item.column_name)"
                    >+</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :key="item.column_name"
                :prop="item.column_name"
                :label="item.column_name"
              >
                <template slot="header">
                  <span>{{ item.column_name }}</span>
                  <span class="explain" @click="bindRules(item.column_name)"
                    >+</span
                  >
                </template>
              </el-table-column>
            </template>
          </el-table>
          <div class="page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[1, 5, 10, 15, 30]"
              :page-size="pageSize"
              :pager-count="5"
              layout="total, sizes, prev, pager, next"
              :total="total"
              background
            >
            </el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="2" class="to-clean">
        <el-button type="primary" size="mini" @click="dataClean"
          >清洗>>></el-button
        >
      </el-col>
      <el-col :span="11" class="clean">
        <div class="title">已清洗数据</div>
        <div class="tableContent">
          <el-table :data="CdataShow" border height="450" width="100%">
            <!-- 动态循环的列表 -->
            <template v-for="(item, index) in tableLabel">
              <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
              <el-table-column
                v-if="item.column_comment != ''"
                :key="index"
                :prop="item.column_name"
                :label="item.column_comment"
              >
                <template slot="header">
                  <span>{{ item.column_comment }}</span>
                  <span class="explain" @click="bindRules(item.column_name)"
                    >+</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :key="item.column_name"
                :prop="item.column_name"
                :label="item.column_name"
              >
                <template slot="header">
                  <span>{{ item.column_name }}</span>
                  <span class="explain" @click="bindRules(item.column_name)"
                    >+</span
                  >
                </template>
              </el-table-column>
            </template>
          </el-table>
          <div class="page">
            <el-pagination
              @size-change="ChandleSizeChange"
              @current-change="ChandleCurrentChange"
              :current-page="CcurrentPage"
              :page-sizes="[1, 5, 10, 15, 30]"
              :page-size="CpageSize"
              :pager-count="5"
              layout="total, sizes, prev, pager, next"
              :total="Ctotal"
              background
            >
            </el-pagination>
          </div>
          <btn
            btnName="数据入库>>"
            class="laodBtn"
            @click.native="dataLoad"
          ></btn>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="选择清洗规则"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-select
        v-model="selectValue"
        multiple
        placeholder="请选择"
        size="mini"
      >
        <el-option
          v-for="item in rulesList"
          :key="item.ruleId"
          :label="item.ruleName"
          :value="item.ruleId"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBind">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import {
  selectCleanRulesList,
  dataClean,
  cleanData,
} from "../../network/collection";
import Btn from "../../components/common/Btn.vue";
import RulesList from "../../components/common/RulesList.vue";

export default {
  name: "",
  components: {
    Btn,
    // TableV,
    RulesList,
  },
  data() {
    return {
      columnName: "", //选择的列名
      selectValue: [],
      dialogVisible: false, //对话框是否显示
      rulesList: [],
      notCleanData: [],
      cleanData: [],
      query: {
        pageNow: 1,
        pageSize: 10000,
      },
      tableLabel: [],
      rulebindRecord: {
        bindContent: [],
      },
      recordIds: [],
      dataList: [], //数据清洗
      totalPageData: [],
      CtotalPageData: [],
      // 共几页
      pageNum: 1,
      CpageNum: 1,
      // 每页显示数量
      pageSize: 5,
      CpageSize: 5,
      // 当前显示页码
      currentPage: 1,
      CcurrentPage: 1,
      // 总共多少条数据
      total: 0,
      Ctotal: 0,
      // 当前要显示的数据
      dataShow: [],
      CdataShow: [],
      ruleArr: [],
    };
  },
  computed: {},
  created() {
    //  this.getCacheData();
  },
  mounted() {
    this.selectCleanRulesList();
    this.getList();
    // if (this.cleanData.length == 0) this.getList();
  },
  methods: {
   
    getList() {
      this.notCleanData = this.$store.state.notCleanData;
      this.tableLabel = this.$store.state.tableLabel;
      this.cleanData = this.$store.state.cleanData;
      this.total = this.notCleanData.length;
      console.log(this.cleanData );
      // 计算页数
      this.calcPageData();
      this.CcalcPageData()
    },
    // 清洗数据分页方法
    CcalcPageData() {
      // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
      if (this.cleanData.length > 1) {
        this.CpageNum = Math.ceil(this.cleanData.length / this.CpageSize) || 1;
      }
      // 数据分组
      for (let i = 0; i < this.CpageNum; i++) {
        // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
        // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
        this.CtotalPageData[i] = this.cleanData.slice(
          this.CpageSize * i,
          this.CpageSize * (i + 1)
        );
      }
      // 获取到数据后显示第一页内容,数组下标是从0开始的，这里一定要减去1，不然会丢失一组数据
      this.CdataShow = this.CtotalPageData[this.CcurrentPage - 1];
      console.log( this.CdataShow);
    },
    ChandleSizeChange(newPageSize) {
      this.CpageSize = newPageSize;
      // 重新计算页数并分组
      this.CcalcPageData();
    },
    // 当前页码发生变化
    ChandleCurrentChange(newPageNum) {
      this.CcurrentPage = newPageNum;
      // 这里仍然不要忘记减去1
      this.CdataShow = this.CtotalPageData[newPageNum - 1];
    },

    // 未清洗数据分页方法
    calcPageData() {
      // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
      if (this.notCleanData.length > 1) {
        this.pageNum = Math.ceil(this.notCleanData.length / this.pageSize) || 1;
      }
      // 数据分组
      for (let i = 0; i < this.pageNum; i++) {
        // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
        // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
        this.totalPageData[i] = this.notCleanData.slice(
          this.pageSize * i,
          this.pageSize * (i + 1)
        );
      }
      // 获取到数据后显示第一页内容,数组下标是从0开始的，这里一定要减去1，不然会丢失一组数据
      this.dataShow = this.totalPageData[this.currentPage - 1];
    },
    // 每页条数发生变化
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      // 重新计算页数并分组
      this.calcPageData();
    },
    // 当前页码发生变化
    handleCurrentChange(newPageNum) {
      this.currentPage = newPageNum;
      // 这里仍然不要忘记减去1
      this.dataShow = this.totalPageData[newPageNum - 1];
    },
    dataLoad() {
      if (this.cleanData.length > 0) {
        this.$store.state.cleanData = this.cleanData;
        this.$router.push("/DataLoad");
      } else {
        this.$message.error("已清洗数据为空");
      }
    },
    // 数据清洗
    dataClean() {
      const loading = this.$loading({
        lock: true,
        text: "数据清洗中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let params = {
        recordIds: this.recordIds,
        dataSout: [],
      };
      for (let i = 0; i < this.notCleanData.length; i++) {
        let obj = {};
        obj.id = i + 1;
        obj.data = this.notCleanData[i];
        params.dataSout.push(obj);
      }
      if (this.recordIds.length > 0) {
        // this.recordIds = this.recordIds.toString();
        // let recordIds = this.recordIds;
        this.cleanData = [];
        cleanData(params)
          .then((res) => {
            // this.cleanData = res.data;
            res.data.forEach((item) => {
              this.cleanData.push(item.data);
            });
            this.Ctotal = this.cleanData.length;
            this.CcalcPageData();
            this.recordIds = [];
          })
          .catch((err) => {
            console.log(err);
            this.recordIds = [];
          });
      } else {
        this.cleanData = this.notCleanData;
        this.Ctotal = this.cleanData.length;
        this.CcalcPageData();
      }
      if (this.CpageNum != 0) {
        loading.close();
      }
    },
    //绑定清洗规则
    clean(query) {
      dataClean(query)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
            this.recordIds.push(res.data.recordId);
            this.selectValue = [];
            this.columnName = "";
            this.rulebindRecord.bindContent = [];
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.rulebindRecord.bindContent = [];
        });
    },
    // 确认绑定
    confirmBind() {
      let obj = { columnName: "", ruleId: [] };
      obj.columnName = this.columnName;
      // this.columnName;
      obj.ruleId = this.selectValue;
      this.rulebindRecord.bindContent.push(obj);
      this.ruleArr.push(obj); //用于回显查看绑定的规则
      this.dialogVisible = false;
      this.clean(obj);
    },
    bindRules(columnName) {
      this.dialogVisible = true;
      this.columnName = columnName;
      this.selectValue = [];
      this.ruleArr.forEach((item) => {
        if (item.columnName === columnName) {
          this.selectValue = item.ruleId;
        }
      });
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 查询所有规则
    selectCleanRulesList() {
      selectCleanRulesList(this.query)
        .then((res) => {
          if (res.code == 200) {
            this.rulesList = res.data.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="less">
.library-clean {
  .clean-datas {
    width: 100%;
    display: flex;
    box-shadow: inset 0px 0px 4px #daedff, 0px 0px 3px #1991ff;
    border-radius: 8px;
    padding: 0 20px 10px 20px;
    .to-clean {
      flex: 0.1;
      padding: 70px 20px 0 20px;
      .el-checkbox {
        line-height: 30px;
      }
      .el-button {
        margin: 15px 0;
      }
    }
    .tableContent {
      .explain {
        position: absolute;
        top: 0;
        right: 0;
        font-weight: 700;
        color: #000;
        font-size: 18px;
      }
    }
  }
  .laodBtn {
    margin-top: 10px;
  }
  .el-dialog__body {
    .el-select {
      width: 100%;
    }
  }
}
.el-row {
  margin: 0 !important;
}
</style>
