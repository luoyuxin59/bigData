// 接口采集
<template>
  <div class="interface-collect">
    <div class="parameter">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-form-item label="名称">
          <el-input v-model="collectFrom.dataSourceName"></el-input>
        </el-form-item>
        <el-form-item label="数据库URL">
          <el-input v-model="collectFrom.dataSourceUrl"></el-input>
        </el-form-item>
        <el-form-item label="token">
          <el-input v-model="collectFrom.dataSourceToken"></el-input>
        </el-form-item>
        <el-form-item label="当前页">
          <el-input v-model="collectFrom.currentPage"></el-input>
        </el-form-item>
        <el-form-item label="每页采集条数">
          <el-input v-model="collectFrom.pageSize"></el-input>
        </el-form-item>
        <el-form-item label="其他参数">
          <el-input v-model="collectFrom.term"></el-input>
        </el-form-item>
        <div>注：成绩接口可在其他参数加”2021-2022-1”字样</div>
      </el-form>
      <btn btnName="数据抽取" style="margin-top: 20px" @click.native="collection"></btn>
      <div class="message" v-show="jsonList.length">抽取成功，本次共抽取数据{{jsonList.length}}条。</div>
    </div>
    <div class="preview">
      <h4 class="title">数据预览>>></h4>
      <div class="detail">
        <json-editor :dataList="jsonList" class="json-edit"></json-editor>
        <btn class="clean" btnName="数据清洗>>" @click.native="clean"></btn>
      </div>
    </div>
  </div>
</template>
<script>
 import {interfaceAcquisition} from "../../network/collection"

import Btn from "../../components/common/Btn.vue";
import JsonEditor from "../../components/common/JsonEditor.vue";
export default {
  name: "",
  components: {
    Btn,
    JsonEditor,
  },
  data() {
    return {
      form: {
        name: "",
        region: "",
      },
      collectFrom: {
        dataSourceName: '',
        dataSourceToken: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBQUMzQkQ0QzBEM0ZCMjg3RTA1NTI4OURDQjlGRTA1MCIsInRva2VuX3VzZXJfbmFtZSI6IkFBQzNCRDRDMEQzRkIyODdFMDU1Mjg5RENCOUZFMDUwIiwidG9rZW5fdXNlcl9hcHBpZCI6IkM1NTJCMTBCMDhGQUU4QjZFMDU1Mjg5RENCOUZFMDUwIiwidG9rZW5fdXNlcl90eXBlIjoiRU1QTE9ZRUUifQ.m1FoEeTxwpiYNCMTIrR9ihd73SBNy4kAZF4VhajnOx4',
        dataSourceUrl: '',
        currentPage : '',
        pageSize: '',
        term: '',
      },
      jsonList:[]
    };
  },
  computed: {},
  created() {},
  mounted() {
    console.log(this.jsonList.length);
  },
  methods: {
    
     // 加载动画
    loading() {
      const loading = {
        lock: true,
        text: "数据抽取中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      };
    },
    // 关闭动画
    closeLoad(){
       this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            this.loadingInstance.close();
          });
    },
    // 数据清洗
    clean(){
      const loading = this.$loading({
        lock: true,
        text: "数据加载中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let arr = []
      let tableLabel = [];
      let obj = {}
      console.log(JSON.stringify(this.jsonList))
      if(JSON.stringify(this.jsonList).length > 2) {
        for(var key in this.jsonList[0]) {
          arr.push(key)
        }
        console.log(arr)
        this.$store.state.term  = this.collectFrom.term;
        this.$store.state.notCleanData = this.jsonList;
        this.$store.state.total = this.jsonList.length;
        this.$store.state.tableUrl = this.collectFrom.dataSourceUrl;
        this.$store.state.tableLabel= arr;
        this.$store.state.pageNum = this.collectFrom.currentPage;
        console.log(this.currentPage);
        
         if(this.$store.state.notCleanData.length == this.jsonList.length) {
           loading.close();
           this.$router.push('/InterfaceClean')
         }
      }else {
        loading.close();
        this.$message.error('暂无待清洗数据')
      }
    },
    // 接口数据采集
    collection() {
     const loading = this.$loading({
        lock: true,
        text: "数据抽取中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      interfaceAcquisition(this.collectFrom).then(res => {
        if(res.code == 200) {
          loading.close();
          this.$message.success(res.message)
          // let obj = JSON.parse(res.pageData)
          let obj = JSON.parse(res.data)
          console.log( obj.data)
          this.jsonList = obj.data.pageData;
          // this.jsonList = obj.data;
          console.log(this.jsonList)
        }else{
          loading.close();
          this.$message.console.error(res.message)
          }
        }).catch(err => {
          loading.close();
          console.log(err);
          // this.$message.error('请求错误')
        })
    }
  },
};
</script>

<style scoped lang="less">
.interface-collect {
  display: flex;
  height: 100%;
  .parameter,
  .preview {
    padding: 20px;
    box-shadow: inset 0px 0px 4px #daedff, 0px 0px 3px #1991ff;
    border-radius: 8px
  }
  .parameter {
    width: 30%;
    height: 100%;
    padding: 0 60px 0 60px;
    margin-right: 20px;
    .el-form {
      padding-top: 160px;
      .el-select {
        width: 100%;
      }
      .scope {
        margin-left: 0;
        .scope-ipt {
          width: 100px;
        }
        .to {
          margin: 20px;
        }
      }
    }
  }
  .preview {
    width: 70%;
    padding: 0 10px;
    height: 100%;
    .detail {
      position: relative;
      width: 100%;
      height: 90%;
      .json-edit div {
        height: 100% !important;
      }
      .clean {
        margin-top: 30px;
        margin-left: 60%;
        // position: absolute;
        // bottom: 30px;
        // right: 50%;
      }
    }
  }
}
.message {
      margin-top: 50px;
      font-size:24px;
    }

</style>
