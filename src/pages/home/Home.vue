<template>
  <div class="container">
    <page-header :isSelect="true"></page-header>
    <page-body>
      <botton-list></botton-list>
      <data-table></data-table>
      <div v-show='isShowWork'>
        <work-title></work-title>
        <work-situation></work-situation>
      </div>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import BottonList from './components/BottonList'
import DataTable from './components/DataTable'
import WorkSituation from './components/WorkSituation'
import WorkTitle from './components/WorkTitle'
export default {
  name: 'Home',
  components: {
    BottonList,
    DataTable,
    WorkSituation,
    WorkTitle
  },
  data () {
    return {
      isShowWork: false
    }
  },
  created () {
    this.isShowWork = window.localStorage.getItem('userRole').includes('学生')
  }
}
</script>

<style lang="stylus" scoped>
  .container
    width: 100%
    height: 100%
    background: #f4f4f4
</style>
