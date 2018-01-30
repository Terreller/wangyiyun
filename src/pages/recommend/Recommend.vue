<template>
  <div class="recommend">
      <div class="loading-wrapper" v-if="isloading" >
          <div class="loading"></div>
          <div class="loading-txt">正在加载中</div>
      </div>
      <div class="main" v-show="!isloading">
          <div class="list1">
            <div class="listTitle">推荐歌曲</div>
            <ul class="playList">
                <router-link class="musices" v-for="(item, index) in getPlayList.result" :key="item.id" :to="'/play-list/' + item.id">
                    <img :src="item.picUrl" lazy="loading">
                    <span>{{Number(item.playCount / 10000).toFixed(1)+'万'}}</span>
                    <p>{{item.name}}</p>
                </router-link>
            </ul>
          </div>
          <div class="list2">
            <div class="listTitle">最新音乐</div>
            <ul class="m-list">
                <li class="m-item" v-for="(item, index) in getNewMusic.result" :key="item.id">
                    <div class="m-title">{{item.name}}</div>
                    <div class="m-details"  @click="newPlayMusic(item.id)">
                        <i></i>
                        <p>
                            <span v-for="(itemname, index) in item.song.artists" :key="itemname.id">{{itemname.name}}
                                <span v-show="index !== (item.song.artists.length - 1)">/ </span>
                            </span>
                            -{{ item.song.name}}
                        </p>
                    </div>
                    <div class="show-btn">
                        <span></span>
                    </div>
                </li>
            </ul>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  data () {
      return {
          playListId: []
      }
  },
  computed: {
      getPlayList () {
          return this.$store.state.playList
      },
      getNewMusic () {
          return this.$store.state.newMusic
      },
      isloading () {
          return this.$store.state.isloading
      }
  },
  methods: {
      // 将最新音乐歌曲信息存入vuex中
    newPlayMusic (id) {
      let that = this
      this.AllPlayListId()
      function getUrl () {
        let url = '/api/music/url?id=' + id
        return that.$http.get(url)
      }
      function getDetail () {
        let detail = '/api/song/detail?ids=' + id
        return that.$http.get(detail)
      }
      function getLyric () {
        let lyric = '/api/lyric?id=' + id
        return that.$http.get(lyric)
      }
      this.$http.all([getUrl(), getDetail(), getLyric()])
      .then(this.$http.spread((res1, res2, res3) => {
        const arr = [res1, res2, res3]
        this.$store.state.isloading = false
        this.$store.dispatch('newPlayMusic', arr)
        this.$store.dispatch('playListId', this.playListId)
        this.$store.dispatch('showPlayer', true)
        this.$store.dispatch('tabBarShow', false)
      }))
    },
    AllPlayListId () {
        //把所有歌单id详情存入数组
        let arr = this.getNewMusic.result
        arr.forEach((element) => {
            let songIdObj = {
                id: element.id
            }
            this.playListId.push(songIdObj)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.recommend{
    width: 100%;
    position: absolute;
    left: 0;
    top: 10rem;
}
.main{
    width: 100%;
}
.playList{
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
}
.list1{
    width: 100%;
    height: 30rem;
}
.listTitle{
    font-size: 1.6rem;
    text-indent: 1rem;
    position: relative;
}
.listTitle::after{
    content: " ";
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -9px;
    width: 2px;
    height: 16px;
    background-color: #d33a31;
}
.list2{
    margin-top: 2rem;
}
.musices{
    width: 32.5%;
    height: 13rem;
    margin-top: 1rem;
    float: left;
    text-decoration: none;
    color: black;
    position: relative;
}
.musices>img{
    width: 100%;
    height: 70%;
}
.musices>span{
    position: absolute;
    right: 5px;
    top: 2px;
    padding-left: 13px;
    color: #fff;
    font-size: 12px;
    background-position: 0;
    background-repeat: no-repeat;
    background-size: 11px 10px;
    text-shadow: 1px 0 0 rgba(0,0,0,.15);
}
.musices>p{
    width: 100%;
    height: 2.8rem;
    overflow: hidden;
    font-size: 1.4rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding-top: 0.3rem;
    line-height: 1.5rem;
    cursor: pointer;
}
.m-item{
    height: 4rem;
    margin-left: 0.5rem;
    margin-top: 2rem;
    border-bottom: 0.1rem solid rgb(234,234,234);
    position: relative;
    text-decoration: none;
    color: black;
    display: block;
}
.m-title{
    width: 60%;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 1.7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.m-details{
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 1.2rem;
    color: rgb(157,157,157);
}
.m-details>p{
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.m-details>i{
    width: 12px;
    height: 8px;
    margin-right: 4px;
    margin-top: 0.5rem;
    background: url('./images/index_icon_2x.png') no-repeat;
    background-size: 166px 97px;
    float: left;
}
.show-btn>{
    position: absolute;
    top: 1rem;
    right: 1rem;
}
.show-btn>span{
    display: inline-block;
    width: 22px;
    height: 22px;
    background: url('./images/index_icon_2x.png') no-repeat -24px 0;
    background-size: 166px 97px;
}
// 是否正在加载
.loading {
    position: absolute;
    top: 0;
    left: 50%;
    background: #fff;
    width: 2.5rem;
    height: 2.5rem;
    margin-top: 70%;
    margin-left: -1.25rem;
    background: url('./images/rage_loading.png') no-repeat;
    background-size: cover;
    -webkit-animation: rotating 5s  linear infinite;
    animation: rotating 5s linear infinite;
  }
  .loading-txt {
    position: absolute;
    top:0;
    color: #4a4a4a;
    margin-top: 87%;
    width: 100%;
    text-align:center;
  }

  @keyframes rotating {
      0%{
        transform: rotate(0deg);
      }
      100%{
        transform: rotate(360deg);
      }
  }
  // 图片懒加载
  .musices > img[lazy=loading] {
      background: url('./images/loading.gif') no-repeat center;
      background-size: 20% 20%;
    }
</style>
