import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  // console.log("hasToken",hasToken)
  if (hasToken) {
    // console.log("to.path",to.path)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      // add test
      // console.log(hasGetUserInfo)
      // console.log(store.getters.name)
      // console.log(store.getters.roles)
      if (hasGetUserInfo) {
        // console.log("hasGetUserInfo",hasGetUserInfo)
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          // console.log("store.getters.name",store.getters.name)
          // console.log("store.getters.roles",store.getters.roles)
          const  roles  = store.getters.roles
          // console.log(roles)
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // console.log("accessRoutes",accessRoutes)
          // console.log("router.options.routes",router.options.routes)
          // console.log("store.getters.routes",store.getters.routes)
          router.options.routes = store.getters.routes//.concat(router.options.routes);
          // console.log("router",router)
          // router.options.routes = accessRoutes
          router.addRoutes(accessRoutes)
          // console.log("router",router)
          next({ ...to,replace: true })
          // console.log(to)
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
