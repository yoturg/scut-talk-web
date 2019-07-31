<template>
  <div class='work-data-table'>
    <search-work></search-work>
    <v-table
      is-horizontal-resize
      style='width:100%'
      :columns='columns'
      :table-data='tableData'
      :paging-index='(pageIndex-1)*pageSize'
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
import searchWork from './searchWork'
import { eventBus } from '@/util/eventBus'

Vue.component('operation', {
  template: `<div class="operation">
  <span><a class="g_a" href='javascript:;' @click='updatawork'>修改</a></span>
  <span><a class="g_a" :href='downWork' :style='isDownloadWork' target='_blank'>文件下载</a></span>
  </div>`,
  // <span><a href='javascript:;' @click='delectwork'>删除</a></span> 关闭老师删除作业题目功能
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
    downWork () {
      return (this.rowData.fileURL === undefined || this.rowData.fileURL === '' || this.rowData.fileURL === 'undefined') ? 'javascript:void(0)' : this.rowData.fileURL
    },
    isDownloadWork () {
      return (this.rowData.fileURL === undefined || this.rowData.fileURL === '' || this.rowData.fileURL === 'undefined') ? { color: '#808080', cursor: 'default' } : {}
    }
  },
  methods: {
    delWork (id) {
      this.axios
        .delete(
          `/Martell/a/team/subjectAPI/interface/deleteSubject/${
            this.rowData.id
          }&${window.localStorage.getItem(
            'userId'
          )}?userkey=${localStorage.getItem('userkey')}`
        )
        .then(response => {
          if (Number(response.data.statusCode) === 200) {
            alert('删除成功')
            eventBus.$emit('flushGroupData')
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            alert('删除失败')
          }
        })
    },
    delectwork () {
      if (confirm('你确定删除吗？')) {
        this.delWork(this.rowData.groupId)
      } else {
      }
    },
    updatawork () {
      let param = { subjectId: this.rowData.id, type: 'EDIT' }
      window.localStorage.setItem('workContentStatus', 'EDIT')
      this.$router.push({ name: 'addhomework', params: param })
    }
  }
})
export default {
  name: 'work-data-table',
  components: {
    searchWork
  },
  data: function () {
    return {
      title: '',
      tableData: [],
      total: 0,
      columns: [
        {
          field: 'number',
          title: '作业编号',
          width: 110,
          titleAlign: 'center',
          columnAlign: 'center',
          titleCellClassName: 'title-cell-class-name-test',
          overflowTitle: true,
          isResize: true
        },
        {
          field: 'title',
          title: '题目名称',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          titleCellClassName: 'title-cell-class-name-test',
          overflowTitle: true,
          isResize: true
        },
        {
          field: 'createDate',
          title: '创建时间',
          width: 110,
          titleAlign: 'center',
          columnAlign: 'center',
          titleCellClassName: 'title-cell-class-name-test',
          overflowTitle: true,
          isResize: true
        },
        // {field: 'updateDate', title: '修改时间', width: 110, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', isResize: true},
        {
          field: 'deadline',
          title: '截止时间',
          width: 110,
          titleAlign: 'center',
          columnAlign: 'center',
          titleCellClassName: 'title-cell-class-name-test',
          overflowTitle: true,
          isResize: true
        },
        {
          field: 'custome-adv',
          title: '操作',
          width: 110,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'operation',
          titleCellClassName: 'title-cell-class-name-test',
          isResize: true
        }
      ],
      pageIndex: 1,
      pageSize: 6,
      subTitle: ''
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 数据获取
    getData () {
      var pWorkTable = new Promise((resolve, reject) => {
        this.axios
          .get(
            '/Martell/a/team/subjectAPI/interface/findTeacherAllSubject?userkey=' +
              localStorage.getItem('userkey') +
              '&teacherId=' +
              window.localStorage.getItem('userId') +
              '&title=' +
              this.subTitle +
              '&pageSize=' +
              this.pageSize +
              '&pageNo=' +
              this.pageIndex +
              '&time=' +
              new Date().getTime()
          )
          .then(response => {
            // console.log('获取作业:' + JSON.stringify(response))
            this.total = response.data.resultMap.subjects.count
            if (Number(response.data.statusCode) === 200) {
              let workObjArr = []
              let workInfos = []
              workInfos = response.data.resultMap.subjects.list
              for (let i in workInfos) {
                let workObj = {}
                workObj.id = workInfos[i].id
                workObj.title = workInfos[i].title
                workObj.number = workInfos[i].number
                workObj.createDate = workInfos[i].createDate
                workObj.deadline = workInfos[i].deadline
                workObj.fileURL = workInfos[i].fileURL
                workObjArr.push(workObj)
              }
              resolve(workObjArr)
            } else if (Number(response.data.statusCode) === 401) {
              alert(response.data.message)
              this.exit()
            } else {
              alert(response.data.message)
            }
          })
          .catch(function (response) {
            console.log('err:' + response)
            alert('服务器异常')
          })
      })
      return pWorkTable
    },
    // 数据处理
    handleData () {
      var dates = this.getData()
      dates
        .then(Dates => {
          const data = Dates
          var pageData = []
          pageData = pageData.concat(data)
          this.tableData = pageData
        })
        .catch(err => {
          console.log('err:' + err)
          alert('服务器异常')
        })
    },
    // 分页处理
    getTableData () {
      this.handleData()
    },
    // 页码触发更新
    pageChange (pageIndex) {
      this.pageIndex = pageIndex
      this.getTableData()
    },
    // 条件查询
    searchTitle (title) {
      this.pageIndex = 1
      this.subTitle = title
      this.handleData()
    }
  },
  mounted () {
    eventBus.$on('flushGroupData', () => {
      this.getTableData()
    })
  }
}
</script>

<style lang='stylus' scoped>
>>>.title-cell-class-name-test {
  background-color: #f3f3f3
  color: #666666
  font-size: 16px
}

>>>.column-cell-class-name-titlebuilding {
  color: #14a1e9
}

>>>.column-cell-class-name-state {
  color: black
}

>>>.colum-cell-name-state-color {
  background-color: green
}

// >>>.operation {
//   span {
//     a {
//       color: #14a1e9
//       cursor: pointer
//     }
//   }
// }

>>>.title-cell-color {
  backround: #14a1e9
  color: #fff
}

.work-data-table {
  width: 86%
  margin: 0 auto

  .pagination {
    width: 100%
    padding-top: 12px
    padding-left: 400px
  }
}
</style>
