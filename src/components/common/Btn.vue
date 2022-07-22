<template>
    <div class="btn">
       <input type="button" :value="btnName">
    </div>
</template>
<script>
export default {
  name:'',
  components: {},
  props:['btnName'],
  data() {
    return {}
 },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
@import "../../assets/css/tool.less";

.btn {
  width: 100px;
  margin-left: 50%;
  transform: translateX(-50%);
  input {
    width: 100px;
    height: 40px;
    background: url('../../assets/images/management/默认按钮.png');
    border: none;
    color: #fff;
  }

}
</style>
