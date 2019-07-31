<template>
  <div id="memList">
    <div id='checkbox'>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    </div>
    <el-checkbox-group v-model="checkedMembers" @change="handleCheckedMembersChange">
      <div>
        <el-checkbox v-for="member in members" :label="member" :key="member">{{member}}</el-checkbox>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
import { eventBus } from '@/util/eventBus'
import { unique } from '@/util/tool'

var memberOptions = [] // 右侧显示的数据内容
var memberObjArr = [] // 添加的学生数据
var checkedMemArr = [] // 右侧勾选的学生
export default {
  data () {
    return {
      checkAll: false,
      checkedMembers: [],
      members: memberOptions,
      isIndeterminate: true
    }
  },
  created () {
    // console.log('置空')
    memberOptions.splice(0, memberOptions.length)
    memberObjArr.splice(0, memberObjArr.length)
    checkedMemArr.splice(0, checkedMemArr.length)
  },
  methods: {
    // 点击全选，勾选为true，不勾选为false
    handleCheckAllChange (val) {
      checkedMemArr = memberOptions
      this.checkedMembers = val ? memberOptions : []
      this.isIndeterminate = false
    },
    // 单独点击某个勾选框，value 为处于勾选状态的数据数组
    handleCheckedMembersChange (value) {
      let checkedCount = value.length
      checkedMemArr = value
      this.checkAll = checkedCount === this.members.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.members.length
    },
    // 返回member数组
    getMemArr () {
      var memberIds = []
      for (var r in memberObjArr) {
        memberIds.push(memberObjArr[r].id)
      }
      return memberIds
    }
  },
  mounted () {
    eventBus.$on('showMemberData', (data) => {
      // console.log('收到了兄弟' + JSON.stringify(data))
      if (!memberObjArr.length) {
        for (var i in data) {
          var obj = {}
          memberOptions.push(data[i].name)
          obj.id = data[i].id
          obj.name = data[i].name
          memberObjArr.push(obj)
        }
      } else {
        for (var k in data) {
          var count = true
          var obj2 = {}
          for (var m in memberObjArr) {
            if (memberObjArr[m].id === data[k].id) {
              count = false
            }
          }
          if (count) {
            memberOptions.push(data[k].name)
            obj2.id = data[k].id
            obj2.name = data[k].name
            memberObjArr.push(obj2)
          }
        }
      }
      // console.log('memberOptions------:' + memberOptions)
      // console.log('memberObjArr------:' + JSON.stringify(memberObjArr))
      this.$emit('getMember', this.getMemArr())
    })
    eventBus.$on('delMemberData', () => {
      // console.log('收到删除指示:' + JSON.stringify(memberObjArr) + ',c:' + checkedMemArr)
      if (checkedMemArr !== []) {
        memberObjArr = unique(memberObjArr, checkedMemArr)
        memberOptions = []
        this.members = []
        for (var n in memberObjArr) {
          memberOptions.push(memberObjArr[n].name)
        }
        this.members = memberOptions
      }
      this.$emit('getMember', this.getMemArr())
    })
  }
}
</script>

<style lang="stylus" scoped>
  #memList
    flex 1
    padding 1px
    border 1px solid #D3D3D3
    border-radius 5px
    background-color #ffffff
  #checkbox
    width 90%
    height 27px
    margin-left 15px
    margin-top 7px
    position relative
    border-bottom 1px solid #b9bcbd
  .el-checkbox-group
    width 262px
    height 155px
    margin-left 30px
    margin-top 8px
    overflow-y scroll
    overflow-x hidden
  .el-checkbox-group>div
    width 30px
    .el-checkbox
      margin-left 0
</style>
