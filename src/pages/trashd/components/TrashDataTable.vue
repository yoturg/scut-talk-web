<template>
  <div class='data-table'>
    <v-table
      is-horizontal-resize
      style='width:100%'
      :columns='columns'
      :table-data='tableData'
      :column-cell-class-name='columnCellClass'
      row-hover-color='#eee'
      row-click-color='#edf7ff'
      @sort-change='sortChange'
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
  name: 'data-table',
  data: function () {
    return {
      GetData: [], // 获取数据
      pageIndex: 1, // 页码
      pageSize: 6, // 每页条数
      total: 0, // 数据总条数
      columns: [
        {
          field: 'groupname',
          title: '组名',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          titleCellClassName: 'title-cell-class-name-test',
          overflowTitle: true,
          isResize: true
        },
        // {
        //   field: 'classname',
        //   title: '班级',
        //   width: 100,
        //   titleAlign: 'center',
        //   orderBy: 'asc',
        //   columnAlign: 'center',
        //   titleCellClassName: 'title-cell-class-name-test'
        // },
        {
          field: 'createtime',
          title: '创建时间',
          width: 140,
          titleAlign: 'center',
          columnAlign: 'center',
          titleCellClassName: 'title-cell-class-name-test',
          overflowTitle: true
        },
        {
          field: 'modificationtime',
          title: '修改时间',
          width: 140,
          titleAlign: 'center',
          columnAlign: 'center',
          titleCellClassName: 'title-cell-class-name-test',
          overflowTitle: true
        },
        // {
        //   field: 'homeworknum',
        //   title: '作业编号',
        //   width: 90,
        //   titleAlign: 'center',
        //   orderBy: 'asc',
        //   columnAlign: 'center',
        //   titleCellClassName: 'title-cell-class-name-test'
        // },
        {
          field: 'homeworktitle',
          title: '作业题目',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          titleCellClassName: 'title-cell-class-name-test',
          overflowTitle: true,
          isResize: true
        },
        {
          field: 'state',
          title: '小组状态',
          width: 90,
          titleAlign: 'center',
          columnAlign: 'center',
          titleCellClassName: 'title-cell-class-name-test',
          overflowTitle: true
        },
        {
          field: 'custome-adv',
          title: '操作',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'trash-table-operation',
          titleCellClassName: 'title-cell-class-name-test'
        }
      ],
      tableData: [
      ]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 数据获取
    GetTrashData () {
      var p = new Promise((resolve, reject) => {
        this.axios.get(
          '/Martell/a/team/teamAPI/interface/getUserDelTeams?userkey=' + localStorage.getItem('userkey') + '&userId=' + window.localStorage.getItem('userId') + '&time=' + new Date().getTime()
        )
          .then(response => {
            // console.log('垃圾箱：' + JSON.stringify(response))
            if (Number(response.data.statusCode) === 200) {
              if (response.data.resultMap) {
                var trashObjArr = []
                var delTeams = response.data.resultMap.delTeams
                for (var i in delTeams) {
                  var trashObj = {}
                  trashObj.groupId = delTeams[i].id
                  trashObj.groupname = delTeams[i].name
                  trashObj.classname = ''
                  trashObj.createtime = delTeams[i].createDate
                  trashObj.modificationtime = delTeams[i].updateDate
                  trashObj.homeworknum = ''
                  trashObj.homeworktitle = delTeams[i].subject.title
                  trashObj.state = delTeams[i].stateCode === '0' ? '已完成' : (delTeams[i].stateCode === '1' ? '进行中' : '未完成')
                  trashObjArr.push(trashObj)
                }
                resolve(trashObjArr)
              } else {
                resolve([])
              }
            } else if (Number(response.data.statusCode) === 401) {
              alert(response.data.message)
              this.exit()
            } else {
              reject(new Error('Incorrect operation, unable to get data.'))
            }
          })
          .catch(function (response) {
            console.log(response) // 发生错误时执行的代码
            // alert('服务器异常')
          })
      })
      return p
    },
    // 数据处理
    trashDateHandle () {
      var tDates = this.GetTrashData()
      tDates.then(trashDates => {
        const data = trashDates
        var pageData = []
        pageData = pageData.concat(data)
        this.GetData = pageData
        this.total = this.GetData.length
        this.tableData = this.GetData.slice(
          (this.pageIndex - 1) * this.pageSize,
          this.pageIndex * this.pageSize
        )
      }).catch(err => {
        console.log(err)
        alert('没有数据')
      })
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
    // 条件查询
    selectData () {
      this.pageIndex = 1
      this.trashDateHandle()
      this.tableData = this.GetData.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      )
    },
    // 删除数据
    deleData () {
      this.selectData()
      this.SelectObj = []
    },
    sortChange (params) {
    },
    columnCellClass (rowIndex, columnName, rowData) {
      if (columnName === 'titlebuilding') {
        return 'column-cell-class-name-titlebuilding'
      }
      if (columnName === 'state') {
        return 'column-cell-class-name-state'
      }
    },
    // 刷新数据
    flushTrashData () {
      this.trashDateHandle()
    }
  },
  mounted () {
    eventBus.$on('flushTrashData', () => {
      this.flushTrashData()
    })
  }
}
Vue.component('trash-table-operation', {
  template: `<span class='trashOper'>
            <a class="g_a" href='javascript:;' @click='recoveryTrash'>撤销&nbsp;</a>
            <a class="g_a" href='javascript:;' @click='delTrashDeta'>删除</a>
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
    recoveryTrash () {
      if (confirm('请问是否确定撤销？')) {
        this.axios.put('/Martell/a/team/teamAPI/interface/recoveryTeamFromDustbin?teamId=' + this.rowData.groupId + '&userkey=' + localStorage.getItem('userkey'))
          .then(response => {
            if (Number(response.data.statusCode) === 200) {
              alert(response.data.message)
              eventBus.$emit('flushTrashData')
            } else if (Number(response.data.statusCode) === 401) {
              alert(response.data.message)
              this.exit()
            } else {
              alert(response.data.message)
            }
          })
      }
    },
    delTrashDeta () {
      if (confirm('请问是否完成删除？')) {
        this.axios.delete(`/Martell/a/team/teamAPI/interface/delTeamFromDustbin/${window.localStorage.getItem('userId')}&${this.rowData.groupId}?userkey=${localStorage.getItem('userkey')}`)
          .then(response => {
            if (Number(response.data.statusCode) === 200) {
              alert(response.data.message)
              eventBus.$emit('flushTrashData')
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

<style lang='stylus' scoped>
.data-table
  width: 61.5rem;
  font-size: 14px;
  margin-left: 40px;
  .pagination
    width: 100%;
    padding-top: 12px;
    padding-left: 400px;

>>>.title-cell-class-name-test
      background-color: #f3f3f3
      color: #666666
      font-size: 16px

>>>.trashOper
      display flex
      justify-content space-around

>>>.v-page-select
      display none
</style>
