import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    //当前是否登陆
    isLogin: sessionStorage.getItem('isLogin') ? JSON.parse(sessionStorage.getItem('isLogin') + "") : true,
    //当前是否在进行编辑操作
    isEdit:  false,
    //当前操作的数据库表
    table: sessionStorage.getItem('table') ? JSON.parse(sessionStorage.getItem('table') + "") : "Team",
    //当前操作的表内子项的类别
    kind: sessionStorage.getItem('kind') ? JSON.parse(sessionStorage.getItem('kind') + "") : "teamInfo",
    //当前正在操作的文章内容
    notice: sessionStorage.getItem('notice') ? JSON.parse(sessionStorage.getItem('notice')) : {
      id: 0,
      kind: "teamInfo",
      date: "",
      author: "",
      title: "",
      description: "",
      status: 0,
      content: "",
      mediaType:"",
      mediaUrl:""
    },
    //当前正在操作的数据表中的数据集 待
    noticeList:sessionStorage.getItem('noticeList')?JSON.parse(sessionStorage.getItem('noticeList')):[]
  },
  mutations: {
    changeTable(state, t) {
      state.table = t;
    },
    changeKind(state, k) {
      state.kind = k;
    },
    changeEditStatus(state, e) {
      state.isEdit = e;
    },
    changeLoginStatus(state,l){
      state.isLogin = l;
    },
    saveNotice(state, n) {
      state.notice = n
    }
  },
  getters: {
    table: state => state.table,
    kind: state => state.kind,
    isLogin: state => state.isLogin,
    isEdit: state => state.isEdit,
    notice: state => state.notice
  },
  actions: {

  }
})

export default store