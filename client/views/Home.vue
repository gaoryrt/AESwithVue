<template>
  <div class="hack container">
    <h1>AES online</h1>
    <div class="grid">
      <div class="cell -6of12 card">
        <header class="card-header">明文</header>
        <div class="card-content inner">
          <form class="form">
            <fieldset class="form-group">
              <label>字符串明文：</label>
              <input
              class="form-control"
              v-model="plaintext"
              @keyup="textinputKeyup($event.target.value)"
              placeholder="在这里输入需要加密的明文">
            </fieldset>
          </form>
          <p>按字节预览明文：</p>
          <div class="hex--container">
            <div class="hex--hex"
              v-for="hex in plaintextArr">
              <p>0x{{hex.toString(16)}}</p>
            </div>
          </div>
          <p>按数组预览明文：{{plaintextArr}}</p>
        </div>
      </div>
      <div class="cell -6of12 card">
        <header class="card-header">密钥</header>
        <div class="card-content inner">
          <p>按字节输入密钥（不用加0x）：</p>
          <div class="hex--container">
            <div class="hex--hex" v-for="(_, index) in cipherkey">
              <input
                class="form-control"
                type="text"
                placeholder="ff"
                @keyup="cipherKeyup(index, $event.target.value, $event)">
            </div>
          </div>
          <p>按数组预览密钥：{{cipherkey}}</p>
        </div>
      </div>
    </div>
    <div class="grid">
      <div class="cell -6of12 card">
        <header class="card-header">选项</header>
        <div class="card-content inner">
          <fieldset class="form-group">
              <label for="mode">加密模式：</label>
              <select id="mode" class="form-control" v-model="selectedmode">
                <option>ECB (电子密码本)</option>
                <option>CBC (分组连接)</option>
                <option>CFB (密码反馈)</option>
                <option>OFB (输出反馈)</option>
              </select>
            </fieldset>
          <fieldset class="form-group">
              <label for="keylen">密钥长度：</label>
              <select id="keylen" class="form-control" v-model="selectedkeylen">
                <option>128</option>
                <option>192</option>
                <option>256</option>
              </select>
            </fieldset>
        </div>
      </div>
      <div class="cell -6of12 go">
        <div class="btn btn-default btn-ghost" @click="clickGo">encrypt ↓</div>
        <div class="btn btn-default" @click="clickGo">decrypt ↑</div>
      </div>
    </div>
    <hr>
    <div class="grid">
      <div class="cell -12of12 card">
        <header class="card-header">密文</header>
        <div class="card-content inner">
          <fieldset class="form-group">
            <label for="username">密文：</label>
            <input
            class="form-control"
            v-model="encryptedHex"
            placeholder="密文将会显示在这里">
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
  .card {
    box-sizing: border-box;
  }
  .hex--container {
    display: flex;
    flex-flow: column wrap;
    align-content: flex-start;
    height: 20vh;
    position: relative;
    /*border: 1px solid #ccc;*/
    overflow-x: scroll;
    .hex--hex {
      height: 33%;
      width: 25%;
      flex: 0 0 25%;
      p {
        padding: 0;
        margin: 0;
        color: #888;
      }
    }
    .form-control {
      width: 50%;
    }
  }
  .hex--hex,
  .go {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<script>
import aesjs from 'aes-js'
import Multiselect from 'vue-multiselect'
export default {
  props: [],
  data() {
    return {
      plaintextArr: [110, 105, 99, 101, 32, 116, 111, 32, 109, 101, 101, 116, 32, 121, 111, 117],
      plaintext: 'nice to meet you',
      cipherkey: new Array(16).fill(255),
      selectedmode: 'ECB (电子密码本)',
      selectedkeylen: '128',
      encryptedBytes: ''
    }
  },
  components: {
    Multiselect
  },
  methods: {
    textinputKeyup(value) {
      this.plaintextArr = Array.from(aesjs.utils.utf8.toBytes(value))
    },
    cipherKeyup(index, value, event) {
      const num = aesjs.utils.hex.toBytes(value)[0]
      if (num < 256) this.$set(this.cipherkey, index, num)
    },
    clickGo() {
      if (this.selectedmode == 'ECB (电子密码本)') {
        const aesEcb = new aesjs.ModeOfOperation.ecb(this.cipherkey)
        this.encryptedBytes = aesEcb.encrypt(this.plaintextArr)
      }
    }
  },
  computed: {
    encryptedHex() {
      return aesjs.utils.hex.fromBytes(this.encryptedBytes)
    }
  },
  watch: {
    selectedkeylen: function(newLen) {
      console.log(newLen, this.cipherkey);
      if (newLen == 128) this.cipherkey = new Array(16).fill(255)
      else if (newLen == 192) this.cipherkey = new Array(24).fill(255)
      else if (newLen == 256) this.cipherkey = new Array(32).fill(255)
      // switch (this.selectedkeylen) {
      //   case 256:
      //     this.cipherkey = new Array(32).fill(255)
      //     break
      //   case 192:
      //     this.cipherkey = new Array(24).fill(255)
      //     break
      //   default:
      //     this.cipherkey = new Array(16).fill(255)
      // }
    }
  },
  mounted() {

  }
}
</script>
