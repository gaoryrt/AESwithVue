<template>
  <div class="hack container">
    <h1>AES online</h1>
    <div class="grid">
      <div class="cell -6of12 card">
        <header class="card-header">明文</header>
        <div class="card-content inner">
          <form class="form">
            <fieldset :class="plaintextClass">
              <label>字符串明文：</label>
              <input
              class="form-control"
              v-model="plaintext"
              @keyup="textinputKeyup($event.target.value)"
              placeholder="在这里输入需要加密的明文">
              <div class="help-block" v-show="hint.length">{{hint}}</div>
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
          <transition name="fade">
            <fieldset class="form-group" v-show="selectedmode=='CFB (密码反馈)'">
              <label for="segment">单次加密长度：</label>
              <select id="segment" class="form-control" v-model="segment">
                <option v-for="num in divisor">{{num}}</option>
              </select>
            </fieldset>
          </transition>
        </div>
        <transition name="fade">
          <div class="card-content inner" v-show="selectedmode!='ECB (电子密码本)'">
            <p>按字节输入初始化向量（不用加0x）：</p>
            <div class="hex--container">
              <div class="hex--hex" v-for="(_, index) in iVector">
                <input
                  class="form-control"
                  type="text"
                  placeholder="00"
                  @keyup="iVectorKeyup(index, $event.target.value, $event)">
              </div>
            </div>
            <p>按数组预览初始化向量：{{iVector}}</p>
          </div>
        </transition>
      </div>
      <div class="cell -6of12 go">
        <div :class="encryptClass" @click="clickEncrypt">encrypt ↓</div>
        <div class="btn btn-default" @click="clickDecrypt">decrypt ↑</div>
      </div>
    </div>
    <hr>
    <div class="grid">
      <div class="cell -12of12 card">
        <header class="card-header">密文</header>
        <div class="card-content inner">
          <fieldset class="form-group">
            <label for="username">字符串密文：</label>
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
  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
    height: 0;
  }
  .card {
    box-sizing: border-box;
    margin-bottom: 20px;
  }
  .hex--container {
    display: flex;
    flex-flow: column wrap;
    align-content: flex-start;
    height: 18vh;
    position: relative;
    overflow-x: scroll;
    .hex--hex {
      width: 25%;
      flex: 0 0 25%;
      p {
        padding: 0;
        margin: 0;
        color: #aaa;
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
      iVector: new Array(16).fill(0),
      cipherkey: new Array(16).fill(255),
      selectedmode: 'ECB (电子密码本)',
      selectedkeylen: '128',
      encryptedBytes: '',
      segment: 1
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
    iVectorKeyup(index, value, event) {
      const num = aesjs.utils.hex.toBytes(value)[0]
      if (num < 256) this.$set(this.iVector, index, num)
    },
    clickEncrypt() {
      if (this.selectedmode == 'ECB (电子密码本)') {
        const aesEcb = new aesjs.ModeOfOperation.ecb(this.cipherkey)
        this.encryptedBytes = aesEcb.encrypt(this.plaintextArr)
      }
      if (this.selectedmode == 'CBC (分组连接)') {
        const aesCbc = new aesjs.ModeOfOperation.cbc(this.cipherkey, this.iVector)
        this.encryptedBytes = aesCbc.encrypt(this.plaintextArr)
      }
      if (this.selectedmode == 'CFB (密码反馈)') {
        const aesCfb = new aesjs.ModeOfOperation.cfb(this.cipherkey, this.iVector, this.segment)
        this.encryptedBytes = aesCfb.encrypt(this.plaintextArr)
      }
      if (this.selectedmode == 'OFB (输出反馈)') {
        const aesOfb = new aesjs.ModeOfOperation.ofb(this.cipherkey, this.iVector)
        this.encryptedBytes = aesOfb.encrypt(this.plaintextArr)
      }
    },
    clickDecrypt() {
      var encryptedBytes = aesjs.utils.hex.toBytes(this.encryptedHex)
      if (this.selectedmode == 'ECB (电子密码本)') {
        const aesEcb = new aesjs.ModeOfOperation.ecb(this.cipherkey)
        this.plaintextArr = Array.from(aesEcb.decrypt(encryptedBytes))
      }
      if (this.selectedmode == 'CBC (分组连接)') {
        const aesCbc = new aesjs.ModeOfOperation.cbc(this.cipherkey, this.iVector)
        this.plaintextArr = Array.from(aesCbc.decrypt(encryptedBytes))
      }
      if (this.selectedmode == 'CFB (密码反馈)') {
        const aesCfb = new aesjs.ModeOfOperation.cfb(this.cipherkey, this.iVector, this.segment)
        this.plaintextArr = Array.from(aesCfb.decrypt(encryptedBytes))
      }
      if (this.selectedmode == 'OFB (输出反馈)') {
        const aesOfb = new aesjs.ModeOfOperation.ofb(this.cipherkey, this.iVector)
        this.plaintextArr = Array.from(aesOfb.decrypt(encryptedBytes))
      }
      this.plaintext = aesjs.utils.utf8.fromBytes(this.plaintextArr)
    }
  },
  computed: {
    encryptedHex: {
      get() {
        return aesjs.utils.hex.fromBytes(this.encryptedBytes)
      },
      set(encryptedHex) {
        this.encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
      }
    },
    divisor() {
      const len = this.plaintextArr.length
      const rtn = [1]
      for (let i = 2; i <= len / 2; i++) {
        if (len % i == 0) rtn.push(i)
      }
      if(len != 1) rtn.push(len)
      return rtn
    },
    hint() {
      const len = this.plaintextArr.length
      if (this.selectedmode == 'ECB (电子密码本)' && len != 16) {
        return 'ECB 要求明文长度必须为 16 字节'
      } else if (this.selectedmode == 'CBC (分组连接)' && len % 16 != 0) {
        return 'CBC 明文长度必须为 16 字节的整数倍'
      } else if (this.selectedmode == 'CFB (密码反馈)' && len % this.segment != 0) {
        return 'CFB 明文长度必须为单次加密长度的整数倍'
      } else {
        return ''
      }
    },
    plaintextClass() {
      if (this.hint.length) {
        return 'form-group form-error'
      } else {
        return 'form-group'
      }
    },
    encryptClass() {
      if (this.hint.length) {
        return 'btn btn-error btn-ghost'
      } else {
        return 'btn btn-default btn-ghost'
      }
    }
  },
  watch: {
    selectedkeylen: function(newLen) {
      if (newLen == 128) this.cipherkey = new Array(16).fill(255)
      else if (newLen == 192) this.cipherkey = new Array(24).fill(255)
      else if (newLen == 256) this.cipherkey = new Array(32).fill(255)
    }
  },
  mounted() {

  }
}
</script>
