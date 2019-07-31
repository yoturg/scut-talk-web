<template>
  <div class='home-data-table'>
    <search-form></search-form>
    <v-table
      is-horizontal-resize
      style='width:100%'
      :columns='columns'
      :table-data='tableData'
      :paging-index='(pageIndex-1)*pageSize'
      @sort-change='sortChange'
      row-hover-color='#eee'
      row-click-color='#edf7ff'
    ></v-table>
    <div style='padding:20px 0;float:right;'>
      <v-pagination @page-change='pageChange' :total='total' :page-size='pageSize' :layout="['total', 'prev', 'pager', 'next', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import SearchForm from './SearchForm'
import { eventBus } from '@/util/eventBus'

var stuUrl = ''
var judgeStu = ''
export default{
  name: 'home-data-table',
  components: {
    SearchForm,
    eventBus
  },
  data: function () {
    var stuColumns = [
      {field: 'time', title: '操作时间', width: 100, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'groupname', title: '组名', width: 150, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true},
      {field: 'groupcreator', title: '建组人', width: 70, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'subtitle', title: '作业题目', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'subtitle-download', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true},
      {field: 'deadline', title: '截止日期', width: 140, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'subcreator', title: '建题人', width: 80, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'substate', title: '小组状态', width: 80, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      // 如果要在table的格子里放删除编辑这种操作按钮，需要把这些按钮写成一个组件，注册成全局组件， 然后在componentName中填入组件名
      {field: 'custome-adv', title: '操作', width: 190, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation', titleCellClassName: 'title-cell-class-name-test'}
    ]
    var teaColumns = [
      {field: 'time', title: '操作时间', width: 130, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'groupname', title: '组名', width: 150, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true},
      {field: 'gclass', title: '班级', width: 120, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'groupcreator', title: '建组人', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'substate', title: '小组状态', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      // {field: 'subnum', title: '作业编号', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test'},
      {field: 'subtitle', title: '作业题目', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'subtitle-component', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true}
    ]
    judgeStu = window.localStorage.getItem('userRole').indexOf('学生') !== -1

    return {
      GetData: [], // 获取数据
      pageIndex: 1, // 页码
      pageSize: 6, // 每页条数
      total: 0, // 数据总条数
      columns: judgeStu ? stuColumns : teaColumns,
      tableData: [],
      dataGroupname: '',
      dataGroupcreator: '',
      dataSubTitle: ''
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 数据获取
    GetHomeData () {
      if (judgeStu) {
        stuUrl = '/Martell/a/team/teamAPI/interface/findStudentTeamInfoAndKeyword?userkey=' + localStorage.getItem('userkey') + '&userId=' + window.localStorage.getItem('userId') +
        '&teamName=' + this.dataGroupname + '&masterName=' + this.dataGroupcreator + '&subjectTitle=' + this.dataSubTitle + '&subjectNum=' + '&pageSize=' + this.pageSize +
        '&pageNo=' + this.pageIndex + '&time=' + new Date().getTime()
      } else {
        stuUrl = '/Martell/a/sys/userAPI/interface/findTeacherTeamInfoByUserId?userkey=' + localStorage.getItem('userkey') + '&userId=' + window.localStorage.getItem('userId') +
        '&teamName=' + this.dataGroupname + '&subjectNum=' + '&subjectTitle=' + this.dataSubTitle + '&masterName=' + this.dataGroupcreator + '&pageSize=' + this.pageSize +
        '&pageNo=' + this.pageIndex + '&time=' + new Date().getTime()
      }
      var p = new Promise((resolve, reject) => {
        this.axios.get(stuUrl).then(response => {
          // console.log('stuUrl:' + stuUrl + '，data:' + JSON.stringify(response))
          if (Number(response.data.statusCode) === 200) {
            var homeObjArr = []
            var teamInfos = ''
            if (judgeStu) {
              teamInfos = response.data.resultMap.teams
              this.total = response.data.resultMap.count
              for (var i in teamInfos) {
                var stuObj = {}
                stuObj.groupId = teamInfos[i].team.id
                stuObj.time = teamInfos[i].team.updateDate
                stuObj.groupname = teamInfos[i].team.name
                stuObj.masterId = teamInfos[i].team.master.id
                stuObj.groupcreator = teamInfos[i].team.master.name
                stuObj.deadline = teamInfos[i].team.subject.deadline
                stuObj.subtitle = teamInfos[i].team.subject.title
                stuObj.fileURL = teamInfos[i].team.subject.fileURL
                stuObj.subId = teamInfos[i].team.subject.id
                teamInfos[i].team.teacher ? stuObj.subcreator = teamInfos[i].team.teacher.name : stuObj.subcreator = ''
                stuObj.substate = teamInfos[i].team.stateCode === '0' ? '已完成' : (teamInfos[i].team.stateCode === '1' ? '进行中' : '未完成')
                stuObj.applyQuit = teamInfos[i].applyQuit
                homeObjArr.push(stuObj)
              }
            } else if (response.data.resultMap.team) {
              teamInfos = response.data.resultMap.team
              this.total = response.data.resultMap.count
              for (var k in teamInfos) {
                var teaObj = {}
                teaObj.groupId = teamInfos[k].teamId
                teaObj.time = teamInfos[k].updateTime
                teaObj.groupname = teamInfos[k].groupname
                teaObj.gclass = teamInfos[k].officeName
                teaObj.groupcreator = teamInfos[k].groupleader
                teaObj.substate = teamInfos[k].state
                // teaObj.subnum = teamInfos[k].jobId
                teaObj.subtitle = teamInfos[k].jobname
                homeObjArr.push(teaObj)
              }
            }
            resolve(homeObjArr)
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            reject(new Error('操作错误，无法获取数据'))
          }
        })
          .catch(function (response) {
            console.log(response) // 发生错误时执行的代码
            alert('服务器异常')
          })
      })
      return p
    },
    // 数据处理
    DateHandle () {
      var tDates = this.GetHomeData()
      tDates.then(Dates => {
        const data = Dates
        var pageData = []
        pageData = pageData.concat(data)
        this.tableData = pageData
      }).catch(err => {
        console.log(err)
        alert('服务器异常')
      })
    },
    // 分页处理
    getTableData () {
      this.DateHandle()
    },
    // 页码触发更新
    pageChange (pageIndex) {
      this.pageIndex = pageIndex
      // console.log('点击页码')
      this.getTableData()
    },
    // 条件查询
    selectData (groupname, groupcreator, subTitle) {
      this.pageIndex = 1
      // console.log('groupname:' + groupname + ',groupcreator：' + groupcreator + ',subTitle:' + subTitle)
      this.dataGroupname = groupname
      this.dataGroupcreator = groupcreator
      this.dataSubTitle = subTitle
      this.DateHandle()
    },
    sortChange (params) {
    }
  },
  mounted () {
    eventBus.$on('flushDataTable', () => {
      // console.log('刷新')
      this.getTableData()
    })
  }
}
// 作业下载组件
Vue.component('subtitle-download', {
  template: `<span>
  <a class="g_a" :href='subDownload' target='_blank'>{{rowData.subtitle}}</a>&nbsp;
  </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  computed: {
    subDownload () {
      return this.rowData.fileURL === '' ? 'javascript:void(0)' : this.rowData.fileURL
    },
    isDownloadSub () {
      return this.rowData.fileURL === '' ? { color: '#808080', cursor: 'default' } : { color: '#14a1e9' }
    }
  }
})
// 作业题目跳转
Vue.component('subtitle-component', {
  template: `<span>
  <a class="g_a" href='JavaScript:;' @click.stop.prevent='groupOfSub()'>{{rowData.subtitle}}</a>&nbsp;
  </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    groupOfSub () {
      let param = {type: 'GROUP_SUB', title: this.rowData.subtitle}
      this.$router.push({name: 'GroupSub', params: param})
    }
  }
})
Vue.component('table-operation', {
  template: `<div>
  <ul class='tableOper'>
    <li><a class="g_a" href='javascript:;' @click.stop.prevent='toCard()'>进入小组</a></li>
    <li><a class="g_a" href='javascript:;' @click.stop.prevent='applyQuitTeam()' :style='isApplyQuit'>退出小组</a></li>
    <li><a class="g_a" href='javascript:;' @click.stop.prevent='editTeam()' :style='isEdit'>编辑</a></li>
    <li><a class="g_a" href='javascript:;' @click.stop.prevent='deleteGroup()' :style='isDel'>删除</a></li>
  </ul>
</div>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isApplyQuit () {
      if (this.rowData.masterId === window.localStorage.getItem('userId') || this.rowData.applyQuit === 1 || this.rowData.substate !== '进行中') {
        return { color: '#808080', cursor: 'default' }
      } else {
        return {}
      }
    },
    isEdit () {
      return this.judgeMaster(1) ? {} : { color: '#808080', cursor: 'default' }
    },
    isDel () {
      return this.judgeMaster(2) ? {} : { color: '#808080', cursor: 'default' }
    }
  },
  methods: {
    judgeMaster (pro) {
      if (pro === 1) {
        return this.rowData.masterId === window.localStorage.getItem('userId') && this.rowData.substate === '进行中'
      } else if (pro === 2) {
        return this.rowData.masterId === window.localStorage.getItem('userId')
      }
    },
    toCard () {
      window.localStorage.setItem('groupId', this.rowData.groupId)
      window.localStorage.setItem('groupname', this.rowData.groupname)
      window.localStorage.setItem('subtitle', this.rowData.subtitle)
      window.localStorage.setItem('groupState', this.rowData.substate)
      window.localStorage.setItem('groupSubId', this.rowData.subId)
      this.judgeMaster(2) ? window.localStorage.setItem('isMaster', true) : window.localStorage.setItem('isMaster', false)
      let params = {index: this.index, rowData: this.rowData}
      this.$router.push({name: 'Card', params})
    },
    applyQuitTeam () {
      // console.log('params:' + JSON.stringify(this.rowData))
      if (this.rowData.masterId !== window.localStorage.getItem('userId') && this.rowData.applyQuit === 0 && this.rowData.substate === '进行中') {
        this.axios.put('/Martell/a/team/teamAPI/interface/applyQuitTeam/' + window.localStorage.getItem('userId') + '&' + this.rowData.groupId + '?userkey=' + localStorage.getItem('userkey'))
          .then(response => {
            // console.log('退出:' + JSON.stringify(response))
            if (Number(response.data.statusCode) === 200) {
              alert('退出申请已提交')
              eventBus.$emit('flushDataTable')
            } else if (Number(response.data.statusCode) === 401) {
              alert(response.data.message)
              this.exit()
            } else {
              alert('退出申请提交失败')
            }
          }).catch((err) => {
            console.log(err)
            alert('服务器异常')
          })
      } else {
      }
    },
    editTeam () {
      if (this.judgeMaster(1)) {
        window.localStorage.setItem('handleGroup', 'EDIT')
        window.localStorage.setItem('editStorageGroupId', this.rowData.groupId)
        let param = {type: 'EDIT'}
        this.$router.push({name: 'AddGroup', params: param})
      }
    },
    deleteGroup () {
      if (this.judgeMaster(2)) {
        if (confirm('请问是否确定删除？')) {
          this.delGroup(this.rowData.groupId)
        } else {}
      }
    },
    delGroup (groupId) {
      this.axios.delete(`/Martell/a/team/teamAPI/interface/delTeam/${groupId}&${window.localStorage.getItem('userId')}?userkey=${localStorage.getItem('userkey')}`).then(response => {
        // console.log('del:' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          alert('删除成功')
          eventBus.$emit('flushDataTable')
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        } else {
          alert('删除失败')
        }
      })
    }
  }
})
</script>

<style lang='stylus'>
  .home-data-table
    width: 61.5rem
    font-size: 14px
    margin-left: 40px
    .pagination
      width: 100%
      padding-top: 12px
      padding-left: 400px

  .tableOper
    display: flex
    justify-content: space-around

  .title-cell-color
    backround: #14a1e9
    color: #fff

  .titleUrl
    color #14a1e9
</style>
