<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
         <el-table size="mini" :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100"> </el-table-column>
      <el-table-column prop="dictName" label="字典名称" width="180">
      </el-table-column>
      <el-table-column prop="dictCode" label="字典编码" width="180">
      </el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="backDict(scope.row.id)"
            type="primary"
            style="margin-right: 15px;"
            >取回字段</el-button
          >

          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="这是一段内容确定删除吗？"
            @confirm="removeRecycleDict(scope.row.id)"
          >
            <el-button size="mini" slot="reference" type="danger"
              >彻底删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="params.pageNum"
      :page-size="params.pageSize"
      layout="prev, pager, next"
      :total="total"
    >
    </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {  getDict,backDict,removeRecycleDict } from "../../../network/collection"
export default {
  name: "",
  components: {},
  data() {
    return {
      dialogVisible: false,
      params: {
        pageSize: 10,
        pageNum: 1,
        dictCode: null,
        dictName: null,
        delFlag: 1
      },
      tableData: [],
      total: 0
    };
  },
  created() {},
  computed: {},
  mounted() {
    this.getDict()
  },
  methods: {
      // 彻底删除
    removeRecycleDict(id) {      
      removeRecycleDict({id: id}).then(res => {
        if(res.code == 200) {
           this.getDict()
          this.$message.success(res.message)
        }else {
          this.$message.error(res.message)
        }
      })
    },

  // 取回字段 
  backDict(id) {
    backDict({id:id}).then(res => {
      if(res.code == 200) {
         this.getDict()
        this.$message.success(res.message)
      }else {
        this.$message.error(res.message)
      }
    })
  },
    getDict() {
      getDict(this.params).then(res => {
        console.log(res);
        this.tableData = res.data.list
        this.total = res.data.total;
        
      })
    },
    handleClose() {
      this.dialogVisible =  false
    },
      handleSizeChange( val) {
      this.params.pageNum = val;
      this.getDict();
    },
    handleCurrentChange(val) {
      this.params.pageSize = val;
      this.getDict();
    },
  },
};
</script>
<style lang="scss" scoped></style>
