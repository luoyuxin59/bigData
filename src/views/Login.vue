<template>
  <div class="login">
    <div class="loginForm">  
      <form>
        <span>用户名</span>
        <input type="text" name="username"><br>
        <span>密&nbsp;&nbsp; 码</span>
        <input type="text" name="password"><br>
        <span>验证码</span>
        <input type="text" name="lastname"><br>
      </form>
      <el-row>
        <el-button plain>登录</el-button>
        <el-button plain>注册</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name:'',
  components: {},
  data() {
    return {}
 },
  computed: {},
  created() {},
  mounted() {
  },
  methods: {
   
  },
};
</script>

<style scoped lang="less">

</style>
