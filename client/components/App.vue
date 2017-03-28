<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang='scss'>
@mixin font-dpr($font-size) {
  font-size: $font-size;
  [data-dpr='2'] & {
    font-size: $font-size * 2;
  }
  [data-dpr='3'] & {
    font-size: $font-size * 3;
  }
}

body {
  /*在大屏上看到更多文本*/
  @include font-dpr(14px);
  overflow-x: hidden;
  overflow-y: scroll;
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Lantinghei SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", "STHeitiSC-Light", "simsun", "WenQuanYi Zen Hei", "WenQuanYi Micro Hei", Arial, sans-serif;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.79;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
  text-rendering: optimizeLegibility;
  text-size-adjust: 100%;
  -webkit-touch-callout: none;
  color: #35495e;
}
</style>
