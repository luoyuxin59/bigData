<template>
  <div class="set">
    <template>
        <el-table
          :data="logList"
          
          border
          style="width: 100%">
          <el-table-column type="index" label="#" width="80">
          </el-table-column>
          <el-table-column prop="recordId" label="ID" :show-overflow-tooltip="true" >
          </el-table-column>
          <el-table-column prop="recordName" label="清洗记录名称" >
          </el-table-column>

          <el-table-column prop="createdByName" label="创建人">
          </el-table-column>
            <el-table-column prop="createdTime" label="创建时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="getLogById(scope.row)" type="text" size="small">下载日志</el-button>
            </template>
        </el-table-column>
        </el-table>
        <div class="block">
        <el-pagination
          background
          layout="prev, pager, next"
          @prev-click="prev"
          @next-click="next"
          @current-change="currentChange"
          :total="total">
        </el-pagination>
      </div>
      </template>
      <!-- http://192.168.1.59:8084/armedPolice/v1/dataClean/selectCleanLog?pageNow=1&pageSize=20
      http://192.168.1.59:8084/armedPolice/v1/dataClean/selectCleanLog?pageNow=1&pageSize=10 -->
  </div>
</template>
<script>
import {getLogList,getLogById} from "../../network/collection"
export default {
  name:'',
  components: {},
  data() {
    return {
      logList: [],
      logInfo: {},
      query: {
        pageNow: 1,
        pageSize: 10,
      },
      total: 0
    }
 },
  computed: {},
  created() {},
  mounted() {
    this.getLogList()
  },
  methods: {
    // 查询清洗日志列表
    getLogList() {
      getLogList(this.query).then(res => {
        console.log(res);
        if(res.code == 200) {
          this.logList = res.data.list;
          this.total = res.data.total;
        }else {
          // this.$message.error('请求错误,状态码：' + res.code  + res.message)
        }
      })
    },
  //  查看日志详情
  getLogById(row){
    let query =   {recordId: row.recordId}
    console.log(query);
    getLogById(query).then(res => {
      console.log(res);
      if(res.code == 200) {
        if(row.cleanLog != ''){
           this.sequenceDownload(res.data)
        }else {
          this.$message.error('清洗日志为空')
        }
      }else {
        this.$message.error(res.message)
      }
    }).catch(err => {
      this.$message.error(err)
    })
   },
   sequenceDownload(row) {
      console.log(row);
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(row.cleanLog))
      element.setAttribute('download', row.recordName)
      element.style.display = 'none'
      element.click()
    },
    prev(value) {
      console.log(value);
      this.query.pageNow = value
      this.getLogList()
    },
    next(value) {
      this.query.pageNow = value
      this.getLogList()
    },
    currentChange(value) {
      this.query.pageNow = value
      this.getLogList()
    }
  },
};
</script>

<style scoped lang="less">
.el-pagination {
  margin-left: 60%;
  transform: translateX(-50%);
}
</style>
