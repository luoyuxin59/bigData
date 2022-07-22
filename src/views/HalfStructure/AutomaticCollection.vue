// 半结构化数据自动采集
<template>
  <div class="automatic-collection">
   <div class="content">
    <div class="mubanList">
       <div class="big" style="width:300px;">
          <div class="header">已保存模板</div>
            <ul>
              <li class="companyName" v-for="(item,index) in templateList" :class="{'active': item.templateId == templateId }" :key="index" @click="selectTemplate(item)">
                <el-tooltip class="item" effect="dark" :content="item.templateDesc" placement="top-start">
                  <span>{{item.templateName}}</span>
                </el-tooltip>
                </li>
            </ul>
          </div>
    </div>
    <el-table
      height="600"
      v-if="tableColumns.length > 0"
      :data="tableData"
      :header-cell-style="{ background: '#f5f7fa', color: '#666' }"
      stripe
      border
    >
      <el-table-column
        v-for="item in tableColumns"
        :key="item.key"
        :prop="item.column_name"
        :label="item.column_comment"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
    </el-table>
   </div>
    <div class="btns">
      <btn btnName="新增列名" @click.native="dialogVisible = true"></btn>
      <btn btnName="保存模板" @click.native="saveTemplate"></btn>
      <btn btnName="导出模板" @click.native="exportToExcel"></btn>
      <!-- 导入Excel -->
      <el-upload
        action="/上传文件的接口"
        :on-change="onChange"
        :auto-upload="false"
        :show-file-list="false"
        accept=".xls, .xlsx">
           <btn btnName="数据预览" ></btn>
      </el-upload>
      <btn btnName="数据清洗" @click.native="clear"></btn>
    </div>
    <el-dialog
      title="新增列名"
      :visible.sync="dialogVisible"
      :center="true"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form :hide-required-asterisk="true" :rules="rules" ref="form" :model="obj"label-width="80px">
        <el-form-item label="列名" prop="column_comment">
          <el-input v-model="obj.column_comment"></el-input>
        </el-form-item>
        <el-form-item label="属性名" prop="column_name">
          <el-input v-model="obj.column_name"  @keyup.enter.native="add"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add" >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 保存模板对话框 -->
<el-dialog
  title="提示"
  :visible.sync="templateNameVisible"
  width="30%"
  :before-close="handleClose">
  <el-form ref="form" :model="templateInfo" label-width="80px" >
    <el-form-item label="模板名称">
      <el-input v-model="templateInfo.templateName"  placeholder="请输入保存模板名称"></el-input>
    </el-form-item>
    <el-form-item label="模板描述">
      <el-input v-model="templateInfo.templateDesc"  placeholder="请输入保存描述"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="templateNameVisible = false">取 消</el-button>
    <el-button type="primary" @click="addTemplate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
import {dataLoading,addTemplate,deleteTemplate,getTemplateList,updateTemplate} from "../../network/collection"
import Btn from "../../components/common/Btn.vue";
import TableV from "../../components/common/TableV.vue";
export default {
  name: "",
  components: {
    TableV,
    Btn,
  },
  data() {
    return {
      imFile: "", // 导入文件el
      errorMsg: "", // 错误信息内容
      fullscreenLoading: "", // 加载中
      errorDialog: false, //错误信息弹框
      studentlist: [],
      search: "",
      dialogVisible: false,
      obj: {
        column_comment: "",
        column_name: "",
      },
      tableColumns: [
       
      ],
      query: {},
      nameList: [],
      filterList: [],
      tableData: [],
      sheetData: [],
      rules: {
        column_comment:[{required: true, message: '请输入列名', trigger: 'blur'}],
        column_name:[{required: true, message: '请输入属性名', trigger: 'blur'}]
      },
      templateInfo: {
        beginDate: "",
        content: "",
        createdByName: "",
        createdTime: "",
        dateType: "",
        endDate: "",
        templateContext: "",
        templateDesc: "",
        templateName: ""
      },
      queryTemplateList: {
        pageNum: 1,
        pageSize: 9999,
      },
      templateList:[],  //模板列表
      templateNameVisible: false,
      templateId: ''
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getTemplateList()
  },
  methods: {
    // 选择模板 
    selectTemplate(item) {
      this.templateId = item.templateId;
      this.tableColumns = JSON.parse(item.templateContext)
    },
    // 保存模板
    saveTemplate() {
      this.templateNameVisible =  true
      this.templateInfo.templateContext = JSON.stringify(this.tableColumns);
    },
    // 新增模板
    addTemplate() {
      if(this.templateInfo.templateName != '') {
          if(this.templateInfo.templateDesc != '') {
            if(this.templateInfo.tableColumns != '') {
              addTemplate(this.templateInfo).then(res => {
                if(res.code == 200) {
                  this.templateNameVisible =  false
                  this.$message.success(res.message)
                  this.templateInfo.templateName = '';
                  this.templateInfo.tableColumns = '';
                  this.templateInfo.tableColumns = ''
                  this.getTemplateList()
                }else {
                  this.$message.error('请求失败：'+  res.code + ',' + res.message  )
                }
              })
            }else {
          this.$message.error('模板内容为空')
        }
          }else {
          this.$message.error('模板描述为空')
        }
        }else {
          this.$message.error('模板名称为空')
        }
    },
    // 查询所有模板
    getTemplateList() {
      getTemplateList(this.queryTemplateList).then(res => {
        if(res.code == 200) {
          this.templateList = res.data.list;
        }else {
          this.$message.error('请求错误' + res.message)
        }
      })
    },
    // to数据清洗
    clear() {
      console.log(this.tableColumns);
      // 保存数据
      if(this.tableData.length > 0) {
        for(var i =0; i < this.tableData.length; i++) {
          for(var key in this.tableData[0]) {
            if(this.tableData[i][key] == undefined) {
              this.tableData[i][key] = '';
            }
          }
        }
        console.log(this.tableData)
        this.$store.state.notCleanData = this.tableData;
        this.$store.state.tableLabel = this.tableColumns;
        this.$router.push('/LibraryClean')
      }else {
        this.$message.error('暂无待清洗数据')
      }

      // this.$router.push('/TypeRules')
    },
    // 新增列名
    add() {
      // let key = "";
      // console.log(this.obj);
      // key = this.obj.name;
      // let arr = this.tableData[0];
      // arr[key] = "1";
      // this.dialogVisible = false;
      // this.nameList.push(this.obj.title);
      // console.log(this.nameList);
      // console.log(this.tableData);
      this.$refs.form.validate(valid => {
        if(valid) {
          this.tableColumns.push(this.obj);
          console.log(this.tableColumns);
          this.obj = {};
        //  this.dialogVisible = false;
        }
         //else {
         //this.$message.error()
       //  }
      })
    },
    // 关闭对话框
    handleClose(done) {
      this.dialogVisible =  false;
      this.obj = {};
    },
    // ----------以下为导出Excel数据功能--------------
    exportToExcel() {
      this.tableColumns.forEach((item) => {
        this.nameList.push(item.column_comment);
        this.filterList.push(item.column_name);
      });
      //excel数据导出
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../excel/Export2Excel");
        const tHeader = this.nameList;
        const filterVal = this.filterList;
        const list = this.studentlist;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "采集模板");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    // ----------以下为导入Excel数据功能--------------
    // 文件选择回调
    onChange(file, fileList) {
      this.fileData = file; // 保存当前选择文件
      this.readExcel(); // 调用读取数据的方法
    },
    // 读取数据
    readExcel(e) {
      let that = this;
      const files = that.fileData;
      if (!files) {
        //如果没有文件
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
        this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          // console.log(data)
          const workbook = this.XLSX.read(data, {
            type: "binary",
          });

          if (workbook.SheetNames.length >= 1) {
            this.$message({
              message: "导入数据表格成功",
              showClose: true,
              type: "success",
            });
          }
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = this.XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          that.tableData = ws;
          console.log(that.tableData);
          that.outputs = []; //清空接收数据
          console.log(ws);
          for (var i = 0; i < ws.length; i++) {
              console.log( ws[i]['姓名']);
              var dataList = {}
              that.tableColumns.forEach((item) => {
                console.log(item);
                console.log(item.column_name + ':' + item.column_name);
                  dataList[item.column_name] = ws[i][item.column_comment];
                })
            that.tableData[i] = dataList
            // that.tableColumns.forEach((item) => {
            //   console.log(item);
            //   var sheetData = {
            //     // 键名为绑定 el 表格的关键字，值则是 ws[i][对应表头名]
            //     name: ws[i][item.name],
            //     age: ws[i][item.name],
            //     address: ws[i][item.name],
            //     // sex: ws[i]["性别"],
            //     // tel: ws[i]["电话"],
            //     // xueyuan: ws[i]["学院"],
            //     // banji: ws[i]["班级"],
            //     // lyNumber: ws[i]["楼宇号"],
            //     // sushe: ws[i]["宿舍号"]
            //   };
            // });
            // })
            console.log(that.tableData);
            // dataLoading(that.sheetData).then(res => {
            //   console.log(res);
            // })
          }
         
          this.$refs.upload.value = "";
        } catch (e) {
          return false;
        }
      };
      // 如果为原生 input 则应是 files[0]
      fileReader.readAsBinaryString(files.raw);
    },
   
  },
};
</script>

<style scoped lang="less">
.automatic-collection {
  width: 100%;
  .btns {
    position: absolute;
    left: 30%;
    bottom: 60px;
    display: flex;
    padding: 0 100px;
    .btn {
      // flex: .25;
      margin: 0 50px;
    }
  }
  .content {
    display: flex;
    .mubanList {
      flex: .3;
    }
    el-table {
      flex: 1;
    }
  }
}
ul{
      display:flex;
      flex-wrap: wrap;
      .companyName { 
        color: #077dd8;
        background-color: #e3eff9;
        margin: 5px 10px;
        padding: 0 15px;
        position: relative;
        height: 28px;
        list-style: none;
        font-size: 12px;
        text-align: center;
        line-height: 28px;
        border-radius: 50px;
        cursor: pointer;
      }
    }
  .active {
    color: #fff !important;
    background-color: #077dd8 !important;
  }
</style>
