<template>
  <div class="container">
    <page-header :isSelect="true"></page-header>
    <page-body>
      <new-work-head :title='title' :opeType='opeType'></new-work-head>
      <new-work-content></new-work-content>
    </page-body>
    <page-footer></page-footer>
  </div>
</template>

<script>
import newWorkHead from './addhomework/newWorkHead'
import newWorkContent from './addhomework/newWorkContent'
export default {
  name: 'addhomework',
  components: {
    newWorkHead,
    newWorkContent
  },
  data () {
    return {
      title: '新建作业题目',
      opeType: 'ADDHomework',
      parTag: true
    }
  },
  created () {
    if (this.$route.params.type === 'EDIT' || window.localStorage.getItem('workContentStatus') === 'EDIT') {
      this.title = '编辑作业题目'
      this.parTag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .container
    width: 100%
    height: 100%
    background: #f4f4f4
</style>
