<template>
  <div class="container">
    <page-header :isSelect="true"></page-header>
    <page-body>
      <head-work></head-work>
      <work-table></work-table>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import headWork from './homeworkList/headWork'
import searchWork from './homeworkList/searchWork'
import workTable from './homeworkList/workTable'
export default {
  name: 'homeworkList',
  components: {
    headWork,
    searchWork,
    workTable
  }
}
</script>

<style lang="stylus" scoped>
  .container
    width: 100%
    height: 100%
    background: #f4f4f4
</style>
