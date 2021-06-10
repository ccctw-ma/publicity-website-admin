<template>
  <el-container>
    <el-header class="adminHeader"> ADMIN </el-header>
    <el-container>
      <el-aside width="auto">
        <el-menu
          :unique-opened="true"
          default-active="teamInfo"
          class="el-menu-vertical-demo"
          @select="handleSelect"
        >
          <!-- 团队概况 -->
          <el-submenu index="Team">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span slot="title">团队概况</span>
            </template>
            <el-menu-item index="teamInfo">团队简介</el-menu-item>
            <el-menu-item index="teamLeader">负责人介绍</el-menu-item>
            <el-menu-item index="teamMember">团队成员</el-menu-item>
            <el-menu-item index="teamCulture">团队文化</el-menu-item>
          </el-submenu>
          <!-- 科研方向 -->
          <el-submenu index="Direction">
            <template slot="title">
              <i class="el-icon-s-flag"></i>
              <span slot="title">科研方向</span>
            </template>
            <el-menu-item index="project">科研项目</el-menu-item>
          </el-submenu>

          <!-- 科学研究 -->
          <el-submenu index="Research">
            <template slot="title">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">科学研究</span>
            </template>
            <el-menu-item index="project">科研项目</el-menu-item>
            <el-menu-item index="thesis">论文专著</el-menu-item>
            <el-menu-item index="reward">获奖内容</el-menu-item>
            <el-menu-item index="patent">专利</el-menu-item>
          </el-submenu>
          <!-- 交流合作 -->
          <el-submenu index="Cooperation">
            <template slot="title">
              <i class="el-icon-connection"></i>
              <span slot="title">交流合作</span>
            </template>
            <el-menu-item index="exchange">学术交流</el-menu-item>
            <el-menu-item index="salon">学术沙龙</el-menu-item>
            <el-menu-item index="organization">合作机构</el-menu-item>
          </el-submenu>
          <!-- 资源共享 -->
          <el-submenu index="Resource">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">资源共享</span>
            </template>
            <el-menu-item index="institution">规章制度</el-menu-item>
            <el-menu-item index="document">文档表格</el-menu-item>
            <el-menu-item index="lecture">讲座资料</el-menu-item>
            <el-menu-item index="lecture">会议期刊</el-menu-item>
            <el-menu-item index="monograph">论文共享</el-menu-item>
          </el-submenu>
          <!-- 联系我们 -->
          <el-submenu index="Contact">
            <template slot="title">
              <i class="el-icon-position"></i>
              <span slot="title">联系我们</span>
            </template>
            <el-menu-item index="information">联系方式</el-menu-item>
            <el-menu-item index="address">地理位置</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- <el-row>
          <el-button>提交</el-button>
        </el-row> -->
        <Editor v-if="isEdit" @refresh="refresh" />
        <List
          v-else
          :listData="listData"
          @goToEdit="goToEdit"
          @refresh="refresh"
        />
      </el-main>
    </el-container>
    <el-footer>Footer 这里放脚注</el-footer>
    <!-- 登录框 -->
    <el-dialog
      :visible.sync="isLogin"
      width="30%"
      center
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span slot="title">
        <h2>登录</h2>
      </span>

      <el-form label-position="left" label-width="80px">
        <el-form-item label="用户名:">
          <el-input v-model="username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input
            v-model="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          type="primary"
          @click="goToAdmin()"
          round
          icon="el-icon-s-promotion"
          >Login</el-button
        >
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import Editor from "@/components/admin/editor.vue";
import List from "@/components/admin/list.vue";
import { mapGetters } from "vuex";
export default {
  name: "admin",
  components: { Editor, List },
  data() {
    return {
      isCollapse: true,
      //表格里的数据
      listData: [],
      //表格被选中的一行
      index: 0,
      //被送入编辑器的内容
      data: {},
      username: "",
      password: "",
    };
  },

  computed: {
    ...mapGetters([
      //是否登陆
      "isLogin",
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
    //登录操作
    goToAdmin() {
      // console.log(this.username, this.password);
      this.$axios
        .get("/queryAdmin", {
          params: {
            username: this.username,
            password: this.password,
          },
        })
        .then((res) => {
          if (res.data === 1) {
            this.$store.commit("changeLoginStatus",false)
            this.refresh();
          }else{
            this.$message.error("登陆失败");
          }
        });
    },
    //这里会向后端请求数据，改变表格中的数据
    handleSelect(key, keyPath) {
      if (this.isEdit) {
        this.$message.error("请先保存正在编辑的内容");
        return;
      }
      // console.log(keyPath);
      // console.log(url);
      //保存正在操作的表名与类别
      this.$store.commit("changeKind", keyPath[1]);
      this.$store.commit("changeTable", keyPath[0]);
      // console.log(this.kind, this.table);
      let url = this.table + "/" + "query" + this.table + "Notice";
      // console.log(this.kind,query);
      //从数据库获取数据
      this.getListData(url, this.kind);
    },
    getListData(url, params) {
      this.$axios
        .get(url, {
          params: {
            kind: params,
          },
        })
        .then((res) => {
          // console.log("获取到的数据", res.data);
          this.listData = res.data;
        });
    },
    goToEdit(index) {
      this.$store.commit("saveNotice", this.listData[index]);
      this.$store.commit("changeEditStatus", true);
    },

    refresh() {
      console.log("刷新成功");
      let url = this.table + "/" + "query" + this.table + "Notice";
      this.getListData(url, this.kind);
    },
  },
  mounted() {
    //必须登录成功才能进行获取数据
    if (!this.isLogin) {
      this.refresh();
    }
  },
  created() {},
};
</script>

<style>
.adminHeader {
  background: rgb(80, 164, 238);
  border: rgb(80, 164, 238);
  float: left;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: auto;
  min-width: 200px;
  min-height: 400px;
  padding: 0;
  margin: 0;
}

.el-header {
  color: #333;
  text-align: center;
  line-height: 60px;
  padding: 0;
  margin: 0;
}

.el-container {
  padding: 0;
  margin: 0;
}

.el-aside {
  padding: 0;
  margin: 0;
}

.el-main {
  /* background-color: #e6e6e6; */
  color: #333;
  text-align: center;
  min-height: 600px;
  padding: 0;
  margin: 0;
}

.el-footer {
  color: #333;
  text-align: center;
  line-height: 60px;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
