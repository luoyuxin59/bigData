<template>
  <div class="tree">
    <el-tree
      :data="datas"
      accordion
      @node-click="handleNodeClick"
      :props="defaultProps"
       node-key="id"
      :default-expanded-keys="[1]"
      :default-checked-keys="[5]"
      :highlight-current="true"
    >
    </el-tree>
  </div>
</template>
<script>
export default {
  name: "Tree",
  components: {},
  props: {
    datas: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      defaultProps: {
        children: "children", //子类的名称
        label: "label", //接口返回文字的字段
      },
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleNodeClick(data, node, value) {
      if (node.level == 2) {
        console.log(data.path);
        this.$router.push(data.path);
      }
    },
  },
};
</script>

<style scoped lang="less">
.el-tree {
  width: 100%;
}
</style>
