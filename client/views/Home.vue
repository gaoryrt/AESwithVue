<template>
  <div class="home--container">
    <div class="home--cell">
      <div class="plaintext">
        <h1>明文</h1>
        <input
          v-model="plaintext"
          @keyup="textinputKeyup($event.target.value)"
          placeholder="在这里输入需要加密的明文">
        <div class="hex--container">
          <div class="hex--hex" v-for="hex in plaintextArr">
            {{hex.toString(16)}}
          </div>
        </div>
        {{plaintextArr}}
      </div>
    </div>
    <div class="home--cell">
      <div class="cipherkey">
        <h1>秘钥</h1>
        <div class="hex--container">
          <div class="hex--hex" v-for="(_, index) in cipherkey">
            <input
              type="text"
              placeholder="ff"
              @keyup="cipherKeyup(index, $event.target.value, $event)">
            </input>
          </div>
        </div>
        {{cipherkey}}
      </div>
      <div class="go">
        <div class="en--button" @click="clicken">encrypt</div>
      </div>
      <div class="moreopt">
        <h1>加密模式</h1>
        <multiselect
          v-model="selectedmode"
          :options="['ECB (电子密码本)', 'CBC (分组连接)', 'CFB (密码反馈)', 'OFB (输出反馈)']"
          :searchable="false"
          :close-on-select="false"
          :allow-empty="false"
          placeholder="请选择加密模式">
        </multiselect>
        <h1>密钥长度</h1>
        <multiselect
          v-model="selectedkeylen"
          :options="[ 128, 192, 256 ]"
          :searchable="false"
          :close-on-select="false"
          :allow-empty="false"
          @input="keylenSelected"
          placeholder="请选择密钥长度">
        </multiselect>
      </div>
    </div>
    <div class="home--cell">
      <div class="output">
        <h1>密文</h1>
        <!-- <div class="ciphertext"> -->
          <input type="text" v-model="encryptedHex">
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
  .home--container {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
  }
  .home--cell {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex: 1;
  }
  .plaintext,
  .cipherkey,
  .go,
  .moreopt,
  .output {
    padding: 10px 20px;
    flex: 0 0 33%;
    max-height: 300px;
    max-width: 300px;
  }
  input {
    width: 100%;
    box-sizing: border-box;
  }
  .hex--container {
    height: 120px;
    display: flex;
    flex-flow: column wrap;
    align-content: flex-start;
  }
  .hex--hex {
    box-sizing: border-box;
    border: 1px solid #ccc;
    line-height: 30px;
    text-align: center;
    height: 30px;
    width: 25%;
    flex: 0 0 25%;
  }
  .plaintext {
    .hex--hex {
      background: #efefef;
      border-radius: 5px;
    }
  }
  .cipherkey {
    max-width: 600px;
    .hex--hex {
      border: 0;
      width: 12.5%;
    }
    input {
      height: 100%;
    }
  }
  .ciphertext {
    padding: 10px 20px;
    box-sizing: border-box;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
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
