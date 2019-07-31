<template>
  <div class="Content">
    <div class="title">
      作业题目：<input class="border" v-bind:title="title" type="text" v-model='title'/>
      <span style="color:#f00;margin-left:5px">*</span>
    </div>
    <div class="description-work">
      作业描述:
      <!-- <el-input></el-input> -->
      <textarea v-model='descriptionWork' id="descriptionWork"></textarea>
    </div>
    <div class="description-file">
      描述文件：<input class="border" type="text" v-model='descriptionFile'/>
      <a href="javascript:;" class="file" v-show="!isUpload">
        <span>上传文件</span>
        <input type="file" id="file"  v-if="clearShow" ref="fileInputer" @change="fileChange($event)">
      </a>
      <a href="javascript:;" class="fileUpload" v-show="isUpload">
        <span>正在上传</span>
      </a>
      <a href="javascript:;" class="drawback" @click='drawBackFile'>清空</a>
    </div>
    <div class="submitDate">提交期限：<!--<input type="date" v-model='selectedDate'/></div> -->
      <el-date-picker
        v-model="selectedDate"
        type="datetime"
        @change='selectDate'
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="23:59:59">
      >
      <!-- IE下需要关掉placeholder属性 -->
      </el-date-picker>
      <span style="color:#f00">*</span>
    </div>
    <div class="operation">
      <!-- <input v-bind:class="{'red':flag}" /> -->
      <input class="g_button" :class="{'button':flag, 'style':!flag}" type='button' :disabled="isDisabled" @click='saveData'  value='保存'/>
      <input class="button g_button" type='button' @click='backBtn'  value='返回'/>
    </div>
  </div>
</template>
<script>
import {aliOssUpload} from '@/util/ali-oss.js'
export default {
  data () {
    return {
      title: '',
      descriptionWork: '',
      descriptionFile: '',
      selectedDate: '',
      fileURL: '',
      clearShow: true,
      isUpload: false,
      flag: true,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      isDisabled: false
    }
  },
  methods: {
    drawBackFile () {
      this.descriptionFile = ''
      this.fileURL = ''
    },
    backBtn () {
      this.$router.go(-1)
      window.localStorage.setItem('workContentStatus', '')
      window.localStorage.setItem('subjectIdOfEdit', '')
    },
    fileChange (e) {
      if (!e.target.files[0].size) {
        return 0
      } else {
        this.file = e.target.files[0]
        this.clearShow = false
        this.isUpload = !this.isUpload
      }
      if (this.$refs.fileInputer.files.length === 0) {
        alert('请选择文件')
        return
      }
      // let data = new FormData()
      let files = this.$refs.fileInputer.files[0]
      aliOssUpload(files, (response) => {
        if (response.statusCode === 200) {
          this.descriptionFile = this.file.name
          this.fileURL = response.fileURL
          this.clearShow = true
          this.isUpload = !this.isUpload
        }
      })
    // data.append('files', files)
    // data.append('userkey', localStorage.getItem('userkey'))
    // this.axios.post('/Martell/a/thirdparty/aliAPI/interface/upload', data, {headers: {'Content-Type': 'multipart/form-data'}})
    //   .then(response => {
    //     console.log('上传文件:' + JSON.stringify(response))
    //     if (Number(response.data.statusCode) === 200) {
    // this.descriptionFile = this.file.name
    // this.fileURL = response.data.resultMap.URL
    // this.clearShow = true
    // this.isUpload = !this.isUpload
    //     } else if (Number(response.data.statusCode) === 401) {
    //       alert(response.data.message)
    //       this.exit()
    //     } else {
    //       alert('上传失败')
    //     }
    //   })
    },
    selectDate (val) {
      this.selectedDate = val
    },
    saveData () {
      this.flag = !this.flag
      if (this.title === '' || this.title === undefined || this.title === null) {
        this.flag = !this.flag
        alert('题目不能为空')
        return
      }
      // console.log('时间：' + this.selectDate)
      if (this.selectedDate === '' || this.selectedDate === undefined || this.selectedDate === null) {
        this.flag = !this.flag
        alert('请选择日期')
        return
      }
      var userId = window.localStorage.getItem('userId')
      if (this.$route.params.type !== 'EDIT') {
        if (this.isUpload === true) {
          alert('文件还未上传完成')
        } else {
          this.isDisabled = true
          let data = new FormData()
          data.append('userkey', localStorage.getItem('userkey'))
          data.append('userId', userId)
          data.append('title', this.title)
          data.append('deadline', this.selectedDate)
          data.append('content', encodeURIComponent(this.descriptionWork))
          data.append('remarks', '')
          data.append('fileURL', this.fileURL)
          data.append('fileName', this.descriptionFile)
          this.axios.post('/Martell/a/team/subjectAPI/interface/insertSubject', data, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
              // console.log('新建：' + JSON.stringify(response))
              if (response.data.statusCode === '200') {
                this.clearShow = true
                alert('新建成功')
                this.flag = !this.flag
                this.isDisabled = false
                this.$router.push({name: 'homeworkList'})
              } else if (Number(response.data.statusCode) === 401) {
                this.flag = !this.flag
                alert(response.data.message)
                this.exit()
              }
            }).catch((err) => {
              this.flag = !this.flag
              console.log('err:' + err)
              this.flag = !this.flag
              this.isDisabled = false
            })
        }
      } else {
        if (this.isUpload === true) {
          alert('文件还未上传完成')
        } else {
          this.isDisabled = true
          this.axios.put('/Martell/a/team/subjectAPI/interface/updateSubjectInfoById/' + this.$route.params.subjectId + '?userId=' + userId + '&title=' + encodeURIComponent(this.title) + '&deadline=' + this.selectedDate + '&content=' + encodeURIComponent(this.descriptionWork) + '&remarks=' + '' + '&fileURL=' + encodeURIComponent(this.fileURL) + '&fileName=' + encodeURIComponent(this.descriptionFile) + '&userkey=' + localStorage.getItem('userkey')
          ).then(response => {
            // console.log('response 编辑:' + JSON.stringify(response))
            if (response.data.statusCode === '200') {
              alert('修改成功')
              this.flag = !this.flag
              window.localStorage.setItem('workContentStatus', '')
              window.localStorage.setItem('subjectIdOfEdit', '')
              this.isDisabled = false
              this.$router.push({name: 'homeworkList'})
            } else if (Number(response.data.statusCode) === 401) {
              alert(response.data.message)
              this.exit()
            }
          }).catch((err) => {
            console.log('err:' + err)
            alert('上传数据异常')
            this.flag = !this.flag
            this.isDisabled = false
          })
        }
      }
    },
    getHomeWork () {
      if (this.$route.params.type === 'EDIT' || window.localStorage.getItem('workContentStatus') === 'EDIT') {
        if (this.$route.params.subjectId !== undefined && this.$route.params.subjectId !== '') {
          window.localStorage.setItem('subjectIdOfEdit', this.$route.params.subjectId)
        }
        this.axios.get('/Martell/a/team/subjectAPI/interface/findOneSubjectInfo?userkey=' + window.localStorage.getItem('userkey') + '&subjectId=' + window.localStorage.getItem('subjectIdOfEdit') + '&time=' + new Date().getTime())
          .then((response) => {
            // console.log('response:' + JSON.stringify(response))
            if (Number(response.data.statusCode) === 200) {
              this.title = decodeURIComponent(response.data.resultMap.subjectInfo.title)
              this.descriptionWork = decodeURIComponent(response.data.resultMap.subjectInfo.content)
              this.fileURL = response.data.resultMap.subjectInfo.fileURL
              this.selectedDate = response.data.resultMap.subjectInfo.deadline
              if (response.data.resultMap.subjectInfo.fileURL !== undefined) {
                // console.log('文件：' + decodeURIComponent(response.data.resultMap.subjectInfo.fileURL))
                this.descriptionFile = decodeURIComponent(response.data.resultMap.subjectInfo.fileURL).split('_')[1]
              } else {
                this.descriptionFile = ''
              }
            } else if (Number(response.data.statusCode) === 401) {
              alert(response.data.message)
              this.exit()
            }
          }).catch(function (error) {
            console.log(error)
          })
      }
    }
  },
  created () {
    this.getHomeWork()
  }
}
</script>

<style lang="stylus" scoped>
.Content
  width: 88%
  margin: 10px auto
  div
    margin: 10px 0
    .border
      height: 35px
      line-height: 35px
      border-radius: 3px
      border: 1px solid #d7d7d7
      padding: 0 5px
      margin-left 4px
  .description-work
    textarea
      vertical-align: top
      width: 90%
      height: 150px
      resize: none
      border: 1px solid #d7d7d7
      padding: 2px 5px
      margin-left 12px
  .description-file
    .file
      height: 35px
      line-height: 35px
      position: relative
      background: #fff
      border: 1px solid #14a1e9
      border-radius: 4px
      padding: 6px 12px
      overflow: hidden
      color: #3fb2eb
      text-decoration: none
      text-indent: 0
      line-height: 35px
      margin-right: 10px
      input
        position: absolute
        height: 30px
        font-size: 100px
        right: 0
        top: 0
        opacity: 0
    .file:hover
        background: #14a1e9
        color: #fff
        text-decoration: none
    .fileUpload
      height: 35px
      line-height: 35px
      position: relative
      background: #D3D3D3
      border: 1px solid #D3D3D3
      border-radius: 4px
      padding: 6px 12px
      overflow: hidden
      color: #000
      text-decoration: none
      text-indent: 0
      line-height: 35px
      margin-right: 10px
      input
        position: absolute
        height: 30px
        font-size: 100px
        right: 0
        top: 0
        opacity: 0
    .fileUpload:hover
      cursor:not-allowed
    .drawback
      height: 35px
      line-height: 35px
      position: relative
      background: #fff
      border: 1px solid #14a1e9
      border-radius: 4px
      padding: 6px 30px
      overflow: hidden
      color: #3fb2eb
      text-decoration: none
      text-indent: 0
      line-height: 35px
    .drawback:hover
        background: #14a1e9
        color: #fff
        text-decoration: none
  .operation
    display: flex
    justify-content: flex-end
// .button
//   width: 90px
//   height: 35px
//   line-height: 35px
//   color: #3fb2eb
//   margin: 10px 7px
//   border:1px solid #14a1e9
//   border-radius: 3px
//   display: inline-block
//   background: #fff
//   &:focus
//     outline none
// .button:hover
//   background: #14a1e9
//   color: #fff
// .style
//  width: 90px
//  height: 35px
//  line-height: 35px
//  color: #3fb2eb
//  margin: 10px 7px
//  border:1px solid #14a1e9
//  border-radius: 3px
//  display: inline-block
//  background: #bdc6cb
.style:hover
  cursor: not-allowed
</style>
