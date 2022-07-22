// 接口采集数据清洗
<template>
  <div class="interface-clean">
     <el-row :gutter="24" class="title" style="margin-bottom:30px">
        <el-col style="text-align:center" :span="8"><span>来源数据库地址:{{this.$store.state.tableUrl}}</span></el-col>
        <el-col style="text-align:center" :span="8"><span>来源数据库地址:{{this.$store.state.term}}</span></el-col>
        <el-col style="text-align:center" :span="8"><span>页码:{{this.$store.state.pageNum}}，来源数据共: {{this.$store.state.total}}条</span></el-col>
      </el-row>
    <rules-list :rulesList="rulesList"></rules-list>
    <div class="border">
    <el-row :gutter="24" class="clean-datas ">
      <el-col :span="11" class="unwashed">
        <div class="title">待清洗数据</div>
        <div class="obj-name">
          <ul>
            <li v-for="(item, index) in keyLsit" :key="index">
              {{ item }}
              <span class="iconfont el-icon-plus" @click="addRules"></span>
            </li>
          </ul>
        </div>
         
         <el-table :data="dataShow" border style="width: 100%" height="500">
            <!-- 动态循环的列表 -->
            <template v-for="(item, index) in tableLabel">
              <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
              <el-table-column
                :key="index"
                :prop="item"
                :label="item"
              >
              <template slot="header">
                <span>{{item}}</span>
                  <span class="explain" @click="bindRules(item)">+</span>
              </template>
              </el-table-column>
            </template>
          </el-table>
          <div class="page">
            <el-pagination @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[1,5, 10, 15, 30]"
                :page-size="pageSize"
                :pager-count="5"
                layout="total, sizes, prev, pager, next"
                :total="total" background>
            </el-pagination>
        </div>
          </el-col>  
      <el-col :span="2" class="to-clean">
        <!-- <el-checkbox-group v-model="checkList">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
        </el-checkbox-group> -->
        <el-button type="primary" size="mini" @click="dataClean">清洗>>></el-button>
      </el-col>
      <el-col :span="11" class="clean">
        <div class="title">已清洗数据</div>
      <el-table :data="CdataShow" border  height="500">
          <!-- 动态循环的列表 -->
          <template v-for="(item, index) in tableLabel">
            <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
            <el-table-column
              :key="index"
              :prop="item"
              :label="item"
            >
            </el-table-column>
          </template>
        </el-table>      
        <div class="page">
          <el-pagination @size-change="ChandleSizeChange"
              @current-change="ChandleCurrentChange"
              :current-page="CcurrentPage"
              :page-sizes="[1,5, 10, 15, 30]"
              :page-size="CpageSize"
              :pager-count="5"
              layout="total, sizes, prev, pager, next"
              :total="Ctotal"
              background>
          </el-pagination>
         </div>
      </el-col>
    </el-row>
    <btn btnName="数据入库>>"   class="laodBtn" @click.native="dataLoad"></btn>
    </div>
    <el-dialog
      title="选择清洗规则"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-select v-model="selectValue" multiple placeholder="请选择"  size="mini">
        <el-option
          v-for="item in rulesList"
          :key="item.ruleId"
          :label="item.ruleName"
          :value="item.ruleId">
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
import {selectCleanRulesList, dataClean, cleanData} from "../../network/collection"

import Btn from "../../components/common/Btn.vue";
import RulesList from "../../components/common/RulesList";
import JsonEditor from "../../components/common/JsonEditor.vue";

export default {
  name: "",
  components: {
    RulesList,
    JsonEditor,
    Btn,
  },
  data() {
    return {
      columnName: '', //选择的列名
      cleanData: [],
      selectValue:[],
      dialogVisible: false,  //对话框是否显示
      rulesList: [],
      notCleanData:[],
      tableLabel: [],
      jsonList: {},
      cleanJson: {},
      query: {
        pageNow: 1,
        pageSize: 10
      },
      keyLsit: [],
      rulebindRecord:{
        bindContent: []
        },
      recordIds: [],
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
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getCleanRules()
    this.getJsonList()
    console.log(this.$store.state.pageNum);
    
  },
  methods: {
        // 清洗数据分页方法
    CcalcPageData() {
      // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
      if (this.cleanData.length > 1) {
        this.CpageNum = Math.ceil(this.cleanData.length / this.CpageSize) || 1;
        console.log("总页数:", this.CpageNum);
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

    // 未清洗数据分页方法
    calcPageData() {
      // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
      if (this.notCleanData.length > 1) {
        this.pageNum = Math.ceil(this.notCleanData.length / this.pageSize) || 1;
        console.log("总页数:", this.pageNum);
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
      console.log(this.dataShow);
    },
    // 每页条数发生变化
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      // 重新计算页数并分组
      this.calcPageData();
    },
    // 当前页码发生变化
    handleCurrentChange(newPageNum) {
      console.log("当前页码:", newPageNum);
      this.currentPage = newPageNum;
      // 这里仍然不要忘记减去1
      this.dataShow = this.totalPageData[newPageNum - 1];
    },
    handleClose() {
      this.dialogVisible = false;
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
        dataSout: []
      }
       for(let i = 0; i < this.notCleanData.length; i++) {
        console.log(this.notCleanData[i]);
        let obj = {}
        obj.id = i + 1
        obj.data = this.notCleanData[i]
        params.dataSout.push(obj)
      }
      if (this.recordIds.length > 0) {
         this.cleanData = []
        // this.recordIds = this.recordIds.toString();
        // let recordIds = this.recordIds;
        console.log(recordIds);
        cleanData({ recordIds }, this.notCleanData)
          .then((res) => {
            console.log(res);
            this.cleanData = res.data;
            this.Ctotal = this.cleanData.length;
            this.CcalcPageData();
             this.recordIds = []
   
          })
          .catch((err) => {
            console.log(err);
             this.recordIds = []
          });
      } else {
        this.cleanData = this.notCleanData;
        this.Ctotal = this.cleanData.length;
        this.CcalcPageData();
      }
      if(this.CpageNum != 0) {
        loading.close();
      }
    },
      //绑定清洗规则
    clean(query) {
      dataClean(query).then(res => {
      console.log(res); 
      if(res.code == 200) {
        this.$message.success(res.message)
        this.recordIds.push(res.data.recordId);
        this.selectValue = [];
        this.columnName = ''
        this.rulebindRecord.bindContent = [];
      }else {
        this.$message.error(res.message)
      }
    })
    },
    // 确认绑定
    confirmBind(){
       console.log(this.selectValue);
      let obj = { columnName: "", ruleId: [] };
      obj.columnName = this.columnName;
      // this.columnName;
      obj.ruleId = this.selectValue;
      console.log(obj);
      this.rulebindRecord.bindContent.push(obj);
      this.ruleArr.push(obj)  //用于回显查看绑定的规则
      this.dialogVisible = false;
      this.clean(obj); 
    },
    bindRules(columnName) {
      console.log(columnName);
      this.dialogVisible = true;
      this.columnName = columnName
       this.rulebindRecord.bindContent.forEach(item => {
         if(item.columnName == columnName) {
           console.log(item);
           this.selectValue = item.ruleId;
         }else {
           this.selectValue = []
         }
       })
    },
    getJsonList() {
      this.notCleanData = this.$store.state.notCleanData;
      this.tableLabel = this.$store.state.tableLabel;
      this.tableLabel = this.$store.state.tableLabel;
      this.total =  this.notCleanData.length;
        // 计算页数
      this.calcPageData()
      console.log(this.tableLabel)
      console.log(this.jsonList);
      if(this.jsonList.length > 0) {
        for(var i = 0; i < this.jsonList.length; i++){
          for( var key in this.jsonList.data[i]) {
            this.keyLsit.push(key)
          }
        }
      }
    },
    // 数据入库
    dataLoad() {
       if(this.cleanData.length > 0){
        this.$store.state.cleanJson = this.cleanData;
        this.$router.push('/DataLoad')
       }else {
         this.$message.error('已清洗数据为空')
       }
    },
    getCleanRules() {
      selectCleanRulesList(this.query).then((res) => {
        console.log(res);
        if(res.code == 200) {
          this.rulesList = res.data.list;
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 添加规则
    addRules() {},
  },
};
</script>

<style scoped lang="less">
.interface-clean {
  .clean-datas {
    width: 100%;
    display: flex;
    padding: 0 20px;
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
    .unwashed,
    .clean {
      // width: 50%;
    }
    .unwashed {
      .obj-name {
        line-height: 30px;
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            position: relative;
            padding: 0 15px;
            .iconfont {
              position: absolute;
              top: 2px;
              right: 2px;
              cursor: pointer;
              font-size: 12px;
              font-weight: 700;
            }
          }
        }
      }
    }
    .clean {
      .json-edit {
        margin-top: 30px !important;
      }
    }
  }
  .json-edit {
    margin: 0 !important;
  }
  .btn {
    margin-left: 83%;
  }
}
.cell .explain {
  font-size:20px;
  position: absolute;
   top: -25px;
  right: 2px;
}
.el-dialog__body {
    .el-select {
      width: 100%;
    }
  }
  .laodBtn {
    margin-top: 10px;
  }
.page {
  margin-left: 33%;
}
</style>
