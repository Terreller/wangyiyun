<template>
  <div class="player">
      <div class="loading-wrapper" v-if="isloading">
          <div class="loading"></div>
          <div class="loading-txt">正在加载中</div>
      </div>
      <div class="main" v-if="!isloading">
        <!-- 播放audio -->
        <audio :src="playMusic[0].url ? playMusic[0].url : ''" id="music"
           autoplay="autoplay" ref="audio" @timeupdate="timeProgress" @ended="ended" @play="startPlay">
        </audio>
        <!-- 头部 -->
        <header class="header">
            <div class="return_btn" @click="goBack()">
                <img src="./images/header-icon.png">
            </div>
            <div class="author">
                <p>{{playMusic[0].detail.name}}</p>
                <p>
                    <span v-for="(item, index) in playMusic[0].detail.ar" :key="item.id">{{item.name}}
                        <span v-show="index !== (playMusic[0].detail.ar.length - 1)">/ </span>
                    </span>
                    
                </p>
            </div>
            <span class="share iconfont icon-fenxiang"></span>
            <div class="line_bottom"></div>
        </header>
          <!-- 留声机内容 -->
          <div class="player_phonograph" v-show="!showLyric" @click="changeShowLyric()">
            <div class="player-needle" :class="{'active': !isAnimation}">
                <img src="./images/player-needle.png">
            </div>
            <div class="record-cover">
                <div class="playerPic" :class="{'active': isAnimation}">
                    <img :src="playMusic[0].detail.al.picUrl">
                </div>
            </div>
          </div>
          <!-- 歌词 -->
          <div class="lyric" v-show="showLyric" @click="changeShowLyric()" ref="getLyric">
            <ul v-if="lyric" class="lyric_list" :style="`transform: translateY(${moveTop}px)`" ref="MusicLyric">
                <li v-for="(lyc, ind) in lyric" :key="ind">{{lyc}}</li>
            </ul>
            <ul v-else class="lyric_list">
                <li>暂无歌词</li>
            </ul>
          </div>
          <!-- 进度条 -->
          <div class="progress">
            <span>{{currentTime | timeFormat}}</span>
            <div class="progress-bar" ref="progress">
                <div class="cur-progress" :style="`width:${curProgress}`"></div>
                <div class="idot" @touchstart.stop="isMove === true" :style="`left:${curIdot}`"></div>
            </div>
            <span>{{allTime | timeFormat}}</span>
          </div>
          <!-- 播放按钮 -->
          <div class="player-conctrl">
            <div class="play-mode">
                <div></div>
            </div>
            <div class="prev" @click="prevMusic">
                <div></div>
            </div>
            <div class="ctrl">
                <div v-show="!isPlay" @click="play()"></div>
                <div v-show="isPlay" @click="pause()"></div>
            </div>
            <div class="next" @click="nextMusic">
                <div></div>
            </div>
            <div class="play-list-btn" @click="showPlayItems()">
                <div></div>
            </div>
          </div>
          <!-- 播放列表 -->
            <ul class="play_items" v-show="isShowPlayItems">
                <div class="template" @click.stop="showPlayItems()"></div>
                <li class="music_list" v-for="(item, index) in allPlayMusic" :key="item.detail.id">
                <div class="song_index">{{index + 1}}</div>
                <div class="m-title">{{item.detail.name}}</div>
                <div class="m-details">
                    <p>
                        <span v-for="(itemname, ind) in item.detail.ar" :key="itemname.id">{{itemname.name}}
                        <span v-show="ind !== (item.detail.ar.length - 1)">/ </span>
                        </span>-{{item.detail.name}}
                    </p>
                </div>
                <div class="show-btn">
                    <span></span>
                </div>
                </li>
            </ul>
      </div>
      <!-- 背景图片 -->
      <div class="player-bg" :style="`background: url(${playMusic[0].detail.al.picUrl ?playMusic[0].detail.al.picUrl : bg})`">
      </div>
  </div>
</template>
<script>
export default {
  data () {
      return {
          id: 0,
          bg: './images/bg.jpg',
          isAnimation: true,
          currentTime: 0,
          allTime: 0,
          isMove: false,
          curProgress: '0',
          curIdot: 0,
          isPlay: true,
          showLyric: false,
          isShowPlayItems: false,
          changeMusicId: 0,
          nowId: 0,
          moveTop: 0,
          parsed: {}, //临时哈希表，保存播放进度和偏移位置
      }
  },
  created () {
    this.id = this.$route.params.id
  },
  computed: {
    // 获取播放歌曲信息
    playMusic () {
        return this.$store.state.playMusic
    },
    isloading () {
        return this.$store.state.isloading
    },
    // 获取播放列表歌曲
    allPlayMusic () {
        return this.$store.state.allPlayMusic
    },
    // 获取所有id
    playListId () {
        return this.$store.state.playListId
    },
    // 歌词
    lyric () {
        if (this.playMusic[0].lyc !== undefined) {
            // console.log(this.parseLrc(this.playMusic[0].lyc.lrc.lyric))
            return this.parseLrc(this.playMusic[0].lyc.lrc.lyric)
        } else {
            return false
        }
        // console.log(this.musicLyric)
    }
  },
  methods: {
    goBack () {
       this.$store.dispatch('showPlayer', false)
       this.$store.dispatch('showAudio', true)
       this.$store.dispatch('tabBarShow', true)
       this.$router.push('/')
    },
    startPlay () {
        if (this.lyric.length <= 0) {
          return
        }
        this.setParsed()
    },
    //歌词滚动
      updateLyric(item) {
        let text_temp;
        let data = this.parsed
        if (!data) return;
        let currentTime = Math.round(item.currentTime)
        let lrc = data[currentTime];
        if (!lrc)return;
        let text = lrc.text
        if (text != text_temp) {
//          locationLrc(lrc);
          document.querySelectorAll('.lyric_list .on').forEach((v, i) => {
            v.classList.remove('on')
          })
          let num = document.querySelector('.lyric_list').querySelectorAll('li:nth-child(' + (lrc.index + 1) + ')')[0]
          num.classList.add('on')
          let top = Math.min(0, -lrc.top);
          this.moveTop = top
          text_temp = text;
        }
      },
    // 将歌曲信息存入vuex中
    playMusicList (id) {
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
        // console.log(arr)
        this.$store.dispatch('playMusic', arr)
      }))
    },
    // 显示隐藏幕板
    showPlayItems () {
        this.isShowPlayItems = !this.isShowPlayItems
    },
    // 切换歌词面板和留声机面板
    changeShowLyric () {
        this.showLyric = !this.showLyric
    },
    // 播放
    play () {
        this.isAnimation = true
        this.isPlay = true
        this.$refs.audio.play()
    },
    // 暂停
    pause () {
        this.isAnimation = false
        this.isPlay = false
        this.$refs.audio.pause()
    },  
    // 下一首
    nextMusic () {
        if (this.playListId.length < 0) {
            this.$refs.audio.src = this.playMusic.url
        }
        let index = this.changeMusicId + 1
        this.changeMusicId++
        this.nowId = this.playListId[index]
        let list = this.playMusic
        // console.log(list[`${0}`])
        // console.log(list[0].url)
        this.$refs.audio.src = list[`${0}`].url
        if (index >= this.playListId.length) {
            index = 0
        }
        
    },
    // 上一首
    prevMusic () {
        let index
        if (this.changeMusicId <= 0) {
            index = this.playListId.length - 1 + this.changeMusicId
            this.changeMusicId--
        } else {
            index = this.changeMusicId - 1
            this.changeMusicId--
        }
        this.nowId = this.playListId[index]
        let list = this.playMusic
        // console.log(list[`${0}`])
        // console.log(list[0].url)
        this.$refs.audio.src = list[`${0}`].url
        if (index < 0) {
            index = 0
        }
    },
    //保存歌词索引内容偏移位置
      setParsed() {
        let i = 0
        if (this.lyric.length <= 0) {
          return
        }
        //用数组保存lyric的键并排序
        var arr = []
        for (let item in this.lyric) {
          arr.push(parseInt(item))
        }
        //循环数组来为parsed赋值
        arr.sort((a, b) => a - b).forEach((v, i) => {
          this.parsed[v] = {
            index: i++,
            text: this.lyric[v],
            top: (i * 30) * 1
          }
        })
      },
    //解析歌词
    parseLrc(lrc) {
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for (var i = 0; i < lyrics.length; i++) {
        var lyric = decodeURIComponent(lyrics[i]);
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        if (!timeRegExpArr)continue;
        var clause = lyric.replace(timeReg, '');
        for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
        var t = timeRegExpArr[k];
        var min = Number(String(t.match(/\[\d*/i)).slice(1)),
            sec = Number(String(t.match(/\:\d*/i)).slice(1));
        var time = min * 60 + sec;
        lrcObj[time] = clause;
        }
    }
    return lrcObj;
    },
    // 歌曲播放结束自动进行下一首
    ended () {
        this.nextMusic()
    },
    //进度条时间与播放时间统一
    timeProgress() {
    //拖动时不执行
    if (this.isMove) return
    const audioPlay = this.$refs.audio
    let cur = (audioPlay.currentTime / audioPlay.duration) * this.$refs.progress.offsetWidth
    this.curProgress = cur + 'px'
    this.curIdot = (cur - 13) + 'px'
    this.currentTime = audioPlay.currentTime
    this.allTime = audioPlay.duration
    /* let distance = ((audioPlay.currentTime + 30) / audioPlay.duration) * this.$refs.getLyric.offsetHeight
    this.moveTop -= 1.7 */
    this.updateLyric(audioPlay)
    }
  },
  watch: {
      nowId (val, old) {
          if (val.id == undefined) {
              return 
          }
          this.playMusicList(val.id)
      }
  },
  // 进度条时间
  filters: {
      timeFormat (value) {
          let min = parseInt(value / 60)
          let sec = parseInt(value % 60)
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          return min + ':' + sec
      }
  }
}
</script>
<style lang="less" scoped>
.main{
    width: 100%;
    position: relative;
    .player_phonograph{
        width: 100%;
        height: 35rem;
        position: absolute;
    .player-needle{
        width: 25%;
        height: 11rem;
        position: absolute;
        z-index: 10;
        top: 0;
        left: 12rem;
        -webkit-transition: all 300ms ease-out;
        transition: all 300ms ease-out;
        -webkit-transform-origin: left top;
        transform-origin: left top;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .record-cover{
        width: 18rem;
        height: 18rem;
        border-radius: 50%;
        position: absolute;
        z-index: 9;
        top: 6.5rem;
        left: 15%;
        .playerPic{
            width: 100%;
            height: 100%;
            background-image: url('./images/record-bg.png');
            background-size: 100% 100%;
            position: relative;
            img{
                width: 70%;
                height: 70%;
                position: absolute;
                top: 2.8rem;
                left: 2.6rem;
                border-radius: 50%;
            }
        }
    }
    }
}
.progress{
    position: relative;
    top: 35rem;
    z-index: 10;
}
.player-needle.active{
    -webkit-transition: all 300ms ease-in;
    transition: all 300ms ease-in;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    -webkit-transform: rotate(-20deg);
    transform: rotate(-20deg);
}
.playerPic.active{
    animation: run 8s linear infinite;
}
@keyframes run {
    0%{transform: rotateZ(0deg)}
    100%{transform: rotateZ(360deg)}
}
.player{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    z-index: 1001;
    .player-bg{
        position: absolute;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        filter: blur(70px) brightness(50%);
    }
}
.header{
    width: 100%;
    height: 4rem;
    text-align: left;
    position: relative;
    z-index: 11;
    background-color: rgb(46,36,37);
    .return_btn{
        width: 2.5rem;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        img{
            width: 100%;
            height: 60%;
        }
    }
    .author{
        width: 60%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 4rem;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        color: white;
        p:nth-of-type(2){
            color: rgb(161,161,161);
        }
    }
    .share{
        font-size: 2rem;
        position: absolute;
        z-index: 2;
        top: 0;
        right: 0.5rem;
        text-align: center;
        width: 6rem;
        height: 4.4rem;
        line-height: 4.4rem;
        color: white;
        font-size: 2.4rem;
}
    .line_bottom{
        height: 1px;
        background-image: linear-gradient(90deg,transparent,hsla(0,0%,20%,50%,100%,0.6),transparent);
    }
}
  // 是否正在加载
  .loading-wrapper{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 20;
      background-color: white;
  }
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
// 进度条
  .progress {
      display: flex;
      align-items: center;
      padding: 0 1.3rem;
      margin-top: 1.3rem;
      span {
        font-size: 1.2rem;
      }
      .progress-bar {
        flex: 1;
        margin: 1.1rem;
        height: .2rem;
        background-color: white;
        .cur-progress {
          width: 50%;
          height: 100%;
          background-color: #d33a31;
        }
        .idot {
          position: relative;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background-color: #fff;
          top: -0.6rem;
        }
      }
    }
// 播放按钮
.player-conctrl {
    width: 100%;
    height: 4rem;
    position: absolute;
    left: 0;
    top: 43rem;
    z-index: 10;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-around;
    .play-mode{
        width: 4rem;
        height: 4rem;
        div{
            width: 100%;
            height: 100%;
            background: url('./images/seq_hover.png') no-repeat center;
            background-size: 100% 100%;
        }
    }
    .prev{
        width: 4rem;
        height: 4rem;
        div{
            width: 100%;
            height: 100%;
            background: url('./images/prev_hover.png') no-repeat center;
            background-size: 100% 100%;
        }
    }
    .ctrl{
         width: 4rem;
        height: 4rem;
        div:nth-of-type(1){
            width: 100%;
            height: 100%;
            background: url('./images/play_hover.png') no-repeat center;
            background-size: 100% 100%;
        }
        div:nth-of-type(2){
            width: 100%;
            height: 100%;
            background: url('./images/pause_hover.png') no-repeat center;
            background-size: 100% 100%;
        }
    }
    .next{
        width: 4.7rem;
        height: 4.7rem;
        div{
            width: 100%;
            height: 100%;
            background: url('./images/next_hover.png') no-repeat center;
            background-size: 100% 100%;
        }
    }
    .play-list-btn{
        width: 4rem;
        height: 4rem;
        div{
            width: 100%;
            height: 100%;
            background: url('./images/list.png') no-repeat center;
            background-size: 100% 100%;
        }
    }
}
// 歌词
.lyric{
    width: 100%;
    height: 35rem;
    position: absolute;
    z-index: 10;
    top: 4rem;
    left: 0;
    overflow: hidden;
    .lyric_list{
        width: 100%;
        height: 100%;
        padding-top: 1rem;
        text-align: center;
        line-height: 35rem;
        li{
            width: 100%;
            height: 3rem;
            color: white;
            font-size: 1.5rem;
        }
    }
}
// 播放列表
.play_items{
    width: 100%;
    height: 20rem;
    position: absolute;
    top: 29rem;
    z-index: 10;
    left: 0;
    overflow: hidden;
    overflow: scroll;
    background-color: white;
    .template{
        width: 100%;
        height: 61.5%;
        background-color: rgba(0,0,0,0.3);
        position: fixed;
        z-index: 9;
        top: 0;
        left: 0;
    }
    .music_list{
        width: 100%;
        height: 3rem;
        padding-left: 1rem;
        padding-top: 1rem;
        position: relative;
        text-decoration: none;
        color: black;
        display: inline-block;
        border-bottom: 0.1rem solid rgb(191,191,191);
        .song_index{
            width: 10%;
            height: 100%;
            line-height: 2rem;
            font-size: 1.5rem;
            float: left;
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
            p{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .show-btn>{
            position: absolute;
            top: 1rem;
            right: 3rem;
            span{
                display: inline-block;
                width: 22px;
                height: 22px;
                background: url('./images/index_icon_2x.png') no-repeat -24px 0;
                background-size: 166px 97px;
            }
        }
    }
}
.on{
    font-size: 2rem !important;
    text-shadow: 0 2px 2px black;
    color: red !important;
}
</style>
