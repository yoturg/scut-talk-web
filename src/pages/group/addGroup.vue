<template>
  <div class='container'>
    <page-header :isSelect='true'></page-header>
    <page-body>
      <group-header :title='title' :opeType='opeType'></group-header>
      <group-content ref="GroupContent"></group-content>
      <group-memer ref="GroupMemer"></group-memer>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import GroupHeader from './components/GroupHeader.vue'
import GroupContent from './components/addgroup/GroupContent.vue'
import GroupMemer from './components/addgroup/GroupMemer'
import { eventBus } from '@/util/eventBus'
export default {
  name: 'Group',
  components: {
    GroupHeader,
    GroupContent,
    GroupMemer,
    eventBus
  },
  data () {
    return {
      menuName: 'menuName',
      student: '',
      title: '新建小组',
      opeType: 'ADDGROUP',
      parTag: true,
      editGroupId: ''
    }
  },
  created () {
    if (this.$route.params.type === 'EDIT' || window.localStorage.getItem('handleGroup') === 'EDIT') {
      this.title = '编辑小组'
      this.parTag = false
      this.editGroupId = window.localStorage.getItem('editStorageGroupId')
    }
  },
  mounted () {
    // 在新建小组点击保存
    eventBus.$on('ADDGROUP', () => {
      var addGroupData = {}
      var strUrl = this.parTag ? '/Martell/a/team/teamAPI/interface/createNewTeam' : '/Martell/a/team/teamAPI/interface/updateTeamInfoById/' + window.localStorage.getItem('editStorageGroupId')
      addGroupData.name = this.$refs.GroupContent.groupName
      addGroupData.userId = window.localStorage.getItem('userId')
      addGroupData.subjectId = this.$refs.GroupContent.selWorkId
      addGroupData.divideTheWork = this.$refs.GroupContent.textareaData
      addGroupData.userIds = this.$refs.GroupMemer.memberArr
      addGroupData.remarks = ''
      // console.log('addGroupData:' + JSON.stringify(addGroupData))
      if (addGroupData.name === '' || addGroupData.name === undefined) {
        alert('组名不能为空')
        eventBus.$emit('setSaveGroupBtn')
      } else if (addGroupData.subjectId === '' || addGroupData.subjectId === undefined) {
        alert('请选择作业题目')
        eventBus.$emit('setSaveGroupBtn')
      } else if (this.parTag) {
        // 新建操作
        var groupParams = new FormData()
        groupParams.append('userkey', localStorage.getItem('userkey'))
        groupParams.append('name', addGroupData.name)
        groupParams.append('userId', addGroupData.userId)
        groupParams.append('subjectId', addGroupData.subjectId)
        groupParams.append('divideTheWork', addGroupData.divideTheWork)
        groupParams.append('userIds', addGroupData.userIds)
        groupParams.append('remarks', addGroupData.remarks)
        // console.log('groupParams:' + JSON.stringify(groupParams))
        this.axios.post(strUrl, groupParams).then(response => {
          // console.log('respon:' + JSON.stringify(response))
          if (Number(response.data.statusCode) === 200) {
            alert('新建成功')
            this.$router.push({name: 'Home'})
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            // console.log('新建异常')
            alert(response.data.message)
            eventBus.$emit('setSaveGroupBtn')
          }
        })
      } else if (!this.parTag) {
        // 编辑操作
        this.axios.put(strUrl + '?userId=' + window.localStorage.getItem('userId') + '&name=' + addGroupData.name + '&divideTheWork=' + encodeURIComponent(addGroupData.divideTheWork) +
        '&subjectId=' + addGroupData.subjectId + '&userIds=' + addGroupData.userIds + '&userkey=' + localStorage.getItem('userkey')).then(response => {
          // console.log('编辑:' + JSON.stringify(response))
          if (Number(response.data.statusCode) === 200) {
            alert('编辑成功')
            window.localStorage.setItem('handleGroup', '')
            window.localStorage.setItem('editStorageGroupId', '')
            // this.$router.push({name: 'Home'})
            this.$router.back(-1)
          } else if (Number(response.data.statusCode) === 401) {
            alert(response.data.message)
            this.exit()
          } else {
            // console.log('编辑异常')
            alert(response.data.message)
            eventBus.$emit('setSaveGroupBtn')
          }
        })
      }
    })
  }
}
</script>
<style lang='stylus' scoped>
</style>
