<template>
  <div class="report">
    <div class="btns">
      <btn  btnName="生成报告" @click.native="createReport"></btn>
      <!-- <btn  btnName="在线预览" ></btn> -->
      <btn  btnName="下载报告" @click.native="exportReport"></btn>
   	<img src="" id="echart8" >
    </div>
        <div ref="file"></div>
<!-- <a href="http://www.xdocin.com/xdoc?_func=to&amp;_format=html&amp;_cache=1&amp;_xdoc=http://www.xdocin.com/demo/demo.docx" target="_blank" rel="nofollow">XDOC</a> -->

    <iframe
    src='https://view.officeapps.live.com/op/view.aspx?src=http://47.108.24.26:8084/armedPolice/v1/baogao.docx'
    width="100%"
    height="1000px"
    frameborder="0">
    </iframe>
    <!-- <iframe :src="'https://docs.google.com/viewer?url=http://47.108.24.26:8084/armedPolice/v1/baogao.docx'"></iframe> -->
    <!-- <iframe
    :src="'//www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc='+ fileUrl"
    width="100%"
    height="1000px"
    frameborder="0">
    </iframe> -->
      <div class="score" v-show="false" ref="myChart" style="width:350px; height: 350px;"></div>
  </div>
</template>
<script>

import Btn from "../../components/common/Btn.vue";
import {createReport, exportReport} from "../../network/collection"
export default {
  name:'',
  components: {
    Btn
  },
  data() {
    return {
      list: {},
      query:[],
      score: '',
      echartA: '',
      fileUrl: 'http://47.108.24.26:8084/armedPolice/v1/baogao.docx'
    }
 },
  computed: {},
  created() {},
  mounted() {
  
   
  },
  methods: {
    // 生成报告
    exportReport(){
      this.query = []
      let isOnLine = {
       isOnLine: false
      };
      let Reliability = sessionStorage.getItem('Reliability');
      let Kmeans = sessionStorage.getItem('Kmeans');
      let Logistic = sessionStorage.getItem('Logistic');
      let WeightedConversion = sessionStorage.getItem('WeightedConversion');
      let Factor = sessionStorage.getItem('Factor');
      console.log(Reliability && Kmeans && Logistic && WeightedConversion && Factor)
      // 评教数据
      if(this.list){
        if( Reliability && Kmeans && Logistic && WeightedConversion && Factor) {
          if(this.list.cronbach){
            let objA = {
              algorithm: 'cronbach',
              result:this.list.cronbach,
              // result: '',
              img: ''
            }
            if( sessionStorage.getItem('Reliability')) {
              objA.img = sessionStorage.getItem('Reliability')
            }else {
              objA.img = ''
            }
            this.query.push(objA)
          
        
          }
          if(this.list.kmeans){
            let objB = {
              algorithm: 'kmeans',
              // JSON.stringify(this.list.kmeans)
              result: '',
              img: ''
            }
            if( sessionStorage.getItem('Kmeans')) {
              objB.img = sessionStorage.getItem('Kmeans')
            }else {
              objB.img = ''
            }
            this.query.push(objB)
          }
          if(this.list.logistic){
            let arr = []
            this.list.logistic.forEach(item => {
            item = JSON.stringify(item)
            console.log(item);
            arr.push(item)
            })
            arr = arr.toString()
            let objC = {
              algorithm: 'logistic',
              // result: "[" + arr + "]",
              result: '',
              img: ''
            }
            if(sessionStorage.getItem('Logistic') ){
              objC.img = sessionStorage.getItem('Logistic')
            }else {
              objC.img = ''
            }
            this.query.push(objC)
          }
          if(this.list.originalReliability) {
            let arrA = []
            this.list.originalReliability.forEach(item => {
            item = JSON.stringify(item)
            arrA.push(item)
            })
            arrA = arrA.toString()
            let objD = {
              algorithm: 'originalReliability',
              // result: "[" + arrA + "]",  
              result: '',
              img: ''
            }
            if(sessionStorage.getItem('WeightedConversion')){
              objD.img = sessionStorage.getItem('WeightedConversion')
            }else {
              objD.img = ''
            }

            this.query.push(objD)
          }
          if(this.list.apriori) {
            let arrB = []
            this.list.apriori.forEach(item => {
            item = JSON.stringify(item)
            arrB.push(item)
            })
            arrB = arrB.toString()
            let objF = {
              algorithm: 'apriori',
              // result: "[" + arrB + "]",
              result: '',
              img: ''
            }
            if(sessionStorage.getItem('Factor')) {
              objF.img = sessionStorage.getItem('Factor') 
            }else {
              objF.img = ''
            }

          this.query.push(objF)
          }
          exportReport(isOnLine,this.query).then(res => {
            if(res.code == 200) {
              console.log(res.data);
              window.open(res.data)
              this.$message.success(res.message)
            }else {
              this.$message.error(res.message)
            }
          //   console.log(response);
          //   const { data } = response;
          // const reader = new FileReader();
          // const filename = '分析报告';
          // if(data.type === 'applicationjson'){
          // 	reader.readAsText(data);
          // 	reader.onload = function () {
          // 		const { message, code } = JSON.parse(reader.result);
          // 		console.log(message + code);
          // 	}
          // }else{
          // 	var link = document.createElement('a');
          // 	var blob = new Blob([response.data]);
          // 	if('download' in link) {
          // 		link.download = filename;
          // 		link.style.display = 'none';
          // 		link.href = URL.createObjectURL(blob);
          // 		document.body.appendChild(link);
          // 		link.click(); //执行下载
          // 		URL.revokeObjectURL(link.href); //释放url
          // 		document.body.removeChild(link); //释放标签
          // 	} else {
          // 		navigator.msSaveBlob(blob, filename)
          // 	}
          //   }
          }).catch(err => {
            console.log(err);
          })
        }else {
          this.$message.error('请先生成图片！')
        }
      }
    },
    // 评教数据画图
     drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.echartA = this.$echarts.init(this.$refs.myChart);
      // 绘制图表
      this.echartA.setOption({
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            name: "Pressure",
            type: "gauge",
            min: 0,
            max: 1,
            progress: {
              show: true,
            },
            detail: {
              valueAnimation: true,
              formatter: "{value}",
            },
            axisLine: {
              //仪表盘轴线样式
              lineStyle: {
                width: 10,
              },
            },
            splitLine: {
              //分割线样式
              length: 10,
            },
            data: [
              {
                value: this.score,
                name: "α系数",
              },
            ],
          },
        ],
      });
    },
    // 创建报告
    createReport(){
        createReport().then(res => {
          if(res.code == 200) {
            this.list = res.data;
            console.log(this.list );
            this.$message.success(res.message)
          }else {
            this.$message.error(res.message)
          }
        }).catch(err => {
            this.$message.error(err)
        })
      
    },
    // 保留两位小数点
    formatDecimal(num, decimal) {
      num = num.toString()
      let index = num.indexOf('.')
      if (index !== -1) {
          num = num.substring(0, decimal + index + 1)
      } else {
          num = num.substring(0)
      }
      return parseFloat(num).toFixed(decimal)
    },

    
  },
};
</script>

<style scoped lang="less">
  .btns {
    width: 400px;
    display: flex;
    .btn {
      flex: 1;
      margin: 0;
      transform: none;
    }
  }
</style>
