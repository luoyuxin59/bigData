<template>
  <div class="create-ruleGroup">
    <rules-list :rulesList="rulesList"></rules-list>
    <div class="create">
      <el-form size="mini" label-width="100px">
        <el-form-item label="规则组名称:">
          <el-input v-model="form.name" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="清洗类型">
          <el-select
            v-model="form.region"
            placeholder="请选清洗类型"
            style="width:250px"
          >
            <el-option label="字符型" value="string"></el-option>
            <el-option label="数值型" value="number"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选</el-checkbox>
      <el-checkbox-group
        v-model="checkedCities"
        @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{
          city
        }}</el-checkbox>
      </el-checkbox-group>
      <div class="btns">
        <btn btnName="创建规则组"></btn>
        <btn btnName="返回"></btn>
      </div>
    </div>
  </div>
</template>
<script>
import Btn from "../../components/common/Btn.vue";
import RulesList from "../../components/common/RulesList.vue";
const cityOptions = ["上海", "北京", "广州", "深圳"];

export default {
  name: "",
  components: {
    RulesList,
    Btn,
  },
  data() {
    return {
      rulesList: ["非空", "重复", "异常"],
      form: {
        name: "",
        region: "",
      },
      checkAll: false,
      checkedCities: ["上海", "北京"],
      cities: cityOptions,
      isIndeterminate: true,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // 全选
    handleCheckAllChange(val) {
      console.log(val);
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
  },
};
</script>

<style scoped lang="less">
.create-ruleGroup {
  .create {
    padding: 30px 200px 0 400px;
    .el-form {
      .el-form-item {
        margin-bottom: 60px;
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
}
</style>
