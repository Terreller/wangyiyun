import Vue from 'vue'
import Router from 'vue-router'
// 推荐歌曲
const Recommend = resolve => require(['@/pages/recommend/Recommend'], resolve)
// 热歌榜
const Hot = resolve => require(['@/pages/hot/Hot'], resolve)
// 搜索
const Search = resolve => require(['@/pages/search/Search'], resolve)
// 歌曲列表详情页
const PlayList = resolve => require(['@/pages/playList/PlayList.vue'], resolve)
// 播放歌曲详情页
// const Player = resolve => require(['@/pages/player/Player.vue'], resolve)
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'recommend',
      component: Recommend
    },
    {
      path: '/hot',
      name: 'hot',
      component: Hot
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/play-list/:id',
      name: 'play-list',
      component: PlayList
    }/* ,
    {
      path: '/player/:id',
      name: 'player',
      component: Player
    } */
  ]
})
