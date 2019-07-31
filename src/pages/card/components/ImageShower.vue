<template>
  <div
    v-show="isShowImage"
    class="imageShow"
    ref="imageShow"
    >
    <p @click.self="closeImageShow" class="imgbox">
      <img :src="currentImgUrl" ref="currentImg">
    </p>
    <div class="arrowLeft" @click="changeImage(-1)" v-if="imageList.length > 1"></div>
    <div class="arrowRight" @click="changeImage(1)" v-if="imageList.length > 1"></div>
  </div>
</template>

<script>
import {eventBus} from '@/util/eventBus.js'
export default {
  name: 'ImageShower',
  data () {
    return {
      imageList: [],
      isShowImage: false,
      currentIndex: 0
    }
  },
  methods: {
    changeHeight () {
      if (this.$refs.imageShow && this.$refs.currentImg) {
        let windowInnerHeight = window.innerHeight + 'px'
        this.$refs.imageShow.style.height = windowInnerHeight
        this.$refs.imageShow.style.lineHeight = windowInnerHeight
        this.$refs.currentImg.style.maxHeight = windowInnerHeight
        window.onresize = e => {
          let windowInnerHeight = window.innerHeight + 'px'
          this.$refs.imageShow.style.height = windowInnerHeight
          this.$refs.imageShow.style.lineHeight = windowInnerHeight
        }
      }
    },
    closeImageShow () {
      this.isShowImage = false
    },
    changeImage (offset) {
      if (offset === -1 && this.currentIndex === 0) {
        this.currentIndex = this.imageList.length - 1
        return
      }
      this.currentIndex = (this.currentIndex + offset) % this.imageList.length
    }
  },
  computed: {
    currentImgUrl () {
      return this.imageList[this.currentIndex]
    }
  },
  watch: {
    isShowImage (newval) {
      // console.log(newval)
      if (newval) {
        document.body.parentNode.style.overflow = 'hidden'
      } else {
        document.body.parentNode.style.overflow = 'auto'
      }
    }
  },
  mounted () {
    eventBus.$on('showImage', content => {
      this.currentIndex = content.index
      this.imageList = content.imageList
      this.isShowImage = true
      // console.log(content)
    })
    this.changeHeight()
  }
}
</script>

<style scoped lang="stylus">
  .imageShow
    position: fixed
    top: 0
    z-index: 1000
    background: rgba(0 0 0 0.5)
    width: 100%
    line-height: 100px
    .imgbox
      text-align: center
    p
      text-align: center
      img
        max-width: 650px;
        margin-top: 11%;
    .arrowLeft
      width: 50px
      height: 70px
      position: absolute
      left: 10px
      top: 50%
      background: url('../../../../static/images/arrowLeft.png') no-repeat 50% 50%
    .arrowRight
      width: 50px
      height: 70px
      position: absolute
      right: 10px
      top: 50%
      background: url('../../../../static/images/arrowRight.png') no-repeat 50% 50%
</style>
