<template>
  <div class="paging">
      <el-pagination
        @prev-click="prev"
        @next-click="next"
        @current-change="currentChange"
        layout="prev, pager, next"
        :page-size="query.pageSize"
        :total="total" >
      </el-pagination>
    </div>
</template>
<script>
export default {
  name:'Pagr',
  components: {},
  props: {
    total: {
      type: Number,
      default: 0
    },
    query: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {}
 },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    prev() {
      this.$emit('prev', this.query.pageNum--)
    },
    next() {
      this.$emit('next', this.query.pageNum++)
    },
    currentChange(val) {
      this.$emit('currentChange',val)
    }
  },
};
</script>

<style scoped lang="less">

</style>
