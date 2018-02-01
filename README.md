vue全家桶仿网易云音乐（实现歌单,听歌以及搜索功能）
启动注意事项

因为使用的别人的API,必须开启两个服务器,先开启API,否则无法获取到数据

把API文件夹全部放入本项目根目录下,在API文件夹根目录下API开启:

node app.js
技术栈

    vue+vue-router+vuex（vue全家桶）
    mint-ui（移动端组件库）
    axios（http请求）

功能分析与设计

首先我先参考了网易云APP的设计，然后决定做了歌单,听歌及搜索三个模块，本身主要以前端为主，后端代码并没有研究，这里要感谢这位同学写的API。

vue

路由结构如下

以下是组件

1.歌单部分： 数据主要由API提供，源码中有具体地址。

2.搜索部分： 通过绑定@keydown来绑定事件，实现实时查询。

mint-ui

实现功能: 1. 图片懒加载 2.无限滚动

具体请参考文档mint-ui

最后上几张效果图

码云项目地址：https://gitee.com/leiyu1314/wangyiyunMusic.git

需要改进的有很多，请大家可以多提提意见。后续我会不断改进，如果觉得还可以，请star，你们的star是我前进的动力。
鸣谢

此网站提供的API: https://github.com/Binaryify/NeteaseCloudMusicApi
