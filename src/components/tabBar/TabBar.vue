<template>
  <div class="tabBar">
      <div class="main">
          <router-link to="/" class="recommend a_link">
            <div @click="changeIndex(1)" :class="{'active': activeIndex === 1}">推荐音乐</div>
            <span class="moveLine" v-show="activeIndex === 1"></span>
          </router-link>
          <router-link to="/hot" class="recommend a_link">
            <div @click="changeIndex(2)" :class="{'active': activeIndex === 2}">热歌榜</div>
            <span class="moveLine" v-show="activeIndex === 2"></span>
          </router-link>
          <router-link to="/search" class="recommend a_link">
            <div @click="changeIndex(3)" :class="{'active': activeIndex === 3}">搜索</div>
            <span class="moveLine" v-show="activeIndex === 3"></span>
          </router-link>
      </div>
  </div>
</template>
<script>
export default {
  data () {
      return {
          activeIndex: 1
      }
  },
  methods: {
      changeIndex (index) {
          this.activeIndex = index
      }
  }
}
</script>
<style lang="less" scoped>
.tabBar{
    width: 100%;
    height: 3.5rem;
    position: fixed;
    z-index: 2;
    top:5rem;
    background-color: white;
}
.main{
    width: 100%;
    height: 100%;
    border-bottom: 0.1rem solid rgb(214,214,214);
    box-sizing: border-box;
    line-height: 3.5rem;
}
.main > .a_link > div.active{
    color: rgb(212,60,51);
}
.main > .a_link > div {
    text-align: center;
    color: rgb(51,51,51);
    font-size: 1.5rem;
    width: 33.333%;
    float: left;
}
.moveLine{
    display: inline-block;
    position: absolute;
    bottom: 0;
    border-bottom: 0.2rem solid rgb(212,60,51);
}
.a_link:nth-of-type(1)>.moveLine{
    width: 25%;
    left: 4%;
}
.a_link:nth-of-type(2)>.moveLine{
    width: 18%;
    left: 41%;
}
.a_link:nth-of-type(3)>.moveLine{
    width: 15%;
    left: 76%;
}
</style>
