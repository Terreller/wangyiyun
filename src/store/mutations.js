export default {
  SET_PLAY_LIST (state, data) {
    state.playList = data
  },
  SET_NEW_MUSIC (state, data) {
    state.newMusic = data
  },
  PLAY_LIST_ID (state, data) {
    state.playListId = data
  },
  SHOW_AUDIO (state, data) {
    state.showAudio = data
  },
  TAB_BAR_SHOW (state, data) {
    state.tabBarShow = data
  },
  SHOW_PLAYER (state, data) {
    state.showPlayer = data
  }
}
