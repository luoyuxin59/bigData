<template>
  <div class="">
      <el-button type="primary">主要按钮</el-button>

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
     msg() {
      this.$message.error({showClose: true, message: 'kkk'})
    }
  },
};
</script>

<style scoped lang="less">

</style>
