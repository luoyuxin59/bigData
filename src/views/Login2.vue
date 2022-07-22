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
  </div>
</template>
<script>
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
  },
  methods: {
    // 获取验证码
    getCode(){
      let time = new Date()
      // 10.16.131.90:8084
      // 192.168.1.59:8084
      this.$refs.codeImg.src = process.env.VUE_APP_BASE_URL + '/verificationCode/getCode?d=' + time
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

