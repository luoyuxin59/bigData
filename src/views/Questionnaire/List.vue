<template>
    <div class="list">
        <div class="img">
            <img src="@/assets/images/listBG.jpg" alt="">
            <div class="title">毕业学员满意度调查问卷</div>
        </div>
        <div class="mian">
            <div class="box">
                <div class="userInfo">
                        <el-form>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 姓名: <el-input class="ipt" v-model="userInfo.name"
                          clearable  type="text" name="name"></el-input>
                        入学年份:
                        <el-select clearable name="year" v-model="userInfo.rxnf" style="height: 31px;width: 180px;margin-right: 130px; ">
                            <el-option value="year" v-for="year in yearsList" :key="year">{{year}}</el-option>
                        </el-select>
                        所在单位: <el-input clearable class="ipt" v-model="userInfo.szdw" type="text"
                            name="unit"></el-input>
                            <input class="search" type="button" @click="search" value="搜索"></el-input>
                    </el-form>
              
                </div>
                <div class="content">
                    <el-table class="table" 
                        @row-click="detail"
                        :data="list"  
                        style="width: 100%; overflow: hidden;"
                        :default-sort="{prop: 'date',order: 'desending'}"
                        :header-cell-style="{background:'#0A9BF8',color:'#fff',textAlign: 'center',height: '50px'}">
                        <el-table-column align="center" sortable prop="id" label="编号" >
                        </el-table-column>
                        <el-table-column align="center" prop="name" label="姓名" >
                         </el-table-column>
                         <el-table-column align="center" sortable prop="rxnf" label="入学年份" >
                        </el-table-column>
                        <el-table-column align="center" prop="szdw" label="所在单位" >
                        </el-table-column>
                        <el-table-column align="center" sortable prop="createdTime" label="填写日期" >
                        </el-table-column>
                    </el-table> 
                    <el-pagination v-show="list.length > 0"
                        @size-change="hanleSizeChange"   
                        @current-change="hanleCurrentChange" 
                        :current-size.sync="currentPage"
                        :page-size="15"
                        layout="prev,pager,next,jumper"
                        :total="total"
                    >

                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
  
  <script>
    import {selectAnswerList} from "../../network/collection.js"
    export default {
      data() {
        return {
            userInfo: {
                answer: "",
                createdTime: "",
                name: "",
                pageNum: 1,
                pageSize: 15,
                rxnf: "",
                szdw: ""
            },
            list:[
            ],
            currentPage: 1,
            total: 0,
            yearsList: []
        };
      },
      mounted(){
        this.getYears()
        this.search()
      },
      methods: {
        getYears() {
                var date = new Date()
                var year = date.getFullYear()
                for(var i = 2012; i <= (year-4);  i++) {
                    this.yearsList.push(i)
                }
            },
        detail(row,column,event){
            console.log(row.id);
            this.$router.push(`Detail/id=${row.id}`)
        },
        search() {
            console.log(this.userInfo);
            
            selectAnswerList(this.userInfo).then((result) => {
               if(result.code == 200) {
                  this.list = result.data.list;
                  this.total = result.data.total;
                  
               }
            }).catch((err) => {
                this.$message.error('请求后台错误')
            });
        },
        hanleSizeChange(val) {
            this.userInfo.pageNum = val
            this.search()
        },
        hanleCurrentChange(val) {
            this.userInfo.pageNum = val
            this.search()
        
        }
      }

    };
  </script>
  
<style scoped lang="less">
    ul, li {
    list-style: none;
}

.clearfix:after{
    content: "020"; 
    display: block; 
    height: 0; 
    clear: both; 
    visibility: hidden;  
    }
body{
    height: 100%;
    background-color: #F8F8F8;
}
.list {
    height: 1300px;
    background-color: #F8F8F8;
 }

.mian {
    /* margin: 0 auto; */
    /* min-width: 1080px; */
    width: calc(100% - 500px);
    margin: 0 250px;
    position: absolute;
    top: 250px;
    background-color: #fff;
    border-radius: 3px;

}
.box {
    /* padding: 0 20px; */
}
.mian {
    /* background-color: #CCCCCC; */
}
.mian .header {
   
    background-size: 100%,100%;
    height: 150px;
    line-height: 35px;
    padding: 30px 50px 0;
    color: #fff;
}
.mian .userInfo {
    padding: 20px;
    height: 106px;
    font-size: 14px;
    background-color: #DAF0FE;

}
.mian .userInfo .title {
    font-size: 18px;
    font-weight: 700;
}
.mian .userInfo .ipt {
    width: 180px;
    height: 25px;
    margin: 40px 130px 5px 0;
}
.content {
    padding: 30px 50px 60px 50px;
}
.content  .li1 p,.li3 p, .li5 p{
    margin: 10px 0 20px 0;
}
.content  .ul5 .multipleLi,.liw {
    float: left;
    padding: 6px 10px;
    border: 1px solid #CCCCCC;
    border-radius: 3px;
    color: #333;
    margin-right: 40px;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 10px;
}
.content  .li2 {    
    float: left;
    /* width: 85px;
    height: 30px;
    line-height: 30px;
    padding: 0 0 0 8px; */
    padding: 6px 20px;
    border: 1px solid #CCCCCC;
    border-radius: 3px;
    color: #333;
    margin-right: 120px;
    cursor: pointer;
    font-size: 14px;
}

.box .search {
    width: 80px;
    height: 30px;
    color: #fff;
    border: none;
    border-radius: 5px;
    background-color: #0A9BF8;
    outline: none;


}

.active {
    color: #fff !important;
    background-color: #0A9BF8;
    border-color: #0A9BF8 !important;
}

.list .img {
    position: relative;
}
.list .img .title{
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 50px;
    font-weight: 700;
    color: #fff;
    letter-spacing:15px;
}
.list .img img{
    width: 100%;
}
.el-table__header-wrapper .el-table__header {
    overflow-x: hidden;
}
.has-gutter {
    background-color: #0A9BF8;
}
table {
    overflow: hidden !important;
}
.el-table__header tr,
.el-table__header th {
    padding: 0;
    height: 40px;
}
.el-table__body tr,
.el-table__body th {
    padding: 0;
    height: 40px;
}
.el-pagination {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 20px 0 20px 0;
}
.el-table  {
    border: 1px solid #cbcbcb;
}
</style>
