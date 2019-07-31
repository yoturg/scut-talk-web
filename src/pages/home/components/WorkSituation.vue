<template>
  <div class='work-data-table'>
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
export default {
  name: 'work-data-table',
  data () {
    var workColumns = [
      {
        field: 'time',
        title: '操作时间',
        width: 170,
        titleAlign: 'center',
        columnAlign: 'center',
        overflowTitle: true,
        titleCellClassName: 'title-cell-class-name-test'
      },
      {
        field: 'subtitle',
        title: '作业题目',
        width: 150,
        titleAlign: 'center',
        columnAlign: 'center',
        componentName: 'sub-title-component',
        overflowTitle: true,
        titleCellClassName: 'title-cell-class-name-test',
        isResize: true
      },
      {
        field: 'subcreator',
        title: '建题人',
        width: 90,
        titleAlign: 'center',
        columnAlign: 'center',
        overflowTitle: true,
        titleCellClassName: 'title-cell-class-name-test'
      },
      {
        field: 'deadline',
        title: '截止时间',
        width: 290,
        titleAlign: 'center',
        columnAlign: 'center',
        overflowTitle: true,
        titleCellClassName: 'title-cell-class-name-test'
      }
    ]
    return {
      GetData: [], // 获取数据
      pageIndex: 1, // 页码
      pageSize: 3, // 每页条数
      total: 0, // 数据总条数
      columns: workColumns,
      dataGroupname: '',
      dataGroupcreator: '',
      dataSubTitle: '',
      tableData: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    trashDateHandle () {
      this.getWorkData().then((data) => {
        var pageData = []
        pageData = pageData.concat(data)
        this.tableData = pageData
        this.total = this.tableData[0] !== undefined ? this.tableData[0].count : 0
      })
    },
    getWorkData () {
      var promise = new Promise((resolve, reject) => {
        var userId = window.localStorage.getItem('userId')
        var urlWork = `/Martell/a/team/subjectAPI/interface/findStudentUnjoinSubjects?userkey=${localStorage.getItem('userkey')}&userId=${userId}&teacherId=a281aff4d67646fba56a8ca33c039e0a&pageSize=${this.pageSize}&pageNo=${this.pageIndex}&time=${new Date().getTime()}`
        this.axios.get(urlWork).then(response => {
          if (Number(response.data.statusCode) === 200) {
            // console.log('未参与的题目：' + JSON.stringify(response))
            var getList = {}
            var returnData = []
            var count = response.data.resultMap.subjects.list ? response.data.resultMap.subjects.list.length : 0
            for (var i = 0; i < count; i++) {
              var getData = {}
              getList = response.data.resultMap.subjects.list[i]
              getData.count = response.data.resultMap.subjects.count
              getData.time = getList.createDate
              getData.subtitle = getList.title
              getData.subcreator = getList.user.name
              getData.deadline = getList.deadline
              getData.fileURL = getList.fileURL
              getData.content = decodeURIComponent(getList.content)
              returnData.push(getData)
            }
            resolve(returnData)
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          }
        })
      })
      return promise
    },
    // 分页处理
    getTableData () {
      this.trashDateHandle()
    },
    // 页码触发更新
    pageChange (pageIndex) {
      this.pageIndex = pageIndex
      this.getTableData()
    },
    // 每页条数触发更新
    pageSizeChange (pageSize) {
      this.pageIndex = 1
      this.pageSize = pageSize
      this.getTableData()
    },
    sortChange (params) {
    }
  }
}
// 作业下载组件
Vue.component('sub-title-component', {
  template: `<span>
  <a class="g_a" :href='subDownload' :style='isDownloadSub' target='_blank' :title='subText'>{{rowData.subtitle}}</a>&nbsp;
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
    subText () {
      return (this.rowData.content !== undefined && this.rowData.content !== 'undefined' && this.rowData.content !== '') ? this.rowData.content : '无描述'
    },
    subDownload () {
      return (this.rowData.fileURL === '' || this.rowData.fileURL === 'undefined' || this.rowData.fileURL === undefined) ? 'javascript:void(0)' : this.rowData.fileURL
    },
    isDownloadSub () {
      return false
      // return (this.rowData.fileURL === '' || this.rowData.fileURL === 'undefined' || this.rowData.fileURL === undefined) ? { color: '#808080', cursor: 'default' } : { color: '#14a1e9' }
    }
  }
})
</script>

<style lang='stylus'>
  .work-data-table
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
