<template>
  <div class="Retrieve">
    <!-- <button @click="search">搜索</button> -->
    <div id="treeChart" :style="{width: '1400px', height: '3000px', padding: '30px'}"></div>
  </div>
</template>
<script>
import {selectOrganizationList, selectUnitList, selectTree}  from "../../network/collection"

export default {
  name:'',
  components: {},
  data() {
    return {
      departmentId: '',
      unitId: '',
      unitName: '',
      unitList: [],  //大单位
      miniUnitList: [], //小单位
      defaultProps: {
        children: 'children',
        label: 'department'
      },
      treedata:[
        {
          name: '本部',
           children: []
        }
      ],
      myChart: ''
    }
 },
  computed: {},
  created() {},
  mounted() {
    this.selectOrganizationList()
    this.selectTree()
  },
  methods: {
    search() {
      this.myChart.clear();

      let arr = [{
          name: '本部',
          children: []
        }]
      let name =  '办公室';
   
      this.treedata[0].children.forEach(nameA => {
        if(name == nameA.name) {
          console.log(name);
          arr[0].children = nameA
        }
       
      })
       console.log(arr);
       this.showChart(arr)
    },
    selectTree(){
      selectTree().then(res => {
        console.log(res);
        if(res.code  == 200) {
          this.treedata[0].children = res.data.department;
          this.showChart( this.treedata)
        }
      })
    },
    showChart(data) {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.getElementById('treeChart'));
      console.log(data);
 
      // 指定图表的配置项和数据
      var option = {
        title: {
            text: ''
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'tree',
                data: data,

                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',

                symbolSize: 7,

                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 13,
                  

                },

                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                },
                zlevel: 0,
                z: 1,
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    },
    handleNodeClick(data) {
      console.log(data);
      this.selectUnitList(data)
    },
     // 选择单位 
    selectCompany() {
      this.selectOrganizationList()
      this.CompanyDialog =  true;
      
    },
    // 查询大单位
    selectOrganizationList() {
      selectOrganizationList().then(res => {
        this.unitList = res.data;
      })
    },
     // 查询小单位
    selectUnitList(item) {
      console.log(item);
      this.unitName = item.department;
      // this.awardRecord.recordUnit.departmentId = item.departmentId;
      this.departmentId = item.departmentId
      let obj = {}
      obj.departmentId = item.departmentId
      console.log(obj );
      selectUnitList(obj).then(res => {
        console.log(res);
        this.miniUnitList =  res.data;
        item.children = this.miniUnitList
      })
    },
  },
};
</script>

<style scoped lang="less">
.Retrieve {
  .unit {
    ul{
      display:flex;
      flex-wrap: wrap;
      .companyName { 
        color: #077dd8;
        background-color: #e3eff9;
        margin: 5px 10px;
        padding: 0 15px;
        position: relative;
        height: 28px;
        list-style: none;
        font-size: 12px;
        text-align: center;
        line-height: 28px;
        border-radius: 50px;
        cursor: pointer;
      }
    }
    }
  }
 
</style>
