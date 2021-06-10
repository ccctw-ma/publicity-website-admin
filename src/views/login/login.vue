<template >
  <div class="">
    <el-input v-model="username" placeholder="请输入用户名"></el-input>
    <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
    <el-button type="primary" @click="goToAdmin()" icon="el-icon-s-promotion">loginaa</el-button>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
    };
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
    goToAdmin() {
        console.log(this.username,this.password)
      this.$axios
        .get("/login", {
          params: {
            username: this.username,
            password: this.password,
          },
        })
        .then((res) => {
          console.log(res.data);
        });
    },
  },
  created() {},
};
</script>
<style>
.login_main {
  width: 100%;
  height: 100%;
  min-width: 1240px;
  /* min-height: 1000px; */
  background: rgb(80, 164, 238);
}
</style>