<template>
  <div style="width: 93%; height:75%; margin-left: 30px;margin-top: 30px;">
    <vue-json-editor
      v-model="dataList"
      :showBtns="false"
      :mode="'code'"
      lang="zh"
      @json-change="onJsonChange"
      @json-save="onJsonSave"
      @has-error="onError"
      @focus="onEditorFocus($event)"
      style="height: 100%"
    />
    <br>
  </div>
</template>

<script>
  // 导入模块
  import vueJsonEditor from 'vue-json-editor'

  export default {
    // 注册组件
    name: 'JsonEditor',
    components: { vueJsonEditor },
      // json数据
    props: {
      dataList: {
        type: Array,
        default:[]
      }
    },
    data() {
      return {
        hasJsonFlag:true,  // json是否验证通过
      }
    },
    mounted: function() {
    },
    methods: {
      // 获得焦点事件
      onEditorFocus(event) {
        event.enable(false);
    },
      onJsonChange (value) {
        // console.log('更改value:', value);
        // 实时保存
        this.onJsonSave(value)
      },
      onJsonSave (value) {
        // console.log('保存value:', value);
        this.resultInfo = value
        this.hasJsonFlag = true
      },
      onError(value) {
        // console.log("json错误了value:", value);
        this.hasJsonFlag = false
      },
    }
  }
</script>

<style>
.jsoneditor-modes, .jsoneditor-compact, .jsoneditor-poweredBy {
  display: none;
}
.jsoneditor-vue{
	    height: 100%;
	}
</style>