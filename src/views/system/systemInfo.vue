<template>
  <div>
    <h1></h1>
  </div>
</template>
<script>
import { getSystemData } from '../../network/collection';
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  created() {},
  computed: {},
  mounted() {
    this.getSystemData()
  },
  methods: {
    getSystemData() {
      getSystemData().then(res => {
        console.log(res);
      })
    }
  },
};
</script>
<style lang="scss" scoped></style>
