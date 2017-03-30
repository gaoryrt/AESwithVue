<template>
  <div class="container">
    <h1>ShiftRows | 行移位变换</h1>
    <p>对于输入的块，第一行保持不变。第二行循环左移一个字节。第三行循环左移两个字节。第四行循环左移三个字节。</p>
    <div class="grid">
      <div class="cell -6of12 card">
        <header class="card-header">输入</header>
        <div class="card-content inner">
          <div class="hex--container">
            <div
              :class="hexClass(index)"
              v-for="(_, index) in input">
              <input
                class="form-control"
                type="text"
                :placeholder="input[index].toString(16)"
                @click="inputclick(index)"
                @keyup="inputKeyup(index, $event.target.value)">
            </div>
          </div>
        </div>
      </div>
      <div class="cell -6of12 card">
        <header class="card-header">输出</header>
        <div class="card-content inner">
          <div class="hex--container">
            <div
              :class="outputClass(changedIndex)"
              v-for="(changedIndex, index) in output"
            ><p>{{input[changedIndex].toString(16)}}</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.hex--0 > p,
.hex--1 > p,
.hex--2 > p,
.hex--3 > p {
  text-align: center;
  line-height: 3;
  width: 50%;
}
.hex--0 input,
.hex--0 > p {
  border-bottom: 2px solid #f44336;
}
.hex--1 input,
.hex--1 > p {
  border-bottom: 2px solid #ff9800;
}
.hex--2 input,
.hex--2 > p {
  border-bottom: 2px solid #4caf50;
}
.hex--3 input,
.hex--3 > p {
  border-bottom: 2px solid #2196f3;
}
.shiftRows__hex--chosen > p {
  border: 2px solid #333;
}
</style>

<script>
import aesjs from 'aes-js'
export default {
  props: [],
  data() {
    return {
      input: [0x19, 0x3d, 0xe3, 0xbe,
              0xa0, 0xf4, 0xe2, 0x2b,
              0x9a, 0xc6, 0x8d, 0x2a,
              0xe9, 0xf8, 0x48, 0x08],
      output: [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11],
      chosen: -1
    }
  },
  components: {

  },
  methods: {
    inputclick(index) {
      this.chosen = index
      console.log(this.chosen);
    },
    inputKeyup(index, value) {
      const num = aesjs.utils.hex.toBytes(value)[0]
      if (num < 256) this.$set(this.input, index, num)
    },
    hexClass(index) {
      let rtn = 'hex--hex'
      switch (~~(index / 4)) {
        case 0: rtn += ' hex--0'; break
        case 1: rtn += ' hex--1'; break
        case 2: rtn += ' hex--2'; break
        default: rtn += ' hex--3'
      }
      return rtn
    },
    outputClass(index) {
      let rtn = this.hexClass(index)
      rtn += this.chosen == index ? ' shiftRows__hex--chosen' : ''
      return rtn
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
