<template>
  <div class='score-data-table'>
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
import { eventBus } from '@/util/eventBus'
export default {
  name: 'score-data-table',
  data () {
    var columns = [
      // {field: 'bnum', title: '作业编号', width: 120, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test'},
      {field: 'btitle', title: '作业题目', width: 190, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true},
      {field: 'createTime', title: '创建时间', width: 120, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'endTime', title: '结束时间', width: 120, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      // {field: 'state', title: '状态', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test'},
      {field: 'groupName', title: '组名', width: 120, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true},
      {field: 'gcreator', title: '建组人', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'score', title: '分数', width: 60, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'custome-adv', title: '操作', width: 174.39, titleAlign: 'center', columnAlign: 'center', componentName: 'score-status', titleCellClassName: 'title-cell-class-name-test'}
    ]
    var tableData = []
    return {
      multipleSort: false,
      total: 0,
      columns: columns,
      tableData: tableData,
      pageSize: 6,
      pageIndex: 1,
      subjectTitle: ''
    }
  },
  created () {
    this.getScoreData()
  },
  methods: {
    getScoreData () {
      var getUserId = window.localStorage.getItem('userId')
      this.axios.get('/Martell/a/task/taskAPI/interface/ownerTask?userkey=' + localStorage.getItem('userkey') + '&userId=' + getUserId + '&subjectTitle=' + this.subjectTitle + '&pageSize=' + this.pageSize + '&pageNo=' + this.pageIndex + '&time=' + new Date().getTime())
        .then(response => {
          // console.log('个人分数:' + JSON.stringify(response))
          if (response.data.resultMap && response.data.statusCode === '200') {
            var scoreDataArr = []
            var scoreList = response.data.resultMap.tasks.list
            for (var i in scoreList) {
              var scoreObj = {}
              scoreObj.bnum = scoreList[i].id
              scoreObj.btitleId = scoreList[i].subject.id
              scoreObj.btitle = scoreList[i].subject.title
              scoreObj.createTime = scoreList[i].createDate
              scoreObj.endTime = scoreList[i].subject.deadline
              scoreObj.groupName = scoreList[i].team.name
              scoreObj.groupId = scoreList[i].team.id
              scoreObj.gcreator = scoreList[i].teamMaster
              scoreObj.score = scoreList[i].score
              scoreObj.fileURL = scoreList[i].fileURL
              scoreDataArr.push(scoreObj)
            }
            this.total = response.data.resultMap.tasks.count
            this.tableData = scoreDataArr
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            alert('数据获取异常')
          }
        })
    },
    sortChange (params) {
    },
    pageChange (pageIndex) {
      this.pageIndex = pageIndex
      this.getScoreData()
    }
  },
  mounted () {
    eventBus.$on('scoreSearch', (dataObj) => {
      this.subjectTitle = dataObj.subName
      this.getScoreData()
    })
  }
}
Vue.component('score-status', {
  template: `<div class="operation">
  <span><a class="g_a" :href="this.rowData.fileURL">作业下载</a></span>
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
  }
})
</script>

<style lang="stylus" scoped>
  >>>.title-cell-class-name-test
        background-color: #f3f3f3
        color: #666666
        font-size: 16px
  >>>.tableOper li a
        color: #14a1e9
  >>>.title-cell-color
        backround: #14a1e9
        color: #fff
  >>>.titleUrl
      color #14a1e9
  >>>.v-page-select
      display none
</style>
