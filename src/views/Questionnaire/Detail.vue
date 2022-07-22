<template>
    <div class="detail" ref="detail">
            <div class="img">
                <img src="../../assets//images/bg.png" alt="">
                <div class="title">毕业学员满意度调查问卷</div>
            </div>
            <div class="mian" ref="mian">
                <!-- <div class="header">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    为更好地了解掌握学院人才培养情况，结合实际设计了毕业学员满意度调查问卷。
                </div> -->
                <div class="box">
                    <div class="userInfo">
                      
                        <el-row :gutter="24" class="user">
                           
                            <el-col :span="6" class="ipt">被调查学员姓名: {{data.name}}</el-col>
                            
                            <el-col :span="6" class="ipt">入学年份:{{data.rxnf}}级</el-col>
                          
                           <el-col :span="12" class="ipt"> 所在单位: {{data.szdw}} </el-col>

                        </el-row>
                    </div>
                    <div class="content">
                        <ul class="ul1" v-if="data.answer">
                            <li class="li1 clearfix" v-for="item in data.answer.listA">
                                <p> {{ item.title }}</p>
                                <!-- <div>
                                    <el-radio @change="isActive(answer)" v-for="answer in item.answers" v-model="item.value" :label="answer" border size="medium">{{answer.name}}</el-radio>
                               </div>    -->
    
                                <ul class="ul2">
                                    <li class="li2" :class="{'active': answer.isActive}"
                                        v-for="answer in item.answers">
                                       <span class="iconfont " :class="[answer.isActive ? 'icon-kongxinduigou': 'icon-weixuanzhongyuanquan']" ></span>   {{answer.name}}
                                    </li>
                                </ul>
    
                            </li>
                             <ul class="ul3">
                                <div style="margin: 10px 0 20px 0;">5. 请客观评价一下被调查学员综合素质能力状况</div>
                                <li class="li3 " v-for="item in data.answer.listB">
                                    <p> {{ item.title }}</p>
                                    <ul class="ul4 clearfix">
                                        <li  v-model="item.value" class="li2"
                                            :class="{'active': answer.isActive}" v-for="answer in item.answers">
                                           <span class="iconfont " :class="[answer.isActive ? 'icon-kongxinduigou': 'icon-weixuanzhongyuanquan']" ></span>    {{answer.name}}</li>
                                    </ul>
                                </li>
                            </ul>
                            <li class="li5 clearfix" v-for="item in  data.answer.multipleList">
                                <p> {{ item.title }}</p>
                                <ul class="ul5">
                                    <li class="multipleLi" 
                                        :class="{'active': answer.isActive}" v-for="answer in item.answers"> 
                                       <span class="iconfont " :class="[answer.isActive ? 'icon-kongxinduigou': 'icon-weixuanzhongyuanquan']" ></span>  {{answer.name}}</li>
                                </ul>
                            </li>
             
                            <li v-for="item in data.answer.textList">
                                <p> {{ item.title }}</p>
                                <div>&nbsp;&nbsp;&nbsp;&nbsp;{{item.value}}</div>
                                <!-- <textarea name="textarea"  style="width:95% ;height:150px;resize: none; outline: none;" v-model="item.value"></textarea> -->
                            </li> 
                        </ul>
                        <!-- <button class="submit" v-on:click="submit">提交</button> -->
                    </div>
                </div>
        </div>
    </div>
</template>
  
  <script>
    import {selectAnswerById} from "../../network/collection.js"
    export default {
      data() {
        return {
           data:{},
        };
      },
      created(){
        this.getAnswerById()
       
      },
      mounted(){
        this.getHeight() 
      },
      methods: {
          getHeight() {
       
          },
        getAnswerById() {
            let query  = {id: this.$route.params.id }
            if(query.id) {
                selectAnswerById(query).then((result) => {
                    console.log(result);
                    if(result.code == 200) {
                        result.data.answer = eval("("+result.data.answer+")");
                        this.data = result.data;
                        this.data.answer.listA = this.data.answer.radioList.slice(0,4)
                        this.data.answer.listB = this.data.answer.radioList.slice(4,this.data.answer.radioList.length + 1)
                        console.log(       this.data );
                        
                    }else {
                        tihis.$message.error(res.message)
                    }
                }).catch((err) => {
                    
                });
            }
        }
    
      }

    };
  </script>
  
<style scoped lang="less">
body {
    background-color: #F8F8F8 !important;
}
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

.detail {
    position: relative;
    height: 2200px;
    background-color: #F8F8F8;
 }

.mian {
    /* margin: 0 auto; */
    /* min-width: 1080px; */
    margin:0 250px;
    position: absolute;
    top: 200px;
    left: 0;
    z-index: 9;
    background-color: #fff;
    border-radius: 3px;

}
.box {
    padding: 0 20px;
}

.mian .header {
    background: url('../../assets/images/textbg.png') no-repeat 0 0;
    background-size: 100%,100%;
    height: 150px;
    line-height: 35px;
    padding: 30px 50px 0;
    color: #fff;
}
.mian .userInfo {
    padding: 20px;
    font-size: 14px;
    background-color: #F8F8F8;
}
.mian .userInfo .title {
    font-size: 18px;
    font-weight: 700;
}
.mian .userInfo .ipt {
    margin-top: 10px;
    line-height: 25px;
    height: 25px;
    font-size: 16px;
}

.content {
    padding: 30px 50px;
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
    margin-right: 100px;
    cursor: pointer;
    font-size: 14px;
}

.content .submit {
    width: 80px;
    height: 30px;
    color: #fff;
    border: none;
    border-radius: 5px;
    background-color: #0A9BF8;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-bottom: 30px;
    outline: none;

}

.active {
    color: #fff !important;
    background-color: #0A9BF8;
    border-color: #0A9BF8 !important;
}

#app .img {
    position: relative;
}
#app .img .title{
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 36px;
    font-weight: 700;
    color: #fff;
    letter-spacing:15px;
}
#app .img img{
    width: 100%;
    z-index: -1;
}
</style>
