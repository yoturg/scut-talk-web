<template>
  <div class="container">
    <page-header :isSelect="true"></page-header>
    <page-body>
      <score-head></score-head>
      <score-search></score-search>
      <div class='group-content'>
        <score-data></score-data>
      </div>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import ScoreHead from './components/ScoreHead'
import ScoreSearch from './components/ScoreSearch'
import ScoreData from './components/ScoreData'
export default {
  name: 'PersonalScore',
  components: {
    ScoreHead,
    ScoreSearch,
    ScoreData
  }
}
</script>

<style lang="stylus" scoped>
  .container
    width: 100%
    height: 100%
    background: #f4f4f4
    .group-content
      width: 93%
      margin:auto
</style>
