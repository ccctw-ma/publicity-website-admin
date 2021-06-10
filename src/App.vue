<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
export default {
  name: "App",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "isLogin"
    ])
  },
  methods: {
    // 存入数据防止刷新清空
    saveState() {
      sessionStorage.setItem("isLogin", JSON.stringify(this.isLogin));
    },
  },
  mounted() {
    // 将数据保存到vuex
    window.addEventListener("unload", this.saveState);
  },
};
</script>

<style>

</style>
