<template>
  <div >
    <div class="table" v-if="tableData.length != 0">
       <table border="1" cellspacing="0" >
      <thead>
        <tr>
          <th v-for="(name,index) in nameList" :key="index">{{name}}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <!-- <td v-for="(td, tdIndex) in item" :key="tdIndex">{{item[index]}}</td> -->
          <td  v-for="(item, idnex) in tableData" :key="idnex">{{item.value}}</td>
        </tr>
      </tbody>
    </table>

    <!-- 分页 -->
      <!-- <div class="page">
        <el-pagination
          @prev-click="prev"
          @next-click="next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :pager-count="5"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total"  >
        </el-pagination>
      </div> -->
    </div>
    <div class="" v-else>
      暂无数据...
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  components: {},
  props: {
    tableData: {
      type: Array,
      default:()=>[]
    },
    nameList: {
      type: Array,
      default:()=>[]
    },
    currentPage4: 1,
    total: {
      type: Number,
      default: 100
    },
    query: {
      type: Object,

    },
  },
  data() {
    return {
    }
  },
  computed: {},
  created() {},
  mounted() {

  },
  methods: {

    handleSizeChange() {

    },
    handleCurrentChange() {

    },
      prev() {
      this.$emit('prev', this.query.pageNum--)
    },
    next() {
      this.$emit('next', this.query.pageNum++)
    },
    currentChange(val) {
      this.$emit('currentChange',val)
    },
    addRules() {
      console.log(1);
    }
  },
};
</script>

<style scoped lang="less">
/*设置偶数行颜色*/
.table {
  tr {
    width: 200px;
  }
}
</style>
