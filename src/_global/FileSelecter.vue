<template>
  <div class="select-file">
    <div class="fileselecter">
      <input class="select-input" id="select-input" type="button" :value="selectInputValue">
      <input class="upload-input" type="button" :value="uploadInputValue" @click="confirnFile">
      <input
        id="file-input"
        class="file-input"
        type="file"
        multiple="multiple"
        name=""
        ref="fileInputer"
        @mousemove="changeColorMove"
        @mouseleave="changColorLeave"
        @change="changeFile">
    </div>
    <div class="file-list">
      <happy-scroll color="rgba(102,102,102)" size="8" resize>
        <ul>
          <!-- <li v-for="(item, index) in fileList" :key="index">{{item}}</li> -->
          <li v-if="!isUploadImage">{{fileList}}</li>
          <li
            v-if="isUploadImage"
            class="imageItem"
            v-for='(value, key) in imgs'
            :key="key">
            <p class="img"><img :src="getObjectURL(value)"><a class="close" @click="delImg(key)"></a></p>
          </li>
        </ul>
      </happy-scroll>
    </div>
  </div>
</template>

<script>
import {aliOssUpload} from '@/util/ali-oss.js'
export default {
  name: 'select-file',
  props: ['isUploadImage'],
  data () {
    return {
      fileList: '',
      uploadInputValue: '确定',
      imgs: {},
      imgLen: 0
    }
  },
  methods: {
    // 改变按钮颜色
    changeColorMove () {
      var getButton = document.getElementById('select-input')
      getButton.style.color = 'white'
      getButton.style.backgroundColor = 'rgb(63,178,235)'
    },
    // 恢复按钮颜色
    changColorLeave () {
      var getButton = document.getElementById('select-input')
      getButton.style.color = 'rgb(63,178,235)'
      getButton.style.backgroundColor = 'white'
    },
    // 监听文件事件
    changeFile () {
      let files = this.$refs.fileInputer.files
      if (this.isUploadImage) {
        let oldLen = this.imgLen
        let len = files.length + oldLen
        if (len > 9) {
          alert('最多可上传9张，您还可以上传' + (9 - oldLen) + '张')
          return false
        }
        for (let i = 0; i < files.length; i++) {
          this.imgLen++
          this.$set(this.imgs, files[i].name + '?' + new Date().getTime() + i, files[i])
        }
      } else {
        this.fileList = files[0].name
      }
    },
    delImg (key) {
      this.$delete(this.imgs, key)
      this.imgLen--
    },
    // 获得文件路径
    getObjectURL (file) {
      var url = null
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    imageUploaded (args) {
      this.$emit('imageUploaded', args)
    },
    fileUploaded (args) {
      this.$emit('fileUploaded', args)
    },
    fileSelected (num) {
      if (this.isUploadImage) {
        this.$emit('Selected', {isImg: true, num})
      } else {
        this.$emit('Selected', {isImg: false, num: 1})
      }
    },
    // 上传文件
    confirnFile () {
      if (this.isUploadImage) {
        if (JSON.stringify(this.imgs) === '{}') {
          alert('请选择图片')
          return
        }
      } else {
        if (this.$refs.fileInputer.files.length === 0) {
          alert('请选择文件')
          return
        }
      }
      let files = this.$refs.fileInputer.files[0]
      if (this.isUploadImage) {
        let num = 0
        let imageList = []
        for (let key in this.imgs) {
          aliOssUpload(this.imgs[key], (response) => {
            if (response.statusCode === 200) {
              imageList.push(response.fileURL)
            }
            if (imageList.length === Object.keys(this.imgs).length) {
              this.imageUploaded(imageList)
            }
          })
          num += 1
        }
        this.fileSelected(num)
      } else {
        aliOssUpload(files, (response) => {
          if (response.statusCode === 200) {
            // console.log('sd:' + response.fileName + ',url:' + response.fileURL)
            this.fileUploaded({URL: response.fileURL, name: response.fileName})
          }
        })
        this.fileSelected(1)
      }

      // this.axios.post('/Martell/a/thirdparty/aliAPI/interface/upload', data, {headers: {'Content-Type': 'multipart/form-data'}})
      //   .then(response => {
      //     if (Number(response.data.statusCode) === 200) {
      //       this.fileList = ''
      //       this.imgs = {}
      //       if (this.isUploadImage) {
      //         this.imageUploaded(response.data.resultMap.imageURLs)
      //       } else {
      //         console.log(response.data.resultMap.URL)
      //         this.fileUploaded({URL: response.data.resultMap.URL, name: files.name})
      //       }
      //     } else if (Number(response.data.statusCode) === 401) {
      //       alert(response.data.message)
      //       this.exit()
      //     } else {
      //       console.log(response)
      //     }
      //   })
    }
  },
  computed: {
    // inputAccept () {
    //   return this.isUploadImage ? 'image/png,image/gif,image/jpeg' : 'application/*, aplication/*,audio/*,video/*,video/*,text/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation'
    // },
    selectInputValue () {
      return this.isUploadImage ? '选择图片' : '选择文件'
    }
  }
}

</script>

<style lang="stylus" scoped>
  .select-file
    width: 400px
    height: h = 200px
    background: #fff
    border: 1px solid #b9c4d4
    border-radius: 4px
    .fileselecter
      width: 230px
      height: 31px
      margin: 5px 0 0 72px
      display: grid
      display: -ms-grid;
      grid-template-columns: 1fr 1fr
      -ms-grid-columns: 100px auto;
      // grid-template-areas: "select confirm"
      input
        width: 90px
        height: 31px
        line-height: 31px
        margin-left: 25px
        background: #fff
        color: #15a1e9
        border: 1px solid #15a1e9
        border-radius: 3px
        &:hover
          background: #3fb2eb
          color: #fffdff
        &:focus
          outline: none
      .file-input
        // grid-area: select
        grid-area: 1 / 1 / 2 / 2;
        -ms-grid-row:1;
        -ms-grid-column:1;
        z-index: 1
        opacity: 0
      .select-input
        // grid-area: select
        grid-area: 1 / 1 / 3 / 4;
        -ms-grid-row:1;
      .upload-input
        // grid-area: confirm
        grid-area: 1 / 3 / 2 / 4;
        -ms-grid-row:1;
        -ms-grid-column:2;
    .file-list
      width: 370px
      height: 150px
      margin: 10px auto 0 auto
      overflow: hidden
      position: relative
      ul
        width: 370px
        .imageItem
          width: 80px
          height: h = 80px
          line-height: h
          margin-right: 10px
          display: inline-block
          overflow: hidden
          .img
            position: relative
            img
              vertical-align: middle
              width: 100%
              height: 100%
            .close
              display: block
              width: 25px
              height: 25px
              background: url('../../static/cardImage/deleteIcon.png')
              background-size: 25px 25px
              position: absolute
              top: 0
              right: 0
              &:hover
                background: url('../../static/cardImage/deleteIconClick.png')
                background-size: 25px 25px
    #file-tip
      position absolute
      bottom: 5px
      font-size: 12px
      color: red
</style>
