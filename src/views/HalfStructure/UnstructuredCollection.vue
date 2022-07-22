<template>
  <div class="unstructured-collection">
    <div class="operation">
      <el-form :rules="rules"  :hide-required-asterisk="true" class="awardsForm"  ref="form" :model="form" label-width="100px">
        <el-form-item label="选择奖项" prop="column_comment">
          <el-select size="mini"  style="width:120px" v-model="awardRecord.praiseId" filterable placeholder="请选择奖项" @change="changeAwards">
            <el-option v-for="(item,index) in awardLsit" :key="index" :label="item.praiseName" :value="item.praiseId"></el-option>
          </el-select>
          <el-button @click="addAwards" size="mini">新增奖项</el-button>
        </el-form-item>
        <el-form-item label="设置绩效分数" prop="recordGrade">
          <el-input size="mini"  style="width:100px" v-model="awardRecord.recordGrade "></el-input>
        </el-form-item>
         <el-form-item  label="获奖时间" prop="praiseTime">
          <el-date-picker size="small"
            value-format="yyyy"
            v-model="awardRecord.praiseTime "
            type="year"
             style="width:100px"
            placeholder="请选择年份">
          </el-date-picker>
          <el-select size="small"  style="width:100px;height: 40px;" v-model="season" placeholder="请选择">
          <el-option label="春" value="春"> </el-option>
           <el-option label="秋" value="秋"> </el-option>
        </el-select>
        </el-form-item>
        <el-form-item  label="单位" prop="">
          <span v-if="companyName"> 
             <span   @click="selectCompany">{{companyName}} </span><span v-show="miniCompanyName">{{'/' + miniCompanyName}}</span>
          </span>
          <el-button size="mini"  v-else @click="selectCompany">选择...</el-button>
      </el-form-item> 
       <el-form-item  prop="recordFile" style="height:40px" label="文件上传">
          <el-upload
            class="upload-demo"
            :action="action"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :headers="headers"
            :before-remove="beforeRemove"
            :data="data"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-progress="progress"
            :on-success="uploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item prop="fileName" label="文件名" >
          <div v-show="data.name" style="width: 190px;  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{data.name}}</div>
        </el-form-item>
      </el-form>
      <div></div>
      <el-form ref="nameForm" :hide-required-asterisk="true"   :model="form" label-width="100px">
      <el-form-item label="获奖名单" prop="nameList">
            <el-input size="mini" v-model="awardRecord.recordList " type="textarea" rows="24"></el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <btn btnName="预处理" @click.native="Handle" ></btn>
        <btn btnName="保存" @click.native="dataAnalysis"></btn>
      </div>
    </div>
    <div class="view">
      <iframe class="filename" :src="url" width='100%' height='88%' frameborder='1' ></iframe>
    </div>
    <!-- 单位对话框  -->
    <el-dialog
      title="选择单位"
      :visible.sync="CompanyDialog"
      width="80%"
      :close-on-click-modal="false"
      :before-close="companyDialogCancel">
      <div class="companyList">
        <div class="big">
          <div>大单位:</div>
            <ul>
              <li class="companyName" v-for="(item,index) in companyList" :class="{'active': item.departmentId == departmentId }" :key="index" @click="selectUnitList(item)">{{item.department}}</li>
            </ul>
          </div>
          <div class="mini">
            <div>小单位:</div>
              <ul>
                <li class="companyName "  v-for="(item,index) in miniCompanyList" :class="{'active': item.unitId == unitId }"
                 :key="index" @click="clickUnit(item)" >{{item.UNIT}}</li>
              </ul>
            </div>
        </div>
        
      <span slot="footer" class="dialog-footer">
        <el-button @click="companyDialogCancel">取 消</el-button>
        <el-button type="primary" @click="submitCompany">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="form"   :model="form" label-width="80px">
        <el-form-item label="奖项分数"  >
          <el-input v-model="awardsInfo.praiseGrade" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="请输入数值"></el-input>
        </el-form-item>
       <el-form-item label="奖项名称">
          <el-input v-model="awardsInfo.praiseName"></el-input>
        </el-form-item>
      </el-form>
      <span  slot="footer" class="dialog-footer clearfix">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddAwards">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Btn from "../../components/common/Btn.vue";
import BASE_URL from '../../network/config.js'

import {addAwards, newAwardRecord, getAwardLList, selectOrganizationList, selectUnitList}  from "../../network/collection"
export default {
  name: "",
  components: {
    Btn,
  },
  data() {
    return {
      isHandle: false,
      CompanyDialog: false,
      companyList:[],  //大单位
      miniCompanyList: [],  //小单位
      action: BASE_URL + '/file/upload',
      dialogVisible: false,
      fileList: [],
      form: {
        name: "",
        region: "",
      },
      headers: {
        token:''
      },
      data: { // 上传参数 
        name: '',// 保存文件夹名称
      },
      url: '',
      awardsInfo: {
        praiseGrade: '',
        praiseName: ''
      },
      awardRecord: {
        praiseId: '',
        recordFile: '',
        recordGrade: '',
        recordList: '',
        recordName: '',
        praiseTime: '',
        recordUnit: {
          departmentId: '',
          unitId: ''
        },
      },
      getAwardLListForm: {
        praiseGrade: '',
        praiseName: ''
      },
      awardLsit: [],
      praiseTime: '', // 年份
      season: '',  //季节 
      departmentId:'',
      unitId: '',
      companyName: '',
      miniCompanyName:'',
      rules: {
        column_comment:[{required: true, message: ' ', trigger: 'blur'}],
        // recordGrade:[{required: true, message: ' ', trigger: 'blur'}],
        // praiseTime:[{required: true, message: ' ', trigger: 'blur'}],
        // company:[{required: true, message: ' ', trigger: 'blur'}],
        // recordFile:[{required: true, message: ' ', trigger: 'blur'}],
       // fileName:[{required: true, message: '请输入获奖时间', trigger: 'blur'}],
      },
      nameRules:{
        nameList:[{required: true, message: '请输入获奖名单', trigger: 'blur'}],
      },
      nameList: '',
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.headers.token =  sessionStorage.getItem('token')
    this.getAwardLList()
    
  },
  methods: {
    // 预处理
    Handle() {

        this.nameList = this.awardRecord.recordList;
        // this.awardRecord.recordList = this.repSign(this.awardRecord.recordList);   
        var reg = /[\:]/g;
        this.awardRecord.recordList= this.awardRecord.recordList.replace(reg,"：")
        this.awardRecord.recordList =  this.awardRecord.recordList.replace(/\n/g, "；\n");
        // this.awardRecord.recordList = this.awardRecord.recordList.replace(/^\s*/g,"");   //去除空格
        while(this.awardRecord.recordList.indexOf(" ") != -1) {
          this.awardRecord.recordList = this.awardRecord.recordList.replace(" ","")
        }
    
    },
    repSign(s) {
        s = s.replace(/([\u4E00-\u9FA5]|^|\n|\r)([\,\.\?\!])(?=[\u4E00-\u9FA5]|$|\n|\r)/g,function(u,v,w,x) {
          sign = {
            ':': '：',
            ',': '，',
            '.': '。',
            '?': '？',
            '!': '！'
          };
          return sign[w] ? v + sign[w] : u;
        });
        console.log(s);

        return s;
        
      },
    
    // 单位对话框取消事件
    companyDialogCancel() {
      this.companyName = '';
      this.departmentId = '';
      this.unitId = '';
      this.miniCompanyList = [];
      this.CompanyDialog = false;
     
    },
    // 单位对话框确认
    submitCompany() {
   
      this.CompanyDialog = false;
    },
    // 点击小单位
    clickUnit(item) {
      this.miniCompanyName = item.UNIT;
      this.awardRecord.recordUnit.unitId = item.unitId;
      this.unitId = item.unitId;
    },
    // 选择单位 
    selectCompany() {
      this.selectOrganizationList()
      this.CompanyDialog =  true;
    },
    // 查询大单位
    selectOrganizationList() {
      selectOrganizationList().then(res => {
        this.companyList = res.data
      })
    },
    // 查询小单位
    selectUnitList(item) {
      this.companyName = item.department;
      this.awardRecord.recordUnit.departmentId = item.departmentId;
      this.departmentId = item.departmentId
      let obj = {
        departmentId: item.departmentId
      }
      selectUnitList(obj).then(res => {
        this.miniCompanyList =  res.data;
      })
    },
    changeAwards(value) {
      console.log(value);
      for(var i = 0; i < this.awardLsit.length; i++) {
        if(this.awardLsit[i].praiseId == value) {
          this.awardRecord.recordName = this.awardLsit[i].praiseName;
          this.awardRecord.recordGrade = this.awardLsit[i].praiseGrade
        }
      }
    },
    // 查询所有奖项
    getAwardLList() {
      getAwardLList(this.getAwardLListForm).then(res => {
        console.log(res);
        if(res.code){
          this.awardLsit = res.data;
        }
      })
    },
    // 保存 
    dataAnalysis() {
      console.log(this.awardRecord);
      if(this.awardRecord.praiseId != ''){
        if(this.awardRecord.recordFile != ''){
          if(this.awardRecord.recordGrade != ''){
            if(this.awardRecord.recordList != ''){
              if(this.awardRecord.recordName != ''){
                if(this.awardRecord.praiseTime != '年'){
                  if(this.awardRecord.recordUnit.departmentId != ''){
                    this.awardRecord.praiseTime =   this.praiseTime + '年'+ this.season;
                    console.log(this.awardRecord.praiseTime)
                    newAwardRecord(this.awardRecord).then(res => {
                        if(res.code == 200) {
                          this.awardRecord.recordList='';
                          this.awardRecord.recordUnit='';
                          this.companyName='';
                          this.awardRecord = {
                                praiseId: '',
                                recordFile: '111',
                                recordGrade: '',
                                recordList: '',
                                recordName: '',
                                praiseTime: '',
                                recordUnit: {
                                  departmentId: '',
                                  unitId: ''
                                },
                              },
                          this.$message.success(res.message);
                        }else {
                          this.$message.error(res.message);
                        }
                      }).catch(err => {
                        this.$message.error("网络错误");
                      })
                            
                  }else {
        this.$message.error("请补全信息");
      }
                }else {
        this.$message.error("请补全信息");
      }
              }else {
        this.$message.error("请补全信息");
      }
            }else {
        this.$message.error("请补全信息");
      }
          }else {
        this.$message.error("请补全信息");
      }
        }else {
        this.$message.error("请补全信息");
      }
      }else {
        this.$message.error("请补全信息");
      }
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
    },
    // 新增奖项
    addAwards() {
      this.dialogVisible = true;
    },
    // 确认新增
    confirmAddAwards() {
      addAwards(this.awardsInfo).then(res => {
        console.log(res);
        if(res.code == 200 ) {
          this.$message.success(res.message);
          this.getAwardLList()
          this.dialogVisible = false;
        }else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err);
        this.$message.error('网络错误或服务器异常')
      })      
    },
    // 上传成功
    uploadSuccess(response, file, fileList){
      // let 
      console.log(response);
      this.fileList = [];
      console.log(response.data[0]);
      console.log("--------------------------------------")
      this.awardRecord.recordFile = response.data[0];
      console.log()
      this.url =  window.api.baseURL + '/'+ response.data[0]
    },
    progress(event,file){
     this.data.name = file.name;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
  
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    
  },
  
};
</script>

<style scoped lang="less">
.unstructured-collection {
  .filename  {
    border: none;
  }
  .upload {
    display: flex;
    .el-button--small {
      margin-left: 80px;
      padding: 13px 15px;
    }

  }
  display: flex;
  .operation,
  .view {
    width: 50%;
    padding: 20px;
  }
  .view,  .operation {
    border-radius: 8px;
    box-shadow: inset 0px 0px 4px #daedff, 0px 0px 3px #1991ff;
  }
  .operation {
    width: 50%;
    padding: 20px;
    margin-right: 20px;
    .upload-demo {
      margin-bottom: 20px;
     
    }
    .awardsForm {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 50%;
      }
    }
    .el-form {
      .el-form-item {
        // margin-bottom: 20px !important;
      } 
    }
    .btns {
      display: flex;
      justify-content: space-between;
      margin-left: 50%;
      padding: 0 20px;
      transform: translateX(-50%);
      .btn {
        margin:0 ;
        transform: none;
      }
    }
  }
}
.companyList {
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
}
.el-dialog__body ,.el-dialog__footer{
  content: "";
  display: block;
  height: 0;
  clear:both;
  visibility: hidden;
}
.active {
  color: #fff !important;
  background-color: #077dd8 !important;
}
.is-checked {
  background: none !important;
}
</style>
