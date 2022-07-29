<template>
  <div>
    <el-form
      :inline="true"
      ref="form"
      size="mini"
      :model="params"
      label-width="80px"
    >
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
    <el-button
      type="primary"
      size="mini"
      style="margin-bottom: 20px"
      @click="handleAdd"
      >新增</el-button
    >
    <!-- table -->
    <el-table size="mini" :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100"> </el-table-column>
      <el-table-column prop="dictName" label="转换规则名称" width="180">
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" width="180">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
            type="warning"
            style="margin-right: 15px;"
            >编辑</el-button
          >
          <el-button
            size="mini"
            @click="disposeEdit(scope.row)"
            type="primary"
            style="margin-right: 15px;"
            >详情配置</el-button
          >

          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="这是一段内容确定删除吗？"
            @confirm="handleRemove(scope.row.id)"
          >
            <el-button size="mini" slot="reference" type="danger"
              >删除</el-button
            >
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
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
  
      <div>
        <el-form :inline="true" :model="detailParams" size="small">
          <el-form-item>
            <el-input
              v-model="detailParams.query"
              clearable
              @clear="getDetail"
              placeholder="请输入转换值或替换值"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDetail">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleDetailAdd('详情')">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table size="mini" :data="detailList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column
            prop="conversionValue"
            :show-overflow-tooltip="true"
            label="转换值/类型"
            width=""
          >
          </el-table-column>
          <el-table-column
            prop="convertTo"
            :show-overflow-tooltip="true"
            label="替换值/类型"
            width=""
          >
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-link
                type="primary"
                size="mini"
                @click="handleDetailEdit(scope.row, '详情')"
                style="margin-right: 15px;"
                >编辑</el-link
              >
              <el-popconfirm
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                title="这是一段内容确定删除吗？"
                @confirm="handleDetailRemove(scope.row.id)"
              >
                <el-link size="mini" slot="reference" type="danger"
                  >删除</el-link
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleDetailSizeChange"
          @current-change="handleDetailCurrentChange"
          :current-page.sync="detailParams.pageSize"
          :page-size="detailParams.pageNum"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
      <div v-if="detailTotal == 0" class="handleBtn">
       
      </div>
    </el-drawer>

    <!-- 详情新增编辑框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="detailCancel"
    >
        <el-form
        v-show="showForm === ''"
        size="mini"
        :rules="rules"
        ref="saveRef"
        :model="addParams"
      >
        <el-form-item label="转换规则名称" prop="dictName">
          <el-input v-model="addParams.dictName" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="转换规则详情	" prop="description">
          <el-input
            v-model="addParams.description"
            style="width:250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="转换规则类型" prop="typeRule">
          <el-select v-model="addParams.typeRule" style="width:250px">
            <el-option label="类型转换" :value="2"></el-option>
            <el-option label="值转换" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form
       v-show="showForm === '详情' & detailParams.typeRule == 1"
        ref="detailRef"
        :model="saveDetailParams"
        size="small"
        :rules="detailRules"
      >
        <el-form-item label="转换值" label-width="100px" prop="conversionValue">
          <el-input v-model="saveDetailParams.conversionValue"></el-input>
        </el-form-item>
        <el-form-item label="替换值" label-width="100px" prop="convertTo">
          <el-input v-model="saveDetailParams.convertTo"></el-input>
        </el-form-item>
      </el-form>
        <el-form
        v-show="showForm === '详情' & detailParams.typeRule == 2"
          ref="detailRef"
          :model="saveDetailParams"
          size="small"
          :rules="detailRules"
        >
        <el-form-item label="类型" label-width="100px" prop="convertTo">
           <el-select v-model="saveDetailParams.convertTo" style="width:250px">
            <el-option label="Date" value="Date"></el-option>
            <el-option label="String" value="String"></el-option>
            <el-option label="Integer" value="Integer"></el-option>
            <el-option label="Double" value="Double"></el-option>
            <el-option label="Boolean" value="Boolean"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"   v-show="showForm === ''" class="dialog-footer">
       <el-button size="mini" class="cancel" @click="handleClose">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSave"
          >确认</el-button
        >
        </span>
      <span slot="footer"   v-show="showForm === '详情'" class="dialog-footer">
        <el-button @click="detailCancel" size="small">取 消</el-button>
        <el-button type="primary" @click="saveDetail" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getConversionRules,
  removeConversionRules,
  saveConversionRules,
  getDetail,
  deleteDetail,
  saveDetail,
} from "../../network/collection";
export default {
  name: "",
  components: {},
  data() {
    return {
      showForm: "",
      params: {
        pageSize: 1,
        pageNum: 10,
        query: "",
        type: "",
      },
      addParams: {
        dictName: "",
        description: "",
        typeRule: "",
        id: "",
      },
      rules: {
        dictName: [
          { required: true, message: "请输入转换规则名称", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入转换规则详情", trigger: "blur" },
        ],
        typeRule: [
          { required: true, message: "请选择转换规则类型", trigger: "blur" },
        ],
      },
      detailRules: {
        conversionValue: [
          { required: true, message: "请输入转换规则名称", trigger: "blur" },
        ],
        convertTo: [
          { required: true, message: "请输入转换规则名称", trigger: "blur" },
        ],
      },
      tableData: [],
      total: 0,
      drawer: false,
      // 查询转换规则详情参数
      detailParams: {
        pageSize: 1,
        pageNum: 15,
        query: "",
        dictId: "",
      },
      detailList: [],
      detailTotal: 0,
      dialogVisible: false,
      saveDetailParams: {
        dictId: "",
        conversionValue: "", //转换值
        convertTo: "", //转换为的值
        types: ""
      },
    };
  },
  created() {},
  computed: {},
  mounted() {
    this.getConversionRules();
  },
  methods: {
    detailCancel() {
      console.log(this.detailTotal);
      if(this.showForm == '') {
        this.$refs.saveRef.resetFields()
        this.dialogVisible = false;
        this.addParams = {
          dictName: "",
          description: "",
          typeRule: "",
          id: "",
        }
      }else{
        this.$refs.detailRef.resetFields();
        this.dialogVisible = false;
        this.saveDetailParams = {
          dictId: "",
          conversionValue: "", //转换值
          convertTo: "", //转换为的值
          types: ""
        }
      }
      
       console.log(this.addParams);
    },
    saveDetail() {
      this.dialogVisible = false;
      this.$refs.detailRef.validate((valid) => {
        if (valid) {
          saveDetail(this.saveDetailParams).then((res) => {
            if (res.code === 200) {
              this.getDetail()
              this.$refs.detailRef.resetFields();
              this.saveDetailParams = {
                dictId: "",
                conversionValue: "", //转换值
                convertTo: "", //转换为的值
                types: ""
               }
              this.$message.success(res.message);
            }else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    handleDetailAdd(val) {
      this.showForm = val
      this.dialogVisible = true;
      this.saveDetailParams.dictId = this.detailParams.dictId;
    },
    handleDetailEdit(row,val) {
      this.showForm = val
      this.dialogVisible = true;
      let params = JSON.stringify(row);
      this.saveDetailParams = JSON.parse(params)
      console.log(this.saveDetailParams);
    },
    handleDetailRemove(id) {
      deleteDetail({ id: id }).then((res) => {
        if (res.code === 200) {
          this.getDetail()
          this.$message.success(res.message);
        }
      });
    },
    getDetail() {
      getDetail(this.detailParams).then((res) => {
        if (res.code === 200) {
          this.detailList = res.data.data;
          this.detailTotal = res.data.total;
        }
      });
    },
    disposeEdit(row) {
      this.drawer = true;
      this.detailParams.dictId = row.id;
      this.detailParams.typeRule = row.typeRule
      this.saveDetailParams.types = row.typeRule
      this.getDetail();
    },
    // 分页
    handleSizeChange( val) {
      this.params.pageNum = val;
      this.getConversionRules();
    },
    handleCurrentChange(val) {
      this.params.pageSize = val;
      this.getConversionRules();
    },
    handleDetailSizeChange( val) {
       this.detailParams.pageNum = val;
        this.getDetail();
    },
    handleDetailCurrentChange(val) {
      this.detailParams.pageSize = val;
      console.log(this.detailParams);
      this.getDetail();
    },
    handleSave() {
      // console.log( this.$ref.saveRef);
      this.$refs.saveRef.validate((valid) => {
        if (valid) {
          saveConversionRules(this.addParams).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.message);
              this.dialogVisible = false;
              this.$refs.saveRef.resetFields();
              this.getConversionRules();
            }
          });
        }
      });
    },
    // 删除
    handleRemove(id) {
      removeConversionRules({ id: id }).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.getConversionRules();
        }
      });
    },
    handleClose() {
      this.showForm = ''
      this.dialogVisible = false;
       this.addParams = {
          dictName: "",
          description: "",
          typeRule: "",
          id: "",
        }
      console.log(2);
    },
    // 添加
    handleAdd() {
      this.showForm = ''
      this.detailTotal = 0;
      this.dialogVisible = true;
    },
    resetSearch() {
      this.params.query = "";
      this.params.type = "";
      this.getConversionRules();
    },
    // 编辑
    handleEdit(row) {
      this.showForm = ''
      
      this.detailTotal = 0;
      console.log(row);
      this.dialogVisible = true;
      this.addParams = row;
      console.log(this.addParams);
      delete this.addParams.createBy;
      delete this.addParams.createTime;
    },
    handleDelete() {},
    // 获取清洗转换规则
    getConversionRules() {
      getConversionRules(this.params).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          console.log(this.total);
          console.log(this.tableData);
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
