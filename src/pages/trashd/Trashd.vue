<template>
  <div class='container'>
    <page-header :isSelect='true'></page-header>
    <page-body>
      <trash-header></trash-header>
      <trash-data-table></trash-data-table>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import TrashHeader from './components/TrashHeader.vue'
import TrashDataTable from './components/TrashDataTable.vue'
export default {
  components: {
    TrashHeader,
    TrashDataTable
  }
}
</script>

<style lang='stylus' scoped>
.container {
    width: 100%;
    height: 100%;
    background: #f4f4f4;
}
</style>
