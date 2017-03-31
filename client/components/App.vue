<template>
  <div id="app">
    <div class="container btn-group--fixed">
      <button
        v-for="name in ['/Main', '/Process', '/SubByte', '/ShiftRow', '/MixColumn', '/AddRoundKey', '/Preview', '/Expansion']"
        :class="$route.path == name ? 'btn btn-default' : 'btn btn-default btn-ghost'"
        @click="$router.push(name)"
      >{{name.slice(1)}}</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang='scss'>
@media screen and (max-width: 768px) {
  .btn-group--fixed {
    position: fixed;
    top: 0;
    left: -1rem;
    overflow-x: scroll;
    width: calc(100% + 1rem);
    background: #fff;
    z-index: 99;
    display: flex;
    flex-flow: row nowrap;
    box-shadow: 0 0 1px 2px #333;
  }
}
#app {
  padding: 45px 0;
}
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
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.79;
  /*user-select: none;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
  text-rendering: optimizeLegibility;
  text-size-adjust: 100%;
  -webkit-touch-callout: none;
}
</style>
