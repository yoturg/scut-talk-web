<template>
  <div class='container'>
    <page-header :isSelect='true'></page-header>
    <page-body>
      <group-header :title='title' :opeType='opeType'></group-header>
      <data-table></data-table>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import GroupHeader from './components/GroupHeader'
import DataTable from './components/joingroup/JoinGroupDataTable'
export default {
  name: 'addGroup',
  components: {
    GroupHeader,
    DataTable
  },
  data () {
    return {
      title: '加入小组',
      opeType: 'JOINGROUP'
    }
  }
}
</script>

<style lang='stylus' scoped>
  .container
    width: 100%
    height: 100%
    background: #f4f4f4
</style>
