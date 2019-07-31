<template>
  <div class='container'>
    <page-header :isSelect='true'></page-header>
    <page-body>
      <score-header :isShow='false'></score-header>
      <score-rule-oper></score-rule-oper>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import ScoreHeader from './components/ScoreHeader'
import ScoreRuleOper from './components/ScoreRuleOper'
export default {
  name: 'Score',
  components: {
    ScoreHeader,
    ScoreRuleOper
  }
}
</script>

<style lang="stylus" scoped>
  .title-cell-class-name-test
    background-color: #14a1e9
    color: #fff
    font-size: 16px
</style>
