<template>
  <div class="container">
    <page-header :isSelect="true"></page-header>
    <page-body>
      <div class="job-header">
        <h1>{{groupname}}</h1>
        <!-- <p>作业题目： {{subtitle}}</p> -->
        <div class="underline"></div>
      </div>
      <div class="job-body">
        <div class="body-title">
          <h2>作业提交</h2>
          <ul>
            <li class="g_button" @click="submitTask">{{submitTaskValue}}</li>
            <li class="g_button" @click="backCard">返回</li>
          </ul>
        </div>
        <div class="submisstionContent">
          <div class="description">
            <h3>版本描述：</h3>
            <textarea v-model="descriptionValue"></textarea>
            <div style="color: red; font-size: 13px; width: 897px; margin: 0 auto; text-align: right">(必填)</div>
          </div>
          <div class="select-file">
            <h3>文件：</h3>
            <div class="file-list">{{filename}}</div><span style="color: red; font-size: 20px">*</span>
            <button class="g_button" ref="fileButton">{{fileButtonValue}}</button>
            <input type="file" id="file-input" ref="fileInputer" @change="fileChange($event)" :disabled="isDisable">
            <!-- <button class="g_button" @click="cancel" :disabled="isDisable">取消</button> -->
          </div>
          <div id='jobGroupTable'>
            <span>组长评分：</span>
            <v-table
                is-horizontal-resize
                style='width:100%'
                :columns='columns'
                :table-data='tableData'
                :paging-index='(pageIndex-1)*pageSize'
                :cell-edit-done='cellEditDone'
                row-hover-color='#eee'
                row-click-color='#edf7ff'
            ></v-table>
          </div>
        </div>
      </div>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import SelectFile from './components/SelectFile'
import {aliOssUpload} from '@/util/ali-oss.js'
export default {
  name: 'JobSubmission',
  components: {
    SelectFile
  },
  data () {
    return {
      submitTaskValue: '提交',
      fileButtonValue: '选择文件',
      isDisable: false,
      filename: '',
      fileURL: '',
      descriptionValue: '',
      pageIndex: 1,
      pageSize: 6,
      total: 0,
      columns: [
        {field: 'userName', title: '组员姓名', width: 100, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true},
        {field: 'cardNum', title: '新建卡片数', width: 100, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'postNum', title: '评论数', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'imageNum', title: '发图片数', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'videoNum', title: '发文件数', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'scoreOper', title: '评分', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', isEdit: true}
      ],
      tableData: [],
      cardOperVals: [],
      cardUserIds: []
    }
  },
  created () {
    this.getGroupData()
  },
  methods: {
    fileChange (e) {
      if (!e.target.files[0]) {
        return 0
      } else {
        this.fileButtonValue = '提交中...'
        this.isDisable = true
        this.file = e.target.files[0]
        aliOssUpload(this.file, response => {
          this.filename = response.fileName
          this.fileURL = response.fileURL
          this.fileButtonValue = '选择文件'
          this.isDisable = false
        })
      }
    },
    // cancel () {
    //   this.isShowFileUpload = false
    //   this.hiddenFileUpload = false
    //   this.isLoading = false
    //   this.filename = ''
    //   this.fileURL = ''
    // },
    backCard () {
      this.$router.go(-1)
    },
    submitTask () {
      var re = /^(?:[1-9]?\d|100)$/
      if (this.fileURL === '' && this.isDisable === true) {
        alert('文件上传中，请上传完再提交')
        return
      }
      if (this.submitTaskValue === '提交中') {
        return
      }
      if (this.descriptionValue == null || this.descriptionValue.length === 0) {
        alert('请输入描述')
        return
      }
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].scoreOper !== '' && !re.test(this.tableData[i].scoreOper)) {
          return alert(this.tableData[i].scoreOper + ' 内容不符合，请输入0-100的数值')
        } else {
          this.cardOperVals.push(this.tableData[i].scoreOper === '' ? 0 : this.tableData[i].scoreOper)
          this.cardUserIds.push(this.tableData[i].id)
        }
      }
      this.submitTaskValue = '提交中'
      this.isDisable = true
      // 如果fileURL是空的，isDisable是true（表示上传中），中断函数，在fileURL设置标志
      // if (this.fileURL === '' && this.isDisable === true) {
      //   this.fileURL = 'loading'
      //   return
      // } else {
      //   this.isDisable = true
      // }
      let data = new FormData()
      data.append('userId', window.localStorage.userId)
      data.append('teamId', window.localStorage.groupId)
      data.append('remarks', this.descriptionValue)
      data.append('fileURL', this.fileURL)
      data.append('userIds', this.cardUserIds.join(','))
      data.append('scores', this.cardOperVals.join(','))
      data.append('userkey', localStorage.userkey)
      // console.log('提交作业data：' + JSON.stringify(Object.keys(data)))
      this.axios.post('/Martell/a/task/taskAPI/interface/saveTask', data, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => {
        // console.log('提交作业：' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          alert('提交成功')
          window.localStorage.groupState = '已完成'
          this.$router.go(-1)
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        } else {
          alert(response.data.message)
        }
      })
    },
    // changeSelectFileState (isUploadImage) {
    //   if (this.isLoading) {
    //     return
    //   }
    //   if (!this.hiddenFileUpload) {
    //     this.hiddenFileUpload = true
    //   }
    //   this.isShowFileUpload = !this.isShowFileUpload
    // },
    // commentWithFile (args) {
    //   this.filename = args.name
    //   this.fileURL = args.URL
    //   this.isShowFileUpload = false
    //   this.isLoading = false
    // },
    getGroupData () {
      this.axios.get(`/Martell/a/team/subjectAPI/interface/findSubjectInfoById?userkey=${localStorage.getItem('userkey')}&teamId=${window.localStorage.groupId}&subjectId=${window.localStorage.groupSubId}&time=${new Date().getTime()}`)
        .then(response => {
          // console.log('获取数量:' + JSON.stringify(response))
          if (response.data.resultMap && response.data.statusCode === '200') {
            var scoreArr = []
            var scoreData = response.data.resultMap.subjectInfo
            for (var i in scoreData) {
              var scoreObj = {}
              scoreObj.id = scoreData[i].user.id
              scoreObj.userName = scoreData[i].user.name ? scoreData[i].user.name : ''
              scoreObj.postNum = scoreData[i].user.postNum
              scoreObj.imageNum = scoreData[i].user.imageNum
              scoreObj.videoNum = scoreData[i].user.videoNum
              scoreObj.cardNum = scoreData[i].user.cardNum
              scoreObj.scoreOper = ''
              scoreArr.push(scoreObj)
            }
            this.tableData = scoreArr
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          }
        })
    },
    cellEditDone (newValue, oldValue, rowIndex, rowData, field) {
      this.tableData[rowIndex][field] = newValue
    }
    // fileSelected (args) {
    //   this.hiddenFileUpload = false
    //   this.isLoading = true
    //   this.filename = '文件上传中......'
    // }
  },
  computed: {
    groupname () {
      if (window.localStorage.groupname) {
        return window.localStorage.groupname
      } else {
        this.$router.go(-1)
      }
    },
    subtitle () {
      if (window.localStorage.subtitle) {
        return window.localStorage.subtitle
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../assets/styles/varibles.styl'
  h1
    font-size: 21px
  h2
    font-size: 16px
    font-weight: normal
  h3
    height: 52px
    margin-left: 102px
    line-height 52px
    font-size: 13px
    font-weight: normal
  p
    font-size: 13px
  .container
    background: #f4f4f4
    .job-header
      width: 100%
      height: 47px
      margin-bottom: 14px
      position: relative
      h1
        position: absolute
        bottom: 0
        left: 46px
      p
        position: absolute
        bottom: 0
        left: 105px
      .underline
        width: 70px
        border: 2px solid themeColor
        position: absolute
        bottom: -14px
        left: 40px
    .job-body
      .body-title
        width: 900px
        height: 81px
        margin: 8px auto 0 auto
        border-bottom: 2px solid #cccccc
        h2
          line-height: 81px
          float: left
        ul
          text-align: right
          line-height: 81px
      .submisstionContent
        .description
          textarea
            resize: none
            width: 897px
            height: 117px
            padding: 10px
            border: 1px solid #e1e1e1
            border-radius: 3px
            display: block
            margin: 0 auto
      .select-file
        position: relative
        .file-list
          width: 298px
          height: 34px
          line-height: 34px
          padding-left: 5px
          background: #fff
          border: 1px solid #e1e1e1
          border-radius: 3px
          float: left
          margin-left: 92px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .fileselect
          height: h = 200px
          position: absolute
          bottom: -220px
          margin-left: 92px
          z-index 999
        #file-input
          position: absolute
          width: 90px
          height: 30px
          left: 428px
          opacity: 0
  #jobGroupTable
    width 895px
    height 100%
    margin 35px auto
    font-size 12px
    span
      height: 52px
      line-height 52px
      font-size: 13px
      font-weight: normal
      margin-left: 15px
  >>>.title-cell-class-name-test
      background-color: #f3f3f3
      color: #666666
      font-size: 13px
  >>>.gTableOper
      display flex
      justify-content space-around
  >>>.gTableOper li a
      color #14a1e9
  >>>.tableOpt
    cursor: pointer
    color: #14a1e9
    &:hover
      text-decoration: underline
</style>
