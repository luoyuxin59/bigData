<template>
  <div class="library-collection">
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
        <el-form-item label="数据库类型">
          <el-select
            v-model="form.connectionType"
            placeholder="请选择数据库类型"
            prop="connectionType"
          >
            <el-option label="mysql" value="1"></el-option>
            <el-option label="sqlserver" value="2"></el-option>
            <el-option label="oracle" value="3"></el-option>
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
        <el-form-item label="当前页" prop="connectionPassword">
          <el-input v-model="query.pageNum"></el-input>
        </el-form-item>
        <el-form-item label="每页条数" prop="connectionPassword">
          <el-input v-model="query.pageSize"></el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <btn btnName="连接测试" @click.native="connectionTest"></btn>
        <btn btnName="创建连接" @click.native="createConnection"></btn>
        <btn btnName="数据抽取" @click.native="dataExtraction"></btn>
      </div>
      <div class="message" v-show="tableData.length">
        抽取成功，本次共抽取数据{{ tableData.length }}条。
      </div>
    </div>
    <div class="preview">
      <div class="title">数据预览>>></div>
      <div class="detail">
        <!-- <el-tree
          :load="loadNode"
          lazy
          accordion
          @node-click="getTableList"
          :props="data"
          node-key="id"
          :default-expanded-keys="[-1]"
          :highlight-current="true"
        >
        </el-tree> -->
        <div class="demo-input-suffix" style="display: flex">
          <el-select
            v-model="value"
            @change="getTableList"
            size="mini"
            filterable
            placeholder="请选择"
            style="width:150px; margin-right:50px"
          >
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="input"
            style="width:150px; margin-right: 30px"
            size="mini"
            placeholder="全文搜索"
          ></el-input>
          <el-button size="mini" type="primary" @click="search">搜索</el-button>
        </div>
        <div class="table">
          <el-table :data="dataShow" border style="width: 100%" height="500">
            <!-- 动态循环的列表 -->
            <template v-for="(item, index) in tableLabel">
              <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
              <el-table-column
                v-if="item.column_comment != ''"
                :key="index"
                :prop="item.column_name"
                :label="item.column_comment"
              >
              </el-table-column>
              <el-table-column
                v-else
                :key="item.column_name"
                :prop="item.column_name"
                :label="item.column_name"
              >
              </el-table-column>
            </template>
          </el-table>
          <div class="page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 15, 30]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              background
            >
            </el-pagination>
          </div>
          <btn
            class="clearBtn"
            btnName="数据清洗>>"
            @click.native="clear"
          ></btn>
        </div>
      </div>
    </div>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <div>是否恢复上一次记录</div>
        <div>清洗时间：{{cacheData.cleaningTime}}</div>
        <div>清洗表名：{{cacheData.tableName}}</div>
        <div>清洗条数：{{cacheData.totalNumber}}</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="handleRecovery">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import {
  createConnection,
  selectTableList,
  connectionTest,
  getTableList,
  selectConnectionList,
  cacheFetch
} from "../../network/collection";
import Btn from "../../components/common/Btn.vue";
import TableV from "../../components/common/TableV.vue";
import abc from "../abc.vue";
import { Loading } from "element-ui";

export default {
  name: "",
  components: {
    Btn,
    TableV,
    abc,
  },
  data() {
    return {
      dialogVisible: false,
      options: {
        lock: true,
        text: "数据抽取中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      },
      tableData: [],
      tableLabel: [],
      options: [],
      data: [
        {
          label: "数据库",
          children: [],
        },
      ],
      value: "",
      history: "",
      historyConnect: [],
      form: {
       
        connectionAddress: "", //url
        connectionDatabaseName: "", // 数据库名
        connectionName: "", // 连接名称  自定义
        connectionPassword: "", //密码
        connectionPort: "", //端口
        connectionType: "", //数据库类型
        connectionUsername: "", //用户名
      },
      // tableData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      query: {
        type: '9',
        connectionId: "",
        pageNum: "",
        pageSize: "",
        tableName: 0,
      },
      loadingInstance: "",
      totalPageData: [],
      // 共几页
      pageNum: 1,
      // 每页显示数量
      pageSize: 5,
      // 当前显示页码
      currentPage: 1,
      // 总共多少条数据
      total: 0,
      // 当前要显示的数据
      dataShow: [],
      input: "",
      dataList: [], //保存全文搜索数据
      cacheData: []
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.selectConnectionList();
    this.cacheFetch()
   
  },
  methods: {
    handleClose() {
      this.$store.state.notCleanData = []
      this.$store.state.cleanData = []
      this.dialogVisible =  false
    },
    cancel() {
      this.$store.state.notCleanData = []
      this.$store.state.cleanData = []
      this.dialogVisible =  false
    },
    handleRecovery() {
      this.$store.state.notCleanData = []
      this.$store.state.cleanData = []
      this.dialogVisible =  false
      // this.$bus.$emit("cacheData",this.cacheData);
      console.log(this.cacheData);
      this.cacheData.dataSout.forEach(item => {
         this.$store.state.notCleanData.push(item.data)
      })
      this.cacheData.data.forEach(item => {
         this.$store.state.cleanData.push(item.data)
      })
      console.log(this.$store.state.cleanData);
      console.log( this.$store.state.notCleanData);
      this.$store.state.tableLabel = this.cacheData.columnComment;
      this.$store.state.total = this.cacheData.dataSout.length;

      this.$router.push('/LibraryClean')
    },
    cacheFetch() {
      let obj = {
        type: 1
      }
      cacheFetch(obj).then(res => {
        console.log(res);
        if(res.code === 200) {
          this.dialogVisible = true
          this.cacheData = res.data
        }
      })
    },
    // 全文搜索
    search() {
      this.dataShow = [];
      console.log(this.input);
      if (this.input != "") {
        console.log(this.dataList);
      console.log(this.tableData[0]);
          for (let key in this.dataList[0]) {
            console.log(key);
            this.dataList.forEach((itemA) => {
          // console.log(itemA[key]+ '---' + this.input);
            itemA[key];
            if (itemA[key] == this.input) {
              this.dataShow.push(itemA);
            }
              });
          }
      
        this.total = this.dataShow.length;
        //  this.calcPageData()
      } else {
        this.getTableList();
      }
    },
    calcPageData() {
      // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
      if (this.tableData.length > 1) {
        this.pageNum = Math.ceil(this.tableData.length / this.pageSize) || 1;
        console.log("总页数:", this.pageNum);
      }
      // 数据分组
      for (let i = 0; i < this.pageNum; i++) {
        // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
        // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
        this.totalPageData[i] = this.tableData.slice(
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
    // 数据清洗
    clear() {
      this.loading();
      console.log(this.tableList);
      console.log(this.$store.state.tableList);
      if (this.tableData.length > 0) {
        this.$store.state.getTableListQuery = this.query;
        // this.$store.state.tableList = this.tableData;
        this.$store.state.notCleanData = this.tableData;
        this.$store.state.tableLabel = this.tableLabel;
        this.$store.state.total = this.tableData.length;
        console.log(this.$store.state.total);
        this.closeLoad();
        this.$router.push("/LibraryClean");
      } else {
        this.closeLoad();
        this.$message.error("暂无待清洗数据");
      }

      //  this.$router.push('/TypeRules')
    },
    // 翻页
    prev() {
      console.log(this.query.pageNum++);
      // this.getLsit()
    },
    next() {
      console.log(this.query.pageNum--);
      // this.getLsit()
    },

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
    // 查询数据库数据
    getTableList() {
      this.query.tableName = this.value;
      this.$store.state.tableName = this.query.tableName;
      this.$store.state.tableUrl = this.form.connectionAddress;
      this.$store.state.dataName = this.form.connectionDatabaseName;
      // console.log(this.query);
      this.getLsit();
    },
    // 查询数据库数据
    getLsit() {
      let columnName = "";
      getTableList(this.query)
        .then((res) => {
          // console.log(res);
          if (res.code == 200) {
           this.dataList = res.data.record;
            res.data.columnComment.forEach((item) => {
              if (item.column_key == "PRI") {
                columnName = item.column_name;
              }
            });
            this.tableLabel = res.data.columnComment;
            this.tableData = res.data.record;
            this.total = parseInt(this.tableData.length);
            console.log(this.columnList);
            this.tableData.forEach((data) => {
              //  data = JSON.stringify(data)
              for (var key in data) {
                if (key == columnName) {
                  delete data[key];
                }
              }
            });
            // 计算页数
            this.calcPageData();
            console.log(this.tableData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 渲染Tree
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ label: "数据库" }]);
      }
      if (node.level > 1) return resolve([]);
      this.dataExtraction();
      console.log(this.data);
      resolve(this.data[0].children);
    },
    // 创建连接
    createConnection() {
      if (this.form.connectionId) {
        this.form.connectionId = "";
      }
      createConnection(this.form)
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.selectConnectionList();
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 连接测试
    connectionTest() {
      if (this.form.connectionId) {
        this.form.connectionId = "";
      }
      connectionTest(this.form)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 加载动画
    loading() {
      let options = {
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      };
      this.loadingInstance = Loading.service(options);
      Loading.service(options);
    },
    // 关闭动画
    closeLoad() {
      this.$nextTick(() => {
        // 以服务的方式调用的 Loading 需要异步关闭
        this.loadingInstance.close();
      });
    },
    // 数据抽取
    dataExtraction(node, resolve) {
      this.loading();
      selectTableList(this.form)
        .then((res) => {
          if (res.code == 200) {
            this.closeLoad();
            console.log(res.data);
            this.options = res.data.tableList;
            console.log(this.options);
            this.query.connectionId = res.data.connectionId;
            this.$message.success(res.message);
            for (var i = 0; i < res.data.tableList.length; i++) {
              this.data[0].children[i] = {};
              this.data[0].children[i].label = res.data.tableList[i];
            }
          } else {
            this.closeLoad();
            this.$message.error(res.message);
          }
          if (resolve) {
            resolve(this.data); //动态加载时
          } else {
            //更新节点时：
          }
        })
        .catch((err) => {
          this.closeLoad();
          console.log(err);
        });
    },

    //   [
    //   {
    //     "CONNECTION_ID": "bigint(20);NOT NULL;AUTO_INCREMENT;COMMENT '主键id'"
    //

    //   },
    // ]
  },
};
</script>

<style scoped lang="less">
@import "../../assets/css/tool.less";

.library-collection {
  display: flex;
  height: 100%;
  .parameter,
  .preview {
    padding: 20px;
    box-shadow: inset 0px 0px 4px #daedff, 0px 0px 3px #1991ff;
    border-radius: 8px;
  }
  .parameter {
    width: 300px;
    height: 100%;
    padding: 0 60px 0 60px;
    margin-right: 20px;
    .el-form {
      padding-top: 100px;
      .el-select {
        width: 100%;
      }
    }
    .btns {
      width: 20%;
      display: flex;
    }
    .message {
      margin-top: 50px;
      font-size: 24px;
    }
  }
  .preview {
    width: 70%;
    // padding: 0 10px;
    .detail {
      width: 100%;
      .demo-input-suffix {
        // width: 100%;
        height: 100%;
        margin: 0 20px 10px 300px;
        // transform: translateX(-50%);
        border-radius: 7px;
      }
      .table {
        width: 100%;
        .clearBtn {
          margin: 0px 0 0 60%;
        }
      }
    }
  }
}
</style>
