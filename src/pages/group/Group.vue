<template>
  <div class='container'>
    <page-header :isSelect='true'></page-header>
    <page-body>
      <group-header :title='title' :opeType='opeType'></group-header>
      <group-data-table></group-data-table>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import GroupHeader from './components/GroupHeader'
import GroupDataTable from './components/grouppage/GroupDataTable'

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
    GroupDataTable
  }
}
</script>

<style lang="stylus" scoped>
  .title-cell-class-name-test
    background-color: #14a1e9
    color: #fff
    font-size: 16px
</style>
