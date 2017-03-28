<template>
  <div class="hack container">
    <div class="grid">
      <div class="cell -6of12 plaintext card">
        <header class="card-header">明文</header>
        <div class="card-content inner">
          <form class="form">
            <fieldset class="form-group">
              <label for="username">输入明文：</label>
              <input
            class="form-control"
            v-model="plaintext"
            @keyup="textinputKeyup($event.target.value)"
            placeholder="在这里输入需要加密的明文">
            </fieldset>
          </form>
          <p>按字节预览明文：</p>
          <div class="hex--container">
            <div class="hex--hex" v-for="hex in plaintextArr">
              <p>{{hex.toString(16)}}</p>
            </div>
          </div>
          <p>按数组预览明文：{{plaintextArr}}</p>
        </div>
      </div>
      <div class="cell -6of12 cipherkey card">
        <header class="card-header">密钥</header>
        <div class="card-content inner">
          <p>按字节输入密钥：</p>
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
      <div class="cell -6of12 moreopt card">
        <header class="card-header">选项</header>
        <div class="card-content inner">
          <!-- <p>加密模式</p> -->
          <!-- <multiselect
            v-model="selectedmode"
            :options="['ECB (电子密码本)', 'CBC (分组连接)', 'CFB (密码反馈)', 'OFB (输出反馈)']"
            :searchable="false"
            :close-on-select="false"
            :allow-empty="false"
            placeholder="请选择加密模式">
          </multiselect> -->
          <fieldset class="form-group">
              <label for="mode">加密模式：</label>
              <select id="mode" class="form-control">
                <option>ECB (电子密码本)</option>
                <option>CBC (分组连接)</option>
                <option>CFB (密码反馈)</option>
                <option>OFB (输出反馈)</option>
              </select>
            </fieldset>
          <!-- <p>密钥长度</p>
          <multiselect
            v-model="selectedkeylen"
            :options="[ 128, 192, 256 ]"
            :searchable="false"
            :close-on-select="false"
            :allow-empty="false"
            @input="keylenSelected"
            placeholder="请选择密钥长度">
          </multiselect> -->
          <fieldset class="form-group">
              <label for="keylen">密钥长度：</label>
              <select id="keylen" class="form-control">
                <option>128</option>
                <option>192</option>
                <option>256</option>
              </select>
            </fieldset>
        </div>
      </div>
      <div class="cell -6of12 go">
        <div class="btn btn-primary" @click="clickGo">encrypt ↓</div>
        <div class="btn btn-primary btn-ghost" @click="clickGo">decrypt ↑</div>
      </div>
    </div>
    <div class="grid">
      <div class="cell -12of12 output card">
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
  .hex--container {
    display: flex;
    flex-flow: column wrap;
    align-content: flex-start;
    height: 20vh;
    position: relative;
    border: 1px solid #ccc;
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
      plaintextArr: [],
      plaintext: '',
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
    keylenSelected() {
      switch (this.selectedkeylen) {
        case 256:
          this.cipherkey = new Array(32).fill(255)
          break
        case 192:
          this.cipherkey = new Array(24).fill(255)
          break
        default:
          this.cipherkey = new Array(16).fill(255)
      }
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
  mounted() {

  }
}
</script>
