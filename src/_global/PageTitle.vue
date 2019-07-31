<template>
  <div class="index-title">
    <h1>{{titleIndex}}</h1>
  </div>
</template>

<script>
export default{
  name: 'page-title',
  props: {
    titleIndex: String
  }
}
</script>

<style lang="stylus" scoped>
  titleHeight = 65px
  .index-title
    font-size: 28px
    width: 178px
    h1
      height: titleHeight
      line-height: 90px
</style>
