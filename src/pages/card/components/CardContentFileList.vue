<template>
  <div class="card-content-file-list">
    <happy-scroll color="rgba(102,102,102)" size="8" resize>
      <div>
        <div v-if="isFirstCard" class="divide">
          <h2>分工安排</h2>
          <p>小组成员：{{teamMembers}}</p>
          <div class="divideplan">
            <h3>分工</h3>
            <div class="dividetext">{{divideData.divideTheWork}}</div>
          </div>
        </div>
        <div class="file-list">
          <h2>文件列表</h2>
          <div class="file-name">
            文件名<input type="text" v-model="searchValue">
          </div>
          <v-table
            is-horizontal-resize
            style='width:100%'
            :columns='columns'
            :table-data='tableData'
            :paging-index='(pageIndex-1)*pageSize'
            :column-cell-class-name='columnCellClass'
            row-hover-color='#eee'
            row-click-color='#edf7ff'
          ></v-table>
          <div style='padding:20px 0;float:right;'>
            <v-pagination @page-change='pageChange' :total='total' :page-size='pageSize' :layout="['total', 'prev', 'pager', 'next', 'jumper',]">
            </v-pagination>
          </div>
        </div>
      </div>
    </happy-scroll>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'card-content-file-list',
  props: {
    cardId: {
      default: ''
    }
  },
  data () {
    var columns = [
      {field: 'fileName', title: '文件名', width: 198, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'createDate', title: '上传时间', width: 105, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
      {field: 'groupcreator', title: '操作', width: 117, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, componentName: 'card-table-operation'},
      {field: 'createBy', title: '上传用户', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true}
    ]
    return {
      pageIndex: 1, // 页码
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数
      columns,
      tableData: [],
      divideData: {},
      searchValue: ''
    }
  },
  methods: {
    getFile (args) {
      let param = {}
      param.userkey = localStorage.userkey
      param.cardId = window.localStorage.cardId
      param.pageSize = this.pageSize
      param.pageNo = this.pageIndex
      if (args || (!args && JSON.stringify(this.searchValue) !== '')) {
        param.fileName = args || this.searchValue
      }
      param.time = new Date().getTime()
      this.axios.get('/Martell/a/team/postAPI/interface/getPostFilesByCardId', {params: param}).then((response) => {
        if (Number(response.data.statusCode) === 200) {
          this.total = response.data.resultMap.count
          this.pageIndex = response.data.resultMap.pogeNo
          if (response.data.resultMap.postFiles) {
            this.tableData = response.data.resultMap.postFiles
          } else {
            this.tableData = []
          }
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      })
    },
    getDivideTheWork () {
      if (window.localStorage.groupId) {
        var param = {'userkey': localStorage.userkey, 'teamId': window.localStorage.groupId, 'time': new Date().getTime()}
        this.axios.get('/Martell/a/team/teamAPI/interface/getTeamInfoByTeamId', {params: param}).then((response) => {
          // console.log(response)
          if (Number(response.data.statusCode) === 200) {
            this.divideData = response.data.resultMap
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          }
        })
      }
    },
    columnCellClass () {
      return 'table-style'
    },
    pageChange (pageIndex) {
      this.pageIndex = pageIndex
      this.getFile()
    }
  },
  computed: {
    teamMembers () {
      if (this.divideData.teamMembers) {
        let teamMembersname = []
        for (let m in this.divideData.teamMembers) {
          teamMembersname.push(this.divideData.teamMembers[m].name)
        }
        return teamMembersname.join('、')
      } else {
        return '暂无成员'
      }
    },
    isFirstCard () {
      return this.cardId === this.divideData.firstCardId
    }
  },
  mounted () {
    this.getFile()
    this.getDivideTheWork()
  },
  watch: {
    cardId () {
      this.getFile()
      this.getDivideTheWork()
    },
    searchValue (val) {
      this.getFile(val)
    }
  }
}

Vue.component('card-table-operation', {
  template: `<ul class='tableOper'>
                <li><a class="g_a" :href="rowData.fileURL" target="_blank" download="">下载</a></li>
                <li class="g_a" @click="deleteFile">删除</li>
              </ul>`,
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
    deleteFile () {
      let param = {}
      param.userkey = localStorage.userkey
      param.postId = this.rowData.postId
      param.fileName = this.rowData.fileName
      if (window.localStorage.userId) {
        param.userId = window.localStorage.userId
      } else {
        alert('请重新登录')
      }
      let deleteURL = `/Martell/a/team/postAPI/interface/deletePostFile/
      ${this.rowData.postId}`
      this.axios.delete(deleteURL, {params: param}).then(response => {
        if (Number(response.data.statusCode) === 200) {
          alert('删除成功，请重新刷新页面')
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        } else {
          alert(response.data.message)
        }
      })
    }
  }
})
</script>

<style lang="stylus" scoped>
  >>>.title-cell-class-name-test
    background-color: #f3f3f3
    color: #666666
    font-size: 16px
  // >>>.table-style
  //   font-size: 12px
  //   color: #666666
  //   background: #eeeeee
  listHeaderHeight = 55px
  cardBodyHeight = 627px
  h2
    font-size: 22px
    color: #6a7d8e
    line-height: 50px
    margin-left: 5px
  .card-content-file-list
    background: #fff
    width: 735px
    height: cardBodyHeight - listHeaderHeight
    margin: 0 auto
    border: 1px solid #aaaaaa
    border-radius: 10px
    padding-bottom: 15px
    overflow: hidden
    position: relative
    .divide
      padding: 15px 22px 0 22px
      p
        font-size: 15px
        color: #333333
        margin-left: 5px
      .divideplan
        width: 675px
        border-bottom: 1px solid #aaaaaa
        position: relative
        h3
          font-size: 15px
          font-weight: normal
          color: #333
          position: absolute
          left: 37px
          top: 15px
        .dividetext
          width: 594px
          height: 117px
          resize: none
          padding: 10px
          margin: 14px 0 22px 80px
          border: 1px solid #14a1e9
          border-radius: 3px
    .file-list
      padding: 15px 22px 0 22px
      .file-name
        width: 100%
        padding-left: 19px
        padding-bottom: 15px
        color: #484848
        font-size: 15px
        input
          width: 225px
          height: 35px
          border: 1px solid #e3e3e3
          border-radius: 3px
          margin-left: 15px
</style>
