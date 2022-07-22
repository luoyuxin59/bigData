<template>
  <div class="registered">
    <img class="title" src="../assets/images/login/title.png" alt="" />
    <!-- 注册表单 -->
    <div class="loginForm">
      <img class="iptBg" src="../assets/images/registered/zhuceBg.png" alt="" />
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" size="mini" type="password"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="form.gender"
            placeholder="请选择性别"
            size="mini"
            width="100%"
          >
            <el-option label="男" value="1"> </el-option>
            <el-option label="女" value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务" prop="post">
          <el-input v-model="form.post" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <div class="block">
            <el-date-picker
              v-model="form.birthday"
              size="mini"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input
            v-model="form.phone"
            size="mini"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            >></el-input
          >
        </el-form-item>
        <el-form-item label="证件号码" prop="idCard">
          <el-input
            v-model="form.idCard"
            size="mini"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            >></el-input
          >
        </el-form-item>
      </el-form>
      <div class="btnImg">
        <img
          src="../assets/images/registered/zhuce.png"
          @click="registered"
          alt=""
        />
        <img src="../assets/images/registered/back.png" @click="back" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import { userRegister } from "../network/collection";
export default {
  name: "",
  components: {},
  data() {
    var checkData = (rule, value, callback) => {
      if (value) {
        if (/[^\w\.\/]/gi.test(value)) {
          callback(new Error("请不要输入中文和空格！"));
        } else {
          callback();
        }
      }
      callback();
    };
    return {
      form: {
        username: "",
        password: "",
        realName: "",
        gender: "",
        post: "",
        birthday: "",
        phone: "",
        idCard: "",
      },
      rules: {
        username: [
          { required: true, message: "请填写用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          { validator: checkData, trigger: "blur" },
        ],
        realName: [
          { required: true, message: "请填写真实姓名", trigger: "blur" },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        post: [
          {
            required: true,
            message: "请填写职务",
            trigger: "blur",
          },
        ],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        phone: [{ required: true, message: "请填写电话号码", trigger: "blur" }],
        idCard: [
          { required: true, message: "请填写证件号码", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    registered() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form);
          userRegister(this.form)
            .then((res) => {
              if (res.code == 200) {
                console.log(res.message);
                this.$message.success(res.message);
                this.$refs.form.resetFields();
                
              } else {
                this.$message.error(res.message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }else {
          this.$message.error('请补充注册信息');
          return false;
        }
      });
    },
    back() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/tool.less";

.registered {
  background: url("../assets/images/registered/bg.jpg") no-repeat 0 0;
  .bg();
  .loginForm,
  .title,
  .el-form,
  .btnImg {
    .position-center();
  }
  .loginForm {
    top: 55%;
    .iptBg {
      height: 540px;
    }
    .el-form {
      top: 45%;
      width: 73%;
      padding: 50px;
      .el-form-item {
        margin-bottom: 10px;
      }
      .el-form-item__label {
        color: #fff;
      }
      .el-select {
        width: 100%;
      }
    }
  }
  .form {
    width: 300px;
    height: 200px;
    margin: 0 auto;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .btnImg {
    top: 88%;
    width: 72%;
    display: flex;
    justify-content: space-between;
  }
  .title {
    top: 15%;
  }
}
</style>
