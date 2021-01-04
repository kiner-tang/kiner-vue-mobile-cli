/* eslint-disable no-console */
import Vue from "vue";
import Router from "vue-router";
import Index from "./views/index.vue";
import config from "./utils/config";

Router.prototype.back = false;
Router.prototype.goBack = function() {
  this.back = true;
  this.go(-1);
};

console.log(config.routerBaseUrl);

const router = new Router({
  mode: "history",
  base: config.routerBaseUrl,
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
      props: true,
      children: []
    },
  ]
});

router.beforeEach((to, from, next) => {
  // let {meta} = to;
  // let userInfo = _.getUserInfo();
  // if(meta.auth){
  //     if(userInfo&&userInfo.token){
  //         next();
  //     }else{
  //         next({ path: `/login?target=${to.path}` })
  //     }
  // }else{
  next();
  // }
});

// window.addEventListener("popstate", function (e) {
//     console.log(e);
//     // history.pushState(null, "/register");
//     // router.goBack();
// }, false);

Vue.use(Router);

export default router;
