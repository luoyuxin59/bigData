// 数据入库
<template>
  <div style="height: 100%">
      <!-- <el-row :gutter="24" class="title" style="margin-bottom:30px">
     <el-col style="text-align:center" :span="6" v-show="this.$store.state.dataName"><span>来源数据库名称：{{this.$store.state.dataName}}</span></el-col>
     <el-col style="text-align:center" :span="6" v-show="this.$store.state.tableName"><span>来源数据表名称：{{this.$store.state.tableName}}</span></el-col>
      <el-col style="text-align:center" :span="12" v-show="this.$store.state.tableUrl"><span>来源数据库地址：{{this.$store.state.tableUrl}}</span></el-col>
      <el-col style="text-align:center" :span="12" v-show="this.$store.state.total"><span>页码:{{this.$store.state.pageNum}}，来源数据共: {{this.$store.state.total}}条</span></el-col>
     </el-row> -->
     <el-row :gutter="24" class="title" style="margin-bottom:30px">
      <el-col style="text-align:center" :span="8"><span>来源数据库地址:{{this.$store.state.tableUrl}}</span></el-col>
      <el-col style="text-align:center" :span="8"><span>来源数据库地址:{{this.$store.state.term}}</span></el-col>
      <el-col style="text-align:center" :span="8"><span>页码:{{this.$store.state.pageNum}}，来源数据共: {{this.$store.state.total}}条</span></el-col>
    </el-row>
   <div class="data-load">
    <div class="parameter">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="历史连接">
          <el-select
            placeholder="请选择历史连接"
            @clear="historyConnection"
            clearable
            v-model="history"
            @change="selectConnection(history)"
          >
            <el-option
              :label="item.connectionName"
              :value="item.connectionName"
              v-for="(item, index) in historyConnect"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="连接名称" prop="connectionName">
          <el-input v-model="form.connectionName"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称" prop="connectionDatabaseName">
          <el-input v-model="form.connectionDatabaseName"></el-input>
        </el-form-item>
        <el-form-item label="数据库URL" prop="connectionAddress">
          <el-input v-model="form.connectionAddress"></el-input>
        </el-form-item>
        <el-form-item label="数据库端口" prop="connectionPort">
          <el-input v-model="form.connectionPort"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="connectionUsername">
          <el-input v-model="form.connectionUsername"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="connectionPassword">
          <el-input v-model="form.connectionPassword"></el-input>
        </el-form-item>
        <btn class="load" btnName="连接至数据库" @click.native="loadData"></btn>
      </el-form>
      <!-- <el-tree
        node-key="id"
        :default-expanded-keys="[1]"
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree> -->
      <!--  -->
    
    </div>
    <div class="preview">
      <div class="title">数据预览>>></div>
      <div class="detail">
        <div class="tableV" >
          <el-table :data="tableData" border style="width: 100%" height="570">
            <!-- 动态循环的列表 -->
            <template v-for="(item, index) in tableLabel">
              <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
              <el-table-column v-if="item.column_comment"
                :key="index"
                :prop="item.column_name"
                :label="item.column_comment"
              >
              </el-table-column>
            <el-table-column v-else
              :key="index"
              :prop="item.column_name"
              :label="item.column_name"
            >
            </el-table-column>
            </template>
          </el-table>
  
          <div class="page" >
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="1"
              :pager-count="5"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>

      </div>
      <el-row :gutter="24" class="loadBtn btns">
        <el-col :span="8">
          <el-select filterable class="dataList" @change="getLsit()" v-model="value" placeholder="请选择" >
            <el-option
              v-for="(item, idnex) in options"
              :key="idnex"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8"><btn  btnName="加载至此表" @click.native="load"></btn></el-col>
        <el-col :span="8"><btn @click.native="getLsit" btnName="刷新数据"></btn></el-col>
      </el-row>
    </div>
  </div>
  </div>
</template>
<script>
import   "../../router/index.js"

import Btn from "../../components/common/Btn.vue";
import TableV from "../../components/common/TableV.vue";
import JsonEditor from "../../components/common/JsonEditor.vue";

import {
  connectionTest,
  selectTableList,
  getTableList,
  dataLoading,
  selectConnectionList
} from "../../network/collection";
export default {
  name: "",
  components: {
    Btn,
    TableV,
    JsonEditor,
  },
  data() {
    return {
      dataList: "", //入库数据
      history: "",
      historyConnect: [],
      value: "",
      options: [],
      total: 0,
      form: {
        connectionAddress: "", //url
        connectionDatabaseName: "", // 数据库名
        connectionName: "", // 连接名称  自定义
        connectionPassword: "", //密码
        connectionPort: "", //端口
        connectionUsername: "", //用户名
        connectionType: 1,
      },
      tableData: [],
      tableLabel: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      query: {
        connectionId: "",
        type: "7",
        pageNum: 1,
        pageSize: 6,
        tableName: 0,
      },
      loadInfo:   {
        connectionId:null,
        tableName:"",
        values:{},
        },
      jsonList: [],
      oldRouter: '',
    };
  },
  computed: {},
  created() {},
  mounted() {
     // this.getLsit();
    this.selectConnectionList();

  },
  methods: {
      // 不选择历史连接
    historyConnection() {
      console.log(this.$refs.form);
      //  .resetFields()
      this.form.connectionAddress = "";
      this.formconnectionAddress = ""; //url
      this.formconnectionDatabaseName = ""; // 数据库名
      this.formconnectionName = ""; // 连接名称  自定义
      this.formconnectionPassword = ""; //密码
      this.formconnectionPort = ""; //端口
      this.formconnectionType = ""; //数据库类型
      this.formconnectionUsername = ""; //用户名
    },
    // 选择历史连接
    selectConnection(name) {
      console.log(name);
      this.historyConnect.forEach((item) => {
        console.log(item)
        if (item.connectionName == name) {
          item.connectionType = item.connectionType.toString();
          this.form = item;
        }
      });
    },
    // 查询历史连接
    selectConnectionList() {
      selectConnectionList()
        .then((res) => {
          if (res.code == 200) {
            this.historyConnect = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 翻页
    handleCurrentChange(val) {
       this.query.pageNum = val;
       this.getLsit();
    },
    // 查询数据库数据
    getLsit() {
      console.log(this.query);
     // console.log( this.$store.state.cleanData);
     // this.tableLabel = this.$store.state.tableLabel;
     // this.tableData = this.$store.state.cleanData;
     // this.jsonList = this.$store.state.cleanJson;
      console.log(this.$store.state.jsonList);
      console.log(this.jsonList.length);
      console.log(this.tableData.length);
      this.query.tableName = this.value;
       getTableList(this.query).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.tableLabel = res.data.columnComment;
            this.tableData = res.data.record;
            this.total = parseInt(res.data.totalCount);
            console.log(this.tableLabel);
            console.log(this.tableData);
          }
        })
        .catch((err) => {
          console.log(err);
        }); 
    },
    // 加载至表
    load() {
    // console.log( this.$store.state.cleanData);
     // this.tableLabel = this.$store.state.tableLabel;
      this.dataList = this.$store.state.cleanData;
      this.jsonList = this.$store.state.cleanJson;
      console.log( this.$store.state.cleanData);
      console.log(this.tableData);
      this.query.tableName = this.value;
      this.loadInfo.connectionId = this.query.connectionId;
      this.loadInfo.tableName = this.query.tableName;
      if(this.dataList.length > 0) {
        console.log(this.dataList);
        this.loadInfo.values = this.dataList; 
        this.dataLoading()
      }else if(this.jsonList.length > 0) {
        this.loadInfo.values = this.jsonList;
        let keyList = [];
        console.log(this.jsonList)
        for(var key in this.jsonList[0]) {
          keyList.push(key)
         }
      for(var i=0; i<this.jsonList.length; i++) {
        keyList.forEach(item => {
         if(this.jsonList[i][item] == null) {
           this.jsonList[i][item] = '';
         }
        })
      }
      console.log(this.jsonList)
      this.dataLoading()
      }else {
        this.$message.error('暂无入库数据')
      }
    },
    dataLoading() {
      console.log(this.loadInfo);
      dataLoading(this.loadInfo).then(res => {
        console.log(res);
        if(res.code == 200) {
          this.$message.success(res.message)
          this.dataList = [];
          this.$store.state.cleanData =[];
          this.jsonList = [];
          this.$store.state.cleanJson =[];
          this.$store.state.dataName= "";
          this.$store.state.tableName= "";
          this.$store.state.tableUrl= "";
          this.$store.state.total= "";
          
        }else{
          this.$message.error(res.message)
        }
      }).catch(err => { 
        console.log(err);
      })
      console.log( this.$store.state.tableList);   
      console.log( this.loadInfo.values)
    },
    
    refresh() {
      //刷新数据
    },
    // 连接数据库
    loadData() {
      selectTableList(this.form)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.options = res.data.tableList;
            this.query.connectionId = res.data.connectionId;
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleNodeClick() {},
  },
};
</script>

<style scoped lang="less">
.data-load {
  display: flex;
  height: 90%;
  .parameter,
  .preview {
    height: 100%;
    padding: 20px;
    box-shadow: inset 0px 0px 4px #daedff, 0px 0px 3px #1991ff;
    border-radius: 8px
  }
  .parameter {
    height: 106%;
    width: 400px;
    margin-right: 20px;
    box-sizing: border-box;
    padding: 0 60px 0 60px;
    .el-form {
      border-bottom: 1px dotted #ccc;
      padding-top: 100px;
      .el-select {
        width: 100%;
      }
      .load {
        font-size: 14px;
        margin-bottom: 20px;
      }
    }
    .dataList {
      margin: 30px 0 0 80px;
    }
    .el-tree {
      width: 180px;
      margin: 30px 50px 0 30px;
      border: 1px solid #a7d9fe;
      border-radius: 7px;
      .preview .el-tree .el-tree-node .el-tree-node__content {
        background-color: #000;
      }
    }
    .refresh {
      margin-top: 30px;
    }
  }
  
  .preview {
    width: 70%;
    .detail {
      width: 100%;
      display: flex;
      .tableV {
        //flex: 1;
        width:100%
      }
    }
  }
  .loadBtn {
      margin: 10px 0 0 10%;

    }
}

</style>
