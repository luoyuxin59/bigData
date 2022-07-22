<template>
  <div>
    <el-form :inline="true"  ref="form" size="mini" :model="params" label-width="80px">
      <el-form-item label="转换规则名称" label-width="150px">
        <el-input v-model="params.query"></el-input>
      </el-form-item>
        <el-form-item label="类型" style="margin-left: 30px">
          <el-select v-model="params.type">
            <el-option label="类型转换" :value="1"></el-option>
            <el-option label="值转换" :value="2"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getConversionRules">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增button -->
    <el-button type="primary" size="mini" style="margin-bottom: 20px" @click="handleAdd">新增</el-button>
    <!-- table -->
    <el-table size="mini" :data="tableData" border style="width: 100%">
      <el-table-column  type="index" label="序号" width="100"> </el-table-column>
      <el-table-column prop="dictName" label="转换规则名称" width="180"> </el-table-column>
      <el-table-column prop="createBy" label="创建人" width="180"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"  > </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="280">
          <template slot-scope="scope">
            <el-button  size="mini"  @click="handleEdit(scope.row)" type="warning"  style="margin-right: 15px;">编辑</el-button>
        <el-popconfirm
          confirm-button-text='好的'
          cancel-button-text='不用了'
          icon="el-icon-info"
          icon-color="red"
          title="这是一段内容确定删除吗？"
          @confirm="handleRemove(scope.row.id)"
          >
      <el-button size="mini" slot="reference" type="danger"  >删除</el-button>
    </el-popconfirm>
      </template>
      </el-table-column>
    </el-table>
      <el-pagination
         background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="params.pageSize"
          :page-size="params.pageNum"

        layout="prev, pager, next"
        :total="total">
</el-pagination>
    <!-- 抽屉 -->
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false">
     <el-form size="mini" :rules="rules" ref="saveRef" :model="addParams" >
        <el-form-item label="转换规则名称" prop="dictName" >
          <el-input v-model="addParams.dictName" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="转换规则详情	" prop="description"  >
          <el-input v-model="addParams.description" style="width:250px"></el-input>
        </el-form-item>
         <el-form-item label="转换规则类型" prop="typeRule">
          <el-select v-model="addParams.typeRule"  style="width:250px">
            <el-option label="类型转换" :value="1"></el-option>
            <el-option label="值转换" :value="2"></el-option>
          </el-select>
      </el-form-item>
     </el-form>
       <div class="handleBtn">
         <el-button size="mini" class="cancel" >取消</el-button>
       <el-button size="mini" type="primary" @click="handleSave">确认</el-button>
       </div>
    </el-drawer>
  </div>
</template>
<script>
import { getConversionRules, removeConversionRules, saveConversionRules} from "../../network/collection";
export default {
  name: "",
  components: {},
  data() {
    return {
      params: {
        pageSize: 1,
        pageNum: 5,
        query: "",
        type: ""	
      },
      addParams:{
        dictName: '',
        description:'',
        typeRule: '',
        id: ''
      },
      rules: {
          dictName: [
            { required: true, message: '请输入转换规则名称', trigger: 'blur' },
          ],
          description: [
            { required: true, message: '请输入转换规则详情', trigger: 'blur' },
          ],
          typeRule: [
            { required: true, message: '请选择转换规则类型', trigger: 'blur' },
          ],
      },
      tableData:[],
      total: 0,
      drawer: false
    };
  },
  created() {},
  computed: {},
  mounted() {
    this.getConversionRules();
  },
  methods: {
     handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.params.pageNum = val
        this.getConversionRules();
      },
      handleCurrentChange(val) {
        this.params.pageSize = val
        this.getConversionRules();
      },
    handleSave() {
      // console.log( this.$ref.saveRef);
      this.$refs.saveRef.validate(valid => {
        if(valid) {
          saveConversionRules(this.addParams).then(res => {
            if(res.code === 200) {
              this.$message.success('成功')
              this.drawer = false
              this.$refs.saveRef.resetFields()
              this.getConversionRules();
            }
          })
         }
      })
    },
    // 删除
    handleRemove(id) {
      removeConversionRules({id: id}).then(res => {
        console.log(res);
        if(res.code === 200) {
          this.$message.success('删除成功')
          this.getConversionRules();
        }
      })
    },
    handleClose() {
      this.drawer =  false
      this.$refs.saveRef.resetFields()
    },
    // 添加
    handleAdd() {
      this.drawer =  true
    },
    resetSearch() {
      this.params.query = '';
      this.params.type = '';
      this.getConversionRules()
    },
    // 编辑
    handleEdit(row) {
      console.log(row);
      this.drawer =  true
      this.addParams = row
      delete this.addParams.createBy
      delete this.addParams.createTime
      
    },
    handleDelete() {

    },
    // 获取清洗转换规则
    getConversionRules() {
      getConversionRules(this.params).then((res) => {
        console.log(res);
        if(res.code === 200) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          console.log( this.total );
          console.log(  this.tableData);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>

.handleBtn {
  position: absolute;
  bottom: 60px;
  right: 30px;
  .cancel {
    margin-right: 50px;
  }
}
</style>
