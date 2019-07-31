<template>
  <div id="score">
    <div>组名 &nbsp;<span>{{groupName}}</span></div>
    <div>作业题目 &nbsp;<span>{{subTitle}}</span></div>
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
    <button class="g_button" @click="saveScore">保存</button>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data () {
    return {
      // groupScore: '',
      groupName: '',
      subTitle: '',
      pageIndex: 1,
      pageSize: 6,
      total: 0,
      columns: [
        {field: 'userName', title: '姓名', width: 100, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true, isResize: true},
        {field: 'cardNum', title: '新建卡片数', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'score-detail', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'postNum', title: '评论数', width: 90, titleAlign: 'center', columnAlign: 'center', componentName: 'score-detail', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'imageNum', title: '发图片数', width: 90, titleAlign: 'center', columnAlign: 'center', componentName: 'score-detail', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'videoNum', title: '发文件数', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'coinNumber', title: '积分币数', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'referenceFraction', title: '组长评分', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'oldScore', title: '上次评分', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', overflowTitle: true},
        {field: 'scoreOper', title: '评分', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', isEdit: true}
      ],
      tableData: [],
      scoreGroupId: '',
      scoreSub: '',
      taskId: ''
    }
  },
  created () {
    // console.log('获取' + JSON.stringify(this.$route.params))
    if (this.$route.params.groupId !== undefined && this.$route.params.groupId !== '') {
      this.scoreGroupId = this.$route.params.groupId
      this.scoreSub = this.$route.params.subId
      window.localStorage.setItem('scoreGroupId', this.scoreGroupId)
      window.localStorage.setItem('scoreSub', this.scoreSub)
    } else {
      this.scoreGroupId = window.localStorage.getItem('scoreGroupId')
      this.scoreSub = window.localStorage.getItem('scoreSub')
    }
    this.getGroupData()
  },
  methods: {
    getGroupData () {
      this.axios.get(`/Martell/a/team/subjectAPI/interface/findSubjectInfoById?userkey=${localStorage.getItem('userkey')}&teamId=${this.scoreGroupId}&subjectId=${this.scoreSub}&time=${new Date().getTime()}`)
        .then(response => {
          // console.log('获取数量:' + JSON.stringify(response))
          if (response.data.resultMap && response.data.statusCode === '200') {
            this.groupName = response.data.resultMap.teamName
            this.subTitle = response.data.resultMap.subjectTitle
            var scoreArr = []
            var scoreData = response.data.resultMap.subjectInfo
            for (var i in scoreData) {
              var scoreObj = {}
              scoreObj.taskId = response.data.resultMap.task.id
              scoreObj.id = scoreData[i].user.id
              scoreObj.userName = scoreData[i].user.name ? scoreData[i].user.name : ''
              scoreObj.postNum = scoreData[i].user.postNum
              scoreObj.imageNum = scoreData[i].user.imageNum
              scoreObj.videoNum = scoreData[i].user.videoNum
              scoreObj.cardNum = scoreData[i].user.cardNum
              scoreObj.coinNumber = scoreData[i].user.moneyNum
              scoreObj.ordinaryScore = scoreData[i].user.scoreNum
              scoreObj.roleNames = scoreData[i].user.roleNames
              scoreObj.oldScore = scoreData[i].user.score
              scoreObj.referenceFraction = scoreData[i].user.referenceFraction
              scoreObj.scoreOper = ''
              scoreArr.push(scoreObj)
            }
            // console.log('scoreArr:' + JSON.stringify(scoreArr))
            this.tableData = scoreArr
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            alert(response.data.message)
          }
        })
    },
    cellEditDone (newValue, oldValue, rowIndex, rowData, field) {
      this.tableData[rowIndex][field] = newValue
    },
    saveScore () {
      var scoreOperVals = []
      var scoreUserIds = []
      var scoreTaskId = ''
      var re = /^(?:[1-9]?\d|100)$/
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].scoreOper !== '' && !re.test(this.tableData[i].scoreOper)) {
          return alert(this.tableData[i].scoreOper + ' 内容不符合，请输入0-100的数值')
        } else if (this.tableData[i].scoreOper === '') {
          scoreOperVals.push(this.tableData[i].referenceFraction)
          scoreUserIds.push(this.tableData[i].id)
        } else {
          scoreOperVals.push(this.tableData[i].scoreOper)
          scoreUserIds.push(this.tableData[i].id)
        }
      }
      scoreTaskId = this.tableData[0].taskId
      // console.log('分数：' + scoreOperVals + ',userIds：' + scoreUserIds + ',taskiD:' + scoreTaskId)
      this.axios.put(`/Martell/a/task/taskAPI/interface/updateTaskTeamSocre/${scoreUserIds.join(',')}&${scoreOperVals.join(',')}&${window.localStorage.getItem('userId')}&${scoreTaskId}?userkey=${localStorage.getItem('userkey')}`).then(response => {
        // console.log('res:' + JSON.stringify(response))
        if (response.data.statusCode === '200') {
          alert(response.data.message)
          this.$router.go(-1)
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        } else {
          alert(response.data.message)
        }
        scoreOperVals.splice(0, scoreOperVals.length)
        scoreUserIds.splice(0, scoreUserIds.length)
        scoreTaskId = ''
      })
    }
  }
}
Vue.component('score-detail', {
  template: `<span class="tableOpt" @click="getDetails">{{num}}</span>`,
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
    getDetails () {
      let params = {rowData: this.rowData, field: this.field}
      // console.log(this.rowData)
      this.$router.push({name: 'DetailedScore', params})
    }
  },
  computed: {
    num () {
      return this.rowData[this.field]
    }
  }
})
</script>

<style lang="stylus" scoped>
  >>>.tableOpt
    cursor: pointer
    color: #666666
    &:hover
      text-decoration: underline
  #score
    width 920px
    margin 0 auto
    div
      margin 15px 0
      &:first-child
        span
          margin-left 52px
      &:nth-child(2)
        span
          margin-left 20px
      &:nth-child(3)
        height 25px
        input
          height 25px
          margin-left 15px
          padding-left 5px
          border-radius 3px
          border 1px solid #e1e1e1
    button
      float right
      margin-top 10px
  >>>.title-cell-class-name-test
        background-color: #f3f3f3
        color: #666666
        font-size: 16px

  >>>.gTableOper
        display flex
        justify-content space-around

  >>>.gTableOper li a
        color #14a1e9

</style>
