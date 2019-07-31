<template>
  <div class="page-body">
    <slot></slot>
  </div>
</template>

<script>
export default{
  name: 'page-body'
}
</script>

<style lang="stylus" scoped>
  bodyWidth = 1080px
  .page-body
    width: bodyWidth
    height: 820px
    margin: 0 auto
    position: relative
    background: #f4f4f4
    margin-bottom: 45px
    margin-top: 90px
</style>
