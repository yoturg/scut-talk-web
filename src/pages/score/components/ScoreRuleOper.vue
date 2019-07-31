<template>
  <div id="rules-tem">
    <div id='rules'>
      <span>权重配置</span>
      <v-table
          is-horizontal-resize
          style='width:80%'
          :columns='columns'
          :table-data='tableData'
          row-hover-color='#eee'
          row-click-color='#edf7ff'
      ></v-table>
    </div>
    <button v-show="false">保存</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {field: 'category', title: '类别', width: 100, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test', isResize: true},
        {field: 'weight', title: '权重', width: 100, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test'},
        {field: 'score', title: '分值', width: 90, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'title-cell-class-name-test'}
      ],
      tableData: []
    }
  },
  created () {
    this.getWeightScore()
  },
  methods: {
    getWeightScore () {
      this.axios.get('/Martell/a/task/taskAPI/interface/findWeightScore?userkey=' + localStorage.getItem('userkey') + '&time=' + new Date().getTime()).then(response => {
        // console.log('findWeightScore:' + JSON.stringify(response))
        if (Number(response.data.statusCode) === 200) {
          var weigthDataArr = []
          var weightType = ['新建卡片', '评论', '发图片', '发音视频', '总计']
          var scoreArr = response.data.resultMap.score
          var weightArr = response.data.resultMap.weight
          for (var i = 0; i < scoreArr.length; i++) {
            var weightObj = {}
            weightObj.category = weightType[i]
            weightObj.weight = weightArr[i]
            weightObj.score = scoreArr[i]
            weigthDataArr.push(weightObj)
          }
          this.tableData = weigthDataArr
        } else if (Number(response.data.statusCode) === 401) {
          alert(response.data.message)
          this.exit()
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
>>>.title-cell-class-name-test
      background-color: #f3f3f3
      color: #666666
      font-size: 16px
>>>.gTableOper
      display flex
      justify-content space-around
>>>.gTableOper li a
      color #14a1e9
    #rules-tem
      width 600px
      margin 45px auto
      span
        margin-right 15px
        font-size 18px
      button
        float right
        margin-top 45px
        width 90px
        height 30px
        line-height 30px
        color #3fb2eb
        margin-top 45px
        margin-right 30px
        border 1px solid #3fb2eb
        border-radius 3px
        background #fff
        &hover {
          cursor pointer
          color #fff
          background-color #14a1e9
        }
        &focus {
          outline none
        }
    #rules
      display flex
      flex-direction row
</style>
