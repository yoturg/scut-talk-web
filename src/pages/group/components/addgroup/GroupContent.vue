<template>
  <div class='group-content'>
    <div class='content-head'>
      <div class='group-name'>
        组名
        <input type='text' v-model="groupName">
        &nbsp;<span style="color:#f00">*</span>
      </div>
      <div class='group-teacher'>
        老师&nbsp;
        <input :class="[isEdit ? 'grayText' : '','selectTeacher']" v-model="selectedTeacher" readonly><img :src='pullDownIcon' height="30" @click='showData'/>&nbsp;<span style="color:#f00">*</span>
        <ul v-show='isShowTeacher'>
          <li v-for='(teaData,index) in teachers' :key='index' @click='getSelectedTeacher(teaData)'>{{teaData.name}}</li>
        </ul>
      </div>
      <div class='homework'>
        作业题目&nbsp;
        <input :class="[isEdit ? 'grayText' : '','selectHomework']" v-model="selectedWork" readonly><img :src='pullDownIcon' height="30" @click='showTitle'/><span style="color:#f00;margin-left:5px">*</span>
        <ul v-show='isShowTitle'>
          <li v-for='(work,index) in subjects' :key='index' @click='getSelectedWork(work)'>{{work.title}}</li>
        </ul>
      </div>
    </div>
    <div class='content-body'>
      <div class='division'>
        <span>分工&nbsp;</span>
        <textarea name='txt' warp='virtual' v-model="textareaData"></textarea>
      </div>
    </div>
  </div>
</template>
<script>
import { eventBus } from '@/util/eventBus'
export default {
  data () {
    return {
      teachers: '',
      subjects: '',
      isShowTeacher: false,
      isShowTitle: false,
      selectedTeacher: '请选择老师',
      selTeacherId: '',
      selectedWork: '请选择题目',
      selWorkId: '',
      textareaData: '',
      groupName: '',
      isEdit: false,
      pullDownIcon: require('@/pages/group/img/pull-down.png'),
      isDisabledTag: 1 // 默认1表示未选择老师，2表示已选择老师，3表示当前为编辑状态，4表示当前用户是老师
    }
  },
  methods: {
    showData () {
      if (this.isDisabledTag === 3 || this.isDisabledTag === 4) {
        this.pullDownIcon = require('@/pages/group/img/pull-down-gray.png')
        this.isEdit = true
        this.isShowTeacher = false
      } else {
        this.isShowTeacher = !this.isShowTeacher
      }
    },
    showTitle () {
      if (this.isDisabledTag === 3) {
        this.pullDownIcon = require('@/pages/group/img/pull-down-gray.png')
        this.isEdit = true
        this.isShowTitle = false
      } else if (this.isDisabledTag === 2 || this.isDisabledTag === 4) {
        this.isShowTitle = !this.isShowTitle
        this.getTeacherSub()
      } else if (this.isDisabledTag === 1) {
        // this.$message({
        //   message: '请先选择老师',
        //   type: 'warning',
        //   duration: 3000,
        //   showClose: true
        // })
        alert('请先选择老师')
      }
    },
    getTeacherById (teamId) {
      this.axios.get('/Martell/a/team/teamAPI/interface/getTeamInfoByTeamId?userkey=' + localStorage.getItem('userkey') + '&teamId=' + teamId + '&time=' + new Date().getTime()).then((response) => {
        // console.log('----------------' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          this.selectedTeacher = response.data.resultMap.teacherName
          this.selTeacherId = response.data.resultMap.teacherId
          this.selectedWork = response.data.resultMap.subjectTitle
          this.selWorkId = response.data.resultMap.subjectId
          this.textareaData = response.data.resultMap.divideTheWork
          this.groupName = response.data.resultMap.teamName
          eventBus.$emit('getSubId', this.selWorkId)
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    getMemberById (teamId) {
      this.axios.get('/Martell/a/sys/userAPI/interface/getUserInfoByTeamId?userkey=' + localStorage.getItem('userkey') + '&teamId=' + teamId + '&time=' + new Date().getTime()).then((response) => {
        // console.log('组员：' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          var memberArr = []
          if (response.data.resultMap) {
            var userInfo = response.data.resultMap.userInfo
            for (var k in userInfo) {
              var memberObj = {}
              memberObj.id = userInfo[k].id
              memberObj.name = userInfo[k].name
              memberArr.push(memberObj)
            }
            eventBus.$emit('showMemberData', memberArr)
          }
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    getTeacher () {
      this.axios.get('/Martell/a/sys/userAPI/interface/findAllTeacherInfo?userkey=' + localStorage.getItem('userkey') + '&time=' + new Date().getTime()).then((response) => {
        if (Number(response.status) === 200) {
          this.teachers = response.data.resultMap.teachers
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    getTeacherSub () {
      this.subjects = []
      var userId = this.selTeacherId
      // this.axios.get('/Martell/a/team/subjectAPI/interface/findSubjectList?userId=' + userId
      this.axios.get('/Martell/a/team/subjectAPI/interface/findStudentUnjoinSubjects?userkey=' + localStorage.getItem('userkey') + '&userId=' + window.localStorage.getItem('userId') + '&teacherId=' + userId + '&time=' + new Date().getTime()
      ).then((response) => {
        // console.log('response11:' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          this.subjects = response.data.resultMap ? (response.data.resultMap.subjects.count === 0 ? [{title: '无'}] : response.data.resultMap.subjects.list) : [{title: '无'}]
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        } else {
          this.subjects = [{title: '无'}]
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    getSelectedTeacher (teacher) {
      this.selectedTeacher = teacher.name
      this.selTeacherId = teacher.id
      // console.log('selTeacherId:' + this.selTeacherId)
      if (this.isDisabledTag === 1) { this.isDisabledTag = 2 }
      this.selectedWork = '请选择题目'
      this.selWorkId = ''
      this.showData()
      if (this.isShowTitle) {
        this.isShowTitle = false
      }
    },
    getSelectedWork (work) {
      this.selectedWork = work.title
      this.selWorkId = work.id
      // console.log('作业题目id:' + this.selWorkId)
      this.showTitle()
      eventBus.$emit('getSubId', this.selWorkId)
    }
  },
  created () {
    if (this.$route.params.type === 'EDIT' || window.localStorage.getItem('handleGroup') === 'EDIT') {
      // console.log('编辑：' + JSON.stringify(window.localStorage))
      this.isDisabledTag = 3
      this.showData()
      this.getTeacherById(window.localStorage.getItem('editStorageGroupId'))
      this.getMemberById(window.localStorage.getItem('editStorageGroupId'))
    } else if (window.localStorage.getItem('userRole') === '老师') {
      this.isDisabledTag = 4
      this.selTeacherId = window.localStorage.getItem('userId')
      this.selectedTeacher = window.localStorage.getItem('userName')
      this.showData()
    } else {
      this.getTeacher()
    }
  }
}
</script>
<style lang='stylus' scoped>
.group-content
  margin:25px 85px
  .content-head
    margin: 15px 5px
    height 30px
    .group-name
      display: inline-flex
      align-items:center
      width: 270px
      span
        margin-top: 5px;
      input
        border: 1px solid #e1e1e1
        border-radius: 3px
        width: 200px
        height: 30px
        margin-left 7px
        padding-left 5px
    .group-teacher
      position: relative
      display: inline-flex
      flex-wrap: wrap
      align-items:center
      width: 270px
      height: 30px
      span
        margin-top: 5px;
      .selectTeacher
        width 165px
        height: 30px
        padding-left: 5px
        border: 1px solid #e1e1e1
        margin-right -1px
        font-size 14px
        border-top-left-radius:3px;
        border-bottom-left-radius:3px
        outline none
        .hint
          width: 163px
          height: 30px
          line-height: 2.5rem
      ul
        z-index 2
        background-color white
        margin-left 36px
        width 201px
        overflow-y: auto
        border: 1px solid #e1e1e1
        font-size 14px
        box-shadow: 3px 3px 5px #888888;
        li
          height: 30px
          display: flex
          align-items: center
          padding-left: 6px
        li:hover
          background-color: #e1e1e1
    .homework
      position: relative
      display: inline-flex
      flex-wrap: wrap
      align-items:center
      width: 310px
      height: 30px
      span
        margin-top: 5px;
      .selectHomework
        width: 165px
        height: 30px
        padding-left: 5px
        margin-right -1px
        font-size 14px
        border: 1px solid #e1e1e1
        border-radius: 3px
        overflow: hidden
        text-overflow ellipsis
        white-space: nowrap
        outline none
        .hint
          width: 163px
          height: 30px
          color red
      ul
        z-index: 2
        background-color: white
        margin-left 68px
        width 201px
        height: 210px
        overflow-y: auto
        border: 1px solid #e1e1e1
        font-size 14px
        box-shadow: 3px 3px 5px #888888;
        padding-top: 5px;
        li
          height: 30px
          display: flex
          align-items: center
          padding-left: 10px
        li:hover
          background-color: #e1e1e1
.content-body
  .division
    span
      margin-left 5px
    textarea
      width: 94%
      height:200px
      border: 1px solid #e1e1e1
      vertical-align: top
      outline: none
      padding-left 10px
      resize none
.grayText
  color #A9A9A9
</style>
