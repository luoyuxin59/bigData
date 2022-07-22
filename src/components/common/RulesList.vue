<template>
  <div class="rules-list">
    <div class="title">已有清洗规则</div>
    <div class="list">
      <ul>
        <li v-for="(item, index) in rulesList" :key="index">
          {{ item.ruleName }}
          <template>
            <el-popconfirm title="确定删除此规则吗？" @confirm=" remove(item.ruleId)">
              <span  class="el-icon-close" slot="reference"></span>
            </el-popconfirm>
          </template>
        </li>
      </ul>
      <btn class="create" btnName="创建规则" @click.native="add"></btn>
    </div>
  </div>
</template>
<script>
import {
  deleteCleanRule,
  selectCleanRulesList,
} from "../../network/collection";
import Btn from "../common/Btn.vue";
export default {
  name: "",
  components: {
    Btn,
  },
  data() {
    return {
      rulesList: [],
      query: {
        pageNow: 1,
        pageSize: 10000,
      },
    };
  },
  props: {
    //  rulesList: {
    //    type: Array,
    //    default: []
    //  }
  },
  computed: {},
  created() {},
  mounted() {
    this.selectCleanRulesList();
  },
  methods: {
    remove(ruleId) {
      let obj = {
        ruleId: ruleId,
      };
      deleteCleanRule(obj)
        .then((res) => {
          if (res.code == 200) {
            this.selectCleanRulesList();
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error("网络错误或服务器错误");
        });
    },
    add() {
      this.$router.push("/CreateRules");
    },
    // 查询所有规则
    selectCleanRulesList() {
      selectCleanRulesList(this.query)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.rulesList = res.data.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="less">
.rules-list {
  padding: 20px;
  box-shadow: inset 0px 0px 4px #daedff, 0px 0px 3px #1991ff;
  border-radius: 8px;
  margin-bottom: 20px;
  .title {
    padding: 15px 5px;
    font-weight: 700;
  }
  .list {
    position: relative;
    height: 70px;
    ul {
      display: flex;
      li {
        margin: 0 20px;
        position: relative;
        .el-icon-close {
          position: absolute;
          top: -6px;
          right: -16px;
          cursor: pointer;
          color: red;
        }
      }
    }
    .create {
      position: absolute;
      right: 20px;
      bottom: 10px;
    }
  }
}
</style>
