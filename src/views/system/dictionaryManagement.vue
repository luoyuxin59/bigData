<template>
  <div>
    <el-form
      :inline="true"
      ref="form"
      size="mini"
      :model="params"
      label-width="80px"
    >
      <el-form-item label="字典名称" label-width="150px">
        <el-input v-model="params.dictName"></el-input>
      </el-form-item>
      <el-form-item label="字典编码" style="margin-left: 30px">
          <el-input v-model="params.dictCode"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDict">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增button -->
    <div style="display: flex;">
      <el-button
      type="primary"
      size="mini"
      style="margin-bottom: 20px"
      @click="handleAdd"
      >新增</el-button
    >
     <el-button
      type="primary"
      size="mini"
      style="margin-bottom: 20px"
      @click="showRecycle"
      >回收站</el-button
    >
     <el-button
      type="primary"
      size="mini"
      style="margin-bottom: 20px"
      @click="exportDict"
      >导出</el-button>
     <el-upload
      style="margin-left: 10px"
      class="upload-demo"
      :action="baseUrl"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      >
      <el-button size="mini" type="primary">导入</el-button>
    </el-upload>
    </div>
    
    <!-- table -->
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
      :current-page.sync="params.pageNo"
      :page-size="params.pageSize"
      layout="prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" size="40%"
    >
  
      <div>
        <el-form :inline="true" :model="detailParams" size="small">
          <el-form-item  label="名称"
            label-width="60px">
            <el-input
              v-model="detailParams.itemText"
              clearable
              @clear="getDetail"
              placeholder="请输入转换值或替换值"
             style="width: 150px"
            ></el-input>
          </el-form-item>
          <el-form-item  label="状态" label-width="60px">
         <el-select v-model="detailParams.status" style="width: 150px" clearable   @clear="getDetail">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
          </el-form-item>
          <el-form-item >
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
            prop="itemText"
            :show-overflow-tooltip="true"
            label="字典项文本"
            width=""
          >
          </el-table-column>
          <el-table-column
            prop="itemValue"
            :show-overflow-tooltip="true"
            label="字典项值"
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
          :current-page.sync="detailParams.pageNo"
          :page-size="detailParams.pageSize"
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
        <el-form-item label="字典名称" prop="dictName" label-width="80px">
          <el-input v-model="addParams.dictName" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="字典编码	" prop="dictCode" label-width="80px">
          <el-input
            v-model="addParams.dictCode"
            style="width:250px"
            @input="checkCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description" label-width="80px">
           <el-input
            v-model="addParams.description"
            style="width:250px"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form
        v-show="showForm === '详情'"
        ref="detailRef"
        :model="saveDetailParams"
        size="small"
        :rules="detailRules"
      >
        <el-form-item label="字典项文本" label-width="100px" prop="itemText">
          <el-input v-model="saveDetailParams.itemText"></el-input>
        </el-form-item>
        <el-form-item label="字典项值" label-width="100px" prop="itemValue">
          <el-input v-model="saveDetailParams.itemValue"></el-input>
        </el-form-item>
          <el-form-item label="描述" label-width="100px" prop="itemValue">
          <el-input v-model="saveDetailParams.description"></el-input>
        </el-form-item>
        <el-form-item label="排序值" label-width="100px" prop="itemValue">
          <el-input v-model="saveDetailParams.sortOrder"></el-input>
        </el-form-item>
         <el-form-item label="状态" label-width="100px" prop="itemValue">
          <el-switch
            v-model="saveDetailParams.status"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
      </el-form-item>
      </el-form>
       
      <span slot="footer"  v-show="showForm === ''" class="dialog-footer">
        <el-button size="mini" class="cancel" @click="handleClose">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSave"
          >确认</el-button
        >
      </span>
      <span slot="footer" v-show="showForm === '详情'" class="dialog-footer">
        <el-button @click="detailCancel" size="small">取 消</el-button>
        <el-button type="primary" @click="saveDetail" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 回收站  -->
    <recycle ref="recycleRef"></recycle>
  </div>
</template>
<script>
import {
  getDict,
  addDict,
  editDict,
  removeDict,
  checkCode,
  getDictItem,
  addDictItem,
  editDictItem,
  removeDictItem,
  exportDict,
  removeConversionRules,
  saveConversionRules,
  getDetail,
  deleteDetail,
  saveDetail,
} from "../../network/collection";
import recycle from "./cpn/recycle.vue";
import BASE_URL from '../../network/config'
export default {
  name: "",
  components: {
    recycle
  },
  data() {
    const checkAge = (rule, value, cb) => {
      const reg = RegExp(/不可用/)
      console.log(reg.test(this.checkMsg));
      if (reg.test(this.checkMsg)) {
        // 合法的输入
        console.log("checkCode");
        return cb(new Error('该编码不可用，系统中已存在！'))
      }
    
    }

    return {
      params: {
        pageSize: 10,
        pageNo: 1,
        dictCode: null,
        dictName: null,
        delFlag: 0
      },
      addParams: {
        dictName: "",
        dictName: "",
        description: "",
      },
    
      rules: {
        dictName: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入字典描述", trigger: "blur" },
        ],
        dictCode: [
          { required: true, message: '请输入字典编码', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' }
        ],
      },
      detailRules: {
        itemText: [
          { required: true, message: "请输入/字典项文本", trigger: "blur" },
        ],
         itemValue: [
          { required: true, message: "请输入字典项值", trigger: "blur" },
        ],
         sortOrder: [
          { required: true, message: "请输入排序号", trigger: "blur" },
        ], 
        description: [
          { required: true, message: "请输入描述", trigger: "blur" },
        ],
        
      },
      tableData: [],
      total: 0,
      drawer: false,
      // 查询转换规则详情参数
      detailParams: {
        pageSize: 15,
        pageNo: 1,
        itemText: null,
        dictId: "",
        status: 1
      },
      detailList: [],
      detailTotal: 0,
      dialogVisible: false,
      saveDetailParams: {
        description: "",
        dictId: "",
        itemText: "",
        itemValue: "",
        sortOrder: "",
        status: "",
      },
      checkParams: {
        tableName: "sys_dict",
        fieldName: "dict_code	",
        fieldVal: "",
        dataId: "",
        checkMsg: ''
      },
      showForm: ''
    };
  },
  created() {
  
  },
  computed: {
    baseUrl() {
      return BASE_URL + "/sys/dict/importExcel"
    }
  },
  mounted() {
    this.getDict();
    
  },
  methods: {
    // 文件上传成功
    uploadSuccess(response) {
      this.$message.success(response.message)
    },
    uploadError() {
      this.$message.error(response.message)
    },
    exportDict() {
      window.open(BASE_URL + "/sys/dict/exportXls")
    },
    // 展示回收站
    showRecycle() {
      this.$refs.recycleRef.dialogVisible = true
    },
    // 校验编码
    checkCode() {
      this.checkParams.fieldVal = this.addParams.dictCode
      this.checkParams.dataId = this.addParams.id
      checkCode(this.checkParams).then(res => {
       this.checkMsg = res.message
      })
    },
    detailCancel() {
      console.log(this.detailTotal);
      if(this.detailTotal == 0) {
        this.$refs.saveRef.resetFields()
        this.dialogVisible = false;
      
      }else{
        this.$refs.detailRef.resetFields();
        this.dialogVisible = false;
        // this.saveDetailParams = {
        //   dictId: "",
        //   conversionValue: "", //转换值
        //   convertTo: "", //转换为的值
        // }
      }
      this.saveDetailParams = {
        description: "",
        dictId: "",
        itemText: "",
        itemValue: "",
        sortOrder: "",
      }
       console.log(this.addParams);
    },
    saveDetail() {
      this.dialogVisible = false;
      this.$refs.detailRef.validate((valid) => {
        if (valid) {
          if(!this.saveDetailParams.id) {
            addDictItem(this.saveDetailParams).then((res) => {
              if (res.code === 200) {
                this.getDetail()
                this.$refs.detailRef.resetFields();
                this.$message.success(res.message);
                this.saveDetailParams = {
                  description: "",
                  dictId: "",
                  itemText: "",
                  itemValue: "",
                  sortOrder: "",
                  status: "",
                }
              }else {
                 this.$message.error(res.message);
              }
            });
          }else {
            editDictItem(this.saveDetailParams).then((res) => {
              if (res.code === 200) {
                this.getDetail()
                this.$refs.detailRef.resetFields();
                this.$message.success(res.message);
                this.saveDetailParams = {
                  description: "",
                  dictId: "",
                  itemText: "",
                  itemValue: "",
                  sortOrder: "",
                }
               }else {
                 this.$message.error(res.message);
               }
            });
          }
        }
      });
    },
    handleDetailAdd(value) {
      console.log(value);
      this.showForm = value
      this.dialogVisible = true;
      this.saveDetailParams.dictId = this.detailParams.dictId;
    },
    handleDetailEdit(row, value) {
      this.showForm = value
      this.dialogVisible = true;
      let params = JSON.stringify(row);
      this.saveDetailParams = JSON.parse(params)
      console.log(this.saveDetailParams);
    },
    handleDetailRemove(id) {
      removeDictItem({ id: id }).then((res) => {
        if (res.code === 200) {
          this.getDetail()
          this.$message.success(res.message);
        }
      });
    },
    getDetail() {
      getDictItem(this.detailParams).then((res) => {
        if (res.code === 200) {
          this.detailList = res.data.list;
          this.detailTotal = res.data.total;
        }
      });
    },
    disposeEdit(row) {
      this.drawer = true;
      this.detailParams.dictId = row.id;
      this.getDetail();
    },
    // 分页
    handleSizeChange( val) {
      this.params.pageSize = val;
      this.getDict();
    },
    handleCurrentChange(val) {
      this.params.pageNo = val;
      this.getDict();
    },
    handleDetailSizeChange( val) {
       this.detailParams.pageSize = val;
      this.getDetail();
    },
    handleDetailCurrentChange(val) {
      this.detailParams.pageNo = val;
      console.log(this.detailParams);
      this.getDetail();
    },
    handleSave() {
      // console.log( this.$ref.saveRef);
     this.showForm = ""
      this.$refs.saveRef.validate((valid) => {
        if (valid) {
          // 判断新增还是修改
          console.log(this.addParams.id);
           if(!this.addParams.id) {
             addDict(this.addParams).then((res) => {
               if (res.code === 200) {
                 this.$message.success(res.message);
                 this.dialogVisible = false;
                 this.$refs.saveRef.resetFields();
                 this.getDict();
               }
             });
          }else {
            editDict(this.addParams).then((res) => {
              if (res.code === 200) {
                 this.$message.success(res.message);
                 this.dialogVisible = false;
                 this.$refs.saveRef.resetFields();
                 this.getDict();
               }
             });
          }
        }
      });
    },
    // 删除
    handleRemove(id) {
      removeDict({ id: id }).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.getDict();
          this.$refs.recycleRef.getDict()
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.addParams = {
        dictCode: "", //字典编码（唯一）
        dictName: "", //字典名称
        description: "" //描述
      }
      console.log(2);
    },
    // 添加
    handleAdd() {
      this.showForm = ""
      this.detailTotal = 0;
      this.dialogVisible = true;
    },
    resetSearch() {
      this.params.dictName = "";
      this.params.dictCode = "";
      this.getDict();
    },
    // 编辑
    handleEdit(row) {
       this.showForm = ""
      this.detailTotal = 0;
      console.log(row);
      this.dialogVisible = true;
      let rowData = JSON.stringify(row);
      this.addParams = JSON.parse(rowData)
      
      // delete this.addParams.createBy;
      // delete this.addParams.createTime;
    },
    handleDelete() {},
    // 获取清洗转换规则
    getDict() {
      getDict(this.params).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
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
