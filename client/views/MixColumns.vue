<template>
  <div class="container">
    <h1>MixColumns | 列混淆</h1>
    <div class="grid">
      <!-- 列混淆的定义 -->
      <div class="cell -6of12 card">
        <header class="card-header">列混淆的定义</header>
        <div class="card-container inner">
          <p>下面内容翻译自 <a href="http://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf">ADVANCED ENCRYPTION STANDARD [§5.1.3]</a>。</p>
          <p>对16字节状态块的列进行操作，每列当作一个四项多项式。<br>
          每一列与给定的多项式 <img :src="require('../assets/MixColumns(1).png')"> 乘模 <img :src="require('../assets/MixColumns(0).png')"> ，多项式 <img :src="require('../assets/MixColumns(1).png')"> 给出如下：<br>
          <img :src="require('../assets/MixColumns(2).png')"></p>
          <p>
          这可以被写作多项式乘法，<img :src="require('../assets/MixColumns(3).png')">：<br>
          <img :src="require('../assets/MixColumns(4).png')"> 其中 <img :src="require('../assets/MixColumns(5).png')"></p>
          <p>
          一列中四个字节多项式乘法的结果如下：<br>
          <img :src="require('../assets/MixColumns(6).png')"><br>
          <img :src="require('../assets/MixColumns(7).png')"><br>
          <img :src="require('../assets/MixColumns(8).png')"><br>
          <img :src="require('../assets/MixColumns(9).png')"><br>
          </p>
        </div>
      </div>
      <!-- 列混淆的实现 -->
      <div class="cell -6of12 card">
        <header class="card-header">列混淆的实现</header>
        <div class="card-container inner">
          <p>根据矩阵的乘法可知，在列混淆的过程中，每个字节对应的值只与该列的 4 个值有关系。此处的乘法和加法都是定义在 GF(28) 上的，需要注意如下几点：</p>
          <ul>
            <li>在GF(2^8)域上，a•{02} 结果就是将a的二进制位左移一位，如果a的最高位为 1（即 a >  128），则还需要将左移后的结果异或 0x011b</li>
            <li>在GF(2^8)域上，乘法对加法满足分配率，a•{03} 即为 a ^ a•{02}</li>
          </ul>
<pre>  // a•{02} 即为 b[n]
  // a•{03} 即为 a[n] ^ b[n]
  IF s[r][c]&amp;0x80
    b[r] = s[r][c]&lt;&lt;1 ^ 0x011b
  ELSE
    b[r] = s[r][c]&lt;&lt;1
  rtn[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]
  rtn[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]
  rtn[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]
  rtn[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]
</pre>
        </div>
      </div>
    </div>
    <p v-html="equation"></p>
    <hr>
    <div class="grid">
      <div class="cell -6of12 card">
        <header class="card-header">输入</header>
        <div class="card-container inner">
          <div class="hex--container">
            <div class="hex--column" v-for="(column, columnIndex) in input">
              <div
                :class="hexItemClass(columnIndex, itemIndex)"
                v-for="(item, itemIndex) in column">
                <input
                  class="form-control"
                  type="text"
                  :placeholder="input[columnIndex][itemIndex].toString(16)"
                  @keyup="inputKeyup(columnIndex, itemIndex, $event.target.value)">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cell -6of12 card cell--output">
        <header class="card-header">输出</header>
        <div class="card-container inner">
          <div class="hex--container">
            <div class="hex--column" v-for="(column, columnIndex) in input">
              <div
              :class="outputClass(columnIndex, itemIndex)"
              v-for="(item, itemIndex) in column"
              @click="itemClick(columnIndex, itemIndex)"
              >{{output[columnIndex][itemIndex].toString(16)}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
  .hex--column {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    height: 40px;
  }
  .hex--item {
    width: 100%;
    flex: 0 0 25%;
    color: #aaa;
  }
  img {
    max-width: 100%;
  }
  .eqation__0,
  .hex__0 input {
    border-bottom: 2px solid #f44336;
  }
  .eqation__1,
  .hex__1 input {
    border-bottom: 2px solid #ff9800;
  }
  .eqation__2,
  .hex__2 input {
    border-bottom: 2px solid #4caf50;
  }
  .eqation__3,
  .hex__3 input {
    border-bottom: 2px solid #2196f3;
  }
  .cell--output .hex--item {
    cursor: pointer;
  }
</style>

<script>
import aesjs from 'aes-js'
export default {
  props: [],
  data() {
    return {
      chosenColumn: -1,
      chosenItem: -1,
      input: [[0xd4, 0xe0, 0xb8, 0x1e],
              [0xbf, 0xb4, 0x41, 0x27],
              [0x5d, 0x52, 0x11, 0x98],
              [0x30, 0xae, 0xf1, 0xe5]],
      equation: '选择一个输出值'
    }
  },
  components: {

  },
  methods: {
    hexItemClass(column, item) {
      let rtn = 'hex--item'
      if (item == this.chosenItem) {
        switch (column) {
          case 0: rtn += ' hex__0'; break
          case 1: rtn += ' hex__1'; break
          case 2: rtn += ' hex__2'; break
          default: rtn += ' hex__3'
        }
      }
      return rtn
    },
    outputClass(column, item) {
      let rtn = 'hex--item'
      if (item == this.chosenItem && column == this.chosenColumn) {
        rtn += ' hex--chosen'
      }
      return rtn
    },
    itemClick(column, item) {
      this.chosenColumn = column
      this.chosenItem = item
      let output = `rtn[${column}][${item}] = `
      const b = x => {
        let bx = `&nbsp;&nbsp;b[${x}] = <span class="eqation__${x}">0x${this.input[x][item].toString(16)}</span> << 1 `
        if (this.input[x][item] & 0x80) {
          bx += `^ 0b11011 = 0b${(this.input[x][item] << 1 ^ 0x011b).toString(2)}<br>`
        } else {
          bx += `= 0b${(this.input[x][item] << 1 ^ 0x011b).toString(2)}<br>`
        }
        return bx
      }
      const a = x => {
        return `&nbsp;&nbsp;a[${x}] = <span class="eqation__${x}">0x${this.input[x][item].toString(16)}</span> = 0b${this.input[x][item].toString(2)}<br>`
      }
      switch (column) {
        case 0:
          output += 'b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3] & 0xff<br>'
          output +=  b(0) + a(1) + b(1) + a(2) + a(3)
          break
        case 1:
          output += `a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3] & 0xff<br>`
          output +=  a(0) + b(1) + a(2) + b(2) + a(3)
          break
        case 2:
          output += `a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3] & 0xff<br>`
          output +=  a(0) + a(1) + b(2) + a(3) + b(3)
          break
        default:
          output += `a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3] & 0xff<br>`
          output +=  a(0) + b(0) + a(1) + a(2) + b(3)
      }
      this.equation = output
    },
    inputKeyup(col, row, value) {
      const num = aesjs.utils.hex.toBytes(value)[0]
      const column = this.input[col]
      column[row] = value
      if (num < 256) this.$set(this.input, col, column)
    }
  },
  computed: {
    output() {
      const s = this.input
      let rtn = [[,,,],[,,,],[,,,],[,,,]]
      for (let c = 0; c < 4; c++) {
        const a = new Array(4)
        const b = new Array(4)
        for (let r = 0; r < 4; r++) {
          a[r] = s[r][c]
          // 乘2即为左移一位：在GF(2^8)域上，a•{02} 即为 'b'
          b[r] = s[r][c]&0x80 ? s[r][c]<<1 ^ 0x011b : s[r][c]<<1
        }
        // 乘法满足分配律：在GF(2^8)域上，a•{03} 即为 a[n] ^ b[n]
        // {02}•a0 + {03}•a1 + a2 + a3
        rtn[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]
        // a0 • {02}•a1 + {03}•a2 + a3
        rtn[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]
        // a0 + a1 + {02}•a2 + {03}•a3
        rtn[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]
        // {03}•a0 + a1 + a2 + {02}•a3
        rtn[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]
      }
      return rtn
    }
  },
  mounted() {

  },
  activated() {},
  deactivated() {}
}
</script>
