<template>
  <div id='memTree'>
    <el-tree
      :props='props'
      :load='loadNode'
      lazy
      ref='tree'
      show-checkbox
      empty-text='无数据'
      @check-change='handleCheckChange'
      >
    </el-tree>
  </div>
</template>

<script>
import { eventBus } from '@/util/eventBus'

export default {
  // props: ['subId'],
  components: {
    eventBus
  },
  data () {
    return {
      props: {
        label: 'name' // 指定某个属性值来显示
      },
      count: 1,
      checkDataArr: [],
      subId: ''
    }
  },
  methods: {
    // 获取学生数据
    getStuData (oId) {
      console.log('getStuData:' + oId)
      var stuNodeArr = []
      var stuPro = new Promise((resolve, reject) => {
        this.axios.get('/Martell/a/sys/userAPI/interface/findStudentsByOfficeId?userkey=' + localStorage.getItem('userkey') + '&officeId=' + oId + '&time=' + new Date().getTime()).then(response => {
          // console.log('student:' + JSON.stringify(response))
          if (Number(response.data.statusCode) === 200 && response.data.resultMap) {
            var students = response.data.resultMap.students
            for (var i in students) {
              var stuNodeVal = {}
              stuNodeVal.id = students[i].id
              stuNodeVal.name = students[i].name
              stuNodeVal.subGrade = '4'
              stuNodeVal.preGrade = 4
              stuNodeArr.push(stuNodeVal)
            }
            resolve(stuNodeArr)
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
            reject(new Error('权限不足或登录失效'))
          } else {
            reject(new Error('获取组员数据异常'))
          }
        }).catch(function (err) {
          console.log('服务器异常1' + err)
          alert('获取数据异常')
        })
      })
      return stuPro
    },
    // 获取部门数据
    getNodeData (oId, pGrade) {
      // console.log('getNodeData:' + oId)
      var nodeArr = []
      var nodePro = new Promise((resolve, reject) => {
        this.axios.get('/Martell/a/sys/officeAPI/interface/getBranchOfficeByParentId?userkey=' + localStorage.getItem('userkey') + '&officeId=' + oId + '&time=' + new Date().getTime()).then(response => {
          // console.log('测试：' + JSON.stringify(response))
          if (Number(response.data.statusCode) === 200 && response.data.resultMap) {
            var branchOfficeList = response.data.resultMap.branchOfficeList
            for (var i in branchOfficeList) {
              var nodeVal = {}
              nodeVal.id = branchOfficeList[i].id
              nodeVal.name = branchOfficeList[i].name
              nodeVal.subGrade = branchOfficeList[i].grade
              nodeVal.preGrade = pGrade
              nodeArr.push(nodeVal)
            }
            resolve(nodeArr)
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
            reject(new Error('权限不足或登录失效'))
          } else {
            reject(new Error('获取组员数据异常'))
          }
        }).catch(function (err) {
          console.log('服务器异常2' + err)
          alert('获取数据异常')
        })
      })
      return nodePro
    },
    getCheckedNodes () {
      if (this.$refs.tree.getCheckedNodes() !== undefined) {
        // console.log('getCheckedNodes:' + JSON.stringify(this.$refs.tree.getCheckedNodes()))
        var getCheckData = this.$refs.tree.getCheckedNodes()
        var checkData = []
        var userIds = []
        for (var k in getCheckData) {
          if (getCheckData[k].preGrade === 4 && getCheckData[k].id !== window.localStorage.getItem('userId')) { // 因为学生在节点树中为第4层
            checkData.push(getCheckData[k])
          }
        }
        for (var m in checkData) {
          userIds.push(checkData[m].id)
        }
        if (userIds.length !== undefined && userIds.length > 0) {
          var setUserData = new Promise((resolve, reject) => {
            this.axios.get(`/Martell/a/team/teamAPI/interface/testTeamMembersJoinTheTeam?userkey=${localStorage.getItem('userkey')}&subjectId=${this.subId}&userIds=${userIds}&time=${new Date().getTime()}`)
              .then(response => {
                // console.log('121212:' + JSON.stringify(response))
                if (response.data.resultMap && response.data.statusCode === '200') {
                  var successUsers = response.data.resultMap.successToAddUsers ? response.data.resultMap.successToAddUsers : ''
                  var failUesrs = response.data.resultMap.failToAddUsers ? response.data.resultMap.failToAddUsers : ''
                  var failUesrArr = []
                  for (var n in failUesrs) {
                    failUesrArr.push(failUesrs[n].name)
                  }
                  if (!successUsers) {
                    alert('所选同学均已加入该作业题目下其他小组，不能再添加')
                  } else if (failUesrArr.length > 0) {
                    alert('以下同学已加入该作业题目下其他小组，不能再添加：' + failUesrArr)
                  }
                  resolve(successUsers)
                } else if (Number(response.data.statusCode) === 401) {
                  alert(response.data.message)
                  this.exit()
                } else {
                  reject(new Error('操作异常'))
                }
              })
          })
          return setUserData
        } else {
        }
      }
    },
    handleCheckChange (data, checked, indeterminate) {
      // console.log('handleCheckChange:' + JSON.stringify(data) + ',checked:' + checked + ',indeterminate:' + indeterminate)
    },
    handleNodeClick (data, resolves, selNodeData) {
      // console.log('selNodeData:' + selNodeData)
      // !==则需要数值和类型都不相等
      var subNodeData = ''
      if (selNodeData) {
        subNodeData = this.getStuData(data.id)
      } else {
        subNodeData = this.getNodeData(data.id, data.preGrade + 1)
      }
      subNodeData.then(sData => {
        return resolves(sData)
      }).catch(err => {
        console.log('服务器异常3:' + err)
        return resolves([])
      })
    },
    loadNode (node, resolves) {
      // console.log('node.level:' + node.level)
      if (node.level === 0) {
        var nodeData = this.getNodeData(0, node.level)
        nodeData.then(nData => {
          return resolves(nData)
        }).catch(err => {
          console.log('服务器异常4:' + err)
          return resolves([])
        })
      } else if (node.level === 4) {
        this.handleNodeClick(node.data, resolves, true)
      } else {
        this.handleNodeClick(node.data, resolves, false)
      }
    }
  },
  mounted () {
    eventBus.$on('getSubId', (data) => {
      this.subId = data
    })
    eventBus.$on('getMemberData', () => {
      console.log('兄弟来了')
      var checkedMemberArr = []
      checkedMemberArr = this.getCheckedNodes()
      checkedMemberArr.then(response => {
        eventBus.$emit('showMemberData', response)
      })
        .catch(err => {
          alert(err)
        })
    })
  }
}
</script>

<style lang='stylus' scoped>
  #memTree
    flex 1
    height 100%
    padding 1px
    overflow-y scroll
    overflow-x hidden
    border 1px solid #D3D3D3
    border-radius 5px
    background-color #ffffff
    .el-tree
      min-width 100%
  ::-webkit-scrollbar
    width: 14px
  // 滚动槽
  ::-webkit-scrollbar-track
    // border-radius: 10px
  // 滚动条滑块
  ::-webkit-scrollbar-thumb
    border-radius:5px
    background:rgba(0,0,0,0.1)
  ::-webkit-scrollbar-thumb:window-inactive
    background: gray
</style>
