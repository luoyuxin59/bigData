<template>
  <div class="login">
    <img class="title" src="../assets/images/login/title.png" alt="">
    <div class="loginForm">
      <img class="loginIptBg" src="../assets/images/login/loginBg.png" alt="" />
      <form class="iptForm">
        <div class="iptItem">
          <span>用户名</span>
          <input
            type="text"
            name="username"
            autocomplete="off"
            v-model="loginForm.username"
          />
        </div>
        <div class="iptItem">
          <span>密码</span>
          <input
            type="password"
            name="password"
            autocomplete="off"
            v-model="loginForm.password"
          />
        </div>
        <div class="iptItem">
          <span>验证码</span>
          <input
            class="code"
            type="text"
            name="code"
            autocomplete="off"
            v-model="loginForm.code"
            @keyup.enter="login"
          />
            <img ref="codeImg" @click="getCode" class="codeImg"  src="" alt="">
        </div>
      </form>
      <div class="btnImg">
        <img src="../assets/images/login/login.png" @click="login" alt="">
        <img src="../assets/images/login/zhuce.png" @click="registered" alt="">
      </div>
      <!-- <el-row>
        <el-button plain   size="mini">登录</el-button>
        <el-button plain  size="mini">注册</el-button>
      </el-row> -->
    </div>
          <div id="echart" style="width:1000px;height:500px;"></div>

  </div>
</template>
<script>
import * as d3 from 'd3';
import BASE_URL from '../network/config.js'
import {login,getKey,getCode} from "../network/collection"
export default {
  name: "",
  components: {},
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
        code: "",
      },
  
    };
  },
  computed: {},
  created() {},
  mounted() {
   this.getCode()
  //  this.treeShow()
  },
  methods: {
       treeShow() {
      //定义边界
      var margin = { top: 90, bottom: 0, left: 10, right: 0 };

      var width=960;
      var height=600;
      var svg = d3
        .select("body")
        .append("svg")
        .attr("width", width + "px")
        .attr("height", height + "px");

      var g = svg
        .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

      var scale = svg
        .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");
// 创建一个层级布局
  var hierarchyData = d3.hierarchy(this.dataset).sum(function(d) {
    return d.value;
  });
  console.log(hierarchyData);

// 创建一个树状图
  var tree = d3
    .tree()
    .size([width - 400, height - 200])
    .separation(function(a, b) {
      return (a.parent == b.parent ? 1 : 2) / a.depth;
    });
  var treeData = tree(hierarchyData);
  var nodes = treeData.descendants();
  var links = treeData.links();
  var generator = d3
    .linkHorizontal()
    .x(function(d) {
      return d.y;
    })
    .y(function(d) {
      return d.x;
    });
  g.append("g")
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("d", function(d) {
      var start = { x: d.source.x, y: d.source.y };
      var end = { x: d.target.x, y: d.target.y };
      return generator({ source: start, target: end });
    })
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", 1);
  var gs = g
    .append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", function(d) {
      var cx = d.x;
      var cy = d.y;
      return "translate(" + cy + "," + cx + ")";
    });
//绘制节点
  gs.append("circle")
    .attr("r", 6)
    .attr("fill", "white")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .on("mouseover", function(d) {   //交互
      d3.select(this)
        .attr("stroke", "skyblue")
        .attr("stroke-width", 2)
    })
    .on("mouseout",function(){
      d3.select(this)
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
    })

  //绘制文字
  gs.append("text")
    .attr("x", function(d) {
      return d.children ? -90 : 10;
    })
    .attr("y", -5)
    .attr("dy", 10)
    .text(function(d) {
      return d.data.name;
    })
    .on("mouseover", function(d) {    //交互
      d3.select(this)
        .attr("fill", "red")
    })
    .on("mouseout",function(){
      d3.select(this)
        .attr("fill", "#000")
    })

    },  
    // 获取验证码
    getCode(){
      let time = new Date()
      // 10.16.131.90:8084
      // 192.168.1.59:8084
      this.$refs.codeImg.src = BASE_URL + '/verificationCode/getCode?d=' + time
      console.log(this.$refs.codeImg.src);
      },
    // 随机秘钥
    getKey() {
      getKey().then(res => {
        if(res.code == 200) {
        }else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 登录
    login() {
      // this.getKey()
      login(this.loginForm).then((res) => {
        console.log(res);
        if(res.code == 200) {
          sessionStorage.setItem('token', res.data.token);
          this.$router.push("/");
          this.$message.success(res.message)
        }else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        console.log(err);
      });
      console.log(this.loginForm);
    },
    registered() {
      console.log(1);
      this.$router.push("/registered");
    },
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/tool.less";

.login {
  background: url("../assets/images/login/bg.jpg") no-repeat;
 .bg();

  .loginForm ,.iptForm, .btnImg , .title{
    .position-center();
    .iptForm {
      top: 40%;
      width: 62%;
      .iptItem {
        line-height: 45px;
        span {
          display: inline-block;
          width: 50px;
          padding-right: 15px;
          color: #fff;
          .font-justify()
        }
        input {
          width: 220px;
          height: 24px;
          padding: 0 15px;
          outline: none;
          font-size: 14px;
          border: 1px solid #fff;
          border-radius: 2px;
        }
        .code {
          width: 100px;
        }
        img {
          margin-left: 10px;
          vertical-align: middle;
        }
      }
    }
    .btnImg {
      top: 75%;
      width: 62%;
      display: flex;
      justify-content: space-between;
    }
  }
  .title {
    top: 20%;
  }
}
</style>

