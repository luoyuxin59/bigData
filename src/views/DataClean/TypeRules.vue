<template>
  <div class="type-rules">
    <div class="rules-show">
      <div class="tableContent">
        <el-table :data="tableData" border height="600">
          <!-- 动态循环的列表 -->
          <template v-for="(item, index) in tableLabel">
            <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
            <el-table-column
              :key="index"
              :prop="item.column_name"
              :label="item.column_comment"
            >
            </el-table-column>
          </template>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="1"
          :pager-count="5"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <div class="interval">>>></div>
      <div class="tableContent">
        <el-table :data="tableData" border height="600">
          <!-- 动态循环的列表 -->
          <template v-for="(item, index) in tableLabel">
            <!-- <el-table-column :key="index" :prop="item.prop" :label="item.label" width="100"> </el-table-column> -->
            <el-table-column
              :key="index"
              :prop="item.column_name"
              :label="item.column_comment"
            >
            </el-table-column>
          </template>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="1"
          :pager-count="5"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div>
      <btn btnName="新建转换规则" @click.native="add"></btn>
      <btn btnName="数据入库" @click.native="storeData"></btn>
    </div>
  </div>
</template>
<script>
import Btn from "../../components/common/Btn.vue";

import {
 getTableList,
} from "../../network/collection";
export default {
  name: "",
  components: {
    Btn,
  },
  data() {
    return {
      tableData: [],
      tableLabel: [],
      query: {},
      path: '',
      total: 0
    };
  },

  computed: {},
  created() {},
  mounted() {
      this.path = sessionStorage.getItem('path')
       if(this.path == 'AutomaticCollection') {
          this.tableData = this.$store.state.tableList;
          this.tableLabel = this.$store.state.tableLabel;
       }
       if (this.path == 'LibraryCollection'){
          this.query = this.$store.state.getTableListQuery
         this.getLsit()
       }
  },
  methods: {
    // 数据入库 
    storeData() {
      this.$store.state.tableList = this.tableData;
      this.$store.state.tableLabel = this.tableLabel;
      console.log(this.$store.state.tableLabel);
      console.log(this.$store.state.tableList );
      this.$router.push('/DataLoad')
    },
    add() {
      this.$router.push("/CreateTypeRules");
    },
    // 查询数据库数据
    getLsit() {
      let columnName = '';
      console.log(this.query);
      getTableList(this.query).then(res => {
        console.log(res);
          if(res.code == 200) {
          res.data.columnComment.forEach(item => {
            // console.log(item);
            if(item.column_key == 'PRI') {
              
             columnName = item.column_name;
            }
          })
           this.tableLabel = res.data.columnComment;
           this.tableData = res.data.record;
           this.total = parseInt(res.data.totalCount);
           console.log(this.columnList);
           this.tableData.forEach(data => {
            //  data = JSON.stringify(data)
             for (var key in data) {
                // console.log(key + "------------" + data[key]);
                if(key == columnName){
                  delete data[key]
                }
             }
             console.log(data);
           })
           console.log( this.tableData);
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 翻页
    handleCurrentChange(val) {
      this.query.pageNum = val;
      console.log(val);
      this.getLsit();
    },
  },
};
</script>

<style scoped lang="less">
.type-rules {
  width: 1000px;
  padding: 20px;
  .rules-show {
    display: flex;
    .interval {
      margin-top: 30px;
      padding: 0 100px;
    }
    .tableContent {
      width: 50%;
    }
  }
  .btn {
    position: absolute;
    bottom: 50px;
    transform: none;
    left: 56%;
    margin: 0;
  }
}
</style>
