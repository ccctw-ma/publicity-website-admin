import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
/*懒加载*/
const router = new VueRouter({
    mode: 'hash',
    routes: [{
            //路径为空时跳到主页
            path: '',
            redirect: '/admin',
        },
        {
            //管理员界面
            path: '/admin',
            name: 'admin',
            component: () => import("@/views/admin/admin.vue")
        },{
            path:'/login',
            name:'login',
            component: () => import("@/views/login/login.vue")
        }


    ]
});

// router.beforeEach((to, from, next) => {

// })


export default router