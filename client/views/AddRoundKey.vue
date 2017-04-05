<template>
  <div class="container">
    <h1>addRoundKey | 轮密钥加</h1>
    <p>轮密钥与状态块进行对应位上的异或运算。</p>
    <div class="grid">
      <div class="cell -6of12 card">
        <header class="card-header">状态块</header>
        <div class="card-content inner">
          <div class="hex--container">
            <div
              :class="hexClass(index - 1)"
              v-for="index in 16"
              @click="clickHex(index - 1)"
            ><p>{{state[index - 1].toString(16)}}</p></div>
          </div>
        </div>
      </div>
      <div class="cell -6of12 card">
        <header class="card-header">扩展密钥块</header>
        <div class="card-content inner">
          <div class="hex--container">
            <div
              :class="hexClass(index - 1)"
              v-for="index in 16"
              @click="clickHex(index - 1)"
            ><p>{{roundKey[index - 1].toString(16)}}</p></div>
          </div>
        </div>
      </div>
      <div class="cell -6of12 card">
        <header class="card-header">输出</header>
        <div class="card-content inner">
          <div class="hex--container">
            <div
              :class="hexClass(index - 1)"
              v-for="index in 16"
              @click="clickHex(index - 1)"
            ><p>{{(roundKey[index - 1] ^ state[index - 1]).toString(16)}}</p></div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <p v-html="display"></p>
  </div>
</template>

<style lang='scss'>

</style>

<script>
// import 123 from '../components/123'
export default {
  props: [],
  data() {
    return {
      display: '选择一个位',
      chosen: -1,
      state: [0x04, 0x66, 0x81, 0xe5,
              0xe0, 0xcb, 0x19, 0x9a,
              0x48, 0xf8, 0xd3, 0x7a,
              0x28, 0x06, 0x26, 0x4c],
      roundKey: [0xa0, 0xfa, 0xfe, 0x17,
              0x88, 0x54, 0x2c, 0xb1,
              0x23, 0xa3, 0x39, 0x39,
              0x2a, 0x6c, 0x76, 0x05]
    }
  },
  components: {

  },
  methods: {
    hexClass(index) {
      let rtn = 'hex--hex'
      if (index == this.chosen) {
        rtn += ' hex--chosen'
      }
      return rtn
    },
    clickHex(index) {
      this.chosen = index
      this.display = `0x${this.state[index].toString(16)} ⊕ 0x${this.roundKey[index].toString(16)} = 0x${(this.state[index] ^ this.roundKey[index]).toString(16)}<br>`
      this.display += `0b${this.state[index].toString(2)} ⊕ 0b${this.roundKey[index].toString(2)} = 0b${(this.state[index] ^ this.roundKey[index]).toString(2)}<br>`
    }
  },
  computed: {

  },
  mounted() {

  },
  activated() {},
  deactivated() {}
}
</script>
