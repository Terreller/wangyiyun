<template>
  <div class="header">
    <div class="main">
      <div class="logo"></div>
      <router-link to="/search">
        <i class="iconfont icon-sousuo icon"></i>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less" scoped>
.header{
  width: 100%;
  height: 5rem;
  background-color: rgb(212,60,51);
  position: fixed;
  z-index: 2;
}
.main{
  width: 100%;
  height: 100%;
}
.logo{
  width: 15rem;
  height: 100%;
  background: url('./images/logo1.png') no-repeat 0 center, url('./images/logo2.png') no-repeat 3rem center;
  background-size: 35% 50%, 85% 70%;
}
.icon{
  color: white;
  position: absolute;
  top: 1.5rem;
  right: 1rem;
}
</style>
