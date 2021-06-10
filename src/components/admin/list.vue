<template>
  <div>
    <el-table
      :data="listData"
      border
      stripe
      fit
      highlight-current-row
      class="main"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div v-html="props.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号" width="100"> </el-table-column>
      <el-table-column prop="date" label="日期" width="150"> </el-table-column>
      <el-table-column prop="author" label="作者" width="150">
      </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="description" label="简述" width="300">
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">编辑中</el-tag>
          <el-tag v-else>已发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              circle
              type="success"
              icon="el-icon-edit"
              @click="goToEdit(scope.$index)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="发布" placement="top">
            <el-button
              @click="goToPublish(scope.$index)"
              type="primary"
              icon="el-icon-upload"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              @click="goToDelete(scope.$index)"
              icon="el-icon-delete"
              circle
              type="warning"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-tooltip content="新增" placement="top">
      <el-button
        type="danger"
        icon="el-icon-plus"
        circle
        @click="goToAdd"
      ></el-button>
    </el-tooltip>
  </div>
</template>



<script>
import { mapGetters } from "vuex";
export default {
  name: "list",
  props: ["listData"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      //当前操作的数据库表
      "table",
      //当前操作的表内子项的类别
      "kind",
      //是否在进行编辑
      "isEdit",
      //正在编辑的内容
      "notice",
    ]),
  },
  methods: {
    goToEdit(index) {
      console.log(this.listData[index]);
      // console.log("进入编辑界面了");
      this.$emit("goToEdit", index);
    },
    goToPublish(index) {
      let info = this.listData[index];
      let status = info.status;
      if (status === 1) {
        this.$message.error("已发布,无需再进行发布！");
      } else {
        let url = this.table + "/" + "update" + this.table + "Notice";
        this.$axios
          .get(url, {
            params: {
              id: info.id,
              kind: this.kind,
              date: info.date,
              author: info.author,
              title: info.title,
              description: info.description,
              status: 1,
              content: info.content,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              this.$message.success("发布成功！");
              this.listData[index].status = 1;
            } else {
              this.$message.error("发布失败！");
            }
          });
      }
    },
    goToDelete(index) {
      let id = this.listData[index].id;
      let url = this.table + "/" + "delete" + this.table + "Notice";
      this.$axios
        .get(url, {
          params: {
            id: id,
          },
        })
        .then((res) => {
          if (res.data === 1) {
            this.$message.success("删除成功");
            this.listData.splice(index, 1);
          } else {
            this.$message.error("删除失败");
          }
        });
    },
    goToAdd() {
      let url = this.table + "/" + "add" + this.table + "Notice";
      this.$axios
        .get(url, {
          params: {
            kind: this.kind,
            date: "",
            author: "",
            title: "",
            description: "",
            status: 0,
            content: "",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data === 0) {
            this.$message.error("添加失败");
          } else {
            this.$emit("refresh");
          }
        });
      // this.$store.commit('changeEditStatus',true);
    },
  },
  mounted() {
    // this.tableData = this.listData;
    // console.log(this.listData);
  },
  created() {},
};
</script>

<style scoped>
.main {
  width: 95%;
  margin: 20px;
}
</style>