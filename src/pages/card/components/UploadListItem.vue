<template>
  <div class="upload-list-item">
    <!-- 头像 -->
    <div class="face-image">
      <img :src="cardContentDataItem.post.userIcon">
    </div>
    <!-- 动态正文 -->
    <div class="text-inf">
      <h4>{{cardContentDataItem.post.userName}}</h4>
      <pre v-text="cardContentDataItem.post.content"></pre>
      <div class="createDate">{{createDate}}</div>
      <div
        @click="listItemClick({name: cardContentDataItem.post.userName, postId: cardContentDataItem.post.id})"
        class="reply"></div>
      <div class="upload-file">
        <div v-if="downloaddata" class="download">
          <span>[{{downloaddata.name}}]</span>  <a :href="downloaddata.url" target="_blank">点击下载</a>
        </div>
        <div v-if="videoData">
          <video :src="videoData" width="400" controls="controls"></video>
        </div>
        <ul v-if="images" :class="imageWidthClass">
          <li v-for="(item, index) in images" :key="index" ref='mask' @click="imageClick(index)">
            <img v-if="imageWidthClass.imageWidthin1" :src="item">
            <div v-if="!imageWidthClass.imageWidthin1" class="imgbox" :style="{backgroundImage:'url(' + item + ')'}">{{item}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 动态评论 -->
    <ul class="text-comments" v-if="cardContentDataItem.replie">
      <li
        v-for="item in cardContentDataItem.replie"
        :key="item.id"
        @click="listItemClick({name: item.user.name, postId: cardContentDataItem.post.id, replyId: item.id, userId: item.user.id})">
        <span class="username">{{item.user.name}}</span>
        <span v-if="item.beReturnUser"> 回复 </span>
        <span v-if="item.beReturnUser" class="username">{{item.beReturnUser.name}}</span>
        : <!-- <span v-html="emoji(item.content)"></span> --><span v-text="item.content"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import {eventBus} from '@/util/eventBus.js'
export default {
  name: 'upload-list-item',
  props: ['cardContentDataItem'],
  data () {
    return {
    }
  },
  methods: {
    listItemClick (args) {
      if (args.userId && (args.userId === window.localStorage.userId)) {
        return
      }
      this.$emit('listItemClick', args)
    },
    imageClick (index) {
      // this.$refs.mask.style.height = document.getElementById('app').clientHeight + 'px'
      eventBus.$emit('showImage', {imageList: this.images, index})
    }
  },
  computed: {
    createDate () {
      var now = new Date()
      var createDate = new Date(this.cardContentDataItem.post.createDate)
      var showDate = this.cardContentDataItem.post.createDate.slice(0, 10)
      var timeDifference = Math.floor((now.getTime() - createDate.getTime()) / (60 * 1000))
      return timeDifference < 1 ? '刚刚' : timeDifference < 60 ? timeDifference.toString() + '分钟前' : timeDifference / 60 < 24 ? Math.floor(timeDifference / 60).toString() + '小时前' : timeDifference / (60 * 24) < 2 ? Math.floor(timeDifference / (60 * 24)).toString() + '天前' : showDate
    },
    images () {
      return this.cardContentDataItem.post.imageURLs ? JSON.parse(this.cardContentDataItem.post.imageURLs) : false
    },
    imageWidthClass () {
      let imageClass = {}
      imageClass.imageWidthin1 = this.images.length === 1
      imageClass.imageWidthin4 = this.images.length < 5 && this.images.length > 1
      imageClass.imageWidthin9 = this.images.length >= 5
      return imageClass
    },
    file () {
      return this.cardContentDataItem.post.fileURL ? {
        name: this.cardContentDataItem.post.fileName,
        url: this.cardContentDataItem.post.fileURL
      } : false
    },
    video () {
      return this.cardContentDataItem.post.videoURL ? {
        name: this.cardContentDataItem.post.fileName,
        url: this.cardContentDataItem.post.videoURL
      } : false
    },
    downloaddata () {
      return this.file ? this.file : false
    },
    videoData () {
      return this.video ? this.video.url : false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .upload-list-item
    width: 675px
    margin: 0 auto
    padding: 22px 0 22px 60px
    border-bottom: 1px solid #ccc
    position: relative
    // 头像样式开始
    .face-image
      width: 45px
      height: 45px
      position: absolute
      left: 0
      img
        width: 100%
        height: 100%
    // 动态正文样式开始
    .text-inf
      position: relative
      padding-bottom: 20px
      min-height:50px
      // 用户名字
      h4
        font-size: 17px
        color: #095680
      // 正文的文字部分
      pre
        max-width: 514px
        padding: 10px 0
        font-size: 13px
        color: #666
        white-space: pre-wrap
        word-break:break-all
      // 朋友圈右边显示的时候
      .createDate
        position: absolute
        right: 25px
        bottom: 40px
        color: #666
        font-size: 12px
      // 回复按钮
      .reply
        position: absolute
        bottom: 0
        right: 45px
        width: 33px
        height: 18px
        background: url('../../../../static/cardImage/commentIcon.png')
        background-size: 33px 18px
      // 动态附带的文件样式
      .upload-file
        width: 514px
        line-height: 35px
        font-size: 14px
        .download
          a
            color: #FFA500
            text-decoration: underline
          span
            padding: 10px 0
            font-size: 13px
            color: #15a1e9
        .imageWidthin1
          li
            img
              max-width: 500px
              max-height 400px
        .imageWidthin4, .imageWidthin9
          font-size: 0
          li
            width: 120px
            height: 120px
            display: inline-block
            margin-right: 10px
            margin-bottom 10px
            overflow: hidden
            vertical-align middle
            .imgbox
              width: 100%
              padding-bottom: 100%
              background-position: center center
              background-repeat: no-repeat
              background-size:cover
        .imageWidthin4
          width: 300px
        .imageWidthin9
          width: 400px
    // 动态评论样式开始
    .text-comments
      width: 514px
      padding: 7px 15px
      margin-top: 16px
      background: #eee
      font-size: 13px
      color: #333
      position: relative
      &:after
        content ''
        display: block
        position: absolute
        width: 28px
        height: 14px
        background: url('../../../../static/cardImage/UploadListItemBg.png')
        top: -10px
      li
        line-height: 21px
        word-break: break-all
        .username
          color: #14a1e8
</style>
