<template>
  <div class="audioNav">
      <div class="main">
      <!-- 播放按钮 -->
          <div class="audio_pic" @click="showPlayer()">
              <img :src="playMusic[0].detail.al.picUrl">
          </div>
          <div class="audio_name"  @click="showPlayer()">
              <p>{{playMusic[0].detail.name}}</p>
                <p>
                    <span v-for="(item, index) in playMusic[0].detail.ar" :key="item.id">作曲: {{item.name}}
                        <span v-show="index !== (playMusic[0].detail.ar.length - 1)">/ </span>
                    </span>
                    
                </p>
          </div>
          <div class="audio_play">
              <img src="./images/pause_hover.png" v-show="!showPlay" @click="pause()">
              <img src="./images/play_hover.png" v-show="showPlay" @click="play()">
          </div>
          <div class="audio_list" @click="showPlayItems()">
              <img src="./images/list.png">
          </div>
          <!-- 播放列表 -->
          <ul class="play_items" v-show="isShowList">
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
  </div>
</template>
<script>
export default {
  data () {
      return {
          showPlay: false,
          isShowList: false
      }
  },
  methods: {
      // 手动切换audio,audio标签在其他组件中
      play () {
          this.showPlay = false
          document.getElementById('music').play()
      },
      // 显示隐藏幕板
     showPlayItems () {
        this.isShowList = !this.isShowList
     },
     showPlayer () {
         this.$store.dispatch('showPlayer', true)
         this.$store.dispatch('showAudio', false)
         this.$store.dispatch('tabBarShow', false)
     },
      pause () {
          this.showPlay = true
          document.getElementById('music').pause()
      }
  },
  computed: {
      playMusic () {
          return this.$store.state.playMusic
      },
      allPlayMusic () {
          return this.$store.state.allPlayMusic
      }
  }
}
</script>
<style lang="less" scoped>
.audioNav{
    width: 100%;
    height: 4.5rem;
    background-color: black;
    position: fixed;
    z-index: 5;
    bottom: 0;
    left: 0;
}
.main{
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-around;
    .audio_pic{
        width: 3rem;
        height: 3rem;
        margin-left: 1rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .audio_name{
        width: 60%;
        height: 100%;
        margin-left: 1rem;
        p{
            width: 100%;
            height: 50%;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            color: white;
        }
    }
    .audio_play{
        width: 3.5rem;
        height: 3.5rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .audio_list{
        width: 4rem;
        height: 4rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
// 播放列表
.play_items{
    width: 100%;
    height: 20rem;
    position: absolute;
    top: -15rem;
    z-index: 20;
    left: 0;
    overflow: hidden;
    overflow: scroll;
    background-color: white;
    .template{
        width: 100%;
        height: 59.5%;
        background-color: rgba(0,0,0,0.3);
        position: fixed;
        z-index: 15;
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
</style>
