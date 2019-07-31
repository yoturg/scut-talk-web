<template>
  <div class="card-content-body">
    <div class="upload-list">
      <!-- <happy-scroll color="rgba(102,102,102)" size="8" resize> -->
        <div>
          <upload-list-item
            v-for="item in cardContentData"
            :key="item.post.id"
            :cardContentDataItem="item"
            @listItemClick="listItemHandle"
          ></upload-list-item>
          <div class="nothingMone">
            —— 评论有底 学无止境 ——
          </div>
        </div>
      <!-- </happy-scroll> -->
    </div>

    <div class="card-content-body-upload-form">
      <emoji
        :isShowEmoji="isShowEmoji"
        @emojiClick="addEmoji"
        ></emoji>
      <div class="typelist">
        <ul>
          <!-- <li class="emojibutton" @click="changeEmojiState" ></li> -->
          <li class="imagebutton" :class="uploadStyle.image" @click="changeSelectFileState(true)"></li>
          <li class="filebutton" :class="uploadStyle.file" @click="changeSelectFileState(false)"></li>
        </ul>
        <div class="file-remind" v-if="isShowFileRemind">{{fileRemindValue}}</div>
        <div class="buttonlist">
          <button @click="restored" v-if="isShowCancel">取消</button>
          <button @click="isReply ? replyComment(): submitComment()">发表</button>
        </div>
      </div>
      <div class="textinput">
        <div class="remind">{{textareaHtml}}</div>
        <textarea
          ref="textArea"
          v-model="textareaValue"
          @click="isShowEmoji = false"
          ></textarea>
      </div>
      <div v-show="isShowFileUpload" class="select-file">
        <select-file
          v-if="firstCreate"
          :isUploadImage="isUploadImage"
          @Selected="fileSelected"
          @fileUploaded="commentWithFile"
          @imageUploaded="commentWithImage"></select-file>
      </div>
    </div>
  </div>
</template>

<script>
import UploadListItem from './UploadListItem'
import SelectFile from './SelectFile'

import Emoji from './Emoji'
export default {
  name: 'CardContentBody',
  components: {
    UploadListItem,
    Emoji,
    SelectFile
  },
  props: {
    cardContentData: {
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      firstCreate: false,
      isShowEmoji: false,
      isShowCancel: false,
      isShowFileUpload: false,
      isUploadImage: true,
      isReply: false,
      isShowFileRemind: false,
      isUploading: false,
      isSubmit: false,
      fileRemindValue: '',
      fileRemindTemp: '',
      textareaValue: '',
      textareaType: '',
      textareaHtml: '发表动态：',
      filelink: '',
      replyData: {},
      uploadStyle: {image: {'imagebutton-active': false}, file: {'filebutton-active': false}}
    }
  },
  methods: {
    // 是否显示emoji组件
    changeEmojiState () {
      if (window.localStorage.groupState === '已完成') {
        alert('作业已经提交')
        return
      }
      if (window.localStorage.groupState === '未完成') {
        alert('题目已过截止时间，无法操作')
        return
      }
      this.isShowEmoji = !this.isShowEmoji
      if (this.isShowEmoji) {
        this.isShowFileUpload = false
      }
      this.restored()
    },
    // 是否显示文件上传框组件
    changeSelectFileState (isUploadImage) {
      if (this.$refs.textArea.disabled === true) {
        return
      }
      if (window.localStorage.groupState === '已完成') {
        alert('作业已经提交')
        return
      }
      if (window.localStorage.groupState === '未完成') {
        alert('题目已过截止时间，无法操作')
        return
      }
      if (!this.firstCreate) {
        this.firstCreate = true
      }
      if (this.isUploadImage !== isUploadImage) {
        this.isShowFileUpload = false
        this.isUploadImage = isUploadImage
      }
      // 改变上传框的状态，并同步取消按钮
      this.isShowFileUpload = !this.isShowFileUpload
      this.isShowCancel = this.isShowFileUpload
      this.uploadStyle.image['imagebutton-active'] = this.isUploadImage && this.isShowFileUpload
      this.uploadStyle.file['filebutton-active'] = !this.isUploadImage && this.isShowFileUpload
      // 文件上传框显示的时候关闭表情
      if (this.isShowFileUpload) {
        this.isShowEmoji = false
      }
    },
    fileSelected (args) {
      this.isUploading = true
      if (args.isImg) {
        this.isShowFileRemind = true
        this.fileRemindValue = `已经选择${args.num}张图片`
        this.isShowCancel = true
        this.isShowFileUpload = false
        // this.heddenUpload = true
        this.textareaHtml = '图片动态：'
      } else {
        this.isShowFileRemind = true
        this.fileRemindValue = '已选择1个文件'
        this.isShowCancel = true
        this.isShowFileUpload = false
        this.textareaHtml = '文件动态：'
      }
      this.fileRemindTemp = this.fileRemindValue + '(上传中)'
    },
    restored () {
      this.isReply = false
      this.isShowCancel = false
      this.isShowEmoji = false
      this.isShowFileUpload = false
      this.isShowFileRemind = false
      this.isSubmit = false
      this.firstCreate = false
      this.isUploading = false
      this.$refs.textArea.disabled = false
      this.uploadStyle.file['filebutton-active'] = false
      this.uploadStyle.image['imagebutton-active'] = false
      this.filelink = ''
      this.fileRemindValue = ''
      this.textareaValue = ''
      this.replyData = {}
      this.textareaHtml = '发表动态：'
    },

    // 回复朋友圈的评论的文字提示
    listItemHandle (args) {
      this.replyData = args
      this.isReply = true
      this.isShowCancel = true
      this.textareaHtml = '回复' + args.name + ':'
    },
    // 选中表情，添加到文字中
    addEmoji (emoji) {
      this.isShowEmoji = false
      this.textareaValue += emoji
    },
    // 发布图片动态的处理
    commentWithImage (args) {
      // console.log(args)
      if (this.isUploading) {
        this.uploadStyle.image['imagebutton-active'] = false
        this.isUploading = false
        this.isShowFileRemind = true
        this.fileRemindValue = `已经选择${args.length}张图片`
        this.isShowCancel = true
        this.isShowFileUpload = false
        this.textareaHtml = '图片动态：'
        this.filelink = JSON.stringify(args)
        if (this.isSubmit) {
          this.submitComment()
        }
      }
    },
    commentWithFile (args) {
      if (this.isUploading) {
        this.uploadStyle.file['filebutton-active'] = false
        this.isUploading = false
        this.isShowFileRemind = true
        this.fileRemindValue = '已选择1个文件'
        this.isShowCancel = true
        this.isShowFileUpload = false
        this.textareaHtml = '文件动态：'
        this.filelink = args.URL
        if (this.isSubmit) {
          this.submitComment()
        }
      }
    },
    replyComment () {
      if (window.localStorage.groupState === '已完成') {
        alert('作业已经提交')
        return
      }
      if (window.localStorage.groupState === '未完成') {
        alert('题目已过截止时间，无法操作')
        return
      }
      if (this.textareaValue == null || this.textareaValue.length === 0) {
        alert('请输入评论内容')
      } else {
        let data = new FormData()
        data.append('content', this.textareaValue)
        if (this.replyData !== {}) {
          data.append('postId', this.replyData.postId)
          if (this.replyData.replyId) {
            data.append('replyId', this.replyData.replyId)
          }
        }
        data.append('userId', window.localStorage.userId)
        data.append('userkey', localStorage.userkey)
        // console.log('上传的内容1：' + JSON.stringify(data))
        this.axios.post('/Martell/a/team/replieAPI/interface/addNewReplie', data, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => {
          // console.log(response)
          if (Number(response.data.statusCode) === 200) {
            // 请求父组件刷新
            this.$emit('addSuccess')
            // 恢复到一切都没发生过的样子
            this.restored()
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            console.log('err:' + response)
            alert(response.data.message)
          }
        })
      }
    },
    // 评论
    submitComment () {
      // 判断文本框的内容是否为空
      if (window.localStorage.groupState === '已完成') {
        alert('作业已经提交')
        return
      }
      if (window.localStorage.groupState === '未完成') {
        alert('题目已过截止时间，无法操作')
        return
      }
      // console.log(window.localStorage.cardId)
      if (this.textareaValue == null || this.textareaValue.length === 0) {
        alert('请输入评论内容')
      } else {
        this.isSubmit = true
        if (this.isUploading) {
          // console.log(this.$refs.textArea)
          this.$refs.textArea.disabled = true
          this.fileRemindValue = this.fileRemindTemp
          return
        }
        let data = new FormData()
        if (window.localStorage.cardId) {
          data.append('cardId', window.localStorage.cardId)
        }
        if (window.localStorage.userId) {
          data.append('userId', window.localStorage.userId)
        }
        data.append('remarks', '')
        // console.log('内容2:' + this.textareaValue)
        data.append('content', this.textareaValue)
        // 当有文件时，添加文件的链接
        if (this.filelink !== '' && this.textareaHtml !== '发表动态：') {
          data.append('fileURL', this.filelink)
        }
        data.append('userkey', localStorage.userkey)
        // console.log('上传的内容2：' + JSON.stringify(data.get('fileURL')))
        this.axios.post('/Martell/a/team/postAPI/interface/addNewPost', data, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
          if (Number(response.data.statusCode) === 200) {
            // 请求父组件刷新
            this.$emit('addSuccess')
            // 恢复到一切都没发生过的样子
            this.filelink = ''
            this.restored()
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.restored()
            this.exit()
          } else {
            // console.log(response)
            alert(response.data.message)
            this.restored()
          }
        })
      }
    }
  },
  watch: {
    cardContentData () {
      this.textareaValue = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  listHeaderHeight = 55px
  cardBodyHeight = 627px
  uploadListHeight = 456px
  .card-content-body
    background: #fff
    width: 735px
    height: cardBodyHeight - listHeaderHeight
    margin: 0 auto
    border: 1px solid #aaaaaa
    border-radius: 10px
    overflow: hidden
    uploadListHeight = 456px
    .upload-list
      width: 100%
      height: uploadListHeight
      overflow-y: scroll
      overflow-x hidden
      position: relative
      .nothingMone
        margin: 15px auto
        text-align: center
        font-size: 12px
        color: #C0C0C0

    .upload-form
      width: 100%
      padding-left: 19px
      height: cardBodyHeight - listHeaderHeight - uploadListHeight
      background: #fafafa
      .typelist
        width: 100%
        height: h = 40px
        ul
          float: left
          height: h
          li
            width: 22px
            height: 22px
            background: #c7c7c7
            margin-right: 26px
            display: inline-block
        button
          float: right
          background: #ffac3c
          border: none
          width: 45px
          height: 22px
          color: #fff
          border-radius: 3px
          margin-right: 45px
          margin-top: 7px
      .textinput
        width: 100%
        textarea
          width: 682px
          height: 60px
          border: 1px solid #fdba61
          resize: none
          font-size: 12px
          padding-top: 12px
          padding-left: 15px
    .card-content-body-upload-form
      width: 100%
      padding-left: 19px
      height: cardBodyHeight - listHeaderHeight - uploadListHeight
      background: #fafafa
      position: relative
      .typelist
        width: 100%
        height: h = 40px
        ul
          float: left
          height: h
          li
            width: 22px
            height: 22px
            background: #c7c7c7
            margin-right: 26px
            display: inline-block
            margin-top: 9px
          .emojibutton
            background: url('../../../../static/cardImage/emojiIcon.png')
            background-size: 22px 22px
            &:hover
              background: url('../../../../static/cardImage/emojiIconClick.png')
              background-size: 22px 22px
          .speechbutton
            background: url('../../../../static/cardImage/speechIcon.png')
            background-size: 22px 22px
            &:hover
              background: url('../../../../static/cardImage/speechIconClick.png')
              background-size: 22px 22px
          .imagebutton
            background: url('../../../../static/cardImage/imageIcon.png')
            background-size: 22px 22px
            &:hover
              background: url('../../../../static/cardImage/imageIconClick.png')
              background-size: 22px 22px
          .imagebutton-active
            background: url('../../../../static/cardImage/imageIconClick.png')
            background-size: 22px 22px
          .filebutton
            background: url('../../../../static/cardImage/fileIcon.png')
            background-size: 22px 22px
            &:hover
              background: url('../../../../static/cardImage/fileIconClick.png')
              background-size: 22px 22px
          .filebutton-active
            background: url('../../../../static/cardImage/fileIconClick.png')
            background-size: 22px 22px
        .buttonlist
          float: right
          margin-right: 45px
          margin-top: 10px
          button
            background: #ffac3c
            border: none
            width: 45px
            height: 22px
            color: #fff
            border-radius: 3px
        .file-remind
          float: left
          font-size: 12px
          height: h
          line-height: h
      .textinput
        width: 100%
        position: relative
        .remind
          display: inline-block
          background: #eee
          font-size: 12px
          position: absolute
          top: 5px
          left: 5px
        textarea
          width: 682px
          height: 60px
          border: 1px solid #fdba61
          resize: none
          font-size: 12px
          padding-top: 22px
          padding-left: 15px
      .select-file
        height: h = 200px
        position: absolute
        top: -100px
        left: 40px
</style>
