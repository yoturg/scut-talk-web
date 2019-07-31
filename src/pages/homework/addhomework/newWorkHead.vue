<template>
  <div class="newWork-head">
    <div class="title">作业题目</div>
    <div class="operation">{{title}}</div>
  </div>
</template>

<script>
export default {
  props: ['title', 'opeType']
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/styles/varibles.styl'
.newWork-head
  width: 96%
  padding-bottom: 10px
  margin: 0px auto
  .title
    width: 130px
    height: 55px
    line-height: 55px
    font-size: 25px
    border-bottom: 5px solid themeColor
  .operation
    margin-top: 20px
    margin-left: 20px
    margin-right: 20px
    padding-bottom: 5px
    border-bottom: 2px solid #b9bcbd
</style>
