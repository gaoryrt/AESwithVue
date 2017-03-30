<template>
  <div class="encryption hack container">
    <h1>Encryption Process</h1>
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
          @click="$router.push('/subbyte')"
        >SubBytes</div>
      </div>
    </div>
    <div class="grid">
      <div class="left"></div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('ShiftRows')"
        >ShiftRows</div>
      </div>
    </div>
    <div class="grid">
      <div class="left"></div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('MixColumns')"
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
          @click="$router.push('/subbyte')"
        >SubBytes</div>
      </div>
    </div>
    <div class="grid">
      <div class="left"></div>
      <div class="right">
        <div
          class="btn btn-default"
          @click="$router.push('ShiftRows')"
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
