<template>
  <div class="page-footer">
    <div class="footer-bg">
      <div class="footer-aboutus"><a href="#">关于我们</a></div>
      <div class="footer-copyright"><p>粤ICP备15065401号-1&nbsp;Copyright&nbsp;2018&nbsp;广州市铠宁信息科技有限公司</p></div>
      <!-- <div class="footer-feedback"><a href="#">意见反馈</a></div> -->
    </div>
  </div>
</template>

<script>
export default{
  name: 'page-footer'
}
</script>

<style lang="stylus" scoped>
  @import '../assets/styles/varibles.styl'
  bodyWidth = 1080px
  headerHeight = 45px
  .page-footer
    width: 100%
    height: headerHeight
    // background: #14a1e9
    background: themeColor
    color: #fffeff
    position: fixed
    bottom: 0
    z-index: 999
    .footer-bg
      font-size 13px
      width: bodyWidth
      height: 100%
      margin: 0 auto
      bakcground: themeColor
      // background-color: #14a1e9
      // background: url('../../static/images/footer-bg.png')
      background-repeat: no-repeat
      background-size: 100% 100%
      .footer-aboutus
        float: left
        height: headerHeight
        line-height: headerHeight
        margin-left: 22px
        font-size: 13px
        a
          color: #fffeff
      .footer-copyright
        float: left
        height: headerHeight
        line-height: headerHeight
        margin-left: 75px
      .footer-feedback
        float: right
        height: headerHeight
        line-height: headerHeight
        // margin-left: 405px
        margin-right 20px
        a
          color: #fffeff
</style>
