<template>
  <header class="pub-header">
    <span v-if="back=='true'" class="extend-click header-icon header-left" @click="goBack()"></span>
    <div class="header-content">
      {{headerTitle}}
      <slot></slot>
    </div>
  </header>
</template>
<script>
export default {
  props: ['headerTitle', 'back'],
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.pub-header{
  height: 4.5rem;
  line-height: 4.5rem;
  background-color: rgb(212,60,51);
  position: relative;
  text-align: center;
  z-index: 2;
  font-size: 1.6rem;
  font-weight: 700;
}
.header-content{
  position: absolute;
  left: 6rem;
  right: 6rem;
  color: white;
}
.header-icon{
  position: absolute;
  top: 0;
  width: 6rem;
  height: 4.4rem;
  background-repeat: no-repeat;
  -webkit-background-size: auto 2.5rem;
  background-size: auto 2.5rem;
  background-position: left center;
}
.header-left{
  background-image: url("./images/header-icon.png");
  left: .6rem;
}
</style>
