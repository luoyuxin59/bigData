// 新建类型转转换规则
<template>
  <div class="create-typeRules">
    <div class="data-input">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="" v-for="(item, index) in form.forms" :key="index">
          <span class="label">数据源类型</span>
          <el-input
            v-model="item.name"
            class="dataType"
            style="width:150px; margin-right:120px"
          ></el-input>
          <span class="label">目标数据类型</span>
          <el-select v-model="item.type" placeholder="" style="width:100px">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <span class="label">长度</span>
          <el-input v-model="item.length" style="width:150px; margin-right:30px"></el-input>
          <el-button type="danger" @click="removeColumn" 
          :disabled="form.forms.length == 1 ? true : false">删除</el-button>
          <el-button type="primary" @click="addColumn">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btns">
      <btn btnName="创建规则"></btn>
      <btn btnName="返回"></btn>
    </div>
  </div>
</template>
<script>
import Btn from "../../components/common/Btn.vue";

export default {
  name: "",
  components: {
    Btn,
  },
  data() {
    return {
      form: {
        forms: [
          {
            id: 1,
            name: "",
            type: "",
            length: ''
          },
        ],
      },
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // 添加列
    addColumn() {
      this.form.forms.push({ name: "", id: this.form.forms.length+1 });
      console.log(this.form);
    },
     removeColumn(id){
      if(this.form.forms.length != 1) {
        this.form.forms = this.form.forms.splice(0,this.form.forms.length - 1)

      }
       console.log(this.form.forms);
    },
  },
};
</script>

<style scoped lang="less">
.create-typeRules {
  padding: 100px 80px;
  .data-input {
    .el-form {
      .label {
        display: inline-block;
        width: 100px;
        line-height: 38px;
        border: 1px solid #ccc;
        text-align: center;
      }
      .dataType {
        margin-right: 60px;
      }
      .el-input__inner {
        border-radius: 0;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: space-between;
    padding: 50px 300px;
    .btn {
      margin: 0;
      transform: none;
    }
  }
}
</style>
