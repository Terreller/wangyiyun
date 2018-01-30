import http from 'axios'
export default {
  setPlayList (store) {
    let playListApi = '/api/personalized'
    http.get(playListApi)
        .then(res => {
          // console.log(res)
          store.state.isloading = false
          store.commit('SET_PLAY_LIST', res.data)
        })
  },
  setNewMusic (store) {
    let newMusicApi = '/api/personalized/newsong'
    http.get(newMusicApi)
        .then(res => {
          // console.log(res.data)
          store.state.isloading = false
          store.commit('SET_NEW_MUSIC', res.data)
        })
  },
  newPlayMusic (store, arr) {
    let playMusic = store.state.playMusic = []
    // 所有播放歌曲信息
    let allPlayMusic = store.state.allPlayMusic
    const newSongObj = {
      url: arr[0].data.data[0].url,
      detail: arr[1].data.songs[0],
      lyc: arr[2].data
    }
    for (let i = 0; i < playMusic.length; i++) {
      if (playMusic[i].detail.id === newSongObj.detail.id) {
        playMusic.splice(i, 1)
        break
      }
    }
    for (let j = 0; j < allPlayMusic.length; j++) {
      if (allPlayMusic[j].detail.id === newSongObj.detail.id) {
        allPlayMusic.splice(j, 1)
        break
      }
    }
    store.state.playMusic.push(newSongObj)
    store.state.allPlayMusic.push(newSongObj)
    console.log(store.state.allPlayMusic)
  },
  playMusic (store, arr) {
    let playMusic = store.state.playMusic = []
    // 所有播放歌曲信息
    let allPlayMusic = store.state.allPlayMusic
    const songObj = {
      url: arr[0].data.data[0].url,
      detail: arr[1].data.songs[0],
      lyc: arr[2].data
    }
    for (let i = 0; i < playMusic.length; i++) {
      if (playMusic[i].detail.id === songObj.detail.id) {
        playMusic.splice(i, 1)
        break
      }
    }
    for (let j = 0; j < allPlayMusic.length; j++) {
      if (allPlayMusic[j].detail.id === songObj.detail.id) {
        allPlayMusic.splice(j, 1)
        break
      }
    }
    store.state.playMusic.push(songObj)
    store.state.allPlayMusic.push(songObj)
    // console.log(store.state.allPlayMusic)
  },
  playListId ({commit}, data) {
    // console.log(data)
    commit('PLAY_LIST_ID', data)
  },
  hotPlayMusic (store, arr) {
    let playMusic = store.state.playMusic = []
    // 所有播放歌曲信息
    let allPlayMusic = store.state.allPlayMusic
    const hotSongObj = {
      url: arr[0].data.data[0].url,
      detail: arr[1].data.songs[0],
      lyc: arr[2].data
    }
    for (let i = 0; i < playMusic.length; i++) {
      if (playMusic[i].detail.id === hotSongObj.detail.id) {
        playMusic.splice(i, 1)
        break
      }
    }
    for (let j = 0; j < allPlayMusic.length; j++) {
      if (allPlayMusic[j].detail.id === hotSongObj.detail.id) {
        allPlayMusic.splice(j, 1)
        break
      }
    }
    store.state.playMusic.push(hotSongObj)
    store.state.allPlayMusic.push(hotSongObj)
    // console.log(store.state.allPlayMusic)
  },
  showAudio ({commit}, data) {
    commit('SHOW_AUDIO', data)
  },
  tabBarShow ({commit}, data) {
    commit('TAB_BAR_SHOW', data)
  },
  showPlayer ({commit}, data) {
    commit('SHOW_PLAYER', data)
  }
}
