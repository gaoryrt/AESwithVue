<template>
  <div class="encryption hack container">
    <h1>Encryption Process | 加密流程</h1>
    <p>在首轮执行 addRoundKey 。<br>
    接下来9轮执行四种不同的变换：Subbytes、ShiftRows、MixColumns、AddRoundKey。<br>
    最后一轮执行 Subbytes、ShiftRows、AddRoundKey。</p>
    <div class="grid">
      <div class="left">
        <h2>initial round</h2>
      </div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('AddRoundKey')"
        >AddRoundKey</div>
        ⊕
        <div
          class="btn btn-default btn-ghost"
          @click="$router.push('Expansion')"
        >Cipher Key</div>
      </div>
    </div>
    <hr>
    <div class="grid">
      <div class="left">
        <h2>9 main rounds</h2>
      </div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('/SubByte')"
        >SubBytes</div>
      </div>
    </div>
    <div class="grid">
      <div class="left"></div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('ShiftRow')"
        >ShiftRows</div>
      </div>
    </div>
    <div class="grid">
      <div class="left"></div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('MixColumn')"
        >MixColumns</div>
      </div>
    </div>
    <div class="grid">
      <div class="left"></div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('AddRoundKey')"
        >AddRoundKey</div>
        ⊕
        <div
          class="btn btn-default btn-ghost"
          @click="$router.push('Expansion')"
        >Round Key</div>
      </div>
    </div>
    <hr>
    <div class="grid">
      <div class="left">
        <h2>final round</h2>
      </div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('/SubByte')"
        >SubBytes</div>
      </div>
    </div>
    <div class="grid">
      <div class="left"></div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('ShiftRow')"
        >ShiftRows</div>
      </div>
    </div>
    <div class="grid">
      <div class="left"></div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('AddRoundKey')"
        >AddRoundKey</div>
        ⊕
        <div
          class="btn btn-default btn-ghost"
          @click="$router.push('Expansion')"
        >Round Key 10</div>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
  .left {
    flex: 0 0 20%;
  }
  .right {
    flex: 0 0 80%;
  }
</style>

<script>
// import 123 from '../components/123'
export default {
  props: [],
  data() {
    return {

    }
  },
  components: {

  },
  methods: {

  },
  computed: {

  },
  mounted() {

  },
  activated() {},
  deactivated() {}
}
</script>
