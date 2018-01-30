<template>
  <div class="search">
      <div class="main">
        <!-- 搜索框 -->
          <div class="search_input">
            <i class="iconfont icon-sousuo"></i>
            <input type="text" placeholder="搜索歌曲,歌手,专辑" class="search_text" @keydown="searchData" autocomplete="off" v-model="searchContent" @focus="showSearchList = searchContent !== '' ? 2: 1" value="">
            <i class="iconfont icon-chuyidong del" v-show="showSearchList === 2" @click="changeShowSearch(1)"></i>
          </div>
          <!-- 热门搜索 -->
          <div class="hot_search" v-show="showSearchList === 1">
            <h3 class="title">热门搜索</h3>
            <ul class="list">
              <li v-for="(item, index) in hotData" :key="index" @click="list_content(item)">{{item}}</li>
            </ul>
          </div>
          <!-- 搜索联想框 -->
          <div class="search-suggest" v-show="showSearchList === 2">
            <div class="search-key">搜索"{{searchContent}}"</div>
            <ul class="search_list">
              <li v-for="(item, index) in suggestSongs" :key="index" @click="list_content(item.name)">
                <i class="iconfont icon-sousuo"></i>{{item.name}} - {{item.artists[0].name}}
              </li>
            </ul>
        </div>
        <!-- 搜索详情列表 -->
        <ul class="song-item" v-show="showSearchList === 3">
          <li class="m-item" v-for="(item, index) in searchSongs" :key="index">
              <div class="song_index">{{index + 1}}</div>
              <div class="m-title">{{item.name}}</div>
              <div class="m-details"  @click="playMusic(item.id)">
                  <p>
                    <span v-for="(itemname, ind) in item.artists" :key="itemname.id">
                      {{itemname.name}}
                      <span v-show="ind !== (item.artists.length - 1)">/ </span>
                    </span>-{{item.name}}
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
      showSearchList: 1,
      searchContent: '',
      hotData: ['Sam Smith', '石头计划', '陈奕迅', '孙燕姿', '薛之谦', '算什么男人', '你的名字', '文爱', 'Psycho', '别'],
      suggestSongs: [],
      searchSongs: []
    }
  },
  methods: {
    changeShowSearch (index) {
      this.showSearchList = index
    },
    searchData (e) {
      if (e.keyCode === 13) {
        this.list_content(this.searchContent)
      } else {
        let suggestSongsApi = '/api/search/suggest?keywords=' + this.searchContent
        this.$http.get(suggestSongsApi)
        .then(res => {
          this.showSearchList = 2
          if (res.data.code === 200) {
            this.suggestSongs = res.data.result.songs
          } else if (res.data.code === 400) {
            this.suggestSongs = []
            this.showSearchList = false
          }
          // console.log(res.data)
        })
      }
    },
    list_content (text) {
      let listContentApi = '/api/search/suggest?keywords=' + text
      this.$http.get(listContentApi)
      .then(res => {
        this.showSearchList = 3
        this.searchSongs = res.data.result.songs
        // console.log(res.data.result)
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
        this.$store.dispatch('playMusic', arr)
        this.$store.dispatch('showPlayer', true)
        this.$store.dispatch('tabBarShow', false)
        // console.log(arr)
      }))
    }
  }
}
</script>
<style lang="less" scoped>
.search{
  width: 100%;
  position: relative;
}
.main{
  width: 100%;
  position: absolute;
  top: 9.5rem;
  .search_input{
    width: 90%;
    height: 3rem;
    margin-left: 5%;
    i{
      font-size: 1.2rem;
      position: absolute;
      left: 2rem;
      top: 1.2rem;
    }
    .del{
      font-size: 1.5rem;
      position: absolute;
      left: 23rem;
      top: 1rem;
    }
    .search_text{
      width: 100%;
      height: 100%;
      border-radius: 1.5rem;
      background-color: rgb(220,220,220);
      text-indent: 2rem;
    }
  }
  .hot_search{
    width: 100%;
    height: 14rem;
    margin-top: 2rem;
    margin-left: 1rem;
    .list{
      width: 100%;
      height: 100%;
      padding-top: 2rem;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: flex-start;
      li{
        width: 25%;
        height: 3rem;
        border-radius: 1.5rem;
        background-color: rgb(220,220,220);
        text-align: center;
        line-height: 3rem;
        margin-left: 1rem;
      }
    }
  }
  .search-suggest{
    width: 100%;
    position: absolute;
    z-index: 2;
    top: 5rem;
    left: 1rem;
    background-color: white;
    font-size: 1.5rem;
    .search-key{
      width: 100%;
      height: 2rem;
      border-bottom: 0.1rem solid rgb(215,215,215);
    }
    .search_list{
      width: 100%;
      li{
        width: 100%;
        height: 3rem;
        border-bottom: 0.1rem solid rgb(215,215,215);
        line-height: 3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        i{
          font-size: 1.4rem;
        }
      }
    }
  }
}
// 搜索详情列表
.song-item{
    width: 100%;
    height: 20rem;
    position: absolute;
    top: 4.5rem;
    z-index: 2;
    left: 0;
    overflow: hidden;
    overflow: scroll;
    background-color: white;
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
