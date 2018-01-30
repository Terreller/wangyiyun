<template>
  <div id="app">
    <header-red v-show="tabBarShow"></header-red>
    <tab-bar v-show="tabBarShow"></tab-bar>
    <audio-nav v-show="showAudio"></audio-nav>
    <player v-show="showPlayer"></player>
    <router-view v-show="!showPlayer"></router-view>
  </div>
</template>

<script>
import HeaderRed from '@/components/header/Header-red'
import TabBar from '@/components/tabBar/TabBar'
import AudioNav from '@/pages/audioNav/AudioNav'
import Player from '@/pages/player/Player'
export default {
  created () {
    // 初始化操作
    // 首页的推荐歌曲数据
    this.$store.dispatch('setPlayList'),
    // 首页的最新音乐数据
    this.$store.dispatch('setNewMusic')
    // 云音乐热歌榜数据
    // this.$store.dispatch('hotMusic')
  },
  components: {
    HeaderRed,
    TabBar,
    AudioNav,
    Player
  },
  computed: {
    tabBarShow () {
      return this.$store.state.tabBarShow
    },
    showAudio () {
      return this.$store.state.showAudio
    },
    showPlayer () {
      return this.$store.state.showPlayer
    }
  }
}
</script>

<style>

</style>
