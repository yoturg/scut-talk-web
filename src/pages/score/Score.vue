<template>
  <div class='container'>
    <page-header :isSelect='true'></page-header>
    <page-body>
      <score-header :isShow='true'></score-header>
      <score-oper></score-oper>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import ScoreHeader from './components/ScoreHeader'
import ScoreOper from './components/ScoreOper'
export default {
  name: 'Score',
  components: {
    ScoreHeader,
    ScoreOper
  }
}
</script>

<style lang="stylus" scoped>
  .title-cell-class-name-test
    background-color: #14a1e9
    color: #fff
    font-size: 16px
</style>
