import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
    return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: "history",
    routes:[
        // Login
        {
            path: '/',
            name: 'Login',
            meta: { title: 'Login'},
            component: importComponent('Login'),
        },

        // Register
        {
            path: '/register',
            name: 'Register',
            meta: { title: 'Register'},
            component: importComponent('Register'),
        },
        
        {
            path: "/",
            component: importComponent("DashboardLayout"),
            children: [
                // Dashboard
                {
                    path: "/dashboard",
                    name: "Dashboard",
                    meta: { title: 'Dashboard'},
                    component: importComponent("Dashboard"),
                },
                // Makanan
                {
                    path: '/makanan',
                    name: 'Makanan',
                    meta: { title: 'Makanan'},
                    component: importComponent('DataMaster/Makanan'),
                },
                // Minuman
                {
                    path: '/minuman',
                    name: 'Minuman',
                    meta: { title: 'Minuman'},
                    component: importComponent('DataMaster/Minuman')
                },
                // Transaksi
                {
                    path: '/transaction',
                    name: 'Transaction',
                    meta: { title: 'Transaction'},
                    component: importComponent('DataMaster/Transaction')
                },
                // Users
                {
                    path: '/user',
                    name: 'User',
                    meta: { title: 'Users'},
                    component: importComponent('DataMaster/Users')
                },
            ],
        },

        {
            path: '*',
            redirect: '/'
        },
    ],
});

// set judul
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    if(to.name !== "Login" && localStorage.getItem("token") == null && to.name !== "Register"){
        next({name: 'Login'});
    }
    else{
        next();
    }
});

export default router;