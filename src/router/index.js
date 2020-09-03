import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Dashboard', icon: 'dashboard' }
  //   }]
  // },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/user',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'user',
  //       component: () => import('@/views/show/user'),
  //       meta: { title: 'user', icon: 'table' }
  //     },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       component: () => import('@/views/show/role'),
  //       meta: { title: 'role', icon: 'table' }
  //     },
  //     {
  //       path: 'show',
  //       name: 'show',
  //       component: () => import('@/views/show/show'),
  //       meta: { title: 'show', icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link'}
  //     }
  //   ]
  // },
  // {
  //   path: '/logout',
  //   name: 'logout',
  //   component: () => import ('@/views/login')
  // },

  
]

export const asyncRoutes = [
  
  {
    path: '/userManager',
    component: Layout,
    meta: { roles: ["admin","editor"] },
    children: [
      {
        path: 'index',
        name: 'userManager',
        component: () => import('@/views/user/index'),
        meta: { title: 'UserManager', icon: 'form',roles: ["admin","editor"] }
      }
    ]
  },
  {
    path: '/roleManager',
    component: Layout,
    meta: { roles: ["admin","editor"] },
    children: [
      {
        path: 'index',
        name: 'roleManager',
        component: () => import('@/views/role/index'),
        meta: { title: 'RoleManager', icon: 'form' ,roles: ["admin","editor"]}
      }
    ]
  },
  
  {
    path: '/roleMenu',
    component: Layout,
    meta: { roles: ["admin"] },
    children: [
      {
        path: 'index',
        name: 'roleMenu',
        // component: () => import('@/views/roleMenu/index'),
        component: register => require(['@/views/roleMenu/index.vue'],register),
        meta: { title: 'roleMenu', icon: 'form', roles: ["admin"] }
      }
    ]
  },
  {
    path: '/userRole',
    component: Layout,
    meta: { roles: ["admin"] },
    children: [
      {
        path: 'index',
        name: 'userRole',
        component: () => import('@/views/userRole/index'),
        meta: { title: 'userRole', icon: 'form',roles: ["admin"] }
      }
    ]
  },
  
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const manageFiles = require.context('./modules',true,/\.js$/)
export let configRouters = []
manageFiles.keys().forEach(key => {
  if(key === './index.js') return
  configRouters = configRouters.concat(manageFiles(key).default)
  // console.log("manageFiles(key).default",manageFiles(key).default)
  // constantRoutes.push(manageFiles(key).default)
})
configRouters = configRouters.concat(constantRoutes)
// console.log("configRouters",configRouters)
// console.log("constantRoutes",constantRoutes)

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: configRouters
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
