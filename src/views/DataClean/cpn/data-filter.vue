<template>
  <div class="data-filter border">
    <el-row>
      <el-form ref="form" :model="query" label-width="130px">
        <el-col :span="6">
          <el-form-item label="请选择数据集">
            <el-select
              v-model="query.tableName"
              @change="getScreenList"
              size="mini"
              placeholder="请选择"
              style="width: 150px"
            >
              <el-option
                v-for="item in tableList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="请选择入学年份"
            v-if="query.tableName.indexOf('学员') != -1"
          >
            <el-select
              v-model="query.enrollmentYear"
              size="mini"
              placeholder="请选择"
              style="width: 150px"
              clearable
            >
              <el-option
                v-for="(item, index) in studentTimeList"
                :key="index"
                :label="item[0]"
                :value="item[0]"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item
            label="请选择学历层次"
            v-if="query.tableName.indexOf('学员') != -1"
          >
            <el-select
              v-model="query.cultivationLevel"
              size="mini"
              placeholder="请选择"
              style="width: 150px"
              clearable
            >
             <el-option
                v-for="(item, index) in levelList"
                :key="index"
                :label="item[0]"
                :value="item[0]"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="请选择考生层次"
            v-if="query.tableName.indexOf('学员') != -1"
          >
            <el-select
              v-model="query.personnelCategory"
              clearable
              size="mini"
              placeholder="请选择"
              style="width: 150px"
            >
              <el-option
                v-for="(item, index) in $store.state.studentTypeList"
                :key="index"
                :label="item[0]"
                :value="item[0]"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="课程名称"
            v-if="query.tableName.indexOf('课程') != -1"
          >
             <el-select
              v-model="query.courseName"
              style="width: 150px"
              filterable
              remote
              clearable
              size="mini"
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getCourseName"
              :loading="loading">
              <el-option
                v-for="(item, index) in courseNameList"
                :key="index"
                :label="item[0]"
                :value="item[0]">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="考核学期"
            v-if="query.tableName.indexOf('考核') != -1"
          >
            <el-select
              v-model="query.assessmentTerm"
              clearable
              size="mini"
              placeholder="请选择"
              style="width: 150px"
            >
              <el-option
                :label="item[0]"
                :value="item[0]"
                :key="index"
                v-for="(item, index) in dataTimeList"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="体能学期"
            v-if="query.tableName.indexOf('体能') != -1"
          >
            <el-select
              v-model="query.physicalFitnessSemester"
              clearable
              size="mini"
              placeholder="请选择"
              style="width: 150px"
            >
              <el-option
                :label="item[0]"
                :value="item[0]"
                :key="index"
                v-for="(item, index) in semesterTimeList"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="干部获奖时间"
            v-if="query.tableName.indexOf('获奖') != -1"
          >
            <el-select
              v-model="query.awardTime"
              clearable
              size="mini"
              placeholder="请选择"
              style="width: 150px"
            >
              <el-option
                :label="item[0]"
                :value="item[0]"
                :key="index"
                v-for="(item, index) in awardTimeList"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
         <el-col :span="6">
          <el-form-item
            label="人员类别"
            v-if="query.tableName.indexOf('获奖') != -1"
          >
            <el-select
              v-model="query.personnelCategory"
              clearable
              size="mini"
              placeholder="请选择"
              style="width: 150px"
            >
            <el-option  label="学员" value="学员" ></el-option>
            <el-option  label="老师" value="老师" ></el-option>

            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="获奖名称"
            v-if="query.tableName.indexOf('获奖') != -1"
          >
           <el-select
              v-model="query.nameOfAward"
              style="width: 150px"
              multiple
              filterable
              remote
              size="mini"
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getCourseName"
              :loading="loading">
              <el-option
                v-for="(item, index) in awardNameList"
                :key="index"
                :label="item[0]"
                :value="item[0]">
              </el-option>
            </el-select>

          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button
              type="primary"
              class="startBtn"
              @click="dataCleanTwo"
              size="mini"
              >查询样本</el-button
            >
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { throws } from "assert";
import {
  getCategory,
  getStudentTime,
  getLevel,
  dataCleanTwo,
  getSemesterTime,
  getDataTime,
  getAwardTime,
  getCourseName,
  getAwardName,
} from "../../../network/collection";
export default {
  name: "dataFilter",
  components: {},
  data() {
    return {
      loading: false,
      query: {
        tableName: "", // 表名称
        enrollmentYear: "", // 入学年份
        cultivationLevel: "", // 培养层次
        courseName: "", // 课程名称
        assessmentTerm: "", // 考核学期
        physicalFitnessSemester: "", // 体能学期
        cadreTrainee: "", // 干部学员
        awardTime: "", // 获奖时间
        nameOfAward: "", // 获奖名称
        personnelCategory: "", // 人员类别
        pageNo: '1',
        pageSize: '20'
      },
      tableList: [
        "学员",
        "干部",
        "课程学分",
        "考核成绩",
        "体能成绩",
        "获奖",
      ],
      dataTimeList: [],
      awardTimeList: [],
      semesterTimeList: [],
      courseNameList:[],
      awardNameList:[],
      studentTimeList:[],
      levelList:[],
      categoryList:[]
    };
  },
  created() {},
  computed: {},
  mounted() {},
  methods: {
    dataCleanTwo(){
      if(this.query.tableName != ''){
        console.log(this.query);
        dataCleanTwo(this.query).then(res => {
        if(res.code == 200) {
          this.$emit('getData',res.data, this.query.tableName )
        }
      })
      }else {
        this.$message.error('请选择数据集')
      }
     
    },
    getScreenList() {
        this.query.enrollmentYear = "", // 入学年份
        this.query.cultivationLevel = "", // 培养层次
        this.query.courseName = "", // 课程名称
        this.query.assessmentTerm = "", // 考核学期
        this.query.physicalFitnessSemester = "", // 体能学期
        this.query.cadreTrainee = "", // 干部学员
        this.query.awardTime = "", // 获奖时间
        this.query.nameOfAward = "", // 获奖名称
        this.query.personnelCategory = "" // 人员类别
      switch (this.query.tableName) {
        case "考核成绩":
          this.getDataTime();
          break;
        case "获奖":
          this.getAwardTime();
          break;
        case "体能成绩":
          this.getSemesterTime();
          break;
        case  "学员":
          this.getStudentTime();
          this.getLevel();
          this.getCategory()
        default:
          break;
      }
    },
    // 学员类别查询
    getCategory(){
      // getCategory().then(res => {
      //   if(res.code == 200) {
      //     this.categoryList = res.data
      //   }
      // })
      // this.$store.dispatch('getStudentType')
      // $store.state.studentTypeList.length
    },
    // 学员培养层次查询
    getLevel(){
      getLevel().then(res => {
        if(res.code == 200) {
          this.levelList = res.data
        }
      })
    },
    // 学员培养层次查询
    getStudentTime(){
      getStudentTime().then(res => {
        if(res.code == 200) {
          this.studentTimeList = res.data
        }
      })
    },
    //  课程名称搜索
    getCourseName(query){
      if(query != ''){
        this.loading = true;
        let obj = {
          name: query
        }
        getCourseName(obj).then(res => {
          if(res.code = 200) {
            this.courseNameList = res.data
          }
        })
        this.loading = false;
        }
    },
    // 获奖名称搜索
    getAwardName(query){
      if(query != ''){
        this.loading = true;
        let obj = {
          name: query
        }
      getAwardName(obj).then(res => {
        if(res.code = 200) {
          this.awardNameList = res.data
        }
      })
      }
    },
    // 体能成绩时间
    getSemesterTime() {
      getSemesterTime().then((res) => {
        if (res.code == 200) {
          this.semesterTimeList = res.data;
        }
      });
    },
    // 获取考核成绩学期
    getDataTime() {
      getDataTime().then((res) => {
        if (res.code == 200) {
          this.dataTimeList = res.data;
          console.log(this.dataTimeList);
        }
      });
    },
    // 获奖时间查询
    getAwardTime() {
      getAwardTime().then((res) => {
        if (res.code == 200) {
          this.awardTimeList = res.data;
          console.log(res);
        }
      });
    },
    // 选择数据表
    getTableList() {},
    start() {},
  },
};
</script>
<style lang="scss" scoped></style>
