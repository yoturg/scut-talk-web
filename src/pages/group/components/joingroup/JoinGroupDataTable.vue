<template>
  <div class="data-table">
    <search-table @getTeacherId='getTeaOtherGData'></search-table>
    <v-table
      @sort-change="sortChange"
      is-horizontal-resize
      style="width:100%"
      :columns="columns"
      :table-data="tableData"
      :paging-index='(pageIndex-1)*pageSize'
      row-hover-color='#eee'
      row-click-color='#edf7ff'
    ></v-table>
    <div style='padding:20px 0;float:right;'>
      <v-pagination @page-change='pageChange' :total='total' :page-size='pageSize'>
      </v-pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import searchTable from './searchTable'
import { eventBus } from '@/util/eventBus'

export default{
  name: 'data-table',
  components: {
    searchTable
  },
  data: function () {
    return {
      teacherId: '',
      titleName: '',
      tableData: [],
      total: 0,
      columns: [
        {field: 'grougpName', title: '组名', width: 100, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true},
        {field: 'groupCreater', title: '建组人', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        // {field: 'className', title: '班级', width: 100, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test'},
        {field: 'subName', title: '作业题目', width: 120, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true},
        {field: 'subCreater', title: '建题人', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'state', title: '小组状态', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'custome-adv', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'join-status', titleCellClassName: 'title-cell-class-name-test'}
      ],
      pageIndex: 1,
      pageSize: 6
    }
  },
  methods: {
    sortChange () {
    },
    getTeaOtherGData (tId) {
      if (tId !== undefined && tId !== '') {
        this.teacherId = tId
      }
      this.axios.get('/Martell/a/team/teamAPI/interface/findTeacherDoingTeam?userkey=' + localStorage.getItem('userkey') + '&teacherId=' + this.teacherId + '&userId=' + window.localStorage.getItem('userId') + '&subjectTitle=' +
      this.titleName + '&pageSize=' + this.pageSize + '&pageNo=' + this.pageIndex + '&time=' + new Date().getTime()
      ).then((response) => {
        // console.log('获取加入小组:' + JSON.stringify(response))
        if (response.data.resultMap && Number(response.data.statusCode) === 200) {
          var teamsArr = []
          var teams = []
          teams = response.data.resultMap.teams
          for (var i in teams) {
            var teamsObj = {}
            teamsObj.subId = teams[i].jobId
            teamsObj.groupId = teams[i].teamId
            teamsObj.grougpName = teams[i].groupname
            teamsObj.groupCreater = teams[i].groupleader
            teamsObj.subName = teams[i].jobname
            teamsObj.subCreater = teams[i].titlebuilding
            teamsObj.state = teams[i].state
            teamsObj.applyJoin = teams[i].applyJoin
            teamsArr.push(teamsObj)
          }
          this.tableData = teamsArr
          this.total = response.data.resultMap.count
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      })
    },
    pageChange (pageIndex) {
      this.pageIndex = pageIndex
      this.getTeaOtherGData()
    },
    searchData (tName) {
      this.pageIndex = 1
      this.titleName = tName
      this.getTeaOtherGData()
    },
    flushJoinGroupData () {
      this.getTeaOtherGData()
    }
  },
  created () {
    // console.log('测试先后：---1')
  },
  mounted () {
    eventBus.$on('flushJoinGroupData', () => {
      this.flushJoinGroupData()
    })
  }
}
Vue.component('join-status', {
  template: `<div class="operation">
  <span><a href='javascript:;' @click='joinGroup' :style='isJoin'>加入小组</a></span>
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
    isJoin () {
      return this.judgeMaster() ? { color: '#808080', cursor: 'default' } : { color: '#438EDB', cursor: 'pointer' }
    }
  },
  methods: {
    judgeMaster () {
      if (this.rowData.applyJoin === 1) {
        return true
      } else {
        return false
      }
    },
    joinGroup () {
      if (!this.judgeMaster()) {
        this.axios.put('/Martell/a/team/teamAPI/interface/applyJoinTeam/' + window.localStorage.getItem('userId') + '&' + this.rowData.groupId + '?userkey=' + localStorage.getItem('userkey'))
          .then(response => {
            if (response.data.statusCode === '200') {
              alert(response.data.message)
            } else if (Number(response.data.statusCode) === 401) {
              alert(response.data.message)
              this.exit()
            } else {
              alert(response.data.message)
            }
            eventBus.$emit('flushJoinGroupData')
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

>>>.column-cell-class-name-titlebuilding
      color: #666666

>>>.operation
      a
        color: #666666

>>>.v-page-select
      display none

>>>.title-cell-color
      backround: #14a1e9
      color: #fff

    .data-table
      margin: 0 95px;
      .pagination
        width: 100%
        padding-top: 12px
        padding-left: 400px
</style>
