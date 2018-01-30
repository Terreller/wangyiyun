<template>
  <div class="hot">
    <div class="loading-wrapper" v-if="isloading" >
          <div class="loading"></div>
          <div class="loading-txt">正在加载中</div>
      </div>
      <div class="main" v-if="!isloading">
        <!-- 云音乐热歌榜 -->
          <div class="top_header">
            <div class="yunPic"></div>
            <p>更新日期: 10月26日</p>
          </div>
          <!-- 歌曲列表 -->
          <ul class="song-item" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0">
            <router-link class="m-item" :to="'/player/' + item.id" v-for="(item, index) in hotMusic" :key="item.id">
                <div class="song_index" :class="{'active': index < 3}">{{index + 1}}</div>
                <div class="m-title">{{item.name}}</div>
                <div class="m-details" @click="hotPlayMusic(item.id)">
                    <p>
                      <span v-for="(itemname,index) in item.artists" :key="itemname.id">{{itemname.name}}
                        <span v-show="index !== (item.artists.length - 1)">/ </span>
                      </span> - {{item.album.name}}
                    </p>
                </div>
                <div class="show-btn">
                    <span></span>
                </div>
            </router-link>
        </ul>
      </div>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui'
export default {
  computed: {
},
  methods: {
    // 将最新音乐歌曲信息存入vuex中
    hotPlayMusic (id) {
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
        this.$store.dispatch('hotPlayMusic', arr)
        this.$store.dispatch('playListId', this.playListId)
        this.$store.dispatch('showPlayer', true)
        this.$store.dispatch('tabBarShow', false)
      }))
    },
    getHotMusic () {
      this.loading = true
      let hotMusicApi = '/api/top/list?idx=1'
      this.$http.get(hotMusicApi)
      .then(res => {
        this.isloading = false
        let total = res.data.result.tracks.length
        for (let i = 0; i < this.num; i++) {
          this.hotMusic.push(res.data.result.tracks[i])
          if (this.hotMusic.length > total) {
            return
          }
          if (this.hotMusic.length > this.num) {
            this.hotMusic.splice(0, 10)
          }
        }
        this.num = this.num + 10
        if (this.num > total) {
          this.loading = false
        }
        this.loading = false
        Indicator.open('加载中...')
        setTimeout(function() {
          Indicator.close()
        }, 1000)
        // console.log(res.data, total)
      })
    },
    AllPlayListId () {
        //把所有歌单id详情存入数组
        let arr = this.hotMusic
        console.log(arr)
        arr.forEach((element) => {
            let songIdObj = {
                id: element.id
            }
            this.playListId.push(songIdObj)
        })
    },
    loadMore() {
      this.getHotMusic()
    }
  },
  created () {
    this.getHotMusic ()
  },
  data () {
    return {
      loading: false,
      hotMusic: [],
      num: 10,
      isloading: true,
      playListId: []
    }
  }
}
</script>
<style lang="less" scoped>
.hot{
  width: 100%;
  position: absolute;
  left: 0;
  top: 8.5rem;
}
.main{
  width: 100%;
  .top_header{
    width: 100%;
    height: 10rem;
    background: url('./images/hot_music_bg_2x.jpg') no-repeat center;
    background-size: 100% 100%;
    position: relative;
    .yunPic{
      width: 13rem;
      height: 7rem;
      position: absolute;
      top: 2rem;
      left: 1rem;
      background: url(./images/index_icon_2x.png) no-repeat -24px -22px;
      background-size: 100% 100%;
    }
    p{
      color: white;
      position: absolute;
      top: 8rem;
      left: 1rem;
    }
  }
}
.song-list {
    width: 100%;
    height: 4rem;
   .play-bar{
    width: 100%;
    height: 100%;
    padding-left: 1rem;
    border-bottom: 0.1rem solid rgb(191,191,191);
    .play-bar-btn{
    width: 100%;
    height: 100%;
    line-height: 4rem;
    font-size: 1.5rem;
    }
   }
  }
.song_index{
      width: 10%;
      height: 100%;
      line-height: 2rem;
      font-size: 1.5rem;
      float: left;
}
.song_index.active{
  color: rgb(212,60,51);
}
.m-item{
  width: 100%;
  height: 3rem;
  padding-left: 1rem;
  padding-top: 1rem;
  position: relative;
  text-decoration: none;
  color: black;
  display: inline-block;
  border-bottom: 0.1rem solid rgb(191,191,191);
}
.m-title{
    width: 60%;
    font-size: 1.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.m-details{
    width: 70%;
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 1.2rem;
    color: rgb(157,157,157);
}
.m-details>p{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.show-btn>{
    position: absolute;
    top: 1rem;
    right: 3rem;
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
</style>
