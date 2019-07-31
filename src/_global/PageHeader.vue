<template>
  <div class="page-header">
    <div class="header-bg">
      <div class="header-title">
        <h1 @click="setUrl">TalkingLite</h1>
      </div>
      <div v-if="isSelect" class="sel">
        <page-select :isHideRed='hideRed'></page-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    isSelect: {
      type: Boolean,
      default: false
    },
    hideRed: {
      type: Boolean,
      default: false
    },
    urlPath: window.location.href
  },
  methods: {
    setUrl () {
      var getRouteName = this.$route.name
      if (getRouteName === 'Home' || getRouteName === '') {
        window.location.reload()
      } else {
        this.$router.push({path: '/home'})
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../assets/styles/varibles.styl'
  bodyWidth = 1080px
  headerHeight = 75px
  .page-header
    height: headerHeight
    width: 100%
    background: themeColor
    position fixed
    top 0
    z-index 999
    .header-bg
      height: 100%
      width: bodyWidth
      margin: 0 auto
      background-color: themeColor
      // background-color: #14a1e9
      // background: url('../../static/images/header-bg.png')
      background-repeat: no-repeat
      background-size: 100% 100%
      .header-title
        float: left
        h1
          font-family: "Microsoft YaHei"
          font-size: 33px
          height: headerHeight
          line-height: headerHeight
          padding-left: 22px
          color: #ffffff
          cursor:pointer
      .sel
        float: right
        margin-top: 22px
        margin-right: 45px
        z-index: 1000
</style>
