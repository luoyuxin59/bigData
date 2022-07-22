<template>
  <div class="ceate-table">
    <div class="table-name">
      <span class="name">表名：</span>
      <el-input
        v-model="form.tableName"
        placeholder="请输入内容"
        size="mini"
      ></el-input>
      <span class="name">表注释：</span>
      <el-input
        v-model="form.tableComment"
        placeholder="请输入内容"
        size="mini"
      ></el-input>
      <el-button type="primary" size="mini" @click="addColumn"
        >添加列</el-button
      >
      <!-- <el-checkbox v-model="isConversion">是否自动转换类型</el-checkbox>
      <el-button type="info" size="mini" @click="toView"
        >查看转换规则</el-button
      > -->
    </div>
    <div class="table-attribute">
      <el-form ref="form"  label-width="50px" size="mini">
        <el-form-item
          v-for="(item, index) in columnMap"
          :key="index"
        >
        <span class="label"> 列名</span>
          <el-input v-model="item.name"></el-input>
          <span class="label"> 类型</span>
          <el-select v-model="item.type" placeholder="选择类型" style="margin-right: 10px" @change="selectType">
            <el-option
              label="字符串"
              value="varchar(255)">
            </el-option>
            <el-option
              label="数字"
              value="int">
            </el-option>
          </el-select>
          <span class="label"> 列注释</span>
          <el-input v-model="item.annotation"></el-input>
          <span class="label"> 约束</span>
          <el-select
            v-model="item.constraint"
            multiple
            placeholder="请选择"
            @change="ifDefault(item.constraint)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :disabled="item.disabled"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button
            type="danger"
            size="mini"
            @click="removeColumn(item.id)"
            :disabled="columnMap.length == 1 ? true : false"
            >删除列</el-button
          >
          <!-- <el-button type="info" size="mini">添加约束</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="submit">
      <btn btnName="创建表格" @click.native="createNewTable"></btn>
      <!-- <btn btnName="取消"></btn> -->
    </div>
  </div>
</template>
<script>
import { createNewTable } from "../../network/collection";
import Btn from "../../components/common/Btn.vue";

export default {
  name: "",
  components: {
    Btn,
  },
  data() {
    return {
      name: "",
      isConversion: false,
      columnMap: [
        {
          name: "",
          type: "",
          comment: "", // 注释
          constraint: [], // 约束
          id: 1,
        },
      ],
      form: {
        tableComment: "",
        tableName: "",
        connectionId: this.$store.state.connectionId,
      },
      options: [
        {
          value: "primary key",
          label: "主键约束",
        },
        {
          value: "not null",
          label: "非空约束",
        },
        {
          value: "default",
          label: "默认值",
        },
        {
          value: "unique",
          label: "唯一",
        },
      ],
       rules: {
          name: [
            { required: false, message: ' ', trigger: 'blur' },
          ],
       }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // 选择类别
    selectType(value) {
      console.log(value);
      if(value == 'varchar(255)') {
        for (let i = 0; i < this.options.length; i++) {
          if(this.options[i].label == '自增长') {
            this.options.splice(i,1)
          }
        }
      }else {
        this.options.push(
          {
          value: "auto_increment",
          label: "自增长",
          },
        )
      }
    },
    // 创建并导入数据
    createNewTable() {
      let info = this.columnMap;
      let isok = false;
      console.log(this.form);
      if (info.length > 0) {
        info.forEach((item) => {
          if (item.constraint.length > 0) {
            item.constraint.forEach((constraint) => {
              if (constraint == "auto_increment") {
                let isKey = item.constraint.indexOf("primary key");
                if (isKey == -1) {
                  this.$message.error("请先勾选主键约束");
                  item.constraint = [];
                } else {
                  isok = true;
                  return
                }
              } else {
                isok = true;
              }
            });
          } else {
            isok = true;
          }
        });
      } else {
        isok = false;
      }
      console.log(isok);
      if (isok) {
        let query = this.form;
        console.log(this.form);
        delete query.columnMap;
        console.log(this.form);
        // 发送新建表格请求
        createNewTable(query, info)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(res.message);
            
             this.form = {
                tableComment: "",
                tableName: "",
                connectionId: 1,
              },
              this.columnMap = [
                 {
                name: "",
                type: "",
                comment: "", // 注释
                constraint: [], // 约束
                id: 1,
              },
              ]
              console.log(this.form);
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 选择默认值
    ifDefault(val) {
      for (var i = 0; i <= val.length; i++) {
        if (val[i] == "default") {
          let v = prompt("请输入默认值");
          val[i] = val[i] + " " + "'" + v + "'";
          console.log(val[i]);
        } else if (val[i] == "auto_increment") {
          let isKey = val.indexOf("primary key");
          if (isKey == -1) {
            //  alert("请先勾选主键约束")
          }
        }
      }
    },
    // 添加列
    addColumn() {
      if(this.form.tableName != '') {
        this.columnMap.push({
          name: "",
          type: "",
          annotation: "",
          constraint: "",
          id: this.columnMap.length + 1,
        });
      }else {
        this.$message.error('请先输入表名')
      }
      console.log(this.form);
    },
    // 删除列
    removeColumn(id) {
      console.log(id);
      console.log(this.form);
      if (this.columnMap.length != 1) {
        this.columnMap = this.columnMap.splice(
          0,
          this.columnMap.length - 1
        );
      }
      console.log(this.columnMap);
    },
    // 查看转换规则
    toView() {},
  },
};
</script>

<style scoped lang="less">
.ceate-table {
  height: 100%;
  .table-name, .table-attribute {
    padding: 20px;
    box-shadow: inset 0px 0px 4px #daedff, 0px 0px 3px #1991ff;
    border-radius: 8px
  }
  .table-name {
    display: flex;
    line-height: 28px;
    padding: 30px 250px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    span {
      width: 60px;
      text-align: center;
      font-size: 14px;
    }
    .el-input {
      width: 140px;
      margin-right: 20px;
    }
    .el-button {
      margin: 0 20px;
    }
  }
  .table-attribute {
    height: 60%;
    border-bottom: 1px solid #ccc;
    overflow: auto;
    .el-form {
      padding: 30px 200px;
      .el-input {
        width: 100px;
        margin-right: 10px;
      }
      .el-select {
        width: 100px;
      }
      .el-button--danger {
        margin-left: 10px;
      }
      .label {
        display: inline-block;
        width: 50px;
        padding-right: 12px;
        text-align: justify;
        -moz-text-align-last: justify;
        text-align-last: justify;
        font-size: 14px;
        font-weight: 600;
        color: #000;
      }
    }
  }
  .submit {
    display: flex;
    justify-content: space-between;
    padding: 50px 350px;
    .btn {
      margin: 0;
    }
  }
}
</style>
