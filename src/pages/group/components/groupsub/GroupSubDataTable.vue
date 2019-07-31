<template>
  <div class='group-sub-data-table'>
      <group-sub-search-form></group-sub-search-form>
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
import GroupSubSearchForm from './GroupSubSearchForm.vue'
import { eventBus } from '@/util/eventBus'

export default {
  components: {
    GroupSubSearchForm
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 6,
      total: 0,
      columns: [
        {field: 'groupname', title: '组名', width: 135, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true},
        {field: 'gclass', title: '班级', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'groupcreator', title: '建组人', width: 70, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'createtime', title: '创建时间', width: 125, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'updatetime', title: '更新时间', width: 125, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'substate', title: '小组状态', width: 80, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'custome-adv', title: '操作', width: 270, titleAlign: 'center', columnAlign: 'center', componentName: 'group-sub-table-operation', titleCellClassName: 'title-cell-class-name-test'}
      ],
      tableData: [],
      teaSubGroupname: ''
    }
  },
  created () {
    this.getGroupTableData()
  },
  methods: {
    getGroupTableData (sTitle) {
      if (window.localStorage.getItem('cacheTitle') !== '') {
        sTitle = window.localStorage.getItem('cacheTitle')
      }
      this.axios.get('/Martell/a/team/teamAPI/interface/findTeacherTeamInfo?userkey=' + localStorage.getItem('userkey') + '&userId=' + window.localStorage.userId + '&name=' + this.teaSubGroupname + '&subjectTitle=' + encodeURIComponent(sTitle) + '&pageSize=' + this.pageSize +
        '&pageNo=' + this.pageIndex + '&time=' + new Date().getTime())
        .then(response => {
          // console.log('部分分组:' + JSON.stringify(response))
          if (Number(response.data.statusCode) === 200) {
            let groupObjArr = []
            let teamInfos = ''
            teamInfos = response.data.resultMap.teams.list
            for (let i in teamInfos) {
              let groObj = {}
              groObj.subId = teamInfos[i].subject.id
              groObj.groupId = teamInfos[i].id
              groObj.groupname = teamInfos[i].name
              groObj.gclass = teamInfos[i].office.name
              groObj.createtime = teamInfos[i].createDate
              groObj.updatetime = teamInfos[i].updateDate
              groObj.groupcreatorId = teamInfos[i].master.id
              groObj.groupcreator = teamInfos[i].master.name
              groObj.taskId = teamInfos[i].task ? teamInfos[i].task.id : ''
              groObj.fieldUrl = teamInfos[i].task ? teamInfos[i].task.fileURL : ''
              groObj.substate = teamInfos[i].stateCode === '0' ? '已完成' : (teamInfos[i].stateCode === '1' ? '进行中' : '未完成')
              groupObjArr.push(groObj)
            }
            this.total = response.data.resultMap.teams.count
            this.tableData = groupObjArr
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            alert('数据获取失败')
          }
        })
        .catch(function (err) {
          console.log(err)
          alert('服务器异常')
        })
    },
    selectData (gname, sTitle) {
      // console.log('group:' + gname + ',' + sTitle)
      this.teaSubGroupname = gname
      this.getGroupTableData(sTitle)
    },
    sortChange (params) {
    },
    pageChange (pageIndex) {
      this.pageIndex = pageIndex
      this.getTableData()
    },
    getTableData () {
      this.getGroupTableData()
    }
  },
  mounted () {
    eventBus.$on('flushGroupSubData', () => {
      this.getTableData()
    })
  }
}

Vue.component('group-sub-table-operation', {
  template: `<div>
  <ul class='gTableOper'>
    <li><a class="g_a" href='javascript:;' @click.stop.prevent='toCards()'>进入小组</a></li>
    <li><a class="g_a" href='javascript:;' @click.stop.prevent='subScore()' :style='isSubScore'>作业评分</a></li>
    <li><a class="g_a" :href='downSub' :style='isDownloadScore'>作业下载</a></li>
    <li><a class="g_a" href='javascript:;' @click.stop.prevent='withdraw()' :style='isSubScore'>撤回</a></li>
  </ul>
</div>`,
  // <li><a href='javascript:;' @click.stop.prevent='deleteGroup()' :style='isDel'>删除</a></li> 关闭老师删除小组功能
  // <li><a class="g_a" href='javascript:;' @click.stop.prevent='editGroup()' :style='isGroupEdit'>编辑</a></li>
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
    downSub () {
      return this.rowData.fieldUrl === '' ? 'javascript:void(0)' : this.rowData.fieldUrl
    },
    isSubScore () {
      return (this.rowData.substate === '进行中' || this.rowData.substate === '未完成') ? { color: '#808080', cursor: 'default' } : {}
    },
    isDownloadScore () {
      return (this.rowData.substate === '进行中' || this.rowData.substate === '未完成') ? { color: '#808080', cursor: 'default' } : {}
    },
    isGroupEdit () {
      return this.judgeMaster(1) ? {} : { color: '#808080', cursor: 'default' }
    },
    isDel () {
      return this.judgeMaster(2) ? {} : { color: '#808080', cursor: 'default' }
    }
  },
  methods: {
    toCards () {
      window.localStorage.setItem('groupId', this.rowData.groupId)
      window.localStorage.setItem('groupname', this.rowData.groupname)
      window.localStorage.setItem('subtitle', window.localStorage.getItem('cacheTitle'))
      window.localStorage.setItem('groupState', this.rowData.substate)
      window.localStorage.setItem('groupSubId', this.rowData.subId)
      this.judgeMaster(2) ? window.localStorage.setItem('isMaster', true) : window.localStorage.setItem('isMaster', false)
      let param = {index: this.index, rowData: this.rowData}
      this.$router.push({name: 'Card', params: param})
    },
    subScore () {
      if (!this.judgeState()) {
        // console.log('params:' + JSON.stringify(this.rowData))
        let param = {groupId: this.rowData.groupId, groupName: this.rowData.groupname, subId: this.rowData.subId, subtitle: window.localStorage.getItem('cacheTitle')}
        this.$router.push({name: 'Score', params: param})
      }
    },
    judgeState () {
      return this.rowData.substate === '进行中' || this.rowData.substate === '未完成'
    },
    judgeMaster (pro) {
      if (pro === 1) {
        return this.rowData.masterId === window.localStorage.getItem('userId') && this.rowData.substate === '进行中'
      } else if (pro === 2) {
        return this.rowData.masterId === window.localStorage.getItem('userId')
      }
    },
    editGroup () {
      if (this.judgeMaster(1)) {
        window.localStorage.setItem('handleGroup', 'EDIT')
        window.localStorage.setItem('editStorageGroupId', this.rowData.groupId)
        let param = {type: 'EDIT'}
        this.$router.push({name: 'AddGroup', params: param})
      }
    },
    deleteGroup () {
      if (this.judgeMaster(2)) {
        if (confirm('你确定删除吗？')) {
          this.delGroup(this.rowData.groupId)
        } else {}
      }
    },
    delGroup (groupId) {
      this.axios.delete(`/Martell/a/team/teamAPI/interface/delTeam/${groupId}&${window.localStorage.getItem('userId')}?userkey=${localStorage.getItem('userkey')}`).then(response => {
        // console.log('delS:' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          alert('删除成功')
          eventBus.$emit('flushGroupSubData')
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        } else if (Number(response.data.statusCode) === 400) {
          alert(response.data.message)
        } else {
          alert('系统异常')
        }
      })
    },
    withdraw () {
      if (!this.judgeState()) {
        this.axios.put(`/Martell/a/task/taskAPI/interface/revokeTask/${window.localStorage.getItem('userId')}&${this.rowData.taskId}?userkey=${localStorage.getItem('userkey')}`).then(response => {
          // console.log('撤销返回：' + JSON.stringify(response))
          if (Number(response.data.statusCode) === 200) {
            alert(response.data.message)
            eventBus.$emit('flushGroupSubData')
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            alert(response.data.message)
          }
        })
      }
    }
  }
})
</script>

<style lang="stylus" scoped>
>>>.title-cell-class-name-test
    background-color: #f3f3f3
    color: #666666
    font-size: 16px

  .group-sub-data-table
    width 915px
    font-size 14px
    margin 0 auto
    .pagination
      width 100%
      padding-top 12px
      padding-left 400px

>>>.gTableOper
    display flex
    justify-content space-around

</style>
