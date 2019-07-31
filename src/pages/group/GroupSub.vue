<template>
  <div class='container'>
    <page-header :isSelect='true'></page-header>
    <page-body>
      <group-header :title='title' :opeType='opeType'></group-header>
      <group-sub-data-table></group-sub-data-table>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import GroupHeader from './components/GroupHeader.vue'
import GroupSubDataTable from './components/groupsub/GroupSubDataTable.vue'

export default {
  name: 'Group',
  data () {
    return {
      title: '分 组',
      opeType: 'GROUP'
    }
  },
  components: {
    GroupHeader,
    GroupSubDataTable
  },
  created () {
    if (this.$route.params.type === 'GROUP_SUB') {
      window.localStorage.setItem('cacheTitle', this.$route.params.title)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .title-cell-class-name-test
    background-color: #14a1e9
    color: #fff
    font-size: 16px
</style>
