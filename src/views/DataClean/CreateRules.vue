<template>
  <div class="create-rules">
    <el-form ref="form" :model="ruleForm" label-width="80px" size="mini">
      <el-form-item label="规则名称">
        <el-input v-model="ruleForm.ruleName" style="width:250px"></el-input>
      </el-form-item>
      <el-form-item label="规则注释">
        <el-input v-model="ruleForm.ruleNote" style="width:250px"></el-input>
      </el-form-item>
      <el-form-item label="清洗类型">
        <el-select
          v-model="ruleForm.ruleType"
          placeholder="请选择类型"
          style="width:250px"
        >
          <el-option label="字符类" value="1"></el-option>
          <el-option label="数值类" value="2"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="string" v-show="ruleForm.ruleType === '1'">
      <el-checkbox
        label="非空"
        v-model="ruleForm.ruleDetails.notNull"
      ></el-checkbox>
      <el-checkbox
        label="重复"
        v-model="ruleForm.ruleDetails.unique"
      ></el-checkbox>
      <span class="default">默认值</span>
      <el-input
        style="width:90px"
        v-model="ruleForm.ruleDetails.defaultf"
        size="mini"
      >
      </el-input>
      <div class="outliers">
        <el-checkbox
          label="异常"
          v-model="ruleForm.ruleDetails.isOutliers"
        ></el-checkbox>
        <el-input
          style="width:250px;  margin: 30px 0 0 10px;"
          v-model="ruleForm.ruleDetails.outliers"
          size="mini"
          placeholder="请输入异常值内容"
        >
        </el-input>
      </div>
    </div>
  
    <div class="number" v-show="ruleForm.ruleType == '2'">
      <div class="check-box">
        <el-checkbox
          label="非空"
          v-model="ruleForm.ruleDetails.notNull"
        ></el-checkbox>
        <el-checkbox
          label="重复"
          v-model="ruleForm.ruleDetails.unique"
        ></el-checkbox>
           <el-checkbox
          label="异常"
          v-model="ruleForm.ruleDetails.isOutliers"
        ></el-checkbox>
     
      </div>
      <div class="outliers">
        <span class="default">默认值</span>
        <el-input
          style="width:260px;  margin: 0 0 30px 10px;"
          v-model="ruleForm.ruleDetails.defaultf"
          size="mini"
        >
        </el-input>
        <!-- <el-input
          style="width:150px"
          v-model="ruleForm.ruleDetails.outliers"
          size="mini"
           placeholder="请输入异常值内容"
        >
        </el-input> -->
      </div>
      <el-form
        class="scope-form"
        ref="form"
        :model="ruleForm.ruleDetails"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="范围值内" class="scope">
          <el-input
            v-model="ruleForm.ruleDetails.withinMin"
            class="scope-ipt"
          ></el-input>
          <span class="to">至</span>
          <el-input
            v-model="ruleForm.ruleDetails.withinMax"
            class="scope-ipt"
          ></el-input>
        </el-form-item>
        <el-form-item label="范围值外" class="scope">
          <el-input
            v-model="ruleForm.ruleDetails.outsideMin"
            class="scope-ipt"
          ></el-input>
          <span class="to">至</span>
          <el-input
            v-model="ruleForm.ruleDetails.outsideMax"
            class="scope-ipt"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="btns">
      <btn btnName="创建规则" @click.native="createRule"></btn>
      <btn btnName="返回" @click.native="back"></btn>
    </div>
  </div>
</template>
<script>
import { createCleanRule } from "../../network/collection";

import Btn from "../../components/common/Btn.vue";

export default {
  name: "",
  components: {
    Btn,
  },
  data() {
    return {
      form: {
        left: "",
        right: "",
        outLeft: "",
        outRight: "",
      },
      input1: "",
      ruleForm: {
        ruleName: "",
        ruleNote: "",
        isOutliers: "", //异常
        ruleType: "",
        ruleDescID: "",
        createdById: "",
        createdByName: "",
        createdTime: "",
        ruleDetails: {
          id: "",
          notNull: "", // 非空
          unique: "", // 重复
          defaultf: "", // 默认值
          withinMin: "", //范围值内最小
          withinMax: "", //范围值内最大
          outsideMin: "", //范围值外最小
          outsideMax: "", // 范围值外最大
          outliers: ""  //异常值
        },
      },
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    //  返回
    back() {
      this.$router.go(-1);
    },
    // 创建清洗规则
    createRule() {
      // this.ruleForm.ruleType = parseInt(this.ruleForm.ruleType);
      // this.ruleForm.ruleDetails = JSON.stringify(this.ruleForm.ruleDetails);
      createCleanRule(this.ruleForm).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.$message.success(res.message);
            this.ruleForm = {
                ruleName: "",
                ruleNote: "",
                ruleType: "",
                ruleDescID: "",
                createdById: "",
                createdByName: "",
                createdTime: "",
                ruleDetails: {
                  id: "",
                  notNull: "", // 非空
                  unique: "", // 重复
                  defaultf: "", // 默认值
                  withinMin: "", //范围值内最小
                  withinMax: "", //范围值内最大
                  outsideMin: "", //范围值外最小
                  outsideMax: "", // 范围值外最大
                },
              };
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    createCleanRule() {
      console.log(this.ruleForm);
      if (this.ruleForm.ruleType == 2) {
        if (
          (this.form.left + this.form.right).length > 0 &&
          (this.form.outLeft + this.form.outRight).length > 0
        ) {
          this.$message.error("请选择范围值内或范围值外");
        } else {
          if ((this.form.left + this.form.right).length > 0) {
            this.ruleForm.ruleDetails.left = this.form.left;
            this.ruleForm.ruleDetails.right = this.form.right;
            this.ruleForm.ruleDetails.range = true;
            this.createRule();
          }
          if ((this.form.outLeft + this.form.outRight).length > 0) {
            this.ruleForm.ruleDetails.left = this.form.outLeft;
            this.ruleForm.ruleDetails.right = this.form.outRight;
            this.ruleForm.ruleDetails.range = false;
            this.createRule();
          }
        }
      } else {
        this.createRule();
      }
      // if((this.form.left + this.form.right).length > 0) {
      //   this.ruleForm.ruleDetails.left = this.form.left;
      //   this.ruleForm.ruleDetails.right = this.form.right;
      //   this.this.ruleForm.ruleDetails.range = true;
      // }
      //  if((this.form.outLeft + this.form.outRight).length > 0) {
      //   this.ruleForm.ruleDetails.left = this.form.outLeft;
      //   this.ruleForm.ruleDetails.right = this.form.outRight;
      //   this.this.ruleForm.ruleDetails.range = false;
      // }
      // createCleanRule(this.ruleFrom).then(res => {
      //   console.log(res);
      // }).catch(err => {
      //   console.log(err);
      // })
    },
  },
};
</script>

<style scoped lang="less">
.create-rules {
  padding: 100px 400px;
  .el-form {
    .el-form-item {
      margin-bottom: 60px;
    }
  }
  .string {
    .default {
      margin: 0 10px 0 30px;
      font-size: 14px;
      color: #606266;
    }
  }
  .number {
    .check-box {
      margin-bottom: 50px;
      .default {
        margin: 0 10px 0 30px;
        font-size: 14px;
        color: #606266;
      }
    }
    .outliers {
      .el-checkbox {
        margin-right: 5px !important;
      }
    }
    .scope-form {
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
  .btns {
    display: flex;
    margin: 50px 0 0 38%;
    transform: translateX(-50%);
    .btn {
      margin: 0 50px 0 0;
      transform: none;
    }
  }
}
</style>
