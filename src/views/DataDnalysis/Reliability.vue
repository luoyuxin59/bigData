// 信度分析
<template>
  <div class="reliability">
    <div class="screen clearfix">
      <div class="t"><span class="el-icon-caret-right">筛选样本</span></div>
     <el-row>
      <el-form ref="form" :model="form" label-width="120px">
      <el-col :span="6">
        <el-form-item label="请选择数据表">
          <el-input v-model="value" size="mini" :disabled="true"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
        <el-form-item  label="请输入教员姓名">
         <el-input v-model="query.teacher" size="mini" style="width: 150px"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  label="请输入课程名">
         <el-input v-model="query.course" size="mini" style="width: 150px"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
        <el-form-item>
            <el-button  type="primary" class="startBtn" @click="start"  size="mini">开始分析</el-button>
        </el-form-item>
        </el-col>
      </el-form>
      </el-row>
   
   </div>
    <div class="result clearfix">
      <div class="t"><span class="el-icon-caret-right">分析结果</span></div>
      <!-- <div ref="FXJG" style="width: 600px;height:400px;"></div> -->
       <div  v-show="score != '' " style="padding: 0 50px 0 0; line-height: 30px;">
          信度分析（Reliability）即可靠性分析，是指采用同样的方法对同一对象重复测量时所得结果的一致性程度。
      检验评教问卷信度的目的是为了确保学员回答的结果能够真实反映评教预期目标，收集的数据有分析价值。
      Cronbach α系数是最常用的信度测量方法，侧重评价评教问卷结构的一致性，即题项是否是考察同一个概念的问题。
      </div>
      <div class="table" v-show="score != '' ">
        <div class="title">参考标准</div>
        <table border="1" cellspacing="0" style="width: 320px;">
          <thead>
            <tr>
              <th style="width: 100px">系数</th>
              <th style="width: 200px">结果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0~0.6</td>
              <td >较差,考虑重新编问卷</td>
            </tr>
            <tr>
              <td>0.6~0.7</td>
              <td>一般，可以接受</td>
            </tr>
            <tr>
              <td>0.7~0.8</td>
              <td>良好,可以接受</td>
            </tr>
            <tr>
              <td>0.8以上</td>
              <td>极好</td>
            </tr>
          </tbody>
        </table>

      </div>
    
      <div class="score" ref="score" style="width:350px; height: 350px;">
      </div>
    </div>
  </div>
</template>
<script>
import {cronbach,selectTableList,getTableList,selectDataset} from "../../network/collection";
import TableV from "../../components/common/TableV.vue";
import axios from "axios";
export default {
  name: "",
  components: {
    TableV,
  },
  data() {
    return {
      form: {},
      options: [],
      value: "职工评教表",
      clounmList: [],
      score: "",
      cities:['学员评教分数'],
      checkedCities: [], // 已选择的数据
      getTableform: {
        connectionAddress: "192.168.1.85",
        connectionDatabaseName: "armedPolice",
        connectionId: this.$store.state.connectionId,
        connectionName: "武警1",
        connectionPassword: "Zlser_123",
        connectionPort: "3306",
        connectionType: "1",
        connectionUsername: "root",
        createdById: 1,
      },
      connectionId: '',
      fieldList:[],
      tableList:[],
      myChart:'',
      query: {
        teacher: '',
        course: ''
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.selectDataset()
  },
  methods: {
    // 查询表数据
    selectDataset() {
       let obj = {
        type: '1'
      }
     selectDataset(obj).then(res => {
       if(res.code == 200) {
         console.log(res);
         this.tableList =  res.data
        let arr = []
        this.tableList =  arr;
       }
     })
    },
    // 查询表字段
    getTableList(value) {
      const loading = this.$loading({
        lock: true,
        text: "数据集准备中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });
      let obj = {
        pageNum: 1,
        pageSize: 1,
        type: '1',
        tableName: value,
        connectionId: this.$store.state.connectionId,
      }
      getTableList(obj).then(res => {
        console.log(res);
        if(res.code == 200) {
          this.fieldList = res.data.columnComment;
         
        }
         loading.close()
      })
    },
    cronbach(){
       const loading = this.$loading({
        lock: true,
        text: "AI实时计算中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
      });      
      cronbach(this.query).then(res => {
        if(res.code == 200) {        
          console.log(!res.data);   
          if(!res.data) {   
            console.log(1);         
            this.$message.error(res.message)
          }
          this.score = this.formatDecimal(res.data.score,2)
          this.drawLine();
          
          setTimeout(()=>{
            let imgEchart = new Image();
            imgEchart = this.myChart.getDataURL({
            type: "png",
            pixelRatio: 1,// 倍数
            // backgroundColor: '#ccc'// 背景
        });
        
        console.log(imgEchart)
         imgEchart = imgEchart.replace(/^data:image\/\w+;base64,/, "")
            sessionStorage.setItem('Reliability',imgEchart)
          },1500)
        } 
        loading.close()
      }).catch(err => {
        loading.close()
      })
    },
     formatDecimal(num, decimal) {
                num = num.toString()
                let index = num.indexOf('.')
                if (index !== -1) {
                    num = num.substring(0, decimal + index + 1)
                } else {
                    num = num.substring(0)
                }
                return parseFloat(num).toFixed(decimal)
            },
    select() {
      console.log(this.checkedCities);
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(this.$refs.score);
      // console.log(myChart);
      // 绘制图表
      this.myChart.setOption({
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            name: "Pressure",
            type: "gauge",
            min: 0,
            max: 1,
            progress: {
              show: true,
            },
            detail: {
              valueAnimation: true,
              formatter: "{value}",
            },
            axisLine: {
              //仪表盘轴线样式
              lineStyle: {
                width: 10,
              },
            },
            splitLine: {
              //分割线样式
              length: 10,
            },
            data: [
              {
                value: this.score,
                name: "α系数",
              },
            ],
          },
        ],
      });
     
   },

    start() {
      if(this.value != '') {
        this.cronbach()
      }else {
        this.$message.error('请选择分析数据')
      }
    },
    
  },
};
</script>

<style scoped lang="less">
.reliability {
  .t {
    background: #edf6ff;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    span {
      font-weight: bold;
      color: #00a1f4;
      display: inline-block;
      padding: 8px 0px;
      border-radius: 24px;
      margin: 10px 30px;
    }
  }
  .screen,
  .result {
    padding: 20px;
    box-shadow: inset 0px 0px 4px #daedff, 0px 0px 3px #1991ff;
    border-radius: 8px;
    .score {
      float: left;
      font-size: 24px;
      line-height: 200px;
      span {
        line-height: 36px;
        font-size: 36px;
        font-weight: 700;
      }
    }
    .title {
      line-height: 30px;
      padding-left: 10px;
    }
    .table {
      float: left;
      margin-top: 40px;
      table {
        overflow-x: visible !important;
      }
    }
  }
  .screen {
    margin-bottom: 20px;

    .el-form {
      .el-form-item {
        // width: 300px;
        float: left;
      }
    }
    .startBtn {
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
