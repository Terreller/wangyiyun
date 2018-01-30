<template>
  <div class="playList">
      <header-gray headerTitle="歌单" back="true"></header-gray>
      <div class="loading-wrapper" v-if="isloading">
          <div class="loading"></div>
          <div class="loading-txt">正在加载中</div>
      </div>
      <div class="main" v-if="!isloading">
        <div class="top_bg">
          <div class="list_bg">
            <img :src="playDetail.picUrl">
            <span>{{Number(playDetail.playCount / 10000).toFixed(1)+'万'}}</span>
          </div>
          <div class="list_details">
            <p>{{playDetail.name}}</p>
            <div class="list_name">
              <!-- 如果playList的id存在,则有图片,否则出现本地图片 -->
              <img :src="playList.creator.avatarUrl" v-if="playList.id !== ''">
              <img src="./images/playlist-avatar.png" v-if="playList.id === ''">
              <p>{{playList.creator.nickname}}</p>
            </div>
          </div>
          <!-- icon小图标 -->
          <div class="icon">
            <div class="icon_item">
              <i class="iconfont icon-shoucang"></i>
              <span>{{playList.subscribedCount}}</span>
            </div>
            <div class="icon_item">
              <i class="iconfont icon-pinglun_small"></i>
              <span>{{playList.commentCount}}</span>
            </div>
            <div class="icon_item">
              <i class="iconfont icon-fenxiang"></i>
              <span>{{playList.shareCount}}</span>
            </div>
            <div class="icon_item">
              <i class="iconfont icon-xiazai"></i>
              <span>下载</span>
            </div>
          </div>
        </div>
        <div class="song-list">
          <!-- 歌曲播放按钮 -->
          <div class="play-bar">
            <div class="play-bar-btn">
              <i class="iconfont icon-play"></i>
              <span>播放全部 (共{{playList.tracks.length}}首)</span>
            </div>
          </div>
          <!-- 歌曲列表 -->
          <ul class="song-item" v-for="(item, index) in playList.tracks" :key="item.id">
            <router-link class="m-item" :to="'/player/' + item.id">
                <div class="song_index">{{index + 1}}</div>
                <div class="m-title">{{item.name}}</div>
                <div class="m-details"  @click="playMusic(item.id)">
                    <p>
                      <span v-for="(itemname,index) in item.ar" :key="itemname.id">{{itemname.name}}
                        <span v-show="index !== (item.ar.length - 1)">/ </span>
                      </span> - {{item.al.name}}
                    </p>
                </div>
                <div class="show-btn">
                    <span></span>
                </div>
            </router-link>
        </ul>
      </div>
  </div>
</div>
</template>
<script>
import HeaderGray from '@/components/header2/Header-gray'
export default {
  components: {
      HeaderGray
  },
  created () {
    this.id = this.$route.params.id
    this.fetchSongList()
  },
  data () {
    return {
      id: 0,
      playList: [],
      isloading: true,
      playListId: []
    }
  },
  methods: {
    // 歌单详情
    fetchSongList () {
      let songListApi = '/api/playlist/detail?id=' + this.id
      this.$http.get(songListApi)
      .then(res => {
        this.isloading = false
        this.playList = res.data.playlist
        //把所有歌单id详情存入数组
        this.playList.tracks.forEach((element) => {
            let songIdObj = {
              id: element.id
          }
            this.playListId.push(songIdObj)
        })
        // console.log(res.data)
      })
    },
    // 将歌曲信息存入vuex中
    playMusic (id) {
      let that = this
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
        this.$store.dispatch('playMusic', arr)
        this.$store.dispatch('playListId', this.playListId)
        this.$store.dispatch('showPlayer', true)
        this.$store.dispatch('tabBarShow', false)
        // console.log(this.playListId)
      }))
    }
  },
  computed: {
    changeMusicId () {
      return this.$store.getters.playMusicId
    },
    // 获取歌曲详情数据
    playDetail () {
      let playList = this.$store.state.playList.result
      // 通过判断playList的长度来判断playList是否已经加载过来了
      if (playList.length > 0) {
        for (let i = 0; i < playList.length; i++) {
          if (Number(playList[i].id) === Number(this.id)) {
            // console.log(playList[i])
            return playList[i]
          }
        }
      } else {
        return {
          imgs: {}
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.playList{
  width: 100%;
}
.main{
  width: 100%;
}
.top_bg{
  width: 100%;
  height: 14rem;
  position: relative;
  overflow: hidden;
  background-color: rgba(64,46,32,.58);
}
.list_bg{
  width: 30%;
  height: 70%;
  position: relative;
  z-index: 2;
  margin-left: 2rem;
  padding-top: 0.5rem;
  float: left;
}
.list_bg>img{
  width: 100%;
  height: 100%;
}
.list_bg>span{
  position: absolute;
  right: 5px;
  top: 10px;
  padding-left: 13px;
  color: #fff;
  font-size: 12px;
  background-position: 0;
  background-repeat: no-repeat;
  background-size: 11px 10px;
  text-shadow: 1px 0 0 rgba(0,0,0,.15);
}
.list_details{
  width: 50%;
  height: 100%;
  position: relative;
  left: 12rem;
  z-index: 2;
}
.list_details>p{
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  width: 80%;
  height: 4rem;
  font-size: 1.6rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding-top: 0.3rem;
  line-height: 2.2rem;
  cursor: pointer;
}
.list_name{
  width: 70%;
  height: 3rem;
  position: relative;
  top: 6rem;
  z-index: 2;
}
.list_name>img{
  position: absolute;
  top: 0;
  left: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  
}
.list_name>p{
  height: 3rem;
  position: absolute;
  top: 0;
  left: 4rem;
  color: white;
  line-height: 3rem;
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
  // icon小图标
  .icon{
    width: 80%;
    height: 4rem;
    position: absolute;
    bottom: 0;
    left: 10%;
    color: white;
  }
  .icon_item{
    width: 25%;
    height: 100%;
    float: left;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-around;
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
</style>

