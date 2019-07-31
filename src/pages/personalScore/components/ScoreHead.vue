<template>
  <div class="score-head">
    <div id="score-title">个人分数</div>
    <div  id='score-botton-list'>
      <!-- <div></div> -->
      <ul>
        <li class="g_button"><a href='javascript:;' @click="backBtn">返回</a></li>
      </ul>
      <!-- <div></div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'score-head',
  methods: {
    backBtn () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import '../../../assets/styles/varibles.styl'
  #score-title
    display inline-block
    width auto
    font-size 1.5rem
    margin 16px 0 0 25px
    border-bottom .4rem solid themeColor
    letter-spacing 2px

  #score-botton-list
    height: 50px
    margin:1rem 2.7rem
    border-bottom 5px solid themeColor
    overflow: hidden
    display: flex
    justify-content: flex-end
    align-items: flex-end

  #score-botton-list ul
    height: 44px
    // background: linear-gradient(to top,  rgb(20,161,213) 50%,  transparent 50%)
    display: flex
    justify-content: flex-end
    padding: 0 30px

  #score-botton-list>div:first-child
    width: 0
    height: 0
    border-color: rgb(20,161,213) transparent
    border-width: 0 0 22px 30px
    border-style: solid

  #score-botton-list>div:last-child
    width: 0
    height: 0
    border-color: rgb(20,161,213) transparent
    border-width: 0 30px 22px 0
    border-style: solid
</style>
