<template>
  <div class="cronDemo">
    <el-popover v-model="isShow">
      <el-input slot="reference" @click="cronPopover=true" 
        v-model="cron" placeholder="请输入定时策略" 
        style="width: 40% ;margin-left: -50%">
      </el-input>
 
      <cronComponent @change="changeCron" @close="cronPopover=false" i18n="cn"></cronComponent>
 
    </el-popover>
  </div>
</template>
 
<script>
  import {cronComponent} from 'vue-cron';
  export default {
    components: { cronComponent},
    data(){
      return {
        isShow: false,
        cron:''
      }
    },
    methods: {
      changeCron(val){
        this.cron=val
      },
 
    },
  }
</script>