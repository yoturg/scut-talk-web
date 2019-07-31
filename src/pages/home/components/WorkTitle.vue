<template>
  <div class="work-title">
    <span>未参加的作业题目</span>
  </div>
</template>

<script>
export default {
  name: 'work-title'
}
</script>

<style lang="stylus" scoped>
  @import '../../../assets/styles/varibles.styl'
  .work-title
    font-size 20px
    margin 70px 0 20px 2.9rem
    span
      display inline-block
      border-bottom 0.2rem solid themeColor
      padding-bottom 5px
</style>
